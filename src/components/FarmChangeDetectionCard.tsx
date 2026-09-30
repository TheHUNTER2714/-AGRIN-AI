import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw, 
  Sparkles, 
  Droplet, 
  CloudRain, 
  Satellite, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { 
  type FarmChangeDetectionResponse, 
  fetchFarmChangeDetection 
} from '../services/api';
import { soundFx } from '../utils/audio';

interface FarmChangeDetectionCardProps {
  farmId?: string;
  onOpenWhyModal?: () => void;
}

export const FarmChangeDetectionCard: React.FC<FarmChangeDetectionCardProps> = ({
  farmId = 'demo-farm-01',
  onOpenWhyModal
}) => {
  const [data, setData] = useState<FarmChangeDetectionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchFarmChangeDetection(farmId)
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [farmId]);

  if (loading) {
    return (
      <div className="p-5 rounded-3xl bg-black/40 border border-white/10 animate-pulse text-xs font-mono text-neutral-400">
        Analyzing differential farm context across observation windows...
      </div>
    );
  }

  if (!data) return null;

  const { deltas } = data;

  const renderDeltaPill = (delta: number, unit = '', invertPositive = false) => {
    const isUp = delta > 0;
    const isZero = Math.abs(delta) < 0.001;
    if (isZero) {
      return (
        <span className="flex items-center gap-1 text-neutral-400 font-bold">
          <Minus className="w-3 h-3" /> 0.00 {unit}
        </span>
      );
    }
    const isPositiveGood = invertPositive ? !isUp : isUp;
    const color = isPositiveGood ? 'text-emerald-400' : 'text-amber-400';
    const Icon = isUp ? TrendingUp : TrendingDown;
    const sign = isUp ? '↑' : '↓';
    return (
      <span className={`flex items-center gap-1 font-bold ${color}`}>
        <Icon className="w-3 h-3 shrink-0" />
        {sign} {Math.abs(delta).toFixed(2)} {unit}
      </span>
    );
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#05130D] border border-emerald-500/30 shadow-xl relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-white">
              WHAT CHANGED SINCE LAST CHECK?
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">
              Window: {data.period}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
            data.source_state === 'LIVE'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-zinc-800 text-neutral-300 border-zinc-700'
          }`}>
            {data.source_state === 'LIVE' ? 'LIVE CHANGE ANALYSIS' : 'DEMO CHANGE ANALYSIS'}
          </span>
        </div>
      </div>

      {/* Metric Delta Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono text-xs relative z-10">
        {/* NDVI Delta */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
          <span className="text-neutral-400 text-[10px] block flex items-center gap-1">
            <Satellite className="w-3 h-3 text-lime-400" /> NDVI (Canopy)
          </span>
          <div className="mt-1 text-sm font-bold text-white">
            {deltas.ndvi.current.toFixed(2)}
          </div>
          <div className="text-[11px] mt-0.5">
            {renderDeltaPill(deltas.ndvi.delta)}
          </div>
        </div>

        {/* NDWI Delta */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
          <span className="text-neutral-400 text-[10px] block flex items-center gap-1">
            <Droplet className="w-3 h-3 text-cyan-400" /> NDWI (Hydration)
          </span>
          <div className="mt-1 text-sm font-bold text-white">
            {deltas.ndwi.current.toFixed(2)}
          </div>
          <div className="text-[11px] mt-0.5">
            {renderDeltaPill(deltas.ndwi.delta)}
          </div>
        </div>

        {/* Soil Moisture Delta */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
          <span className="text-neutral-400 text-[10px] block flex items-center gap-1">
            <Droplet className="w-3 h-3 text-teal-400" /> Soil Moisture
          </span>
          <div className="mt-1 text-sm font-bold text-white">
            {deltas.soil_moisture_pct.current}%
          </div>
          <div className="text-[11px] mt-0.5">
            {renderDeltaPill(deltas.soil_moisture_pct.delta, '%')}
          </div>
        </div>

        {/* Rainfall Delta */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
          <span className="text-neutral-400 text-[10px] block flex items-center gap-1">
            <CloudRain className="w-3 h-3 text-blue-400" /> Rain Forecast
          </span>
          <div className="mt-1 text-sm font-bold text-white">
            {deltas.rainfall_14h_mm.current} mm
          </div>
          <div className="text-[11px] mt-0.5">
            {renderDeltaPill(deltas.rainfall_14h_mm.delta, 'mm', true)}
          </div>
        </div>

        {/* Disease Signal */}
        <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-black/40 border border-white/5">
          <span className="text-neutral-400 text-[10px] block flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" /> Pathology Flag
          </span>
          <div className="mt-1 text-xs font-bold text-rose-300 truncate">
            {deltas.disease_signal.changed ? '⚠️ NEW SIGNAL' : 'CLEAR'}
          </div>
          <div className="text-[10px] text-neutral-400 truncate mt-0.5">
            {deltas.disease_signal.current}
          </div>
        </div>
      </div>

      {/* Synthesis / AgriN Detected */}
      <div className="mt-4 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 relative z-10">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AGRIN DETECTED</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* Recommended Action & CTA */}
      <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono relative z-10">
        <div className="flex items-start gap-2">
          <span className="text-cyan-400 font-bold shrink-0">RECOMMENDED ACTION:</span>
          <span className="text-neutral-300 font-sans text-xs">{data.recommended_action}</span>
        </div>

        {onOpenWhyModal && (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenWhyModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs transition-colors cursor-pointer shrink-0 ml-auto"
          >
            <span>Explain Why</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
