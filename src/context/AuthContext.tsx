/**
 * Vitalis / NutriFlow - Supabase Auth & User Profile Context
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types/user';
import {
  STORAGE_KEYS,
  DEFAULT_USER_PROFILE,
  loadStoredData,
  saveStoredData,
} from '../services/storage';
import { supabase } from '../services/supabase';
import { authService, mapDbProfileToUserProfile } from '../services/auth/authService';

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  user: UserProfile;
  sessionUserId: string | null;
  login: (email: string, password?: string) => Promise<AuthResponse>;
  loginWithDemo: () => Promise<AuthResponse>;
  signup: (emailOrParams: any, password?: string, name?: string) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
  updateProfile: (updatedFields: Partial<UserProfile>) => Promise<void>;
  updateUser: (updatedFields: Partial<UserProfile> | any) => Promise<void>;
  updateAvatar: (avatarUrl: string | null) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  // Load and sync user profile from Supabase
  const loadProfileFromSupabase = useCallback(async (userId: string, email?: string) => {
    try {
      const { profile, isOnboarded: dbIsOnboarded, error } = await authService.fetchProfile(userId, email);
      if (error) {
        console.warn('Error loading Supabase profile:', error);
      }

      if (profile) {
        setUser(profile);
        setIsOnboarded(dbIsOnboarded);
        saveStoredData(STORAGE_KEYS.USER_PROFILE, profile);
      } else {
        // Fallback if trigger is still running
        const fallbackUser: UserProfile = {
          ...DEFAULT_USER_PROFILE,
          id: userId,
          email: email || DEFAULT_USER_PROFILE.email,
        };
        setUser(fallbackUser);
      }
    } catch (err) {
      console.error('Failed to fetch profile from Supabase:', err);
    }
  }, []);

  // Initialize Auth Session on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const session = await authService.getSession();

        if (session?.user && isMounted) {
          setSessionUserId(session.user.id);
          setIsAuthenticated(true);
          await loadProfileFromSupabase(session.user.id, session.user.email);
        } else if (isMounted) {
          // Check local stored profile for offline or demo fallback
          const savedUser = await loadStoredData<UserProfile | null>(
            STORAGE_KEYS.USER_PROFILE,
            null
          );
          if (savedUser && savedUser.id === 'demo-user-elena') {
            setUser(savedUser);
            setIsAuthenticated(true);
            setIsOnboarded(true);
          } else {
            setIsAuthenticated(false);
            setIsOnboarded(false);
          }
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    // Listen to Supabase Auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          setSessionUserId(session.user.id);
          setIsAuthenticated(true);
          await loadProfileFromSupabase(session.user.id, session.user.email);
        }
      } else if (event === 'SIGNED_OUT') {
        setSessionUserId(null);
        setIsAuthenticated(false);
        setIsOnboarded(false);
        setUser(DEFAULT_USER_PROFILE);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadProfileFromSupabase]);

  // Sign in with Email and Password
  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    try {
      const { session, user: authUser, error } = await authService.signIn(email, password);

      if (error) {
        return { success: false, error: error.message };
      }

      if (authUser && session) {
        setSessionUserId(authUser.id);
        setIsAuthenticated(true);
        await loadProfileFromSupabase(authUser.id, authUser.email);
        return { success: true };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred' };
    }
  };

  // Sign up with Email, Password and Name
  const signup = async (emailOrParams: any, password?: string, name?: string): Promise<AuthResponse> => {
    let finalEmail = '';
    let finalPassword = password || '';
    let finalName = name || '';

    if (typeof emailOrParams === 'object') {
      finalEmail = emailOrParams.email || '';
      finalPassword = emailOrParams.password || finalPassword;
      finalName = emailOrParams.name || finalName;
    } else {
      finalEmail = emailOrParams || '';
    }

    if (!finalEmail || !finalPassword) {
      return { success: false, error: 'Email and password are required' };
    }

    try {
      const { session, user: authUser, error } = await authService.signUp(
        finalEmail,
        finalPassword,
        finalName
      );

      if (error) {
        return { success: false, error: error.message };
      }

      if (authUser && session) {
        setSessionUserId(authUser.id);
        setIsAuthenticated(true);
        setIsOnboarded(false); // Direct newly registered users to onboarding flow

        // Allow trigger a moment to insert profile or fetch it
        await loadProfileFromSupabase(authUser.id, authUser.email);
        return { success: true };
      } else if (authUser && !session) {
        // User created but email confirmation is required by Supabase project
        return {
          success: true,
          error: 'CONFIRM_EMAIL_REQUIRED',
        };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  };

  // Quick 1-Tap Demo Mode
  const loginWithDemo = async (): Promise<AuthResponse> => {
    const demoUser: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      id: 'demo-user-elena',
    };
    setUser(demoUser);
    setSessionUserId('demo-user-elena');
    setIsAuthenticated(true);
    setIsOnboarded(true);
    saveStoredData(STORAGE_KEYS.USER_PROFILE, demoUser);
    return { success: true };
  };

  // Sign Out
  const logout = async (): Promise<AuthResponse> => {
    try {
      await authService.signOut();
    } catch (err) {
      console.warn('Supabase signout error:', err);
    } finally {
      setSessionUserId(null);
      setIsAuthenticated(false);
      setIsOnboarded(false);
      setUser(DEFAULT_USER_PROFILE);
      saveStoredData(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER_PROFILE);
    }
    return { success: true };
  };

  // Mark onboarding complete in Supabase and state
  const completeOnboarding = async () => {
    setIsOnboarded(true);

    if (sessionUserId && sessionUserId !== 'demo-user-elena') {
      try {
        await authService.updateProfile(sessionUserId, user, true);
      } catch (err) {
        console.warn('Failed to sync onboarding completion to Supabase:', err);
      }
    }
  };

  // Update profile fields in state & Supabase
  const updateProfile = async (updatedFields: Partial<UserProfile>) => {
    const updatedUser: UserProfile = {
      ...user,
      ...updatedFields,
      body: { ...user.body, ...(updatedFields.body || {}) },
      goals: { ...user.goals, ...(updatedFields.goals || {}) },
      activity: { ...user.activity, ...(updatedFields.activity || {}) },
      workout: { ...user.workout, ...(updatedFields.workout || {}) },
      diet: { ...user.diet, ...(updatedFields.diet || {}) },
      nutritionTargets: { ...user.nutritionTargets, ...(updatedFields.nutritionTargets || {}) },
      preferences: { ...user.preferences, ...(updatedFields.preferences || {}) },
    };

    setUser(updatedUser);
    saveStoredData(STORAGE_KEYS.USER_PROFILE, updatedUser);

    if (sessionUserId && sessionUserId !== 'demo-user-elena') {
      try {
        await authService.updateProfile(sessionUserId, updatedUser);
      } catch (err) {
        console.warn('Failed to sync profile update to Supabase:', err);
      }
    }
  };

  const updateUser = updateProfile;

  const updateAvatar = async (avatarUrl: string | null) => {
    await updateProfile({ avatar: avatarUrl });
  };

  const refreshProfile = async () => {
    if (sessionUserId && sessionUserId !== 'demo-user-elena') {
      await loadProfileFromSupabase(sessionUserId, user.email);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isOnboarded,
        isLoading,
        user,
        sessionUserId,
        login,
        loginWithDemo,
        signup,
        logout,
        updateProfile,
        updateUser,
        updateAvatar,
        completeOnboarding,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
