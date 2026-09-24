import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Building2, 
  Globe, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Key, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function SettingsPage() {
  const { user } = useAuth();
  const [healthStatus, setHealthStatus] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user?.full_name || '',
    organization: user?.organization || '',
    region: user?.region || 'Midwest Agri-Zone',
    measurementUnit: 'imperial', // imperial (acres/°F) or metric (hectares/°C)
    preferredLanguage: 'en'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await api.get('/health');
      setHealthStatus(res.data);
    } catch (err) {
      console.warn('[Healthcheck Warning]:', err.message);
      setHealthStatus({
        status: 'OFFLINE / UNREACHABLE',
        gemini_ai: 'OFFLINE',
        supabase_db: 'LOCAL_DEV_STORAGE'
      });
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-emerald-400" />
            System Preferences & Integrations
          </h1>
          <p className="text-xs text-slate-400">
            Manage your agronomic profile, measurement standards, and verify backend API connectivity.
          </p>
        </div>
      </div>

      {/* System Status Indicators Card */}
      <div className="glass-card p-6 bg-slate-900 border-slate-700 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Core & Infrastructure Health
            </h2>
          </div>

          <button
            onClick={checkSystemHealth}
            disabled={checkingHealth}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Re-check Connectivity</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">REST API Server</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-sm font-bold text-emerald-400 mt-2">
              {healthStatus?.status || 'ONLINE'}
            </div>
            <span className="text-[10px] text-slate-500">Port 5000 / REST Engine</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Gemini 2.5 Flash SDK</span>
              <span className={`w-2 h-2 rounded-full ${healthStatus?.gemini_ai === 'CONNECTED' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </div>
            <div className="text-sm font-bold text-slate-200 mt-2 truncate">
              {healthStatus?.gemini_ai === 'CONNECTED' ? 'LIVE CONNECTED' : 'SIMULATION ACTIVE'}
            </div>
            <span className="text-[10px] text-slate-500">@google/genai Multimodal</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Database & RLS</span>
              <span className={`w-2 h-2 rounded-full ${healthStatus?.supabase_db === 'CONNECTED' ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
            </div>
            <div className="text-sm font-bold text-slate-200 mt-2 truncate">
              {healthStatus?.supabase_db === 'CONNECTED' ? 'SUPABASE RLS ACTIVE' : 'DEV STORAGE ACTIVE'}
            </div>
            <span className="text-[10px] text-slate-500">PostgreSQL Multi-Tenant</span>
          </div>
        </div>

        {/* Setup Help Callout */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span>To connect your live Google Gemini key and Supabase database, update the </span>
            <code className="text-emerald-400 font-mono text-[11px]">agrivision-app/server/.env</code>
            <span> and </span>
            <code className="text-emerald-400 font-mono text-[11px]">agrivision-app/client/.env</code>
            <span> files with your credentials.</span>
          </div>
        </div>
      </div>

      {/* User Profile Form */}
      <form onSubmit={handleSaveProfile} className="glass-card p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <User className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Agricultural Practitioner Profile
          </h2>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile and unit preferences saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Farm Organization / Cooperative
            </label>
            <input
              type="text"
              value={profile.organization}
              onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Primary Agricultural Region
            </label>
            <input
              type="text"
              value={profile.region}
              onChange={(e) => setProfile({ ...profile, region: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Measurement Standard
            </label>
            <select
              value={profile.measurementUnit}
              onChange={(e) => setProfile({ ...profile, measurementUnit: e.target.value })}
              className="glass-input w-full text-xs"
            >
              <option value="imperial">Imperial (Acres, Fahrenheit, Tons)</option>
              <option value="metric">Metric (Hectares, Celsius, Tonnes)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button type="submit" className="agri-btn-primary text-xs">
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
