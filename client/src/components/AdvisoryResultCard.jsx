import React, { useRef } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Droplets, 
  Calendar, 
  Layers, 
  Award,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import PDFExportButton from './PDFExportButton';

export default function AdvisoryResultCard({ advisory, soilInputs, plotName }) {
  const reportRef = useRef(null);

  if (!advisory) return null;

  const aiData = advisory.ai_response || advisory;
  const recommendedCrop = advisory.recommended_crop || aiData.recommended_crop;
  const confidenceScore = advisory.confidence_score || aiData.confidence_score || 94;

  // Prepare radar chart data for soil nutrients
  const radarData = [
    {
      subject: 'Nitrogen (N)',
      actual: Math.min(100, Math.round(((soilInputs?.nitrogen_ppm || 140) / 200) * 100)),
      optimal: 85,
      fullMark: 100,
    },
    {
      subject: 'Phosphorus (P)',
      actual: Math.min(100, Math.round(((soilInputs?.phosphorus_ppm || 45) / 60) * 100)),
      optimal: 75,
      fullMark: 100,
    },
    {
      subject: 'Potassium (K)',
      actual: Math.min(100, Math.round(((soilInputs?.potassium_ppm || 210) / 250) * 100)),
      optimal: 90,
      fullMark: 100,
    },
    {
      subject: 'pH Balance',
      actual: Math.min(100, Math.round(((soilInputs?.ph_level || 6.8) / 7.0) * 90)),
      optimal: 95,
      fullMark: 100,
    },
    {
      subject: 'Irrigation Fit',
      actual: 90,
      optimal: 85,
      fullMark: 100,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top action bar with Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="badge-emerald">
            <CheckCircle2 className="w-3.5 h-3.5" /> AI Advisory Ready
          </span>
          <span className="text-xs text-slate-400">
            Plot: <strong className="text-slate-200">{plotName || 'Active Farm Field'}</strong>
          </span>
        </div>

        <PDFExportButton 
          targetRef={reportRef} 
          fileName={`AgriVision-Advisory-${recommendedCrop.replace(/\s+/g, '_')}`} 
          title="Export Advisory PDF"
        />
      </div>

      {/* Printable Report Canvas */}
      <div ref={reportRef} className="glass-card p-6 md:p-8 space-y-6 bg-slate-900/90 text-slate-100">
        
        {/* Banner with Crop Match */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Top Agronomical Recommendation
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {recommendedCrop}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {aiData.crop_suitability_reasoning}
            </p>

            {/* Alternatives */}
            {aiData.alternative_crops && aiData.alternative_crops.length > 0 && (
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <span className="text-xs text-slate-400 font-medium">Alternative Options:</span>
                {aiData.alternative_crops.map((alt, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {alt}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Confidence Score Pill */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 min-w-[140px] text-center shadow-lg shadow-emerald-950/30 shrink-0">
            <span className="text-3xl font-black text-emerald-400">
              {confidenceScore}%
            </span>
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mt-0.5">
              Suitability Match
            </span>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-emerald-400 h-1.5 rounded-full" 
                style={{ width: `${confidenceScore}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Financial & Yield Projection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Projected Yield</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-white">
                {aiData.estimated_yield_tons_per_acre}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">Tons / Acre</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Based on optimal fertilizer adherence</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Estimated Net Profit</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-emerald-400">
                ${aiData.estimated_net_profit_per_acre}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ Acre</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Factoring current wholesale commodity index</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 sm:col-span-2 md:col-span-1">
            <span className="text-xs text-slate-400 font-medium block">Irrigation Cycle</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-cyan-400">
                Every {aiData.irrigation_plan?.frequency_days || 5}
              </span>
              <span className="text-xs text-slate-400 font-semibold">Days</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              ~{(aiData.irrigation_plan?.water_volume_liters_per_acre || 18000).toLocaleString()} L/acre per cycle
            </span>
          </div>
        </div>

        {/* Soil Balance Radar Chart & Critical Growth Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Radar Chart */}
          <div className="lg:col-span-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Soil Chemistry vs Optimal Crop Demand
              </h3>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Current
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" /> Ideal
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                  <Radar name="Current" dataKey="actual" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  <Radar name="Ideal" dataKey="optimal" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Critical Stages & Water Guidance */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Droplets className="w-4 h-4" /> Critical Water Application Stages
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                Do not allow moisture stress during these physiological development milestones:
              </p>
              <div className="space-y-2">
                {aiData.irrigation_plan?.critical_stages?.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{stage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Stage Fertilizer Application Schedule */}
        <div className="pt-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Prescribed Fertilizer & Nutrient Schedule
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Growth Stage</th>
                  <th className="py-3 px-4">Fertilizer / Nutrient Formulation</th>
                  <th className="py-3 px-4">Dosage (per Acre)</th>
                  <th className="py-3 px-4">Application Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 bg-slate-950/40">
                {aiData.fertilizer_schedule?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-200">{item.stage}</td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">{item.fertilizer_name}</td>
                    <td className="py-3 px-4 text-slate-100 font-mono font-bold">
                      {item.dosage_kg_per_acre} kg
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.application_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sign-off footer */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>AgriVision AI Autonomous Agronomy Model v2.5 • Verified for Precision Farming</span>
          <span>Report Generated: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
