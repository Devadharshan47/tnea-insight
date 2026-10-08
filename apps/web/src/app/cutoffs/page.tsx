'use client';

import { useState } from "react";
import { Search, Filter, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { cutoffData, colleges } from "@/data/sampleData";
import AutocompleteSearch from "@/components/AutocompleteSearch";

export default function CutoffsPage() {
  const [filteredCutoffs, setFilteredCutoffs] = useState(cutoffData);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  const handleCollegeSelect = (college: any) => {
    setSelectedCollege(college);
    // Filter cutoffs to show only selected college
    const filtered = cutoffData.filter(
      (cutoff) => cutoff.collegeName.toLowerCase() === college.name.toLowerCase()
    );
    setFilteredCutoffs(filtered);
  };

  const handleSearchChange = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredCutoffs(cutoffData);
      setSelectedCollege(null);
    } else {
      // Filter cutoffs by college name or course
      const filtered = cutoffData.filter(
        (cutoff) =>
          cutoff.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cutoff.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCutoffs(filtered);
    }
  };

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
              <Link href="/cutoffs" className="text-indigo-600 px-3 py-2 text-sm font-medium">Cutoffs</Link>
              <Link href="/exams" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Exams</Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">TNEA Cutoff Analysis</h1>
          <p className="text-gray-600">Analyze previous year cutoffs and predict your chances of admission</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 relative">
            {/* Search Bar with Autocomplete */}
            <div className="flex-1 relative z-10">
              <AutocompleteSearch
                data={colleges}
                placeholder="Search by college name or course..."
                onSelect={handleCollegeSelect}
                onSearchChange={handleSearchChange}
                className="w-full"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <select className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 font-medium">
                <option>All Courses</option>
                <option>Computer Science Engineering</option>
                <option>Electronics & Communication</option>
                <option>Mechanical Engineering</option>
                <option>Civil Engineering</option>
                <option>Information Technology</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 font-medium">
                <option>All Categories</option>
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 font-medium">
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select>
              <button className="bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Highest Cutoff</p>
                  <p className="text-2xl font-bold">98.5%</p>
                  <p className="text-blue-100 text-sm">Anna University CSE</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Average Cutoff</p>
                  <p className="text-2xl font-bold">92.3%</p>
                  <p className="text-green-100 text-sm">Top 10 Colleges</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Lowest Cutoff</p>
                  <p className="text-2xl font-bold">85.2%</p>
                  <p className="text-purple-100 text-sm">Private Colleges</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total Colleges</p>
                  <p className="text-2xl font-bold">{colleges.length}</p>
                  <p className="text-orange-100 text-sm">Participating</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cutoff Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">TNEA 2023 Cutoff Data</h2>
            <p className="text-sm text-gray-600">
              {selectedCollege 
                ? `Showing cutoffs for ${selectedCollege.name}` 
                : `Showing ${filteredCutoffs.length} cutoff entries`}
            </p>
          </div>
          
          {filteredCutoffs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Opening Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Closing Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Cutoff %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCutoffs.map((cutoff) => (
                  <tr key={cutoff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{cutoff.collegeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{cutoff.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {cutoff.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cutoff.openingRank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cutoff.closingRank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-indigo-600">
                        {cutoff.cutoffPercentage}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No cutoff data found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Cutoff Trends */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cutoff Trends Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Top Courses by Cutoff</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Computer Science Engineering</span>
                  <span className="text-sm font-semibold text-indigo-600">98.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Electronics & Communication</span>
                  <span className="text-sm font-semibold text-indigo-600">97.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Information Technology</span>
                  <span className="text-sm font-semibold text-indigo-600">95.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mechanical Engineering</span>
                  <span className="text-sm font-semibold text-indigo-600">92.8%</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">College Type Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Government Colleges</span>
                  <span className="text-sm font-semibold text-green-600">96.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Private Colleges</span>
                  <span className="text-sm font-semibold text-orange-600">90.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aided Colleges</span>
                  <span className="text-sm font-semibold text-blue-600">93.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
