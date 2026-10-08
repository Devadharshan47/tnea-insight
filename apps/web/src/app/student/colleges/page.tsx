'use client';

import React, { useState } from 'react';
import { 
  School, Search, MapPin, Star, Filter, Grid, List, 
  ChevronRight, ArrowRight, Building2, BookOpen, Users,
  CheckCircle2, Building, Eye, PlusCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const COLLEGES_DATA = [
  {
    id: '1',
    name: 'Anna University',
    type: 'Government',
    location: 'Chennai',
    rating: '4.8/5',
    naac: 'NAAC A++',
    cutoffRange: '95-98%',
    fees: '₹2.5L',
    courses: ['CSE', 'ECE', 'EEE'],
    moreCourses: '+5 more',
    logoText: 'AU',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: '2',
    name: 'PSG College of Technology',
    type: 'Private',
    location: 'Coimbatore',
    rating: '4.7/5',
    naac: 'NAAC A+',
    cutoffRange: '92-96%',
    fees: '₹4.2L',
    courses: ['CSE', 'IT', 'MECH'],
    moreCourses: '+6 more',
    logoText: 'PSG',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: '3',
    name: 'Thiagarajar College of Engg.',
    type: 'Private',
    location: 'Madurai',
    rating: '4.6/5',
    naac: 'NAAC A',
    cutoffRange: '90-94%',
    fees: '₹3.8L',
    courses: ['CSE', 'ECE', 'MECH'],
    moreCourses: '+4 more',
    logoText: 'TCE',
    color: 'from-yellow-500 to-orange-500'
  }
];

export default function StudentCollegesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 pb-20 text-on-surface">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-headline font-bold text-white mb-2">Explore Colleges</h1>
        <p className="text-on-surface-variant">Browse and compare engineering colleges</p>
      </div>

      {/* Top Banner section */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col xl:flex-row gap-6 items-center justify-between border border-white/10">
        <div className="flex items-center gap-5 flex-1">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 flex-shrink-0">
            <School className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">College Directory</h2>
            <p className="text-sm text-on-surface-variant mb-3">Explore detailed information about colleges</p>
            <Link href="/colleges" className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1">
              View All Colleges <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 hide-scrollbar">
          <div className="bg-surface border border-white/5 p-4 rounded-xl min-w-[140px] flex-shrink-0 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
            <School className="h-6 w-6 text-primary mb-2" />
            <p className="text-xl font-bold text-white">500+</p>
            <p className="text-xs text-on-surface-variant">Total Colleges</p>
          </div>
          <div className="bg-surface border border-white/5 p-4 rounded-xl min-w-[140px] flex-shrink-0 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
            <Building className="h-6 w-6 text-blue-400 mb-2" />
            <p className="text-xl font-bold text-white">250+</p>
            <p className="text-xs text-on-surface-variant">Government</p>
          </div>
          <div className="bg-surface border border-white/5 p-4 rounded-xl min-w-[140px] flex-shrink-0 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
            <BookOpen className="h-6 w-6 text-green-400 mb-2" />
            <p className="text-xl font-bold text-white">1000+</p>
            <p className="text-xs text-on-surface-variant">Courses</p>
          </div>
          <div className="bg-surface border border-white/5 p-4 rounded-xl min-w-[140px] flex-shrink-0 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
            <Users className="h-6 w-6 text-orange-400 mb-2" />
            <p className="text-xl font-bold text-white">2L+</p>
            <p className="text-xs text-on-surface-variant">Students Placed</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
          <input 
            type="text" 
            placeholder="Search colleges by name, location, or course..."
            className="w-full bg-background border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select className="bg-background border border-white/10 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary min-w-[140px]">
            <option>All Streams</option>
            <option>Engineering</option>
            <option>Technology</option>
          </select>
          <select className="bg-background border border-white/10 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary min-w-[140px]">
            <option>All Locations</option>
            <option>Chennai</option>
            <option>Coimbatore</option>
          </select>
          <select className="bg-background border border-white/10 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary min-w-[140px]">
            <option>All Types</option>
            <option>Government</option>
            <option>Private</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center px-1">
        <p className="text-sm text-on-surface-variant">
          Showing <span className="font-bold text-white">10</span> colleges
        </p>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-on-surface-variant">View as:</span>
          <div className="flex bg-surface border border-white/10 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted hover:text-white'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted hover:text-white'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* College Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLEGES_DATA.map((college, idx) => (
          <motion.div 
            key={college.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel rounded-xl overflow-hidden flex flex-col border border-white/10 hover:border-primary/50 transition-colors group"
          >
            {/* Top Pattern Header */}
            <div className="h-24 bg-surface relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className="px-6 pb-6 pt-0 relative flex-1 flex flex-col">
              {/* Logo & Basic Info */}
              <div className="flex items-start gap-4 mb-4 mt(-12)">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg -mt-8 relative z-10 p-1 border-4 border-[#111827]">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${college.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {college.logoText}
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-white text-lg leading-tight mb-1 group-hover:text-primary transition-colors">{college.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className={`flex items-center gap-1 font-medium ${college.type === 'Government' ? 'text-green-400' : 'text-blue-400'}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      {college.type}
                    </span>
                    <span className="flex items-center gap-1 text-on-surface-variant">
                      <MapPin className="h-3 w-3" />
                      {college.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="flex justify-between items-center mb-6 text-sm">
                <div className="flex items-center gap-1 font-bold text-white">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  {college.rating}
                </div>
                <div className="px-2 py-0.5 rounded text-xs font-bold bg-[#1e293b] text-blue-400 border border-blue-400/20">
                  {college.naac}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-y-4 mb-6 text-sm">
                <div>
                  <p className="text-on-surface-variant text-xs mb-1">Cutoff Range</p>
                  <p className="font-bold text-white">{college.cutoffRange}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-xs mb-1">Fees</p>
                  <p className="font-bold text-white">{college.fees} <span className="text-xs font-normal text-muted">per year</span></p>
                </div>
              </div>

              {/* Courses */}
              <div className="mb-6 flex-1">
                <p className="text-on-surface-variant text-xs mb-2">Popular Courses</p>
                <div className="flex flex-wrap gap-2">
                  {college.courses.map(course => (
                    <span key={course} className="px-2.5 py-1 rounded-md bg-surface border border-white/5 text-xs font-medium text-white">
                      {course}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-md bg-surface border border-white/5 text-xs font-medium text-muted">
                    {college.moreCourses}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors">
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  <PlusCircle className="h-4 w-4" />
                  Compare
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
