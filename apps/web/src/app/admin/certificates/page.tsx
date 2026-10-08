'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, CheckCircle, XCircle, AlertTriangle, Shield, 
  FileText, Link as LinkIcon, Activity, Eye, SearchCode, Database, Cpu, Image as ImageIcon,
  Check, X, RefreshCw, Lock, ArrowRight, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const MOCK_STUDENTS = [
  {
    id: 'TNEA-24-001',
    name: 'Rahul Kumar',
    appNo: 'APP20250012',
    rank: 125,
    cutoff: 198.5,
    community: 'BC',
    district: 'Chennai',
    verificationPercent: 100,
    status: 'Verified',
    documents: [
      { id: 'D1', name: '10th Marksheet', status: 'Verified', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', authenticity: 99, duplicateRisk: 0, ocr: { Name: 'Rahul Kumar', Board: 'State Board', Year: '2020', Marks: '490/500' } },
      { id: 'D2', name: '12th Marksheet', status: 'Verified', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', authenticity: 98, duplicateRisk: 1, ocr: { Name: 'Rahul Kumar', Board: 'State Board', Year: '2022', Cutoff: '198.5' } },
      { id: 'D3', name: 'Community Cert', status: 'Verified', hash: 'f2d81a260dea8a100dd517984e53c56a7523d96942a834b9cdc249bd4e8c7aa9', authenticity: 96, duplicateRisk: 2, ocr: { Name: 'Rahul Kumar', Community: 'BC', IssueDate: '12-05-2023' } }
    ]
  },
  {
    id: 'TNEA-24-002',
    name: 'Priya Rajan',
    appNo: 'APP20250045',
    rank: 450,
    cutoff: 194.2,
    community: 'MBC',
    district: 'Coimbatore',
    verificationPercent: 65,
    status: 'Pending',
    documents: [
      { id: 'D1', name: '10th Marksheet', status: 'Verified', hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0', authenticity: 95, duplicateRisk: 2, ocr: { Name: 'Priya Rajan', Board: 'CBSE', Year: '2020', Marks: '450/500' } },
      { id: 'D2', name: '12th Marksheet', status: 'Pending', hash: 'Pending Generation...', authenticity: 0, duplicateRisk: 0, ocr: { Name: 'Scanning...', Board: 'Scanning...', Year: 'Scanning...' } },
      { id: 'D3', name: 'Community Cert', status: 'Pending', hash: 'Pending Generation...', authenticity: 0, duplicateRisk: 0, ocr: { Name: 'Scanning...', Community: 'Scanning...' } },
      { id: 'D4', name: 'Income Cert', status: 'Rejected', hash: 'fraud_hash_detected_1029384756', authenticity: 24, duplicateRisk: 89, ocr: { Name: 'UNKNOWN', Income: 'TAMPERED' } }
    ]
  },
  {
    id: 'TNEA-24-003',
    name: 'Arun M',
    appNo: 'APP20250089',
    rank: 2012,
    cutoff: 185.0,
    community: 'SC',
    district: 'Madurai',
    verificationPercent: 10,
    status: 'Rejected',
    documents: [
      { id: 'D1', name: '10th Marksheet', status: 'Rejected', hash: '098f6bcd4621d373cade4e832627b4f6', authenticity: 12, duplicateRisk: 95, ocr: { Name: 'Arun Muthu', Board: 'State Board', Year: '2019', Marks: '200/500' } },
      { id: 'D2', name: '12th Marksheet', status: 'Pending', hash: 'Pending Generation...', authenticity: 0, duplicateRisk: 0, ocr: {} }
    ]
  }
];

// Document Types
const DOC_TYPES = ['10th Marksheet', '12th Marksheet', 'HSC (+1)', 'Transfer Certificate', 'Community Certificate', 'Nativity Certificate', 'First Graduate', 'Income Certificate', 'Aadhaar', 'Photo', 'Signature'];

export default function AdminCertificatesPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetch('/api/admin/certificates')
      .then(res => res.json())
      .then(data => {
        // Fallback to mock data if empty DB for demonstration
        if (data.length === 0) {
          setStudents(MOCK_STUDENTS);
        } else {
          setStudents(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load certificates", err);
        setStudents(MOCK_STUDENTS);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Initial select
    if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0]);
      if (students[0].documents?.length > 0) {
        setSelectedDoc(students[0].documents[0]);
      }
    }
  }, [students]);

  useEffect(() => {
    if (selectedStudent && selectedStudent.documents?.length > 0) {
      // Find the document in the updated student object
      const currentDoc = selectedStudent.documents.find((d: any) => selectedDoc && d.id === selectedDoc.id) || selectedStudent.documents[0];
      setSelectedDoc(currentDoc);
    } else {
      setSelectedDoc(null);
    }
  }, [selectedStudent]);

  useEffect(() => {
    const filtered = students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.appNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
    setFilteredStudents(filtered);
  }, [searchTerm, statusFilter, students]);

  const handleDocumentAction = async (docId: string, action: 'Approve' | 'Reject' | 'Reupload') => {
    if (!selectedStudent) return;
    
    // Determine API status
    let apiStatus = 'PENDING';
    if (action === 'Approve') apiStatus = 'APPROVED';
    if (action === 'Reject') apiStatus = 'REJECTED';
    if (action === 'Reupload') apiStatus = 'PENDING';

    // Call API if it's not a mock document (mock documents have simple IDs like 'D1')
    if (!docId.startsWith('D')) {
      try {
        await fetch(`/api/admin/certificates/${docId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: apiStatus })
        });
      } catch (err) {
        console.error("Failed to update status", err);
      }
    }
    
    const updatedStudents = students.map(s => {
      if (s.id === selectedStudent.id) {
        const updatedDocs = s.documents.map((d: any) => {
          if (d.id === docId) {
            let newStatus = 'Pending';
            let newHash = d.hash;
            let newAuth = d.authenticity;
            let newRisk = d.duplicateRisk;
            
            if (action === 'Approve') {
              newStatus = 'Verified';
              newAuth = 98;
              newRisk = 2;
              if (newHash.includes('Pending')) newHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
            }
            if (action === 'Reject') {
              newStatus = 'Rejected';
              newAuth = 24;
              newRisk = 89;
            }
            if (action === 'Reupload') {
              newStatus = 'Pending';
            }
            
            return { ...d, status: newStatus, hash: newHash, authenticity: newAuth, duplicateRisk: newRisk };
          }
          return d;
        });
        
        // Calculate new verification percent
        const verifiedCount = updatedDocs.filter((d: any) => d.status === 'Verified').length;
        const totalCount = updatedDocs.length || 1;
        const percent = Math.round((verifiedCount / totalCount) * 100);
        
        // Determine overall status
        let overallStatus = 'Pending';
        if (percent === 100 && updatedDocs.length > 0) overallStatus = 'Verified';
        if (updatedDocs.some((d: any) => d.status === 'Rejected')) overallStatus = 'Rejected';
        
        const updatedStudent = { ...s, documents: updatedDocs, verificationPercent: percent, status: overallStatus };
        if (selectedStudent.id === updatedStudent.id) {
            setSelectedStudent(updatedStudent);
        }
        return updatedStudent;
      }
      return s;
    });
    
    setStudents(updatedStudents);
  };

  const getStatusColor = (status: string) => {
    if (status === 'Verified') return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (status === 'Pending') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  const generateBlockchainHash = () => {
    return Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
  };

  return (
    <div className="min-h-screen bg-[#070B1A] text-white p-4 md:p-6 font-sans">
      <div className="max-w-[1800px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-4">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30 text-sm font-bold mb-2"
            >
              <Database className="h-4 w-4" /> AI + Blockchain SecOps
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Certificate Verification <Shield className="h-8 w-8 text-[#7C3AED]" />
            </h1>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-4">
            <div className="bg-[#111827] px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Processed</p>
                <p className="text-lg font-bold text-white">12,450</p>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Fraud Detected</p>
                <p className="text-lg font-bold text-red-400">342</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[80vh]">
          
          {/* LEFT PANEL: Student Queue (col-3) */}
          <div className="xl:col-span-3 bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex flex-col h-full overflow-hidden">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="text-[#4F46E5] h-5 w-5" /> Applicant Queue
            </h2>
            
            {/* Search & Filters */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or APP no..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4F46E5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={statusFilter} 
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none">
                  <option>Sort: Rank (High-Low)</option>
                  <option>Sort: Fraud Risk</option>
                  <option>Sort: Recent Uploads</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              <AnimatePresence>
                {filteredStudents.map((student) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`group p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedStudent?.id === student.id ? 'bg-[#4F46E5]/10 border-[#4F46E5]/50 shadow-[0_0_15px_rgba(79,70,229,0.15)]' : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-black/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-mono">{student.appNo}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getStatusColor(student.status)}`}>
                            {student.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-white">{student.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Rank</p>
                        <p className="text-sm font-bold text-[#7C3AED]">{student.rank}</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-400">Verification Progress</span>
                        <span className={student.verificationPercent === 100 ? 'text-green-400' : 'text-yellow-400'}>{student.verificationPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                        <div 
                          className={`h-1 rounded-full ${student.verificationPercent === 100 ? 'bg-green-500' : student.verificationPercent > 0 ? 'bg-yellow-500' : 'bg-gray-600'}`}
                          style={{ width: `${student.verificationPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* CENTER PANEL: Document Viewer (col-6) */}
          <div className="xl:col-span-6 bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex flex-col h-full overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            {selectedStudent ? (
              <>
                {/* Student Info Bar */}
                <div className="flex justify-between items-center mb-6 bg-black/40 p-4 rounded-2xl border border-white/10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-lg font-bold">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedStudent.name}</h2>
                      <p className="text-xs text-gray-400">{selectedStudent.appNo} • {selectedStudent.community} • {selectedStudent.district}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto custom-scrollbar max-w-sm">
                    {selectedStudent.documents.map((doc: any) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          selectedDoc?.id === doc.id ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-black/50 text-gray-400 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {doc.name}
                        <div className={`mt-1 h-0.5 w-full rounded-full ${doc.status === 'Verified' ? 'bg-green-400' : doc.status === 'Rejected' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document Display Area */}
                {selectedDoc ? (
                  <div className="flex-1 flex flex-col md:flex-row gap-6 relative z-10 min-h-0">
                    {/* Document Image Mock */}
                    <div className="flex-1 bg-black/50 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col">
                      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black/40">
                        <span className="text-sm font-bold text-gray-300 flex items-center gap-2"><ImageIcon className="h-4 w-4"/> Source Image</span>
                        <button className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-colors">Expand</button>
                      </div>
                      <div className="flex-1 flex items-center justify-center p-4 relative group">
                        {/* Mock PDF/Image rendering */}
                        <div className="w-full max-w-md aspect-[1/1.414] bg-white rounded shadow-2xl relative overflow-hidden flex items-center justify-center">
                           <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                           <div className="text-center p-8 opacity-20 border-4 border-dashed border-gray-400 m-8 rounded-xl w-full h-full flex flex-col items-center justify-center">
                             <FileText className="h-16 w-16 mb-4 text-black" />
                             <p className="text-gray-900 font-bold text-xl uppercase">{selectedDoc.name}</p>
                             <p className="text-gray-900 mt-2 font-mono">{selectedStudent.name}</p>
                             {selectedDoc.status === 'Rejected' && <div className="absolute inset-0 flex items-center justify-center"><div className="text-red-500 font-black text-6xl border-8 border-red-500 p-4 transform -rotate-45 opacity-50">REJECTED</div></div>}
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* OCR Extraction */}
                    <div className="w-full md:w-80 flex flex-col gap-4">
                      {/* OCR Data */}
                      <div className="bg-[#4F46E5]/10 border border-[#4F46E5]/30 rounded-2xl p-4 flex-1 overflow-y-auto custom-scrollbar">
                        <h3 className="text-sm font-bold text-[#4F46E5] mb-4 flex items-center gap-2">
                          <SearchCode className="h-4 w-4" /> OCR Extracted Data
                        </h3>
                        <div className="space-y-3">
                          {selectedDoc.ocr && Object.keys(selectedDoc.ocr).map(key => (
                            <div key={key} className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{key}</p>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-mono text-white">{selectedDoc.ocr[key]}</p>
                                {selectedDoc.ocr[key] !== 'Scanning...' && selectedDoc.ocr[key] !== 'TAMPERED' && <CheckCircle className="h-3 w-3 text-green-400" />}
                                {selectedDoc.ocr[key] === 'TAMPERED' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                         <button 
                           onClick={() => handleDocumentAction(selectedDoc.id, 'Approve')}
                           className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
                         >
                           <Check className="h-4 w-4" /> Approve Document
                         </button>
                         <button 
                           onClick={() => handleDocumentAction(selectedDoc.id, 'Reject')}
                           className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
                         >
                           <X className="h-4 w-4" /> Reject (Fraud)
                         </button>
                         <button 
                           onClick={() => handleDocumentAction(selectedDoc.id, 'Reupload')}
                           className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
                         >
                           <RefreshCw className="h-4 w-4" /> Request Re-upload
                         </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 relative z-10">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Select a document to view</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a student from the queue</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: AI & Blockchain SecOps (col-3) */}
          <div className="xl:col-span-3 space-y-4 flex flex-col h-full">
            
            {/* AI Authenticity Engine */}
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px]"></div>
              
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white relative z-10">
                <Cpu className="text-blue-400 h-5 w-5" /> AI Fraud Engine
              </h2>

              {selectedDoc ? (
                <div className="space-y-4 relative z-10">
                  {/* Authenticity Score */}
                  <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Authenticity Score</p>
                      <span className={`font-bold ${selectedDoc.authenticity > 90 ? 'text-green-400' : selectedDoc.authenticity > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {selectedDoc.authenticity}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedDoc.authenticity}%` }}
                        className={`h-1.5 rounded-full ${selectedDoc.authenticity > 90 ? 'bg-green-500' : selectedDoc.authenticity > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      ></motion.div>
                    </div>
                  </div>

                  {/* Duplicate Risk */}
                  <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Duplicate Risk</p>
                      <span className={`font-bold ${selectedDoc.duplicateRisk < 10 ? 'text-green-400' : selectedDoc.duplicateRisk < 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {selectedDoc.duplicateRisk}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden flex justify-end">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedDoc.duplicateRisk}%` }}
                        className={`h-1.5 rounded-full ${selectedDoc.duplicateRisk < 10 ? 'bg-green-500' : selectedDoc.duplicateRisk < 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      ></motion.div>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className={`p-4 rounded-2xl border ${selectedDoc.duplicateRisk > 80 ? 'bg-red-500/10 border-red-500/30' : selectedDoc.authenticity > 90 ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                    <h4 className={`text-xs font-bold mb-2 flex items-center gap-1 ${selectedDoc.duplicateRisk > 80 ? 'text-red-400' : selectedDoc.authenticity > 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                      <AlertTriangle className="h-4 w-4" /> AI Conclusion
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {selectedDoc.duplicateRisk > 80 
                        ? "HIGH RISK: This certificate matches an existing hash in the DB belonging to another student. Signs of digital manipulation detected on seals."
                        : selectedDoc.authenticity > 90
                          ? "SAFE: Document structural integrity is intact. Fonts and seals match issuing authority templates."
                          : "MODERATE RISK: OCR confidence is low due to blurry scan. Manual verification recommended."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">Select a document to run AI scan</div>
              )}
            </div>

            {/* Blockchain Ledger */}
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex-1 overflow-hidden flex flex-col relative">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white relative z-10">
                <LinkIcon className="text-[#7C3AED] h-5 w-5" /> Immutable Ledger
              </h2>

              {selectedDoc ? (
                <div className="space-y-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-1">
                  
                  <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">SHA-256 Hash</p>
                    <p className="text-xs font-mono text-gray-300 break-all">{selectedDoc.hash}</p>
                  </div>

                  {selectedDoc.status === 'Verified' ? (
                    <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-3">
                       <div className="flex items-center gap-2 mb-2">
                         <Lock className="h-4 w-4 text-green-400" />
                         <span className="text-xs font-bold text-green-400 uppercase">Secured on Blockchain</span>
                       </div>
                       <p className="text-[10px] text-gray-400">Block ID: #84920194</p>
                       <p className="text-[10px] text-gray-400">Timestamp: {new Date().toISOString()}</p>
                    </div>
                  ) : selectedDoc.status === 'Rejected' ? (
                    <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-3">
                       <div className="flex items-center gap-2 mb-2">
                         <Shield className="h-4 w-4 text-red-400" />
                         <span className="text-xs font-bold text-red-400 uppercase">Fraud Logged</span>
                       </div>
                       <p className="text-[10px] text-gray-400">Hash blacklisted across TNEA nodes.</p>
                    </div>
                  ) : (
                    <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-xl p-3 text-center py-4">
                       <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin mx-auto mb-2" />
                       <span className="text-xs font-bold text-yellow-400 uppercase">Awaiting Node Consensus</span>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase">Verification Timeline</h4>
                    <div className="space-y-4">
                      <div className="flex gap-3 relative">
                        <div className="absolute left-[5px] top-[14px] bottom-[-16px] w-px bg-white/10"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500 ring-4 ring-black z-10 mt-1"></div>
                        <div>
                          <p className="text-xs font-bold text-white">Document Uploaded</p>
                          <p className="text-[10px] text-gray-500">Student Portal • 10:45 AM</p>
                        </div>
                      </div>
                      <div className="flex gap-3 relative">
                        <div className="absolute left-[5px] top-[14px] bottom-[-16px] w-px bg-white/10"></div>
                        <div className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-black z-10 mt-1"></div>
                        <div>
                          <p className="text-xs font-bold text-white">AI Scanned</p>
                          <p className="text-[10px] text-gray-500">Fraud Engine • 10:46 AM</p>
                        </div>
                      </div>
                      <div className="flex gap-3 relative">
                        <div className={`h-3 w-3 rounded-full ring-4 ring-black z-10 mt-1 ${selectedDoc.status === 'Verified' ? 'bg-green-500' : selectedDoc.status === 'Rejected' ? 'bg-red-500' : 'bg-gray-600'}`}></div>
                        <div>
                          <p className="text-xs font-bold text-white">Admin Verdict</p>
                          <p className="text-[10px] text-gray-500">{selectedDoc.status === 'Pending' ? 'Waiting for admin...' : `Marked as ${selectedDoc.status} • Just now`}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">Awaiting document selection</div>
              )}
            </div>

          </div>
          
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
