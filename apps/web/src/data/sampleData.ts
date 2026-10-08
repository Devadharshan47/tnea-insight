// Sample data for TNEA Insight Web Portal

export interface College {
  id: number;
  name: string;
  location: string;
  rating: number;
  type: string;
  cutoff: string;
  fees: string;
  students: string;
  courses: string[];
  placement: number;
  description: string;
  established: number;
  nirfRank?: number;
  facilities: string[];
  image?: string;
}

export interface CutoffData {
  id: number;
  collegeId: number;
  collegeName: string;
  course: string;
  year: number;
  category: string;
  openingRank: number;
  closingRank: number;
  cutoffPercentage: number;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image?: string;
}

export interface ExamInfo {
  id: number;
  name: string;
  description: string;
  date: string;
  registrationDeadline: string;
  eligibility: string;
  website: string;
}

// Sample Colleges Data
export const colleges: College[] = [
  {
    id: 1,
    name: "Anna University",
    location: "Chennai",
    rating: 4.8,
    type: "Government",
    cutoff: "95-98%",
    fees: "2.5",
    students: "50,000+",
    courses: ["CSE", "ECE", "ME", "CE", "IT", "AI"],
    placement: 85,
    description: "Anna University is a premier technical university in Tamil Nadu, established in 1978. It offers world-class engineering education with state-of-the-art facilities and excellent placement opportunities.",
    established: 1978,
    nirfRank: 12,
    facilities: ["Library", "Hostel", "Sports Complex", "Research Labs", "WiFi Campus", "Cafeteria"]
  },
  {
    id: 2,
    name: "PSG College of Technology",
    location: "Coimbatore",
    rating: 4.7,
    type: "Private",
    cutoff: "92-96%",
    fees: "4.2",
    students: "15,000+",
    courses: ["CSE", "ECE", "ME", "CE", "IT", "AI", "DS"],
    placement: 90,
    description: "PSG College of Technology is one of the most prestigious engineering colleges in Tamil Nadu, known for its excellent academic standards and industry connections.",
    established: 1951,
    nirfRank: 45,
    facilities: ["Central Library", "Hostels", "Sports Ground", "Innovation Center", "Industry Labs"]
  },
  {
    id: 3,
    name: "Thiagarajar College of Engineering",
    location: "Madurai",
    rating: 4.6,
    type: "Private",
    cutoff: "90-94%",
    fees: "3.8",
    students: "8,000+",
    courses: ["CSE", "ECE", "ME", "CE", "IT"],
    placement: 88,
    description: "Thiagarajar College of Engineering is a leading engineering institution in Madurai, offering quality education and excellent placement opportunities.",
    established: 1957,
    nirfRank: 78,
    facilities: ["Digital Library", "Hostels", "Sports Complex", "Research Center", "Auditorium"]
  },
  {
    id: 4,
    name: "SRM Institute of Technology",
    location: "Chennai",
    rating: 4.5,
    type: "Private",
    cutoff: "88-92%",
    fees: "5.5",
    students: "25,000+",
    courses: ["CSE", "ECE", "ME", "CE", "IT", "AI", "DS", "Robotics"],
    placement: 92,
    description: "SRM Institute of Technology is a premier private engineering college with modern infrastructure and strong industry partnerships.",
    established: 1985,
    nirfRank: 35,
    facilities: ["Central Library", "Hostels", "Sports Complex", "Innovation Hub", "Industry Labs", "Gym"]
  },
  {
    id: 5,
    name: "VIT University",
    location: "Vellore",
    rating: 4.4,
    type: "Private",
    cutoff: "85-90%",
    fees: "6.2",
    students: "30,000+",
    courses: ["CSE", "ECE", "ME", "CE", "IT", "AI", "DS", "Cybersecurity"],
    placement: 95,
    description: "VIT University is a leading private university known for its innovative curriculum, research excellence, and outstanding placement records.",
    established: 1984,
    nirfRank: 18,
    facilities: ["Central Library", "Hostels", "Sports Complex", "Innovation Center", "Research Labs", "Auditorium"]
  },
  {
    id: 6,
    name: "Amrita School of Engineering",
    location: "Coimbatore",
    rating: 4.3,
    type: "Private",
    cutoff: "87-91%",
    fees: "4.8",
    students: "12,000+",
    courses: ["CSE", "ECE", "ME", "CE", "IT", "AI"],
    placement: 89,
    description: "Amrita School of Engineering is part of Amrita Vishwa Vidyapeetham, offering world-class engineering education with a focus on research and innovation.",
    established: 1994,
    nirfRank: 25,
    facilities: ["Digital Library", "Hostels", "Sports Complex", "Research Labs", "Innovation Center"]
  },
  {
    id: 7,
    name: "Kongu Engineering College",
    location: "Erode",
    rating: 4.2,
    type: "Private",
    cutoff: "85-89%",
    fees: "3.5",
    students: "10,000+",
    courses: ["CSE", "ECE", "ME", "CE", "IT"],
    placement: 82,
    description: "Kongu Engineering College is a well-established institution in Erode, providing quality engineering education with good placement opportunities.",
    established: 1983,
    nirfRank: 95,
    facilities: ["Library", "Hostels", "Sports Ground", "Labs", "Cafeteria"]
  },
  {
    id: 8,
    name: "Sona College of Technology",
    location: "Salem",
    rating: 4.1,
    type: "Private",
    cutoff: "83-87%",
    fees: "3.2",
    students: "6,000+",
    courses: ["CSE", "ECE", "ME", "CE"],
    placement: 80,
    description: "Sona College of Technology is a reputed engineering college in Salem, offering quality education and good placement support.",
    established: 1997,
    facilities: ["Library", "Hostels", "Sports Ground", "Labs", "Auditorium"]
  },
  {
    id: 9,
    name: "Velammal Engineering College",
    location: "Chennai",
    rating: 4.0,
    type: "Private",
    cutoff: "82-86%",
    fees: "4.0",
    students: "8,000+",
    courses: ["CSE", "ECE", "ME", "CE", "IT"],
    placement: 78,
    description: "Velammal Engineering College is a well-known institution in Chennai, providing quality engineering education with modern facilities.",
    established: 1995,
    facilities: ["Library", "Hostels", "Sports Complex", "Labs", "Cafeteria"]
  },
  {
    id: 10,
    name: "SSN College of Engineering",
    location: "Chennai",
    rating: 4.5,
    type: "Private",
    cutoff: "89-93%",
    fees: "4.5",
    students: "7,000+",
    courses: ["CSE", "ECE", "ME", "CE", "IT"],
    placement: 87,
    description: "SSN College of Engineering is a premier institution known for its academic excellence and strong industry connections.",
    established: 1996,
    nirfRank: 65,
    facilities: ["Central Library", "Hostels", "Sports Complex", "Research Labs", "Auditorium"]
  }
];

// Sample Cutoff Data
export const cutoffData: CutoffData[] = [
  {
    id: 1,
    collegeId: 1,
    collegeName: "Anna University",
    course: "Computer Science Engineering",
    year: 2023,
    category: "General",
    openingRank: 1,
    closingRank: 150,
    cutoffPercentage: 98.5
  },
  {
    id: 2,
    collegeId: 1,
    collegeName: "Anna University",
    course: "Electronics & Communication",
    year: 2023,
    category: "General",
    openingRank: 151,
    closingRank: 300,
    cutoffPercentage: 97.2
  },
  {
    id: 3,
    collegeId: 1,
    collegeName: "Anna University",
    course: "Computer Science Engineering",
    year: 2023,
    category: "OBC",
    openingRank: 200,
    closingRank: 400,
    cutoffPercentage: 93.5
  },
  {
    id: 4,
    collegeId: 1,
    collegeName: "Anna University",
    course: "Computer Science Engineering",
    year: 2023,
    category: "SC",
    openingRank: 500,
    closingRank: 800,
    cutoffPercentage: 83.5
  },
  {
    id: 5,
    collegeId: 2,
    collegeName: "PSG College of Technology",
    course: "Computer Science Engineering",
    year: 2023,
    category: "General",
    openingRank: 200,
    closingRank: 450,
    cutoffPercentage: 96.8
  },
  {
    id: 6,
    collegeId: 2,
    collegeName: "PSG College of Technology",
    course: "Information Technology",
    year: 2023,
    category: "General",
    openingRank: 451,
    closingRank: 700,
    cutoffPercentage: 95.5
  },
  {
    id: 7,
    collegeId: 2,
    collegeName: "PSG College of Technology",
    course: "Mechanical Engineering",
    year: 2023,
    category: "General",
    openingRank: 800,
    closingRank: 1200,
    cutoffPercentage: 92.8
  },
  {
    id: 8,
    collegeId: 3,
    collegeName: "Thiagarajar College of Engineering",
    course: "Computer Science Engineering",
    year: 2023,
    category: "General",
    openingRank: 600,
    closingRank: 1000,
    cutoffPercentage: 94.6
  },
  {
    id: 9,
    collegeId: 4,
    collegeName: "SRM Institute of Technology",
    course: "Computer Science Engineering",
    year: 2023,
    category: "General",
    openingRank: 500,
    closingRank: 1200,
    cutoffPercentage: 92.3
  },
  {
    id: 10,
    collegeId: 4,
    collegeName: "SRM Institute of Technology",
    course: "Artificial Intelligence",
    year: 2023,
    category: "General",
    openingRank: 300,
    closingRank: 800,
    cutoffPercentage: 94.1
  },
  {
    id: 11,
    collegeId: 5,
    collegeName: "VIT University",
    course: "Computer Science Engineering",
    year: 2023,
    category: "General",
    openingRank: 800,
    closingRank: 2000,
    cutoffPercentage: 90.1
  },
  {
    id: 12,
    collegeId: 5,
    collegeName: "VIT University",
    course: "Data Science",
    year: 2023,
    category: "General",
    openingRank: 600,
    closingRank: 1500,
    cutoffPercentage: 91.5
  },
  {
    id: 13,
    collegeId: 6,
    collegeName: "Amrita School of Engineering",
    course: "Computer Science Engineering",
    year: 2023,
    category: "General",
    openingRank: 700,
    closingRank: 1400,
    cutoffPercentage: 91.3
  },
  {
    id: 14,
    collegeId: 7,
    collegeName: "Kongu Engineering College",
    course: "Computer Science Engineering",
    year: 2023,
    category: "General",
    openingRank: 1000,
    closingRank: 2000,
    cutoffPercentage: 88.2
  },
  {
    id: 15,
    collegeId: 8,
    collegeName: "Sona College of Technology",
    course: "Computer Science Engineering",
    year: 2023,
    category: "General",
    openingRank: 1200,
    closingRank: 2500,
    cutoffPercentage: 86.1
  },
  {
    id: 16,
    collegeId: 9,
    collegeName: "Velammal Engineering College",
    course: "Computer Science Engineering",
    year: 2023,
    category: "General",
    openingRank: 1300,
    closingRank: 2800,
    cutoffPercentage: 84.0
  },
  {
    id: 17,
    collegeId: 10,
    collegeName: "SSN College of Engineering",
    course: "Computer Science Engineering",
    year: 2023,
    category: "General",
    openingRank: 900,
    closingRank: 1800,
    cutoffPercentage: 89.5
  }
];

// Sample News Data
export const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "TNEA 2024 Application Process Begins",
    excerpt: "The Tamil Nadu Engineering Admissions 2024 application process has officially started. Students can now register online.",
    content: "The Tamil Nadu Engineering Admissions (TNEA) 2024 application process has officially commenced. Students who have completed their 12th standard with Physics, Chemistry, and Mathematics can now register online through the official TNEA portal. The application fee is ₹500 for general category students and ₹250 for SC/ST students. The last date for application submission is May 31, 2024. Counselling is expected to begin in July 2024.",
    date: "March 15, 2024",
    category: "Admissions"
  },
  {
    id: 2,
    title: "New Engineering Colleges Added to TNEA",
    excerpt: "15 new engineering colleges have been added to the TNEA participating institutions list for 2024.",
    content: "The Tamil Nadu government has approved 15 new engineering colleges to participate in TNEA 2024. These colleges include both government and private institutions across various districts of Tamil Nadu. The new additions will provide more opportunities for students seeking engineering admissions. The complete list of participating colleges will be available on the official TNEA website by April 2024.",
    date: "March 12, 2024",
    category: "Updates"
  },
  {
    id: 3,
    title: "Important Changes in TNEA Counselling",
    excerpt: "The TNEA counselling process has been updated with new rules and procedures for better transparency.",
    content: "The TNEA counselling process for 2024 has been updated with several important changes. The new system will include online document verification, improved seat allocation algorithm, and better grievance redressal mechanism. Students are advised to keep all required documents ready in digital format. The counselling will be conducted in multiple rounds with clear cut-off dates for each round.",
    date: "March 10, 2024",
    category: "Counselling"
  },
  {
    id: 4,
    title: "Anna University Tops NIRF Rankings 2024",
    excerpt: "Anna University has secured the top position among engineering colleges in Tamil Nadu in the latest NIRF rankings.",
    content: "Anna University has once again secured the top position among engineering colleges in Tamil Nadu in the National Institutional Ranking Framework (NIRF) 2024. The university has improved its overall ranking to 12th position nationally. Other top performers from Tamil Nadu include VIT University (18th), Amrita School of Engineering (25th), and SRM Institute of Technology (35th).",
    date: "March 8, 2024",
    category: "Rankings"
  },
  {
    id: 5,
    title: "Placement Season 2024: Record Breaking Offers",
    excerpt: "Engineering colleges in Tamil Nadu are reporting record-breaking placement offers for the 2024 batch.",
    content: "The placement season 2024 has started with record-breaking offers for engineering students in Tamil Nadu. Top companies like Google, Microsoft, Amazon, and TCS are offering packages ranging from 8 LPA to 45 LPA. Anna University, PSG College of Technology, and VIT University are leading with the highest placement percentages. The average package has increased by 15% compared to last year.",
    date: "March 5, 2024",
    category: "Placements"
  },
  {
    id: 6,
    title: "New AI and Data Science Courses Introduced",
    excerpt: "Several engineering colleges have introduced new courses in Artificial Intelligence and Data Science for TNEA 2024.",
    content: "To meet the growing demand for AI and Data Science professionals, several engineering colleges in Tamil Nadu have introduced new courses for the 2024 academic year. Anna University, SRM Institute of Technology, and VIT University are among the institutions offering specialized programs in Artificial Intelligence, Machine Learning, and Data Science. These courses will have separate cutoffs and are expected to be highly competitive.",
    date: "March 3, 2024",
    category: "Courses"
  }
];

// Sample Exam Information
export const examInfo: ExamInfo[] = [
  {
    id: 1,
    name: "TNEA 2024",
    description: "Tamil Nadu Engineering Admissions 2024",
    date: "July 2024",
    registrationDeadline: "May 31, 2024",
    eligibility: "12th with PCM, 50% aggregate",
    website: "https://tneaonline.org"
  },
  {
    id: 2,
    name: "JEE Main 2024",
    description: "Joint Entrance Examination Main 2024",
    date: "April 2024",
    registrationDeadline: "March 15, 2024",
    eligibility: "12th with PCM, 75% aggregate",
    website: "https://jeemain.nta.nic.in"
  },
  {
    id: 3,
    name: "JEE Advanced 2024",
    description: "Joint Entrance Examination Advanced 2024",
    date: "June 2024",
    registrationDeadline: "May 2024",
    eligibility: "Top 2.5 lakh JEE Main qualifiers",
    website: "https://jeeadv.ac.in"
  },
  {
    id: 4,
    name: "BITSAT 2024",
    description: "BITS Admission Test 2024",
    date: "May 2024",
    registrationDeadline: "April 2024",
    eligibility: "12th with PCM, 75% aggregate",
    website: "https://bitsadmission.com"
  }
];

// Helper functions
export const getCollegeById = (id: number): College | undefined => {
  return colleges.find(college => college.id === id);
};

export const getCollegesByLocation = (location: string): College[] => {
  return colleges.filter(college => college.location.toLowerCase().includes(location.toLowerCase()));
};

export const getCollegesByCourse = (course: string): College[] => {
  return colleges.filter(college => college.courses.some(c => c.toLowerCase().includes(course.toLowerCase())));
};

export const getCutoffsByCollege = (collegeId: number): CutoffData[] => {
  return cutoffData.filter(cutoff => cutoff.collegeId === collegeId);
};

export const getNewsByCategory = (category: string): NewsItem[] => {
  return newsItems.filter(news => news.category.toLowerCase() === category.toLowerCase());
};
