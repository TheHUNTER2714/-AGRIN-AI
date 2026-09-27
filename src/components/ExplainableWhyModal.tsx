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
  ShieldCheck, 
  Sparkles,
  Database,
  ArrowRight
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
  rationale: string;
  sources: string[];
}

interface ExplainableWhyModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: ExplainableWhyData;
}

export const defaultWhyData: ExplainableWhyData = {
  title: 'Explainable AI Reasoning: Irrigation Delay',
  recommendation: 'Delay scheduled furrow irrigation for the next 48 hours.',
  rainfallProbability: '82% probability (35mm convective storm in 14h)',
  soilMoisture: '68% of field capacity in root zone (15cm)',
  crop: 'Sharbati Wheat (Triticum aestivum)',
  growthStage: 'Vegetative Tillering (Day 28)',
  ndviTrend: 'Stable at 0.78 (+0.04 over 10-day cycle)',
  rationale: 'AgriN synthesized real-time Doppler radar with root-zone sensor telemetry and Sentinel-2 canopy moisture indices. Irrigating now onto field-capacity soil right before a 35mm rain storm would trigger waterlogging, anaerobic root stress, premature lodging, and waste ₹1,200 in diesel pumping expenditure. Irrigation can safely be delayed until rainfall outcomes are established.',
  sources: [
    'Sentinel-2 MSI Level-2A (ESA / ISRO Ground Feed)',
    'IMD Hyperlocal Doppler Weather Radar (Station PRATAP-04)',
    'Ayush Farm In-situ Soil Capacitance Probe (Plot A)',
    'ICAR Wheat Phenology & Irrigation Protocol 2026'
  ]
};

export const ExplainableWhyModal: React.FC<ExplainableWhyModalProps> = ({
  isOpen,
  onClose,
  data = defaultWhyData
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#05130D] border border-emerald-500/40 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-[#ECE8DD]"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    EXPLAINABLE AI (XAI)
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Gemini Agro Engine</span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#F9F8F3] mt-0.5">
                  {data.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl glass-panel-subtle hover:border-emerald-500/40 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Direct Recommendation Box */}
          <div className="mt-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest block font-bold">
                AgriN AI Prescription:
              </span>
              <p className="text-sm font-semibold text-white mt-0.5">
                {data.recommendation}
              </p>
            </div>
          </div>

          {/* Considered Factors Breakdown */}
          <div className="mt-6 space-y-3">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
              AgriN Considered the following 5 parameters:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Factor 1: Rain */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">PRECIPITATION RISK</span>
                  <span className="text-cyan-300 font-bold">{data.rainfallProbability}</span>
                </div>
              </div>

              {/* Factor 2: Moisture */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">SOIL MOISTURE TENSION</span>
                  <span className="text-teal-300 font-bold">{data.soilMoisture}</span>
                </div>
              </div>

              {/* Factor 3: Crop */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">CROP SPECIES</span>
                  <span className="text-emerald-300 font-bold">{data.crop}</span>
                </div>
              </div>

              {/* Factor 4: Stage */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">GROWTH PHENOLOGY</span>
                  <span className="text-amber-300 font-bold">{data.growthStage}</span>
                </div>
              </div>

              {/* Factor 5: Satellite NDVI */}
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-lime-500/10 text-lime-400 shrink-0">
                  <Satellite className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">SATELLITE VEGETATION INDEX (NDVI)</span>
                  <span className="text-lime-300 font-bold">{data.ndviTrend}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Rationale / Reasoning Narrative */}
          <div className="mt-6 p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>SYNTHESIZED SCIENTIFIC RATIONALE</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light">
              {data.rationale}
            </p>
          </div>

          {/* Data Sources Provenance */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-2 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>AUDITABLE GROUNDED DATA SOURCES:</span>
            </div>
            <ul className="space-y-1 pl-5 list-disc text-neutral-300 text-[10px]">
              {data.sources.map((src, i) => (
                <li key={i}>{src}</li>
              ))}
            </ul>
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
