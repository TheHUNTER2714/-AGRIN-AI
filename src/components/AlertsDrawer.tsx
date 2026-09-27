import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, BellRing, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

export interface FarmAlert {
  id: string;
  time: string;
  date: 'TODAY' | 'YESTERDAY' | 'THIS WEEK';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'good';
  category: 'Weather' | 'Vegetation' | 'Soil' | 'Pest' | 'Residue';
  actionLabel?: string;
  onAction?: () => void;
}

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: FarmAlert[];
  onSelectAlertAction?: (alert: FarmAlert) => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onSelectAlertAction,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Slide-in Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-[#05130D]/95 backdrop-blur-2xl border-l border-emerald-500/30 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#ECE8DD]">
                    Farm Intelligence Alerts
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Real-time satellite & micro-climate anomalies
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alerts List Timeline */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {['TODAY', 'YESTERDAY', 'THIS WEEK'].map((sectionDate) => {
                const group = alerts.filter((a) => a.date === sectionDate);
                if (group.length === 0) return null;

                return (
                  <div key={sectionDate} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                        {sectionDate}
                      </span>
                      <div className="flex-1 h-[1px] bg-white/10" />
                    </div>

                    <div className="space-y-3">
                      {group.map((alert) => {
                        const isHigh = alert.severity === 'high';
                        const isMedium = alert.severity === 'medium';
                        const isGood = alert.severity === 'good';

                        return (
                          <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border transition-all ${
                              isHigh
                                ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/50'
                                : isMedium
                                ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                                : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-1.5">
                              <div className="flex items-center gap-2">
                                {isHigh && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
                                )}
                                {isMedium && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                                )}
                                {isGood && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                                )}
                                <span className="font-semibold text-sm text-[#ECE8DD]">
                                  {alert.title}
                                </span>
                              </div>
                              <span className="text-[11px] font-mono text-neutral-400 whitespace-nowrap">
                                {alert.time}
                              </span>
                            </div>

                            <p className="text-xs text-neutral-300/80 mb-3 leading-relaxed">
                              {alert.description}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300">
                                {alert.category}
                              </span>
                              {alert.actionLabel && (
                                <button
                                  onClick={() => {
                                    soundFx.playClick();
                                    onSelectAlertAction?.(alert);
                                    onClose();
                                  }}
                                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                                >
                                  <span>{alert.actionLabel}</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer with Gemini Live broadcast status */}
            <div className="p-4 border-t border-white/10 bg-[#030B07] flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Syncing Sentinel-2 & IMD Radars</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">LIVE: 98.4%</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
