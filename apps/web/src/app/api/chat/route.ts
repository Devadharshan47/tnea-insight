import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, language } = await req.json();
    const text = message.toLowerCase();

    let reply = '';

    // Intent: Cutoff / Suggest Colleges
    if (text.includes('cutoff') || text.includes('colleges') || text.includes('suggest') || text.includes('கல்லூரி')) {
      try {
        const mlRes = await fetch('http://localhost:8000/api/cutoff/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cutoff: 190, community: 'BC', limit: 3 })
        });
        if (mlRes.ok) {
          const data = await mlRes.json();
          const topColleges = [...data.safeColleges, ...data.moderateColleges, ...data.dreamColleges].slice(0, 3);
          const collegeNames = topColleges.map((c: any) => c.collegeName).join(', ');
          reply = language === 'TA'
            ? `BC கட்-ஆஃப் 190 அடிப்படையில், ${collegeNames} போன்ற கல்லூரிகளில் உங்களுக்கு அதிக வாய்ப்பு உள்ளது.`
            : `Based on a BC cutoff of 190, you have strong chances in colleges like: ${collegeNames}.`;
        } else {
          throw new Error('ML service unavailable');
        }
      } catch {
        reply = language === 'TA'
          ? `சென்னை மற்றும் கோயம்புத்தூரில் உள்ள தன்னாட்சி கல்லூரிகளில் உங்களுக்கு அதிக வாய்ப்பு உள்ளது.`
          : `You may have strong chances in autonomous colleges in Chennai and Coimbatore. Try the AI Cutoff Predictor for detailed results.`;
      }
    }
    // Intent: Choice filling
    else if (text.includes('choice filling') || text.includes('help') || text.includes('choice') || text.includes('தேர்வு')) {
      reply = language === 'TA'
        ? `கல்லூரி தேர்வில், உங்களுக்கு விருப்பமான கல்லூரிகளை முதலில் பதிவு செய்யுங்கள். சிறந்த வாய்ப்புகளுக்கு குறைந்தது 50 கல்லூரிகளை தேர்வு செய்யவும்.`
        : `For choice filling, always prioritize your dream colleges at the top, regardless of your cutoff. Make sure to fill at least 50 choices to ensure safety. Use the Smart Choice Filling feature for AI-powered recommendations.`;
    }
    // Intent: Reservation
    else if (text.includes('reservation') || text.includes('quota') || text.includes('ஒதுக்கீடு')) {
      reply = language === 'TA'
        ? `தமிழ்நாட்டில் BC, MBC, SC, ST மாணவர்களுக்கு குறிப்பிட்ட இட ஒதுக்கீடு உள்ளது. OC - 31%, BC - 26.5%, BCM - 3.5%, MBC - 20%, SC - 18%, ST - 1%.`
        : `Tamil Nadu reservation quotas: OC - 31%, BC - 26.5%, BCM - 3.5%, MBC - 20%, SC - 18%, ST - 1%. Your category-specific cutoff determines admission probability.`;
    }
    // Intent: Branch
    else if (text.includes('cse') || text.includes('computer science') || text.includes('branch') || text.includes('கம்ப்யூட்டர்')) {
      reply = language === 'TA'
        ? `கம்ப்யூட்டர் சயின்ஸ் (CSE) படிக்க சிறந்த கல்லூரிகள் அண்ணா பல்கலைக்கழகம், PSG மற்றும் SSN ஆகும்.`
        : `Top colleges for CSE include CEG (Anna University), MIT, PSG Tech, SSN, and Rajalakshmi. Use our AI Cutoff Predictor to see your admission probability for each.`;
    }
    // Intent: Fees
    else if (text.includes('fee') || text.includes('government') || text.includes('கட்டணம்')) {
      reply = language === 'TA'
        ? `அரசு கல்லூரிகளில் கல்விக் கட்டணம் மிகக் குறைவு (ஆண்டுக்கு ₹10k - ₹15k). தனியார் கல்லூரிகளில் ₹50k - ₹1.5L வரை.`
        : `Government colleges have the lowest fees (₹10k-15k/year). Self-financing colleges range from ₹50k to ₹1.5L/year. Aided colleges fall in between.`;
    }
    // Intent: Counselling process
    else if (text.includes('counselling') || text.includes('process') || text.includes('step') || text.includes('how')) {
      reply = language === 'TA'
        ? `TNEA ஆலோசனை செயல்முறை: 1. அறிவிப்பு → 2. பதிவு → 3. சான்றிதழ் சரிபார்ப்பு → 4. ரேங்க் பட்டியல் → 5. கல்லூரி தேர்வு → 6. இடப் பகிர்வு → 7. கட்டணம் → 8. அனுமதி.`
        : `TNEA counselling process: 1. Notification → 2. Registration → 3. Certificate Verification → 4. Rank List → 5. Choice Filling → 6. Seat Allotment → 7. Fee Payment → 8. Reporting. Track your progress on the Dashboard.`;
    }
    // Default
    else {
      reply = language === 'TA'
        ? `வணக்கம்! நான் உங்கள் TNEA உதவியாளர். கட்-ஆஃப், கல்லூரி தேடல், choice filling, கட்டணம், அல்லது ஆலோசனை செயல்முறை பற்றி கேளுங்கள்.`
        : `Hi! I'm your TNEA AI Assistant. I can help with: cutoff predictions, college suggestions, choice filling strategy, fee information, reservation quotas, and the counselling process. What would you like to know?`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { reply: 'Sorry, I encountered an error. Please try again.' },
      { status: 200 } // Return 200 with error message so the UI handles it gracefully
    );
  }
}
