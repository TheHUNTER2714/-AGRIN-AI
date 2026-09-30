import React, { useState } from 'react';
import { 
  RotateCw, 
  Leaf, 
  Droplet, 
  Sprout, 
  ShieldCheck, 
  Zap,
  Info
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const RegenerativePage: React.FC = () => {
  const [hectares] = useState(14.2);
  const [zeroTillAdopted, setZeroTillAdopted] = useState(true);
  const [coverCropAdopted, setCoverCropAdopted] = useState(true);
  const [biocharUsed, setBiocharUsed] = useState(true);
  const [activeRotationStep, setActiveRotationStep] = useState<number>(0);

  // 5 Explicit Dimensions of the AgriN Regenerative Score (each scored 0-20)
  const dimensions = [
    {
      id: 'water',
      name: 'Water Stewardship',
      score: 17,
      max: 20,
      formula: 'Formula: (1 - Over-Irrigation Ratio [0.15]) × 20',
      description: 'Alternate Wetting & Drying (AWD) furrow cycles avoiding aquifer over-abstraction.',
      icon: Droplet,
      color: 'text-cyan-400',
      barColor: 'bg-cyan-400'
    },
    {
      id: 'nutrient',
      name: 'Nutrient Efficiency',
      score: 16,
      max: 20,
      formula: 'Formula: (1 - Synthetic Chemical Ratio [0.20]) × 20',
      description: 'Neem-coated urea micro-dosing coupled with Azotobacter bio-inoculants.',
      icon: Zap,
      color: 'text-amber-400',
      barColor: 'bg-amber-400'
    },
    {
      id: 'residue',
      name: 'Residue Management',
      score: 18,
      max: 20,
      formula: 'Formula: (Zero-Burn Stubble Diversion % [90%]) × 20',
      description: 'In-situ Happy Seeder mulching and biochar conversion, completely eliminating stubble burning.',
      icon: RotateCw,
      color: 'text-emerald-400',
      barColor: 'bg-emerald-400'
    },
    {
      id: 'carbon',
      name: 'Soil Organic Carbon',
      score: 15,
      max: 20,
      formula: 'Formula: (Measured SOC% [0.58%] / Benchmark [0.75%]) × 20',
      description: 'Targeted biochar amendments steadily lifting topsoil humus levels.',
      icon: Leaf,
      color: 'text-teal-400',
      barColor: 'bg-teal-400'
    },
    {
      id: 'diversity',
      name: 'Crop Diversity Index',
      score: 16,
      max: 20,
      formula: 'Formula: (Rotation Species Count [3] / Optimum [4]) × 20 + legume bonus',
      description: 'Wheat rotated with Pigeon Pea (Arhar) and Indian Mustard (Pusa Bold).',
      icon: Sprout,
      color: 'text-lime-400',
      barColor: 'bg-lime-400'
    }
  ];

  const compositeScore = dimensions.reduce((acc, d) => acc + d.score, 0); // 82 / 100

  // Carbon sequestration calculations
  const baseSequestrationPerHa = (zeroTillAdopted ? 1.4 : 0.4) + (coverCropAdopted ? 1.2 : 0) + (biocharUsed ? 1.1 : 0);
  const totalCo2Sequestered = (hectares * baseSequestrationPerHa).toFixed(1);
  const carbonCreditPriceInr = 1100;
  const totalCreditPayout = Math.round(parseFloat(totalCo2Sequestered) * carbonCreditPriceInr);

  // 4-Phase Crop Rotation Sequence (Advisory Language)
  const rotationPhases = [
    {
      step: 1,
      season: 'Rabi (Nov - Apr)',
      crop: 'Wheat (Sharbati HD-2967)',
      type: 'Cereal Staple',
      nitrogen: 'Consumes ~110 kg N/ha; deep root network aerates alluvial silt loam.',
      water: 'Requires 4-5 irrigation turns (AWD scheduling saves 2 turns).',
      pest: 'Vulnerable to stripe rust; breaking cycle prevents spore carryover.',
      residue: 'Yields 4.2 t/ha straw; harvested with Happy Seeder for surface mulch.',
      income: 'Primary household cash and food security cereal asset.',
      color: 'border-emerald-500/40 text-emerald-300'
    },
    {
      step: 2,
      season: 'Zaid / Summer (Apr - Jun)',
      crop: 'Green Gram / Mung (Pulse)',
      type: 'Leguminous Bio-Fixer',
      nitrogen: 'Naturally fixes 30-35 kg atmospheric N/ha into root nodules via Rhizobium.',
      water: 'Ultra-low water requirement (2 light irrigations). Drought resilient.',
      pest: 'Completely interrupts wheat foliar fungal and aphid life cycles.',
      residue: 'Green biomass incorporated into soil as green manure before Kharif.',
      income: 'Short 60-day cash harvest yielding high market rate pulses.',
      color: 'border-lime-500/40 text-lime-300'
    },
    {
      step: 3,
      season: 'Late Kharif / Pre-Rabi (Sep - Nov)',
      crop: 'Mustard (Brassica juncea)',
      type: 'Oilseed Cash Crop',
      nitrogen: 'Utilizes residual soil nitrogen left by the summer legume phase.',
      water: 'Low moisture demand; flourishes on receding monsoon soil hydration.',
      pest: 'Root glucosinolates release natural bio-fumigants suppressing soil nematodes.',
      residue: 'Stem residue utilized for biochar pyrolysis at Awadh facility.',
      income: 'High-value cooking oilseed with guaranteed MSP procurement.',
      color: 'border-amber-500/40 text-amber-300'
    },
    {
      step: 4,
      season: 'Next Cycle Rabi',
      crop: 'Wheat (Resistant Variety)',
      type: 'Regenerated Cereal Cycle',
      nitrogen: 'Requires 35% less synthetic chemical urea due to pulse + green manure.',
      water: 'Improved soil organic matter enhances water holding capacity by 22%.',
      pest: 'Weed and pathogen pressure reduced by 40% compared to monoculture.',
      residue: 'Zero-burn retention establishes a self-sustaining topsoil mulch layer.',
      income: 'Stabilized net farm margins with lower input expenditure.',
      color: 'border-teal-500/40 text-teal-300'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400 mb-1.5">
            <RotateCw className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span className="font-bold">REGENERATIVE AGROECOLOGY INTELLIGENCE</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold">
              TRANSPARENT FORMULA SCORING
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            AgriN Regenerative Score & Crop Rotation
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1 max-w-2xl">
            Quantitative assessment of soil biology restoration, water stewardship, and closed-loop agro-waste circularity across Indian farm holdings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-black/50 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-neutral-400 block">CARBON SEQUESTRATION</span>
              <span className="font-bold text-sm text-white">{totalCo2Sequestered} t CO2e/year</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 16: AGRIN REGENERATIVE SCORE (5 Dimensions with explicit formulas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 Cols: Composite Score Display */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-4 font-bold">
              AGRIN REGENERATIVE SCORE
            </span>

            {/* Circular Gauge */}
            <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#10B981"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="263.8"
                  strokeDashoffset={263.8 - (263.8 * compositeScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-5xl font-extrabold text-[#F9F8F3]">{compositeScore}</span>
                <span className="text-xs text-neutral-400 font-light mt-0.5">/ 100 GRADE A</span>
              </div>
            </div>

            <h3 className="font-display font-bold text-xl text-[#F9F8F3] mb-1">
              High Ecological Resilience
            </h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              Calculated sum of 5 empirical agroecological dimensions. No unexplained black-box AI score.
            </p>
          </div>

          <div className="w-full pt-4 border-t border-white/10 mt-6 font-mono text-xs flex justify-between text-neutral-400">
            <span>Soil Organic Carbon: <strong className="text-emerald-300">0.58%</strong></span>
            <span>Groundwater Ratio: <strong className="text-cyan-300">+26% Saved</strong></span>
          </div>
        </div>

        {/* Right 8 Cols: 5 Explicit Dimensions Breakdown */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
              5 Quantitative Scoring Dimensions (20 Pts Each)
            </span>
            <span className="text-[10px] font-mono text-neutral-400">Deterministic Mathematical Formulation</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {dimensions.map((dim) => {
              const Icon = dim.icon;
              return (
                <div key={dim.id} className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${dim.color}`} />
                      <span className="font-bold text-white text-xs">{dim.name}</span>
                    </div>
                    <span className={`font-bold ${dim.color}`}>
                      {dim.score} / {dim.max} pts
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${dim.barColor}`}
                      style={{ width: `${(dim.score / dim.max) * 100}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1 text-[10px]">
                    <span className="text-neutral-300 font-sans">{dim.description}</span>
                    <code className="text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {dim.formula}
                    </code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature 17: REGENERATIVE CROP ROTATION PLANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                FEATURE 17: CROP ROTATION PLANNER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-neutral-300 border border-zinc-700">
                AGRONOMIC ADVISORY
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl text-white mt-1">
              4-Phase Regenerative Rotation Architecture
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Sequence: Wheat → Pulse → Mustard → Wheat
          </span>
        </div>

        <p className="text-xs text-neutral-300 font-light">
          Continuous wheat-rice monoculture degrades soil microbes and depletes deep aquifers. This 4-phase sequence introduces biological nitrogen fixation, pest-cycle interruption, and income diversification.
        </p>

        {/* Rotation Steps Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {rotationPhases.map((phase, idx) => {
            const isSelected = activeRotationStep === idx;
            return (
              <button
                key={phase.step}
                onClick={() => {
                  soundFx.playClick();
                  setActiveRotationStep(idx);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer font-mono ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 shadow-md scale-[1.02]'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                  <span>Phase {phase.step}</span>
                  <span className="text-emerald-400 font-bold">{phase.season}</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{phase.crop}</div>
                <div className="text-[10px] text-neutral-400 truncate mt-0.5">{phase.type}</div>
              </button>
            );
          })}
        </div>

        {/* Active Phase Deep-Dive Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">
                PHASE {rotationPhases[activeRotationStep].step} SPECIFICATION
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {rotationPhases[activeRotationStep].crop} ({rotationPhases[activeRotationStep].season})
              </h3>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {rotationPhases[activeRotationStep].type}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-neutral-400 text-[10px] block font-bold text-emerald-400">🌱 NITROGEN MANAGEMENT</span>
              <p className="text-neutral-200 font-sans font-light leading-relaxed">
                {rotationPhases[activeRotationStep].nitrogen}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-neutral-400 text-[10px] block font-bold text-cyan-400">💧 WATER DEMAND PROFILE</span>
              <p className="text-neutral-200 font-sans font-light leading-relaxed">
                {rotationPhases[activeRotationStep].water}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-neutral-400 text-[10px] block font-bold text-amber-400">🛡️ PEST-CYCLE INTERRUPTION</span>
              <p className="text-neutral-200 font-sans font-light leading-relaxed">
                {rotationPhases[activeRotationStep].pest}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-neutral-400 text-[10px] block font-bold text-teal-400">🌾 RESIDUE & SOIL CARBON</span>
              <p className="text-neutral-200 font-sans font-light leading-relaxed">
                {rotationPhases[activeRotationStep].residue}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] font-sans">
              <strong className="text-white">Livelihood & Income Diversification: </strong>
              <span className="text-neutral-300 font-light">{rotationPhases[activeRotationStep].income}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Credits Sequestration Calculator with Transparent Demo Tag */}
      <div className="glass-card-interactive rounded-3xl p-6 sm:p-10 border border-emerald-500/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                SOIL CARBON PROTOCOL
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-neutral-300 border border-zinc-700">
                DEMO ESTIMATE / SIMULATED BENCHMARK
              </span>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F9F8F3]">
              Soil Carbon Credit Yield Calculator
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-light">
              By locking carbon into topsoil humus through zero-tillage, legume cover crops, and biochar amendment, 
              farmers generate verified carbon sequestration metrics.
            </p>

            {/* Toggle checkboxes */}
            <div className="space-y-2 font-mono text-xs pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={zeroTillAdopted}
                  onChange={(e) => {
                    soundFx.playClick();
                    setZeroTillAdopted(e.target.checked);
                  }}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <span className="text-[#ECE8DD]">Zero-Tillage Direct Seeding (+1.4 t CO2e/Ha)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coverCropAdopted}
                  onChange={(e) => {
                    soundFx.playClick();
                    setCoverCropAdopted(e.target.checked);
                  }}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <span className="text-[#ECE8DD]">Winter Legume Cover Cropping (+1.2 t CO2e/Ha)</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={biocharUsed}
                  onChange={(e) => {
                    soundFx.playClick();
                    setBiocharUsed(e.target.checked);
                  }}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <span className="text-[#ECE8DD]">Stubble Biochar Infiltration (+1.1 t CO2e/Ha)</span>
              </label>
            </div>
          </div>

          {/* Calculator Output Display */}
          <div className="p-8 rounded-3xl bg-black/60 border border-emerald-500/30 flex flex-col justify-between text-center space-y-6">
            <div>
              <span className="text-xs font-mono text-neutral-400 block mb-1">ANNUAL SEQUESTERED CARBON</span>
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-emerald-400">
                {totalCo2Sequestered} <span className="text-xl text-neutral-300">Tonnes CO2e</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-[11px] font-mono text-emerald-300 block mb-1 font-bold">PROJECTED REVENUE ESTIMATE</span>
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
                ₹{totalCreditPayout.toLocaleString()}
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                Simulated estimate based on ₹1,100 / verified voluntary agricultural carbon credit
              </span>
            </div>

            <button
              onClick={() => soundFx.playChime(640, 0.4)}
              className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Generate Digital Carbon Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
