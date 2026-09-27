import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Mic, 
  Volume2, 
  HelpCircle, 
  TrendingUp, 
  ArrowRight,
  Sliders,
  Calendar,
  MapPin
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FarmerSimpleModeProps {
  onSwitchToExpert: () => void;
  onOpenVoiceAssistant: () => void;
  onOpenWhyModal: () => void;
  onNavigateToScan: () => void;
}

export const FarmerSimpleMode: React.FC<FarmerSimpleModeProps> = ({
  onSwitchToExpert,
  onOpenVoiceAssistant,
  onOpenWhyModal,
  onNavigateToScan,
}) => {
  const [isPlayingHindi, setIsPlayingHindi] = useState(false);

  const handleListenActions = () => {
    soundFx.playChime(520, 0.25);
    setIsPlayingHindi(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = "नमस्ते आयुष जी। आज आपके खेत में सिंचाई मत कीजिए, शाम को भारी वर्षा का अनुमान है। अपने निचले खेत में पीली पत्तियों की जांच करें। बारिश के बाद यूरिया का छिड़काव करें।";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.92;
      utterance.onend = () => setIsPlayingHindi(false);
      utterance.onerror = () => setIsPlayingHindi(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingHindi(false), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-20 space-y-8 text-[#ECE8DD]">
      {/* Top Accessibility Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 font-sans">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-bold text-emerald-300">
            🧑🌾 किसान सरल मोड (Farmer Simple Mode Active)
          </span>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onSwitchToExpert();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-[#ECE8DD] border border-white/20 cursor-pointer transition-all"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>Switch to Expert Agronomist Mode</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Big Farmer Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border-2 border-emerald-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-8">
        {/* Farm Name & Health Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>प्रतापगढ़, उत्तर प्रदेश • 14.2 हेक्टेयर</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F9F8F3]">
              🌾 आपका खेत (YOUR FARM)
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-400/50">
            <div className="w-12 h-12 rounded-full bg-emerald-400 text-black flex items-center justify-center font-extrabold text-xl shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              ✓
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
                🟢 फसल स्वस्थ (HEALTHY)
              </div>
              <div className="text-xs text-neutral-300 font-sans">
                स्वास्थ्य स्कोर: 78% (उत्तम स्थिति)
              </div>
            </div>
          </div>
        </div>

        {/* Listen to Today's Actions Audio Button */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <Volume2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="text-sm font-bold text-white block">
                आज के निर्देश सुनें (Listen to Today's Voice Advice)
              </span>
              <span className="text-xs text-neutral-400">
                हिंदी में कृषि सलाह
              </span>
            </div>
          </div>

          <button
            onClick={handleListenActions}
            disabled={isPlayingHindi}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs cursor-pointer shadow-md transition-all hover:scale-105"
          >
            <span>{isPlayingHindi ? 'बोल रहे हैं...' : '🔊 सुनें (Listen)'}</span>
          </button>
        </div>

        {/* Today's 3 Key Actions (Large, Clear & Unmistakable) */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-display font-bold text-emerald-300 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>आज के 3 मुख्य कार्य (Today&apos;s 3 Key Actions)</span>
          </h2>

          <div className="space-y-4">
            {/* Action 1: Don't irrigate */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0a2618] to-black border-2 border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg shrink-0 border border-cyan-500/30">
                  1
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    💧 आज सिंचाई न करें (Don&apos;t Irrigate Today)
                  </h3>
                  <p className="text-sm text-neutral-300 mt-1">
                    शाम को 35 मिमी वर्षा का अनुमान है। सिंचाई करने से पानी और डीजल का नुकसान होगा।
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenWhyModal();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold cursor-pointer transition-all self-start sm:self-center shrink-0"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>क्यों? (Why?)</span>
              </button>
            </div>

            {/* Action 2: Check lower field */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#182315] to-black border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0 border border-amber-500/30">
                  2
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    🔍 निचले खेत का निरीक्षण करें (Check Lower Field)
                  </h3>
                  <p className="text-sm text-neutral-300 mt-1">
                    उपग्रह से प्लॉट बी के उत्तरी किनारे पर पत्तियों में हल्का पीलापन देखा गया है।
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onNavigateToScan();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer transition-all self-start sm:self-center shrink-0"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>पत्ती स्कैन करें (Scan Leaf)</span>
              </button>
            </div>

            {/* Action 3: Rain coming */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0a1f26] to-black border-2 border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg shrink-0 border border-cyan-500/30">
                  3
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    🌧 शाम 4 बजे बारिश की संभावना (Rain Expected at 4 PM)
                  </h3>
                  <p className="text-sm text-neutral-300 mt-1">
                    खेत की मेड़ और जल निकासी नाली साफ रखें ताकि पानी न भरे।
                  </p>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 self-start sm:self-center shrink-0">
                82% संभावना
              </div>
            </div>
          </div>
        </div>

        {/* Big Giant "Ask AgriN" Voice Trigger */}
        <div className="pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              soundFx.playChime(520, 0.3);
              onOpenVoiceAssistant();
            }}
            className="w-full py-6 sm:py-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-300 text-black font-extrabold text-xl sm:text-2xl shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-center gap-4 cursor-pointer transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center animate-pulse">
              <Mic className="w-6 h-6 text-emerald-400" />
            </div>
            <span>🎤 AgriN से पूछें (Ask AgriN by Voice)</span>
          </motion.button>
          <p className="text-center text-xs text-neutral-400 font-mono mt-3">
            हिंदी, भोजपुरी, अवधी और 22 भारतीय भाषाओं में सीधे बोलकर सवाल पूछें
          </p>
        </div>

        {/* Quick Local Mandi Price Ticker for Farmer */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>प्रतापगढ़ मंडी आज का भाव (Mandi Rates Today):</span>
            </span>
            <span>अपडेटेड: 2 घंटे पहले</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-neutral-400 text-[10px] block">गेहूं (WHEAT)</span>
              <span className="text-base font-bold text-white">₹2,425</span>
              <span className="text-[10px] text-emerald-400 block">+₹35 /क्विंटल</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-neutral-400 text-[10px] block">सरसों (MUSTARD)</span>
              <span className="text-base font-bold text-white">₹5,650</span>
              <span className="text-[10px] text-emerald-400 block">+₹120 /क्विंटल</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-neutral-400 text-[10px] block">चना (CHANA)</span>
              <span className="text-base font-bold text-white">₹6,100</span>
              <span className="text-[10px] text-neutral-400 block">स्थिर /क्विंटल</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-neutral-400 text-[10px] block">धान पराली (AGRICYCLE)</span>
              <span className="text-base font-bold text-emerald-400">₹1,950</span>
              <span className="text-[10px] text-emerald-300 block">तुरंत भुगतान /टन</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
