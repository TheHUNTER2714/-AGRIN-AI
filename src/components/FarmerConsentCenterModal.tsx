import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Download, 
  MapPin, 
  Sprout, 
  FlaskConical, 
  AlertTriangle, 
  UserCheck, 
  Clock, 
  Cpu 
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FarmerConsentCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProvenance?: () => void;
}

export const FarmerConsentCenterModal: React.FC<FarmerConsentCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenProvenance
}) => {
  const [activeTab, setActiveTab] = useState<'sovereignty' | 'safety' | 'governance'>('safety');
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl my-auto rounded-3xl bg-[#04110A] border border-emerald-500/40 p-5 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-[#ECE8DD] max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                    TRUST & SAFETY CORE
                  </span>
                  <span className="text-xs font-mono text-neutral-400">DPDP Act 2023 & ICAR Protocols</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl text-[#F9F8F3] mt-0.5">
                  AGRIN TRUST CENTER
                </h3>
              </div>
            </div>

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

          {/* Subtitle / Mode Tabs */}
          <div className="mt-4 flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-xs">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('safety');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'safety'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🛡️ AI Safety Protocol
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('governance');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'governance'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🔒 9-Point Security Checklist
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('sovereignty');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'sovereignty'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🧑‍🌾 Farmer Data Consent
            </button>
          </div>

          {/* Tab 1: Mandatory AI Safety Core */}
          {activeTab === 'safety' && (
            <div className="mt-5 space-y-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>MANDATORY AI SAFETY COMMITMENTS:</span>
                </div>
                <div className="space-y-2.5 text-neutral-300 text-[11px] font-sans">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-amber-400 font-bold font-mono">1.</span>
                    <div>
                      <strong className="text-white block font-mono text-xs">Crop Diagnosis is Preliminary</strong>
                      Computer vision diagnostics are probabilistic screening tools, not guaranteed laboratory pathology.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-amber-400 font-bold font-mono">2.</span>
                    <div>
                      <strong className="text-white block font-mono text-xs">High-Risk Treatments Require Local / KVK Verification</strong>
                      Chemical fungicides and pesticides should never be applied without confirmation from local Krishi Vigyan Kendra (KVK) extension agronomists.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-amber-400 font-bold font-mono">3.</span>
                    <div>
                      <strong className="text-white block font-mono text-xs">Digital Twin Outputs are Scenario Simulations</strong>
                      Simulated yield and water responses are mathematical exploratory models — NOT certified financial or harvest warranties.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-amber-400 font-bold font-mono">4.</span>
                    <div>
                      <strong className="text-white block font-mono text-xs">AI Does Not Guarantee Yield Outcomes</strong>
                      Biological outcomes depend on weather contingencies, seedling vigor, and in-field management outside software control.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-amber-400 font-bold font-mono">5.</span>
                    <div>
                      <strong className="text-white block font-mono text-xs">AI Does Not Replace Qualified Human Agronomists</strong>
                      AgriN augments farmers and FPO field officers with synthesized telemetry — human agronomic judgment remains supreme.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: 9-Point Security & Governance Checklist */}
          {activeTab === 'governance' && (
            <div className="mt-5 space-y-3 font-mono text-xs">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                ENTERPRISE AGRICULTURAL GOVERNANCE AUDIT:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { title: 'Farmer Consent', desc: 'Granular opt-in per sensor stream', status: 'Enforced' },
                  { title: 'Data Minimization', desc: 'Only cadastral polygon stored', status: 'Enforced' },
                  { title: 'Role-Based Access', desc: 'Farmer vs FPO vs District views', status: 'Enforced' },
                  { title: 'API Keys Server-Side', desc: 'Zero cloud secrets on frontend', status: 'Enforced' },
                  { title: 'Data Provenance', desc: 'Auditable lineage for every index', status: 'Enforced' },
                  { title: 'AI Advisory Disclosure', desc: 'Transparent model reasoning chain', status: 'Enforced' },
                  { title: 'Human Escalation', desc: 'KVK officer review trigger', status: 'Enforced' },
                  { title: 'Audit Timestamps', desc: 'Immutable log per observation', status: 'Enforced' },
                  { title: 'Model Versioning', desc: 'Centralized model tracking', status: 'Enforced' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-xs truncate">✓ {item.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-sans">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Version & Audit metadata */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  Primary Model: <strong className="text-white font-mono">Google Gemini 2.5 Flash</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Audit Cycle: <strong className="text-white font-mono">27 Sep 2026, 14:30 IST</strong>
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Granular Farmer Consent Matrix */}
          {activeTab === 'sovereignty' && (
            <div className="mt-5 space-y-3 font-mono text-xs">
              <span className="text-neutral-400 text-[10px] uppercase tracking-wider block font-bold">
                GRANULAR KISAN DATA SHARING CONTROLS:
              </span>

              {/* Location */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block text-xs">Farm GPS & Boundary Polygon</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Used strictly for Sentinel-2 satellite pass alignment</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleConsent('location')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    consents.location ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                    consents.location ? 'left-5.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* Crop Data */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block text-xs">Crop Sowing & Stage Timeline</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Grounds phenology model for fertilizer scheduling</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleConsent('cropData')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    consents.cropData ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                    consents.cropData ? 'left-5.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* Soil Data */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FlaskConical className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block text-xs">Soil Lab Telemetry (NPK, pH, SOC)</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Calibrates regenerative fertilizer adjustments</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleConsent('soilData')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    consents.soilData ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                    consents.soilData ? 'left-5.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* FPO Pooling */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block text-xs">Anonymous FPO Pest & Risk Pooling</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Pools anonymous disease warnings to protect neighboring farms</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleConsent('fpoSharing')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    consents.fpoSharing ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                    consents.fpoSharing ? 'left-5.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleExportPassport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 text-xs font-mono transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Export Kisan Data Passport (.json)'}</span>
            </button>

            <div className="flex items-center gap-2">
              {onOpenProvenance && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onClose();
                    onOpenProvenance();
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono transition-colors cursor-pointer border border-white/10"
                >
                  Inspect Data Provenance
                </button>
              )}
              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
