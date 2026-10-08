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

    // Get the student profile from DB
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      include: {
        studentProfile: {
          include: {
            certificates: true,
            choices: {
              include: {
                branch: {
                  include: {
                    college: true
                  }
                }
              },
              orderBy: {
                preferenceOrder: 'asc'
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If profile doesn't exist, create a default one
    let profile: any = user.studentProfile;
    if (!profile) {
      profile = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          applicationStatus: 'REGISTERED'
        },
        include: {
          certificates: true,
          choices: true
        }
      });
    }

    return NextResponse.json({ profile, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
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

    const data = await req.json();

    const profile = await prisma.studentProfile.upsert({
      where: {
        userId: payload.id as string
      },
      update: {
        phone: data.phone,
        category: data.category,
        board: data.board,
        percentage: data.percentage,
        district: data.district,
        applicationStatus: data.applicationStatus
      },
      create: {
        userId: payload.id as string,
        phone: data.phone,
        category: data.category,
        board: data.board,
        percentage: data.percentage,
        district: data.district,
        applicationStatus: data.applicationStatus || 'REGISTERED'
      }
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error updating student profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
