import React, { useState } from 'react';
import { 
  Globe2, 
  Lock, 
  CheckCircle2, 
  RefreshCw,
  Code,
  FileCode,
  Copy
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const BricsNetworkPage: React.FC = () => {
  const [activeCountry, setActiveCountry] = useState<'india' | 'brazil' | 'sa' | 'china' | 'russia'>('india');
  const [transferTesting, setTransferTesting] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [isGeneratingPackage, setIsGeneratingPackage] = useState(false);
  const [generatedPackage, setGeneratedPackage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const nodes = {
    india: {
      name: 'India (Lead Agro-AI Hub)',
      flag: '🇮🇳',
      models: [
        { id: 'ind-1', name: 'Monsoon Wheat Phenology v4.2', params: '1.4B parameters', accuracy: '96.8%', type: 'Crop Phenology & Irrigation' },
        { id: 'ind-2', name: 'Yellow Stripe Rust Multimodal Vision', params: 'Multimodal Gemini Architecture', accuracy: 'ICAR Verified Benchmark', type: 'Foliar Pathology Vision' },
      ],
      climatePatterns: 'South Asian Tropical Monsoon, High Inter-annual Variability, Western Disturbances',
      agriculturalIndicators: {
        coverage: '40.0M Hectares',
        smallholderDensity: '86% Marginal (<2 Ha)',
        soilDominance: 'Alluvial & Black Cotton Vertisols',
        irrigationEfficiency: '64% Canal & Groundwater Tubewell',
      },
      contributedWeights: 'Drought-tolerant gene-phenotype embeddings',
    },
    brazil: {
      name: 'Brazil (Embrapa Cerrado Node)',
      flag: '🇧🇷',
      models: [
        { id: 'br-1', name: 'Cerrado Deep Oxisol Soil Model', params: '820M parameters', accuracy: '94.2%', type: 'Soil Buffering & Chemistry' },
        { id: 'br-2', name: 'High-Temperature Soybean Vigour', params: '1.1B parameters', accuracy: '95.9%', type: 'Photosynthetic Heat Resistance' },
      ],
      climatePatterns: 'Tropical Savannah, Bi-modal Wet-Dry, Cerrado Micro-climates',
      agriculturalIndicators: {
        coverage: '65.2M Hectares',
        smallholderDensity: '42% Family Farming',
        soilDominance: 'Deep Acidic Oxisols (High Aluminum)',
        irrigationEfficiency: '78% Precision Pivot & Rainfed',
      },
      contributedWeights: 'High-temperature photosynthesis resilience models',
    },
    sa: {
      name: 'South Africa (ARC Highveld Node)',
      flag: '🇿🇦',
      models: [
        { id: 'sa-1', name: 'Semi-Arid Subterranean Drip Analytics', params: '540M parameters', accuracy: '93.7%', type: 'Aquifer Recharge Modeling' },
        { id: 'sa-2', name: 'Maize Stalk Borer Warning Net', params: '710M parameters', accuracy: '94.5%', type: 'Insect Pest Migration' },
      ],
      climatePatterns: 'Semi-Arid Highveld, Karoo Micro-climates, Winter Rain Mediterranean',
      agriculturalIndicators: {
        coverage: '12.8M Hectares',
        smallholderDensity: '58% Smallholder Communal Lands',
        soilDominance: 'Sandy Loam & Shallow Duplex Soils',
        irrigationEfficiency: '71% Drip & Centre Pivot',
      },
      contributedWeights: 'Aquifer recharge and salt-tolerance embeddings',
    },
    china: {
      name: 'China (CAAS Northern Plain Node)',
      flag: '🇨🇳',
      models: [
        { id: 'cn-1', name: 'Terraced Paddy Hydrology v3.8', params: '1.6B parameters', accuracy: '97.1%', type: 'Methane Reduction & Water' },
        { id: 'cn-2', name: 'UAV Swarm Foliar Segmentation', params: '980M parameters', accuracy: '96.3%', type: 'Computer Vision Canopy' },
      ],
      climatePatterns: 'East Asian Subtropical & Temperate Monsoon',
      agriculturalIndicators: {
        coverage: '85.0M Hectares',
        smallholderDensity: '72% Intensive Small Parcel',
        soilDominance: 'Paddy Soils & Loess Plateau Silts',
        irrigationEfficiency: '82% Automated Flood & Pipe',
      },
      contributedWeights: 'Hyperspectral foliar pest classification trees',
    },
    russia: {
      name: 'Russia (Chernozem Agro Node)',
      flag: '🇷🇺',
      models: [
        { id: 'ru-1', name: 'Chernozem Black Soil Fertility Net', params: '890M parameters', accuracy: '95.6%', type: 'Soil Carbon & Organic Matter' },
        { id: 'ru-2', name: 'Winter Wheat Frost Dormancy Model', params: '1.2B parameters', accuracy: '96.2%', type: 'Cryo-tolerance Phenology' },
      ],
      climatePatterns: 'Humid Continental & Sub-Arctic Steppe',
      agriculturalIndicators: {
        coverage: '52.0M Hectares',
        smallholderDensity: '28% Dacha & Private Farms',
        soilDominance: 'Deep Humus Chernozem (Black Soil)',
        irrigationEfficiency: '69% Rainfed & Furrow',
      },
      contributedWeights: 'Winter-hardiness and frost dormancy neural graphs',
    },
  };

  const current = nodes[activeCountry];

  const handleTestTransfer = () => {
    soundFx.playScanTone();
    setTransferTesting(true);
    setTransferComplete(false);

    setTimeout(() => {
      setTransferTesting(false);
      setTransferComplete(true);
      soundFx.playChime(660, 0.4);
    }, 1200);
  };

  const handleGenerateModelPackage = () => {
    soundFx.playScanTone();
    setIsGeneratingPackage(true);
    setTimeout(() => {
      const pkg = JSON.stringify(
        {
          schema_version: 'agrin-brics-interop-v1.0',
          federation_type: 'DifferentialPrivacy-FederatedAveraging',
          origin_country: 'IND',
          target_compact: 'BRICS-AgriN-Multilateral',
          timestamp_utc: new Date().toISOString(),
          privacy_budget_epsilon: 1.25,
          raw_farmer_data_status: 'RETAINED_LOCAL_NEVER_TRANSMITTED',
          shared_payload: {
            model_updates: {
              model_id: 'agrin-wheat-phenology-v2',
              delta_weights_hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
              training_iterations: 4200,
              gradient_clipping_norm: 1.0
            },
            aggregated_indicators: {
              district: 'Pratapgarh (Anonymous Aggregate)',
              mean_ndvi: 0.78,
              soil_organic_carbon_mean: 0.58,
              water_stewardship_score: 84
            },
            climate_patterns: {
              monsoon_onset_delta_days: -4,
              western_disturbance_frequency: 3
            },
            disease_signatures: [
              { pathogen: 'Puccinia striiformis', temperature_window_c: [10, 18], humidity_threshold_pct: 75 }
            ],
            regenerative_practices: [
              'Zero-till Happy Seeder',
              'Pulse green manure rotation',
              'Biochar pyrolyzed stubble diversion'
            ]
          }
        },
        null,
        2
      );
      setGeneratedPackage(pkg);
      setIsGeneratingPackage(false);
      soundFx.playChime(580, 0.35);
    }, 800);
  };

  const handleCopyPackage = () => {
    if (generatedPackage) {
      navigator.clipboard.writeText(generatedPackage);
      setCopied(true);
      soundFx.playClick();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Mandated Prototype / Simulation Label */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400 mb-1.5">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">BRICS MULTILATERAL AGRI-INTELLIGENCE COMPACT</span>
            <span>•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] uppercase font-bold tracking-wider">
              PROTOTYPE / SIMULATION ARCHITECTURE
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            BRICS Agricultural Model Exchange
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1 max-w-2xl">
            A privacy-preserving federated interoperability architecture. Sovereign smallholder data remains strictly local while differential privacy-masked weights and climate signatures are exchanged.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-inner">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>RAW FARM DATA NEVER LEAVES NATIONAL BORDERS</span>
          </div>
        </div>
      </div>

      {/* Feature 23: AgriN Interoperability Schema v1 & Privacy Boundary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: What Stays Local */}
        <div className="p-6 rounded-3xl bg-black/60 border border-rose-500/30 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>RAW FARMER DATA (STAYS LOCAL ON SOVEREIGN SOIL)</span>
          </div>
          <p className="text-neutral-300 text-[11px] font-sans font-light">
            Sovereign digital identity and high-resolution cadastral plots are never federated across borders:
          </p>
          <ul className="space-y-1.5 text-neutral-300 text-[11px] pl-5 list-disc">
            <li>Farmer name, mobile phone number, Aadhaar / Kisan ID</li>
            <li>Individual Khasra / Survey parcel cadastral boundaries</li>
            <li>Precise sub-metre GPS polygon coordinates</li>
            <li>Raw leaf photos uploaded by individual farmers</li>
            <li>Individual bank details, subsidies, and financial transactions</li>
          </ul>
        </div>

        {/* Right: What Gets Shared */}
        <div className="p-6 rounded-3xl bg-black/60 border border-emerald-500/30 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Globe2 className="w-4 h-4" />
            <span>FEDERATED SHARED LAYER (AGRIN SCHEMA V1)</span>
          </div>
          <p className="text-neutral-300 text-[11px] font-sans font-light">
            Anonymous aggregated biophysical signals and differential privacy model updates:
          </p>
          <ul className="space-y-1.5 text-neutral-300 text-[11px] pl-5 list-disc">
            <li>Model weight gradient updates (Epsilon = 1.25 DP noise added)</li>
            <li>District-level anonymous agroecological indicators (NDVI, SOC)</li>
            <li>Regional climate anomaly patterns (monsoon shift signatures)</li>
            <li>Pathogen biophysical profiles (humidity & thermal spore triggers)</li>
            <li>Regenerative practice effectiveness benchmarks</li>
          </ul>
        </div>
      </div>

      {/* Visual Federated Network Tree */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-emerald-500/20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">
            FEDERATED MULTILATERAL ARCHITECTURE
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F9F8F3]">
            Cooperative Intelligence Topology
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light">
            Each BRICS member runs a sovereign agricultural compute node. Click any country node below to benchmark interoperability.
          </p>
        </div>

        {/* Tree Topology */}
        <div className="max-w-4xl mx-auto flex flex-col items-center font-mono text-xs">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-500 text-black font-extrabold text-center shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-3 border border-emerald-300">
            <Globe2 className="w-6 h-6 text-black" />
            <span className="text-sm sm:text-base tracking-wider">AGRIN AI &bull; BRICS COOPERATION COMPACT</span>
          </div>

          <div className="w-[2px] h-8 bg-emerald-400" />

          <div className="w-full max-w-2xl h-[2px] bg-emerald-500/40 relative">
            <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-emerald-400 -translate-y-1/2" />
            <div className="absolute right-0 top-0 w-2 h-2 rounded-full bg-emerald-400 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 w-2 h-2 rounded-full bg-emerald-400 -translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-5 text-center pt-8 gap-3">
            {[
              { id: 'india', name: 'INDIA', flag: '🇮🇳', model: 'ICAR Hub' },
              { id: 'brazil', name: 'BRAZIL', flag: '🇧🇷', model: 'Embrapa Node' },
              { id: 'sa', name: 'SOUTH AFRICA', flag: '🇿🇦', model: 'ARC Highveld' },
              { id: 'russia', name: 'RUSSIA', flag: '🇷🇺', model: 'Chernozem Node' },
              { id: 'china', name: 'CHINA', flag: '🇨🇳', model: 'CAAS Plain' },
            ].map((c) => (
              <div 
                key={c.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveCountry(c.id as typeof activeCountry);
                  setTransferComplete(false);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeCountry === c.id
                    ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                    : 'bg-black/40 border-white/10 hover:border-emerald-500/30'
                }`}
              >
                <div className="text-2xl mb-1">{c.flag}</div>
                <div className="font-bold text-xs text-[#ECE8DD]">{c.name}</div>
                <div className="text-[10px] text-emerald-400 mt-1 font-bold">{c.model}</div>
                <div className="text-[9px] text-neutral-400 mt-0.5">Sovereign Node</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Country Details Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-emerald-500/30 max-w-4xl mx-auto space-y-6 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{current.flag}</span>
              <div>
                <div className="font-display font-bold text-xl text-[#F9F8F3]">{current.name}</div>
                <div className="text-emerald-400 text-xs">Primary Contribution: {current.contributedWeights}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleGenerateModelPackage}
                disabled={isGeneratingPackage}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold cursor-pointer transition-all shadow-md"
              >
                <FileCode className={`w-3.5 h-3.5 ${isGeneratingPackage ? 'animate-spin' : ''}`} />
                <span>{isGeneratingPackage ? 'Compiling Schema...' : 'Generate Model Package'}</span>
              </button>

              <button
                onClick={handleTestTransfer}
                disabled={transferTesting}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold cursor-pointer transition-all shadow-md"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${transferTesting ? 'animate-spin' : ''}`} />
                <span>{transferTesting ? 'Testing Adapter...' : 'Test Model Transfer'}</span>
              </button>
            </div>
          </div>

          {transferComplete && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Adapter transfer successful! {current.name} model weights integrated with zero loss of Indian smallholder privacy.
              </span>
            </div>
          )}

          {/* Generated JSON Model Package Viewer */}
          {generatedPackage && (
            <div className="p-4 rounded-2xl bg-[#030d07] border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-cyan-400" />
                  AGRIN INTEROPERABILITY SCHEMA V1 — MODEL PACKAGE
                </span>
                <button
                  onClick={handleCopyPackage}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer text-[10px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied JSON!' : 'Copy Schema'}</span>
                </button>
              </div>

              <pre className="text-[11px] font-mono text-emerald-300 max-h-56 overflow-y-auto p-3 rounded-xl bg-black/70 border border-white/5 whitespace-pre">
                {generatedPackage}
              </pre>
            </div>
          )}

          {/* 3 Detail Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                1. AVAILABLE AI MODELS:
              </span>
              <div className="space-y-2">
                {current.models.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="font-bold text-white block text-xs">{m.name}</span>
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>{m.params}</span>
                      <span className="text-emerald-400 font-bold">{m.accuracy}</span>
                    </div>
                    <span className="text-[9px] text-neutral-500 block truncate">{m.type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                2. CLIMATE PATTERNS:
              </span>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-[11px] text-neutral-300 font-sans leading-relaxed">
                <p>{current.climatePatterns}</p>
                <div className="text-[10px] font-mono text-cyan-300 pt-2 border-t border-white/5">
                  Adapter Type: Zero-shot domain invariant biophysical transfer
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                3. AGRICULTURAL INDICATORS:
              </span>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-[10px] font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Coverage:</span>
                  <span className="text-emerald-300 font-bold">{current.agriculturalIndicators.coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Smallholders:</span>
                  <span className="text-white">{current.agriculturalIndicators.smallholderDensity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Soil Type:</span>
                  <span className="text-white truncate max-w-[120px]">{current.agriculturalIndicators.soilDominance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Irrigation:</span>
                  <span className="text-teal-300">{current.agriculturalIndicators.irrigationEfficiency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
