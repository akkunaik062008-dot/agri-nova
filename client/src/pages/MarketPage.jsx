import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Sparkles, 
  Calculator, 
  Layers, 
  Info,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../lib/api';

export default function MarketPage() {
  const [marketData, setMarketData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Profitability Calculator State
  const [calcCrop, setCalcCrop] = useState('Durum Wheat');
  const [calcAcres, setCalcAcres] = useState(25);
  const [calcExpectedYield, setCalcExpectedYield] = useState(3.4); // tons/acre
  const [calcCostPerAcre, setCalcCostPerAcre] = useState(450); // $ cost

  useEffect(() => {
    async function loadMarketPrices() {
      setLoading(true);
      try {
        const res = await api.get('/market/prices', {
          params: { category: selectedCategory }
        });
        if (res.data?.success) {
          setMarketData(res.data);
        }
      } catch (err) {
        console.warn('[Market Prices Error]:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadMarketPrices();
  }, [selectedCategory]);

  const categories = ['All', 'Cereals & Grains', 'Pulses & Legumes', 'Cash Crops', 'Vegetables & Fruits'];

  // Calculate dynamic ROI
  const activeCropCommodity = marketData?.commodities?.find(c => c.name.toLowerCase().includes(calcCrop.toLowerCase())) || {
    current_price_per_ton: 315.5
  };

  const currentPrice = activeCropCommodity.current_price_per_ton;
  const totalYieldTons = calcAcres * calcExpectedYield;
  const grossRevenue = totalYieldTons * currentPrice;
  const totalCost = calcAcres * calcCostPerAcre;
  const netProfit = grossRevenue - totalCost;
  const roiPercentage = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-emerald">Live Agricultural Commodities</span>
            <span className="text-xs text-slate-400 font-mono">Chicago / Regional Index</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Market Intelligence & Crop Profitability
          </h1>
          <p className="text-xs text-slate-400">
            Real-time farmgate commodity benchmarks, AI market outlook, and forward yield ROI calculators.
          </p>
        </div>
      </div>

      {/* AI Market Outlook Headline Card */}
      {marketData?.market_intelligence_summary && (
        <div className="glass-card p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/20 border-emerald-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> AI Agronomical Market Intelligence
          </div>
          <h3 className="text-base font-bold text-white">
            {marketData.market_intelligence_summary.headline}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {marketData.market_intelligence_summary.key_driver}
          </p>

          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Market Volatility</span>
              <span className="font-bold text-slate-200">{marketData.market_intelligence_summary.volatility_index}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Recommended High-ROI Crops</span>
              <span className="font-bold text-emerald-400">{marketData.market_intelligence_summary.recommended_focus}</span>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'glass-card text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Commodity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {marketData?.commodities?.map((commodity) => {
          const isPositive = commodity.change_24h_pct >= 0;
          // Format trend points for chart
          const chartData = (commodity.trend || [300, 310, 315]).map((val, idx) => ({
            day: `D-${7 - idx}`,
            price: val
          }));

          return (
            <div key={commodity.id} className="glass-card p-5 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                    {commodity.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{commodity.name}</h3>
                </div>

                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg ${
                  isPositive 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{isPositive ? `+${commodity.change_24h_pct}%` : `${commodity.change_24h_pct}%`}</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline justify-between border-y border-slate-800/80 py-2.5">
                <div>
                  <span className="text-2xl font-black text-white">
                    ${commodity.current_price_per_ton.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1.5">{commodity.price_unit}</span>
                </div>
                <span className="badge-blue text-[10px]">
                  Demand: {commodity.demand_rating}
                </span>
              </div>

              {/* Mini Trend Area Chart */}
              <div className="h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`grad-${commodity.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={isPositive ? '#10b981' : '#f43f5e'} 
                      fillOpacity={1} 
                      fill={`url(#grad-${commodity.id})`} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* AI Outlook Commentary */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                <p className="text-slate-300 line-clamp-2">
                  <strong className="text-emerald-400 font-semibold">Outlook:</strong> {commodity.ai_outlook}
                </p>
                <p className="text-amber-300 font-medium text-[10px]">
                  <strong>Action:</strong> {commodity.recommended_action}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Crop Profitability & ROI Estimator */}
      <div className="glass-card p-6 md:p-8 bg-slate-900 border-slate-700 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              AI Crop Profitability & Net Return Estimator
            </h2>
            <p className="text-xs text-slate-400">
              Simulate cashflow returns across physical acreage using localized market commodity benchmarks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Inputs */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Crop Type
                </label>
                <select
                  value={calcCrop}
                  onChange={(e) => setCalcCrop(e.target.value)}
                  className="glass-input w-full text-xs"
                >
                  <option value="Durum Wheat">Durum Wheat ($315.50/ton)</option>
                  <option value="Yellow Maize">Yellow Maize ($198.20/ton)</option>
                  <option value="Soybean">Soybeans ($462.00/ton)</option>
                  <option value="Chickpea">Chickpeas ($780.00/ton)</option>
                  <option value="Roma Tomatoes">Roma Tomatoes ($165.00/ton)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Cultivated Acres
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={calcAcres}
                  onChange={(e) => setCalcAcres(parseFloat(e.target.value) || 0)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Yield (Tons / Acre)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={calcExpectedYield}
                  onChange={(e) => setCalcExpectedYield(parseFloat(e.target.value) || 0)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Estimated Cost ($ / Acre)
                </label>
                <input
                  type="number"
                  min="0"
                  value={calcCostPerAcre}
                  onChange={(e) => setCalcCostPerAcre(parseFloat(e.target.value) || 0)}
                  className="glass-input w-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* Computed ROI Results Display */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Financial Projections ({calcCrop})
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Total Harvest Volume</span>
                <span className="text-lg font-bold text-slate-100">
                  {totalYieldTons.toFixed(1)} <span className="text-xs text-slate-400 font-normal">Tons</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Gross Crop Revenue</span>
                <span className="text-lg font-bold text-slate-100">
                  ${Math.round(grossRevenue).toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Estimated Net Profit</span>
                <span className={`text-xl font-extrabold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${Math.round(netProfit).toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Expected Return on Investment</span>
                <span className="text-xl font-extrabold text-cyan-400">
                  {roiPercentage}% ROI
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              *Projections assume benchmark commodity spot rates minus typical elevator docking and handling fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
