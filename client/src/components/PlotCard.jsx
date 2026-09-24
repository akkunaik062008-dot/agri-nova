import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Layers, 
  Droplets, 
  Compass, 
  Sparkles, 
  ScanLine, 
  Trash2, 
  Calendar 
} from 'lucide-react';

export default function PlotCard({ plot, onDelete, isSelected, onSelect }) {
  const navigate = useNavigate();

  const handleGenerateAdvisory = (e) => {
    e.stopPropagation();
    navigate(`/advisory/new?plot_id=${plot.id}`);
  };

  const handleDiagnosticScan = (e) => {
    e.stopPropagation();
    navigate(`/diagnostics/scan?plot_id=${plot.id}`);
  };

  return (
    <div 
      onClick={onSelect}
      className={`glass-card p-5 transition-all duration-300 relative cursor-pointer group ${
        isSelected 
          ? 'border-emerald-500 shadow-emerald-950/40 ring-1 ring-emerald-500' 
          : 'glass-card-hover'
      }`}
    >
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
              {plot.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>Registered {new Date(plot.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(plot.id);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
            title="Delete Plot"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Plot Metrics */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">Total Area</span>
          <span className="text-sm font-extrabold text-slate-100">
            {plot.area_acres} <span className="text-xs font-normal text-slate-400">Acres</span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">Soil Profile</span>
          <span className="text-sm font-semibold text-emerald-400 truncate block">
            {plot.soil_type}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">Primary Irrigation</span>
          <div className="flex items-center gap-1 text-sm font-semibold text-cyan-300">
            <Droplets className="w-3.5 h-3.5" />
            <span className="truncate">{plot.default_irrigation}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">GPS Coordinates</span>
          <div className="flex items-center gap-1 text-xs font-mono text-slate-300 mt-0.5 truncate">
            <Compass className="w-3 h-3 text-amber-400 shrink-0" />
            <span>
              {plot.latitude && plot.longitude 
                ? `${Number(plot.latitude).toFixed(3)}, ${Number(plot.longitude).toFixed(3)}` 
                : 'Not Set'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={handleGenerateAdvisory}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Advisory</span>
        </button>

        <button
          onClick={handleDiagnosticScan}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 text-xs font-semibold transition-all"
        >
          <ScanLine className="w-3.5 h-3.5 text-cyan-400" />
          <span>Leaf Scan</span>
        </button>
      </div>
    </div>
  );
}
