import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Volume2, 
  HelpCircle, 
  TrendingUp, 
  ArrowRight,
  Sliders,
  Calendar,
  MapPin,
  Info
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { fetchLiveWeather, calculateCropRisk, type WeatherData, type RiskEngineResult } from '../services/api';

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
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [risk, setRisk] = useState<RiskEngineResult | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const w = await fetchLiveWeather(25.92, 81.99, 'Pratapgarh, UP');
        setWeather(w);
        const r = await calculateCropRisk();
        setRisk(r);
      } catch {
        // Handled
      }
    }
    loadData();
  }, []);

  const rainProb = weather?.rain_probability ?? 82;
  const rainMm = weather?.rainfall_mm ?? 35.0;
  const temp = weather?.temperature_c ?? 28.4;
  const healthScore = risk ? Math.max(30, 100 - Math.round(risk.composite_risk_score * 0.35)) : 78;

  const handleListenActions = () => {
    soundFx.playChime(520, 0.25);
    setIsPlayingHindi(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `नमस्ते आयुष जी। आज आपके खेत में सिंचाई मत कीजिए, शाम को ${rainProb} प्रतिशत भारी वर्षा का अनुमान है। अपने निचले खेत में पीली पत्तियों की जांच करें। बारिश के बाद यूरिया का छिड़काव करें।`;
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
            🧑‍🌾 किसान सरल मोड (Farmer Simple Mode Active)
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
                🟢 {healthScore >= 70 ? 'फसल स्वस्थ (HEALTHY)' : 'सतर्कता आवश्यक (WATCH)'}
              </div>
              <div className="text-xs text-neutral-300 font-sans">
                स्वास्थ्य स्कोर: {healthScore}% • मौसम: {temp}°C, {weather?.condition || 'Rain Alert'}
              </div>
            </div>
          </div>
        </div>

        {/* Today's 3 Key Actions in Big Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-amber-400" />
              <span>आज के जरूरी कार्य (Today's Actions):</span>
            </h2>
            <button
              onClick={handleListenActions}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs cursor-pointer transition-all shadow-lg ${
                isPlayingHindi ? 'animate-pulse' : ''
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingHindi ? 'बोल रहा है...' : '🔊 आवाज में सुनें (Listen)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
            {/* Action 1 */}
            <div className="p-6 rounded-2xl bg-amber-950/40 border-2 border-amber-500/40 space-y-2">
              <div className="text-3xl font-extrabold text-amber-400">1</div>
              <div className="text-lg font-bold text-white leading-snug">
                {rainProb > 60 ? 'सिंचाई मत कीजिए (Don\'t Irrigate)' : 'हल्की सिंचाई करें (Light Irrigate)'}
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {rainProb > 60 
                  ? `आज शाम को ${rainProb}% भारी वर्षा (${rainMm}mm) का अनुमान है। पानी देने से फसल गिरेगी और खाद बहेगी।` 
                  : 'मौसम अनुकूल है, सामान्य सिंचाई जारी रख सकते हैं।'}
              </p>
            </div>

            {/* Action 2 */}
            <div className="p-6 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/40 space-y-2">
              <div className="text-3xl font-extrabold text-emerald-400">2</div>
              <div className="text-lg font-bold text-white leading-snug">
                निचले खेत की जांच करें (Check Plot B)
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                उपग्रह रडार ने उत्तरी छोर पर हल्की पीली पत्तियां देखी हैं। फोन के कैमरे से फोटो खींचकर जांचें।
              </p>
            </div>

            {/* Action 3 */}
            <div className="p-6 rounded-2xl bg-teal-950/40 border-2 border-teal-500/40 space-y-2">
              <div className="text-3xl font-extrabold text-teal-400">3</div>
              <div className="text-lg font-bold text-white leading-snug">
                बारिश के बाद खाद डालें (Post-Rain Urea)
              </div>
              <p className="text-xs text-teal-200/90 leading-relaxed">
                वर्षा खत्म होने के 24 से 36 घंटे बाद नीम-लेपित यूरिया (45 किलो प्रति हेक्टेयर) डालें।
              </p>
            </div>
          </div>
        </div>

        {/* Explainable Why & Scan Photo CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenWhyModal();
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black/60 hover:bg-black/90 border border-emerald-500/40 text-emerald-300 text-sm font-semibold cursor-pointer transition-all shadow"
          >
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <span>यह सलाह क्यों दी गई? (Why This Advice?)</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateToScan();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm cursor-pointer transition-all shadow-xl"
          >
            <Search className="w-5 h-5" />
            <span>फसल की फोटो से रोग जांचें (Scan Crop Doctor)</span>
          </button>
        </div>

        {/* Big Vernacular Voice Consultation Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900/60 to-teal-900/40 border-2 border-emerald-400/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">
              बोलकर पूछें (VOICE-FIRST TALK TO AGRIN)
            </span>
            <h3 className="font-display font-extrabold text-2xl text-white">
              "मेरे खेत में खाद और पानी कब देना चाहिए?"
            </h3>
            <p className="text-xs text-neutral-300 font-sans">
              हिंदी, भोजपुरी, अवधी और 22 भारतीय भाषाओं में तुरंत बातचीत करें।
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playChime(520, 0.3);
              onOpenVoiceAssistant();
            }}
            className="w-16 h-16 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all shrink-0 animate-bounce"
            title="बोलें (Talk)"
          >
            <Mic className="w-8 h-8" />
          </button>
        </div>

        {/* Real-time Local Mandi Price Ticker (Seeded Benchmark) */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              स्थानीय मंडी भाव (Pratapgarh Mandi Live MSP Rates):
            </span>
            <span>27 Sep 2026</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex justify-between">
              <span className="text-white">🌾 शरबती गेंहू (Wheat):</span>
              <span className="text-emerald-400 font-bold">₹2,475 / क्विंटल</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex justify-between">
              <span className="text-white">🌼 पीली सरसों (Mustard):</span>
              <span className="text-emerald-400 font-bold">₹5,650 / क्विंटल</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex justify-between">
              <span className="text-white">🌾 धान पुआल (Stubble):</span>
              <span className="text-cyan-400 font-bold">₹1,950 / टन</span>
            </div>
          </div>
          <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-1">
            <Info className="w-3 h-3 text-neutral-400" />
            <span>Indicative local rate — estimate for planning purposes.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
