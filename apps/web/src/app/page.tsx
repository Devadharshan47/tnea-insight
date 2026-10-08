'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, Shield, ChevronRight, BarChart2, BookOpen, 
  MapPin, TrendingUp, Users, Calendar, Award, CheckCircle2,
  Cpu, Database, Sparkles, Building2, BrainCircuit
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const mockChartData = [
  { year: '2019', cutoff: 185 },
  { year: '2020', cutoff: 188 },
  { year: '2021', cutoff: 187.5 },
  { year: '2022', cutoff: 191 },
  { year: '2023', cutoff: 192.5 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-on-surface overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-headline font-bold text-xl text-white tracking-wide">TNEA Insight</span>
            </div>
            
            <nav className="hidden md:flex gap-8">
              {['Home', 'Colleges', 'Cutoffs', 'Predictor', 'Resources'].map((item) => (
                <Link key={item} href="#" className="text-sm font-medium text-muted hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/portal/auth"
                className="bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-xl hover:bg-white/10 font-bold transition-all text-sm"
              >
                Login to Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* 1. Hero Section */}
        <section className="py-24 lg:py-32 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 uppercase tracking-wider"
          >
            <Sparkles className="h-4 w-4" /> State-of-the-Art Counselling Platform
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-headline font-bold text-white mb-6 leading-[1.1]"
          >
            Predict Your Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Engineering College
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted max-w-2xl mb-12"
          >
            The official AI-powered admission platform for Tamil Nadu Engineering Admissions. Analyze cutoffs, manage choices, and secure your dream seat.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center"
          >
            <Link href="/portal/auth" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2">
              Start Prediction <ChevronRight className="h-5 w-5" />
            </Link>
            <Link href="/colleges" className="w-full sm:w-auto px-8 py-4 bg-surface border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              Browse Colleges
            </Link>
          </motion.div>
        </section>

        {/* 2. Stats Section */}
        <section className="py-12 border-y border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Engineering Colleges', value: '500+', icon: Building2 },
              { label: 'Students Assisted', value: '2L+', icon: Users },
              { label: 'Prediction Accuracy', value: '95%', icon: BrainCircuit },
              { label: 'AI Powered', value: '100%', icon: Cpu }
            ].map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="glass-panel p-6 rounded-2xl text-center group hover:-translate-y-2 transition-transform"
              >
                <div className="w-12 h-12 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-headline font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm font-semibold text-muted uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Features Section */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-4">Enterprise Grade Capabilities</h2>
            <p className="text-muted max-w-2xl mx-auto">TNEA Insight brings Silicon Valley level analytics to government counselling.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Cutoff Predictor', desc: 'Neural network based cutoff prediction model trained on 10 years of data.', icon: TrendingUp, size: 'md:col-span-2' },
              { title: 'Choice Filling AI', desc: 'Smart list generation based on preferences.', icon: List, size: 'md:col-span-1' },
              { title: 'Seat Allotment', desc: 'Real-time matrix tracking and simulation.', icon: Database, size: 'md:col-span-1' },
              { title: 'College Comparison', desc: 'Deep side-by-side metric analysis.', icon: BarChart2, size: 'md:col-span-1' },
              { title: 'Rank Analysis', desc: 'Community and overall rank projections.', icon: Award, size: 'md:col-span-1' },
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className={`glass-panel p-8 rounded-3xl ${feature.size} hover:border-primary/50 transition-colors group`}
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. How TNEA Works */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-4">How TNEA Works</h2>
            <p className="text-muted max-w-2xl mx-auto">The unified 7-step admission process.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 hidden md:block -z-10" />
            {[
              'Registration', 'Upload Certs', 'Verification', 'Rank List', 'Choice Filling', 'Allotment', 'Reporting'
            ].map((step, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="flex flex-col items-center gap-4 bg-background p-2"
              >
                <div className="w-10 h-10 rounded-full bg-surface border-2 border-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                  {i + 1}
                </div>
                <span className="text-xs font-bold text-muted uppercase tracking-wider">{step}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. ML Section */}
        <section className="py-24">
          <div className="glass-panel rounded-3xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-secondary/10 rotate-12 blur-[80px]" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-bold mb-6 uppercase tracking-wider">
                  <BrainCircuit className="h-4 w-4" /> Prediction Engine
                </div>
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-6">Unprecedented Accuracy with Deep Learning</h2>
                <p className="text-muted text-lg mb-8">
                  Our models are trained on over a decade of TNEA admission data. We predict cutoff trajectories before they happen, giving you the edge in choice filling.
                </p>
                <ul className="space-y-4">
                  {['District-wise saturation mapping', 'Community quota forecasting', 'Real-time shift tracking'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white font-medium">
                      <CheckCircle2 className="h-5 w-5 text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-[300px] w-full glass-panel bg-black/20 rounded-2xl p-6 border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorCutoff" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="cutoff" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorCutoff)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Top Colleges */}
        <section className="py-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-2">Premier Institutions</h2>
              <p className="text-muted">Explore the highest-ranked engineering colleges in TN.</p>
            </div>
            <Link href="/colleges" className="text-primary font-bold hover:text-white transition-colors hidden sm:flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
            {[
              { name: 'College of Engineering, Guindy', loc: 'Chennai', code: '0001', tag: 'Autonomous' },
              { name: 'Madras Institute of Technology', loc: 'Chennai', code: '0004', tag: 'Highly Competitive' },
              { name: 'PSG College of Technology', loc: 'Coimbatore', code: '2006', tag: 'Private Aided' },
              { name: 'Coimbatore Institute of Tech', loc: 'Coimbatore', code: '2007', tag: 'Govt Aided' },
            ].map((college, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="min-w-[320px] max-w-[320px] glass-panel rounded-2xl p-6 snap-start group cursor-pointer hover:border-primary/40 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-muted">{college.code}</div>
                  <div className="px-2 py-1 bg-primary/20 text-primary rounded text-[10px] font-bold uppercase tracking-wider">{college.tag}</div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">{college.name}</h3>
                <p className="text-sm text-muted flex items-center gap-1 mb-6"><MapPin className="h-3 w-3" /> {college.loc}</p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs font-semibold text-white">Est. Cutoff: 198.5</span>
                  <ArrowRightIcon className="h-4 w-4 text-muted group-hover:text-white transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* 7. Footer */}
      <footer className="border-t border-white/5 bg-surface/50 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-headline font-bold text-xl text-white">TNEA Insight</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Empowering students with data-driven insights for engineering admissions in Tamil Nadu.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/portal/auth" className="text-sm text-muted hover:text-white transition-colors">Student Login</Link></li>
                <li><Link href="/portal/auth" className="text-sm text-muted hover:text-white transition-colors">Admin Portal</Link></li>
                <li><Link href="#" className="text-sm text-muted hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-muted hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-sm text-muted hover:text-white transition-colors">API Access</Link></li>
                <li><Link href="#" className="text-sm text-muted hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-muted hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted">© 2026 TNEA Insight System. All rights reserved.</p>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted font-bold tracking-wider">SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper icon component since we mapped it dynamically
function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
// Add List Icon manually since it wasn't imported at top
function List(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>
    </svg>
  );
}
