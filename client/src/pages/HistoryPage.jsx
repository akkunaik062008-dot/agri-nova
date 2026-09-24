import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Sparkles, 
  ScanLine, 
  Calendar, 
  MapPin, 
  Eye, 
  X,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import api from '../lib/api';
import AdvisoryResultCard from '../components/AdvisoryResultCard';
import DiagnosticReport from '../components/DiagnosticReport';

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'advisory' | 'diagnostic'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [filterType, searchTerm]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/history/all', {
        params: {
          type: filterType,
          search: searchTerm
        }
      });
      if (res.data?.success) {
        setHistoryItems(res.data.data || []);
      }
    } catch (err) {
      console.warn('[Fetch History Error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-emerald-400" />
            Field Intelligence Ledger & History
          </h1>
          <p className="text-xs text-slate-400">
            Audit trail of previous AI crop recommendations, soil tests, and leaf disease diagnostic scans.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Type Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === 'all' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilterType('advisory')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              filterType === 'advisory' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Advisories</span>
          </button>
          <button
            onClick={() => setFilterType('diagnostic')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              filterType === 'diagnostic' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ScanLine className="w-3 h-3" />
            <span>Disease Scans</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop, disease, or plot..."
            className="glass-input w-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* History Ledger Table / Cards */}
      {loading ? (
        <div className="glass-card p-12 text-center text-xs text-slate-400">
          Loading historical agronomic records...
        </div>
      ) : historyItems.length === 0 ? (
        <div className="glass-card p-12 text-center text-xs text-slate-500">
          No matching records found. Generate an advisory or leaf scan to begin compiling history.
        </div>
      ) : (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedRecord(item)}
              className="glass-card p-4 hover:border-emerald-500/40 cursor-pointer transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.record_type === 'advisory'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}>
                  {item.record_type === 'advisory' ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <ScanLine className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white hover:text-emerald-300">
                      {item.title}
                    </h3>
                    <span className={item.record_type === 'advisory' ? 'badge-emerald text-[10px]' : 'badge-amber text-[10px]'}>
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {item.summary}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {item.plot_name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side stats & view button */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase">Confidence</span>
                  <span className="text-sm font-bold text-emerald-400">{item.score}%</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRecord(item)}
                  className="agri-btn-secondary text-xs px-3 py-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Inspect Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-8 bg-slate-900 border border-slate-700 rounded-2xl p-6 relative">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 pb-3 border-b border-slate-800">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Historical Field Record #{selectedRecord.id.slice(0, 8)}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                {selectedRecord.title}
              </h2>
            </div>

            {selectedRecord.record_type === 'advisory' ? (
              <AdvisoryResultCard
                advisory={selectedRecord.payload}
                soilInputs={selectedRecord.payload.soil_inputs}
                plotName={selectedRecord.plot_name}
              />
            ) : (
              <DiagnosticReport
                diagnostic={selectedRecord.payload}
                imageUrl={selectedRecord.payload.image_url}
                plotName={selectedRecord.plot_name}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
