import { createClient } from '@supabase/supabase-js';

// Read from VITE environment variables or fallback to values entered directly in the client settings
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const localUrl = localStorage.getItem('bloom-supabase-url');
const localKey = localStorage.getItem('bloom-supabase-anon-key');

const supabaseUrl = (envUrl && envUrl !== 'https://your-supabase-url.supabase.co' && envUrl !== '') ? envUrl : (localUrl || '');
const supabaseAnonKey = (envKey && envKey !== 'your-supabase-anon-key' && envKey !== '') ? envKey : (localKey || '');

export const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         supabaseUrl.startsWith('https://') &&
         supabaseUrl.includes('.supabase.co');
};

export const getSupabaseConfig = () => {
  return {
    url: supabaseUrl,
    key: supabaseAnonKey
  };
};

export const saveSupabaseConfig = (url, key) => {
  if (url) localStorage.setItem('bloom-supabase-url', url);
  if (key) localStorage.setItem('bloom-supabase-anon-key', key);
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('bloom-supabase-url');
  localStorage.removeItem('bloom-supabase-anon-key');
};

export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
