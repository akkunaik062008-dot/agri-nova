import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import api from '../lib/api';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  id: 'demo-farmer-id',
  email: 'farmer@agrivision.ai',
  full_name: 'Dr. Evelyn Vance',
  organization: 'GreenValley Agro-Cooperatives',
  region: 'North Central Agricultural Belt',
  preferred_language: 'en',
  isDemo: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plots, setPlots] = useState([]);
  const [activePlot, setActivePlot] = useState(null);

  // Load session on startup
  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          if (initialSession) {
            setSession(initialSession);
            setUser({
              id: initialSession.user.id,
              email: initialSession.user.email,
              full_name: initialSession.user.user_metadata?.full_name || 'Farmer',
              organization: initialSession.user.user_metadata?.organization_name || 'My Farm',
              region: initialSession.user.user_metadata?.region || 'Default Region',
              isDemo: false
            });
          } else {
            checkLocalSession();
          }

          const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession);
            if (currentSession?.user) {
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email,
                full_name: currentSession.user.user_metadata?.full_name || 'Farmer',
                organization: currentSession.user.user_metadata?.organization_name || 'My Farm',
                region: currentSession.user.user_metadata?.region || 'Default Region',
                isDemo: false
              });
            } else {
              checkLocalSession();
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        } else {
          checkLocalSession();
        }
      } catch (err) {
        console.warn('[Auth Init Error]:', err);
        checkLocalSession();
      } finally {
        setLoading(false);
      }
    }

    function checkLocalSession() {
      const stored = localStorage.getItem('agrivision_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } catch {
          setUser(DEFAULT_DEMO_USER);
        }
      } else {
        // By default provide seamless instant preview demo user
        setUser(DEFAULT_DEMO_USER);
        localStorage.setItem('agrivision_user', JSON.stringify(DEFAULT_DEMO_USER));
      }
    }

    initAuth();
  }, []);

  // Fetch plots when user changes
  useEffect(() => {
    if (user) {
      refreshPlots();
    }
  }, [user]);

  const refreshPlots = async () => {
    try {
      const res = await api.get('/plots');
      if (res.data?.success) {
        const fetchedPlots = res.data.data || [];
        setPlots(fetchedPlots);
        if (fetchedPlots.length > 0 && !activePlot) {
          setActivePlot(fetchedPlots[0]);
        }
      }
    } catch (err) {
      console.warn('[Fetch Plots Warning]:', err.message);
    }
  };

  const login = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet. You can sign in using Demo Farmer Mode below.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signup = async (email, password, fullName, organization, region) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet. You can test the application in Demo Farmer Mode.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          organization_name: organization,
          region: region
        }
      }
    });
    if (error) throw error;
    return data;
  };

  const loginDemoFarmer = () => {
    setUser(DEFAULT_DEMO_USER);
    localStorage.setItem('agrivision_user', JSON.stringify(DEFAULT_DEMO_USER));
    refreshPlots();
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('agrivision_user');
    setUser(null);
    setSession(null);
    setPlots([]);
    setActivePlot(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      plots,
      activePlot,
      setActivePlot,
      refreshPlots,
      login,
      signup,
      loginDemoFarmer,
      logout,
      isConfigured: isSupabaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
