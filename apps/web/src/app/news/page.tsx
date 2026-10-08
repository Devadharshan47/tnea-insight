'use client';

import { Search, Calendar, Filter, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { newsItems as mockNewsItems } from "@/data/sampleData";

export default function NewsPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          setNewsList(mockNewsItems);
          setFilteredNews(mockNewsItems);
        } else {
          setNewsList(data);
          setFilteredNews(data);
        }
      })
      .catch(() => {
        setNewsList(mockNewsItems);
        setFilteredNews(mockNewsItems);
      });
  }, []);

  useEffect(() => {
    let result = newsList;
    if (searchTerm) {
      result = result.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        n.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (category !== "All Categories") {
      result = result.filter(n => n.category === category);
    }
    setFilteredNews(result);
  }, [searchTerm, category, newsList]);

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
              <Link href="/exams" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Exams</Link>
              <Link href="/news" className="text-indigo-600 px-3 py-2 text-sm font-medium">News</Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">TNEA News & Updates</h1>
          <p className="text-gray-600">Stay updated with the latest news, notifications, and important announcements</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search news by title or content..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 font-medium">
                <option>All Categories</option>
                <option>Admissions</option>
                <option>Updates</option>
                <option>Counselling</option>
                <option>Rankings</option>
                <option>Placements</option>
                <option>Courses</option>
              </select>
              <button className="bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured News */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured News</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center p-8">
                <div className="text-3xl font-bold mb-4">{newsList.length > 0 ? newsList[0].title : 'TNEA 2024 Application Process Begins'}</div>
                <div className="text-lg opacity-90 mb-4">{newsList.length > 0 ? newsList[0].excerpt : 'The Tamil Nadu Engineering Admissions 2024 application process has officially started.'}</div>
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100">
                  Read Full Article
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((news) => (
            <div key={news.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">{news.category}</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">{news.date}</span>
                  <span className="ml-auto inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {news.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{news.excerpt}</p>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                  Read More
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest TNEA updates, admission notifications, and important deadlines directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-md border border-transparent focus:ring-2 focus:ring-white focus:border-transparent"
            />
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Dates</h3>
              <p className="text-gray-600 text-sm">Check TNEA 2024 important dates and deadlines</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Official Website</h3>
              <p className="text-gray-600 text-sm">Visit the official TNEA portal for applications</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Counselling Schedule</h3>
              <p className="text-gray-600 text-sm">View TNEA counselling dates and procedures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
