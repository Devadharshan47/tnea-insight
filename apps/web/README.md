# TNEA Insight - Engineering College Portal

A modern, responsive web portal for Tamil Nadu Engineering Admissions (TNEA) that helps students find and compare engineering colleges, check cutoffs, and stay updated with admission news.

## 🚀 Features

### Core Functionality
- **College Search & Comparison**: Browse and compare engineering colleges in Tamil Nadu
- **Cutoff Analysis**: View previous year cutoffs and predict admission chances
- **Exam Information**: Complete details about TNEA and other engineering entrance exams
- **News & Updates**: Latest TNEA news, notifications, and important announcements
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Key Pages
- **Homepage**: Search functionality, featured colleges, latest news, and quick actions
- **Colleges**: Comprehensive list with filtering by location, course, and college type
- **Cutoffs**: Detailed cutoff analysis with trends and statistics
- **Exams**: Information about TNEA and other engineering entrance examinations
- **News**: Latest updates and announcements related to TNEA admissions

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Language**: TypeScript
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tnea-insight/apps/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── colleges/          # Colleges listing page
│   ├── cutoffs/           # Cutoff analysis page
│   ├── exams/             # Exam information page
│   └── news/              # News and updates page
├── data/                  # Sample data and interfaces
│   └── sampleData.ts      # Mock data for colleges, cutoffs, news, etc.
└── globals.css            # Global styles
```

## 🎨 Design Features

### Modern UI/UX
- Clean, professional design inspired by modern education portals
- Gradient backgrounds and smooth transitions
- Responsive grid layouts
- Interactive hover effects
- Consistent color scheme (Indigo/Purple theme)

### Components
- **Header**: Navigation with active state indicators
- **Search Bars**: Advanced filtering and search functionality
- **Cards**: College and news cards with hover effects
- **Tables**: Responsive data tables for cutoffs
- **Stats Cards**: Visual statistics and metrics
- **Call-to-Action**: Engaging buttons and forms

## 📊 Sample Data

The application includes comprehensive sample data:

### Colleges (10 institutions)
- Anna University, PSG College of Technology, VIT University, etc.
- Complete details: ratings, cutoffs, fees, courses, facilities
- NIRF rankings and placement statistics

### Cutoff Data
- Previous year cutoffs for major courses
- Opening and closing ranks
- Category-wise analysis

### News & Updates
- Latest TNEA announcements
- Admission process updates
- Placement and ranking news

### Exam Information
- TNEA, JEE Main, JEE Advanced, BITSAT details
- Important dates and deadlines
- Eligibility criteria

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌟 Key Features

### For Students
- **College Discovery**: Find the perfect engineering college
- **Cutoff Prediction**: Analyze admission chances
- **Application Tracking**: Stay updated with deadlines
- **News & Alerts**: Never miss important updates

### For Parents
- **College Comparison**: Compare fees, facilities, and placements
- **Admission Guidance**: Complete TNEA process information
- **Deadline Tracking**: Important dates and reminders

## 🎯 Future Enhancements

- [ ] User authentication and profiles
- [ ] College comparison tool
- [ ] Cutoff prediction calculator
- [ ] Application tracking dashboard
- [ ] Admin panel for content management
- [ ] Real-time notifications
- [ ] Mobile app version
- [ ] Integration with official TNEA API

## 📱 Responsive Design

The portal is fully responsive and optimized for:
- **Desktop**: Full-featured experience with all navigation options
- **Tablet**: Optimized layouts with touch-friendly interactions
- **Mobile**: Streamlined navigation and mobile-first design

## 🎨 Color Scheme

- **Primary**: Indigo (#4F46E5)
- **Secondary**: Purple (#7C3AED)
- **Accent**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Background**: Gray gradients and white

## 📄 License

This project is created for educational purposes and demonstration of modern web development practices.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For support or questions, please open an issue in the repository.

---

**TNEA Insight** - Your trusted partner for TNEA admissions and college selection. 🎓
