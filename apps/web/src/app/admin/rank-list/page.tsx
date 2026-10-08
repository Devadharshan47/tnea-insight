'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Download, MoreVertical, CheckCircle2, 
  XCircle, Clock, ShieldCheck, ChevronLeft, ChevronRight, UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data for the Rank List
const mockRankList = [
  { rank: 1, name: 'Srivatsan R', id: 'TNEA-10042', physics: 100, chemistry: 100, maths: 100, cutoff: 200.00, community: 'OC', status: 'verified' },
  { rank: 2, name: 'Lakshmi V', id: 'TNEA-12893', physics: 100, chemistry: 99.5, maths: 100, cutoff: 199.75, community: 'BC', status: 'verified' },
  { rank: 3, name: 'Karthik S', id: 'TNEA-45091', physics: 99, chemistry: 100, maths: 100, cutoff: 199.50, community: 'MBC', status: 'pending' },
  { rank: 4, name: 'Ananya P', id: 'TNEA-09234', physics: 99.5, chemistry: 99, maths: 100, cutoff: 199.25, community: 'BC', status: 'verified' },
  { rank: 5, name: 'Mohammed A', id: 'TNEA-33451', physics: 98, chemistry: 100, maths: 100, cutoff: 199.00, community: 'BCM', status: 'verified' },
  { rank: 6, name: 'Priya K', id: 'TNEA-76231', physics: 100, chemistry: 98, maths: 99.5, cutoff: 198.50, community: 'SC', status: 'rejected' },
  { rank: 7, name: 'Vishal M', id: 'TNEA-11234', physics: 97.5, chemistry: 99, maths: 100, cutoff: 198.25, community: 'BC', status: 'verified' },
];

export default function RankListManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white tracking-wide">Rank List Management</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Preliminary Merit List and Verification Status</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass-panel px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/30 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel rounded-2xl overflow-hidden glow-border-indigo flex flex-col">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container-lowest/50">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-outline" />
            </div>
            <input
              type="text"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Search by ID, Name or Community..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium">Verified: 1.42L</span>
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-medium">Pending: 1.2K</span>
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium">Rejected: 3K</span>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-surface-container-lowest/30">
                <th className="py-4 px-6 text-xs font-semibold text-outline tracking-wider uppercase">Rank</th>
                <th className="py-4 px-6 text-xs font-semibold text-outline tracking-wider uppercase">Candidate</th>
                <th className="py-4 px-6 text-xs font-semibold text-outline tracking-wider uppercase">PHY</th>
                <th className="py-4 px-6 text-xs font-semibold text-outline tracking-wider uppercase">CHE</th>
                <th className="py-4 px-6 text-xs font-semibold text-outline tracking-wider uppercase">MAT</th>
                <th className="py-4 px-6 text-xs font-semibold text-primary tracking-wider uppercase">Cutoff</th>
                <th className="py-4 px-6 text-xs font-semibold text-outline tracking-wider uppercase">Comm.</th>
                <th className="py-4 px-6 text-xs font-semibold text-outline tracking-wider uppercase">Verification</th>
                <th className="py-4 px-6 text-xs font-semibold text-outline tracking-wider uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockRankList.map((student, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={student.id} 
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="py-4 px-6 text-sm font-medium text-white">#{student.rank}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{student.name}</p>
                        <p className="text-xs text-on-surface-variant font-mono">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-on-surface-variant">{student.physics}</td>
                  <td className="py-4 px-6 text-sm text-on-surface-variant">{student.chemistry}</td>
                  <td className="py-4 px-6 text-sm text-on-surface-variant">{student.maths}</td>
                  <td className="py-4 px-6 text-sm font-bold text-primary">{student.cutoff.toFixed(2)}</td>
                  <td className="py-4 px-6 text-sm text-on-surface-variant">{student.community}</td>
                  <td className="py-4 px-6">
                    {student.status === 'verified' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                    {student.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                    {student.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 rounded-lg text-outline hover:text-white hover:bg-white/10 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-surface-container-lowest/50">
          <p className="text-xs text-on-surface-variant">Showing <span className="font-bold text-white">1</span> to <span className="font-bold text-white">7</span> of <span className="font-bold text-white">1,45,230</span> entries</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-white/10 text-outline hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-sm font-bold">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-white/10 text-on-surface-variant hover:text-white hover:bg-white/10 flex items-center justify-center text-sm font-medium transition-colors">
              2
            </button>
            <button className="w-8 h-8 rounded-lg border border-white/10 text-on-surface-variant hover:text-white hover:bg-white/10 flex items-center justify-center text-sm font-medium transition-colors">
              3
            </button>
            <button className="p-2 rounded-lg border border-white/10 text-outline hover:text-white hover:bg-white/10 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
