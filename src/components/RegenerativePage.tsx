import React, { useState } from 'react';
import { 
  RotateCw, 
  Leaf, 
  Droplet, 
  Sprout
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const RegenerativePage: React.FC = () => {
  const [hectares] = useState(14.2);
  const [zeroTillAdopted, setZeroTillAdopted] = useState(true);
  const [coverCropAdopted, setCoverCropAdopted] = useState(true);
  const [biocharUsed, setBiocharUsed] = useState(true);

  // Carbon sequestration calculations
  const baseSequestrationPerHa = (zeroTillAdopted ? 1.4 : 0.4) + (coverCropAdopted ? 1.2 : 0) + (biocharUsed ? 1.1 : 0);
  const totalCo2Sequestered = (hectares * baseSequestrationPerHa).toFixed(1);
  const carbonCreditPriceInr = 1100; // ₹1,100 per tonne of verified agricultural carbon offset
  const totalCreditPayout = Math.round(parseFloat(totalCo2Sequestered) * carbonCreditPriceInr);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <RotateCw className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>CLIMATE-RESILIENT REGENERATIVE AGRO-ECOLOGY</span>
            <span>•</span>
            <span>VERRA & GOLD STANDARD MRV VERIFIED</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            Regenerative Agriculture Scorecard
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Rebuilding soil organic microbiome, conserving groundwater aquifers, and monetizing soil carbon credits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <span>CARBON YIELD: {totalCo2Sequestered}t CO2e / YEAR</span>
          </div>
        </div>
      </div>

      {/* Scorecard Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 1 Col: Score Gauge 78/100 */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-4">
              Composite Practice Score
            </span>

            {/* Circular SVG Gauge */}
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
                  strokeDashoffset={263.8 - (263.8 * 78) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-4xl font-extrabold text-[#F9F8F3]">78</span>
                <span className="text-xs text-neutral-400 font-light">/ 100 GRADE A</span>
              </div>
            </div>

            <h3 className="font-display font-bold text-lg text-[#F9F8F3] mb-1">
              High Ecological Resilience
            </h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              Ayush Farm is in the top 6% of climate-adapted agricultural properties in Uttar Pradesh.
            </p>
          </div>

          <div className="w-full pt-6 border-t border-white/10 mt-6 font-mono text-xs flex justify-between text-neutral-400">
            <span>Soil Biodiversity: <strong className="text-emerald-300">92/100</strong></span>
            <span>Erosion Risk: <strong className="text-emerald-300">Negligible</strong></span>
          </div>
        </div>

        {/* Right 2 Cols: 4 Core Pillars */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              Four Regenerative Pillars
            </span>
            <span className="text-xs font-mono text-neutral-400">AUDITED VIA SATELLITE RADAR</span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Pillar 1: Water Efficiency */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-200 font-bold flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-cyan-400" />
                  <span>1. Aquifer Recharge & Water Efficiency</span>
                </span>
                <span className="text-cyan-400 font-bold">84% (+26% vs conventional)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="w-[84%] h-full bg-cyan-400" />
              </div>
              <p className="text-[11px] text-neutral-400 font-sans">
                Alternate wetting and drying (AWD) implemented in Plot A; zero flood over-saturation.
              </p>
            </div>

            {/* Pillar 2: Soil Health */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-200 font-bold flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span>2. Soil Microbial Health & Mycorrhizae</span>
                </span>
                <span className="text-emerald-400 font-bold">76%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="w-[76%] h-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-neutral-400 font-sans">
                Active fungal hyphae network in upper 15cm; earthworm casting density at 12/m².
              </p>
            </div>

            {/* Pillar 3: Crop Diversity */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-200 font-bold flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-lime-400" />
                  <span>3. Crop Diversity & Legume Integration</span>
                </span>
                <span className="text-lime-400 font-bold">82%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="w-[82%] h-full bg-lime-400" />
              </div>
              <p className="text-[11px] text-neutral-400 font-sans">
                Wheat rotated with Pigeon Pea and Mustard intercropping disrupts nematode pest cycles.
              </p>
            </div>

            {/* Pillar 4: Residue Management */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-200 font-bold flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-amber-400" />
                  <span>4. Zero-Burn Residue Utilization</span>
                </span>
                <span className="text-amber-400 font-bold">70%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="w-[70%] h-full bg-amber-400" />
              </div>
              <p className="text-[11px] text-neutral-400 font-sans">
                100% of paddy stubble diverted from burning toward biochar pyrolysis and compost.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Credits Sequestration Calculator */}
      <div className="glass-card-interactive rounded-3xl p-6 sm:p-10 border border-emerald-500/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              Monetized Soil Carbon Engine
            </span>
            <h3 className="font-display font-extrabold text-3xl text-[#F9F8F3]">
              Soil Carbon Credit Yield Calculator
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed font-light">
              By locking carbon into topsoil humus through zero-tillage and biochar amendment, 
              Ayush Farm earns verified digital carbon credits tradeable on international voluntary markets.
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
              <div className="font-display font-extrabold text-5xl text-emerald-400">
                {totalCo2Sequestered} <span className="text-xl text-neutral-300">Tonnes CO2e</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-[11px] font-mono text-emerald-300 block mb-1">ESTIMATED ANNUAL PAYOUT</span>
              <div className="font-display font-extrabold text-4xl text-[#F9F8F3]">
                ₹{totalCreditPayout.toLocaleString()}
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                Based on current benchmark ₹1,100 / verified credit
              </span>
            </div>

            <button
              onClick={() => soundFx.playChime(640, 0.4)}
              className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Issue Digital Carbon Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
