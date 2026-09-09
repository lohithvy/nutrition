/**
 * Vitalis / NutriFlow - Reusable Supabase Client
 *
 * Configured for Supabase project ref: zqraxlkfiqgaecdslkzu
 * Supports both Vite (VITE_*) and Expo (EXPO_PUBLIC_*) environments.
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Safely resolve environment variables across Vite, Webpack, Node, and Expo
const getEnvVar = (key: string): string => {
  // Check process.env (Expo, Node, Webpack, Metro, Vite build define)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }

  // Check runtime globals for Vite browser injection
  const globalEnv = (globalThis as any)?.__VITE_ENV__ || (globalThis as any)?.importMetaEnv;
  if (globalEnv && globalEnv[key]) {
    return globalEnv[key];
  }

  return '';
};

// Supabase project credentials
export const SUPABASE_URL =
  getEnvVar('VITE_SUPABASE_URL') ||
  getEnvVar('EXPO_PUBLIC_SUPABASE_URL') ||
  'https://zqraxlkfiqgaecdslkzu.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY =
  getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY') ||
  getEnvVar('VITE_SUPABASE_ANON_KEY') ||
  getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY') ||
  'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';

// Storage adapter: AsyncStorage for React Native / mobile, fallback to window.localStorage on Web
const customStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch {
      // Storage write error handling
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch {
      // Storage remove error handling
    }
  },
};

/**
 * Reusable Supabase client instance
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: customStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

export default supabase;
