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
  Droplet,
  Zap,
  Eye,
  AlertTriangle
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
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
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
        // Fallback handled
      }
    }
    loadData();
  }, []);

  const rainProb = weather?.rain_probability ?? 82;
  const rainMm = weather?.rainfall_mm ?? 35.0;
  const temp = weather?.temperature_c ?? 28.4;
  const compositeScore = risk?.composite_risk_score ?? 58;

  // Language Dictionary for Farmer Mode
  const t = {
    hi: {
      modeActive: '🧑‍🌾 किसान सरल मोड (Farmer Simple Mode)',
      switchToExpert: 'विशेषज्ञ मोड में बदलें (Expert Mode)',
      farmLocation: 'प्रतापगढ़, उत्तर प्रदेश • 14.2 हेक्टेयर',
      myFarm: '🌾 आपका खेत',
      cropHealthGood: '🌱 फसल की हालत: अच्छी',
      cropHealthAlert: '⚠️ फसल की हालत: तनाव में',
      riskModerate: '⚠️ थोड़ा ध्यान देने की जरूरत है',
      riskLow: '🟢 सब कुछ सुरक्षित है',
      riskHigh: '🚨 तुरंत ध्यान दें',
      todayActionsTitle: "आज के जरूरी कार्य (Today's Actions)",
      listenBtn: '🔊 सुनें (Listen)',
      listening: 'बोल रहा है...',
      whyBtn: 'यह सलाह क्यों दी गई? (WHY?)',
      scanBtn: 'फसल की फोटो से बीमारी जांचें',
      voiceTitle: 'बोलकर पूछें (Voice Assistant)',
      voiceSample: '“मेरे खेत में आज पानी देना चाहिए?”',
      voiceSub: 'हिंदी और अपनी स्थानीय भाषा में तुरंत पूछें।',
      action1Title: 'पानी कब दें (When to Irrigate)',
      action1Text: rainProb > 60 
        ? `आज शाम को ${rainProb}% बारिश (${rainMm}mm) का अनुमान है। अभी पानी मत दीजिए, बारिश के बाद देखें।` 
        : 'मौसम अनुकूल है। सामान्य हल्की सिंचाई कर सकते हैं।',
      action2Title: 'खाद कब दें (When to Apply Fertilizer)',
      action2Text: 'बारिश खत्म होने के 24 से 36 घंटे बाद नीम-लेपित यूरिया (45 किलो प्रति हेक्टेयर) डालें।',
      action3Title: 'क्या जांचें (What to Inspect)',
      action3Text: 'निचले खेत में पीली पत्तियां और पानी का निकास जांचें। यदि पत्ती पर पीलापन दिखे तो फोटो खींचें।',
      mandiRates: 'स्थानीय मंडी भाव (Pratapgarh Mandi MSP)',
      wheat: 'गेंहू (Sharbati)',
      mustard: 'सरसों (Mustard)',
      stubble: 'धान पराली (Residue)',
      speechText: `नमस्ते किसान भाई। फसल की हालत अच्छी है, लेकिन आज शाम को बारिश का अनुमान है। इसलिए आज पानी मत दीजिए। बारिश के बाद खाद डालें, और खेत की नालियां साफ रखें।`
    },
    en: {
      modeActive: '🧑‍🌾 Farmer Simple Mode',
      switchToExpert: 'Switch to Expert Mode',
      farmLocation: 'Pratapgarh, Uttar Pradesh • 14.2 Hectares',
      myFarm: '🌾 Your Farm',
      cropHealthGood: '🌱 Crop Condition: Good',
      cropHealthAlert: '⚠️ Crop Condition: Under Stress',
      riskModerate: '⚠️ Caution Advised',
      riskLow: '🟢 All Parameters Safe',
      riskHigh: '🚨 Immediate Action Required',
      todayActionsTitle: "Today's Actions",
      listenBtn: '🔊 Listen',
      listening: 'Speaking...',
      whyBtn: 'Why this recommendation? (WHY?)',
      scanBtn: 'Scan Leaf Photo for Disease',
      voiceTitle: 'Ask by Voice',
      voiceSample: '"Should I irrigate my field today?"',
      voiceSub: 'Speak in Hindi, English, or your local language.',
      action1Title: 'When to Irrigate',
      action1Text: rainProb > 60 
        ? `Heavy rainfall forecast (${rainProb}% chance, ${rainMm}mm). Hold irrigation today; reassess post-rain.` 
        : 'Weather is clear. Continue scheduled light irrigation.',
      action2Title: 'When to Apply Fertilizer',
      action2Text: 'Apply Neem Coated Urea (45 kg/ha) 24 to 36 hours after rainfall ceases.',
      action3Title: 'What to Inspect',
      action3Text: 'Inspect lower plot furrows for standing water and check flag leaves for yellow stripe rust.',
      mandiRates: 'Local Mandi Rates (Pratapgarh)',
      wheat: 'Wheat (Sharbati)',
      mustard: 'Mustard',
      stubble: 'Paddy Residue',
      speechText: `Hello farmer friend. Your crop condition is good, but heavy rain is expected this evening. Do not irrigate today. Apply urea after rainfall passes, and ensure drainage channels are open.`
    }
  }[lang];

  const handleListenActions = () => {
    soundFx.playChime(520, 0.25);
    setIsPlayingAudio(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(t.speechText);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.92;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-20 space-y-6 text-[#ECE8DD]">
      {/* Top Accessibility & Language Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 font-sans">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-emerald-300">
            {t.modeActive}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 font-mono text-xs">
            <button
              onClick={() => {
                soundFx.playClick();
                setLang('hi');
              }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                lang === 'hi' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setLang('en');
              }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                lang === 'en' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onSwitchToExpert();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-[#ECE8DD] border border-white/20 cursor-pointer transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.switchToExpert}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Big Farmer Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border-2 border-emerald-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-6">
        {/* Farm Name & Friendly Status Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{t.farmLocation}</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F9F8F3]">
              {t.myFarm}
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            {/* Friendly Non-technical Status Pills */}
            <div className="flex items-center gap-3 bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-400/50">
              <span className="text-xl">🌱</span>
              <div>
                <div className="text-base sm:text-lg font-extrabold text-emerald-300 font-sans">
                  {t.cropHealthGood}
                </div>
                <div className="text-xs text-neutral-300">
                  {temp}°C • {weather?.condition || 'Rain Alert'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-amber-950/50 p-3 rounded-2xl border border-amber-500/40">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs sm:text-sm font-bold text-amber-300 font-sans">
                {compositeScore > 65 ? t.riskHigh : compositeScore > 40 ? t.riskModerate : t.riskLow}
              </div>
            </div>
          </div>
        </div>

        {/* Today's 3 Key Actions: पानी कब दें, खाद कब दें, क्या जांचें */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-amber-400" />
              <span>{t.todayActionsTitle}</span>
            </h2>
            <button
              onClick={handleListenActions}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs cursor-pointer transition-all shadow-lg ${
                isPlayingAudio ? 'animate-pulse' : ''
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? t.listening : t.listenBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
            {/* Action 1: पानी कब दें */}
            <div className="p-5 rounded-2xl bg-amber-950/40 border-2 border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center font-extrabold text-amber-400">1</div>
                <Droplet className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-base font-bold text-white leading-snug">
                {t.action1Title}
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed font-light">
                {t.action1Text}
              </p>
            </div>

            {/* Action 2: खाद कब दें */}
            <div className="p-5 rounded-2xl bg-teal-950/40 border-2 border-teal-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center font-extrabold text-teal-400">2</div>
                <Zap className="w-5 h-5 text-teal-400" />
              </div>
              <div className="text-base font-bold text-white leading-snug">
                {t.action2Title}
              </div>
              <p className="text-xs text-teal-200/90 leading-relaxed font-light">
                {t.action2Text}
              </p>
            </div>

            {/* Action 3: क्या जांचें */}
            <div className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center font-extrabold text-emerald-400">3</div>
                <Eye className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-base font-bold text-white leading-snug">
                {t.action3Title}
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed font-light">
                {t.action3Text}
              </p>
            </div>
          </div>
        </div>

        {/* Explainable WHY Button & Scan Photo CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenWhyModal();
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black/60 hover:bg-black/90 border border-emerald-500/40 text-emerald-300 text-sm font-semibold cursor-pointer transition-all shadow"
          >
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <span>{t.whyBtn}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateToScan();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm cursor-pointer transition-all shadow-xl"
          >
            <Search className="w-5 h-5" />
            <span>{t.scanBtn}</span>
          </button>
        </div>

        {/* Voice Consultation Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/60 to-teal-900/40 border-2 border-emerald-400/50 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
              {t.voiceTitle}
            </span>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
              {t.voiceSample}
            </h3>
            <p className="text-xs text-neutral-300 font-sans">
              {t.voiceSub}
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playChime(520, 0.3);
              onOpenVoiceAssistant();
            }}
            className="w-14 h-14 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all shrink-0 animate-bounce"
            title="Talk"
          >
            <Mic className="w-7 h-7" />
          </button>
        </div>

        {/* Indicative Mandi Rates */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <TrendingUp className="w-4 h-4" />
              {t.mandiRates}:
            </span>
            <span>27 Sep 2026</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex justify-between">
              <span className="text-white">🌾 {t.wheat}:</span>
              <span className="text-emerald-400 font-bold">₹2,475 / Qtl</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex justify-between">
              <span className="text-white">🌼 {t.mustard}:</span>
              <span className="text-emerald-400 font-bold">₹5,650 / Qtl</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex justify-between">
              <span className="text-white">🌾 {t.stubble}:</span>
              <span className="text-cyan-400 font-bold">₹1,950 / Tonne</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
