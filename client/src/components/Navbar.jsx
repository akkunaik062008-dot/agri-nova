import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  LayoutDashboard, 
  MapPin, 
  Sparkles, 
  ScanLine, 
  TrendingUp, 
  History, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  FlaskConical
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, plots, activePlot, setActivePlot, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [plotDropdownOpen, setPlotDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Farm Plots', path: '/plots', icon: MapPin },
    { name: 'AI Advisory', path: '/advisory/new', icon: Sparkles },
    { name: 'Leaf Diagnostics', path: '/diagnostics/scan', icon: ScanLine },
    { name: 'Market Intelligence', path: '/market', icon: TrendingUp },
    { name: 'Field History', path: '/history', icon: History },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    AgriVision<span className="text-emerald-400">.AI</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    v2.5
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Smart Farming & Crop Advisory
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side Tools & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Active Plot Selector */}
            {plots.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setPlotDropdownOpen(!plotDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-all"
                  title="Select Active Farm Plot"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="max-w-[120px] truncate">{activePlot?.name || 'Select Plot'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {plotDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-card p-1.5 shadow-2xl z-50">
                    <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Active Plot
                    </div>
                    {plots.map((plot) => (
                      <button
                        key={plot.id}
                        onClick={() => {
                          setActivePlot(plot);
                          setPlotDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg text-left transition-colors ${
                          activePlot?.id === plot.id
                            ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{plot.name}</span>
                        <span className="text-[10px] text-slate-500">{plot.area_acres} ac</span>
                      </button>
                    ))}
                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <Link
                        to="/plots"
                        onClick={() => setPlotDropdownOpen(false)}
                        className="block w-full text-center px-2 py-1.5 text-xs text-emerald-400 hover:bg-slate-800 rounded-lg"
                      >
                        + Manage Plots
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Link */}
            <Link
              to="/settings"
              className={`p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors ${
                location.pathname === '/settings' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : ''
              }`}
              title="Settings & System Health"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* User Profile Avatar / Logout */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-xs text-slate-950 shadow-md">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'F'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[110px]">
                  {user?.full_name || 'Farmer'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {user?.isDemo ? 'Demo Mode' : 'Verified'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                {user?.full_name?.charAt(0) || 'F'}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">{user?.full_name}</p>
                <p className="text-slate-400 text-[10px]">{user?.organization || 'Farm Workspace'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-950/50 text-rose-400 border border-rose-800/50 text-xs font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
