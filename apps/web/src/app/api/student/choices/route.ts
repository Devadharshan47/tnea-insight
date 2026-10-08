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
    if (!payload || payload.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: payload.id as string },
      include: {
        choices: {
          include: {
            branch: {
              include: { college: true }
            }
          },
          orderBy: { preferenceOrder: 'asc' }
        }
      }
    });

    return NextResponse.json({ choices: profile?.choices || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('tnea_auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { choices } = await req.json(); // Array of { branchId, preferenceOrder }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: payload.id as string }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Delete existing choices
    await prisma.choice.deleteMany({
      where: { studentProfileId: profile.id }
    });

    // Create new choices
    if (choices && choices.length > 0) {
      await prisma.choice.createMany({
        data: choices.map((c: any) => ({
          studentProfileId: profile.id,
          branchId: c.branchId,
          preferenceOrder: c.preferenceOrder
        }))
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving choices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
