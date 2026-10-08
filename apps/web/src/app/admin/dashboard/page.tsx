'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, FileCheck, Award, Clock, TrendingUp, AlertCircle, 
  Bell, Play, Pause, CheckCircle, Upload, ListChecks, 
  DollarSign, Building2, BarChart3, Shield, Server, Activity, ChevronRight, Zap,
  FolderKanban, ExternalLink
} from 'lucide-react';
import { counsellingWorkflow, CounsellingWorkflowState } from '@/lib/counsellingWorkflow';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

// Mock data for charts
const rankDistributionData = [
  { score: '190-200', count: 450 },
  { score: '180-189', count: 2100 },
  { score: '170-179', count: 5800 },
  { score: '160-169', count: 12400 },
  { score: '150-159', count: 24000 },
  { score: '140-149', count: 31000 },
  { score: '130-139', count: 28000 },
  { score: '<130', count: 41480 },
];

const districtSaturationData = [
  { name: 'Chennai', value: 85 },
  { name: 'Coimbatore', value: 72 },
  { name: 'Madurai', value: 64 },
  { name: 'Trichy', value: 58 },
  { name: 'Salem', value: 51 },
];

export default function AdminDashboard() {
  const [workflowState, setWorkflowState] = useState<CounsellingWorkflowState | null>(null);
  const [dbStats, setDbStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setDbStats(data);
      } else {
        setDbStats({ totalRegistrations: 0, pendingCerts: 0, verifiedCerts: 0, seatsAllotted: 0, choiceFilling: 0, rankDistribution: [], districtSaturation: [] });
      }
    } catch (err) {
      console.error('Failed to load db stats', err);
      setDbStats({ totalRegistrations: 0, pendingCerts: 0, verifiedCerts: 0, seatsAllotted: 0, choiceFilling: 0, rankDistribution: [], districtSaturation: [] });
    }
  };

  useEffect(() => {
    try {
      setWorkflowState(counsellingWorkflow.getState());
      fetchStats();
    } catch (error) {
      console.error('Error loading workflow state:', error);
      setWorkflowState(counsellingWorkflow.getState());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshState = () => {
    try {
      setWorkflowState(counsellingWorkflow.getState());
      fetchStats();
    } catch (error) {
      console.error('Error refreshing workflow state:', error);
    }
  };

  if (isLoading || !workflowState || !dbStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-on-surface-variant">Initializing command center...</p>
        </div>
      </div>
    );
  }

  // Calculate stats from database
  const stats = [
    { 
      label: 'Total Registrations', 
      value: dbStats.totalRegistrations.toLocaleString(), 
      change: workflowState.registration.open ? 'Registration Open' : 'Registration Closed',
      icon: <Users className="h-6 w-6 text-primary" />,
      color: 'primary'
    },
    { 
      label: 'Certificates Pending', 
      value: dbStats.pendingCerts.toLocaleString(), 
      change: `${dbStats.verifiedCerts.toLocaleString()} verified`,
      icon: <FileCheck className="h-6 w-6 text-yellow-400" />,
      color: 'yellow'
    },
    { 
      label: 'Seats Allotted', 
      value: dbStats.seatsAllotted.toLocaleString(), 
      change: workflowState.allotment.round > 0 ? `Round ${workflowState.allotment.round}` : 'Not started',
      icon: <Award className="h-6 w-6 text-green-400" />,
      color: 'green'
    },
    { 
      label: 'Choice Filling', 
      value: dbStats.choiceFilling.toLocaleString(), 
      change: workflowState.choiceFilling.enabled ? 'Active phase' : 'Not started',
      icon: <ListChecks className="h-6 w-6 text-secondary" />,
      color: 'secondary'
    },
  ];

  const handleReleaseNotification = () => {
    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    counsellingWorkflow.releaseNotification(today, endDate);
    refreshState();
  };

  const handleToggleRegistration = () => {
    const newState = !workflowState.registration.open;
    if (newState && !workflowState.notification.released) {
      alert('Please release counselling notification first!');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    counsellingWorkflow.toggleRegistration(newState, today, endDate);
    refreshState();
  };

  const handleToggleVerification = () => {
    const newState = !workflowState.verification.active;
    counsellingWorkflow.toggleVerification(newState);
    refreshState();
  };

  const handlePublishRankList = () => {
    if (!workflowState.rankList.published) {
      counsellingWorkflow.publishRankList();
    } else {
      counsellingWorkflow.unpublishRankList();
    }
    refreshState();
  };

  const workflowControls = [
    { 
      key: 'notification', title: 'Notification', isActive: workflowState.notification.released, handler: handleReleaseNotification,
    },
    { 
      key: 'registration', title: 'Registration', isActive: workflowState.registration.open, handler: handleToggleRegistration,
    },
    { 
      key: 'verification', title: 'Verification', isActive: workflowState.verification.active, handler: handleToggleVerification,
    },
    { 
      key: 'rankList', title: 'Rank List', isActive: workflowState.rankList.published, handler: handlePublishRankList,
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white tracking-wide">Command Center</h1>
          <p className="text-on-surface-variant mt-1 text-sm">System status, real-time analytics, and workflow control.</p>
        </div>
        <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-white">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index} 
            className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${stat.color}/10 rounded-full blur-2xl group-hover:bg-${stat.color}/20 transition-all`}></div>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-surface-container-lowest border border-white/5`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-headline font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-on-surface mb-2">{stat.label}</p>
              <p className="text-xs text-on-surface-variant">{stat.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Status Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-l-4 border-l-primary flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Rank Distribution Curve</h3>
                <p className="text-xs text-on-surface-variant">Real-time candidate score density</p>
              </div>
              <button className="text-xs px-3 py-1 bg-surface-container-lowest rounded-lg border border-white/10 text-on-surface hover:text-white transition-colors">
                Export Data
              </button>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dbStats.rankDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b8c3ff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#b8c3ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="score" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(7, 11, 26, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#b8c3ff" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white mb-2">System Health</h3>
          
          <div className="bg-surface-container-lowest/50 rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Server Load</p>
                <p className="text-sm font-bold text-white">42% (Optimal)</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest/50 rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Database Health</p>
                <p className="text-sm font-bold text-white">100% Secure</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest/50 rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">AI Risk Analysis</p>
                <p className="text-sm font-bold text-white">Low Risk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Controls & District Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 glow-border-indigo">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Workflow Engine</h3>
              <p className="text-xs text-on-surface-variant">Master process controls</p>
            </div>
            <Zap className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-4">
            {workflowControls.map((ctrl) => (
              <div key={ctrl.key} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-white/5">
                <div>
                  <p className="text-sm font-bold text-white">{ctrl.title}</p>
                  <p className="text-xs text-on-surface-variant">
                    Status: <span className={ctrl.isActive ? 'text-green-400' : 'text-yellow-400'}>{ctrl.isActive ? 'Active' : 'Pending'}</span>
                  </p>
                </div>
                <button 
                  onClick={ctrl.handler}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    ctrl.isActive 
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30' 
                      : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30'
                  }`}
                >
                  {ctrl.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">District Saturation</h3>
              <p className="text-xs text-on-surface-variant">Application density by region</p>
            </div>
            <button className="text-xs px-3 py-1 bg-surface-container-lowest rounded-lg border border-white/10 text-on-surface hover:text-white transition-colors">
              View Map
            </button>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dbStats.districtSaturation} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(7, 11, 26, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {dbStats.districtSaturation.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#b8c3ff' : 'rgba(184, 195, 255, 0.5)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <section className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-white/5 bg-surface-container-lowest p-3 text-primary">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Project</p>
              <h2 className="mt-1 text-xl font-bold text-white">TNEA Insight</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                College discovery and admissions insights for Tamil Nadu Engineering Admissions.
              </p>
            </div>
          </div>
          <a
            href="https://github.com/Devadharshan47/tnea-insight"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            View GitHub project
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
