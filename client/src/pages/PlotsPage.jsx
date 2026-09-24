import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Sparkles, 
  Droplets, 
  Layers, 
  X, 
  AlertCircle,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PlotCard from '../components/PlotCard';
import api from '../lib/api';
import { PlotSchema } from '../../../shared/validators';

export default function PlotsPage() {
  const { plots, activePlot, setActivePlot, refreshPlots } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    area_acres: '',
    soil_type: 'Loam',
    default_irrigation: 'Drip',
    latitude: '',
    longitude: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleCreatePlot = async (e) => {
    e.preventDefault();
    setErrors({});

    const parseResult = PlotSchema.safeParse({
      ...formData,
      area_acres: parseFloat(formData.area_acres) || 0,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
    });

    if (!parseResult.success) {
      setErrors(parseResult.error.flatten().fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/plots', parseResult.data);
      if (res.data?.success) {
        await refreshPlots();
        setModalOpen(false);
        setFormData({
          name: '',
          area_acres: '',
          soil_type: 'Loam',
          default_irrigation: 'Drip',
          latitude: '',
          longitude: ''
        });
      }
    } catch (err) {
      console.error('[Create Plot Error]:', err);
      alert(err.response?.data?.error || 'Failed to create plot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlot = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farm plot? Associated advisories will remain in history.')) return;
    try {
      await api.delete(`/plots/${id}`);
      await refreshPlots();
    } catch (err) {
      console.error('[Delete Plot Error]:', err);
      alert('Failed to delete plot');
    }
  };

  const filteredPlots = plots.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.soil_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            Farm Land Plots
          </h1>
          <p className="text-xs text-slate-400">
            Define spatial boundaries, soil types, and primary irrigation infrastructure for precision management.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="agri-btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plot</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter plots by name or soil profile..."
          className="glass-input max-w-md w-full text-xs"
        />
        <span className="text-xs text-slate-400">
          Showing {filteredPlots.length} of {plots.length} plots
        </span>
      </div>

      {/* Plots Grid */}
      {filteredPlots.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Farm Plots Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search ? 'No plots matched your search query.' : 'Register your first physical plot of farmland to unlock tailored AI crop recommendations.'}
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="agri-btn-primary mt-4 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Plot</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlots.map((plot) => (
            <PlotCard
              key={plot.id}
              plot={plot}
              isSelected={activePlot?.id === plot.id}
              onSelect={() => setActivePlot(plot)}
              onDelete={handleDeletePlot}
            />
          ))}
        </div>
      )}

      {/* Add Plot Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 md:p-8 bg-slate-900 border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="badge-emerald">New Plot Registration</span>
            </div>
            <h2 className="text-xl font-bold text-white">Add Farm Plot</h2>
            <p className="text-xs text-slate-400 mb-6">
              Enter physical dimensions and localized soil characteristics.
            </p>

            <form onSubmit={handleCreatePlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Plot Designation Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. West Meadow - Section B"
                  className="glass-input w-full text-xs"
                  required
                />
                {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name[0]}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.area_acres}
                    onChange={(e) => handleChange('area_acres', e.target.value)}
                    placeholder="e.g. 24.5"
                    className="glass-input w-full text-xs"
                    required
                  />
                  {errors.area_acres && <p className="text-rose-400 text-xs mt-1">{errors.area_acres[0]}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Soil Texture / Type
                  </label>
                  <select
                    value={formData.soil_type}
                    onChange={(e) => handleChange('soil_type', e.target.value)}
                    className="glass-input w-full text-xs"
                  >
                    <option value="Loam">Loam (Balanced)</option>
                    <option value="Clay">Clay Soil</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Silt">Silt</option>
                    <option value="Black Cotton Soil">Black Cotton Soil</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Saline Soil">Saline Soil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Primary Irrigation Method
                </label>
                <select
                  value={formData.default_irrigation}
                  onChange={(e) => handleChange('default_irrigation', e.target.value)}
                  className="glass-input w-full text-xs"
                >
                  <option value="Drip">Drip Irrigation</option>
                  <option value="Sprinkler">Overhead Sprinkler</option>
                  <option value="Flood">Surface / Flood</option>
                  <option value="Rainfed">Rainfed</option>
                  <option value="Sub-irrigation">Sub-irrigation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Latitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => handleChange('latitude', e.target.value)}
                    placeholder="e.g. 36.7783"
                    className="glass-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Longitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => handleChange('longitude', e.target.value)}
                    placeholder="e.g. -119.4179"
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="agri-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="agri-btn-primary text-xs"
                >
                  {submitting ? 'Registering...' : 'Save Farm Plot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
