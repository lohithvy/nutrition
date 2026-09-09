import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  STORAGE_KEYS,
  DEFAULT_USER_PROFILE,
  loadStoredData,
  saveStoredData,
} from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    loadStoredData(STORAGE_KEYS.AUTH_USER, true)
  );

  // User profile state
  const [user, setUser] = useState(() => {
    const saved = loadStoredData(STORAGE_KEYS.USER_PROFILE, null);
    if (saved) return { ...DEFAULT_USER_PROFILE, ...saved };
    const legacy = loadStoredData(STORAGE_KEYS.USER, null);
    if (legacy) return { ...DEFAULT_USER_PROFILE, ...legacy };
    return DEFAULT_USER_PROFILE;
  });

  // Modal open states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSignoutOpen, setIsSignoutOpen] = useState(false);

  // Persist auth status
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.AUTH_USER, isAuthenticated);
  }, [isAuthenticated]);

  // Persist user profile
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.USER_PROFILE, user);
    // Legacy sync
    saveStoredData(STORAGE_KEYS.USER, user);
  }, [user]);

  // Modal handlers
  const openLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };
  const closeLogin = () => setIsLoginOpen(false);

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };
  const closeSignup = () => setIsSignupOpen(false);

  const openSignout = () => setIsSignoutOpen(true);
  const closeSignout = () => setIsSignoutOpen(false);

  // Mock Authentication Methods
  const login = (email, password, rememberMe = true) => {
    const firstName = email ? email.split('@')[0].replace(/[^a-zA-Z]/g, '') : 'Member';
    const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    setUser((prev) => ({
      ...prev,
      email: email || prev.email,
      name: prev.name || `${capitalizedName} Vance`,
      firstName: prev.firstName || capitalizedName,
    }));

    setIsAuthenticated(true);
    closeLogin();
    return { success: true };
  };

  const signup = ({ name, email, password }) => {
    const trimmedName = name?.trim() || 'New Member';
    const firstName = trimmedName.split(' ')[0];

    const newUser = {
      ...DEFAULT_USER_PROFILE,
      name: trimmedName,
      firstName,
      email: email || 'user@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    setUser(newUser);
    setIsAuthenticated(true);
    closeSignup();
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    closeSignout();
    return { success: true };
  };

  // Profile Mutation Methods
  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const merged = {
        ...prev,
        ...updatedFields,
        body: {
          ...prev.body,
          ...(updatedFields.body || {}),
        },
        goals: {
          ...prev.goals,
          ...(updatedFields.goals || {}),
        },
        activity: {
          ...prev.activity,
          ...(updatedFields.activity || {}),
        },
        workout: {
          ...prev.workout,
          ...(updatedFields.workout || {}),
        },
        diet: {
          ...prev.diet,
          ...(updatedFields.diet || {}),
        },
        nutritionTargets: {
          ...prev.nutritionTargets,
          ...(updatedFields.nutritionTargets || {}),
        },
        preferences: {
          ...prev.preferences,
          ...(updatedFields.preferences || {}),
        },
      };
      return merged;
    });
  };

  const updateAvatar = (avatarUrlOrBase64) => {
    setUser((prev) => ({
      ...prev,
      avatar: avatarUrlOrBase64,
    }));
  };

  const removeAvatar = () => {
    setUser((prev) => ({
      ...prev,
      avatar: null,
    }));
  };

  const value = {
    isAuthenticated,
    user,
    setUser,
    isLoginOpen,
    isSignupOpen,
    isSignoutOpen,
    openLogin,
    closeLogin,
    openSignup,
    closeSignup,
    openSignout,
    closeSignout,
    login,
    signup,
    logout,
    updateProfile,
    updateAvatar,
    removeAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
