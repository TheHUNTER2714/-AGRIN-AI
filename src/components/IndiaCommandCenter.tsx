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
type GeoLevel = 'national' | 'state' | 'district' | 'village';

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
            Macro-level agricultural monitoring across 28 states and union territories.
          </p>
        </div>

        {/* Drill-down breadcrumbs (State -> District -> Block -> Village) */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setGeoLevel('national')}
            className={`px-3 py-1.5 rounded-full border cursor-pointer ${
              geoLevel === 'national' ? 'bg-emerald-500 text-black font-bold border-emerald-400' : 'glass-panel-subtle text-neutral-300'
            }`}
          >
            India
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
          <button
            onClick={() => setGeoLevel('state')}
            className={`px-3 py-1.5 rounded-full border cursor-pointer ${
              geoLevel === 'state' ? 'bg-emerald-500 text-black font-bold border-emerald-400' : 'glass-panel-subtle text-neutral-300'
            }`}
          >
            State (UP)
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
          <button
            onClick={() => setGeoLevel('district')}
            className={`px-3 py-1.5 rounded-full border cursor-pointer ${
              geoLevel === 'district' ? 'bg-emerald-500 text-black font-bold border-emerald-400' : 'glass-panel-subtle text-neutral-300'
            }`}
          >
            Pratapgarh
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
          <button
            onClick={() => setGeoLevel('village')}
            className={`px-3 py-1.5 rounded-full border cursor-pointer ${
              geoLevel === 'village' ? 'bg-emerald-500 text-black font-bold border-emerald-400' : 'glass-panel-subtle text-neutral-300'
            }`}
          >
            4 Villages Cluster
          </button>
        </div>
      </div>

      {/* FEATURE 6: FARMER -> FPO -> GOVERNMENT MULTI-TIER NETWORK */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>FEATURE 06 &bull; DIGITAL PUBLIC GOOD MULTI-TIER AGGREGATION</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[#F9F8F3]">
              Farmer &rarr; FPO &rarr; Government Network
            </h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            District Scale Intelligence
          </div>
        </div>

        {/* Visual Architecture Flow */}
        <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {/* Step 1: Farmer */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-sm">
                🧑🌾
              </div>
              <div className="font-bold text-[#ECE8DD] text-sm">340 FARMERS</div>
              <p className="text-[11px] text-neutral-400 font-sans">
                Experiencing similar root-zone water stress across 4 neighboring villages.
              </p>
              <div className="text-[10px] text-emerald-400 font-bold">IoT & Satellite Telemetry Ingested</div>
            </div>

            {/* Step 2: FPO */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center font-bold text-sm">
                🏢
              </div>
              <div className="font-bold text-[#ECE8DD] text-sm">PRATAPGARH FPO HUB</div>
              <p className="text-[11px] text-neutral-400 font-sans">
                AgriN aggregates individual farm stress signals into a verified micro-cluster.
              </p>
              <div className="text-[10px] text-cyan-400 font-bold">Hotspot Detected Across 4 Villages</div>
            </div>

            {/* Step 3: Agriculture Dept */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold text-sm">
                🏛
              </div>
              <div className="font-bold text-[#ECE8DD] text-sm">AGRICULTURE DEPT.</div>
              <p className="text-[11px] text-neutral-400 font-sans">
                District officer receives automated priority canal discharge authorization.
              </p>
              <div className="text-[10px] text-amber-300 font-bold">Canal Gate Release Triggered</div>
            </div>
          </div>

          {/* District Insight Banner */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-cyan-200 block mb-0.5">
                REAL-TIME DISTRICT ACTION OUTCOME:
              </span>
              <p className="text-neutral-300 leading-relaxed font-sans">
                &ldquo;Water-stress hotspot detected across 4 villages. AgriN aggregated anonymized farmer telemetry and dispatched an automated priority alert to the District Irrigation Officer. Canal discharge scheduled for 06:00 AM tomorrow.&rdquo;
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
