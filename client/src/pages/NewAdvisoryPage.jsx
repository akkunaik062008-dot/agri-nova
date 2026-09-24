import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SoilMetricsForm from '../components/SoilMetricsForm';
import AdvisoryResultCard from '../components/AdvisoryResultCard';
import api from '../lib/api';

export default function NewAdvisoryPage() {
  const [searchParams] = useSearchParams();
  const { plots, activePlot } = useAuth();
  
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [advisoryResult, setAdvisoryResult] = useState(null);
  const [submittedInputs, setSubmittedInputs] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Parse plot_id from URL query if present
  useEffect(() => {
    const plotIdFromQuery = searchParams.get('plot_id');
    if (plotIdFromQuery && plots.length > 0) {
      const match = plots.find(p => p.id === plotIdFromQuery);
      if (match) setSelectedPlot(match);
    } else if (activePlot) {
      setSelectedPlot(activePlot);
    }
  }, [searchParams, plots, activePlot]);

  const handleGenerateAdvisory = async (formData) => {
    setLoading(true);
    setApiError(null);
    setSubmittedInputs(formData);

    try {
      const res = await api.post('/advisory/generate', formData);
      if (res.data?.success) {
        setAdvisoryResult(res.data.data);
      } else {
        throw new Error(res.data?.error || 'Failed to generate advisory');
      }
    } catch (err) {
      console.error('[Generate Advisory Error]:', err);
      const msg = err.response?.data?.error || err.message || 'An error occurred during Gemini AI processing.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-emerald">Multi-Variable Recommendation</span>
            <span className="text-xs text-slate-400 font-mono">AgriVision AI Core</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            New AI Crop Advisory
          </h1>
          <p className="text-xs text-slate-400">
            Formulate scientific crop recommendations based on soil N-P-K balances, pH thresholds, and economics.
          </p>
        </div>

        {advisoryResult && (
          <button
            onClick={() => setAdvisoryResult(null)}
            className="agri-btn-secondary text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>New Parameters</span>
          </button>
        )}
      </div>

      {/* Error Alert */}
      {apiError && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <strong className="font-semibold block">Advisory Processing Alert</strong>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Main Flow: Form vs Result Card */}
      {!advisoryResult ? (
        <SoilMetricsForm
          plots={plots}
          activePlot={selectedPlot || plots[0]}
          onGenerate={handleGenerateAdvisory}
          isLoading={loading}
        />
      ) : (
        <AdvisoryResultCard
          advisory={advisoryResult}
          soilInputs={submittedInputs}
          plotName={selectedPlot?.name || 'Assigned Farm Plot'}
        />
      )}
    </div>
  );
}
