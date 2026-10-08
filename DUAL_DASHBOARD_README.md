# TNEA Insight - Dual Dashboard System

Complete counselling management system with separate portals for administrators and students.

## 🚀 Features

### Admin Portal (`/admin/login`)
**Demo Credentials:**
- Email: `admin@tnea.gov.in`
- Password: `admin123`

**Modules:**
1. **Dashboard** - Overview statistics and recent activities
2. **Counselling Management** - Control workflow, phases, and notifications
3. **Certificate Verification** - Approve/reject student certificates
4. **Choice Filling Management** - Monitor and control choice filling process
5. **Seat Allotment** - Run allotment algorithm and publish results
6. **Fee Collection** - Track payment status
7. **Reports & Analytics** - Generate counselling reports

### Student Portal (`/student/login`)
**Demo Credentials:**
- Email: `student@example.com`
- Password: `student123`

**Modules:**
1. **Dashboard** - Application status and quick actions
2. **Explore Colleges** - Browse engineering colleges
3. **Past Data** - View historical cutoff trends
4. **Cutoff Prediction** - Predict eligible colleges by rank
5. **Apply for Counselling** - Complete registration
6. **Rank List** - Search official rank list
7. **Choice Filling** - Select up to 50 college preferences (drag & drop)
8. **Seat Allotment** - View allotment results
9. **Fee Payment** - Complete fee transactions
10. **AI Support** - Chat with AI for counselling guidance

## 🛠️ Tech Stack
- **Framework:** Next.js 15.5.2 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Authentication:** Mock (localStorage-based)
- **State:** React Context API

## 📦 Installation

```bash
# Navigate to web app
cd apps/web

# Install dependencies
npm install

# Run development server
npm run dev
```

Access at `http://localhost:3000`

## 🔐 Authentication System

### Files:
- `src/lib/auth.ts` - Core auth utilities
- `src/contexts/AuthContext.tsx` - Global auth state
- `src/app/admin/login/page.tsx` - Admin login
- `src/app/student/login/page.tsx` - Student login

### Mock Users:
```typescript
// Admin
{ email: 'admin@tnea.gov.in', password: 'admin123', role: 'admin' }

// Student
{ email: 'student@example.com', password: 'student123', role: 'student' }
```

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── counselling/page.tsx
│   │   ├── certificates/page.tsx
│   │   ├── choice-filling/page.tsx
│   │   ├── allotment/page.tsx
│   │   ├── fees/page.tsx
│   │   └── reports/page.tsx
│   ├── student/
│   │   ├── login/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── colleges/page.tsx
│   │   ├── past-data/page.tsx
│   │   ├── cutoff-prediction/page.tsx
│   │   ├── apply/page.tsx
│   │   ├── rank-list/page.tsx
│   │   ├── choice-filling/page.tsx
│   │   ├── allotment/page.tsx
│   │   ├── fees/page.tsx
│   │   └── ai-support/page.tsx
│   └── layout.tsx (with AuthProvider)
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   └── auth.ts
└── components/
    └── AuthProvider.tsx
```

## 🎨 Design System
- **Primary Color:** Indigo (#4F46E5)
- **Layout:** Sidebar navigation with responsive mobile menu
- **Cards:** White cards with shadow-md on gray-50 background
- **Icons:** Lucide React 5px size standard
- **Typography:** Geist Sans font family

## 🔄 Key Features Implementation

### Admin - Counselling Management
- Phase timeline visualization (6 phases)
- Release notifications to students
- Toggle registration open/closed
- Enable/disable choice filling
- View recent activities feed

### Admin - Certificate Verification
- Filter by status (Pending/Verified/Rejected)
- Approve certificates individually
- Reject with automated notification
- Mock certificate data with student details

### Admin - Seat Allotment
- Run allotment algorithm (mock 3-second processing)
- Category-wise statistics (General/OBC/SC/ST)
- Publish results to students
- Allotment history tracking

### Student - Choice Filling
- Drag & drop college reordering
- Maximum 50 choices
- Save progress to localStorage
- Lock choices (prevents further editing)
- Move up/down, remove colleges

### Student - Cutoff Prediction
- Input rank and select category
- Mock prediction algorithm
- Shows eligible colleges with probability (High/Medium/Low)
- Previous year cutoff comparison

### Student - AI Support
- Chat interface with conversation history
- Quick question buttons
- Keyword-based mock responses
- Topics: cutoff, choice filling, documents, fees, counselling

## 💾 Data Persistence
All data stored in `localStorage` (mock implementation):
- Authentication state: `tnea_auth_user`
- Choice filling: `tnea_choice_filling`
- Application data: Various keys per form section

## 🚦 Route Protection
Both admin and student routes check authentication on mount:
```typescript
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('tnea_auth_user') || 'null');
  if (!user || user.role !== 'student') {
    window.location.href = '/student/login';
  }
}, []);
```

## 🎯 Usage Guide

### For Students:
1. Visit `/student/login`
2. Login with demo credentials
3. Complete application (if needed)
4. Check rank list
5. Predict eligible colleges
6. Fill college choices (drag & drop)
7. Lock choices before deadline
8. View allotment result
9. Pay fees
10. Chat with AI for queries

### For Admin:
1. Visit `/admin/login`
2. Login with admin credentials
3. Monitor dashboard statistics
4. Manage counselling phases
5. Verify student certificates
6. Enable choice filling
7. Run seat allotment algorithm
8. Publish results
9. Generate reports

## 📝 Notes
- **Mock Data:** All data is hardcoded for demonstration
- **No Backend:** Purely frontend with localStorage
- **Responsive:** Mobile-friendly sidebar navigation
- **Production Ready:** Add real API integration for production

## 🔧 Next Steps for Production
1. Replace mock auth with JWT/OAuth
2. Integrate with TNEA backend APIs
3. Add database for persistent storage
4. Implement real-time notifications
5. Add PDF generation for certificates
6. Integrate payment gateway
7. Add comprehensive validation
8. Implement middleware route protection
9. Add audit logging
10. Deploy to production environment

## 📄 License
This is a demonstration project for TNEA counselling system.
