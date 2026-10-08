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
    // Ensure admin access
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all student profiles with their certificates
    const students = await prisma.studentProfile.findMany({
      include: {
        user: true,
        certificates: true
      },
      orderBy: {
        applicationStatus: 'asc' // Prioritize based on status
      }
    });

    // Format for the admin dashboard
    const formattedStudents = students.map((profile, index) => {
      const verifiedCount = profile.certificates.filter(c => c.status === 'APPROVED').length;
      const totalCount = profile.certificates.length || 1; // Prevent division by zero
      const verificationPercent = profile.certificates.length > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

      let status = 'Pending';
      if (verificationPercent === 100 && profile.certificates.length > 0) status = 'Verified';
      if (profile.certificates.some(c => c.status === 'REJECTED')) status = 'Rejected';

      return {
        id: profile.id,
        name: profile.user.name,
        appNo: `APP2025${String(index + 1).padStart(4, '0')}`, // Mock Application Number
        rank: index + 100, // Mock Rank
        cutoff: profile.percentage || 190.0,
        community: profile.category || 'Unknown',
        district: profile.district || 'Unknown',
        verificationPercent,
        status,
        documents: profile.certificates.map((cert, i) => ({
          id: cert.id,
          name: cert.type,
          status: cert.status === 'APPROVED' ? 'Verified' : cert.status === 'PENDING' ? 'Pending' : 'Rejected',
          hash: `hash_${cert.id}_${i}`,
          authenticity: cert.status === 'APPROVED' ? 98 : cert.status === 'REJECTED' ? 24 : 0,
          duplicateRisk: cert.status === 'REJECTED' ? 89 : 2,
          ocr: {
            Name: profile.user.name,
            Type: cert.type,
            Status: cert.status
          }
        }))
      };
    });

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error('Error fetching admin certificates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
