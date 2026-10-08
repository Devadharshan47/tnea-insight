import { Calendar, ExternalLink, Clock, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { examInfo } from "@/data/sampleData";

export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">TNEA Insight</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Home</Link>
              <Link href="/colleges" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Colleges</Link>
              <Link href="/cutoffs" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Cutoffs</Link>
              <Link href="/exams" className="text-indigo-600 px-3 py-2 text-sm font-medium">Exams</Link>
              <Link href="/news" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">News</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Login</Link>
              <Link href="/auth/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Engineering Entrance Exams</h1>
          <p className="text-gray-600">Complete information about TNEA and other engineering entrance examinations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active Exams</p>
                  <p className="text-2xl font-bold">{examInfo.length}</p>
                  <p className="text-blue-100 text-sm">This Year</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Next Deadline</p>
                  <p className="text-2xl font-bold">May 31</p>
                  <p className="text-green-100 text-sm">TNEA 2024</p>
                </div>
                <Clock className="h-8 w-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Seats</p>
                  <p className="text-2xl font-bold">50K+</p>
                  <p className="text-purple-100 text-sm">Available</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Participating</p>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-orange-100 text-sm">Colleges</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {examInfo.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <div className="text-2xl font-bold mb-2">{exam.name}</div>
                  <div className="text-sm opacity-90">{exam.description}</div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Exam Date</p>
                      <p className="font-medium text-gray-900">{exam.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Registration Deadline</p>
                      <p className="font-medium text-gray-900">{exam.registrationDeadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Eligibility</p>
                      <p className="font-medium text-gray-900">{exam.eligibility}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                    Apply Now
                  </button>
                  <a 
                    href={exam.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Website
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TNEA Detailed Info */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">TNEA 2024 - Complete Guide</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Tamil Nadu Engineering Admissions (TNEA) is the centralized counselling process for admission to engineering colleges in Tamil Nadu. 
              Here's everything you need to know about TNEA 2024.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Dates</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Application Start: March 15, 2024</p>
                <p>Application End: May 31, 2024</p>
                <p>Counselling Start: July 2024</p>
                <p>Classes Begin: August 2024</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Eligibility Criteria</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>12th with PCM subjects</p>
                <p>Minimum 50% aggregate</p>
                <p>Domicile requirement</p>
                <p>Age limit: 21 years</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reservation Policy</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>BC: 26.5%</p>
                <p>MBC: 20%</p>
                <p>SC: 15%</p>
                <p>ST: 1%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Process */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">TNEA Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Registration</h3>
              <p className="text-sm text-gray-600">Create account on TNEA portal with basic details</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Document Upload</h3>
              <p className="text-sm text-gray-600">Upload required documents and certificates</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fee Payment</h3>
              <p className="text-sm text-gray-600">Pay application fee online or offline</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Counselling</h3>
              <p className="text-sm text-gray-600">Participate in online counselling rounds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Apply?</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Don't miss the opportunity to secure your seat in top engineering colleges. Start your TNEA application process today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100">
              Apply for TNEA 2024
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-indigo-600">
              Download Brochure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
