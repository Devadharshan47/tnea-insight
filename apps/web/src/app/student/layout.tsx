'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ListChecks,
  TrendingUp,
  MessageSquare,
  GraduationCap,
  FileText,
  Award,
  DollarSign,
  Building2,
  LogOut,
  Menu,
  X,
  Globe,
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'AI Cutoff Predictor', href: '/student/cutoff-prediction', icon: <TrendingUp className="h-5 w-5" /> },
  { label: 'Smart Choice Filling', href: '/student/choice-filling', icon: <ListChecks className="h-5 w-5" /> },
  { label: 'AI Assistant', href: '/student/ai-support', icon: <MessageSquare className="h-5 w-5" /> },
  { label: 'Explore Colleges', href: '/student/colleges', icon: <Building2 className="h-5 w-5" /> },
  { label: 'Rank List', href: '/student/rank-list', icon: <Award className="h-5 w-5" /> },
  { label: 'Application', href: '/student/application', icon: <FileText className="h-5 w-5" /> },
  { label: 'Fee Payment', href: '/student/fees', icon: <DollarSign className="h-5 w-5" /> },
  { label: 'Allotment', href: '/student/allotment', icon: <GraduationCap className="h-5 w-5" /> },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const { language, toggleLanguage, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Don't apply sidebar to login page
  if (pathname === '/student/login') {
    return <>{children}</>;
  }

  // Protect student routes
  React.useEffect(() => {
    if (user && user.role !== 'student') {
      router.replace('/admin/dashboard');
    }
    if (!user) {
      router.replace('/student/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'student') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
          <p className="mt-4 text-on-surface-variant font-sans">{t('Loading student portal...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="flex justify-between items-center w-full px-6 py-4 z-50 fixed top-0 left-0 bg-surface/80 backdrop-blur-[20px] border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-secondary hover:text-white mr-2"
          >
            <Menu className="h-6 w-6" />
          </button>
          <GraduationCap className="text-secondary h-7 w-7" />
          <h1 className="font-headline text-xl font-bold text-white tracking-wide">TNEA Insight</h1>
          <span className="hidden sm:inline text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full border border-secondary/30 uppercase tracking-wider font-bold">{t('Student')}</span>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Globe className="h-3.5 w-3.5" />
            {language === 'EN' ? 'தமிழ்' : 'English'}
          </button>
          <div className="hidden md:block text-right mr-2 border-r border-white/10 pr-4">
            <p className="text-sm font-medium text-on-surface">{user?.name}</p>
            <p className="text-xs text-on-surface-variant">{user?.email}</p>
          </div>
        </div>
      </header>

      <div className="flex pt-[65px] flex-1 overflow-hidden">
        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <div className={`fixed lg:sticky top-[65px] left-0 z-40 h-[calc(100vh-65px)] w-60 glass-panel border-r-white/10 border-t-0 border-l-0 border-b-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full py-4">
            {/* Close button for mobile */}
            <div className="lg:hidden flex justify-end px-4 mb-2">
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              <p className="px-3 text-[10px] font-semibold text-outline tracking-wider uppercase mb-3">{t('Navigation')}</p>
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-secondary/15 text-secondary border border-secondary/30'
                        : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface border border-transparent'
                    }`}
                  >
                    <div className={`${isActive ? 'text-secondary' : 'text-outline group-hover:text-secondary transition-colors'}`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{t(item.label)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-3 mt-auto">
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-3 py-2.5 w-full rounded-xl text-on-surface-variant hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">{t('Sign Out')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
