import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/auth';
import { signJwt } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();
    const normalizedEmail = email.toLowerCase();
    
    let authenticatedUser = null;

    // Check against mock admin
    if (normalizedEmail === mockUsers.admin.email.toLowerCase() && password === mockUsers.admin.password) {
      // Ensure admin exists in DB
      const dbUser = await prisma.user.upsert({
        where: { email: normalizedEmail },
        update: {},
        create: {
          id: mockUsers.admin.id,
          name: mockUsers.admin.name,
          email: normalizedEmail,
          password: password,
          role: 'ADMIN'
        }
      });
      
      authenticatedUser = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: 'admin',
      };
    } 
    // Check against mock student
    else if (normalizedEmail === mockUsers.student.email.toLowerCase() && password === mockUsers.student.password) {
      // Ensure student exists in DB
      const dbUser = await prisma.user.upsert({
        where: { email: normalizedEmail },
        update: {},
        create: {
          id: mockUsers.student.id,
          name: mockUsers.student.name,
          email: normalizedEmail,
          password: password,
          role: 'STUDENT'
        }
      });

      authenticatedUser = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: 'student',
      };
    } else {
      // Real database check for other registered users
      const dbUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      // In a real app, you would hash and check the password here.
      // For this demo, we'll just allow login if the user exists and role matches.
      if (dbUser && dbUser.role.toLowerCase() === (role || 'student').toLowerCase()) {
         authenticatedUser = {
           id: dbUser.id,
           email: dbUser.email,
           name: dbUser.name,
           role: dbUser.role.toLowerCase(),
         };
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT
    const token = await signJwt(authenticatedUser);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('tnea_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return NextResponse.json({ user: authenticatedUser });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
