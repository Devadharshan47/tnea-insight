'use client';

import { useState, useEffect } from "react";
import { Search, MapPin, Star, Filter, Grid, List } from "lucide-react";
import Link from "next/link";
import AutocompleteSearch from "@/components/AutocompleteSearch";

export default function CollegesPage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<any[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  useEffect(() => {
    fetch('/api/colleges')
      .then(res => res.json())
      .then(data => {
        setColleges(data);
        setFilteredColleges(data);
      })
      .catch(err => console.error("Error fetching colleges:", err));
  }, []);

  const handleCollegeSelect = (college: any) => {
    setSelectedCollege(college);
    // Filter to show only selected college
    setFilteredColleges([college]);
  };

  const handleSearchChange = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredColleges(colleges);
      setSelectedCollege(null);
    } else {
      // Filter colleges by name, location, or courses
      const filtered = colleges.filter(
        (college) =>
          college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          college.courses.some((course: string) =>
            course.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredColleges(filtered);
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
                <Link href="/colleges" className="text-indigo-600 px-3 py-2 text-sm font-medium">Colleges</Link>
                <Link href="/cutoffs" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Cutoffs</Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Engineering Colleges in Tamil Nadu</h1>
          <p className="text-gray-600">Find and compare the best engineering colleges for TNEA admissions</p>
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
                placeholder="Search colleges by name, location, or course..."
                onSelect={handleCollegeSelect}
                onSearchChange={handleSearchChange}
                className="w-full"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <select className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 font-medium">
                <option>All Streams</option>
                <option>Computer Science</option>
                <option>Mechanical</option>
                <option>Electrical</option>
                <option>Civil</option>
                <option>Electronics</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 font-medium">
                <option>All Locations</option>
                <option>Chennai</option>
                <option>Coimbatore</option>
                <option>Madurai</option>
                <option>Salem</option>
                <option>Vellore</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 font-medium">
                <option>All Types</option>
                <option>Government</option>
                <option>Private</option>
                <option>Aided</option>
              </select>
              <button className="bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredColleges.length}</span> colleges
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <button className="p-2 rounded-md bg-indigo-100 text-indigo-600">
                <Grid className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Colleges Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredColleges.map((college) => (
            <div key={college.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-xl font-bold">{college.name}</div>
                  <div className="text-sm opacity-90">{college.location}</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{college.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">{college.type}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {college.location}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Cutoff:</span> {college.cutoff}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Fees:</span> ₹{college.fees}L per year
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Courses:</span> {college.courses.join(", ")}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {college.placement}% placement
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
