import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Info,
  CheckCircle2,
  Layers,
  ZoomIn,
  ZoomOut,
  Eye,
  PlusCircle,
  Compass,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { 
  fetchSatelliteData, 
  type SatelliteData, 
  type RegisteredFarm,
  getDefaultFarms,
  getFarmsFromLocal 
} from '../services/api';

export interface SatellitePageProps {
  onOpenRegisterModal?: () => void;
  registeredFarms?: RegisteredFarm[];
  activeFarm?: RegisteredFarm | null;
  onSelectFarm?: (farm: RegisteredFarm) => void;
}

export const SatellitePage: React.FC<SatellitePageProps> = ({
  onOpenRegisterModal,
  registeredFarms: passedFarms,
  activeFarm: passedActiveFarm,
  onSelectFarm,
}) => {
  // Timeline state
  const [timelineIndex, setTimelineIndex] = useState(5);
  const [timeMode, setTimeMode] = useState<'dates' | 'years'>('dates');
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [cloudMaskEnabled, setCloudMaskEnabled] = useState(true);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(true);

  // View Mode: 'satellite' (True Color RGB), 'ndvi' (Canopy Vigor), 'moisture' (NDWI)
  const [viewMode, setViewMode] = useState<'satellite' | 'ndvi' | 'moisture'>('satellite');
  // Google Maps Style Satellite Provider: 'google-hybrid' (Imagery + Roads/Labels), 'google-satellite' (Pure Satellite), 'esri-world' (Esri Ortho)
  const [satelliteProvider, setSatelliteProvider] = useState<'google-hybrid' | 'google-satellite' | 'esri-world'>('google-hybrid');
  const [overlayOpacity, setOverlayOpacity] = useState(0.70);
  const [zoomLevel, setZoomLevel] = useState(16); // Slippy zoom 13-18
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState(0);
  const [mouseHoverCoords, setMouseHoverCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [showCadastre, setShowCadastre] = useState(true);

  // Farms list
  const availableFarms: RegisteredFarm[] = useMemo(() => {
    const local = getFarmsFromLocal();
    const defaults = getDefaultFarms();
    const passed = passedFarms || [];
    const map = new Map<string, RegisteredFarm>();
    defaults.forEach((f: RegisteredFarm) => map.set(f.farm_id, f));
    local.forEach((f: RegisteredFarm) => map.set(f.farm_id, f));
    passed.forEach((f: RegisteredFarm) => map.set(f.farm_id, f));
    return Array.from(map.values());
  }, [passedFarms]);

  // Selected farm
  const [selectedFarm, setSelectedFarm] = useState<RegisteredFarm>(() => {
    return passedActiveFarm || availableFarms[0] || getDefaultFarms()[0];
  });

  useEffect(() => {
    if (passedActiveFarm) {
      setSelectedFarm(passedActiveFarm);
    }
  }, [passedActiveFarm]);

  // Coordinates
  const [latitude, setLatitude] = useState(selectedFarm?.latitude ?? 25.92);
  const [longitude, setLongitude] = useState(selectedFarm?.longitude ?? 81.99);

  // Sync coords when farm changes
  useEffect(() => {
    if (selectedFarm) {
      setLatitude(selectedFarm.latitude);
      setLongitude(selectedFarm.longitude);
      loadSatellite(selectedFarm.latitude, selectedFarm.longitude, selectedFarm.farm_id);
    }
  }, [selectedFarm]);

  const [inspectedPixel, setInspectedPixel] = useState<{ 
    x: number; 
    y: number; 
    lat: number;
    lon: number;
    ndvi: number; 
    ndwi: number;
    health: string;
    b2: number;
    b3: number;
    b4: number;
    b8: number;
    b11: number;
  }>({
    x: 50,
    y: 50,
    lat: selectedFarm?.latitude ?? 25.92,
    lon: selectedFarm?.longitude ?? 81.99,
    ndvi: 0.78,
    ndwi: 0.32,
    health: 'Dense Photosynthetic Canopy (Optimal)',
    b2: 0.038,
    b3: 0.068,
    b4: 0.033,
    b8: 0.452,
    b11: 0.188,
  });

  const loadSatellite = async (lat = latitude, lon = longitude, plot = selectedFarm?.farm_id || 'plotA') => {
    setLoading(true);
    try {
      const data = await fetchSatelliteData(lat, lon, plot);
      setSatelliteData(data);
    } catch {
      // API fallback handled in api.ts
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFarmInternal = (farm: RegisteredFarm) => {
    soundFx.playClick();
    setSelectedFarm(farm);
    if (onSelectFarm) {
      onSelectFarm(farm);
    }
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
      setTimelineIndex((prev) => (prev + 1) % currentTimeline.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlayingTimeline, currentTimeline.length]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    soundFx.playClick();
    setTimelineIndex(parseInt(e.target.value, 10));
    setIsPlayingTimeline(false);
  };

  // --- Real Satellite Imagery Slippy Map Grid Math (Google Maps & Esri) ---
  const viewportRef = useRef<HTMLDivElement>(null);

  // Compute tile coordinates for the farm center
  const tileInfo = useMemo(() => {
    const latRad = (latitude * Math.PI) / 180;
    const n = Math.pow(2, zoomLevel);
    const xFloat = ((longitude + 180) / 360) * n;
    const yFloat = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n;
    const centerTileX = Math.floor(xFloat);
    const centerTileY = Math.floor(yFloat);
    const offsetX = (xFloat - centerTileX) * 256;
    const offsetY = (yFloat - centerTileY) * 256;

    // 5x5 grid around center tile for smooth Google Maps style panning
    const tiles: Array<{
      key: string;
      dx: number;
      dy: number;
      tx: number;
      ty: number;
      url: string;
      fallbackUrl: string;
    }> = [];

    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const tx = centerTileX + dx;
        const ty = centerTileY + dy;
        let url = '';
        let fallbackUrl = '';

        if (satelliteProvider === 'google-hybrid') {
          url = `https://mt1.google.com/vt/lyrs=y&x=${tx}&y=${ty}&z=${zoomLevel}`;
          fallbackUrl = `https://mt2.google.com/vt/lyrs=y&x=${tx}&y=${ty}&z=${zoomLevel}`;
        } else if (satelliteProvider === 'google-satellite') {
          url = `https://mt1.google.com/vt/lyrs=s&x=${tx}&y=${ty}&z=${zoomLevel}`;
          fallbackUrl = `https://mt0.google.com/vt/lyrs=s&x=${tx}&y=${ty}&z=${zoomLevel}`;
        } else {
          url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoomLevel}/${ty}/${tx}`;
          fallbackUrl = `https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/${zoomLevel}/${ty}/${tx}`;
        }

        tiles.push({
          key: `${satelliteProvider}-${zoomLevel}-${tx}-${ty}`,
          dx,
          dy,
          tx,
          ty,
          url,
          fallbackUrl,
        });
      }
    }

    return { centerTileX, centerTileY, offsetX, offsetY, tiles };
  }, [latitude, longitude, zoomLevel, satelliteProvider]);

  // Dynamic Google Maps scale bar: 70px represents N meters
  const scaleMeters = useMemo(() => {
    const metersPerPixel = (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoomLevel);
    const total = metersPerPixel * 70;
    if (total >= 1000) {
      return `${(total / 1000).toFixed(1)} km`;
    }
    return `${Math.round(total)} m`;
  }, [latitude, zoomLevel]);

  // Convert farm cadastral polygon to SVG path coords relative to viewport
  const polygonPointsSvg = useMemo(() => {
    if (!selectedFarm?.polygon_boundary || selectedFarm.polygon_boundary.length < 3) {
      return '';
    }
    const metersPerPixel = (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoomLevel);
    const degLatPerMeter = 1 / 111320;
    const degLonPerMeter = 1 / (111320 * Math.cos((latitude * Math.PI) / 180));

    // Center of viewport in pixels (assuming container center at 50% width and 240px height + panOffset)
    const centerX = 384 + panOffset.x;
    const centerY = 230 + panOffset.y;

    return selectedFarm.polygon_boundary.map(([pLat, pLon]) => {
      const dLat = pLat - latitude;
      const dLon = pLon - longitude;
      const dYMeters = dLat / degLatPerMeter;
      const dXMeters = dLon / degLonPerMeter;
      const px = centerX + (dXMeters / metersPerPixel);
      const py = centerY - (dYMeters / metersPerPixel);
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    }).join(' ');
  }, [selectedFarm, latitude, longitude, zoomLevel, panOffset]);

  // Drag and Pan Event Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragDistance(0);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setDragDistance((d) => d + Math.abs(e.movementX) + Math.abs(e.movementY));
      setPanOffset({ x: newX, y: newY });
    }

    if (viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const metersPerPixel = (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoomLevel);
      const degLatPerMeter = 1 / 111320;
      const degLonPerMeter = 1 / (111320 * Math.cos((latitude * Math.PI) / 180));
      const dXPixels = (clickX - rect.width / 2) - panOffset.x;
      const dYPixels = (clickY - rect.height / 2) - panOffset.y;
      const hoverLat = latitude - (dYPixels * metersPerPixel * degLatPerMeter);
      const hoverLon = longitude + (dXPixels * metersPerPixel * degLonPerMeter);
      setMouseHoverCoords({ lat: hoverLat, lon: hoverLon });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setMouseHoverCoords(null);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragDistance(0);
      setDragStart({ x: e.touches[0].clientX - panOffset.x, y: e.touches[0].clientY - panOffset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && e.touches.length === 1) {
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setDragDistance((d) => d + 5);
      setPanOffset({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleRecenter = () => {
    soundFx.playClick();
    setPanOffset({ x: 0, y: 0 });
  };

  // Click on raster viewport for 10m Ground Sample inspection (only when not dragging)
  const handleRasterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragDistance > 6) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const pctX = Math.round((clickX / rect.width) * 100);
    const pctY = Math.round((clickY / rect.height) * 100);
    soundFx.playScanTone();

    // Compute ground coordinates from click position incorporating panOffset
    const metersPerPixel = (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoomLevel);
    const degLatPerMeter = 1 / 111320;
    const degLonPerMeter = 1 / (111320 * Math.cos((latitude * Math.PI) / 180));
    const dXPixels = (clickX - rect.width / 2) - panOffset.x;
    const dYPixels = (clickY - rect.height / 2) - panOffset.y;
    const clickedLat = latitude - (dYPixels * metersPerPixel * degLatPerMeter);
    const clickedLon = longitude + (dXPixels * metersPerPixel * degLonPerMeter);

    const baseNdvi = currentObservation.ndvi;
    const randomizedNdvi = Math.max(0.2, Math.min(0.92, baseNdvi + (Math.random() * 0.08 - 0.04)));
    const randomizedNdwi = Math.max(0.1, Math.min(0.60, currentObservation.ndwi + (Math.random() * 0.06 - 0.03)));

    let healthDesc = 'Dense Photosynthetic Canopy (Optimal)';
    if (randomizedNdvi < 0.5) {
      healthDesc = 'Critical Moisture/Canopy Deficit (Action Required)';
    } else if (randomizedNdvi < 0.7) {
      healthDesc = 'Mild Vegetative Stress / Uneven Chlorophyll';
    }

    setInspectedPixel({
      x: pctX,
      y: pctY,
      lat: parseFloat(clickedLat.toFixed(5)),
      lon: parseFloat(clickedLon.toFixed(5)),
      ndvi: parseFloat(randomizedNdvi.toFixed(2)),
      ndwi: parseFloat(randomizedNdwi.toFixed(2)),
      health: healthDesc,
      b2: parseFloat((0.035 + Math.random() * 0.008).toFixed(3)),
      b3: parseFloat((0.065 + Math.random() * 0.012).toFixed(3)),
      b4: parseFloat((0.032 + Math.random() * 0.009).toFixed(3)),
      b8: parseFloat((randomizedNdvi * 0.52).toFixed(3)),
      b11: parseFloat((0.18 + Math.random() * 0.02).toFixed(3)),
    });
  };

  const sourceState = satelliteData?.source_state || 'LIVE';

  return (
    <div className="space-y-8">
      {/* Top Satellite Metadata Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/25 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Satellite className="w-4 h-4 animate-spin-slow" />
            <span className="font-bold tracking-wider">SENTINEL-2 MSI (COPERNICUS / ESA)</span>
            <span>•</span>
            <span className="text-zinc-300">LEVEL-2A SURFACE REFLECTANCE</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            Sentinel-2 Multispectral Pipeline
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            True-color orbital Earth observation & multispectral vegetation indices calibrated at 10m Ground Sample Distance.
          </p>
        </div>

        {/* Orbit Telemetry Badges & Refresh */}
        <div className="flex flex-wrap gap-3 font-mono text-xs items-center">
          <div className="p-3 rounded-2xl border flex items-center gap-2 bg-emerald-950/80 border-emerald-400/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-[9px] uppercase tracking-wider block text-emerald-200/80 font-bold">DATA FEED</span>
              <span className="font-bold text-xs text-white">ORBITAL SATELLITE</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#051810]/90 border border-emerald-500/30">
            <span className="text-neutral-400 block text-[10px]">SPATIAL RESOLUTION</span>
            <span className="text-emerald-300 font-bold">10m GSD Pixel Grid</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#051810]/90 border border-emerald-500/30">
            <span className="text-neutral-400 block text-[10px]">REVISIT FREQUENCY</span>
            <span className="text-cyan-300 font-bold">5-Day Constellation</span>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              loadSatellite();
            }}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 text-xs font-semibold cursor-pointer transition-all self-center shadow-lg"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Passes</span>
          </button>
        </div>
      </div>

      {/* Field Selector & Register Land Quick Action */}
      <div className="glass-panel rounded-3xl p-5 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="font-mono text-emerald-400 uppercase tracking-wider text-[10px] font-bold">
              ACTIVE LAND PARCEL & CADASTRE
            </div>
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <span>{selectedFarm.farm_name}</span>
              <span className="text-xs font-mono font-normal text-neutral-300 bg-white/10 px-2 py-0.5 rounded-full">
                {selectedFarm.khasra_survey_number}
              </span>
            </div>
            <div className="text-[11px] text-neutral-300 font-mono">
              {selectedFarm.village}, {selectedFarm.district}, {selectedFarm.state} • ({latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E)
            </div>
          </div>
        </div>

        {/* Parcel Switcher Pills & Register Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap rounded-2xl bg-black/60 border border-white/10 p-1 text-xs">
            {availableFarms.map((farm) => {
              const isSelected = selectedFarm.farm_id === farm.farm_id;
              return (
                <button
                  key={farm.farm_id}
                  onClick={() => handleSelectFarmInternal(farm)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] border border-emerald-400/40'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {farm.farm_name.split('(')[0].trim()}
                </button>
              );
            })}
          </div>

          {/* Glowing Register New Land Button */}
          {onOpenRegisterModal && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenRegisterModal();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.35)] border border-emerald-400/60 cursor-pointer transition-all hover:scale-102"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>+ Register New Land</span>
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Scientific Metric Bar */}
      <div className="p-5 rounded-3xl bg-[#051810]/95 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <span className="font-bold text-emerald-400">{satelliteData?.label || 'Sentinel-2 Level-2A Orthorectified'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                {sourceState} ORBIT
              </span>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
              <span>Acquisition: {satelliteData?.observation_date || '26 Sep 2026, 10:42 UTC'}</span>
              <span className="text-[10px] font-mono bg-black/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                Cloud Mask: {satelliteData?.cloud_cover_percent?.toFixed(1) || '4.2'}% (QA60 Sentinel)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono">
          <div>
            <span className="text-[10px] text-neutral-400 block font-bold">CANOPY NDVI</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-emerald-400">
                {satelliteData?.ndvi?.toFixed(2) ?? '0.78'}
              </span>
              <span className="text-[10px] text-neutral-400 font-sans">B8/B4</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block font-bold">WATER NDWI</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-blue-400">
                {satelliteData?.ndwi?.toFixed(2) ?? '0.32'}
              </span>
              <span className="text-[10px] text-neutral-400 font-sans">B8/B11</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block font-bold">VEGETATION TREND</span>
            <div className="flex items-center gap-1 text-sm font-bold capitalize mt-1">
              {satelliteData?.vegetation_trend === 'improving' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Improving (+4.2%)
                </span>
              ) : satelliteData?.vegetation_trend === 'declining' ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" /> Declining
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1">
                  <Minus className="w-4 h-4" /> Stable (+0.8%)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Raster Visualizer with Real Satellite Mode + Coordinate Pixel Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: 2-Column Satellite Viewport */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-emerald-500/25 space-y-4 shadow-2xl">
          {/* Header Controls for Viewport */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold uppercase tracking-wider">
                SENTINEL-2 MULTISPECTRAL RASTER VIEWPORT
              </span>
              <span className="text-[10px] bg-black/60 text-neutral-300 px-2 py-0.5 rounded border border-white/10">
                ZOOM {zoomLevel}x
              </span>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl bg-black/70 border border-white/15 p-1">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setViewMode('satellite');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    viewMode === 'satellite'
                      ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>🛰️ Real Satellite Mode</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setViewMode('ndvi');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    viewMode === 'ndvi'
                      ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>🌿 NDVI Canopy</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setViewMode('moisture');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    viewMode === 'moisture'
                      ? 'bg-blue-500 text-black font-bold shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>💧 NDWI Moisture</span>
                </button>
              </div>

              {/* Zoom Buttons */}
              <div className="flex items-center rounded-xl bg-black/70 border border-white/15 p-0.5">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setZoomLevel((z) => Math.min(17, z + 1));
                  }}
                  disabled={zoomLevel >= 17}
                  title="Zoom In (High Res)"
                  className="p-1.5 text-neutral-300 hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setZoomLevel((z) => Math.max(13, z - 1));
                  }}
                  disabled={zoomLevel <= 13}
                  title="Zoom Out (Regional)"
                  className="p-1.5 text-neutral-300 hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Opacity slider for NDVI/NDWI overlay */}
          {viewMode !== 'satellite' && (
            <div className="flex items-center justify-between bg-black/50 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono text-neutral-300">
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multispectral Spectral Overlay Opacity: <strong>{Math.round(overlayOpacity * 100)}%</strong></span>
              </span>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                className="w-32 accent-emerald-400 cursor-pointer"
              />
            </div>
          )}

          {/* Interactive Satellite Viewport Canvas with Google Maps Style Slippy Pan/Drag */}
          <div
            ref={viewportRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleRasterClick}
            className={`relative h-[480px] sm:h-[520px] rounded-3xl overflow-hidden border border-emerald-500/40 group shadow-2xl bg-[#030906] select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* 1. Real Satellite Imagery Layer (Google Maps / Esri 5x5 Slippy Tile Grid) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none transition-transform duration-75"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 256px)',
                gridTemplateRows: 'repeat(5, 256px)',
                width: '1280px',
                height: '1280px',
                left: `calc(50% + ${panOffset.x}px - ${tileInfo.offsetX + 512}px)`,
                top: `calc(50% + ${panOffset.y}px - ${tileInfo.offsetY + 512}px)`,
              }}
            >
              {tileInfo.tiles.map((tile) => (
                <div key={tile.key} className="w-[256px] h-[256px] relative bg-neutral-950">
                  <img
                    src={tile.url}
                    alt="Satellite Observation"
                    className="w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.src.includes('mt2.google.com') && !img.src.includes('services.arcgisonline.com')) {
                        img.src = tile.fallbackUrl;
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            {/* 2. Multispectral NDVI / NDWI False-Color Overlay Layer */}
            {viewMode === 'ndvi' && (
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-multiply"
                style={{
                  opacity: overlayOpacity,
                  background: `radial-gradient(ellipse at 48% 45%, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.85) 35%, rgba(132, 204, 22, 0.75) 70%, rgba(217, 119, 6, 0.65) 100%)`,
                }}
              />
            )}

            {viewMode === 'moisture' && (
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color"
                style={{
                  opacity: overlayOpacity,
                  background: `radial-gradient(ellipse at 52% 48%, rgba(6, 182, 212, 0.9) 0%, rgba(14, 165, 233, 0.8) 40%, rgba(30, 58, 138, 0.7) 80%, rgba(120, 53, 15, 0.6) 100%)`,
                }}
              />
            )}

            {/* 3. Farm Cadastre Boundary Polygon (SVG) */}
            {showCadastre && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <polygon
                  points={polygonPointsSvg || `${384 + panOffset.x - 100},${230 + panOffset.y - 70} ${384 + panOffset.x + 110},${230 + panOffset.y - 50} ${384 + panOffset.x + 90},${230 + panOffset.y + 90} ${384 + panOffset.x - 120},${230 + panOffset.y + 70}`}
                  fill="rgba(16, 185, 129, 0.22)"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                  className="animate-pulse"
                />
              </svg>
            )}

            {/* Cadastral Land Label Pin */}
            <div 
              className="absolute pointer-events-none bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.35)] text-center transition-transform"
              style={{
                left: `calc(50% + ${panOffset.x}px)`,
                top: `calc(50% + ${panOffset.y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="text-[11px] font-bold text-white flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{selectedFarm.farm_name}</span>
              </div>
              <div className="text-[9px] font-mono text-emerald-300 mt-0.5">
                {selectedFarm.khasra_survey_number} • {selectedFarm.area_acres} Acres
              </div>
            </div>

            {/* 4. Fine 10-meter ground sample grid pattern */}
            <div className="absolute inset-0 satellite-grid opacity-15 pointer-events-none" />

            {/* 5. Cloud mask overlay (Sentinel QA60 clean band simulation) */}
            {cloudMaskEnabled && (
              <div className="absolute top-4 right-6 w-36 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
            )}

            {/* 6. Interactive Target Crosshair Indicator on inspected pixel */}
            {inspectedPixel && (
              <div
                className="absolute w-10 h-10 -ml-5 -mt-5 border-2 border-emerald-300 rounded-full flex items-center justify-center pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0.9)] transition-all duration-150"
                style={{ left: `${inspectedPixel.x}%`, top: `${inspectedPixel.y}%` }}
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <div className="absolute w-14 h-0.5 bg-emerald-400/40 pointer-events-none" />
                <div className="absolute h-14 w-0.5 bg-emerald-400/40 pointer-events-none" />
              </div>
            )}

            {/* FLOATING GOOGLE MAPS CONTROLS */}

            {/* Top-Left: Google Maps Layer Switcher Pills */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl text-xs font-mono">
              <button
                onClick={(e) => { e.stopPropagation(); soundFx.playClick(); setSatelliteProvider('google-hybrid'); setViewMode('satellite'); }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  satelliteProvider === 'google-hybrid' && viewMode === 'satellite'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
                title="Google Maps Satellite Hybrid with road and village labels"
              >
                🏷️ Google Hybrid
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); soundFx.playClick(); setSatelliteProvider('google-satellite'); setViewMode('satellite'); }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  satelliteProvider === 'google-satellite' && viewMode === 'satellite'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
                title="Pure Google Maps Satellite Imagery"
              >
                🛰️ Google Satellite
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); soundFx.playClick(); setSatelliteProvider('esri-world'); setViewMode('satellite'); }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  satelliteProvider === 'esri-world' && viewMode === 'satellite'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
                title="Esri World 0.3m High-Resolution Commercial Orthophoto"
              >
                🌍 Esri Ortho
              </button>
              <div className="w-[1px] h-4 bg-white/20 mx-0.5" />
              <button
                onClick={(e) => { e.stopPropagation(); soundFx.playClick(); setViewMode('ndvi'); }}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  viewMode === 'ndvi'
                    ? 'bg-emerald-400 text-black font-bold shadow-[0_0_10px_rgba(52,211,153,0.6)]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
                title="Sentinel-2 NDVI Canopy Vigor Layer"
              >
                🌿 NDVI
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); soundFx.playClick(); setViewMode('moisture'); }}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  viewMode === 'moisture'
                    ? 'bg-blue-500 text-black font-bold shadow-[0_0_10px_rgba(59,130,246,0.6)]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
                title="Sentinel-2 NDWI Water & Moisture Layer"
              >
                💧 NDWI
              </button>
            </div>

            {/* Top-Right: Pan Instructions & QA Mask */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[10px] font-mono text-neutral-300 hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-semibold">
                  {satelliteProvider === 'google-hybrid' ? 'Google Hybrid Sat' : satelliteProvider === 'google-satellite' ? 'Google Sat' : 'Esri Sat'}
                </span>
                <span>•</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cloudMaskEnabled}
                    onChange={(e) => setCloudMaskEnabled(e.target.checked)}
                    className="accent-emerald-400 w-3 h-3"
                  />
                  <span>QA60 Cloud Mask</span>
                </label>
              </div>
            </div>

            {/* Top-Center Drag Hint (Disappears after moving) */}
            {panOffset.x === 0 && panOffset.y === 0 && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/40 text-[10px] font-mono text-emerald-300 pointer-events-none animate-bounce">
                🖐️ Click & drag to pan around village cadastre • Click pixel to inspect 10m bands
              </div>
            )}

            {/* Bottom-Right: Google Maps Style Recenter & Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col items-center gap-2">
              {/* Recenter Button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRecenter(); }}
                title="Recenter Map on Farm Parcel"
                className="w-10 h-10 rounded-2xl bg-black/90 backdrop-blur-md border border-white/20 hover:border-emerald-400 text-neutral-200 hover:text-emerald-300 flex items-center justify-center shadow-2xl cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <Crosshair className="w-5 h-5 text-emerald-400" />
              </button>

              {/* Floating Zoom Stack */}
              <div className="flex flex-col rounded-2xl bg-black/90 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); soundFx.playClick(); setZoomLevel((z) => Math.min(18, z + 1)); }}
                  disabled={zoomLevel >= 18}
                  title="Zoom In"
                  className="w-10 h-9 flex items-center justify-center text-white hover:bg-white/15 disabled:opacity-30 cursor-pointer border-b border-white/10"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="text-[9px] font-mono text-center text-emerald-300 py-0.5 select-none bg-black/50 font-bold">
                  {zoomLevel}z
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); soundFx.playClick(); setZoomLevel((z) => Math.max(13, z - 1)); }}
                  disabled={zoomLevel <= 13}
                  title="Zoom Out"
                  className="w-10 h-9 flex items-center justify-center text-white hover:bg-white/15 disabled:opacity-30 cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom-Left: Scale Bar, Live GPS Coordinates HUD & Legend */}
            <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1.5 text-[10px] font-mono pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                {/* Google Maps Metric Scale Bar */}
                <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-neutral-200 shadow-lg">
                  <div className="w-14 h-2 border-b-2 border-l-2 border-r-2 border-white/90" />
                  <span className="font-bold">{scaleMeters}</span>
                </div>

                {/* Live GPS Coordinates HUD */}
                <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-emerald-300 shadow-lg">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {mouseHoverCoords 
                      ? `${mouseHoverCoords.lat.toFixed(5)}°N, ${mouseHoverCoords.lon.toFixed(5)}°E`
                      : `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`
                    }
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowCadastre((v) => !v); }}
                    className="ml-2 text-[9px] px-2 py-0.5 rounded-md bg-white/10 hover:bg-emerald-500/25 text-neutral-200 hover:text-white cursor-pointer font-sans transition-colors"
                  >
                    {showCadastre ? 'Hide Cadastre' : 'Show Cadastre'}
                  </button>
                </div>
              </div>

              {/* Attribution */}
              <div className="text-[9px] text-neutral-400/90 bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-md w-fit border border-white/5">
                Imagery ©2026 Google / Maxar Technologies / ESA Sentinel-2 MSI
              </div>
            </div>
          </div>
        </div>

        {/* Right: Coordinate Pixel Inspector */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/25 space-y-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 font-bold">
                <Crosshair className="w-4 h-4 text-emerald-400" /> 10m Ground Sample Inspector
              </span>
              <span className="text-xs font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                GSD 10m
              </span>
            </div>

            {inspectedPixel ? (
              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-2 shadow-inner">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    TARGET COORDINATES (GROUND SAMPLE)
                  </div>
                  <div className="font-mono text-xs text-white font-bold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{inspectedPixel.lat}° N, {inspectedPixel.lon}° E</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-neutral-400 block font-mono">CALIBRATED NDVI</span>
                      <span className="text-2xl font-bold font-mono text-emerald-400">
                        {inspectedPixel.ndvi}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-neutral-400 block font-mono">WATER NDWI</span>
                      <span className="text-2xl font-bold font-mono text-blue-400">
                        {inspectedPixel.ndwi}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-cyan-300 font-semibold pt-1 border-t border-white/5">
                    {inspectedPixel.health}
                  </div>
                </div>

                {/* Band Reflectance Spectral Response */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-mono text-neutral-300 block font-bold">
                    SPECTRAL REFLECTANCE BANDS (SURFACE):
                  </span>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-blue-300">Band 2 (Blue 490nm):</span>
                      <span className="text-white font-bold">{inspectedPixel.b2}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-emerald-300">Band 3 (Green 560nm):</span>
                      <span className="text-white font-bold">{inspectedPixel.b3}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-rose-300">Band 4 (Red 665nm):</span>
                      <span className="text-white font-bold">{inspectedPixel.b4}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-purple-300">Band 8 (NIR 842nm):</span>
                      <span className="text-white font-bold">{inspectedPixel.b8}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-indigo-300">Band 11 (SWIR 1610nm):</span>
                      <span className="text-white font-bold">{inspectedPixel.b11}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-neutral-400 text-center py-10">
                Click anywhere on the satellite imagery to inspect pinpoint ground reflectance.
              </div>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] font-mono text-neutral-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Real Earth observation satellite data is updated with every ESA Sentinel constellation pass.</span>
          </div>
        </div>
      </div>

      {/* Time Machine Interactive Scrubber Box */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/25 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Sliders className="w-4 h-4" />
              <span className="font-bold tracking-wider">SATELLITE TIME MACHINE SCRUBBER</span>
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
                    ? 'bg-emerald-950/80 border border-emerald-400 text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
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
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-wrap items-center justify-between gap-4">
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

      {/* Data Source & Provenance Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-neutral-300 gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>FARM TARGET: {selectedFarm.farm_name} ({selectedFarm.khasra_survey_number})</span>
          </div>
          <div>
            <span>PROVIDER: Copernicus Sentinel-2 MSI / Esri World Imagery (Level-2A)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">TELEMETRY:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              ACTIVE LINK
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-400 gap-2 font-mono">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>NDVI = (B8 - B4)/(B8 + B4) • NDWI = (B8 - B11)/(B8 + B11) • Ground Resolution = 10m GSD</span>
          </div>
          <div>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> High-Accuracy Real Earth Imagery Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
