import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Sliders, 
  Download,
  Play,
  Pause,
  Crosshair
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const SatellitePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ndvi' | 'ndwi' | 'stress' | 'historical'>('ndvi');
  const [timelineIndex, setTimelineIndex] = useState(5); // default Sep 26
  const [timeMode, setTimeMode] = useState<'dates' | 'years'>('dates');
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [cloudMaskEnabled, setCloudMaskEnabled] = useState(true);
  const [inspectedPixel, setInspectedPixel] = useState<{ x: number; y: number; ndvi: number; health: string } | null>({
    x: 48,
    y: 52,
    ndvi: 0.81,
    health: 'Optimal Canopy',
  });

  const dateTimeline = [
    { label: 'Sep 01', ndvi: 0.74, ndwi: 0.48, stress: 'Healthy', phase: 'HEALTHY', clouds: '1.2%', color: 'from-[#064E3B] via-[#059669] to-[#84CC16]' },
    { label: 'Sep 06', ndvi: 0.68, ndwi: 0.42, stress: 'Moderate', phase: 'HEALTHY', clouds: '2.4%', color: 'from-[#065F46] via-[#10B981] to-[#65A30D]' },
    { label: 'Sep 11', ndvi: 0.52, ndwi: 0.28, stress: 'High Stress', phase: 'STRESSED', clouds: '0.8%', color: 'from-[#78350F] via-[#D97706] to-[#F59E0B]' },
    { label: 'Sep 16', ndvi: 0.58, ndwi: 0.34, stress: 'Stressed', phase: 'STRESSED', clouds: '3.1%', color: 'from-[#B45309] via-[#EAB308] to-[#84CC16]' },
    { label: 'Sep 21', ndvi: 0.76, ndwi: 0.50, stress: 'Recovering', phase: 'RECOVERY', clouds: '1.5%', color: 'from-[#065F46] via-[#059669] to-[#84CC16]' },
    { label: 'Sep 26', ndvi: 0.83, ndwi: 0.56, stress: 'Optimal Vigour', phase: 'RECOVERY', clouds: '0.4%', color: 'from-[#064E3B] via-[#10B981] to-[#A3E635]' },
  ];

  const yearTimeline = [
    { label: '2024 Season', ndvi: 0.65, ndwi: 0.41, stress: 'Severe Drought Year', phase: 'STRESSED', clouds: '4.8%', color: 'from-[#78350F] via-[#D97706] to-[#F59E0B]' },
    { label: '2025 Season', ndvi: 0.72, ndwi: 0.49, stress: 'Moderate Yield', phase: 'RECOVERY', clouds: '2.1%', color: 'from-[#065F46] via-[#10B981] to-[#65A30D]' },
    { label: '2026 (Current)', ndvi: 0.83, ndwi: 0.56, stress: 'AgriN Optimized', phase: 'HEALTHY', clouds: '0.4%', color: 'from-[#064E3B] via-[#10B981] to-[#A3E635]' },
  ];

  const currentTimeline = timeMode === 'dates' ? dateTimeline : yearTimeline;
  const clampedIndex = Math.min(timelineIndex, currentTimeline.length - 1);
  const currentObservation = currentTimeline[clampedIndex];

  // Auto-play time machine
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const interval = setInterval(() => {
      setTimelineIndex((prev) => {
        const next = (prev + 1) % currentTimeline.length;
        return next;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlayingTimeline, currentTimeline.length]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    soundFx.playClick();
    setTimelineIndex(parseInt(e.target.value, 10));
    setIsPlayingTimeline(false);
  };

  const handleRasterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    soundFx.playScanTone();
    const randomizedNdvi = (currentObservation.ndvi + (Math.random() * 0.08 - 0.04)).toFixed(2);
    setInspectedPixel({
      x,
      y,
      ndvi: parseFloat(randomizedNdvi),
      health: parseFloat(randomizedNdvi) > 0.7 ? 'Dense Photosynthetic Canopy' : 'Dry / Stressed Patch',
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Satellite Metadata Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Satellite className="w-4 h-4 animate-spin-slow" />
            <span>SENTINEL-2B MULTISPECTRAL INSTRUMENT (MSI)</span>
            <span>•</span>
            <span>LEVEL-2A SURFACE REFLECTANCE</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            Satellite Time Machine
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Scrub through multi-temporal orbital passes to witness crop stress, transition, and recovery.
          </p>
        </div>

        {/* Orbit Telemetry Badges */}
        <div className="flex flex-wrap gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-neutral-400 block text-[10px]">SPATIAL PIXEL</span>
            <span className="text-emerald-300 font-bold">10-Meter Res</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-neutral-400 block text-[10px]">CLOUD COVERAGE</span>
            <span className="text-cyan-300 font-bold">{currentObservation.clouds}</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-neutral-400 block text-[10px]">SUN ELEVATION</span>
            <span className="text-amber-300 font-bold">54.8° Azimuth</span>
          </div>
        </div>
      </div>

      {/* Spectral Layer Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'ndvi', label: 'NDVI (Crop Vigour & Biomass)' },
          { id: 'ndwi', label: 'NDWI (Canopy Water Stress)' },
          { id: 'stress', label: 'Thermal Anomaly (Heat Index)' },
          { id: 'overview', label: 'True Color RGB' },
          { id: 'historical', label: 'Long-term Decadal Baseline' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playClick();
              setActiveTab(tab.id as unknown as typeof activeTab);
            }}
            className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-black font-semibold shadow-lg'
                : 'glass-panel-subtle text-neutral-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Map & Spectral Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Satellite Raster Viewer & Time Machine Scrubber */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs text-[#ECE8DD] font-semibold">
                PRATAPGARH TRACT — {currentObservation.label}
              </span>
            </div>

            {/* Time Machine Mode Switch (Dates vs Years) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setTimeMode('dates');
                    setTimelineIndex(5);
                  }}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                    timeMode === 'dates' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400'
                  }`}
                >
                  Dates (Sep 2026)
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setTimeMode('years');
                    setTimelineIndex(2);
                  }}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                    timeMode === 'years' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400'
                  }`}
                >
                  Years (2024–2026)
                </button>
              </div>

              <button
                onClick={() => setCloudMaskEnabled(!cloudMaskEnabled)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer transition-colors ${
                  cloudMaskEnabled ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30' : 'border-white/10 text-neutral-400'
                }`}
              >
                Cloud Mask: {cloudMaskEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Raster Visual with Dynamic Shaders & Click Pixel Inspector */}
          <div 
            onClick={handleRasterClick}
            className="relative h-80 sm:h-[420px] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center cursor-crosshair group"
          >
            {/* Background Satellite Shader transition */}
            <div 
              className={`absolute inset-0 transition-all duration-700 bg-gradient-to-br ${currentObservation.color}`}
              style={{ opacity: 0.9 }}
            />

            {/* Satellite Grid Scan Overlay */}
            <div className="absolute inset-0 satellite-grid opacity-35 pointer-events-none" />

            {/* Dynamic Cadastral Overlays */}
            <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between font-mono text-xs pointer-events-none">
              <div className="flex justify-between items-start">
                <div className="bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <div className="text-emerald-300 font-bold">WHEAT SECTOR 4A</div>
                  <div className="text-white text-[11px]">NDVI: {(currentObservation.ndvi + 0.02).toFixed(2)}</div>
                  <div className="text-neutral-400 text-[10px]">Pixel Turgor: Adequate</div>
                </div>

                {/* State Tag: HEALTHY -> STRESSED -> RECOVERY */}
                <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-400/40 shadow-xl flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    currentObservation.phase === 'HEALTHY'
                      ? 'bg-emerald-400 animate-pulse'
                      : currentObservation.phase === 'STRESSED'
                      ? 'bg-amber-400 animate-ping'
                      : 'bg-teal-400 animate-pulse'
                  }`} />
                  <div>
                    <span className="text-[9px] text-neutral-400 block">OBSERVATION STATE:</span>
                    <span className={`font-bold text-sm ${
                      currentObservation.phase === 'HEALTHY'
                        ? 'text-emerald-300'
                        : currentObservation.phase === 'STRESSED'
                        ? 'text-amber-300'
                        : 'text-teal-300'
                    }`}>
                      {currentObservation.phase}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inspected Pixel Reticle */}
              {inspectedPixel && (
                <div 
                  className="absolute pointer-events-none transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${inspectedPixel.x}%`, top: `${inspectedPixel.y}%` }}
                >
                  <div className="relative">
                    <Crosshair className="w-8 h-8 text-emerald-300 animate-spin-slow" />
                    <div className="absolute left-8 top-0 bg-black/90 p-2 rounded-lg border border-emerald-400 text-[10px] whitespace-nowrap shadow-xl">
                      <span className="text-emerald-400 font-bold">Pixel (X:{inspectedPixel.x}, Y:{inspectedPixel.y}):</span>
                      <div className="text-white">NDVI: {inspectedPixel.ndvi} • {inspectedPixel.health}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Spectral Legend Bar */}
              <div className="bg-black/85 backdrop-blur-md p-3 rounded-xl border border-white/10 max-w-sm self-center w-full">
                <div className="flex justify-between text-[10px] text-neutral-300 mb-1">
                  <span>Barren (0.1)</span>
                  <span>Stressed (0.4)</span>
                  <span>Dense Canopy (0.9)</span>
                </div>
                <div className="h-2 rounded-full w-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400" />
              </div>
            </div>
          </div>

          {/* SATELLITE TIME MACHINE SCRUBBER BAR */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIsPlayingTimeline(!isPlayingTimeline);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold cursor-pointer transition-all shadow-md"
                >
                  {isPlayingTimeline ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingTimeline ? 'Pause Time Machine' : 'Play Time Machine'}</span>
                </button>

                <span className="text-neutral-400 hidden sm:inline">
                  Drag slider to scrub satellite acquisition history
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Selected Pass:</span>
                <span className="text-emerald-400 font-bold text-sm bg-black/40 px-3 py-1 rounded-xl border border-emerald-500/30">
                  {currentObservation.label}
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="relative px-2">
              <input
                type="range"
                min="0"
                max={currentTimeline.length - 1}
                value={clampedIndex}
                onChange={handleSliderChange}
                className="w-full accent-emerald-500 cursor-pointer h-2.5 bg-white/10 rounded-lg appearance-none"
              />
              <div className="flex justify-between mt-2 font-mono text-[10px] text-neutral-400">
                {currentTimeline.map((d, i) => (
                  <span 
                    key={d.label} 
                    className={`${i === clampedIndex ? 'text-emerald-400 font-extrabold text-xs' : ''}`}
                  >
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Spectral Bands & AI Vegetation Trends */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                Spectral Analysis
              </span>
              <Sliders className="w-4 h-4 text-emerald-400" />
            </div>

            <h3 className="font-display font-bold text-xl text-[#F9F8F3]">
              Canopy Phenology
            </h3>

            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Calculated using the Near-Infrared (Band 8, 842nm) and Red (Band 4, 665nm) surface reflectance values.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">MEAN NDVI:</span>
                  <span className="text-emerald-400 font-bold">{currentObservation.ndvi}</span>
                </div>
                <div className="text-[10px] text-neutral-500">Photosynthetic efficiency index</div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">WATER CANOPY INDEX (NDWI):</span>
                  <span className="text-cyan-400 font-bold">{currentObservation.ndwi}</span>
                </div>
                <div className="text-[10px] text-neutral-500">Leaf cellular turgidity balance</div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">DIAGNOSTIC STATUS:</span>
                  <span className="text-emerald-400 font-bold">{currentObservation.stress}</span>
                </div>
                <div className="text-[10px] text-neutral-500">{currentObservation.phase} phase confirmed</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="text-[11px] font-mono text-emerald-400 font-semibold">
              TIME MACHINE CONCLUSION:
            </div>
            <p className="text-xs text-neutral-300/90 leading-relaxed font-sans">
              Plot A demonstrates complete chlorophyll recovery following precision biochar retention and held irrigation cycles.
            </p>

            <button
              onClick={() => soundFx.playClick()}
              className="w-full py-2.5 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export GeoTIFF Raster (10m)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
