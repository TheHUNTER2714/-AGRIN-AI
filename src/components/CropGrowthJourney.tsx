import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sprout, 
  Droplet, 
  Bug, 
  FlaskConical, 
  CheckCircle2 
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export interface GrowthStage {
  name: string;
  dayRange: string;
  status: 'completed' | 'active' | 'upcoming';
  waterNeed: string;
  nutrientFocus: string;
  pestRisk: string;
  advisory: string;
}

export const CropGrowthJourney: React.FC = () => {
  const [selectedStageIndex, setSelectedStageIndex] = useState(2); // Vegetative Tillering is active

  const stages: GrowthStage[] = [
    {
      name: 'SEED',
      dayRange: 'Day 0–7',
      status: 'completed',
      waterNeed: 'Pre-sowing irrigation (Paleva) to ensure uniform soil moisture',
      nutrientFocus: 'Basal application of DAP (Di-Ammonium Phosphate) + Zinc Sulphate',
      pestRisk: 'Termite and seed-borne bunts (Treated with Trichoderma)',
      advisory: 'Certified Sharbati wheat seed treated with PSB bio-inoculant. Seed rate 100 kg/Ha at 5cm depth.',
    },
    {
      name: 'GERMINATION & CRI',
      dayRange: 'Day 8–21',
      status: 'completed',
      waterNeed: 'Crown Root Initiation (CRI) first irrigation applied on Day 21',
      nutrientFocus: 'Early mycorrhizal root expansion without salt shock',
      pestRisk: 'Armyworm cutworm monitoring around root collar',
      advisory: '94% field emergence recorded. Crown root network firmly established at 8cm depth.',
    },
    {
      name: 'VEGETATIVE TILLERING',
      dayRange: 'Day 22–45 (CURRENT)',
      status: 'active',
      waterNeed: 'HOLD irrigation! 35mm convective rainfall predicted in next 14h',
      nutrientFocus: 'Post-rain top-dress of 45 kg/Ha Neem Coated Urea',
      pestRisk: 'Aphid colonization & early foliar yellow rust spores',
      advisory: 'Optimal tiller count is 6–8 tillers per plant. Canopy NDVI is 0.78. Avoid waterlogging in furrow zones.',
    },
    {
      name: 'FLOWERING & ANTHESIS',
      dayRange: 'Day 46–70',
      status: 'upcoming',
      waterNeed: 'Critical second irrigation required if soil moisture drops below 40%',
      nutrientFocus: 'Foliar spray of 1% Potassium Nitrate (13-0-45) for heat tolerance',
      pestRisk: 'Head blight and powdery mildew',
      advisory: 'Ensure zero moisture stress during ear emergence. High temperatures during flowering reduce grain count.',
    },
    {
      name: 'GRAIN FILLING (MILK/DOUGH)',
      dayRange: 'Day 71–95',
      status: 'upcoming',
      waterNeed: 'Light furrow irrigation during calm evening air to avoid lodging',
      nutrientFocus: 'Zero nitrogen! Starch translocation from stem to spikelet',
      pestRisk: 'Brown rust and ear-cockle nematode',
      advisory: 'Terminal heat wave monitoring active. Maintain micro-drip cooling if ambient temp exceeds 32°C.',
    },
    {
      name: 'HARVEST & STUBBLE',
      dayRange: 'Day 96–120',
      status: 'upcoming',
      waterNeed: 'Stop all irrigation 14 days before combine harvesting',
      nutrientFocus: 'Residual straw retained for AgriCycle biochar diversion',
      pestRisk: 'Grain weevil post-harvest storage',
      advisory: 'Estimated yield: 48.5 Qtl/Ha. Baled parali straw will generate ₹4,875 via AgriCycle pickup.',
    },
  ];

  const current = stages[selectedStageIndex];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>PHENOLOGICAL LIFECYCLE TRACKER</span>
            <span>•</span>
            <span>SHARBATI WHEAT (PLOT A)</span>
          </div>
          <h3 className="font-display font-bold text-xl text-[#F9F8F3]">
            Crop Growth Journey
          </h3>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-neutral-400">Current Phase:</span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold animate-pulse">
            VEGETATIVE TILLERING
          </span>
        </div>
      </div>

      {/* Interactive Lifecycle Timeline */}
      <div className="relative pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stages.map((stg, idx) => {
            const isSelected = selectedStageIndex === idx;
            const isActive = stg.status === 'active';
            const isCompleted = stg.status === 'completed';

            return (
              <div
                key={stg.name}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedStageIndex(idx);
                }}
                className={`p-3.5 rounded-2xl cursor-pointer border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-900/60 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-102'
                    : isActive
                    ? 'bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400'
                    : isCompleted
                    ? 'bg-black/30 border-white/10 hover:border-emerald-500/30 text-neutral-300'
                    : 'glass-panel-subtle text-neutral-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-neutral-400">0{idx + 1}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                    {isCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div className="font-display font-bold text-xs text-[#ECE8DD] leading-snug">
                    {stg.name}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-1">
                    {stg.dayRange}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono uppercase">
                  {stg.status === 'active' ? (
                    <span className="text-emerald-400 font-bold">● Active Stage</span>
                  ) : stg.status === 'completed' ? (
                    <span className="text-neutral-400">✓ Completed</span>
                  ) : (
                    <span className="text-neutral-500">Upcoming</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Details Focus Box */}
      <motion.div
        key={selectedStageIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-5 rounded-2xl bg-black/50 border border-emerald-500/20 space-y-4 font-mono text-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">
              STAGE PROTOCOL: {current.name} ({current.dayRange})
            </span>
            <p className="text-sm font-sans font-medium text-white mt-0.5">
              {current.advisory}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-bold">
              <Droplet className="w-3.5 h-3.5" />
              <span>IRRIGATION & WATER TARGET:</span>
            </div>
            <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
              {current.waterNeed}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>NUTRIENT FOCUS:</span>
            </div>
            <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
              {current.nutrientFocus}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold">
              <Bug className="w-3.5 h-3.5" />
              <span>VULNERABILITY & PEST VECTOR:</span>
            </div>
            <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
              {current.pestRisk}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
