import React, { useState } from 'react';
import { 
  MapPin, 
  ShieldAlert, 
  Flame, 
  Droplet, 
  CloudRain, 
  Thermometer,
  Sprout,
  Users, 
  Send, 
  ChevronRight,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../utils/audio';

type MapLayer = 'disease' | 'water-stress' | 'heat' | 'rainfall' | 'crop-health' | 'residue';
type GeoLevel = 'national' | 'state' | 'district' | 'block' | 'village' | 'farm';

interface LevelMetrics {
  level: GeoLevel;
  label: string;
  fullName: string;
  scopeTag: string;
  crop: string;
  cropRisk: number;
  riskStatus: 'Critical' | 'Moderate' | 'Safe' | 'Guarded';
  waterStress: string;
  diseaseHotspots: number;
  soil: string;
  regenerativePractices: string;
  weatherSummary: string;
  monitoredFarms: string;
  monitoredArea: string;
  activeNDVI: string;
  directive: string;
}

const HIERARCHY_DATA: Record<GeoLevel, LevelMetrics> = {
  national: {
    level: 'national',
    label: 'India (National)',
    fullName: 'Republic of India — National Agro-Climatic Grid',
    scopeTag: 'MACRO NATIONAL SENTINEL (PROTOTYPE REGIONAL DATASET)',
    crop: 'Wheat, Rice, Pulses, Mustard Composite',
    cropRisk: 42,
    riskStatus: 'Moderate',
    waterStress: '-11% below decadal water baseline',
    diseaseHotspots: 142,
    soil: 'Alluvial (North), Black Cotton (Central), Red Laterite (South)',
    regenerativePractices: 'Direct Seeding (DSR), Happy Seeder Stubble Mulching, Pulse Rotation',
    weatherSummary: 'Southwest monsoon withdrawing; localized rain in Gangetic belt',
    monitoredFarms: 'Prototype Regional Dataset (Pratapgarh Hub Extrapolation)',
    monitoredArea: '40.0M Ha Target Topology',
    activeNDVI: '0.64 (National Mean)',
    directive: 'Issue national advisories for wheat rabi sowing preparation and paddy straw stubble burning mitigation.',
  },
  state: {
    level: 'state',
    label: 'Uttar Pradesh',
    fullName: 'Uttar Pradesh — Central Gangetic Agro-Climatic Zone',
    scopeTag: 'STATE JURISDICTION (75 DISTRICTS)',
    crop: 'Sharbati Wheat, Sugarcane, Mustard, Arhar',
    cropRisk: 54,
    riskStatus: 'Moderate',
    waterStress: '-8% below decadal average',
    diseaseHotspots: 38,
    soil: 'Deep Alluvial Silt Loam (pH 7.2 - 7.6)',
    regenerativePractices: 'Zero-till wheat seeding, Trichoderma soil application, Biochar infusion',
    weatherSummary: 'Rain showers forecasted in Eastern Awadh basin (27°C, 82% humidity)',
    monitoredFarms: '640,000 Farms in Provincial Cadastre',
    monitoredArea: '14.8M Hectares',
    activeNDVI: '0.71 (Statewide)',
    directive: 'Canal release scheduled for Southern Awadh canal network; alert issued for root rot in low-lying fields.',
  },
  district: {
    level: 'district',
    label: 'Pratapgarh',
    fullName: 'Pratapgarh District — Awadh Plain, UP',
    scopeTag: 'DISTRICT COLLECTORATE (17 BLOCKS)',
    crop: 'Wheat (PBW-343, HD-2967), Pusa Mustard',
    cropRisk: 67,
    riskStatus: 'Critical',
    waterStress: '+18% short-term water logging risk',
    diseaseHotspots: 14,
    soil: 'Alluvial Sandy Loam with Clay Sub-stratum (pH 7.4)',
    regenerativePractices: 'Alternate Wetting & Drying, Happy Seeder Stubble Mulch',
    weatherSummary: 'High rain probability 84%, 35mm precipitation expected in 14-24h',
    monitoredFarms: '48,200 Registered Holdings',
    monitoredArea: '371,000 Hectares',
    activeNDVI: '0.78 (Sentinel-2 L2A)',
    directive: 'Delay nitrogen urea top-dressing and chemical sprays until surface drainage clears within 48h.',
  },
  block: {
    level: 'block',
    label: 'Sadar Block',
    fullName: 'Sadar Tehsil / Block — Pratapgarh',
    scopeTag: 'TEHSIL BLOCK LEVEL (112 GRAM PANCHAYATS)',
    crop: 'Sharbati Wheat (Tillering Stage)',
    cropRisk: 62,
    riskStatus: 'Moderate',
    waterStress: 'Surface saturation 72% of field capacity',
    diseaseHotspots: 6,
    soil: 'Fine Silt Loam (SOC 0.58%)',
    regenerativePractices: 'Laser land levelling, community drainage furrows',
    weatherSummary: 'Scattered thunderstorms; wind gusts 22 km/h',
    monitoredFarms: '8,400 Block Farmers',
    monitoredArea: '42,000 Hectares',
    activeNDVI: '0.76 (Sentinel-2)',
    directive: 'FPO aggregation active: coordinate laser land levelling and drainage furrow clearing.',
  },
  village: {
    level: 'village',
    label: 'Pure Gosai Village',
    fullName: 'Pure Gosai Gram Panchayat Cluster (4 Hamlets)',
    scopeTag: 'VILLAGE PANCHAYAT LEVEL (340 HOUSEHOLDS)',
    crop: 'Wheat (PBW-343 / Sharbati)',
    cropRisk: 67,
    riskStatus: 'Critical',
    waterStress: 'Heavy rain forecasted — delay tube-well irrigation',
    diseaseHotspots: 2,
    soil: 'Alluvial Loam with In-situ Moisture 28%',
    regenerativePractices: 'AgriCycle Stubble Collection, 100% Zero-Burn Verified',
    weatherSummary: 'Cloudy, 27.7°C, Rain expected in 14h',
    monitoredFarms: '340 Registered Farmers',
    monitoredArea: '1,280 Hectares',
    activeNDVI: '0.78 (Sentinel-2 MSI)',
    directive: 'AgriCycle residue collection van arriving tomorrow morning. Straw baling subsidized at ₹1,800/ton.',
  },
  farm: {
    level: 'farm',
    label: 'Ayush Farm (Demo)',
    fullName: 'Ayush Demo Farm — Plot A-D (14.2 ha)',
    scopeTag: 'INDIVIDUAL PARCEL GROUND-TRUTH (PLOT A-D)',
    crop: 'Sharbati Wheat (Triticum aestivum L.)',
    cropRisk: 67,
    riskStatus: 'Critical',
    waterStress: 'Root-zone moisture 28% (Field capacity 68%)',
    diseaseHotspots: 1,
    soil: 'Alluvial Silt Loam (pH 7.4, N 185, P 24.5, K 340, SOC 0.58%)',
    regenerativePractices: 'Zero-till sowing, Happy Seeder mulch, Biochar trial',
    weatherSummary: '28.4°C • 82% Rain Probability (35mm in 14h)',
    monitoredFarms: 'Ayush Farm (Plot A)',
    monitoredArea: '14.2 Hectares',
    activeNDVI: '0.78 (Sentinel-2 MSI Level-2A)',
    directive: 'Do NOT irrigate today. Yellow Rust early foliar symptoms detected. Apply bio-fungicide post-rainfall.',
  },
};

interface StateData {
  id: string;
  name: string;
  districts: number;
  monitoredHa: string;
  riskStatus: 'Critical' | 'Moderate' | 'Safe';
  hotspotCount: number;
  waterDeficit: string;
  alertNote: string;
  villagesCovered: number;
}

export const IndiaCommandCenter: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('water-stress');
  const [geoLevel, setGeoLevel] = useState<GeoLevel>('district');
  const [selectedState, setSelectedState] = useState<string>('up');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const currentLevelData = HIERARCHY_DATA[geoLevel];

  const handleLevelChange = (lvl: GeoLevel) => {
    soundFx.playClick();
    setGeoLevel(lvl);
  };

  const statesData: Record<string, StateData> = {
    up: {
      id: 'up',
      name: 'Uttar Pradesh (Central Gangetic Plain)',
      districts: 75,
      monitoredHa: '14.8M Hectares',
      riskStatus: 'Moderate',
      hotspotCount: 14,
      waterDeficit: '-8% below decadal average',
      alertNote: 'High rainfall event forecasted in Southern Awadh (Pratapgarh, Raebareli, Prayagraj).',
      villagesCovered: 48,
    },
    punjab: {
      id: 'punjab',
      name: 'Punjab (Northern Green Belt)',
      districts: 23,
      monitoredHa: '4.2M Hectares',
      riskStatus: 'Critical',
      hotspotCount: 38,
      waterDeficit: '-22% groundwater overdraft',
      alertNote: 'Active residue stubble burning detected in Tarn Taran and Sangrur districts. AgriCycle dispatched.',
      villagesCovered: 62,
    },
    mh: {
      id: 'mh',
      name: 'Maharashtra (Deccan Agro-Climatic Zone)',
      districts: 36,
      monitoredHa: '11.4M Hectares',
      riskStatus: 'Safe',
      hotspotCount: 6,
      waterDeficit: '+4% reservoir storage',
      alertNote: 'Cotton pink bollworm monitoring active in Vidarbha region.',
      villagesCovered: 35,
    },
    mp: {
      id: 'mp',
      name: 'Madhya Pradesh (Malwa & Narmada Valley)',
      districts: 55,
      monitoredHa: '9.6M Hectares',
      riskStatus: 'Safe',
      hotspotCount: 9,
      waterDeficit: 'Normal',
      alertNote: 'Soybean harvest 84% completed; gram/chana sowing initiated.',
      villagesCovered: 39,
    },
  };

  const currentState = statesData[selectedState];

  const handleSendBroadcast = () => {
    soundFx.playChime(640, 0.4);
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>MINISTRY OF AGRICULTURE & ICAR AGRO-MONITORING COMMAND</span>
            <span>•</span>
            <span>NATIONAL CROP SENTINEL</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            India Agricultural Risk Map & Command
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Macro-to-micro drill-down across 28 states down to individual farm plots.
          </p>
        </div>

        {/* Drill-down breadcrumbs (India -> UP -> Pratapgarh -> Sadar Block -> Pure Gosai -> Ayush Farm) */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {(
            [
              { id: 'national', label: 'India' },
              { id: 'state', label: 'UP' },
              { id: 'district', label: 'Pratapgarh' },
              { id: 'block', label: 'Sadar Block' },
              { id: 'village', label: 'Pure Gosai' },
              { id: 'farm', label: 'Ayush Farm' },
            ] as { id: GeoLevel; label: string }[]
          ).map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />}
              <button
                onClick={() => handleLevelChange(item.id)}
                className={`px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                  geoLevel === item.id
                    ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-md'
                    : 'glass-panel-subtle text-neutral-300 hover:border-emerald-500/40'
                }`}
              >
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Dynamic Jurisdiction Banner showing live state of active level */}
      <div className="p-5 rounded-2xl bg-black/60 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
              SCOPE: {currentLevelData.scopeTag}
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-neutral-300 border border-zinc-700">
              PROTOTYPE REGIONAL DATASET
            </span>
          </div>
          <div className="text-xl font-display font-bold text-white">
            {currentLevelData.fullName}
          </div>
          <p className="text-xs text-neutral-300 font-light max-w-2xl">
            {currentLevelData.directive}
          </p>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-neutral-400">
            <div><span className="text-emerald-400 font-bold">Dominant Crop:</span> <span className="text-white">{currentLevelData.crop}</span></div>
            <div><span className="text-teal-400 font-bold">Soil Profile:</span> <span className="text-white">{currentLevelData.soil}</span></div>
            <div><span className="text-cyan-400 font-bold">Regenerative Practice:</span> <span className="text-white">{currentLevelData.regenerativePractices}</span></div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-center min-w-[100px]">
            <span className="text-[10px] text-neutral-400 block">CROP RISK</span>
            <span className={`text-lg font-bold ${
              currentLevelData.cropRisk > 60 ? 'text-red-400' : 'text-emerald-300'
            }`}>
              {currentLevelData.cropRisk} / 100
            </span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-center min-w-[100px]">
            <span className="text-[10px] text-neutral-400 block">HOTSPOTS</span>
            <span className="text-lg font-bold text-cyan-300">{currentLevelData.diseaseHotspots} Active</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 text-center min-w-[110px]">
            <span className="text-[10px] text-neutral-400 block">SENTINEL-2 NDVI</span>
            <span className="text-lg font-bold text-amber-300">{currentLevelData.activeNDVI}</span>
          </div>
        </div>
      </div>

      {/* FEATURE 21: FARMER -> FPO -> DISTRICT ALERT NETWORK (4-Stage Public Good Workflow) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">FEATURE 21: EARLY WARNING ALERT NETWORK</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[#F9F8F3]">
              Farmer &rarr; Nearby Farms &rarr; Village/FPO &rarr; District Agriculture View
            </h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-bold">
            ANONYMOUS AGGREGATE
          </div>
        </div>

        {/* 4-Stage Progressive Workflow Grid */}
        <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
            {/* Stage 1: One Farm */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div className="font-bold text-white text-xs">ONE FARM</div>
              <p className="text-[11px] text-neutral-400 font-sans">
                Leaf scan confirms Yellow Stripe Rust on flag leaf. Identity hashed.
              </p>
              <div className="text-[9px] text-emerald-300 bg-emerald-950/50 p-1.5 rounded border border-emerald-500/30">
                Single Anonymized Signal
              </div>
            </div>

            {/* Stage 2: Nearby Farms */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div className="font-bold text-white text-xs">NEARBY FARMS</div>
              <p className="text-[11px] text-neutral-400 font-sans">
                8 similar pathology signals identified within a 4km micro-climatic radius.
              </p>
              <div className="text-[9px] text-cyan-300 bg-cyan-950/50 p-1.5 rounded border border-cyan-500/30">
                8 Correlated Signals
              </div>
            </div>

            {/* Stage 3: Village / FPO */}
            <div className="p-4 rounded-xl bg-black/50 border border-amber-500/30 space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div className="font-bold text-white text-xs">VILLAGE / FPO HUB</div>
              <p className="text-[11px] text-neutral-400 font-sans">
                Potential epidemic cluster flagged. Automated bio-fungicide batch dispatch initiated.
              </p>
              <div className="text-[9px] text-amber-300 bg-amber-950/50 p-1.5 rounded border border-amber-500/30">
                Micro-Cluster Formed
              </div>
            </div>

            {/* Stage 4: District Agriculture View */}
            <div className="p-4 rounded-xl bg-black/50 border border-rose-500/30 space-y-2">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div className="font-bold text-white text-xs">DISTRICT AGRI VIEW</div>
              <p className="text-[11px] text-neutral-400 font-sans">
                District Agriculture Officer issues regional yellow rust alert to Tehsil KVK agronomists.
              </p>
              <div className="text-[9px] text-rose-300 bg-rose-950/50 p-1.5 rounded border border-rose-500/30">
                Regional Warning Issued
              </div>
            </div>
          </div>

          {/* Privacy Guarantee Banner */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-cyan-200 block mb-0.5 font-mono">
                PUBLIC DIGITAL INFRASTRUCTURE PRIVACY GUARANTEE:
              </span>
              <p className="text-neutral-300 leading-relaxed font-sans text-xs">
                No individual farmer name, mobile number, or survey parcel boundary is ever exposed to the district dashboard. All early warning signals are pooled into anonymized geographic aggregates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 10: 6 ALL-INDIA RISK HEATMAP LAYERS */}
      <div className="space-y-3">
        <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
          SELECT HEATMAP RISK LAYER (FEATURE 10):
        </span>

        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'disease', label: '🦠 Disease Outbreak Risk', icon: ShieldAlert },
            { id: 'water-stress', label: '💧 Water Stress / Deficit', icon: Droplet },
            { id: 'heat', label: '🌡 Heat Wave Anomaly', icon: Thermometer },
            { id: 'rainfall', label: '🌧 Rainfall / Flood Risk', icon: CloudRain },
            { id: 'crop-health', label: '🌱 Crop Health (NDVI Vigour)', icon: Sprout },
            { id: 'residue', label: '🔥 Residue Stubble Burning', icon: Flame },
          ].map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveLayer(layer.id as MapLayer);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-black font-extrabold shadow-lg scale-102'
                    : 'glass-panel-subtle text-neutral-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Simulation & State Drilldown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Interactive National Map Canvas */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>ACTIVE MACRO LAYER: {activeLayer.toUpperCase()}</span>
            <span className="text-emerald-400 font-semibold">REFRESHED: 10 MINS AGO</span>
          </div>

          {/* Graphical Map Representation with Dynamic Layer Color */}
          <div className="relative h-80 sm:h-[420px] rounded-2xl bg-black/60 border border-emerald-500/20 overflow-hidden p-6 flex flex-col justify-between">
            <div className="absolute inset-0 satellite-grid opacity-30 pointer-events-none" />

            {/* India Region Hotspots Simulation */}
            <div className="relative z-10 grid grid-cols-2 gap-4 h-full">
              {Object.values(statesData).map((st) => (
                <div
                  key={st.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedState(st.id);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedState === st.id
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-black/40 border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-display font-bold text-sm text-[#ECE8DD]">{st.name.split(' ')[0]}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      st.riskStatus === 'Critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : st.riskStatus === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {st.riskStatus}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-[11px] text-neutral-400">
                    <div>Coverage: <span className="text-emerald-300 font-semibold">{st.monitoredHa}</span></div>
                    <div>Active Hotspots: <span className="text-white font-bold">{st.hotspotCount}</span></div>
                    <div>Villages: <span className="text-cyan-300">{st.villagesCovered} Hubs</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom National Totals Ribbon */}
            <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400">
              <span>ALL INDIA MONITORED: <strong className="text-emerald-300">40.0M Ha</strong></span>
              <span>TOTAL ACTIVE TELEMETRY SENSORS: <strong className="text-white">182,400</strong></span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: State Details & Broadcast Advisory Dispatcher */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
              Jurisdiction Intelligence
            </span>

            <h3 className="font-display font-bold text-xl text-[#F9F8F3]">
              {currentState.name}
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-neutral-400 text-[10px]">TOTAL DISTRICTS MONITORED</span>
                <div className="text-emerald-300 font-bold text-base">{currentState.districts} Districts</div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-neutral-400 text-[10px]">HYDROLOGICAL DEFICIT STATUS</span>
                <div className="text-amber-300 font-bold">{currentState.waterDeficit}</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">OFFICIAL REGIONAL DIRECTIVE:</span>
                <p className="text-xs text-neutral-200 font-sans leading-relaxed">
                  {currentState.alertNote}
                </p>
              </div>
            </div>
          </div>

          {/* Mass Farmer Advisory Broadcast Tool */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Broadcast SMS / WhatsApp Bulletin</span>
            </div>

            <button
              onClick={handleSendBroadcast}
              disabled={broadcastSent}
              className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>
                {broadcastSent 
                  ? 'Dispatched to 142,000 Registered Farmers!' 
                  : 'Transmit Regional SMS Advisory'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
