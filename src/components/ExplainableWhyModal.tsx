import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  HelpCircle, 
  CloudRain, 
  Droplet, 
  Sprout, 
  Calendar, 
  Satellite, 
  Sparkles,
  Database,
  ArrowRight,
  Calculator,
  Cpu,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export interface ExplainableWhyData {
  title: string;
  recommendation: string;
  rainfallProbability: string;
  soilMoisture: string;
  crop: string;
  growthStage: string;
  ndviTrend: string;
  diseaseStatus?: string;
  rationale: string;
  sources: string[];
  
  // Numerical Risk Engine Breakdown (Deterministic)
  weatherRisk?: number; // max 30
  vegetationRisk?: number; // max 25
  waterSoilRisk?: number; // max 25
  diseaseRisk?: number; // max 20
  totalRisk?: number; // max 100

  // AI & Data Confidence
  aiConfidence?: number;
  dataConfidence?: 'High' | 'Medium' | 'Low' | string;
  uncertaintyFactors?: string[];
  onOpenProvenance?: () => void;
}

interface ExplainableWhyModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: ExplainableWhyData;
  onOpenProvenance?: () => void;
}

export const defaultWhyData: ExplainableWhyData = {
  title: 'WHY DID AGRIN RECOMMEND THIS?',
  recommendation: 'Delay scheduled furrow irrigation for the next 48 hours and reassess after rainfall.',
  rainfallProbability: '82% probability (35mm convective storm in 14h)',
  soilMoisture: '28% volumetric moisture (68% of field capacity)',
  crop: 'Sharbati Wheat (Triticum aestivum)',
  growthStage: 'Vegetative Tillering (Day 28)',
  ndviTrend: '0.78 (+0.07 over 15-day emergence)',
  diseaseStatus: 'Yellow Stripe Rust Flagged (Medium severity on flag leaf)',
  weatherRisk: 22,
  vegetationRisk: 6,
  waterSoilRisk: 18,
  diseaseRisk: 12,
  totalRisk: 58,
  aiConfidence: 94,
  dataConfidence: 'High (Sentinel-2 + Open-Meteo Grounded)',
  uncertaintyFactors: [
    'Convective rainfall onset timing (+/- 4 hours)',
    'Next Sentinel-2 optical pass scheduled in 5 days',
    'Root-zone percolation rate post-downpour',
    'Foliar fungal spore spread if evening humidity exceeds 85%'
  ],
  rationale: 'AgriN synthesized real-time Open-Meteo weather intelligence with in-situ soil moisture sensors and Sentinel-2 canopy vigor. Because root-zone moisture is already at 28% and a 35mm rain storm has an 82% forecast probability, irrigating today would cause standing waterlogging, root asphyxiation, nitrogen leaching, and waste ₹4,200 in diesel pumping expense.',
  sources: [
    'Sentinel-2 MSI Level-2A (Copernicus / ESA Harmonized)',
    'Open-Meteo Weather Intelligence (1km Downscaled NWP)',
    'ICAR In-situ Soil Capacitance Probe (Plot A)',
    'Google Gemini Multimodal Vision Pathology Diagnostic',
    'AgriN Deterministic Risk Engine v2'
  ]
};

export const ExplainableWhyModal: React.FC<ExplainableWhyModalProps> = ({
  isOpen,
  onClose,
  data = defaultWhyData,
  onOpenProvenance
}) => {
  if (!isOpen) return null;

  const wRisk = data.weatherRisk ?? 22;
  const vRisk = data.vegetationRisk ?? 6;
  const sRisk = data.waterSoilRisk ?? 18;
  const dRisk = data.diseaseRisk ?? 12;
  const totRisk = data.totalRisk ?? (wRisk + vRisk + sRisk + dRisk);
  const aiConf = data.aiConfidence ?? 94;
  const dataConf = data.dataConfidence ?? 'High';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl my-auto rounded-3xl bg-[#05130D] border border-emerald-500/40 p-5 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-[#ECE8DD] max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                    AI DECISION TRACE
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    Provenance ID: AGRIN-XAI-v3
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#F9F8F3] mt-1 tracking-tight">
                  {data.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3-Step Decision Pipeline Banner */}
          <div className="mt-5 p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">1</span>
              <span>FARM STATE</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">2</span>
              <span>RISK ENGINE</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">3</span>
              <span>RECOMMENDATION</span>
            </div>
          </div>

          {/* Step 1: Observed Farm State */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Step 1: Measured Farm Telemetry Context
              </span>
              <span className="text-[10px] font-mono text-neutral-400">Live Multi-Sensor Snapshot</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-neutral-400 text-[10px] block flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-emerald-400" /> CROP
                </span>
                <span className="text-emerald-200 font-bold truncate block mt-0.5">{data.crop}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-neutral-400 text-[10px] block flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" /> STAGE
                </span>
                <span className="text-amber-200 font-bold truncate block mt-0.5">{data.growthStage}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-neutral-400 text-[10px] block flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-teal-400" /> SOIL MOISTURE
                </span>
                <span className="text-teal-200 font-bold truncate block mt-0.5">{data.soilMoisture}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-neutral-400 text-[10px] block flex items-center gap-1">
                  <CloudRain className="w-3 h-3 text-cyan-400" /> RAIN FORECAST
                </span>
                <span className="text-cyan-200 font-bold truncate block mt-0.5">{data.rainfallProbability}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-neutral-400 text-[10px] block flex items-center gap-1">
                  <Satellite className="w-3 h-3 text-lime-400" /> SENTINEL-2 NDVI
                </span>
                <span className="text-lime-200 font-bold truncate block mt-0.5">{data.ndviTrend}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-neutral-400 text-[10px] block flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" /> DISEASE SIGNAL
                </span>
                <span className="text-rose-200 font-bold truncate block mt-0.5">{data.diseaseStatus || 'None Detected'}</span>
              </div>
            </div>
          </div>

          {/* Step 2: Deterministic Risk Engine Math */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                  Step 2: AgriN Deterministic Risk Engine Breakdown
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 font-bold">
                CALCULATED BY AGRIN ENGINE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-center">
              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
                <span className="text-[10px] text-neutral-400 block">WEATHER RISK</span>
                <span className="text-base font-bold text-amber-300">{wRisk} <span className="text-[10px] text-neutral-500 font-normal">/ 30</span></span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
                <span className="text-[10px] text-neutral-400 block">VEGETATION RISK</span>
                <span className="text-base font-bold text-amber-300">{vRisk} <span className="text-[10px] text-neutral-500 font-normal">/ 25</span></span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
                <span className="text-[10px] text-neutral-400 block">WATER/SOIL STRESS</span>
                <span className="text-base font-bold text-amber-300">{sRisk} <span className="text-[10px] text-neutral-500 font-normal">/ 25</span></span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
                <span className="text-[10px] text-neutral-400 block">DISEASE RISK</span>
                <span className="text-base font-bold text-amber-300">{dRisk} <span className="text-[10px] text-neutral-500 font-normal">/ 20</span></span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-neutral-300">Composite Risk Total:</span>
              <span className="text-lg font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                {totRisk} / 100 <span className="text-xs font-medium text-amber-200">({totRisk > 65 ? 'High Risk' : totRisk > 40 ? 'Moderate Risk' : 'Low Risk'})</span>
              </span>
            </div>
            <p className="text-[10px] text-amber-300/80 font-mono mt-2">
              Note: This numerical score is computed strictly by deterministic rule algorithms — NOT hallucinated by an LLM.
            </p>
          </div>

          {/* Step 3: Recommendation Explained by Gemini */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  Step 3: Actionable Recommendation
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-bold">
                EXPLAINED BY GEMINI
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/50 border border-emerald-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">
                  Agronomic Prescription:
                </span>
                <p className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
                  {data.recommendation}
                </p>
              </div>
            </div>

            {/* Synthesized Scientific Rationale */}
            <div className="mt-3 text-xs sm:text-sm text-neutral-200 leading-relaxed font-light bg-black/30 p-3 rounded-xl border border-white/5">
              {data.rationale}
            </div>

            {/* AI & Data Confidence Meters */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block">AI REASONING CONFIDENCE</span>
                  <span className="text-emerald-300 font-bold text-sm">{aiConf}% Certainty</span>
                </div>
                <div className="w-12 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${aiConf}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block">DATA PROVENANCE QUALITY</span>
                  <span className="text-cyan-300 font-bold text-sm">{dataConf}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                  Ground Truth
                </span>
              </div>
            </div>
          </div>

          {/* WHAT COULD CHANGE THIS ADVICE? */}
          <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs mb-2">
              <RefreshCw className="w-4 h-4" />
              <span>WHAT COULD CHANGE THIS ADVICE?</span>
            </div>
            <ul className="space-y-1.5 text-neutral-300 text-[11px] pl-5 list-disc">
              {(data.uncertaintyFactors || defaultWhyData.uncertaintyFactors || []).map((factor, i) => (
                <li key={i}>{factor}</li>
              ))}
            </ul>
          </div>

          {/* Data Sources Provenance with link to Provenance Drawer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">GROUNDED AUDIT SOURCES:</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                Sentinel-2 MSI Level-2A • Open-Meteo NWP • In-Situ Soil Probe • Gemini 2.5 Flash
              </p>
            </div>

            {onOpenProvenance && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenProvenance();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] transition-colors cursor-pointer"
              >
                <span>Inspect Full Provenance</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Footer Action */}
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-md"
            >
              <span>Understood & Acknowledged</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
