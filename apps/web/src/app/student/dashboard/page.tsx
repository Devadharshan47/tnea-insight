'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, AlertCircle, FileText, Award, TrendingUp, 
  Upload, ListChecks, DollarSign, Building2, Bell, Check, Sparkles, ChevronRight, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthContext } from '@/contexts/AuthContext';

export default function StudentDashboardPage() {
  const { t } = useLanguage();
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/student/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const currentPhase = {
    name: 'Choice Filling - Round 2',
    startDate: '2024-07-15',
    endDate: '2024-07-25',
    daysLeft: 8,
  };

  const quickStats = [
    { label: t('Application ID'), value: 'TNEA24-10234', icon: <FileText className="h-6 w-6 text-secondary" />, color: 'secondary' },
    { label: t('Rank'), value: '1,245', icon: <Award className="h-6 w-6 text-tertiary" />, color: 'tertiary' },
    { label: t('Category'), value: profile?.category || 'General', icon: <CheckCircle className="h-6 w-6 text-blue-400" />, color: 'blue' },
    { label: t('Choice Count'), value: profile?.choices?.length ? `${profile.choices.length}/50` : '0/50', icon: <TrendingUp className="h-6 w-6 text-green-400" />, color: 'green' },
  ];

  // Derive active step based on profile status
  let activeStep = 1;
  if (profile?.applicationStatus === 'VERIFIED') activeStep = 3;
  if (profile?.applicationStatus === 'REGISTERED') activeStep = 2;

  // Counselling process timeline with 8 steps
  const counsellingSteps = [
    { 
      id: 1, title: t('Notification'), description: t('Official announcement published'), status: activeStep >= 1 ? 'completed' : 'pending', date: '2024-06-01', icon: <Bell className="h-5 w-5" />
    },
    { 
      id: 2, title: t('Registration'), description: t('Application submitted'), status: activeStep >= 2 ? (activeStep === 2 ? 'current' : 'completed') : 'pending', date: '2024-06-10', icon: <FileText className="h-5 w-5" />
    },
    { 
      id: 3, title: t('Verification'), description: t('Documents approved'), status: activeStep >= 3 ? (activeStep === 3 ? 'current' : 'completed') : 'pending', date: '2024-06-20', icon: <Upload className="h-5 w-5" />
    },
    { 
      id: 4, title: t('Rank List'), description: t('Your rank') + ': 1,245', status: 'pending', date: '2024-07-01', icon: <Award className="h-5 w-5" />
    },
    { 
      id: 5, title: t('Choice Filling'), description: t('Select preferences'), status: 'pending', date: '2024-07-15', icon: <ListChecks className="h-5 w-5" />
    },
    { 
      id: 6, title: t('Allotment'), description: t('Awaiting results'), status: 'pending', date: 'TBA', icon: <Building2 className="h-5 w-5" />
    },
    { 
      id: 7, title: t('Fee Payment'), description: t('Pay acceptance fee'), status: 'pending', date: 'TBA', icon: <DollarSign className="h-5 w-5" />
    },
    { 
      id: 8, title: t('Reporting'), description: t('Complete admission'), status: 'pending', date: 'TBA', icon: <Building2 className="h-5 w-5" />
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Section */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-tertiary/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold mb-4 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            {t('Welcome to TNEA Insight')}
          </div>
          <h1 className="text-4xl font-headline font-bold text-white mb-2">{t('Welcome back')}, {user?.name?.split(' ')[0] || 'Student'}!</h1>
          <p className="text-on-surface-variant max-w-lg">{t('Track your counselling progress, explore AI-predicted cutoffs, and manage your engineering admission journey.')}</p>
        </div>
        
        <div className="relative z-10 bg-surface-container-lowest/50 border border-white/10 p-5 rounded-2xl min-w-[250px] backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-secondary/20 rounded-xl text-secondary">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-1">{t('Active Phase')}</p>
              <h3 className="text-lg font-bold text-white leading-tight mb-1">{t(currentPhase.name)}</h3>
              <p className="text-sm font-medium text-secondary">{currentPhase.daysLeft} {t('Days Remaining')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index} 
            className="glass-panel p-6 rounded-2xl group hover:-translate-y-1 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-surface-container-lowest border border-white/5`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-headline font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-on-surface-variant">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Timeline */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">{t('Your Admission Journey')}</h2>
            <Link href="/student/counselling" className="text-sm text-secondary hover:text-white transition-colors flex items-center gap-1">
              {t('View Details')} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="relative">
            {/* Base Line */}
            <div className="absolute top-6 left-6 bottom-6 w-0.5 bg-white/10 z-0"></div>
            
            <div className="space-y-8 relative z-10">
              {counsellingSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-6 group">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${
                    step.status === 'completed' 
                      ? 'bg-secondary border-[#070B1A] text-white shadow-[0_0_15px_rgba(251,146,60,0.5)]' 
                      : step.status === 'current'
                      ? 'bg-surface-container-lowest border-secondary text-secondary shadow-[0_0_20px_rgba(251,146,60,0.3)] animate-pulse'
                      : 'bg-[#070B1A] border-white/10 text-white/30'
                  }`}>
                    {step.status === 'completed' ? <Check className="h-5 w-5" /> : step.icon}
                  </div>
                  
                  <div className={`flex-1 pt-2 pb-6 ${index !== counsellingSteps.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`text-lg font-bold ${
                        step.status === 'completed' ? 'text-white' : step.status === 'current' ? 'text-secondary' : 'text-on-surface-variant'
                      }`}>
                        {step.title}
                      </h3>
                      <span className="text-xs font-mono text-on-surface-variant">{step.date}</span>
                    </div>
                    <p className={`text-sm ${step.status === 'current' ? 'text-white/80' : 'text-on-surface-variant/70'}`}>
                      {step.description}
                    </p>
                    
                    {step.status === 'current' && (
                      <Link 
                        href="/student/choice-filling"
                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-secondary text-[#070B1A] text-sm font-bold rounded-xl hover:bg-secondary/90 transition-all hover:scale-105"
                      >
                        {t('Action Required: Fill Choices')} <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & AI Promo */}
        <div className="space-y-6">
          <Link href="/student/cutoff-prediction" className="block">
            <div className="glass-panel p-6 rounded-3xl glow-border-secondary relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all"></div>
              <div className="relative z-10">
                <div className="p-3 bg-secondary/20 text-secondary w-max rounded-xl mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('AI Cutoff Predictor')}</h3>
                <p className="text-sm text-on-surface-variant mb-4">{t('See probability scores for your dream colleges using historical data.')}</p>
                <div className="flex items-center gap-2 text-secondary text-sm font-bold">
                  {t('Try it now')} <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/student/choice-filling" className="block">
            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer border border-white/5 hover:border-white/20">
              <div className="relative z-10">
                <div className="p-3 bg-tertiary/20 text-tertiary w-max rounded-xl mb-4">
                  <ListChecks className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t('Manage Choices')}</h3>
                <p className="text-sm text-on-surface-variant">{t('Review and reorder your selected colleges before the deadline.')}</p>
              </div>
            </div>
          </Link>
          
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{t('Important Updates')}</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-white leading-tight mb-1">{t('Round 2 Choice Filling Started')}</p>
                  <p className="text-xs text-on-surface-variant">{t('2 hours ago')}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-tertiary mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-white leading-tight mb-1">{t('Seat Matrix Updated')}</p>
                  <p className="text-xs text-on-surface-variant">{t('1 day ago')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
