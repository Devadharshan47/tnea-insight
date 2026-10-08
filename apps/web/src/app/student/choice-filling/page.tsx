'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, MapPin, Building, BookOpen, Star, AlertCircle, 
  Save, Lock, GripVertical, X, Plus, Sparkles, TrendingUp, ChevronDown, CheckCircle, Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChoiceFillingPage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<any[]>([]);
  const [choices, setChoices] = useState<any[]>([]);
  
  // Student Profile
  const [studentCutoff, setStudentCutoff] = useState('192.5');
  const [studentCommunity, setStudentCommunity] = useState('BC');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [sortBy, setSortBy] = useState('probability');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    // Load saved choices from localStorage
    const saved = localStorage.getItem('tnea_choices');
    if (saved) {
      try {
        setChoices(JSON.parse(saved));
      } catch (e) {}
    }
    
    // Load locked state
    const locked = localStorage.getItem('tnea_choices_locked');
    if (locked === 'true') setIsLocked(true);

    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/cutoff/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cutoff: parseFloat(studentCutoff) || 190,
          community: studentCommunity,
          limit: 1000 // Get all
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const all = [...data.safeColleges, ...data.moderateColleges, ...data.dreamColleges];
        setColleges(all);
        applyFilters(all, searchTerm, filterDistrict, filterBranch, sortBy);
      }
    } catch (error) {
      // Backend not running; Fallback mock data if the ML backend is offline
      const mockData = [
        { collegeCode: "0001", collegeName: "College of Engineering, Guindy", branchCode: "CS", branchName: "Computer Science", district: "Chennai", admissionProbability: 45, previousCutoff: 199, placement: 98, fees: 50000, recommendationTag: "DREAM" },
        { collegeCode: "2006", collegeName: "PSG College of Technology", branchCode: "CS", branchName: "Computer Science", district: "Coimbatore", admissionProbability: 60, previousCutoff: 197, placement: 96, fees: 85000, recommendationTag: "MODERATE" },
        { collegeCode: "1315", collegeName: "SSN College of Engineering", branchCode: "IT", branchName: "Information Tech", district: "Chennai", admissionProbability: 55, previousCutoff: 196.5, placement: 95, fees: 110000, recommendationTag: "MODERATE" },
        { collegeCode: "2007", collegeName: "Coimbatore Institute of Technology", branchCode: "CS", branchName: "Computer Science", district: "Coimbatore", admissionProbability: 85, previousCutoff: 194, placement: 90, fees: 65000, recommendationTag: "SAFE" },
        { collegeCode: "1219", collegeName: "Sri Venkateswara College", branchCode: "EC", branchName: "Electronics", district: "Chennai", admissionProbability: 92, previousCutoff: 190, placement: 88, fees: 90000, recommendationTag: "SAFE" },
        { collegeCode: "1419", collegeName: "Rajalakshmi Engineering College", branchCode: "CS", branchName: "Computer Science", district: "Chennai", admissionProbability: 95, previousCutoff: 188, placement: 85, fees: 95000, recommendationTag: "SAFE" },
      ];
      setColleges(mockData);
      applyFilters(mockData, searchTerm, filterDistrict, filterBranch, sortBy);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    applyFilters(colleges, searchTerm, filterDistrict, filterBranch, sortBy);
  }, [searchTerm, filterDistrict, filterBranch, sortBy, colleges]);

  const applyFilters = (data: any[], search: string, district: string, branch: string, sort: string) => {
    let filtered = data.filter(c => {
      const searchLower = search.toLowerCase();
      const matchSearch = c.collegeName.toLowerCase().includes(searchLower) || 
                          c.branchName.toLowerCase().includes(searchLower) ||
                          (c.branchCode && c.branchCode.toLowerCase().includes(searchLower)) ||
                          String(c.collegeCode).includes(searchLower);
      const matchDistrict = district === 'All' || c.district === district;
      const matchBranch = branch === 'All' || c.branchCode.includes(branch) || c.branchName.includes(branch);
      return matchSearch && matchDistrict && matchBranch;
    });

    filtered.sort((a, b) => {
      if (sort === 'probability') return b.admissionProbability - a.admissionProbability;
      if (sort === 'cutoff') return b.previousCutoff - a.previousCutoff;
      if (sort === 'placement') return b.placement - a.placement;
      if (sort === 'fees') return a.fees - b.fees;
      if (sort === 'alphabetical') return a.collegeName.localeCompare(b.collegeName);
      return 0;
    });

    setFilteredColleges(filtered);
  };

  const addChoice = (college: any) => {
    if (isLocked) return;
    if (choices.length >= 500) {
      alert("Maximum 500 choices allowed.");
      return;
    }
    const exists = choices.find(c => c.collegeCode === college.collegeCode && c.branchCode === college.branchCode);
    if (!exists) {
      const newChoices = [...choices, college];
      setChoices(newChoices);
      saveToLocal(newChoices);
    }
  };

  const removeChoice = (index: number) => {
    if (isLocked) return;
    const newChoices = [...choices];
    newChoices.splice(index, 1);
    setChoices(newChoices);
    saveToLocal(newChoices);
  };

  const saveToLocal = (data: any[]) => {
    localStorage.setItem('tnea_choices', JSON.stringify(data));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }
    setDraggedItemIndex(index);
    // Needed for Firefox
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (isLocked || draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newChoices = [...choices];
    const draggedItem = newChoices[draggedItemIndex];
    newChoices.splice(draggedItemIndex, 1);
    newChoices.splice(index, 0, draggedItem);
    
    setDraggedItemIndex(index);
    setChoices(newChoices);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    saveToLocal(choices);
  };

  const autoFillChoices = () => {
    if (isLocked) return;
    // Smart AI Auto fill
    // Pick top 5 safe, top 10 moderate, top 5 dream
    const safe = colleges.filter(c => c.recommendationTag === 'SAFE').slice(0, 10);
    const mod = colleges.filter(c => c.recommendationTag === 'MODERATE').slice(0, 15);
    const dream = colleges.filter(c => c.recommendationTag === 'DREAM').slice(0, 5);
    
    const smartList = [...dream, ...mod, ...safe]; // Dream first, then mod, then safe as backup
    
    // Merge without duplicates
    const currentMap = new Set(choices.map(c => c.collegeCode + c.branchCode));
    const toAdd = smartList.filter(c => !currentMap.has(c.collegeCode + c.branchCode));
    
    const newChoices = [...choices, ...toAdd].slice(0, 500);
    setChoices(newChoices);
    saveToLocal(newChoices);
  };

  const lockChoices = () => {
    if (choices.length === 0) {
      alert("Please add at least one choice before locking.");
      return;
    }
    const confirm = window.confirm("Are you sure you want to lock your choices? You will not be able to modify them later.");
    if (confirm) {
      setIsLocked(true);
      localStorage.setItem('tnea_choices_locked', 'true');
    }
  };

  // Helper for tag color
  const getTagColor = (tag: string) => {
    if (tag === 'SAFE') return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (tag === 'MODERATE') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
  };

  return (
    <div className="text-white pb-6">
      <div className="space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-4">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30 text-sm font-bold mb-2"
            >
              <Sparkles className="h-4 w-4" /> AI Counselling Engine
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Smart Choice Filling
            </h1>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-3">
            <button 
              onClick={autoFillChoices}
              disabled={isLocked || isLoading}
              className="bg-[#111827] border border-[#7C3AED]/50 hover:bg-[#7C3AED]/20 text-[#7C3AED] px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" /> AI Auto Fill
            </button>
            <button 
              onClick={() => alert("Choices Saved Successfully to Local Storage!")}
              disabled={isLocked}
              className="bg-[#111827] border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> Save Draft
            </button>
            <button 
              onClick={lockChoices}
              disabled={isLocked || choices.length === 0}
              className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                isLocked 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white hover:scale-105'
              }`}
            >
              <Lock className="h-4 w-4" /> {isLocked ? 'Choices Locked' : 'Lock & Submit'}
            </button>
          </div>
        </div>

        {/* Profile Settings (Quick update) */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 p-4 rounded-2xl flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Your Cutoff</label>
            <input 
              type="number" 
              value={studentCutoff} 
              onChange={e => setStudentCutoff(e.target.value)} 
              disabled={isLocked}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white w-32 focus:border-[#4F46E5] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Community</label>
            <select 
              value={studentCommunity} 
              onChange={e => setStudentCommunity(e.target.value)}
              disabled={isLocked}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white w-32 focus:border-[#4F46E5] outline-none"
            >
              {['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button 
            onClick={fetchColleges}
            disabled={isLocked || isLoading}
            className="bg-[#4F46E5]/20 text-[#4F46E5] px-4 py-2 rounded-lg font-bold hover:bg-[#4F46E5]/40 transition-colors"
          >
            Update AI Predictions
          </button>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[75vh]">
          
          {/* LEFT PANEL: Available Colleges (col-4) */}
          <div className="lg:col-span-4 bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex flex-col h-full overflow-hidden">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Building className="text-[#4F46E5] h-5 w-5" /> College Directory
            </h2>
            
            {/* Search & Filters */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search college or branch..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4F46E5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={filterDistrict} 
                  onChange={e => setFilterDistrict(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="All">All Districts</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                </select>
                <select 
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="probability">Sort: Best Match</option>
                  <option value="cutoff">Sort: Highest Cutoff</option>
                  <option value="placement">Sort: Top Placement</option>
                  <option value="fees">Sort: Lowest Fees</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-[#4F46E5]/30 border-t-[#4F46E5] rounded-full"></div>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredColleges.map((college, idx) => {
                    const isAdded = choices.find(c => c.collegeCode === college.collegeCode && c.branchCode === college.branchCode);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={`${college.collegeCode}-${college.branchCode}`}
                        className={`group p-3 rounded-xl border transition-all ${
                          isAdded ? 'bg-[#4F46E5]/10 border-[#4F46E5]/30 opacity-70' : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-black/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-2">
                            <div className="flex gap-2 items-center mb-1">
                              <span className="text-[10px] bg-white/10 px-1.5 rounded text-gray-300">{college.collegeCode}</span>
                              <span className={`text-[9px] font-bold px-1.5 rounded border ${getTagColor(college.recommendationTag)}`}>
                                {college.recommendationTag}
                              </span>
                            </div>
                            <h3 className="font-bold text-sm text-white leading-tight line-clamp-1">{college.collegeName}</h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1 flex items-center gap-1">
                              <BookOpen className="h-3 w-3 text-[#7C3AED]"/> {college.branchName}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-white">{college.admissionProbability}%</span>
                            <span className="text-[8px] uppercase text-gray-500">Prob</span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-[10px] text-gray-500 flex gap-2">
                            <span>Cutoff: <span className="text-gray-300">{college.previousCutoff}</span></span>
                            <span>Place: <span className="text-green-400">{college.placement}%</span></span>
                          </div>
                          <button 
                            onClick={() => addChoice(college)}
                            disabled={isAdded || isLocked}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isAdded 
                              ? 'bg-[#4F46E5] text-white' 
                              : 'bg-white/10 text-white hover:bg-[#4F46E5] disabled:opacity-50'
                            }`}
                          >
                            {isAdded ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* CENTER PANEL: Choice List (col-5) */}
          <div className="lg:col-span-5 bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex flex-col h-full overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-[80px]"></div>
            
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Star className="text-yellow-400 h-5 w-5" /> Your Priority List
              </h2>
              <div className="bg-black/50 px-3 py-1 rounded-lg border border-white/10 text-sm font-mono">
                <span className="text-[#4F46E5] font-bold">{choices.length}</span> / 500
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 relative z-10">
              {choices.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10">
                    <GripVertical className="h-8 w-8 text-gray-600" />
                  </div>
                  <p>Your choice list is empty.</p>
                  <p className="text-sm text-gray-600">Add colleges from the directory or use AI Auto Fill.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {choices.map((choice, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={`${choice.collegeCode}-${choice.branchCode}`}
                      draggable={!isLocked}
                      onDragStart={(e: any) => handleDragStart(e, index)}
                      onDragOver={(e: any) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-stretch gap-3 p-3 bg-black/40 border border-white/10 rounded-xl group ${
                        draggedItemIndex === index ? 'opacity-50 scale-[0.98]' : ''
                      } ${!isLocked ? 'cursor-grab active:cursor-grabbing hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/10' : ''}`}
                    >
                      <div className="flex flex-col items-center justify-center border-r border-white/10 pr-3">
                        <span className="text-xs font-bold text-gray-500">#{index + 1}</span>
                        {!isLocked && <GripVertical className="h-4 w-4 text-gray-600 mt-1" />}
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[8px] font-bold px-1.5 rounded border ${getTagColor(choice.recommendationTag)}`}>
                            {choice.recommendationTag} ({choice.admissionProbability}%)
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">{choice.collegeName}</h4>
                        <p className="text-xs text-gray-400 truncate">{choice.branchName}</p>
                      </div>

                      <button 
                        onClick={() => removeChoice(index)}
                        disabled={isLocked}
                        className="self-center p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: AI Insights (col-3) */}
          <div className="lg:col-span-3 space-y-4 flex flex-col h-full">
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex-1 overflow-hidden flex flex-col">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                <AlertCircle className="text-[#4F46E5] h-5 w-5" /> AI Analysis
              </h2>
              
              <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {choices.length > 0 ? (
                  <>
                    <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                      <h4 className="text-xs font-bold text-green-400 mb-1">Choice Optimization</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Your #1 choice ({choices[0].collegeCode}) is a <strong>{choices[0].recommendationTag}</strong> option with {choices[0].admissionProbability}% probability. 
                        {choices[0].recommendationTag === 'DREAM' && " Excellent strategy putting a dream college at the top."}
                      </p>
                    </div>

                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">List Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-300">Dream Choices</span>
                          <span className="text-xs font-bold text-orange-400">{choices.filter(c => c.recommendationTag === 'DREAM').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-300">Moderate Choices</span>
                          <span className="text-xs font-bold text-yellow-400">{choices.filter(c => c.recommendationTag === 'MODERATE').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-300">Safe Choices</span>
                          <span className="text-xs font-bold text-green-400">{choices.filter(c => c.recommendationTag === 'SAFE').length}</span>
                        </div>
                      </div>
                    </div>

                    {choices.filter(c => c.recommendationTag === 'SAFE').length === 0 && (
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                        <h4 className="text-xs font-bold text-red-400 mb-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Warning</h4>
                        <p className="text-xs text-red-200">You have no SAFE colleges in your list. It is highly recommended to add backup options.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10 opacity-50">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                    <p className="text-sm">Add choices to see AI analysis of your strategy.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px]"></div>
              <h3 className="font-bold text-white text-sm mb-1 relative z-10">TNEA Guidelines</h3>
              <p className="text-xs text-white/80 relative z-10 leading-relaxed mb-3">
                Always place your most preferred colleges at the top, regardless of admission probability. The system processes choices in order of priority.
              </p>
              <a href="#" className="text-xs font-bold text-white underline decoration-white/50 hover:decoration-white relative z-10">
                View Choice Filling Manual
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
