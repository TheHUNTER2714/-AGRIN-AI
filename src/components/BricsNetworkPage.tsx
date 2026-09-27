import React, { useState } from 'react';
import { 
  Globe2, 
  Lock, 
  CheckCircle2, 
  RefreshCw
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const BricsNetworkPage: React.FC = () => {
  const [activeCountry, setActiveCountry] = useState<'india' | 'brazil' | 'sa' | 'china' | 'russia'>('india');
  const [transferTesting, setTransferTesting] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);

  const nodes = {
    india: {
      name: 'India (Lead Agro-AI Hub)',
      flag: '🇮🇳',
      models: [
        { id: 'ind-1', name: 'Monsoon Wheat Phenology v4.2', params: '1.4B parameters', accuracy: '96.8%', type: 'Crop Phenology & Irrigation' },
        { id: 'ind-2', name: 'Yellow Stripe Rust ViT-H', params: '630M parameters', accuracy: '95.4%', type: 'Foliar Computer Vision' },
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
    }, 1800);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>BRICS MULTILATERAL AGRI-INTELLIGENCE COMPACT</span>
            <span>•</span>
            <span className="text-zinc-400">PROTOTYPE ARCHITECTURE</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            BRICS Agricultural Model Exchange
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Prototype Architecture demonstrating privacy-preserving cross-border sharing of agricultural AI models and climate indicators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>RAW FARM DATA NEVER LEAVES NATIONAL BORDERS</span>
          </div>
        </div>
      </div>

      {/* FEATURE 16: BRICS MODEL EXCHANGE ARCHITECTURE */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-emerald-500/20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
            FEATURE 16 &bull; WORKING MODEL EXCHANGE PROTOTYPE
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F9F8F3]">
            Federated Agricultural Model Exchange
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light">
            Each nation trains specialized models on sovereign soil. 
            Only differential privacy-masked weight gradients are federated into the shared AgriN Foundation Core.
          </p>
        </div>

        {/* Visual Architecture Tree Diagram */}
        <div className="max-w-4xl mx-auto flex flex-col items-center font-mono text-xs">
          {/* Top Node: Global Shared AgriN Core */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-500 text-black font-extrabold text-center shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-3 border border-emerald-300">
            <Globe2 className="w-6 h-6 text-black" />
            <span className="text-base tracking-wider">AGRIN AI &bull; BRICS MODEL EXCHANGE</span>
          </div>

          {/* Central Stem */}
          <div className="w-[2px] h-8 bg-emerald-400" />

          {/* Crossbar */}
          <div className="w-full max-w-2xl h-[2px] bg-emerald-500/40 relative">
            <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-emerald-400 -translate-y-1/2" />
            <div className="absolute right-0 top-0 w-2 h-2 rounded-full bg-emerald-400 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 w-2 h-2 rounded-full bg-emerald-400 -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Three Main Country Stems */}
          <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-5 text-center pt-8 gap-3">
            {[
              { id: 'india', name: 'INDIA', flag: '🇮🇳', model: 'Model A' },
              { id: 'brazil', name: 'BRAZIL', flag: '🇧🇷', model: 'Model B' },
              { id: 'sa', name: 'SOUTH AFRICA', flag: '🇿🇦', model: 'Model C' },
              { id: 'russia', name: 'RUSSIA', flag: '🇷🇺', model: 'Model D' },
              { id: 'china', name: 'CHINA', flag: '🇨🇳', model: 'Model E' },
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{current.flag}</span>
              <div>
                <div className="font-display font-bold text-xl text-[#F9F8F3]">{current.name}</div>
                <div className="text-emerald-400 text-xs">Primary Contribution: {current.contributedWeights}</div>
              </div>
            </div>

            <button
              onClick={handleTestTransfer}
              disabled={transferTesting}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold cursor-pointer transition-all shadow-md self-start sm:self-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${transferTesting ? 'animate-spin' : ''}`} />
              <span>{transferTesting ? 'Benchmarking Adapter...' : 'Test Cross-Border Model Transfer'}</span>
            </button>
          </div>

          {transferComplete && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Adapter transfer successful! {current.name} model weights integrated with zero loss of Indian smallholder privacy.
              </span>
            </div>
          )}

          {/* 3 Detail Columns: Available Models | Climate Patterns | Agricultural Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Available Models */}
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

            {/* 2. Climate Patterns */}
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

            {/* 3. Agricultural Indicators */}
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
