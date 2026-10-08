'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';
import { 
  Lock, Mail, ArrowRight, Shield, ShieldCheck, 
  GraduationCap, KeyRound, User, ChevronRight, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UnifiedAuthPage() {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tfa, setTfa] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering && activeTab === 'student') {
        // Mock Student Registration
        // In a real app, this would hit /api/auth/register
        login({ id: '3', name: name || 'New Student', email, role: 'student' });
        router.replace('/student/registration');
        return;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: activeTab })
      });

      if (res.ok) {
        const data = await res.json();
        login(data.user);
        // AuthContext login() handles the redirect
      } else {
        alert('Invalid credentials');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login failed', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      {/* LEFT SIDE: Branding / Information (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between relative overflow-hidden bg-surface border-r border-white/5">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Overlay Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />

        <div className="relative z-10 p-12 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-headline font-bold tracking-wider text-white">TNEA Insight</h1>
            </div>

            <h2 className="text-5xl font-headline font-bold leading-tight mb-6">
              AI-Powered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Engineering Counselling
              </span>
            </h2>

            <p className="text-lg text-muted mb-10 max-w-md">
              The premier platform for Tamil Nadu engineering admissions, integrating advanced ML predictions with seamless choice filling.
            </p>

            <div className="space-y-5">
              {[
                { title: 'Cutoff Prediction', desc: 'AI models projecting admission probabilities' },
                { title: 'Choice Filling AI', desc: 'Smart algorithms optimizing college selection' },
                { title: 'Seat Allotment Analytics', desc: 'Real-time data visualization and processing' },
                { title: 'Real-time Counselling', desc: 'Live updates for all counselling phases' },
              ].map((feature, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                  key={i} 
                  className="flex items-center gap-4 group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                    <p className="text-xs text-muted">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 p-12">
          <p className="text-xs text-muted font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Operational • Government of Tamil Nadu
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-white">TNEA Insight</h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-headline font-bold text-white mb-2">
              {activeTab === 'student' && isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-muted text-sm">
              {activeTab === 'student' && isRegistering ? 'Sign up to start your TNEA application.' : 'Please sign in to access your portal.'}
            </p>
          </motion.div>

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-surface rounded-xl border border-white/5 mb-8">
            <button
              type="button"
              onClick={() => { setActiveTab('student'); setIsRegistering(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'student' && !isRegistering
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setIsRegistering(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'admin' 
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </button>
          </div>

          {/* Form Container */}
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border-t-2" style={{ borderTopColor: activeTab === 'student' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {activeTab === 'student' && isRegistering && (
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <div className="relative mb-5">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-muted" />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-background border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="Full Name"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                      {activeTab === 'admin' ? 'Official Admin Email' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-muted" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder={activeTab === 'admin' ? 'admin@tnea.gov.in' : 'student@example.com'}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wider">
                        Password
                      </label>
                      {activeTab === 'student' && !isRegistering && (
                        <a href="#" className="text-xs text-primary font-bold hover:underline">
                          Forgot Password?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-muted" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-background border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {activeTab === 'student' && isRegistering && (
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-muted" />
                        </div>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-background border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'admin' && (
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                        2FA Authenticator Code
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <KeyRound className="h-4 w-4 text-muted" />
                        </div>
                        <input
                          type="text"
                          value={tfa}
                          onChange={(e) => setTfa(e.target.value)}
                          className="w-full bg-background border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-muted focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all font-mono tracking-widest"
                          placeholder="123456 (Optional for Demo)"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                      activeTab === 'student'
                        ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/20'
                        : 'bg-secondary hover:bg-secondary/90 text-white shadow-secondary/20'
                    } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {activeTab === 'student' && isRegistering ? 'Create Account' : `Sign In to ${activeTab === 'admin' ? 'Command Center' : 'Portal'}`}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                </motion.div>
              </AnimatePresence>
            </form>

            {activeTab === 'student' && (
              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-sm text-muted">
                  {isRegistering ? 'Already have an account?' : "Don't have an account yet?"}{' '}
                  <button 
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-primary font-bold hover:underline inline-flex items-center"
                  >
                    {isRegistering ? 'Sign In' : 'Register Now'} <ChevronRight className="h-3 w-3 ml-1" />
                  </button>
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
