import React, { useState, useEffect } from 'react';
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
  Info,
  Volume2,
  Languages,
  Square,
  ShieldCheck
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const keepAliveRef = React.useRef<any>(null);

  // Cancel any ongoing speech when modal closes or unmounts
  useEffect(() => {
    return () => {
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      soundFx.playClick();
      return;
    }

    soundFx.playChime(600, 0.2);
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const narrationText = lang === 'hi'
      ? "एग्री-एन पारिस्थितिकी तंत्र प्रभाव रिपोर्ट। प्रतापगढ़ अध्ययन के आधार पर, बारह हज़ार से अधिक पायलट खेतों का विश्लेषण किया गया है। मुख्य परिणामों में बयालीस मिलियन लीटर सिंचाई पानी की बचत, तीन हज़ार एक सौ बीस टन कार्बन डाइऑक्साइड उत्सर्जन में कमी, और रासायनिक नाइट्रोजन में चौबीस प्रतिशत की कमी शामिल है, जिससे किसानों को प्रति हेक्टेयर अनुमानित चौंतीस सौ रुपये की सीधी बचत होती है।"
      : "AgriN Ecosystem Impact Modeling Report. Based on the Pratapgarh baseline study, our climate-resilient models have profiled over twelve thousand four hundred pilot farms across one hundred and eighty-four villages. Key projected outcomes include saving over forty-two million litres of irrigation water, averting three thousand one hundred and twenty tonnes of carbon dioxide emissions, and reducing chemical nitrogen usage by twenty-four percent, saving farmers an estimated thirty-four hundred rupees per hectare.";

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick best matching voice if available
    try {
      const voices = window.speechSynthesis.getVoices();
      if (lang === 'hi') {
        const hiVoice = voices.find(v => 
          v.lang.toLowerCase().startsWith('hi') || 
          v.name.toLowerCase().includes('hindi') || 
          v.lang.toLowerCase().includes('in')
        );
        if (hiVoice) utterance.voice = hiVoice;
      } else {
        const enVoice = voices.find(v => 
          v.lang.toLowerCase().startsWith('en-in') || 
          v.name.toLowerCase().includes('india') || 
          v.lang.toLowerCase().startsWith('en')
        );
        if (enVoice) utterance.voice = enVoice;
      }
    } catch {
      // Fallback to default browser voice
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      // Chrome speech synthesis keep-alive heartbeat
      keepAliveRef.current = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } else {
            clearInterval(keepAliveRef.current);
          }
        }
      }, 10000);
    };

    utterance.onend = () => {
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const metrics = [
    { label: 'Pilot Farms Profiled', value: '12,482', change: 'Projected Regional Target', icon: Users, color: 'text-emerald-400', tag: 'PROJECTED' },
    { label: 'AI Advisories Formulated', value: '38,291', change: 'Simulated 12 Dialects', icon: Bot, color: 'text-teal-400', tag: 'SIMULATION' },
    { label: 'Risk Alert Models Evaluated', value: '4,182', change: 'Avg 6.4 days advance lead', icon: ShieldAlert, color: 'text-amber-400', tag: 'BENCHMARK' },
    { label: 'Crop Pathology Scans', value: '7,294', change: 'Gemini Vision Benchmark', icon: Stethoscope, color: 'text-lime-400', tag: 'BENCHMARK' },
    { label: 'Biomass Diversion Capacity', value: '1,248 Tonnes', change: 'Pilot Stubble Aggregation', icon: Recycle, color: 'text-emerald-300', tag: 'ESTIMATE' },
    { label: 'Villages in Topology', value: '184', change: 'Pratapgarh & Sangrur Clusters', icon: MapPin, color: 'text-cyan-400', tag: 'REGIONAL' },
    { label: 'Projected Water Savings', value: '42.6M Litres', change: 'Via irrigation delay model', icon: Droplet, color: 'text-blue-400', tag: 'SIMULATION' },
    { label: 'Estimated Farmer Direct Value', value: '₹24.3 Lakhs', change: 'Model-estimated diesel & biomass value', icon: CheckCircle2, color: 'text-emerald-400', tag: 'ESTIMATE' },
  ];

  return (
    <AnimatePresence>
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
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
          className="relative w-full max-w-4xl my-auto rounded-3xl bg-[#05130D] border border-emerald-500/40 p-5 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-[#ECE8DD] max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                    SIMULATED PILOT METRICS
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Pratapgarh Baseline Study</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl text-[#F9F8F3] mt-0.5">
                  AgriN Ecosystem Impact Modeling
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Voice Narration & Audio Controls Bar */}
          <div className="mt-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleToggleSpeak}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer shadow-md ${
                  isSpeaking
                    ? 'bg-red-500/80 hover:bg-red-600 text-white animate-pulse border border-red-400'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black border border-emerald-300'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Listen Impact Summary</span>
                  </>
                )}
              </button>

              {/* Animated Equalizer Waveform when speaking */}
              {isSpeaking && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-5 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1 h-4 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <span className="text-[10px] font-mono text-emerald-300 font-bold ml-1">Narrating</span>
                </div>
              )}
            </div>

            {/* Language Selector for Voice */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-emerald-400" /> Voice Lang:
              </span>
              <div className="flex items-center bg-black/50 p-0.5 rounded-lg border border-white/10 text-xs font-mono">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setLang('en');
                    if (isSpeaking) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    lang === 'en'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setLang('hi');
                    if (isSpeaking) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    lang === 'hi'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>
          </div>

          {/* Hackathon Transparency Notice */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3 text-xs font-mono">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-amber-300 font-bold block mb-0.5">
                TRANSPARENCY & DATA PROVENANCE DISCLOSURE:
              </span>
              <p className="text-neutral-300 font-sans leading-relaxed text-xs">
                All metrics displayed in this module represent <strong>calibrated prototype models and simulated pilot projections</strong> based on the Pratapgarh (UP) research parcel baseline. These figures are simulations and research extrapolations, not audit-certified national deployment results.
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
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 flex flex-col justify-between hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{m.label}</span>
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>

                  <div>
                    <div className="font-display font-extrabold text-2xl text-[#F9F8F3]">
                      {m.value}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className="text-neutral-400 truncate">{m.change}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 font-bold text-[9px]">
                        {m.tag}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Environmental Carbon & Soil Impact Summary */}
          <div className="mt-6 p-5 rounded-2xl bg-black/60 border border-emerald-500/30 font-mono text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs pb-1 border-b border-white/5">
              <ShieldCheck className="w-4 h-4" />
              <span>PROJECTED RESOURCE STEWARDSHIP ESTIMATES (SIMULATED):</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Projected CO2 Emissions Averted:</span>
              <strong className="text-emerald-400 text-sm">3,120 Tonnes CO2e (Simulated)</strong>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Estimated Chemical Nitrogen Reduction:</span>
              <strong className="text-emerald-400 text-sm">-24% (Est. ₹3,400/Ha saved)</strong>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Groundwater Table Stabilization Potential:</span>
              <strong className="text-cyan-300 text-sm">+0.4m Head Recovery (Model Target)</strong>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                soundFx.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer"
            >
              Close Impact Overview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
