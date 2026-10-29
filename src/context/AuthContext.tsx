import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CustomerProfile, PendingCartAction } from '../types';

const PENDING_CART_STORAGE_KEY = 'ghajanas_pending_cart_action';
const PROFILE_STORAGE_KEY = 'ghajanas_customer_profile';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  token: string | null;
  isAdmin: boolean;
  profile: CustomerProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  pendingCartAction: PendingCartAction | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => Promise<{ error: string | null; needsEmailVerification?: boolean }>;
  logout: () => Promise<void>;
  setPendingCartAction: (action: PendingCartAction | null) => void;
  consumePendingCartAction: () => PendingCartAction | null;
  updateProfile: (profileData: CustomerProfile) => Promise<{ error: string | null }>;
  verifyAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [pendingCartAction, setPendingCartActionState] = useState<PendingCartAction | null>(() => {
    try {
      const stored = sessionStorage.getItem(PENDING_CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setPendingCartAction = (action: PendingCartAction | null) => {
    setPendingCartActionState(action);
    try {
      if (action) {
        sessionStorage.setItem(PENDING_CART_STORAGE_KEY, JSON.stringify(action));
      } else {
        sessionStorage.removeItem(PENDING_CART_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to store pending cart action:', e);
    }
  };

  /**
   * Consumes pending cart action and deletes it immediately so it is fulfilled exactly once.
   */
  const consumePendingCartAction = (): PendingCartAction | null => {
    const action = pendingCartAction;
    if (action) {
      setPendingCartAction(null);
    }
    return action;
  };

  const loadProfile = useCallback(async (currentUser: User, currentSession: Session | null) => {
    // 1. Try local storage first for instant responsiveness
    try {
      const localProfile = localStorage.getItem(`${PROFILE_STORAGE_KEY}_${currentUser.id}`);
      if (localProfile) {
        setProfile(JSON.parse(localProfile));
      } else {
        // Default with user metadata
        setProfile({
          fullName: currentUser.user_metadata?.full_name || '',
          phone: currentUser.user_metadata?.phone || '',
          alternatePhone: '',
          addressLine: '',
          landmark: '',
          city: 'Tiruchirappalli',
          state: 'Tamil Nadu',
          pincode: '',
          deliveryNotes: '',
        });
      }
    } catch (e) {
      console.error('Failed to read local profile:', e);
    }

    // 2. Fetch from backend with JWT token if available
    if (currentSession?.access_token) {
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${currentSession.access_token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile(data.profile);
            localStorage.setItem(
              `${PROFILE_STORAGE_KEY}_${currentUser.id}`,
              JSON.stringify(data.profile)
            );
          }
        }
      } catch {
        // Backend offline or unreachable; local fallback remains in place
      }
    }
  }, []);

  const checkAdminPrivileges = useCallback(async (currentUser: User | null, currentToken: string | null): Promise<boolean> => {
    if (!currentUser) {
      setIsAdmin(false);
      return false;
    }

    // Quick client-side check on app_metadata (cannot be tampered by user)
    const hasAdminRole = currentUser.app_metadata?.role === 'admin';

    // Verify with backend admin verification endpoint if token is present
    if (currentToken) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/admin/verify`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        if (res.ok) {
          setIsAdmin(true);
          return true;
        }
      } catch {
        // If backend verification unreachable, fallback to verified app_metadata role
      }
    }

    setIsAdmin(hasAdminRole);
    return hasAdminRole;
  }, []);

  useEffect(() => {
    let mounted = true;

    // Check existing active session on mount
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return;
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        loadProfile(initialSession.user, initialSession);
        checkAdminPrivileges(initialSession.user, initialSession.access_token);
      }
      setIsLoading(false);
    }).catch(() => {
      if (mounted) setIsLoading(false);
    });

    // Listen to auth state transitions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          loadProfile(newSession.user, newSession);
          await checkAdminPrivileges(newSession.user, newSession.access_token);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminPrivileges, loadProfile]);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        await loadProfile(data.user, data.session);
        await checkAdminPrivileges(data.user, data.session.access_token);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Login failed. Please check your credentials.' };
    }
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ): Promise<{ error: string | null; needsEmailVerification?: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      // Check if session was granted immediately (auto-confirm enabled)
      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);

        const initialProfile: CustomerProfile = {
          fullName: fullName.trim(),
          phone: phone.trim(),
          alternatePhone: '',
          addressLine: '',
          landmark: '',
          city: 'Tiruchirappalli',
          state: 'Tamil Nadu',
          pincode: '',
          deliveryNotes: '',
        };
        setProfile(initialProfile);
        try {
          localStorage.setItem(
            `${PROFILE_STORAGE_KEY}_${data.user.id}`,
            JSON.stringify(initialProfile)
          );
        } catch {}

        return { error: null, needsEmailVerification: false };
      }

      // User created but waiting for email confirmation
      return { error: null, needsEmailVerification: true };
    } catch (err: any) {
      return { error: err.message || 'Signup failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
    }
  };

  const updateProfile = async (profileData: CustomerProfile): Promise<{ error: string | null }> => {
    if (!user) {
      return { error: 'You must be logged in to update your profile.' };
    }

    setProfile(profileData);

    // Save in local storage
    try {
      localStorage.setItem(`${PROFILE_STORAGE_KEY}_${user.id}`, JSON.stringify(profileData));
    } catch (e) {
      console.error('Local profile save failed:', e);
    }

    // Save in backend if token available
    if (session?.access_token) {
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(profileData),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.warn('Backend profile update note:', errData.error);
        }
      } catch (err) {
        console.warn('Backend unavailable, profile kept in isolated local storage for Phase 1');
      }
    }

    return { error: null };
  };

  const verifyAdminStatus = async (): Promise<boolean> => {
    return checkAdminPrivileges(user, session?.access_token || null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        token: session?.access_token || null,
        isAdmin,
        profile,
        isLoading,
        isConfigured: isSupabaseConfigured,
        pendingCartAction,
        login,
        signup,
        logout,
        setPendingCartAction,
        consumePendingCartAction,
        updateProfile,
        verifyAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

