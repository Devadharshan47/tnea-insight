import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const colleges = await prisma.college.findMany({
      include: {
        branches: true
      }
    });

    // Map to frontend expected format
    const formattedColleges = colleges.map(c => ({
      id: c.id,
      name: c.name,
      location: c.district,
      type: c.type,
      rating: c.naacGrade ? `NAAC ${c.naacGrade}` : 'Not Rated',
      cutoff: '190.5', // Mock for now, could be derived from cutoffs table
      fees: c.fees ? c.fees / 100000 : 1.2, // Convert to Lakhs, fallback to 1.2L
      placement: 90, // Mock for now
      courses: c.branches.map(b => b.name)
    }));

    return NextResponse.json(formattedColleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
