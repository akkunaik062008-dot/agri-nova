import axios from 'axios';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject Supabase JWT or Demo Token
api.interceptors.request.use(async (config) => {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        return config;
      }
    }

    // Check localStorage for demo session
    const storedUser = localStorage.getItem('agrivision_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      config.headers.Authorization = `Bearer ${parsed.token || 'demo-token'}`;
      config.headers['x-user-id'] = parsed.id || 'demo-farmer-id';
      config.headers['x-demo-user'] = 'true';
    } else {
      config.headers.Authorization = `Bearer demo-token`;
      config.headers['x-user-id'] = 'demo-farmer-id';
      config.headers['x-demo-user'] = 'true';
    }
  } catch (err) {
    console.warn('[API Interceptor Error]:', err);
    config.headers.Authorization = `Bearer demo-token`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for error unwrapping
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage = error.response?.data?.error || error.response?.data?.message || error.message;
    console.error('[API Error]:', customMessage);
    return Promise.reject(error);
  }
);

export default api;
