import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Sparkles, 
  ScanLine, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  FlaskConical,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [region, setRegion] = useState('North America / Central Belt');
  const [errorMessage, setErrorMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, signup, loginDemoFarmer, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      if (isSignUp) {
        await signup(email, password, fullName, organization, region);
        alert('Registration initiated! Please verify your email or sign in.');
        setIsSignUp(false);
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('[Auth Error]:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemoFarmer();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-dot-grid">
      
      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/25 mb-4">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sprout className="w-7 h-7 text-emerald-400" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AgriVision<span className="text-emerald-400">.AI</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Precision Agriculture Intelligence & Multimodal Crop Advisory
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-card p-6 sm:p-8 bg-slate-900/90 border-slate-800 shadow-2xl">
          
          {/* Quick Demo Access Bar */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-500/30 mb-6 flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-bold text-emerald-300 block">Instant 1-Click Access</span>
              <span className="text-[11px] text-slate-400">Test with preloaded farm plots & data</span>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="agri-btn-primary text-xs py-1.5 px-3"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Demo Mode</span>
            </button>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-slate-800 mb-6">
            <button
              onClick={() => { setIsSignUp(false); setErrorMessage(null); }}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition-all ${
                !isSignUp 
                  ? 'border-emerald-500 text-emerald-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setErrorMessage(null); }}
              className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition-all ${
                isSignUp 
                  ? 'border-emerald-500 text-emerald-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Register Organization
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Evelyn Vance"
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Farm Organization / Cooperative
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. GreenValley Agro-Coop"
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Primary Region
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@agrivision.ai"
                className="glass-input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="glass-input w-full text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="agri-btn-primary w-full text-xs py-3 mt-2"
            >
              {submitting ? (
                'Processing...'
              ) : isSignUp ? (
                'Create Farm Workspace'
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {!isConfigured && (
            <p className="text-[11px] text-slate-500 text-center mt-4 italic">
              Supabase credentials can be added to .env. Use Demo Mode above to explore all features instantly.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
