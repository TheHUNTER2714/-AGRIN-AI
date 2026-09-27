import React, { useState, useEffect } from 'react';
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
  Sparkles,
  RefreshCw,
  Layers,
  ChevronDown
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { CropGrowthJourney } from './CropGrowthJourney';
import type { NavTab } from './NavBar';
import { calculateCropRisk, fetchDemoFarm, type RiskEngineResult } from '../services/api';

interface DashboardHomeProps {
  onNavigateToTab: (tab: NavTab) => void;
  onOpenWhyModal?: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ 
  onNavigateToTab, 
  onOpenWhyModal 
}) => {
  const [selectedPlot, setSelectedPlot] = useState<'plotA' | 'plotB' | 'plotC' | 'plotD'>('plotA');

  // Farm selection state (State -> District -> Farm)
  const [currentFarm, setCurrentFarm] = useState({
    name: 'Ayush Demo Farm (Plot A-D)',
    state: 'Uttar Pradesh',
    district: 'Pratapgarh',
    area: '14.2 Hectares',
    lat: 25.92,
    lon: 81.99
  });

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [riskData, setRiskData] = useState<RiskEngineResult | null>(null);
  const [loadingRisk, setLoadingRisk] = useState(false);

  const loadRisk = async () => {
    setLoadingRisk(true);
    try {
      // Calculate dynamic risk from unified farm context (no hardcoded inputs)
      const data = await calculateCropRisk();
      setRiskData(data);
    } catch {
      // fallback
    } finally {
      setLoadingRisk(false);
    }
  };

  useEffect(() => {
    loadRisk();
  }, []);

  const handleLoadDemoFarm = async () => {
    soundFx.playChime(520, 0.3);
    const demo = await fetchDemoFarm();
    setCurrentFarm({
      name: demo.farm_name,
      state: demo.state,
      district: demo.district,
      area: `${demo.area_ha} Hectares`,
      lat: demo.latitude,
      lon: demo.longitude
    });
    setShowLocationPicker(false);
    loadRisk();
  };

  const handleSelectDistrict = (state: string, dist: string) => {
    soundFx.playClick();
    setCurrentFarm({
      name: `Kisan Field (${dist} Sector)`,
      state,
      district: dist,
      area: '8.4 Hectares',
      lat: state === 'Punjab' ? 30.90 : 25.92,
      lon: state === 'Punjab' ? 75.85 : 81.99
    });
    setShowLocationPicker(false);
    loadRisk();
  };

  const plotData = {
    plotA: {
      name: 'Plot A — Sharbati Wheat',
      area: '4.8 Hectares',
      stage: 'Vegetative Tillering',
      health: '82%',
      ndvi: '0.78',
      moisture: '28%',
      risk: 'Elevated (Precipitation)',
      status: 'Optimal growth. Convective rain expected in 14h. Hold scheduled irrigation.',
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

  return (
    <div className="space-y-8">
      {/* 1. Header Greeting & Dynamic Farm Location */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>FARM TELEMETRY LIVE</span>
            <span>•</span>
            <span>SENTINEL-2: 26 SEP 2026</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            Good Morning, Ayush
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-300 font-light mt-1">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{currentFarm.name}, {currentFarm.district}, {currentFarm.state} ({currentFarm.area})</span>
            <button
              onClick={() => setShowLocationPicker((prev) => !prev)}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 underline ml-2 cursor-pointer flex items-center gap-1"
            >
              Change Farm <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Demo Farm Reset Button (P3 Requirement) */}
          <button
            onClick={handleLoadDemoFarm}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Farm</span>
          </button>

          {/* Digital Twin Launcher */}
          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateToTab('digital-twin');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-panel-subtle hover:border-emerald-400 text-emerald-300 text-xs font-semibold cursor-pointer transition-all border border-emerald-500/30"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Launch Farm Twin</span>
          </button>
        </div>
      </div>

      {/* Farm Location Selector Modal / Dropdown */}
      {showLocationPicker && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl border border-emerald-500/40 space-y-4"
        >
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
            <span>SELECT STATE & DISTRICT JURISDICTION</span>
            <button onClick={() => setShowLocationPicker(false)} className="text-neutral-400 hover:text-white">✕ Close</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <button
              onClick={() => handleSelectDistrict('Uttar Pradesh', 'Pratapgarh')}
              className="p-3 rounded-xl bg-black/40 hover:bg-emerald-950/40 border border-white/10 text-left cursor-pointer"
            >
              <div className="font-bold text-white">UP • Pratapgarh</div>
              <div className="text-[10px] text-neutral-400">Sharbati Wheat • 14.2 ha</div>
            </button>
            <button
              onClick={() => handleSelectDistrict('Punjab', 'Ludhiana')}
              className="p-3 rounded-xl bg-black/40 hover:bg-emerald-950/40 border border-white/10 text-left cursor-pointer"
            >
              <div className="font-bold text-white">Punjab • Ludhiana</div>
              <div className="text-[10px] text-neutral-400">PBW 725 • 22.0 ha</div>
            </button>
            <button
              onClick={() => handleSelectDistrict('Madhya Pradesh', 'Hoshangabad')}
              className="p-3 rounded-xl bg-black/40 hover:bg-emerald-950/40 border border-white/10 text-left cursor-pointer"
            >
              <div className="font-bold text-white">MP • Hoshangabad</div>
              <div className="text-[10px] text-neutral-400">Durum Wheat • 18.5 ha</div>
            </button>
            <button
              onClick={() => handleSelectDistrict('Maharashtra', 'Nashik')}
              className="p-3 rounded-xl bg-black/40 hover:bg-emerald-950/40 border border-white/10 text-left cursor-pointer"
            >
              <div className="font-bold text-white">MH • Nashik</div>
              <div className="text-[10px] text-neutral-400">Mustard & Onion • 9.8 ha</div>
            </button>
          </div>
        </motion.div>
      )}

      {/* Feature 7 & 8: AI Central Risk Engine & Factor Breakdown */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>FEATURE 7 • AI MULTI-SENSOR RISK ENGINE</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#ECE8DD]">
              Crop Health & Composite Risk Engine
            </h2>
            <p className="text-xs text-neutral-300 mt-0.5">
              Fuses Satellite NDVI, Open-Meteo Doppler precipitation, and ICAR soil tension into a single calibrated risk score.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenWhyModal && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenWhyModal();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-md"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Why {riskData?.composite_risk_score || 67}?</span>
              </button>
            )}
            <button
              onClick={() => {
                soundFx.playClick();
                loadRisk();
              }}
              className="p-2 rounded-full glass-panel-subtle text-neutral-400 hover:text-white"
              title="Recalculate Risk"
            >
              <RefreshCw className={`w-4 h-4 ${loadingRisk ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Central Risk Score Gauge + Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          {/* Main Risk Dial (Col 1-2) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
              COMPOSITE CROP RISK
            </span>
            <div className="text-5xl sm:text-6xl font-extrabold font-mono text-amber-400">
              {riskData?.composite_risk_score || 67}
              <span className="text-xl text-neutral-500 font-sans"> / 100</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/40">
              Level: {riskData?.risk_level || 'Elevated Risk'}
            </span>
            <span className="text-[11px] text-neutral-400 max-w-xs mt-2">
              Driven by impending 35mm storm & root capillary moisture tension.
            </span>
          </div>

          {/* Factor Breakdown (Col 3-5) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-mono text-neutral-400 block">INDIVIDUAL FACTOR WEIGHTAGE & EXPLANATIONS:</span>
            <div className="space-y-2.5">
              {[
                {
                  factor: 'Weather Hazard',
                  score: riskData?.factor_breakdown?.['Weather Risk'] ?? 22.0,
                  max: 30,
                  color: 'bg-blue-500',
                  explanation: riskData?.factor_explanations?.weather ?? '82% rain probability with 35mm anticipated in 14h'
                },
                {
                  factor: 'Water & Soil Stress',
                  score: riskData?.factor_breakdown?.['Water & Soil Stress'] ?? 18.0,
                  max: 25,
                  color: 'bg-cyan-500',
                  explanation: riskData?.factor_explanations?.water_soil ?? 'Root zone moisture at 28% (68% field capacity)'
                },
                {
                  factor: 'Pathogen & Disease',
                  score: riskData?.factor_breakdown?.['Pathogen & Disease Risk'] ?? 12.0,
                  max: 25,
                  color: 'bg-amber-500',
                  explanation: riskData?.factor_explanations?.disease ?? 'Crop Doctor monitoring active on flag leaf'
                },
                {
                  factor: 'Vegetation Canopy',
                  score: riskData?.factor_breakdown?.['Vegetation & Canopy Risk'] ?? 6.0,
                  max: 20,
                  color: 'bg-emerald-500',
                  explanation: riskData?.factor_explanations?.vegetation ?? 'Sentinel-2 Level-2A canopy NDVI 0.78 (Stable)'
                }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 p-2 rounded-xl bg-black/25 border border-white/5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-200 font-semibold">{item.factor}</span>
                    <span className="text-neutral-300">+{item.score.toFixed(1)} pts</span>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden">
                    <div className={`${item.color} h-full transition-all duration-500`} style={{ width: `${Math.min(100, (item.score / item.max) * 100)}%` }} />
                  </div>
                  <div className="text-[11px] text-neutral-400 font-sans line-clamp-1">
                    {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 9: Threshold-Triggered Early Warnings */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono text-neutral-400 block">
            THRESHOLD-TRIGGERED EARLY WARNINGS:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3 text-xs">
              <CloudRain className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-200 block">🌧️ Heavy Convective Rainfall Imminent</span>
                <span className="text-neutral-300">82% rain probability in next 14h. Postpone diesel furrow irrigation to avoid waterlogging.</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3 text-xs">
              <Satellite className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-200 block">🌱 Sentinel-2 Observation Verified</span>
                <span className="text-neutral-300">NDVI steady at 0.78 (+0.04 over 10-day cycle). High vegetative vigor in wheat canopy.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 5: Crop Growth Journey */}
      <CropGrowthJourney />

      {/* Feature 6: Multi-tier Farmer ➔ FPO ➔ Government Hotspot Alert */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/50 via-black/40 to-black/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            FEATURE 6 • FPO DISTRICT INSIGHT AGGREGATOR
          </span>
          <span className="text-[10px] font-mono bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
            District Scale
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-lg text-white">
              Water-Stress Hotspot Detected Across 4 Villages (340 Farmers)
            </h3>
            <p className="text-xs text-neutral-300 font-light">
              AgriN aggregated multi-plot soil moisture and radar predictions across Pratapgarh Block B. State Agriculture Department advisory dispatched.
            </p>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateToTab('india-command');
            }}
            className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer whitespace-nowrap shadow-md"
          >
            Open National Map
          </button>
        </div>
      </div>

      {/* 4-Plot Farm Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            INDIVIDUAL FARM PLOTS MATRIX
          </span>
          <span className="text-xs font-mono text-emerald-400">4 Monitored Zones</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(plotData) as Array<keyof typeof plotData>).map((key) => {
            const p = plotData[key];
            const isSelected = selectedPlot === key;
            return (
              <div
                key={key}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedPlot(key);
                }}
                className={`p-5 rounded-3xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-400 shadow-lg scale-102'
                    : 'glass-panel-subtle hover:border-emerald-500/30'
                }`}
              >
                <div className="text-xs font-mono text-neutral-400">{p.area}</div>
                <h4 className="font-bold text-white text-sm mt-1">{p.name}</h4>
                <div className="text-xs text-emerald-400 mt-2 font-mono">
                  NDVI: {p.ndvi} • Moisture: {p.moisture}
                </div>
                <div className="text-[11px] text-neutral-300 mt-2 line-clamp-2">
                  {p.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Dock */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateToTab('weather')}
          className="p-4 rounded-2xl glass-panel-subtle hover:border-emerald-400 text-left transition-all cursor-pointer"
        >
          <CloudRain className="w-5 h-5 text-blue-400 mb-1.5" />
          <div className="font-bold text-xs text-white">Weather Radar</div>
          <div className="text-[10px] text-neutral-400">35mm Expected</div>
        </button>

        <button
          onClick={() => onNavigateToTab('crop-doctor')}
          className="p-4 rounded-2xl glass-panel-subtle hover:border-emerald-400 text-left transition-all cursor-pointer"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 mb-1.5" />
          <div className="font-bold text-xs text-white">Crop Doctor</div>
          <div className="text-[10px] text-neutral-400">Gemini ViT Scan</div>
        </button>

        <button
          onClick={() => onNavigateToTab('soil')}
          className="p-4 rounded-2xl glass-panel-subtle hover:border-emerald-400 text-left transition-all cursor-pointer"
        >
          <FlaskConical className="w-5 h-5 text-emerald-400 mb-1.5" />
          <div className="font-bold text-xs text-white">Soil Lab</div>
          <div className="text-[10px] text-neutral-400">pH 7.4 • NPK</div>
        </button>

        <button
          onClick={() => onNavigateToTab('ai-advisory')}
          className="p-4 rounded-2xl glass-panel-subtle hover:border-emerald-400 text-left transition-all cursor-pointer"
        >
          <Bot className="w-5 h-5 text-cyan-400 mb-1.5" />
          <div className="font-bold text-xs text-white">AI Agro-Advisor</div>
          <div className="text-[10px] text-neutral-400">Live Guidance</div>
        </button>
      </div>
    </div>
  );
};
