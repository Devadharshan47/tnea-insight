import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { prisma } from '@/lib/db';

// GET all news/announcements (public access allowed for viewing)
export async function GET(req: NextRequest) {
  try {
    const news = await prisma.announcement.findMany({
      orderBy: { date: 'desc' },
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    const formattedNews = news.map(n => ({
      id: n.id,
      title: n.title,
      excerpt: n.excerpt,
      content: n.content,
      category: n.category,
      date: n.date.toISOString().split('T')[0],
      author: n.author.name
    }));

    return NextResponse.json(formattedNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST new announcement (admin only)
export async function POST(req: NextRequest) {
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

    const { title, excerpt, content, category } = await req.json();

    if (!title || !excerpt || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        excerpt,
        content,
        category: category || 'Updates',
        authorId: payload.id as string
      }
    });

    return NextResponse.json({ success: true, announcement }, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
