import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Sprout, 
  CloudRain, 
  Droplets, 
  Thermometer, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FarmDigitalTwinProps {
  onOpenWhyModal?: () => void;
}

export const FarmDigitalTwin: React.FC<FarmDigitalTwinProps> = ({ onOpenWhyModal }) => {
  const [selectedPlot, setSelectedPlot] = useState<'plotA' | 'plotB' | 'plotC' | 'plotD'>('plotA');
  const [rainfallChange, setRainfallChange] = useState<number>(30); // +30%
  const [irrigationChange, setIrrigationChange] = useState<number>(-20); // -20%
  const [tempAnomaly, setTempAnomaly] = useState<number>(1.5); // +1.5°C
  const [isSimulating, setIsSimulating] = useState(false);
  const [viewMode, setViewMode] = useState<'twin' | 'thermal' | 'root-zone'>('twin');

  const plotSpecs = {
    plotA: {
      name: 'Plot A — Sharbati Wheat',
      crop: 'Wheat (Triticum aestivum)',
      area: '4.8 Hectares',
      baseHealth: 78,
      baseMoisture: 68,
      baseYield: 44.5,
      stage: 'Vegetative Tillering',
      soilType: 'Alluvial Silt Loam',
    },
    plotB: {
      name: 'Plot B — Yellow Mustard',
      crop: 'Mustard (Brassica juncea)',
      area: '3.2 Hectares',
      baseHealth: 69,
      baseMoisture: 52,
      baseYield: 22.0,
      stage: 'Pod Formation',
      soilType: 'Sandy Loam',
    },
    plotC: {
      name: 'Plot C — Pigeon Pea (Arhar)',
      crop: 'Pigeon Pea (Cajanus cajan)',
      area: '2.5 Hectares',
      baseHealth: 88,
      baseMoisture: 72,
      baseYield: 18.5,
      stage: 'Flowering Stage',
      soilType: 'Deep Loam',
    },
    plotD: {
      name: 'Plot D — Stubble & Residue',
      crop: 'Paddy Residue Rest',
      area: '3.7 Hectares',
      baseHealth: 55,
      baseMoisture: 42,
      baseYield: 0.0,
      stage: 'Post-Harvest Fallow',
      soilType: 'Clayey Loam',
    },
  };

  const currentPlot = plotSpecs[selectedPlot];

  // Dynamic simulation outcomes
  const simulationOutcome = useMemo(() => {
    const netWaterChange = rainfallChange * 0.7 + irrigationChange * 0.5;
    const tempImpact = tempAnomaly * -3.5;
    
    // Calculated health
    let health = currentPlot.baseHealth + netWaterChange * 0.25 + tempImpact;
    
    // Penalize extreme waterlogging or extreme drought
    if (rainfallChange > 60 && irrigationChange > 10) {
      health -= 25; // waterlogged
    } else if (rainfallChange < -30 && irrigationChange < -30) {
      health -= 35; // drought
    }

    health = Math.max(15, Math.min(98, Math.round(health)));

    // Soil moisture
    let moisture = currentPlot.baseMoisture + netWaterChange * 0.35;
    moisture = Math.max(10, Math.min(95, Math.round(moisture)));

    // Projected Yield change %
    const yieldChangePercent = ((health - currentPlot.baseHealth) * 0.65).toFixed(1);
    const projectedYield = (currentPlot.baseYield * (1 + parseFloat(yieldChangePercent) / 100)).toFixed(1);

    // Diagnostics message
    let statusText = 'Optimal soil hydration balance. Photosynthetic canopy stable.';
    let statusType: 'optimal' | 'warning' | 'critical' = 'optimal';

    if (rainfallChange > 50 && irrigationChange >= 0) {
      statusText = '⚠️ Saturated root zone: Waterlogging risk detected. Furrow drainage required to avoid lodging.';
      statusType = 'critical';
    } else if (rainfallChange < -20 && irrigationChange < -20) {
      statusText = '⚠️ Crop moisture deficit: Stomatal closure expected in mid-day sun. Yield penalty probable.';
      statusType = 'critical';
    } else if (rainfallChange >= 20 && irrigationChange <= -10) {
      statusText = '✨ Synergistic rainwater harvesting: Saved diesel pumping expenditure while sustaining optimal soil moisture.';
      statusType = 'optimal';
    } else if (tempAnomaly >= 3) {
      statusText = '⚠️ Heat stress anomaly: Pollen sterility and accelerated transpiration in upper canopy.';
      statusType = 'warning';
    }

    return {
      health,
      moisture,
      projectedYield,
      yieldChangePercent,
      statusText,
      statusType,
    };
  }, [rainfallChange, irrigationChange, tempAnomaly, currentPlot]);

  const handleResetToBaseline = () => {
    soundFx.playClick();
    setRainfallChange(0);
    setIrrigationChange(0);
    setTempAnomaly(0);
  };

  const handleTriggerSimulate = () => {
    soundFx.playScanTone();
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      soundFx.playChime(640, 0.4);
    }, 800);
  };

  // Determine visual color of the isometric field
  const soilVisualClasses = useMemo(() => {
    if (simulationOutcome.moisture > 80) {
      return {
        soilBg: 'bg-[#15231c]',
        borderColor: 'border-cyan-500/50',
        puddle: true,
        cropColor: 'text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]',
      };
    } else if (simulationOutcome.moisture < 35) {
      return {
        soilBg: 'bg-[#3b2b1a]',
        borderColor: 'border-amber-600/40',
        puddle: false,
        cropColor: 'text-amber-400 opacity-80',
      };
    } else {
      return {
        soilBg: 'bg-[#0f291e]',
        borderColor: 'border-emerald-500/30',
        puddle: false,
        cropColor: 'text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]',
      };
    }
  }, [simulationOutcome.moisture]);

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>AI DIGITAL TWIN SIMULATOR</span>
            <span>•</span>
            <span>WHAT-IF AGRICULTURAL PREDICTION ENGINE</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            Ayush Farm Digital Twin
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Virtual 2.5D twin of your agricultural parcels powered by ISRO Sentinel telemetry & in-situ sensors.
          </p>
        </div>

        {/* Plot Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(['plotA', 'plotB', 'plotC', 'plotD'] as const).map((pid) => (
            <button
              key={pid}
              onClick={() => {
                soundFx.playClick();
                setSelectedPlot(pid);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase cursor-pointer transition-all ${
                selectedPlot === pid
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'glass-panel-subtle text-neutral-300 hover:text-white'
              }`}
            >
              {pid === 'plotA' && 'Plot A (Wheat)'}
              {pid === 'plotB' && 'Plot B (Mustard)'}
              {pid === 'plotC' && 'Plot C (Arhar)'}
              {pid === 'plotD' && 'Plot D (Residue)'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main 2.5D Field Canvas + Simulation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: The 2.5D Virtual Isometric Field Canvas */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col justify-between relative overflow-hidden min-h-[520px]">
          {/* Top Bar on Field */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-300">
                {currentPlot.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentPlot.area}
              </span>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 font-mono text-[11px]">
              <button
                onClick={() => setViewMode('twin')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'twin' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                2.5D Canopy
              </button>
              <button
                onClick={() => setViewMode('root-zone')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'root-zone' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Root Zone
              </button>
              <button
                onClick={() => setViewMode('thermal')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'thermal' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Thermal
              </button>
            </div>
          </div>

          {/* 3D/2.5D Isometric Field Representation */}
          <div className="relative my-8 py-8 flex flex-col items-center justify-center">
            {/* Ambient Atmosphere Overlays */}
            {rainfallChange > 20 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                <div className="absolute inset-0 bg-cyan-900/10" />
                <div className="absolute top-2 left-1/4 text-cyan-300 text-xs font-mono flex items-center gap-1 animate-pulse">
                  <CloudRain className="w-4 h-4" />
                  <span>Convective Rainfall Active (+{rainfallChange}%)</span>
                </div>
              </div>
            )}

            {tempAnomaly >= 2.5 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                <div className="absolute inset-0 bg-amber-500/10" />
                <div className="absolute top-2 right-1/4 text-amber-300 text-xs font-mono flex items-center gap-1 animate-pulse">
                  <Thermometer className="w-4 h-4" />
                  <span>High Heat Index (+{tempAnomaly}°C)</span>
                </div>
              </div>
            )}

            {/* Isometric Field Ground Container */}
            <motion.div
              animate={{
                rotateX: 48,
                rotateZ: -24,
                scale: isSimulating ? 0.96 : 1,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              className={`relative w-72 sm:w-96 h-72 sm:h-96 rounded-3xl ${soilVisualClasses.soilBg} border-2 ${soilVisualClasses.borderColor} shadow-[0_30px_70px_rgba(0,0,0,0.8)] p-4 flex flex-col justify-between transition-colors duration-700`}
            >
              {/* Moisture Sheen or Dry Texture */}
              <div className="absolute inset-0 satellite-grid opacity-30 pointer-events-none rounded-3xl" />
              {soilVisualClasses.puddle && (
                <div className="absolute inset-6 rounded-2xl bg-cyan-400/15 blur-sm pointer-events-none animate-pulse" />
              )}

              {/* The Crops Array (2.5D Sprout Lattice) */}
              <div className="relative z-10 grid grid-cols-5 gap-3 sm:gap-4 h-full items-center justify-items-center">
                {Array.from({ length: 25 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: [1, 1.08, 1],
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 3 + (idx % 4) * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: (idx % 5) * 0.15,
                    }}
                    className="flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <Sprout 
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${soilVisualClasses.cropColor} transition-colors duration-500 group-hover:scale-125`} 
                    />
                    <div className="w-3 h-1 rounded-full bg-black/40 blur-[1px] mt-0.5" />
                  </motion.div>
                ))}
              </div>

              {/* Cadastral Pin Marker */}
              <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-black/80 border border-emerald-400/50 text-[10px] font-mono text-emerald-300 flex items-center gap-1 shadow-lg">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>25.9182° N, 81.9984° E</span>
              </div>
            </motion.div>

            {/* Health Overlay Meter Tag */}
            <div className="mt-8 flex items-center gap-6 z-10">
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-emerald-500/30">
                <span className="text-xs font-mono text-neutral-400">FIELD HEALTH:</span>
                <span className={`text-2xl font-extrabold font-mono ${
                  simulationOutcome.health >= 75
                    ? 'text-emerald-400'
                    : simulationOutcome.health >= 55
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}>
                  {simulationOutcome.health}%
                </span>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                  simulationOutcome.health >= 75
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : simulationOutcome.health >= 55
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {simulationOutcome.health >= 75 ? 'Healthy' : simulationOutcome.health >= 55 ? 'Stressed' : 'Critical'}
                </span>
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 font-mono text-xs">
                <Droplets className="w-4 h-4 text-teal-400" />
                <span className="text-neutral-400">Moisture:</span>
                <span className="text-teal-300 font-bold">{simulationOutcome.moisture}%</span>
              </div>
            </div>
          </div>

          {/* Bottom Diagnostics Strip with "Why?" Button */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono z-10">
            <div className="flex items-center gap-2">
              {simulationOutcome.statusType === 'optimal' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="text-neutral-200">{simulationOutcome.statusText}</span>
            </div>

            {onOpenWhyModal && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenWhyModal();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono cursor-pointer transition-all hover:scale-105 shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Explain With AI (Why?)</span>
              </button>
            )}
          </div>
        </div>

        {/* Right 5 Cols: "What-If" Agricultural Simulation Controls */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
                Scenario Modeling
              </span>
              <h3 className="font-display font-bold text-xl text-[#F9F8F3] mt-0.5">
                What-If Simulation
              </h3>
            </div>
            <button
              onClick={handleResetToBaseline}
              title="Reset Sliders to Current Real-time Satellite Ground Baseline"
              className="p-2 rounded-xl glass-panel-subtle hover:border-emerald-500/40 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed font-light">
            Adjust precipitation and farm operations to simulate biological crop responses before taking real-world action.
          </p>

          {/* Slider 1: Rainfall Variation */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-300 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <span>Rainfall Variation:</span>
              </span>
              <span className={`font-bold text-sm ${rainfallChange >= 0 ? 'text-cyan-300' : 'text-amber-400'}`}>
                {rainfallChange > 0 ? `+${rainfallChange}%` : `${rainfallChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={rainfallChange}
              onChange={(e) => {
                soundFx.playClick();
                setRainfallChange(parseInt(e.target.value, 10));
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>Severe Drought (-50%)</span>
              <span>Baseline (0%)</span>
              <span>Heavy Monsoonal (+100%)</span>
            </div>
          </div>

          {/* Slider 2: Irrigation Schedule */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-300 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-teal-400" />
                <span>Irrigation Application:</span>
              </span>
              <span className={`font-bold text-sm ${irrigationChange >= 0 ? 'text-teal-300' : 'text-emerald-400'}`}>
                {irrigationChange > 0 ? `+${irrigationChange}%` : `${irrigationChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              step="5"
              value={irrigationChange}
              onChange={(e) => {
                soundFx.playClick();
                setIrrigationChange(parseInt(e.target.value, 10));
              }}
              className="w-full accent-teal-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>Cut Tube-well (-60%)</span>
              <span>Normal Sched. (0%)</span>
              <span>Flood Furrow (+60%)</span>
            </div>
          </div>

          {/* Slider 3: Temperature Anomaly */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-300 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <span>Heat Wave Anomaly:</span>
              </span>
              <span className="font-bold text-sm text-amber-300">
                +{tempAnomaly}°C
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={tempAnomaly}
              onChange={(e) => {
                soundFx.playClick();
                setTempAnomaly(parseFloat(e.target.value));
              }}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>Seasonal Norm (0°C)</span>
              <span>Moderate (+2°C)</span>
              <span>Heatwave (+5°C)</span>
            </div>
          </div>

          {/* Simulation Output Cards */}
          <div className="pt-2 grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-neutral-400 block">PROJECTED YIELD</span>
              <div className="flex items-baseline gap-1 text-lg font-bold text-[#F9F8F3]">
                <span>{simulationOutcome.projectedYield}</span>
                <span className="text-[11px] text-neutral-400 font-normal">Qtl/Ha</span>
              </div>
              <div className={`text-[10px] font-bold ${
                parseFloat(simulationOutcome.yieldChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {parseFloat(simulationOutcome.yieldChangePercent) >= 0 ? '+' : ''}
                {simulationOutcome.yieldChangePercent}% vs avg
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-neutral-400 block">PUMPING DIESEL SAVED</span>
              <div className="flex items-baseline gap-1 text-lg font-bold text-emerald-400">
                <span>{irrigationChange < 0 ? Math.abs(irrigationChange * 28) : 0}</span>
                <span className="text-[11px] text-neutral-400 font-normal">Litres</span>
              </div>
              <div className="text-[10px] text-emerald-300">
                ₹{irrigationChange < 0 ? Math.abs(irrigationChange * 25) : 0} Cost Averted
              </div>
            </div>
          </div>

          {/* Trigger Simulation Button */}
          <button
            onClick={handleTriggerSimulate}
            disabled={isSimulating}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-current text-black" />
            <span>{isSimulating ? 'Neural Engine Simulating...' : 'Recalculate Digital Twin'}</span>
          </button>

          <div className="text-[10px] font-mono text-neutral-500 text-center">
            *Scenario simulation based on AgriN localized biophysical transfer model.
          </div>
        </div>
      </div>
    </div>
  );
};
