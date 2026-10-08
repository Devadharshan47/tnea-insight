// Authentication utilities for role-based access control
// Stores auth state in localStorage (mock implementation)

export type UserRole = 'student' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

const AUTH_STORAGE_KEY = 'tnea_auth_user';

export const authUtils = {
  // Login user
  login(user: AuthUser): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },

  // Logout user
  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  // Get current user
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  // Check if user has specific role
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  },

  // Get redirect path based on role
  getRedirectPath(role: UserRole): string {
    return role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
  }
};

// Mock users for authentication
export const mockUsers = {
  admin: {
    id: 'admin-1',
    email: 'admin@tnea.gov.in',
    password: 'admin123',
    name: 'TNEA Administrator',
    role: 'admin' as UserRole
  },
  student: {
    id: 'student-1',
    email: 'student@example.com',
    password: 'student123',
    name: 'John Doe',
    role: 'student' as UserRole
  }
};
