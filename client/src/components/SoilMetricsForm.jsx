import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Calendar, 
  FlaskConical, 
  DollarSign, 
  ShoppingBag, 
  Droplets,
  AlertCircle,
  HelpCircle,
  Wand2
} from 'lucide-react';
import { AdvisoryInputSchema } from '../../../shared/validators';

export default function SoilMetricsForm({ plots, activePlot, onGenerate, isLoading }) {
  const [formData, setFormData] = useState({
    plot_id: activePlot?.id || '',
    season: 'Rabi',
    soil_type: activePlot?.soil_type || 'Loam',
    nitrogen_ppm: 140,
    phosphorus_ppm: 45,
    potassium_ppm: 210,
    ph_level: 6.8,
    irrigation_type: activePlot?.default_irrigation || 'Drip',
    budget_per_acre: 1200,
    target_market: 'Commercial Processing'
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Sync active plot if changed externally
  useEffect(() => {
    if (activePlot) {
      setFormData(prev => ({
        ...prev,
        plot_id: activePlot.id,
        soil_type: activePlot.soil_type,
        irrigation_type: activePlot.default_irrigation
      }));
    }
  }, [activePlot]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error on edit
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const applyPreset = (preset) => {
    if (preset === 'fertile-loam') {
      setFormData(prev => ({
        ...prev,
        nitrogen_ppm: 165,
        phosphorus_ppm: 55,
        potassium_ppm: 240,
        ph_level: 6.8,
        soil_type: 'Loam'
      }));
    } else if (preset === 'black-cotton') {
      setFormData(prev => ({
        ...prev,
        nitrogen_ppm: 110,
        phosphorus_ppm: 30,
        potassium_ppm: 280,
        ph_level: 7.6,
        soil_type: 'Black Cotton Soil'
      }));
    } else if (preset === 'acidic-red') {
      setFormData(prev => ({
        ...prev,
        nitrogen_ppm: 90,
        phosphorus_ppm: 22,
        potassium_ppm: 140,
        ph_level: 5.4,
        soil_type: 'Red Sandy Loam'
      }));
    } else if (preset === 'depleted-sandy') {
      setFormData(prev => ({
        ...prev,
        nitrogen_ppm: 45,
        phosphorus_ppm: 15,
        potassium_ppm: 85,
        ph_level: 6.2,
        soil_type: 'Sandy Loam'
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = AdvisoryInputSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      // Automatically jump to the step with error
      if (fieldErrors.plot_id || fieldErrors.season) setStep(1);
      else if (fieldErrors.nitrogen_ppm || fieldErrors.phosphorus_ppm || fieldErrors.potassium_ppm || fieldErrors.ph_level) setStep(2);
      else setStep(3);
      return;
    }

    setErrors({});
    onGenerate(result.data);
  };

  // Helper for pH color spectrum
  const getPhIndicator = (ph) => {
    if (ph < 6.0) return { label: 'Acidic', color: 'text-amber-400 bg-amber-950/80 border-amber-800' };
    if (ph <= 7.5) return { label: 'Neutral (Optimal)', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' };
    return { label: 'Alkaline', color: 'text-indigo-400 bg-indigo-950/80 border-indigo-800' };
  };

  const phStatus = getPhIndicator(formData.ph_level);

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-emerald">Step-by-Step AI Engine</span>
            <span className="text-xs text-slate-400 font-mono">Gemini 2.5 Flash</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Generate Precision Crop Advisory
          </h2>
          <p className="text-xs text-slate-400">
            Feed microclimate, N-P-K balances, and economic inputs to compute optimal recommendations.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5 text-emerald-400" /> Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('fertile-loam')}
            className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Fertile Loam
          </button>
          <button
            type="button"
            onClick={() => applyPreset('black-cotton')}
            className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Black Soil
          </button>
          <button
            type="button"
            onClick={() => applyPreset('acidic-red')}
            className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Acidic Soil
          </button>
        </div>
      </div>

      {/* Progress Tabs */}
      <div className="grid grid-cols-3 gap-2 my-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
            step === 1
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
              : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          1. Plot & Season
        </button>
        <button
          type="button"
          onClick={() => setStep(2)}
          className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
            step === 2
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
              : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          2. Soil Chemistry (NPK & pH)
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
            step === 3
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
              : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          3. Water & Budget
        </button>
      </div>

      {/* STEP 1: Farm Plot & Season */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Select Farm Plot</span>
              <span className="text-[11px] text-slate-500 lowercase font-normal">physical land section</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plots.map((plot) => (
                <div
                  key={plot.id}
                  onClick={() => {
                    handleChange('plot_id', plot.id);
                    handleChange('soil_type', plot.soil_type);
                    handleChange('irrigation_type', plot.default_irrigation);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.plot_id === plot.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{plot.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {plot.area_acres} ac
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{plot.soil_type}</span>
                    <span>•</span>
                    <span>{plot.default_irrigation}</span>
                  </div>
                </div>
              ))}
            </div>
            {errors.plot_id && (
              <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.plot_id[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Agricultural Season
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Kharif', 'Rabi', 'Zaid', 'Spring', 'Summer', 'Autumn', 'Winter'].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => handleChange('season', s)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    formData.season === s
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="agri-btn-primary"
            >
              Next: Soil Chemistry &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Soil Chemistry (N-P-K & pH) */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                Soil pH Level: <span className="text-emerald-400 text-sm font-bold">{formData.ph_level}</span>
              </label>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${phStatus.color}`}>
                {phStatus.label}
              </span>
            </div>
            <input
              type="range"
              min="3.0"
              max="11.0"
              step="0.1"
              value={formData.ph_level}
              onChange={(e) => handleChange('ph_level', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>3.0 (Strong Acidic)</span>
              <span>7.0 (Neutral)</span>
              <span>11.0 (Strong Alkaline)</span>
            </div>
          </div>

          {/* N-P-K Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nitrogen */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">Nitrogen (N)</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {formData.nitrogen_ppm} <span className="text-[10px] text-slate-400">ppm</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={formData.nitrogen_ppm}
                onChange={(e) => handleChange('nitrogen_ppm', parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {formData.nitrogen_ppm < 100 ? 'Low (Needs supplementation)' : formData.nitrogen_ppm > 250 ? 'Excessive' : 'Optimal'}
              </span>
            </div>

            {/* Phosphorus */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">Phosphorus (P)</span>
                <span className="text-sm font-mono font-bold text-amber-400">
                  {formData.phosphorus_ppm} <span className="text-[10px] text-slate-400">ppm</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={formData.phosphorus_ppm}
                onChange={(e) => handleChange('phosphorus_ppm', parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {formData.phosphorus_ppm < 30 ? 'Low' : formData.phosphorus_ppm > 80 ? 'High' : 'Adequate'}
              </span>
            </div>

            {/* Potassium */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">Potassium (K)</span>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {formData.potassium_ppm} <span className="text-[10px] text-slate-400">ppm</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={formData.potassium_ppm}
                onChange={(e) => handleChange('potassium_ppm', parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {formData.potassium_ppm < 120 ? 'Low' : formData.potassium_ppm > 300 ? 'High' : 'Optimal'}
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="agri-btn-secondary"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="agri-btn-primary"
            >
              Next: Water & Budget &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Water, Budget & Target Market */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Irrigation System
              </label>
              <select
                value={formData.irrigation_type}
                onChange={(e) => handleChange('irrigation_type', e.target.value)}
                className="glass-input w-full"
              >
                <option value="Drip">Drip Irrigation (Precision & High Water-Saving)</option>
                <option value="Sprinkler">Center Pivot / Overhead Sprinkler</option>
                <option value="Flood">Surface / Flood Irrigation</option>
                <option value="Rainfed">Rainfed (Dryland Non-Irrigated)</option>
                <option value="Sub-irrigation">Sub-irrigation / Water Table Control</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Market Channel
              </label>
              <select
                value={formData.target_market}
                onChange={(e) => handleChange('target_market', e.target.value)}
                className="glass-input w-full"
              >
                <option value="Commercial Processing">Commercial Food Processing & Mills</option>
                <option value="Local Wet Market">Local Wet Market & Direct Consumers</option>
                <option value="Export">Export Grade (Phytosanitary Certified)</option>
                <option value="Organic Certified">Organic Certified Specialty Market</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Budget Allocation per Acre ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-500 font-bold">$</span>
                <input
                  type="number"
                  min="50"
                  max="50000"
                  value={formData.budget_per_acre}
                  onChange={(e) => handleChange('budget_per_acre', parseFloat(e.target.value))}
                  className="glass-input w-full pl-8"
                  placeholder="e.g. 1200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Soil Texture Category
              </label>
              <input
                type="text"
                value={formData.soil_type}
                onChange={(e) => handleChange('soil_type', e.target.value)}
                className="glass-input w-full"
                placeholder="e.g. Sandy Loam, Clay, Silt"
              />
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="agri-btn-secondary"
            >
              &larr; Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="agri-btn-primary min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Computing Gemini Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Advisory</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
