import React, { useState } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  ThermometerSun, 
  Sun, 
  CloudRain, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

export default function WeatherWidget({ region = 'Midwest Valley Sector' }) {
  const [unit, setUnit] = useState('C'); // 'C' or 'F'

  // Microclimate data
  const currentTempC = 24;
  const currentTempF = Math.round((currentTempC * 9/5) + 32);

  const forecast = [
    { day: 'Today', icon: CloudSun, temp: 24, rain: '10%' },
    { day: 'Tomorrow', icon: Sun, temp: 27, rain: '0%' },
    { day: 'Wed', icon: CloudRain, temp: 21, rain: '75%' },
    { day: 'Thu', icon: CloudSun, temp: 23, rain: '20%' },
    { day: 'Fri', icon: Sun, temp: 26, rain: '5%' },
  ];

  return (
    <div className="glass-card p-5 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Microclimate & Spray Conditions
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">{region}</h3>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setUnit('C')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors ${
              unit === 'C' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors ${
              unit === 'F' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>
      </div>

      {/* Main Temperature & Conditions */}
      <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <CloudSun className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {unit === 'C' ? `${currentTempC}°C` : `${currentTempF}°F`}
            </div>
            <div className="text-xs text-slate-400 font-medium">Partly Cloudy • Humid</div>
          </div>
        </div>

        {/* Spray Window Status */}
        <div className="flex flex-col items-end">
          <div className="badge-emerald">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Optimal Spray Window</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Wind &lt; 9 km/h, No rain for 18h</span>
        </div>
      </div>

      {/* Key Meteorological Indicators */}
      <div className="grid grid-cols-3 gap-2 py-3 text-center border-b border-slate-800/80">
        <div className="p-2 rounded-xl bg-slate-950/50">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Humidity</span>
          </div>
          <div className="text-sm font-bold text-slate-200 mt-0.5">58%</div>
        </div>

        <div className="p-2 rounded-xl bg-slate-950/50">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wind Speed</span>
          </div>
          <div className="text-sm font-bold text-slate-200 mt-0.5">7.2 km/h</div>
        </div>

        <div className="p-2 rounded-xl bg-slate-950/50">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <ThermometerSun className="w-3.5 h-3.5 text-amber-400" />
            <span>Soil Temp</span>
          </div>
          <div className="text-sm font-bold text-slate-200 mt-0.5">
            {unit === 'C' ? '19.5°C' : '67°F'}
          </div>
        </div>
      </div>

      {/* 5-day Mini Forecast */}
      <div className="pt-3">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          5-Day Microclimate Trend
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {forecast.map((item, idx) => {
            const Icon = item.icon;
            const itemTemp = unit === 'C' ? `${item.temp}°` : `${Math.round((item.temp * 9/5) + 32)}°`;
            return (
              <div key={idx} className="flex flex-col items-center p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/50 text-center">
                <span className="text-[10px] text-slate-400 font-medium">{item.day}</span>
                <Icon className="w-4 h-4 text-amber-300 my-1" />
                <span className="text-xs font-bold text-slate-200">{itemTemp}</span>
                <span className="text-[9px] text-cyan-400 font-semibold">{item.rain}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
