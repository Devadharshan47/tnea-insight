'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  CheckCircle, 
  List, 
  Award, 
  CreditCard,
  BarChart3,
  LogOut,
  Menu,
  X,
  School,
  Building
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Counselling Phase', href: '/admin/counselling', icon: <Settings className="h-5 w-5" /> },
  { label: 'Rank List Management', href: '/admin/rank-list', icon: <FileText className="h-5 w-5" /> },
  { label: 'Certificates', href: '/admin/certificates', icon: <CheckCircle className="h-5 w-5" /> },
  { label: 'Choice Filling', href: '/admin/choice-filling', icon: <List className="h-5 w-5" /> },
  { label: 'Seat Allotment', href: '/admin/allotment', icon: <Award className="h-5 w-5" /> },
  { label: 'Fee Logs', href: '/admin/fees', icon: <CreditCard className="h-5 w-5" /> },
  { label: 'Analytics', href: '/admin/reports', icon: <BarChart3 className="h-5 w-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Don't apply sidebar layout to login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }



  // Protect admin routes
  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/student/dashboard');
    }
    if (!user) {
      router.replace('/admin/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-on-surface-variant font-sans">Loading admin dashboard...</p>
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
            className="lg:hidden text-primary hover:text-primary-container mr-2"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Building className="text-primary h-8 w-8" />
          <h1 className="font-headline text-2xl font-bold text-primary tracking-wide">TNEA Insight Admin</h1>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <div className="text-right mr-4 border-r border-white/10 pr-6">
            <p className="text-sm font-medium text-on-surface">{user?.name}</p>
            <p className="text-xs text-on-surface-variant">{user?.email}</p>
          </div>
          <button className="bg-primary-container/20 text-primary border border-primary/30 px-4 py-2 rounded-lg font-bold hover:bg-primary-container hover:text-white transition-all">
            EN/TA
          </button>
        </div>
      </header>

      <div className="flex pt-[73px] flex-1 overflow-hidden">
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
        <div className={`fixed lg:sticky top-[73px] left-0 z-40 h-[calc(100vh-73px)] w-64 glass-panel border-r-white/10 border-t-0 border-l-0 border-b-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full py-6">
            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
              <p className="px-4 text-xs font-semibold text-outline tracking-wider uppercase mb-4">Modules</p>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-primary-container/20 text-primary border border-primary/30' 
                        : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface border border-transparent'
                    }`}
                  >
                    <div className={`${isActive ? 'text-primary' : 'text-outline group-hover:text-primary transition-colors'}`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 mt-auto">
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-on-surface-variant hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Secure Logout</span>
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
