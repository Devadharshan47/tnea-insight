import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { prisma } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const { status } = await req.json(); // Expected 'APPROVED', 'REJECTED', 'PENDING'

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedCert = await prisma.certificate.update({
      where: { id },
      data: { status }
    });
    
    // Auto-update student profile status if all certs are verified
    if (status === 'APPROVED' || status === 'REJECTED') {
      const allCerts = await prisma.certificate.findMany({
          where: { studentProfileId: updatedCert.studentProfileId }
      });
      
      const allApproved = allCerts.every(c => c.status === 'APPROVED');
      const anyRejected = allCerts.some(c => c.status === 'REJECTED');
      
      let profileStatus = 'REGISTERED';
      if (allApproved && allCerts.length > 0) profileStatus = 'VERIFIED';
      if (anyRejected) profileStatus = 'REGISTERED';
      
      await prisma.studentProfile.update({
          where: { id: updatedCert.studentProfileId },
          data: { applicationStatus: profileStatus }
      });
    }

    return NextResponse.json({ success: true, certificate: updatedCert });
  } catch (error) {
    console.error('Error updating certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
