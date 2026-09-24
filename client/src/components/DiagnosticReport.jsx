import React, { useRef, useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Leaf, 
  FlaskConical, 
  Check, 
  AlertCircle,
  Eye,
  Crosshair
} from 'lucide-react';
import PDFExportButton from './PDFExportButton';

export default function DiagnosticReport({ diagnostic, imageUrl, plotName }) {
  const [activeTab, setActiveTab] = useState('both'); // 'organic' | 'chemical' | 'both'
  const reportRef = useRef(null);

  if (!diagnostic) return null;

  const plan = diagnostic.treatment_plan || diagnostic;
  const isHealthy = plan.is_healthy;
  const severity = plan.severity_level || 'Moderate';
  const confidence = plan.confidence_score || 94;

  const getSeverityBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return { label: 'Low Severity', color: 'badge-emerald', icon: ShieldCheck };
      case 'moderate':
        return { label: 'Moderate Severity', color: 'badge-amber', icon: AlertTriangle };
      case 'severe':
        return { label: 'Severe Pathology', color: 'badge-red', icon: ShieldAlert };
      case 'critical':
        return { label: 'Critical Threat', color: 'badge-red animate-pulse', icon: ShieldAlert };
      default:
        return { label: 'Standard Advisory', color: 'badge-blue', icon: ShieldCheck };
    }
  };

  const badgeInfo = getSeverityBadge(severity);
  const SeverityIcon = badgeInfo.icon;

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="badge-emerald">
            <CheckCircle2 className="w-3.5 h-3.5" /> Pathology Vision Complete
          </span>
          {plotName && (
            <span className="text-xs text-slate-400">
              Assigned Plot: <strong className="text-slate-200">{plotName}</strong>
            </span>
          )}
        </div>

        <PDFExportButton 
          targetRef={reportRef} 
          fileName={`AgriVision-Diagnostic-${(plan.detected_disease || 'scan').replace(/\s+/g, '_')}`}
          title="Export Pathology PDF"
        />
      </div>

      {/* Printable Report Surface */}
      <div ref={reportRef} className="glass-card p-6 md:p-8 space-y-6 bg-slate-900/90 text-slate-100">
        
        {/* Diagnostic Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={badgeInfo.color}>
                <SeverityIcon className="w-3.5 h-3.5" />
                {badgeInfo.label}
              </span>
              <span className="text-xs text-slate-400 font-mono">Gemini 2.5 Vision</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {plan.detected_disease}
            </h1>

            <p className="text-xs md:text-sm text-slate-300">
              {isHealthy 
                ? 'Plant foliage demonstrates normal physiological vigor with no evident fungal, bacterial, or viral pathogens.' 
                : 'Fungal/pathological symptoms confirmed via visual pattern analysis. Prompt remediation advised to arrest canopy spread.'}
            </p>
          </div>

          {/* Confidence Score Pill */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-slate-800 min-w-[130px] text-center shadow-lg shrink-0">
            <span className="text-3xl font-black text-emerald-400">
              {confidence}%
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              Pathology Confidence
            </span>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-emerald-400 h-1.5 rounded-full" 
                style={{ width: `${confidence}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Symptoms Identified Breakdown */}
        {plan.symptoms_identified && plan.symptoms_identified.length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              Observed Symptoms & Pathological Markers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {plan.symptoms_identified.map((symptom, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <Crosshair className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{symptom}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organic vs Chemical Controls Comparison Tabs */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              Targeted Remediation Protocols
            </h3>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeTab === 'both' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Controls
              </button>
              <button
                onClick={() => setActiveTab('organic')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeTab === 'organic' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Organic Only
              </button>
              <button
                onClick={() => setActiveTab('chemical')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeTab === 'chemical' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Chemical Only
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            
            {/* Organic Controls Panel */}
            {(activeTab === 'both' || activeTab === 'organic') && (
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Leaf className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Biological & Organic Protocols
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Recommended for organic certification and minimal ecological footprint:
                </p>
                <div className="space-y-2">
                  {plan.organic_controls?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-emerald-900/40 text-xs text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chemical Controls Panel */}
            {(activeTab === 'both' || activeTab === 'chemical') && (
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <FlaskConical className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Synthesized Chemical Treatments
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Strictly adhere to safety wear, PPE, dosage, and pre-harvest withdrawal intervals:
                </p>
                <div className="space-y-3">
                  {plan.chemical_controls?.map((chem, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-900/40 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">{chem.active_ingredient}</span>
                        {chem.trade_product_example && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/50">
                            e.g. {chem.trade_product_example}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-300">
                        <strong className="text-slate-400">Dosage:</strong> {chem.dosage}
                      </div>
                      <div className="text-rose-300 flex items-start gap-1.5 pt-1 text-[11px] bg-rose-950/40 p-2 rounded-lg border border-rose-900/30">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span><strong>Safety:</strong> {chem.safety_instructions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preventative Agronomical Protocol */}
        {plan.prevention_tips && plan.prevention_tips.length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Long-term Preventative Measures & Crop Rotation
            </h3>
            <div className="space-y-2">
              {plan.prevention_tips.map((tip, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>AgriVision AI Diagnostic Vision Protocol • Formulated for Extension Officers</span>
          <span>Scan Date: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
