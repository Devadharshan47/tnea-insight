import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('tnea_auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the actual student profile for context
    let cutoff = 190;
    let community = 'BC';
    let district = 'Chennai';
    try {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: payload.id as string }
      });
      if (profile) {
        cutoff = profile.percentage || 190;
        community = profile.category || 'BC';
        district = profile.district || 'Chennai';
      }
    } catch {
      // Profile not found, use defaults
    }

    const { message, language } = await req.json();
    const text = message.toLowerCase();
    
    let responseText = '';

    // Intent: Cutoff / Suggest Colleges
    if (text.includes('cutoff') || text.includes('colleges') || text.includes('suggest') || text.includes('கல்லூரி')) {
      try {
        const mlRes = await fetch('http://localhost:8000/api/cutoff/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cutoff,
                community,
                limit: 3
            })
        });
        if (mlRes.ok) {
            const data = await mlRes.json();
            const topColleges = [...data.safeColleges, ...data.moderateColleges, ...data.dreamColleges].slice(0, 3);
            const collegeNames = topColleges.map(c => c.collegeName).join(', ');
            
            responseText = language === 'TA' 
            ? `உங்கள் ${community} கட்-ஆஃப் ${cutoff} அடிப்படையில், ${collegeNames} போன்ற கல்லூரிகளில் உங்களுக்கு அதிக வாய்ப்பு உள்ளது.` 
            : `Based on your ${community} cutoff of ${cutoff}, you have strong chances in colleges like: ${collegeNames}.`;
        } else {
            throw new Error("ML fetch failed");
        }
      } catch (err) {
        responseText = language === 'TA' 
        ? `உங்கள் ${community} கட்-ஆஃப் ${cutoff} அடிப்படையில், ${district} மற்றும் கோயம்புத்தூரில் உள்ள தன்னாட்சி கல்லூரிகளில் உங்களுக்கு அதிக வாய்ப்பு உள்ளது.` 
        : `If your ${community} cutoff is ${cutoff}, you may have strong chances in autonomous colleges in ${district} and Coimbatore.`;
      }
    } 
    // Intent: Choice filling
    else if (text.includes('choice filling') || text.includes('help') || text.includes('தேர்வு')) {
      responseText = language === 'TA'
        ? `கல்லூரி தேர்வில், உங்களுக்கு விருப்பமான கல்லூரிகளை முதலில் பதிவு செய்யுங்கள். சிறந்த வாய்ப்புகளுக்கு குறைந்தது 50 கல்லூரிகளை தேர்வு செய்யவும்.`
        : `For choice filling, always prioritize your dream colleges at the top, regardless of your cutoff. Make sure to fill at least 50 choices to ensure safety.`;
    }
    // Intent: Reservation
    else if (text.includes('reservation') || text.includes('quota') || text.includes('ஒதுக்கீடு')) {
      responseText = language === 'TA'
        ? `தமிழ்நாட்டில் ${community} மாணவர்களுக்கு குறிப்பிட்ட இட ஒதுக்கீடு உள்ளது.`
        : `In Tamil Nadu, the ${community} category has a specific reservation quota in engineering admissions.`;
    }
    // Intent: Branch
    else if (text.includes('cse') || text.includes('computer science') || text.includes('கம்ப்யூட்டர்')) {
      responseText = language === 'TA'
        ? `கம்ப்யூட்டர் சயின்ஸ் (CSE) படிக்க சிறந்த கல்லூரிகள் அண்ணா பல்கலைக்கழகம், PSG மற்றும் SSN ஆகும்.`
        : `Top colleges for CSE include CEG, MIT, PSG Tech, and SSN. Given your ${cutoff} cutoff, you should aim for tier-1 institutions.`;
    }
    // Intent: Fees
    else if (text.includes('low fees') || text.includes('government') || text.includes('கட்டணம்')) {
      responseText = language === 'TA'
        ? `அரசு கல்லூரிகளில் கல்விக் கட்டணம் மிகக் குறைவு. உங்கள் மாவட்டத்தில் (${district}) உள்ள அரசு பொறியியல் கல்லூரிகளை நான் பரிந்துரைக்கிறேன்.`
        : `Government colleges have the lowest fee structure (around ₹10k - ₹15k per year). I recommend checking out Government College of Technology (GCT) or university departments.`;
    }
    // Default
    else {
      responseText = language === 'TA' 
      ? `மன்னிக்கவும், எனக்கு புரியவில்லை. கட்-ஆஃப், கல்லூரி தேடல் அல்லது கட்டணம் பற்றி கேளுங்கள்.` 
      : `I'm an AI assistant focused on TNEA counselling. Please ask me about cutoffs, colleges, choice filling, or fee structures.`;
    }

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error('Error generating AI chat response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
