import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FlaskConical, 
  Layers, 
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const SoilPage: React.FC = () => {
  const [nitrogen, setNitrogen] = useState(42);
  const [phosphorus, setPhosphorus] = useState(31);
  const [potassium, setPotassium] = useState(68);
  const [soilPh] = useState(7.8);
  const [organicCarbon] = useState(0.58);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span>SUB-SURFACE RHIZOSPHERE ELECTRO-CONDUCTIVITY</span>
            <span>•</span>
            <span>ICAR & SOIL HEALTH CARD PROTOCOL</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            Soil Chemistry & Strata Lab
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Precision macronutrient monitoring, organic carbon mapping, and biological regenerative amendments.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-neutral-400 block text-[10px]">SOIL TYPE</span>
            <span className="text-emerald-300 font-bold">Alluvial Sandy Loam</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-neutral-400 block text-[10px]">ORGANIC CARBON</span>
            <span className="text-amber-300 font-bold">{organicCarbon}% (Medium)</span>
          </div>
        </div>
      </div>

      {/* Main Soil Strata & NPK Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 1 Col: Animated Soil Strata Layers Visual */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                Vertical Soil Strata
              </span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>

            <p className="text-xs text-neutral-300 mb-6 font-light leading-relaxed">
              Cross-section of the 0–100cm pedological horizon at Pratapgarh.
            </p>

            {/* 3D Vertical Layer Stack */}
            <div className="space-y-3 font-mono text-xs">
              {/* Layer 1: Topsoil / O-Horizon */}
              <motion.div 
                whileHover={{ x: 4 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-[#2c1d11] to-[#422a18] border border-amber-800/40 text-amber-200"
              >
                <div className="flex justify-between font-bold">
                  <span>0–15 cm: Topsoil (Humus)</span>
                  <span className="text-emerald-400">Microbial Active</span>
                </div>
                <div className="text-[11px] text-amber-300/80 mt-1">
                  Active rhizosphere, mycorrhizal fungi colonization, organic carbon 0.58%.
                </div>
              </motion.div>

              {/* Layer 2: Subsoil / B-Horizon */}
              <motion.div 
                whileHover={{ x: 4 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-[#1e140c] to-[#2e1d12] border border-amber-900/40 text-stone-300"
              >
                <div className="flex justify-between font-bold">
                  <span>15–45 cm: Root Penetration</span>
                  <span className="text-cyan-400">28% Moisture</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  Primary taproot zone for mustard & wheat; high potassium retention.
                </div>
              </motion.div>

              {/* Layer 3: Deep Substratum / C-Horizon */}
              <motion.div 
                whileHover={{ x: 4 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-[#120c07] to-[#1a110a] border border-stone-800 text-stone-400"
              >
                <div className="flex justify-between font-bold">
                  <span>45–100 cm: Bedrock Buffer</span>
                  <span>Water Table 4.8m</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  Calcium carbonate nodule layer (Kankar); moderate mineral percolation.
                </div>
              </motion.div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-neutral-400">
            Cation Exchange Capacity (CEC): <strong className="text-emerald-300">18.4 meq/100g</strong>
          </div>
        </div>

        {/* Right 2 Cols: Interactive Nutrient Gauges & AI Fertilizer Protocol */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                Interactive Soil Simulator
              </span>
              <h3 className="font-display font-bold text-xl text-[#F9F8F3] mt-0.5">
                Primary Macronutrient Profile (NPK)
              </h3>
            </div>
            <div className="text-right">
              <span className="font-display font-extrabold text-3xl text-emerald-400">72</span>
              <span className="text-xs text-neutral-400 font-mono"> / 100 HEALTH</span>
            </div>
          </div>

          {/* N-P-K Sliders */}
          <div className="space-y-4 font-mono text-xs">
            {/* Nitrogen */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 font-bold">Nitrogen (N) — Available</span>
                <span className="text-amber-400 font-bold">{nitrogen} kg/ha (Deficient &lt; 50)</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={nitrogen}
                onChange={(e) => {
                  soundFx.playClick();
                  setNitrogen(parseInt(e.target.value, 10));
                }}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
              />
              <div className="text-[10px] text-neutral-400">Target for Sharbati Wheat: 60 kg/ha</div>
            </div>

            {/* Phosphorus */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 font-bold">Phosphorus (P) — Olsen Extractable</span>
                <span className="text-emerald-400 font-bold">{phosphorus} kg/ha (Adequate 25-40)</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={phosphorus}
                onChange={(e) => {
                  soundFx.playClick();
                  setPhosphorus(parseInt(e.target.value, 10));
                }}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
              />
              <div className="text-[10px] text-neutral-400">Crucial for root elongation & ATP energy transfer</div>
            </div>

            {/* Potassium */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 font-bold">Potassium (K) — Exchangeable</span>
                <span className="text-emerald-400 font-bold">{potassium} kg/ha (High &gt; 55)</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                value={potassium}
                onChange={(e) => {
                  soundFx.playClick();
                  setPotassium(parseInt(e.target.value, 10));
                }}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
              />
              <div className="text-[10px] text-neutral-400">Supports disease immunity and drought hardiness</div>
            </div>

            {/* pH and Organic Carbon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-neutral-400 text-[10px] block mb-1">SOIL pH LEVEL</span>
                <div className="text-lg font-bold text-emerald-300">{soilPh} (Slightly Alkaline)</div>
                <div className="text-[10px] text-neutral-400 mt-1">Optimum range 6.5–7.5</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-neutral-400 text-[10px] block mb-1">ORGANIC CARBON STATUS</span>
                <div className="text-lg font-bold text-amber-300">{organicCarbon}% (Target &gt; 0.75%)</div>
                <div className="text-[10px] text-neutral-400 mt-1">Boost with stubble biochar addition</div>
              </div>
            </div>
          </div>

          {/* AI Soil Advisory Protocol */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-black/50 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>AI BALANCED NUTRITION ADVISORY</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light">
              Nitrogen is currently the primary limiting factor (42 kg/ha vs 60 kg/ha benchmark). 
              Rather than synthetic urea over-application, integrate <strong>Azotobacter bio-fertilizer seed inoculation</strong> 
              alongside a split dose of 45 kg/ha neem-coated urea applied 12 hours post-rainfall. 
              Add <strong>1.5 tonnes/ha vermicompost</strong> to raise soil organic carbon toward 0.75%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
