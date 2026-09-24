import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ScanLine, AlertCircle, ArrowLeft, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import DiagnosticReport from '../components/DiagnosticReport';
import api from '../lib/api';

export default function DiagnosticPage() {
  const [searchParams] = useSearchParams();
  const { plots, activePlot } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPlotId, setSelectedPlotId] = useState(activePlot?.id || '');
  const [loading, setLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const plotIdFromQuery = searchParams.get('plot_id');
    if (plotIdFromQuery) {
      setSelectedPlotId(plotIdFromQuery);
    } else if (activePlot) {
      setSelectedPlotId(activePlot.id);
    }
  }, [searchParams, activePlot]);

  const handleImageSelected = (imageData) => {
    setSelectedImage(imageData);
    setDiagnosticResult(null);
    setApiError(null);
  };

  const handleStartAnalysis = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setApiError(null);

    try {
      const res = await api.post('/diagnostics/analyze', {
        image: selectedImage,
        plot_id: selectedPlotId || null
      });

      if (res.data?.success) {
        setDiagnosticResult(res.data.data);
      } else {
        throw new Error(res.data?.error || 'Diagnostic scan failed');
      }
    } catch (err) {
      console.error('[Diagnostic Analysis Error]:', err);
      const msg = err.response?.data?.error || err.message || 'Diagnostic vision processing failed.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentPlot = plots.find(p => p.id === selectedPlotId);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Title Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-emerald">Multimodal Vision Pathologist</span>
            <span className="text-xs text-slate-400 font-mono">Gemini 2.5 Vision</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-emerald-400" />
            Leaf Disease Diagnostic Scanner
          </h1>
          <p className="text-xs text-slate-400">
            Instant AI visual examination of plant leaves and stems for early infection detection.
          </p>
        </div>

        {diagnosticResult && (
          <button
            onClick={() => {
              setDiagnosticResult(null);
              setSelectedImage(null);
            }}
            className="agri-btn-secondary text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Scan Another Leaf</span>
          </button>
        )}
      </div>

      {/* Error Alert */}
      {apiError && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <strong className="font-semibold block">Diagnostic Scanner Alert</strong>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Main Flow: Image Uploader vs Diagnostic Report */}
      {!diagnosticResult ? (
        <div className="space-y-6">
          
          {/* Plot Association Dropdown */}
          {plots.length > 0 && (
            <div className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Link Scan to Farm Plot:</span>
              </div>
              <select
                value={selectedPlotId}
                onChange={(e) => setSelectedPlotId(e.target.value)}
                className="glass-input text-xs max-w-xs"
              >
                <option value="">-- No specific plot (Field Sample) --</option>
                {plots.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.area_acres} ac - {p.soil_type})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Image Uploader & Live Camera */}
          <ImageUploader
            onImageSelected={handleImageSelected}
            currentImage={selectedImage}
            isLoading={loading}
          />

          {/* Execute Analysis Action */}
          {selectedImage && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={loading}
                className="agri-btn-primary min-w-[220px]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Leaf Pathology...</span>
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4" />
                    <span>Analyze Disease with Gemini Vision</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <DiagnosticReport
          diagnostic={diagnosticResult}
          imageUrl={selectedImage}
          plotName={currentPlot?.name}
        />
      )}
    </div>
  );
}
