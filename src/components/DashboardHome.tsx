import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Satellite, 
  CloudRain, 
  ShieldAlert, 
  FlaskConical, 
  Bot,
  HelpCircle,
  AlertTriangle,
  Users,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { CropGrowthJourney } from './CropGrowthJourney';
import type { NavTab } from './NavBar';

interface DashboardHomeProps {
  onNavigateToTab: (tab: NavTab) => void;
  onOpenWhyModal?: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ 
  onNavigateToTab, 
  onOpenWhyModal 
}) => {
  const [selectedPlot, setSelectedPlot] = useState<'plotA' | 'plotB' | 'plotC' | 'plotD'>('plotA');

  const plotData = {
    plotA: {
      name: 'Plot A — Sharbati Wheat',
      area: '4.8 Hectares',
      stage: 'Vegetative Tillering',
      health: '82%',
      ndvi: '0.78',
      moisture: '28%',
      risk: 'Low',
      status: 'Optimal growth. Rain expected in 14h. Hold scheduled irrigation.',
    },
    plotB: {
      name: 'Plot B — Yellow Mustard',
      area: '3.2 Hectares',
      stage: 'Pod Formation',
      health: '69%',
      ndvi: '0.64',
      moisture: '21%',
      risk: 'Medium',
      status: 'Mild aphid activity detected. Consider bio-spray.',
    },
    plotC: {
      name: 'Plot C — Pigeon Pea (Arhar)',
      area: '2.5 Hectares',
      stage: 'Flowering Stage',
      health: '88%',
      ndvi: '0.84',
      moisture: '32%',
      risk: 'Low',
      status: 'High nitrogen fixation detected.',
    },
    plotD: {
      name: 'Plot D — Seasonal Fallow & Residue',
      area: '3.7 Hectares',
      stage: 'Post-Harvest Rest',
      health: '45%',
      ndvi: '0.31',
      moisture: '18%',
      risk: 'None',
      status: '2.5t Rice straw ready for AgriCycle biochar pickup.',
    },
  };

  const currentPlot = plotData[selectedPlot];

  return (
    <div className="space-y-8">
      {/* 1. Header Greeting & Location */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>FARM TELEMETRY LIVE</span>
            <span>•</span>
            <span>LAST SENTINEL-2 PASS: 4h AGO</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            Good Morning, Ayush
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Ayush Agricultural Estate, Pratapgarh, Uttar Pradesh (14.2 Hectares)</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateToTab('digital-twin');
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-400 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer hover:scale-105"
          >
            <Sparkles className="w-4 h-4 fill-current text-black" />
            <span>Open Farm Digital Twin</span>
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateToTab('ai-advisory');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 text-xs font-medium transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Consult Farm AI</span>
          </button>
        </div>
      </div>

      {/* 2. PROACTIVE EARLY INTERVENTION & FPO AGGREGATION ALERTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Feature 7: AI Early Intervention Alert */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase">
                  AI PROACTIVE EARLY INTERVENTION
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">11 Days Advance</span>
              </div>
              <h4 className="font-bold text-[#ECE8DD]">
                Early Crop-Stress Warning: Plot B Northern Perimeter
              </h4>
              <p className="text-neutral-300 font-light leading-relaxed">
                Satellite vegetation indicators (NDVI) declined -0.07 over the last 3 observations. Recommended action: inspect foliage for early aphid colonization before visual chlorosis.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('crop-doctor')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-[11px] shrink-0 self-start sm:self-center cursor-pointer transition-colors"
          >
            Inspect Foliar
          </button>
        </div>

        {/* Feature 6: Farmer -> FPO -> Government Network Aggregation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
              <Users className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                  FPO & DISTRICT AGGREGATION
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">Pratapgarh Hub</span>
              </div>
              <h4 className="font-bold text-[#ECE8DD]">
                Water-Stress Hotspot Detected Across 4 Villages
              </h4>
              <p className="text-neutral-300 font-light leading-relaxed">
                340 farmers in this block are experiencing similar root water stress. AgriN aggregated the data. Action: Canal discharge priority request submitted to State Irrigation Dept.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('india-command')}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-[11px] shrink-0 self-start sm:self-center cursor-pointer transition-colors"
          >
            View Map
          </button>
        </div>
      </div>

      {/* 3. Top 3 Floating Core Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Crop Health */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => onNavigateToTab('satellite')}
          className="glass-card-interactive rounded-3xl p-6 border border-emerald-500/20 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-neutral-400">VEGETATION INDEX</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Satellite className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-display font-extrabold text-4xl text-[#F9F8F3]">78%</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Optimal Health
            </span>
          </div>
          <p className="text-xs text-neutral-300 font-light mb-4">
            Mean NDVI is 0.74 across 14.2 Ha. High photosynthetic canopy vigour.
          </p>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="w-[78%] h-full bg-gradient-to-r from-emerald-500 to-lime-400" />
          </div>
        </motion.div>

        {/* Metric 2: Weather Risk with "Why?" Button */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card-interactive rounded-3xl p-6 border border-amber-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-neutral-400">MICRO-CLIMATE RISK</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-display font-extrabold text-4xl text-amber-300">Medium</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Rain in 14h
            </span>
          </div>
          <p className="text-xs text-neutral-300 font-light mb-3">
            35mm rainfall probable. Irrigation held; nitrogen top-dress scheduled post-rain.
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              onClick={() => onNavigateToTab('weather')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              Radar Details &rarr;
            </button>
            {onOpenWhyModal && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  onOpenWhyModal();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono cursor-pointer transition-all"
              >
                <HelpCircle className="w-3 h-3 text-emerald-400" />
                <span>Why?</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Metric 3: Soil Health */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => onNavigateToTab('soil')}
          className="glass-card-interactive rounded-3xl p-6 border border-teal-500/20 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-neutral-400">SOIL COMPOSITE SCORE</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-display font-extrabold text-4xl text-[#F9F8F3]">72%</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              N Deficient
            </span>
          </div>
          <p className="text-xs text-neutral-300 font-light mb-4">
            NPK ratio 42-31-68. Sub-surface moisture at 28%. Bio-compost advised for Plot B.
          </p>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="w-[72%] h-full bg-gradient-to-r from-teal-400 to-emerald-400" />
          </div>
        </motion.div>
      </div>

      {/* 4. FEATURE 5: CROP GROWTH JOURNEY */}
      <CropGrowthJourney />

      {/* 5. Live Farm Cadastral Parcels & Digital Twin Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Interactive Parcel Map */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                Cadastral Satellite Grid
              </span>
              <h3 className="font-display font-bold text-xl text-[#F9F8F3] mt-0.5">
                Live Farm Parcel Intelligence
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Select Parcel:</span>
              <div className="flex gap-1">
                {(['plotA', 'plotB', 'plotC', 'plotD'] as const).map((pid) => (
                  <button
                    key={pid}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedPlot(pid);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase cursor-pointer transition-all ${
                      selectedPlot === pid
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'glass-panel-subtle text-neutral-300 hover:text-white'
                    }`}
                  >
                    {pid.replace('plot', 'P-')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Farm Map Canvas */}
          <div className="relative h-72 sm:h-96 rounded-2xl bg-black/60 border border-emerald-500/20 overflow-hidden p-6 flex flex-col justify-between">
            <div className="absolute inset-0 satellite-grid opacity-40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-amber-950/20 pointer-events-none" />

            {/* Farm Boundary Polygon Grid */}
            <div className="grid grid-cols-2 gap-3 h-full relative z-10">
              {/* Plot A */}
              <div
                onClick={() => {
                  soundFx.playClick();
                  setSelectedPlot('plotA');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlot === 'plotA'
                    ? 'bg-emerald-900/40 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-emerald-300">PLOT A</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    NDVI 0.78
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#ECE8DD]">Sharbati Wheat</div>
                  <div className="text-[11px] text-neutral-400 font-mono">4.8 Ha • Vegetative</div>
                </div>
              </div>

              {/* Plot B */}
              <div
                onClick={() => {
                  soundFx.playClick();
                  setSelectedPlot('plotB');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlot === 'plotB'
                    ? 'bg-amber-900/40 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-amber-950/20 border-amber-500/20 hover:border-amber-500/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-amber-300">PLOT B</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    NDVI 0.64
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#ECE8DD]">Yellow Mustard</div>
                  <div className="text-[11px] text-neutral-400 font-mono">3.2 Ha • Pod Formation</div>
                </div>
              </div>

              {/* Plot C */}
              <div
                onClick={() => {
                  soundFx.playClick();
                  setSelectedPlot('plotC');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlot === 'plotC'
                    ? 'bg-emerald-900/40 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-emerald-300">PLOT C</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    NDVI 0.84
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#ECE8DD]">Pigeon Pea (Arhar)</div>
                  <div className="text-[11px] text-neutral-400 font-mono">2.5 Ha • Flowering</div>
                </div>
              </div>

              {/* Plot D */}
              <div
                onClick={() => {
                  soundFx.playClick();
                  setSelectedPlot('plotD');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlot === 'plotD'
                    ? 'bg-teal-900/40 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]'
                    : 'bg-teal-950/20 border-teal-500/20 hover:border-teal-500/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-teal-300">PLOT D</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                    Stubble Rest
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#ECE8DD]">Residue Field</div>
                  <div className="text-[11px] text-neutral-400 font-mono">3.7 Ha • 2.5t Rice Straw</div>
                </div>
              </div>
            </div>

            {/* Bottom Parcel Summary Ribbon */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-300 z-10">
              <span className="text-emerald-400 font-semibold">{currentPlot.name}</span>
              <span>{currentPlot.area}</span>
              <span className="text-neutral-400">{currentPlot.status}</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Farm Risk Center & Digital Twin Launcher */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                AI Risk Center
              </span>
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>

            <h3 className="font-display font-bold text-xl text-[#F9F8F3] mb-4">
              Composite Farm Risk
            </h3>

            {/* Circular Gauge 64/100 */}
            <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#F59E0B"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="263.8"
                  strokeDashoffset={263.8 - (263.8 * 64) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-2xl font-extrabold text-amber-400">64</span>
                <span className="text-[9px] text-neutral-400">/ 100 RISK</span>
              </div>
            </div>

            {/* Sub Metrics Breakdown */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-950/20 border border-red-500/20">
                <span className="text-neutral-300">🌧 Rain Inundation</span>
                <span className="text-red-400 font-bold">HIGH (82%)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/20 border border-amber-500/20">
                <span className="text-neutral-300">💧 Water Stress</span>
                <span className="text-amber-400 font-bold">MEDIUM (21%)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                <span className="text-neutral-300">🦠 Disease Risk</span>
                <span className="text-emerald-400 font-bold">LOW (8%)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
            <button
              onClick={() => onNavigateToTab('digital-twin')}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Launch 2.5D Digital Twin Simulator</span>
            </button>

            <button
              onClick={() => onNavigateToTab('ai-advisory')}
              className="w-full py-2 rounded-full glass-panel-subtle hover:border-emerald-500/30 text-emerald-300 text-xs font-mono transition-all cursor-pointer"
            >
              Generate AI Mitigation Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
