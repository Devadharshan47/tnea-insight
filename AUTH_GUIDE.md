# TNEA Insight - Authentication & Routing Guide

## Overview
Complete role-based authentication system for TNEA Insight application with secure routing and dashboard access control.

## Authentication Flow

### 1. Mock Authentication (localStorage)
All authentication is handled client-side using localStorage. No backend required.

**Storage Key:** `tnea_auth_user`

**Stored Data Structure:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "student" | "admin"
}
```

### 2. Demo Credentials

#### Student Login
- **URL:** `/student/login`
- **Email:** `student@example.com`
- **Password:** `student123`
- **Redirects to:** `/student/dashboard`

#### Admin Login
- **URL:** `/admin/login`
- **Email:** `admin@tnea.gov.in`
- **Password:** `admin123`
- **Redirects to:** `/admin/dashboard`

## Route Protection

### Student Routes Protection
**Protected Routes:** All routes under `/student/dashboard/*`

**Protection Logic:**
1. Check if user is authenticated (localStorage has valid user)
2. Verify user role is `student`
3. If not authenticated → redirect to `/student/login`
4. If admin tries to access → redirect to `/admin/dashboard`

**Implementation:** `apps/web/src/app/student/dashboard/layout.tsx`

### Admin Routes Protection
**Protected Routes:** All routes under `/admin/*` (except `/admin/login`)

**Protection Logic:**
1. Check if user is authenticated
2. Verify user role is `admin`
3. If not authenticated → redirect to `/admin/login`
4. If student tries to access → redirect to `/student/dashboard`

**Implementation:** `apps/web/src/app/admin/layout.tsx`

### Login Page Redirects
Both login pages check if user is already authenticated and redirect to appropriate dashboard:
- Student already logged in → `/student/dashboard`
- Admin already logged in → `/admin/dashboard`
- Cross-role redirect (admin on student login page) → appropriate dashboard

## Student Dashboard Features

### Counselling Process Timeline (8 Steps)
Visual stepper UI showing the complete counselling journey:

1. **Counselling Notification Released** ✓
   - Status: Completed
   - Date: 2024-06-01

2. **Registration Completed** ✓
   - Status: Completed
   - Date: 2024-06-10

3. **Certificate Upload & Verification** ✓
   - Status: Completed
   - Date: 2024-06-20

4. **Rank List Published** ✓
   - Status: Completed
   - Your Rank: 1,245
   - Date: 2024-07-01

5. **Choice Filling** ⏳ (CURRENT)
   - Status: In Progress
   - Period: 2024-07-15 to 2024-07-25
   - Action Button: "Continue Choice Filling →"

6. **Seat Allotment** ⏸️
   - Status: Pending
   - Date: TBA

7. **Fee Payment** ⏸️
   - Status: Pending
   - Date: TBA

8. **Reporting to College** ⏸️
   - Status: Pending
   - Date: TBA

### Student Dashboard Modules
Quick access cards for:
- Application Status
- Certificate Upload Status (Verified ✓)
- Choice Filling Access (Active - 15 choices selected)
- Seat Allotment Result (Awaiting results)
- Post-Allotment Instructions (Fee payment & reporting)
- AI Support for Students & Parents

### Visual Indicators
- **Completed Steps:** Green checkmark icon, green badge
- **Current Step:** Pulsing indigo icon, highlighted card with action button
- **Pending Steps:** Gray icon, gray badge
- **Timeline Connector:** Vertical line connecting all steps

## Admin Dashboard Features

### Counselling Workflow Control Panel
Interactive control panel with 8 workflow management modules:

#### 1. Release Counselling Notification
- **Icon:** Bell
- **Status:** Active
- **Description:** Publish official counselling announcement
- **Color:** Indigo

#### 2. Open / Close Registration
- **Icon:** Users
- **Status:** Active
- **Description:** Control student registration window
- **Color:** Blue

#### 3. Verify Certificates
- **Icon:** Upload
- **Status:** Active
- **Description:** Review and approve student documents
- **Color:** Yellow
- **Current Pending:** 1,248 certificates

#### 4. Publish Rank List
- **Icon:** Award
- **Status:** Active
- **Description:** Release merit list to students
- **Color:** Green

#### 5. Enable / Disable Choice Filling
- **Icon:** List Checks
- **Status:** Active (Current Phase)
- **Description:** Control college preference selection
- **Color:** Purple

#### 6. Run Seat Allotment
- **Icon:** Building
- **Status:** Inactive
- **Description:** Execute automated seat allocation
- **Color:** Pink

#### 7. Monitor Fee Collection
- **Icon:** Dollar Sign
- **Status:** Inactive
- **Description:** Track student fee payments
- **Color:** Orange

#### 8. Reporting Status
- **Icon:** Bar Chart
- **Status:** Inactive
- **Description:** Track student college reporting
- **Color:** Teal

### Admin Dashboard Stats
- **Total Registrations:** 45,234 (+12% from last week)
- **Certificates Pending:** 1,248 (Requires verification)
- **Seats Allotted:** 38,567 (85% of total seats)
- **Pending Applications:** 6,667 (Choice filling ongoing)

### Workflow Control Features
- **Toggle Buttons:** Click to activate/deactivate each workflow step
- **Visual Status:** Green badge for active, gray badge for inactive
- **Real-time State Management:** React useState for instant UI updates
- **Color-coded Cards:** Each workflow step has unique color theme

## Technical Implementation

### File Structure
```
apps/web/src/
├── lib/
│   └── auth.ts                    # Auth utilities and mock users
├── contexts/
│   └── AuthContext.tsx            # Global auth state management
├── app/
│   ├── admin/
│   │   ├── layout.tsx             # Admin route protection
│   │   ├── login/
│   │   │   └── page.tsx           # Admin login page
│   │   └── dashboard/
│   │       └── page.tsx           # Admin dashboard with workflow control
│   └── student/
│       ├── login/
│       │   └── page.tsx           # Student login page
│       └── dashboard/
│           ├── layout.tsx         # Student route protection
│           └── page.tsx           # Student dashboard with timeline
```

### Key Components

#### Auth Utilities (`lib/auth.ts`)
```typescript
export const authUtils = {
  login(user: AuthUser): void
  logout(): void
  getCurrentUser(): AuthUser | null
  isAuthenticated(): boolean
  hasRole(role: UserRole): boolean
  getRedirectPath(role: UserRole): string
}
```

#### Auth Context (`contexts/AuthContext.tsx`)
Provides:
- `user`: Current authenticated user or null
- `login(user)`: Login and redirect to dashboard
- `logout()`: Clear auth and redirect to home
- `isAuthenticated`: Boolean authentication status

#### Route Protection Pattern
```typescript
useEffect(() => {
  const currentUser = JSON.parse(localStorage.getItem('tnea_auth_user') || 'null');
  
  // Not authenticated → redirect to login
  if (!currentUser) {
    router.push('/[role]/login');
    return;
  }
  
  // Wrong role → redirect to correct dashboard
  if (currentUser.role !== '[expected-role]') {
    router.push('/[correct-role]/dashboard');
    return;
  }
  
  setIsAuthorized(true);
}, [router]);
```

## State Persistence

### Login State Persists On:
- Page refresh
- Browser close/reopen (localStorage persists)
- Navigation between pages

### Logout Clears:
- localStorage auth data
- Auth context state
- Redirects to homepage

## Security Notes

⚠️ **Important:** This is a MOCK authentication system for demonstration purposes.

**Current Implementation:**
- Client-side only (localStorage)
- No encryption
- No session management
- No password hashing

**For Production, Implement:**
- Server-side authentication
- JWT tokens or session cookies
- Password hashing (bcrypt)
- HTTPS only
- CSRF protection
- Rate limiting on login attempts
- Secure cookie flags (httpOnly, secure, sameSite)

## Testing the Flow

### Test Student Login Flow
1. Visit `http://localhost:3001/student/login`
2. Enter credentials: `student@example.com` / `student123`
3. Should redirect to `/student/dashboard`
4. Verify counselling timeline shows 8 steps
5. Verify current step (Choice Filling) is highlighted
6. Try accessing `/admin/dashboard` → should redirect back to `/student/dashboard`

### Test Admin Login Flow
1. Visit `http://localhost:3001/admin/login`
2. Enter credentials: `admin@tnea.gov.in` / `admin123`
3. Should redirect to `/admin/dashboard`
4. Verify workflow control panel shows 8 workflow items
5. Click toggle buttons to activate/deactivate workflow steps
6. Try accessing `/student/dashboard` → should redirect to `/admin/dashboard`

### Test Route Protection
1. Logout (click logout button in sidebar)
2. Try accessing `/student/dashboard` directly → redirects to `/student/login`
3. Try accessing `/admin/dashboard` directly → redirects to `/admin/login`
4. Login as student, try `/admin/dashboard` → redirects to student dashboard
5. Login as admin, try `/student/dashboard` → redirects to admin dashboard

### Test Login Page Redirects
1. Login as student
2. Visit `/student/login` again → auto-redirects to `/student/dashboard`
3. Logout and login as admin
4. Visit `/admin/login` again → auto-redirects to `/admin/dashboard`

## UI Features

### Loading States
- Auth context shows spinner while checking authentication
- Route protection shows spinner while validating user
- Login pages show loading state during authentication

### Responsive Design
- All dashboards are mobile-responsive
- Sidebar collapses on mobile
- Cards stack vertically on small screens
- Timeline adapts to mobile layout

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Focus states on interactive elements

## Troubleshooting

### Issue: Redirects not working
**Solution:** Check browser console for errors. Ensure `useRouter` from `next/navigation` is imported.

### Issue: Auth state not persisting
**Solution:** Check localStorage in browser DevTools. Key should be `tnea_auth_user`.

### Issue: Infinite redirect loop
**Solution:** Clear localStorage and refresh. Ensure route protection logic has proper conditions.

### Issue: TypeScript errors
**Solution:** Ensure all type assertions use `as keyof typeof` for dynamic object access.

## Future Enhancements

### Recommended Additions
1. **Remember Me** functionality
2. **Password reset** flow
3. **Email verification** simulation
4. **Multi-factor authentication** UI
5. **Session timeout** handling
6. **Audit log** for admin actions
7. **Role-based permissions** (beyond student/admin)
8. **JWT token** implementation
9. **Refresh token** mechanism
10. **OAuth integration** (Google, Microsoft)

---

**Last Updated:** December 23, 2025  
**Version:** 1.0.0  
**Author:** TNEA Development Team
