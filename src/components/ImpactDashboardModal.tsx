import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BarChart3, 
  Users, 
  Bot, 
  ShieldAlert, 
  Stethoscope, 
  Recycle, 
  MapPin, 
  Droplet, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ImpactDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImpactDashboardModal: React.FC<ImpactDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const metrics = [
    { label: 'Farms Monitored', value: '12,482', change: '+18% this month', icon: Users, color: 'text-emerald-400' },
    { label: 'AI Advisories Delivered', value: '38,291', change: 'Across 12 Indic dialects', icon: Bot, color: 'text-teal-400' },
    { label: 'Early Risk Alerts Issued', value: '4,182', change: 'Avg 6.4 days advance lead', icon: ShieldAlert, color: 'text-amber-400' },
    { label: 'Crop Disease Diagnoses', value: '7,294', change: '96.2% ViT accuracy', icon: Stethoscope, color: 'text-lime-400' },
    { label: 'Crop Residue Diverted', value: '1,248 Tonnes', change: 'Zero burn achieved', icon: Recycle, color: 'text-emerald-300' },
    { label: 'Villages Covered', value: '184', change: '4 Pilot districts in UP & Punjab', icon: MapPin, color: 'text-cyan-400' },
    { label: 'Groundwater Conserved', value: '42.6M Litres', change: 'Via precision delay protocols', icon: Droplet, color: 'text-blue-400' },
    { label: 'Direct Kisan Payouts', value: '₹24.3 Lakhs', change: 'AgriCycle biomass revenue', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#05130D] border border-emerald-500/40 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-[#ECE8DD]"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    NATIONAL IMPACT METRICS
                  </span>
                  <span className="text-xs font-mono text-neutral-400">AgriN Public Good Audit</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl text-[#F9F8F3] mt-0.5">
                  AgriN Ecosystem Impact
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

          {/* Hackathon Transparency Notice */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs font-mono">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-amber-300 font-bold block mb-0.5">
                TRANSPARENCY DISCLOSURE:
              </span>
              <p className="text-neutral-300 font-sans leading-relaxed">
                Values displayed represent prototype / simulated pilot deployment metrics calibrated to the Pratapgarh (UP) and Sangrur (Punjab) baseline study.
              </p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{m.label}</span>
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>

                  <div>
                    <div className="font-display font-extrabold text-2xl text-[#F9F8F3]">
                      {m.value}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      {m.change}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Environmental Carbon & Soil Impact Summary */}
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-black to-[#05130D] border border-emerald-500/20 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-neutral-300">
              <span>Verified CO2 Emissions Averted:</span>
              <strong className="text-emerald-400 text-sm">3,120 Tonnes CO2e</strong>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span>Average Farmer Nitrogen Fertilizer Cost Reduction:</span>
              <strong className="text-emerald-400 text-sm">-24% (Saved ₹3,400/Ha)</strong>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span>Groundwater Level Depletion Stabilization:</span>
              <strong className="text-cyan-300 text-sm">+0.4m Head Recovery</strong>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-md"
            >
              Close Impact Summary
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
