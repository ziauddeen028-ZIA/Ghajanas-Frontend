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
  ) => Promise<{ error: string | null }>;
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

    // DIAGNOSTIC — remove after confirming admin auth works
    console.log('[ADMIN-CHECK] email:', currentUser.email);
    console.log('[ADMIN-CHECK] app_metadata:', JSON.stringify(currentUser.app_metadata));
    console.log('[ADMIN-CHECK] hasAdminRole (client-side):', hasAdminRole);
    console.log('[ADMIN-CHECK] token present:', !!currentToken, '| token length:', currentToken?.length);

    // Verify with backend admin verification endpoint if token is present
    if (currentToken) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/admin/verify`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        // DIAGNOSTIC — remove after confirming admin auth works
        console.log('[ADMIN-CHECK] backend /auth/admin/verify response status:', res.status);
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
  ): Promise<{ error: string | null }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();
      const cleanPhone = phone.trim();

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone,
          },
        },
      });

      if (error) {
        const errMsg = error.message.toLowerCase();
        if (
          errMsg.includes('already registered') ||
          errMsg.includes('already exists') ||
          errMsg.includes('unique constraint') ||
          error.status === 422
        ) {
          return {
            error: 'An account with this email address already exists. Please sign in instead.',
          };
        }
        return { error: error.message };
      }

      // Check for Supabase user enumeration protection indicator for existing user
      // When email exists and enumeration protection is on, user is returned with empty identities and session is null
      if (
        data.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        return {
          error: 'An account with this email address already exists. Please sign in instead.',
        };
      }

      let activeSession = data.session;
      let activeUser = data.user;

      // If session wasn't returned directly by signUp, immediately sign in with password to establish session
      if (!activeSession) {
        const signInResult = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (signInResult.error) {
          const signInErrMsg = signInResult.error.message.toLowerCase();
          if (
            signInErrMsg.includes('invalid login credentials') ||
            signInErrMsg.includes('invalid credentials')
          ) {
            return {
              error: 'An account with this email address already exists. Please sign in instead.',
            };
          }
          return { error: signInResult.error.message };
        }

        activeSession = signInResult.data.session;
        activeUser = signInResult.data.user;
      }

      if (activeSession && activeUser) {
        setSession(activeSession);
        setUser(activeUser);

        const initialProfile: CustomerProfile = {
          fullName: cleanName,
          phone: cleanPhone,
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
            `${PROFILE_STORAGE_KEY}_${activeUser.id}`,
            JSON.stringify(initialProfile)
          );
        } catch (e) {
          console.error('Failed to save initial profile locally:', e);
        }

        if (activeSession.access_token) {
          try {
            await fetch(`${API_BASE_URL}/profile`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${activeSession.access_token}`,
              },
              body: JSON.stringify(initialProfile),
            });
          } catch {
            // Ignore backend sync failure in Phase 1
          }
        }

        await checkAdminPrivileges(activeUser, activeSession.access_token);
        return { error: null };
      }

      return { error: 'Failed to create active session. Please try logging in.' };
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
  try {
    // Get the latest Supabase session instead of relying on stale React state
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session || !data.session.user) {
      setIsAdmin(false);
      return false;
    }

    const currentSession = data.session;
    const currentUser = currentSession.user;

    // Verify admin permissions using the latest authenticated session
    const isVerified = await checkAdminPrivileges(
      currentUser,
      currentSession.access_token
    );

    setIsAdmin(isVerified);

    return isVerified;
  } catch (error) {
    console.error('Admin verification failed:', error);
    setIsAdmin(false);
    return false;
  }
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

