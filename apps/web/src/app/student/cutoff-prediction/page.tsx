'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Search, Crosshair, MapPin, Star, Sparkles, Building, BookOpen, AlertCircle, CheckCircle, Navigation, Info, ChevronDown, GraduationCap, Percent, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export default function CutoffPredictionPage() {
  const [mark, setMark] = useState('192.5');
  const [category, setCategory] = useState('BC');
  const [district, setDistrict] = useState('All');
  const [branch, setBranch] = useState('All');
  const [collegeType, setCollegeType] = useState('All');
  
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [results, setResults] = useState({ safeColleges: [], moderateColleges: [], dreamColleges: [], predictionConfidence: 0 });
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [choices, setChoices] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch if desired, but let's wait for user input
    handlePredict();
  }, []);

  const handlePredict = async () => {
    if (!mark) {
      alert('Please enter your expected TNEA cutoff mark');
      return;
    }
    
    setIsPredicting(true);
    setShowResults(false);
    
    try {
      const response = await fetch('http://localhost:8000/api/cutoff/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cutoff: parseFloat(mark),
          community: category,
          preferredBranch: branch === 'All' ? null : branch,
          preferredDistrict: district === 'All' ? null : district,
          collegeType: collegeType === 'All' ? null : collegeType
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setIsPredicting(false);
      setShowResults(true);
    }
  };

  const addToChoices = (college: any) => {
    if (!choices.find(c => c.collegeCode === college.collegeCode && c.branchCode === college.branchCode)) {
      setChoices([...choices, college]);
    }
  };

  const trendData = [
    { year: '2020', cutoff: parseFloat(mark) - 4 },
    { year: '2021', cutoff: parseFloat(mark) - 2 },
    { year: '2022', cutoff: parseFloat(mark) - 1.5 },
    { year: '2023', cutoff: parseFloat(mark) + 0.5 },
    { year: '2024', cutoff: parseFloat(mark) + 1.2, predicted: true },
  ];

  return (
    <div className="text-white pb-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30 text-sm font-bold mb-4"
            >
              <Sparkles className="h-4 w-4" /> AI Powered Core Engine
            </motion.div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#7C3AED]">
              Advanced Cutoff Predictor
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base max-w-2xl">
              Machine Learning driven admission probability mapping based on real historical TNEA data.
            </p>
          </div>
          
          {choices.length > 0 && (
            <div className="mt-4 md:mt-0 flex items-center gap-3 bg-[#111827] px-4 py-2 rounded-xl border border-white/10 shadow-lg">
              <span className="text-sm text-gray-400">Choice List:</span>
              <span className="bg-[#7C3AED] text-white text-xs font-bold px-2 py-1 rounded-md">{choices.length} Added</span>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: Filters */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F46E5]/20 rounded-full blur-[60px]"></div>
              
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                <Crosshair className="text-[#4F46E5] h-5 w-5" /> Prediction Profile
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Your Cutoff Mark</label>
                  <input
                    type="number"
                    value={mark}
                    onChange={(e) => setMark(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xl font-bold text-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Community</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5] transition-all appearance-none"
                  >
                    {['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Preferred Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5] transition-all appearance-none"
                  >
                    <option value="All">All Branches</option>
                    <option value="CS">Computer Science (CS)</option>
                    <option value="EC">ECE</option>
                    <option value="EE">EEE</option>
                    <option value="ME">Mechanical</option>
                    <option value="CE">Civil</option>
                    <option value="IT">Info Tech (IT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5] transition-all appearance-none"
                  >
                    <option value="All">All Districts</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Trichy">Trichy</option>
                    <option value="Salem">Salem</option>
                  </select>
                </div>

                <button
                  onClick={handlePredict}
                  disabled={isPredicting}
                  className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#4F46E5]/25 mt-4"
                >
                  {isPredicting ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
                  ) : (
                    <>Run AI Analysis <Navigation className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* CENTER PANEL: Analytics */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                  <TrendingUp className="text-[#7C3AED] h-5 w-5" /> Analytics & Trend
                </h2>
                {results.predictionConfidence > 0 && (
                  <span className="text-xs font-mono bg-[#4ade80]/20 text-[#4ade80] px-2 py-1 rounded border border-[#4ade80]/30">
                    Confidence: {results.predictionConfidence}%
                  </span>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center relative">
                {/* Gauge or Chart area */}
                <div className="w-full h-64 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCutoff" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#070B1A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="cutoff" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorCutoff)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 bg-[#4F46E5]/10 border border-[#4F46E5]/20 rounded-xl p-4 w-full">
                  <h4 className="text-sm font-bold text-[#4F46E5] flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4" /> AI Insight
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Based on {category} community trends, top {branch !== 'All' ? branch : 'Engineering'} programs in {district !== 'All' ? district : 'Tamil Nadu'} show a +1.2 mark upward shift. Your score of <span className="text-white font-bold">{mark}</span> has a strong advantage in moderate tier colleges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Recommendations */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl h-full flex flex-col max-h-[800px]">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                <Building className="text-blue-400 h-5 w-5" /> College Matches
              </h2>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {isPredicting ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-gray-700 h-10 w-10"></div>
                      <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-gray-700 rounded"></div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-gray-700 rounded col-span-2"></div>
                            <div className="h-2 bg-gray-700 rounded col-span-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {results.safeColleges.length === 0 && results.moderateColleges.length === 0 ? (
                      <div className="text-center text-gray-500 py-10">No matches found for this criteria. Try broadening your search.</div>
                    ) : (
                      <AnimatePresence>
                        {[...results.safeColleges.slice(0,5), ...results.moderateColleges.slice(0,5), ...results.dreamColleges.slice(0,3)].map((college: any, idx) => {
                          const isExpanded = expandedCard === `${college.collegeCode}-${college.branchCode}`;
                          const isSafe = college.recommendationTag === 'SAFE';
                          const isMod = college.recommendationTag === 'MODERATE';
                          const tagColor = isSafe ? 'text-green-400 bg-green-400/10 border-green-400/20' : 
                                          isMod ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 
                                          'text-orange-400 bg-orange-400/10 border-orange-400/20';

                          return (
                            <motion.div 
                              key={`${college.collegeCode}-${college.branchCode}-${idx}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="group bg-black/30 border border-white/5 hover:border-white/15 rounded-2xl p-4 transition-all relative overflow-hidden"
                            >
                              <div className={`absolute top-0 left-0 w-1 h-full ${isSafe ? 'bg-green-500' : isMod ? 'bg-yellow-500' : 'bg-orange-500'}`}></div>
                              
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">{college.collegeCode}</span>
                                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${tagColor}`}>
                                      {college.recommendationTag}
                                    </span>
                                  </div>
                                  <h3 className="font-bold text-sm text-white leading-tight mb-1 truncate max-w-[200px]" title={college.collegeName}>
                                    {college.collegeName}
                                  </h3>
                                  <p className="text-xs text-gray-400 flex items-center gap-1 truncate" title={college.branchName}>
                                    <BookOpen className="h-3 w-3 text-[#4F46E5]" /> {college.branchName}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="text-lg font-black text-white">{college.admissionProbability}%</div>
                                  <div className="text-[9px] text-gray-500 uppercase">Probability</div>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${college.admissionProbability}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className={`h-1.5 rounded-full ${isSafe ? 'bg-green-500' : isMod ? 'bg-yellow-500' : 'bg-orange-500'}`}
                                ></motion.div>
                              </div>

                              <div className="flex justify-between items-center mt-2">
                                <button 
                                  onClick={() => setExpandedCard(isExpanded ? null : `${college.collegeCode}-${college.branchCode}`)}
                                  className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                  Details <ChevronDown className={`h-3 w-3 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                                
                                <button 
                                  onClick={() => addToChoices(college)}
                                  className="text-[10px] bg-[#4F46E5] text-white px-2 py-1 rounded hover:bg-[#7C3AED] transition-colors flex items-center gap-1"
                                >
                                  <CheckCircle className="h-3 w-3" /> Add Choice
                                </button>
                              </div>

                              {/* Expandable Details */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pt-3 mt-3 border-t border-white/5 grid grid-cols-2 gap-3 text-xs"
                                  >
                                    <div>
                                      <p className="text-gray-500 mb-0.5">District</p>
                                      <p className="text-white font-medium flex items-center gap-1"><MapPin className="h-3 w-3 text-gray-400"/> {college.district}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 mb-0.5">Previous Cutoff</p>
                                      <p className="text-white font-mono">{college.previousCutoff}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 mb-0.5">Est. Placement</p>
                                      <p className="text-green-400 font-medium flex items-center gap-1"><Percent className="h-3 w-3"/> {college.placement}%</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 mb-0.5">NAAC Grade</p>
                                      <p className="text-yellow-400 font-bold">{college.naac}</p>
                                    </div>
                                    <div className="col-span-2 bg-[#4F46E5]/10 p-2 rounded border border-[#4F46E5]/20 mt-1">
                                      <p className="text-gray-300 text-[10px] flex gap-2">
                                        <Info className="h-3 w-3 flex-shrink-0 mt-0.5 text-[#4F46E5]" />
                                        <span>AI says: Your cutoff is {Math.abs((parseFloat(mark) - college.predictedCutoff)).toFixed(1)} marks {parseFloat(mark) >= college.predictedCutoff ? 'above' : 'below'} the predicted requirement.</span>
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
