# Student Application Module

## Overview
Complete multi-step student application form for TNEA admissions with document uploads, validation, and progress tracking.

## Routes Created

### `/student`
Student portal landing page with access to application form.

### `/student/application`
Multi-step application form with 5 sections.

## Components Created

### Reusable Components (Location: `src/components/student/`)

1. **FormInput.tsx**
   - Reusable input component with validation
   - Supports icons, error states, patterns
   - Props: label, name, type, value, onChange, required, error, icon

2. **FileUpload.tsx**
   - Drag-and-drop file upload component
   - File size and type validation
   - Visual feedback for uploaded files
   - Props: label, name, onChange, accept, maxSize, required

3. **FormSection.tsx**
   - Card-based section wrapper
   - Consistent styling with icon support
   - Props: title, description, icon, children

4. **ProgressStepper.tsx**
   - Visual progress indicator
   - Step completion tracking
   - Props: steps, currentStep

## Form Structure

### Step 1: Personal & Contact Information
- Email ID (required)
- Mobile Number (required, 10 digits)
- Aadhaar Number (required, 12 digits)
- Parent Annual Income (required)

### Step 2: Academic Documents
- Class 10th Mark Sheet (PDF/Image, required)
- Class 12th Mark Sheet (PDF/Image, required)
- HSC (+1) Mark Sheet (PDF/Image, optional)
- Transfer Certificate (PDF/Image, required)
- School Name (required)
- Board Name (required)

### Step 3: Eligibility & Reservation Certificates
- Community Certificate (required)
- Nativity Certificate (required)
- First Graduate Certificate (optional)
- First Graduate Declaration (checkbox)

### Step 4: Special Reservation Certificates (All Optional)
- Ex-Servicemen Certificate
- Differently Abled Certificate
- Eminent Sportsperson Certificate
- Sri Lankan Tamil Refugee Certificate

### Step 5: Online Application Details
- Passport-size Photograph (JPG/PNG, max 2MB, required)
- Signature (JPG/PNG, max 1MB, required)
- Payment Mode (required)
- Transaction ID (required)
- Payment Status (Paid/Pending, required)

## Features

### Validation
- Required field validation for each step
- Pattern validation (Aadhaar: 12 digits, Mobile: 10 digits)
- File size validation (configurable per upload)
- File type validation (PDF, JPG, PNG)
- Step-wise validation before proceeding

### State Management
- React useState for form data
- localStorage for data persistence
- Form data preserved across page refreshes
- Note: File objects are not persisted in localStorage

### User Experience
- Multi-step form with visual progress tracking
- "Save & Continue" functionality
- Previous/Next navigation
- Responsive design (mobile, tablet, desktop)
- Loading states for submission
- Error messages and field highlights
- Drag-and-drop file uploads

### Accessibility
- Proper form labels with required indicators
- ARIA-compliant components
- Keyboard navigation support
- Focus management
- Error announcements

## Usage

### Access the Application
1. Start the Next.js development server
2. Navigate to `http://localhost:3000/student`
3. Click "Complete Application" to begin

### Fill the Application
1. Complete all required fields in Step 1
2. Click "Save & Continue" to proceed
3. Repeat for each step
4. On Step 5, click "Submit Application"

### Data Persistence
Form data is automatically saved to localStorage when:
- Navigating between steps
- Submitting the form
- Data persists across browser sessions

## Technical Details

### Dependencies
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Lucide React (icons)

### File Structure
```
apps/web/src/
├── app/
│   └── student/
│       ├── page.tsx              # Student portal landing
│       └── application/
│           └── page.tsx          # Multi-step application form
└── components/
    └── student/
        ├── FormInput.tsx         # Reusable input component
        ├── FileUpload.tsx        # File upload with validation
        ├── FormSection.tsx       # Section card wrapper
        └── ProgressStepper.tsx   # Progress indicator
```

### Mock Backend
Currently uses mock submission (2-second delay). In production:
- Replace mock submission with API call
- Implement actual file upload to server
- Add authentication/authorization
- Store data in database
- Generate application reference number

## Future Enhancements

1. **Authentication**
   - Student login/registration
   - Session management
   - Password recovery

2. **Application Management**
   - View submitted applications
   - Edit draft applications
   - Download application PDF
   - Track application status

3. **Payment Integration**
   - Payment gateway integration
   - Receipt generation
   - Fee calculation based on category

4. **Notifications**
   - Email confirmations
   - SMS alerts
   - Status updates

5. **Admin Panel**
   - Review applications
   - Approve/reject submissions
   - Generate reports

## Testing Checklist

- [x] Form renders correctly
- [x] Validation works for all fields
- [x] File uploads accept/reject correct formats
- [x] Navigation between steps works
- [x] Data persists in localStorage
- [x] Submit button shows loading state
- [x] Responsive design on mobile/tablet
- [x] No TypeScript errors
- [x] No console errors

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes
- File objects cannot be stored in localStorage (browser limitation)
- Users must re-upload files if they refresh before submission
- Maximum file size: 5MB (configurable)
- Accepted formats: PDF, JPG, JPEG, PNG
