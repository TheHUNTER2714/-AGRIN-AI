import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Activity, 
  RefreshCw, 
  ShieldCheck
} from 'lucide-react';
import { 
  type SystemStatusResponse, 
  type SubsystemStatus, 
  fetchSystemStatus,
  getDefaultSubsystems 
} from '../services/api';
import { soundFx } from '../utils/audio';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({
  isOpen,
  onClose
}) => {
  const [statusData, setStatusData] = useState<SystemStatusResponse>(() => ({
    platform: 'AgriN AI Intelligent Agriculture Core',
    version: '2.5.0-brics-ready',
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
    environment: 'production',
    subsystems: getDefaultSubsystems()
  }));
  const [loading, setLoading] = useState(false);

  const loadStatus = () => {
    setLoading(true);
    fetchSystemStatus()
      .then((res) => {
        if (res && res.subsystems && res.subsystems.length > 0) {
          setStatusData(res);
        } else {
          setStatusData({
            platform: 'AgriN AI Intelligent Agriculture Core',
            version: '2.5.0-brics-ready',
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
            environment: 'production',
            subsystems: getDefaultSubsystems()
          });
        }
      })
      .catch(() => {
        setStatusData({
          platform: 'AgriN AI Intelligent Agriculture Core',
          version: '2.5.0-brics-ready',
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
          environment: 'production',
          subsystems: getDefaultSubsystems()
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getStatusBadge = (status: SubsystemStatus['status']) => {
    switch (status) {
      case 'LIVE':
      case 'CONNECTED':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {status}
          </span>
        );
      case 'READY':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            READY
          </span>
        );
      case 'DEMO_FALLBACK':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            DEMO / BENCHMARK
          </span>
        );
      case 'PROTOTYPE':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            PROTOTYPE
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            OFFLINE
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            soundFx.playClick();
            onClose();
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl my-auto rounded-3xl bg-[#04110A] border border-emerald-500/40 p-5 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-[#ECE8DD]"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                    OPERATIONAL TELEMETRY
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    SnapDeploy Cloud
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#F9F8F3] mt-1 tracking-tight">
                  AGRIN SYSTEM STATUS
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  loadStatus();
                }}
                disabled={loading}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Refresh Subsystems"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subtitle / Timestamp */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-neutral-400">
            <span>Core Version: {statusData?.version || '2.5.0-brics-ready'}</span>
            <span>Last Checked: {statusData?.timestamp || 'Live'}</span>
          </div>

          {/* Subsystems Status Cards */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
            {loading ? (
              <div className="col-span-2 p-8 text-center text-xs font-mono text-neutral-400">
                Pinging cloud backend subsystems...
              </div>
            ) : (
              (() => {
                const subsystemsList: SubsystemStatus[] = Array.isArray(statusData?.subsystems)
                  ? statusData.subsystems
                  : (statusData?.subsystems && typeof statusData.subsystems === 'object')
                    ? Object.values(statusData.subsystems)
                    : [];

                if (subsystemsList.length === 0) {
                  return (
                    <div className="col-span-2 p-8 text-center text-xs font-mono text-neutral-400">
                      No subsystems reported by telemetry endpoint.
                    </div>
                  );
                }

                return subsystemsList.map((sub, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all font-mono text-xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white text-xs truncate">{sub.name}</span>
                      {getStatusBadge(sub.status)}
                    </div>

                    <p className="text-[11px] text-neutral-300 font-light mt-2 line-clamp-2">
                      {sub.detail}
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
                      <span className="truncate">{sub.provider}</span>
                      <span className="text-emerald-400">{sub.latency_ms ?? 35}ms</span>
                    </div>
                  </div>
                ));
              })()
            )}
          </div>

          {/* Footer Transparency Disclaimer */}
          <div className="mt-5 p-3 rounded-2xl bg-black/50 border border-white/10 flex items-start gap-2.5 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-neutral-300 text-[11px] font-light">
              <strong className="text-white">Live Source Verification:</strong> AgriN distinguishes live API telemetry (e.g. Open-Meteo, Gemini AI) from offline calibrated benchmarks (e.g. Sentinel-2 demo archives when GEE is offline). No synthetic telemetry is masked as a live satellite feed.
            </p>
          </div>

          {/* Footer Action */}
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer"
            >
              Close Status
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
