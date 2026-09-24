import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  MapPin, 
  Sparkles, 
  ScanLine, 
  TrendingUp, 
  History, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Activity,
  Plus,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from '../components/WeatherWidget';
import PlotCard from '../components/PlotCard';
import api from '../lib/api';

export default function Dashboard() {
  const { user, plots, activePlot, setActivePlot } = useAuth();
  const navigate = useNavigate();
  const [recentAdvisories, setRecentAdvisories] = useState([]);
  const [recentDiagnostics, setRecentDiagnostics] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await api.get('/history/all');
        if (res.data?.success) {
          const items = res.data.data || [];
          setRecentAdvisories(items.filter(i => i.record_type === 'advisory').slice(0, 3));
          setRecentDiagnostics(items.filter(i => i.record_type === 'diagnostic').slice(0, 2));
        }
      } catch (err) {
        console.warn('[Dashboard Data Warning]:', err.message);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalAcreage = plots.reduce((acc, p) => acc + (parseFloat(p.area_acres) || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge-emerald">AgriVision AI Workspace</span>
              <span className="text-xs text-slate-400 font-mono">
                {user?.organization || 'Registered Farm'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.full_name || 'Farmer'} 🌾
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your farm intelligence dashboard is synchronized with real-time microclimate sensors and Gemini multimodal diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/advisory/new" className="agri-btn-primary">
              <Sparkles className="w-4 h-4" />
              <span>New AI Advisory</span>
            </Link>
            <Link to="/diagnostics/scan" className="agri-btn-secondary">
              <ScanLine className="w-4 h-4 text-emerald-400" />
              <span>Scan Leaf Disease</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Registered Plots</span>
            <div className="text-2xl font-black text-white">{plots.length}</div>
            <span className="text-[10px] text-emerald-400">Physical zones mapped</span>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Cultivated Area</span>
            <div className="text-2xl font-black text-white">{totalAcreage.toFixed(1)} <span className="text-xs font-normal text-slate-400">ac</span></div>
            <span className="text-[10px] text-cyan-400">Precision monitored</span>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Canopy Health Index</span>
            <div className="text-2xl font-black text-amber-400">92%</div>
            <span className="text-[10px] text-slate-400">Good physiological status</span>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Market Trend Status</span>
            <div className="text-2xl font-black text-purple-300">+2.4%</div>
            <span className="text-[10px] text-emerald-400">Durum Wheat strong</span>
          </div>
        </div>
      </div>

      {/* Grid: Weather & Fast Leaf Diagnostic CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Weather Widget */}
        <div className="lg:col-span-7">
          <WeatherWidget region={user?.region || 'Midwest Agri-Zone'} />
        </div>

        {/* Quick Diagnostic Callout */}
        <div className="lg:col-span-5 glass-card p-6 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-emerald">Visual AI Scanner</span>
            <span className="text-xs text-slate-400">Instant Pathology</span>
          </div>

          <h3 className="text-lg font-bold text-white">
            Suspicious Leaf Discoloration?
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Snap a close-up photo of infected leaves or stems. Gemini Vision pinpoints early blight, rust, mildew, and prescribes organic/chemical remedies in seconds.
          </p>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Camera & Upload Ready</span>
            </div>
            <Link to="/diagnostics/scan" className="agri-btn-primary text-xs">
              <ScanLine className="w-4 h-4" />
              <span>Launch Scanner</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Farm Plots Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Your Farm Plots
            </h2>
            <p className="text-xs text-slate-400">
              Manage distinct land segments with localized soil profiles and irrigation sources.
            </p>
          </div>

          <Link to="/plots" className="agri-btn-secondary text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Add / Manage Plots</span>
          </Link>
        </div>

        {plots.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-slate-400 text-sm">No farm plots registered yet.</p>
            <Link to="/plots" className="agri-btn-primary mt-3 text-xs">
              Register First Plot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plots.map((plot) => (
              <PlotCard
                key={plot.id}
                plot={plot}
                isSelected={activePlot?.id === plot.id}
                onSelect={() => setActivePlot(plot)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Advisories Ledger */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Recent AI Advisories & Field Scans
            </h3>
            <p className="text-xs text-slate-400">
              Audit trail of previous crop recommendations and pathology records.
            </p>
          </div>

          <Link to="/history" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
            <span>View Complete History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/80 mt-2">
          {recentAdvisories.length === 0 && recentDiagnostics.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No historical advisories or diagnostics found. Generate your first advisory above!
            </div>
          ) : (
            [...recentAdvisories, ...recentDiagnostics].map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.record_type === 'advisory' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}>
                    {item.record_type === 'advisory' ? <Sparkles className="w-4 h-4" /> : <ScanLine className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-md">{item.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-500 hidden sm:block">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <span className="badge-emerald text-[10px]">
                    {item.score}% Match
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
