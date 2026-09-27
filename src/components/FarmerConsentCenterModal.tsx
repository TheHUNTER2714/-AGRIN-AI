import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Download, 
  Trash2, 
  MapPin, 
  Sprout, 
  FlaskConical, 
  Satellite, 
  Mic 
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FarmerConsentCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmerConsentCenterModal: React.FC<FarmerConsentCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [consents, setConsents] = useState({
    location: true,
    cropData: true,
    soilData: true,
    satelliteAnalysis: true,
    voiceRecordings: false,
    fpoSharing: true,
    stateGovSharing: true,
  });

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleConsent = (key: keyof typeof consents) => {
    soundFx.playClick();
    setConsents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExportPassport = () => {
    soundFx.playChime(640, 0.3);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

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
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    DPDP ACT 2023 COMPLIANT
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Kisan Data Sovereignty</span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#F9F8F3] mt-0.5">
                  Farmer Data Consent Center
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

          <p className="text-xs text-neutral-300 leading-relaxed font-light mt-4">
            Under India&apos;s Digital Personal Data Protection (DPDP) Act and the AgriStack Digital Public Good protocol, you own 100% of your farm data. You decide what is shared with AI models, FPOs, and state agriculture departments.
          </p>

          {/* Granular Consents Matrix */}
          <div className="mt-6 space-y-3 font-mono text-xs">
            <span className="text-neutral-400 text-[10px] uppercase tracking-wider block">
              Granular Data Sharing Controls:
            </span>

            {/* Location */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-[#ECE8DD] block">Farm GPS & Boundary Cadastral</span>
                  <span className="text-[10px] text-neutral-400 font-sans">Used only for 10m Sentinel-2 satellite pass alignment</span>
                </div>
              </div>
              <button
                onClick={() => toggleConsent('location')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  consents.location ? 'bg-emerald-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                  consents.location ? 'left-6.5' : 'left-0.5'
                }`} />
              </button>
            </div>

            {/* Crop Data */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-[#ECE8DD] block">Crop Species & Yield History</span>
                  <span className="text-[10px] text-neutral-400 font-sans">Used to calibrate fertilizer prescriptions & harvest models</span>
                </div>
              </div>
              <button
                onClick={() => toggleConsent('cropData')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  consents.cropData ? 'bg-emerald-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                  consents.cropData ? 'left-6.5' : 'left-0.5'
                }`} />
              </button>
            </div>

            {/* Soil Lab */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FlaskConical className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <span className="font-bold text-[#ECE8DD] block">Soil Chemistry Sensor Reports (NPK / pH)</span>
                  <span className="text-[10px] text-neutral-400 font-sans">Enables localized regenerative compost optimization</span>
                </div>
              </div>
              <button
                onClick={() => toggleConsent('soilData')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  consents.soilData ? 'bg-emerald-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                  consents.soilData ? 'left-6.5' : 'left-0.5'
                }`} />
              </button>
            </div>

            {/* Satellite Analysis */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Satellite className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="font-bold text-[#ECE8DD] block">Multispectral Vegetation Analysis</span>
                  <span className="text-[10px] text-neutral-400 font-sans">Allows early pest & drought warnings</span>
                </div>
              </div>
              <button
                onClick={() => toggleConsent('satelliteAnalysis')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  consents.satelliteAnalysis ? 'bg-emerald-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                  consents.satelliteAnalysis ? 'left-6.5' : 'left-0.5'
                }`} />
              </button>
            </div>

            {/* Voice Data */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-[#ECE8DD] block">Vernacular Voice Audio Recordings</span>
                  <span className="text-[10px] text-neutral-400 font-sans">Retain raw acoustic audio for model training (Default: OFF)</span>
                </div>
              </div>
              <button
                onClick={() => toggleConsent('voiceRecordings')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  consents.voiceRecordings ? 'bg-emerald-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                  consents.voiceRecordings ? 'left-6.5' : 'left-0.5'
                }`} />
              </button>
            </div>
          </div>

          {/* Third-Party Ecosystem Sharing */}
          <div className="mt-6 p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 font-mono text-xs">
            <span className="text-emerald-400 font-bold block uppercase text-[10px]">
              Multi-Tier Federation:
            </span>

            <div className="flex items-center justify-between text-neutral-300">
              <span className="text-[11px]">Share anonymized stress signals with local FPO:</span>
              <button
                onClick={() => toggleConsent('fpoSharing')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                  consents.fpoSharing ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-neutral-400'
                }`}
              >
                {consents.fpoSharing ? 'PERMITTED' : 'BLOCKED'}
              </button>
            </div>

            <div className="flex items-center justify-between text-neutral-300">
              <span className="text-[11px]">Share water-stress alerts with State Irrigation Dept:</span>
              <button
                onClick={() => toggleConsent('stateGovSharing')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                  consents.stateGovSharing ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-neutral-400'
                }`}
              >
                {consents.stateGovSharing ? 'PERMITTED' : 'BLOCKED'}
              </button>
            </div>
          </div>

          {/* Export & Revocation Actions */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <button
              onClick={handleExportPassport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Downloaded Kisan Data Passport JSON!' : 'Export Kisan Data Passport (JSON)'}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setConsents({
                  location: false,
                  cropData: false,
                  soilData: false,
                  satelliteAnalysis: false,
                  voiceRecordings: false,
                  fpoSharing: false,
                  stateGovSharing: false,
                });
              }}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Revoke All Permissions</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
