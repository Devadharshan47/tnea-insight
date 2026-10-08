'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthUser, authUtils } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      let currentUser = authUtils.getCurrentUser();
      
      if (!currentUser) {
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              currentUser = data.user;
              authUtils.login(currentUser as AuthUser);
            }
          }
        } catch (e) {
          console.error('Failed to fetch auth state', e);
        }
      }
      
      setUser(currentUser);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (newUser: AuthUser) => {
    authUtils.login(newUser);
    setUser(newUser);
    const redirectPath = authUtils.getRedirectPath(newUser.role);
    router.replace(redirectPath);
  };

  const logout = async () => {
    const role = user?.role;
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error', e);
    }
    authUtils.logout();
    
    // Use a hard reload to clear all React state and prevent Next.js router race conditions
    // between the AuthContext redirect and the layout.tsx useEffect redirects.
    const loginPath = role === 'admin' ? '/admin/login' : '/student/login';
    window.location.href = loginPath;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
