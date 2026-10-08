import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('tnea_auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    // 1. Total Registrations
    const totalRegistrations = await prisma.studentProfile.count();

    // 2. Certificates Pending vs Verified
    const pendingCerts = await prisma.certificate.count({ where: { status: 'PENDING' } });
    const verifiedCerts = await prisma.certificate.count({ where: { status: 'APPROVED' } });

    // 3. Seats Allotted (using applicationStatus 'ALLOTTED')
    const seatsAllotted = await prisma.studentProfile.count({ where: { applicationStatus: 'ALLOTTED' } });

    // 4. Choice Filling (using applicationStatus 'CHOICES_FILLED')
    const choiceFilling = await prisma.studentProfile.count({ where: { applicationStatus: 'CHOICES_FILLED' } });

    // 5. Rank Distribution
    const profiles = await prisma.studentProfile.findMany({ select: { percentage: true } });
    const rankDistribution = [
      { score: '190-200', count: profiles.filter(p => p.percentage && p.percentage >= 190).length },
      { score: '180-189', count: profiles.filter(p => p.percentage && p.percentage >= 180 && p.percentage < 190).length },
      { score: '170-179', count: profiles.filter(p => p.percentage && p.percentage >= 170 && p.percentage < 180).length },
      { score: '160-169', count: profiles.filter(p => p.percentage && p.percentage >= 160 && p.percentage < 170).length },
      { score: '150-159', count: profiles.filter(p => p.percentage && p.percentage >= 150 && p.percentage < 160).length },
      { score: '<150', count: profiles.filter(p => p.percentage && p.percentage < 150).length }
    ];

    // 6. District Saturation
    const districtGroups = await prisma.studentProfile.groupBy({
        by: ['district'],
        _count: { district: true }
    });
    
    // Convert and sort top 5 districts
    const districtSaturation = districtGroups
        .filter(d => d.district !== null)
        .map(d => ({
            name: d.district as string,
            value: d._count.district
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // Default mock data if empty
    if (districtSaturation.length === 0) {
        districtSaturation.push(
            { name: 'Chennai', value: 85 },
            { name: 'Coimbatore', value: 72 },
            { name: 'Madurai', value: 64 },
            { name: 'Trichy', value: 58 },
            { name: 'Salem', value: 51 }
        );
    }
    
    // Give some mock numbers to the rank distribution if 0 for visual purposes
    if (profiles.length === 0) {
        rankDistribution[0].count = 450;
        rankDistribution[1].count = 2100;
        rankDistribution[2].count = 5800;
        rankDistribution[3].count = 12400;
        rankDistribution[4].count = 24000;
        rankDistribution[5].count = 31000;
    }

    return NextResponse.json({
        totalRegistrations,
        pendingCerts,
        verifiedCerts,
        seatsAllotted,
        choiceFilling,
        rankDistribution,
        districtSaturation
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
