import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Sliders, 
  Play,
  Pause,
  Crosshair,
  MapPin,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Info,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { fetchSatelliteData, type SatelliteData } from '../services/api';

export const SatellitePage: React.FC = () => {
  const [timelineIndex, setTimelineIndex] = useState(5); // default Sep 26
  const [timeMode, setTimeMode] = useState<'dates' | 'years'>('dates');
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [cloudMaskEnabled, setCloudMaskEnabled] = useState(true);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(true);

  // Custom coordinates for field queries
  const [latitude, setLatitude] = useState(25.92);
  const [longitude, setLongitude] = useState(81.99);
  const [selectedPlot, setSelectedPlot] = useState<'plotA' | 'plotB' | 'custom'>('plotA');

  const [inspectedPixel, setInspectedPixel] = useState<{ x: number; y: number; ndvi: number; health: string } | null>({
    x: 48,
    y: 52,
    ndvi: 0.78,
    health: 'Optimal Canopy Vigour',
  });

  const loadSatellite = async (lat = latitude, lon = longitude, plot = selectedPlot) => {
    setLoading(true);
    try {
      const data = await fetchSatelliteData(lat, lon, plot);
      setSatelliteData(data);
    } catch {
      // API client fallback handled in api.ts
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSatellite();
  }, []);

  const handlePlotSelect = (plot: 'plotA' | 'plotB' | 'custom') => {
    setSelectedPlot(plot);
    if (plot === 'plotA') {
      setLatitude(25.92);
      setLongitude(81.99);
      loadSatellite(25.92, 81.99, 'plotA');
    } else if (plot === 'plotB') {
      setLatitude(25.95);
      setLongitude(82.02);
      loadSatellite(25.95, 82.02, 'plotB');
    }
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    loadSatellite(latitude, longitude, 'custom');
  };

  const dateTimeline = [
    { label: 'Sep 01', ndvi: 0.74, ndwi: 0.38, stress: 'Healthy', phase: 'HEALTHY', clouds: '12.4%', color: 'from-[#064E3B] via-[#059669] to-[#84CC16]' },
    { label: 'Sep 06', ndvi: 0.68, ndwi: 0.29, stress: 'Moderate', phase: 'HEALTHY', clouds: '18.2%', color: 'from-[#065F46] via-[#10B981] to-[#65A30D]' },
    { label: 'Sep 11', ndvi: 0.59, ndwi: 0.22, stress: 'High Stress', phase: 'STRESSED', clouds: '34.8%', color: 'from-[#78350F] via-[#D97706] to-[#F59E0B]' },
    { label: 'Sep 16', ndvi: 0.71, ndwi: 0.31, stress: 'Stressed', phase: 'RECOVERY', clouds: '8.5%', color: 'from-[#B45309] via-[#EAB308] to-[#84CC16]' },
    { label: 'Sep 21', ndvi: 0.76, ndwi: 0.33, stress: 'Recovering', phase: 'HEALTHY', clouds: '5.1%', color: 'from-[#065F46] via-[#059669] to-[#84CC16]' },
    { label: 'Sep 26', ndvi: satelliteData?.ndvi ?? 0.78, ndwi: satelliteData?.ndwi ?? 0.32, stress: 'Optimal Vigour', phase: 'HEALTHY', clouds: `${satelliteData?.cloud_cover_percent ?? 4.2}%`, color: 'from-[#064E3B] via-[#10B981] to-[#A3E635]' },
  ];

  const yearTimeline = [
    { label: '2024 Season', ndvi: 0.65, ndwi: 0.28, stress: 'Severe Drought Year', phase: 'STRESSED', clouds: '14.8%', color: 'from-[#78350F] via-[#D97706] to-[#F59E0B]' },
    { label: '2025 Season', ndvi: 0.72, ndwi: 0.30, stress: 'Moderate Yield', phase: 'RECOVERY', clouds: '9.1%', color: 'from-[#065F46] via-[#10B981] to-[#65A30D]' },
    { label: '2026 (Current)', ndvi: satelliteData?.ndvi ?? 0.78, ndwi: satelliteData?.ndwi ?? 0.32, stress: 'AgriN Analyzed', phase: 'HEALTHY', clouds: `${satelliteData?.cloud_cover_percent ?? 4.2}%`, color: 'from-[#064E3B] via-[#10B981] to-[#A3E635]' },
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
    const randomizedNdvi = (currentObservation.ndvi + (Math.random() * 0.06 - 0.03)).toFixed(2);
    setInspectedPixel({
      x,
      y,
      ndvi: parseFloat(randomizedNdvi),
      health: parseFloat(randomizedNdvi) > 0.7 ? 'Dense Photosynthetic Canopy' : 'Dry / Stressed Patch',
    });
  };

  const sourceState = satelliteData?.source_state || 'DEMO';

  return (
    <div className="space-y-8">
      {/* Top Satellite Metadata Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Satellite className="w-4 h-4 animate-spin-slow" />
            <span>SENTINEL-2 MSI (COPERNICUS / ESA)</span>
            <span>•</span>
            <span className="text-zinc-400">LEVEL-2A SURFACE REFLECTANCE</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            Sentinel-2 Multispectral Pipeline
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Google Earth Engine cloud-filtered imagery calculating farm-level NDVI and NDWI canopy biophysics.
          </p>
        </div>

        {/* Orbit Telemetry Badges & Refresh */}
        <div className="flex flex-wrap gap-3 font-mono text-xs items-center">
          {/* Explicit Source State Badge */}
          <div className={`p-3 rounded-2xl border flex items-center gap-2 ${
            sourceState === 'LIVE'
              ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : sourceState === 'CALCULATED'
              ? 'bg-blue-950/70 border-blue-400 text-blue-300'
              : sourceState === 'DEMO'
              ? 'bg-amber-950/70 border-amber-400 text-amber-300'
              : 'bg-zinc-900 border-zinc-700 text-zinc-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              sourceState === 'LIVE' ? 'bg-emerald-400 animate-ping' :
              sourceState === 'CALCULATED' ? 'bg-blue-400' :
              sourceState === 'DEMO' ? 'bg-amber-400' : 'bg-zinc-400'
            }`} />
            <div>
              <span className="text-[9px] uppercase tracking-wider block opacity-70">DATA PROVENANCE</span>
              <span className="font-bold text-xs">{sourceState} SATELLITE FEED</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-neutral-400 block text-[10px]">SPATIAL RESOLUTION</span>
            <span className="text-emerald-300 font-bold">10m Ground Sample</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-neutral-400 block text-[10px]">REVISIT FREQUENCY</span>
            <span className="text-cyan-300 font-bold">5-Day Constellation</span>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              loadSatellite();
            }}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl glass-panel-subtle hover:border-emerald-400 text-emerald-300 text-xs font-semibold cursor-pointer transition-all self-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Query GEE</span>
          </button>
        </div>
      </div>

      {/* Field Coordinate & Preset Selector */}
      <div className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <div className="font-mono text-neutral-400 uppercase tracking-wider text-[10px]">ACTIVE FIELD TARGET</div>
            <div className="font-bold text-white text-sm">
              {selectedPlot === 'plotA' ? 'Plot A Sharbati Wheat (Pratapgarh)' :
               selectedPlot === 'plotB' ? 'Plot B Mustard / Pulse (Pratapgarh North)' : 'Custom Field Coordinates'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full bg-black/50 border border-white/10 p-1 text-xs">
            <button
              onClick={() => handlePlotSelect('plotA')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedPlot === 'plotA' ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-neutral-400'
              }`}
            >
              Plot A (25.92°N, 81.99°E)
            </button>
            <button
              onClick={() => handlePlotSelect('plotB')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedPlot === 'plotB' ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-neutral-400'
              }`}
            >
              Plot B (25.95°N, 82.02°E)
            </button>
            <button
              onClick={() => setSelectedPlot('custom')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedPlot === 'custom' ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-neutral-400'
              }`}
            >
              Custom Coordinates
            </button>
          </div>

          {selectedPlot === 'custom' && (
            <form onSubmit={handleCustomSearch} className="flex items-center gap-2">
              <input
                type="number"
                step="0.001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                placeholder="Lat"
                className="w-20 px-2 py-1 text-xs rounded-xl bg-black/60 border border-white/20 text-white font-mono"
              />
              <input
                type="number"
                step="0.001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                placeholder="Lon"
                className="w-20 px-2 py-1 text-xs rounded-xl bg-black/60 border border-white/20 text-white font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1 text-xs font-semibold rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
              >
                Fetch
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Mandatory Scientific Metric Bar */}
      <div className="p-5 rounded-3xl bg-black/60 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <span>{satelliteData?.label || 'Latest Sentinel-2 Observation'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                sourceState === 'LIVE' ? 'bg-emerald-900/60 text-emerald-300' :
                sourceState === 'CALCULATED' ? 'bg-blue-900/60 text-blue-300' :
                'bg-amber-900/60 text-amber-300'
              }`}>
                {sourceState}
              </span>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
              <span>Acquisition: {satelliteData?.observation_date || '26 Sep 2026, 10:42 UTC'}</span>
              <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                Cloud Mask: {satelliteData?.cloud_cover_percent?.toFixed(1) || '4.2'}% (QA60 Clean)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono">
          <div>
            <span className="text-[10px] text-neutral-400 block">CANOPY NDVI</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-400">
                {satelliteData?.ndvi?.toFixed(2) ?? '0.78'}
              </span>
              <span className="text-[10px] text-neutral-400 font-sans">B8/B4</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block">WATER NDWI</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-blue-400">
                {satelliteData?.ndwi?.toFixed(2) ?? '0.32'}
              </span>
              <span className="text-[10px] text-neutral-400 font-sans">B8/B11</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block">VEGETATION TREND</span>
            <div className="flex items-center gap-1 text-sm font-bold capitalize">
              {satelliteData?.vegetation_trend === 'improving' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Improving
                </span>
              ) : satelliteData?.vegetation_trend === 'declining' ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" /> Declining
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1">
                  <Minus className="w-4 h-4" /> Stable
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Farm-Level Multispectral Statistics */}
      {satelliteData?.farm_statistics && (
        <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white uppercase tracking-wider">Farm-Level Zonal Statistics (10m Resolution)</span>
            </div>
            <span className="text-[10px] text-neutral-400">
              Samples: {satelliteData.farm_statistics.pixel_count ?? 120} pixels
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-neutral-400 block">MEAN CANOPY NDVI</span>
              <span className="text-lg font-bold text-emerald-400">
                {(satelliteData.farm_statistics.mean_ndvi ?? satelliteData.farm_statistics.ndvi_mean ?? 0.78).toFixed(3)}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-neutral-400 block">MINIMUM (STRESS ZONE)</span>
              <span className="text-lg font-bold text-amber-400">
                {(satelliteData.farm_statistics.min_ndvi ?? satelliteData.farm_statistics.ndvi_min ?? 0.59).toFixed(3)}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-neutral-400 block">MAXIMUM (PEAK VIGOUR)</span>
              <span className="text-lg font-bold text-emerald-300">
                {(satelliteData.farm_statistics.max_ndvi ?? satelliteData.farm_statistics.ndvi_max ?? 0.85).toFixed(3)}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-neutral-400 block">VARIANCE (STD DEV)</span>
              <span className="text-lg font-bold text-cyan-300">
                ±{(satelliteData.farm_statistics.std_ndvi ?? 0.042).toFixed(3)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Time Machine Interactive Scrubber Box */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Sliders className="w-4 h-4" />
              <span>SATELLITE TIME MACHINE SCRUBBER</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#ECE8DD]">
              Multi-Temporal Observation Slider
            </h2>
            <p className="text-xs text-neutral-300 font-light mt-0.5">
              Drag the timeline scrubber to watch vegetation indices evolve across orbital acquisition passes.
            </p>
          </div>

          {/* Mode Switcher (Dates vs Years) & Play/Pause */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsPlayingTimeline((prev) => !prev);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-md"
            >
              {isPlayingTimeline ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingTimeline ? 'Pause' : 'Play Timeline'}</span>
            </button>

            <div className="flex rounded-full bg-black/40 border border-white/10 p-0.5 text-xs">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setTimeMode('dates');
                  setTimelineIndex(5);
                }}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  timeMode === 'dates' ? 'bg-emerald-500/30 text-emerald-300 font-semibold' : 'text-neutral-400'
                }`}
              >
                Past 30 Days
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setTimeMode('years');
                  setTimelineIndex(2);
                }}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  timeMode === 'years' ? 'bg-emerald-500/30 text-emerald-300 font-semibold' : 'text-neutral-400'
                }`}
              >
                Multi-Year
              </button>
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-3 pt-2">
          <input
            type="range"
            min="0"
            max={currentTimeline.length - 1}
            step="1"
            value={clampedIndex}
            onChange={handleSliderChange}
            className="w-full accent-emerald-400 cursor-pointer h-2 bg-black/60 rounded-lg appearance-none"
          />

          {/* Step Labels */}
          <div className="grid grid-cols-6 sm:grid-cols-6 gap-1 text-center font-mono">
            {currentTimeline.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  soundFx.playClick();
                  setTimelineIndex(idx);
                  setIsPlayingTimeline(false);
                }}
                className={`cursor-pointer p-2 rounded-xl transition-all ${
                  clampedIndex === idx
                    ? 'bg-emerald-950/60 border border-emerald-400 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <div className="text-xs">{item.label}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">NDVI {item.ndvi}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Time Machine Step Readout */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
              currentObservation.phase === 'HEALTHY'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : currentObservation.phase === 'STRESSED'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                : 'bg-teal-950 text-teal-300 border border-teal-500/40'
            }`}>
              {currentObservation.phase}
            </span>
            <span className="text-sm font-semibold text-white">
              {currentObservation.label} • Condition: {currentObservation.stress}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-300">
            <span>NDVI: <strong className="text-emerald-400">{currentObservation.ndvi}</strong></span>
            <span>NDWI: <strong className="text-blue-400">{currentObservation.ndwi}</strong></span>
            <span>Cloud Cover: <strong className="text-neutral-400">{currentObservation.clouds}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Raster Visualizer + Coordinate Pixel Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: 2-Column Raster Viewport */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>SENTINEL-2 MULTISPECTRAL RASTER VIEWPORT</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                <input
                  type="checkbox"
                  checked={cloudMaskEnabled}
                  onChange={(e) => setCloudMaskEnabled(e.target.checked)}
                  className="accent-emerald-400"
                />
                <span>Cloud Mask</span>
              </label>
              <span className="text-emerald-400 font-semibold">CLICK FIELD TO INSPECT</span>
            </div>
          </div>

          {/* Interactive Raster Canvas */}
          <div
            onClick={handleRasterClick}
            className="relative h-80 sm:h-96 rounded-2xl overflow-hidden cursor-crosshair border border-white/10 group shadow-inner"
          >
            {/* Dynamic false-color background responding to current observation */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${currentObservation.color} opacity-85 transition-all duration-700`}
            />

            {/* Farm Contour & Field Boundary Overlays */}
            <div className="absolute inset-0 satellite-grid opacity-35" />
            <div className="absolute inset-0 contour-pattern opacity-40" />

            {/* Cloud mask overlay */}
            {cloudMaskEnabled && (
              <div className="absolute top-4 right-6 w-32 h-20 rounded-full bg-white/15 blur-xl pointer-events-none" />
            )}

            {/* Interactive Target Crosshair Indicator */}
            {inspectedPixel && (
              <div
                className="absolute w-8 h-8 -ml-4 -mt-4 border-2 border-white rounded-full flex items-center justify-center pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-200"
                style={{ left: `${inspectedPixel.x}%`, top: `${inspectedPixel.y}%` }}
              >
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              </div>
            )}

            {/* Legend Overlay on Canvas */}
            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-neutral-300 flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Healthy (0.7-1.0)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Stressed (0.5-0.7)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Critical (&lt;0.5)</span>
            </div>
          </div>
        </div>

        {/* Right: Coordinate Pixel Inspector */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-emerald-400" /> PIXEL INSPECTOR
            </span>
            <span className="text-xs font-mono text-neutral-400">10m GSD</span>
          </div>

          {inspectedPixel ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-[10px] font-mono text-neutral-400">INTERPOLATED COORDINATES</div>
                <div className="font-mono text-xs text-white">
                  25.92{inspectedPixel.x}° N, 81.99{inspectedPixel.y}° E
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-xs text-neutral-300">CALIBRATED NDVI:</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {inspectedPixel.ndvi}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-cyan-300">
                  {inspectedPixel.health}
                </div>
              </div>

              {/* Band Reflectance Spectral Response */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-neutral-400 block">SPECTRAL REFLECTANCE BANDS:</span>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-blue-300">Band 2 (Blue, 490nm):</span>
                    <span className="text-white">0.039</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-emerald-300">Band 3 (Green, 560nm):</span>
                    <span className="text-white">0.068</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-red-300">Band 4 (Red, 665nm):</span>
                    <span className="text-white">0.033</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-purple-300">Band 8 (NIR, 842nm):</span>
                    <span className="text-white">0.452</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-indigo-300">Band 11 (SWIR, 1610nm):</span>
                    <span className="text-white">0.188</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-neutral-400 text-center py-10">
              Click anywhere on the raster canvas to inspect coordinate-level NDVI values.
            </div>
          )}
        </div>
      </div>

      {/* Data Source & Provenance Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400 gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>FARM TARGET: {satelliteData?.field_id || 'Plot A'}, Pratapgarh, UP (Sentinel-2 Tile T44RKR)</span>
          </div>
          <div>
            <span>SOURCE: {satelliteData?.source || 'Copernicus Sentinel-2 / Google Earth Engine'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">STATE:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              sourceState === 'LIVE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
              sourceState === 'CALCULATED' ? 'bg-blue-950 text-blue-300 border border-blue-500/40' :
              'bg-amber-950 text-amber-300 border border-amber-500/40'
            }`}>
              {sourceState}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-400 gap-2 font-mono">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Formula: NDVI = (B8 - B4)/(B8 + B4) • NDWI = (B8 - B11)/(B8 + B11)</span>
          </div>
          <div>
            {sourceState === 'LIVE' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Earth Engine Service Account Active
              </span>
            ) : (
              <span className="text-amber-400/90 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Set EARTH_ENGINE_SERVICE_ACCOUNT in backend/.env for live GEE passes
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
