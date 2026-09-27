import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Satellite, 
  CloudSun, 
  Stethoscope, 
  FlaskConical, 
  RotateCw, 
  Recycle, 
  Mic, 
  MapPin, 
  Scan, 
  MessageSquare, 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  Volume2
} from 'lucide-react';
import { ThreeCanvas } from './ThreeCanvas';
import { FieldToFutureNarrative } from './FieldToFutureNarrative';
import { soundFx } from '../utils/audio';
import type { NavTab } from './NavBar';

interface OverviewPageProps {
  onNavigateToTab: (tab: NavTab) => void;
  onOpenVoiceAssistant?: () => void;
  onOpenWhyModal?: () => void;
  onOpenImpactModal?: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ 
  onNavigateToTab, 
  onOpenVoiceAssistant,
  onOpenWhyModal,
  onOpenImpactModal
}) => {
  // Mouse position for parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [satelliteBand, setSatelliteBand] = useState<'rgb' | 'ndvi' | 'ndwi'>('ndvi');
  const [regenScore, setRegenScore] = useState(0);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [activeQuickTab, setActiveQuickTab] = useState<'voice' | 'scan' | 'ask'>('voice');
  const [cropDoctorScanProgress, setCropDoctorScanProgress] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Regenerative score count up animation on view
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 2;
      if (start >= 78) {
        setRegenScore(78);
        clearInterval(interval);
      } else {
        setRegenScore(start);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const storySteps = [
    { title: 'SATELLITE', desc: 'Constellation multispectral imagery at 10m spatial resolution', icon: Satellite, zoomLevel: '500 km Orbit' },
    { title: 'WEATHER', desc: 'Hyperlocal Doppler radar and micro-climate forecasting', icon: CloudSun, zoomLevel: '10 km Regional' },
    { title: 'SOIL', desc: 'Sub-surface soil sensor nodes measuring N-P-K, pH & moisture', icon: FlaskConical, zoomLevel: '1 m Depth' },
    { title: 'CROP IMAGE', desc: 'Farmer smartphone photos processed by vision transformers', icon: Stethoscope, zoomLevel: '1 mm Foliar' },
    { title: 'FARMER VOICE', desc: 'Vernacular voice reasoning in 12 Indian regional languages', icon: Mic, zoomLevel: 'Farmer Core' },
    { title: 'AI REASONING', desc: 'Gemini multimodal agricultural intelligence & agronomy engine', icon: Sparkles, zoomLevel: 'Neural Model' },
    { title: 'ACTIONABLE INTEL', desc: 'Precision irrigation, pest prevention and regenerative yield boost', icon: CheckCircle2, zoomLevel: 'Harvest Outcome' },
  ];

  const handleVoiceDemo = () => {
    soundFx.playChime(520, 0.3);
    setVoicePlaying(true);
    
    // Web Speech synthesis demo in Hindi / English
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "अगले 48 घंटों में 35 मिलीमीटर वर्षा की संभावना है। अपनी गेहूं की फसल की सिंचाई टाल दें और वर्षा के बाद यूरिया की संतुलित मात्रा दें।"
      );
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setVoicePlaying(false);
      utterance.onerror = () => setVoicePlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setVoicePlaying(false), 4000);
    }
  };

  const handleScanLeafDemo = () => {
    soundFx.playScanTone();
    setCropDoctorScanProgress(true);
    setTimeout(() => {
      setCropDoctorScanProgress(false);
      soundFx.playChime(660, 0.4);
    }, 2400);
  };

  return (
    <div className="relative min-h-screen bg-[#030B07] text-[#ECE8DD] overflow-hidden">
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-16 px-4 sm:px-8 z-10">
        {/* 3D Earth Globe & Orbiting Satellite Canvas */}
        <ThreeCanvas mode="hero" />

        {/* Ambient atmospheric gradients & noise */}
        <div className="absolute inset-0 pointer-events-none satellite-grid opacity-25" />
        <div className="absolute inset-0 pointer-events-none noise-overlay" />
        <div 
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none transition-transform duration-700 ease-out"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        />
        <div 
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
          style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}
        />

        {/* Top Tagline */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-xs font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AGRI-NEURAL PROTOCOL v4.2</span>
            <span className="text-white/30">•</span>
            <span className="text-neutral-400">ISRO & ESA Sentinel-2 Ground Link</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-neutral-400">
            <span>LAT: 25.9182° N</span>
            <span>LON: 81.9984° E</span>
            <span className="text-emerald-400 font-semibold">PRATAPGARH HUB</span>
          </div>
        </div>

        {/* Center Hero Typography (Brandfarm inspired) */}
        <div className="max-w-7xl mx-auto w-full my-auto text-center sm:text-left py-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Planetary Climate-Tech Platform</span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#F9F8F3] leading-[1.02]">
              AGRICULTURE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300">
                INTELLIGENCE
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-emerald-200/90 font-medium tracking-wide">
              From Satellite to Soil.
            </p>

            <p className="max-w-2xl text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              Synthesizing hyperspectral orbital feeds, hyperlocal Doppler weather, 
              in-situ soil electrochemistry, and vernacular farmer voice into 
              climate-resilient crop prescriptions.
            </p>

            {/* Hero CTA Action Buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onNavigateToTab('dashboard');
                }}
                className="group relative flex items-center gap-3 px-7 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-semibold text-sm tracking-wide shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all cursor-pointer hover:scale-105"
              >
                <span>Launch Farmer Command Center</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  const el = document.getElementById('product-story');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-6 py-4 rounded-full glass-panel hover:border-emerald-500/40 text-[#ECE8DD] hover:text-emerald-300 text-sm font-medium transition-all cursor-pointer"
              >
                <span>Explore Architecture Story</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onNavigateToTab('crop-doctor');
                }}
                className="flex items-center gap-2 px-5 py-4 rounded-full glass-panel-subtle hover:border-emerald-500/30 text-emerald-300 text-sm font-medium transition-all cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>AI Crop Doctor</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Hero Bottom Telemetry Ribbon */}
        <div className="max-w-7xl mx-auto w-full pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-neutral-400 block">SATELLITE CADENCE</span>
            <span className="text-emerald-300 font-semibold">Every 48 Hours (Sentinel-2)</span>
          </div>
          <div>
            <span className="text-neutral-400 block">NDVI PRECISION</span>
            <span className="text-emerald-300 font-semibold">10-Meter Pixel Grid</span>
          </div>
          <div>
            <span className="text-neutral-400 block">REGENERATIVE ACCRUAL</span>
            <span className="text-emerald-300 font-semibold">3.7 Tonnes CO2e/Ha</span>
          </div>
          <div>
            <span className="text-neutral-400 block">VERNACULAR NLP</span>
            <span className="text-emerald-300 font-semibold">12 Indic Languages</span>
          </div>
        </div>
      </section>

      {/* 2. Product Story — "One Farm. Thousands of Signals." */}
      <section id="product-story" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            <span>SPATIAL CONVERGENCE</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-[#F9F8F3]">
            One Farm. Thousands of Signals.
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
            Follow the planetary data stream as it collapses from low Earth orbit directly into an Indian smallholder's palm.
          </p>
        </div>

        {/* Stepper Chain (Space -> Farm journey) */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-12">
          {storySteps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStoryStep === idx;
            return (
              <div
                key={step.title}
                onClick={() => {
                  soundFx.playClick();
                  setActiveStoryStep(idx);
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-900/60 to-[#0A2618] border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105'
                    : 'glass-panel-subtle hover:border-emerald-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-neutral-400">0{idx + 1}</span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : 'text-emerald-500/70'}`} />
                  </div>
                  <h4 className="font-display font-bold text-sm text-[#ECE8DD] mb-1">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-neutral-300/80 leading-snug line-clamp-3">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/5 text-[9px] font-mono text-emerald-400">
                  {step.zoomLevel}
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Focus Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/30 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                Data Stream Stage 0{activeStoryStep + 1}
              </span>
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
                {storySteps[activeStoryStep].title} Layer
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {storySteps[activeStoryStep].desc}. Raw planetary signals are normalized, cloud-masked, 
                and ingested into our localized agronomic vector graph.
              </p>
              
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 font-mono text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-400">SPATIAL RESOLUTION:</span>
                  <span className="text-emerald-400 font-semibold">{storySteps[activeStoryStep].zoomLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">LATENCY TO INFERENCE:</span>
                  <span className="text-emerald-400 font-semibold">&lt; 1.4 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">GROUND VALIDATION:</span>
                  <span className="text-emerald-400 font-semibold">96.8% In-situ Accuracy</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onNavigateToTab('ai-advisory');
                  }}
                  className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer"
                >
                  Consult AI Advisor
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onNavigateToTab('satellite');
                  }}
                  className="px-5 py-2.5 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 text-xs transition-all cursor-pointer"
                >
                  Inspect Satellite Layers
                </button>
                {onOpenWhyModal && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onOpenWhyModal();
                    }}
                    className="px-5 py-2.5 rounded-full glass-panel-subtle hover:border-emerald-400 text-emerald-300 text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Explainable AI ("Why?")
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Visual Canvas of Current Stage */}
            <div className="relative h-64 sm:h-80 rounded-2xl bg-black/50 border border-emerald-500/20 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 satellite-grid opacity-30" />
              
              {activeStoryStep === 0 && (
                <div className="relative text-center space-y-3 p-6">
                  <div className="relative w-24 h-24 mx-auto rounded-full border-2 border-emerald-400/50 flex items-center justify-center animate-spin-slow">
                    <Satellite className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div className="text-xs font-mono text-emerald-300">ORBITAL SWEEP: SENTINEL-2B</div>
                  <div className="text-[11px] text-neutral-400">B2, B3, B4, B8 Multispectral Arrays</div>
                </div>
              )}

              {activeStoryStep === 1 && (
                <div className="relative text-center space-y-3 p-6">
                  <CloudSun className="w-16 h-16 mx-auto text-amber-300 animate-bounce duration-1000" />
                  <div className="text-xs font-mono text-emerald-300">RADAR CELL: 24°C • RAIN 82%</div>
                  <div className="text-[11px] text-neutral-400">Micro-climate Doppler interpolation</div>
                </div>
              )}

              {activeStoryStep === 2 && (
                <div className="relative text-center space-y-3 p-6">
                  <FlaskConical className="w-16 h-16 mx-auto text-lime-400" />
                  <div className="text-xs font-mono text-emerald-300">SOIL STRATA: NPK 42-31-68 • pH 7.8</div>
                  <div className="text-[11px] text-neutral-400">Root zone electro-conductivity telemetry</div>
                </div>
              )}

              {activeStoryStep === 3 && (
                <div className="relative text-center space-y-3 p-6">
                  <Stethoscope className="w-16 h-16 mx-auto text-emerald-400" />
                  <div className="text-xs font-mono text-emerald-300">FOLIAR SCAN: WHEAT LEAF RUST (96.4%)</div>
                  <div className="text-[11px] text-neutral-400">Mobile lens computer vision segmentation</div>
                </div>
              )}

              {activeStoryStep === 4 && (
                <div className="relative text-center space-y-3 p-6">
                  <Mic className="w-16 h-16 mx-auto text-emerald-400 animate-pulse" />
                  <div className="text-xs font-mono text-emerald-300">VOICE: &ldquo;मेरी गेहूं की फसल में क्या स्प्रे करूं?&rdquo;</div>
                  <div className="text-[11px] text-neutral-400">Acoustic waveform to agronomy embedding</div>
                </div>
              )}

              {activeStoryStep === 5 && (
                <div className="relative text-center space-y-3 p-6">
                  <Sparkles className="w-16 h-16 mx-auto text-teal-300" />
                  <div className="text-xs font-mono text-emerald-300">GEMINI AGRONOMIC MULTIMODAL MODEL</div>
                  <div className="text-[11px] text-neutral-400">Autonomous reasoning with scientific citations</div>
                </div>
              )}

              {activeStoryStep === 6 && (
                <div className="relative text-center space-y-3 p-6">
                  <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-400" />
                  <div className="text-xs font-mono text-emerald-300">PRESCRIPTION: HOLD IRRIGATION 48 HOURS</div>
                  <div className="text-[11px] text-neutral-400">Save 12,000L water + prevent root rot</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. "Meet Your Farm's Intelligence" Quick Interactive Card */}
      <section className="relative py-16 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        <div className="glass-card-interactive rounded-3xl p-8 sm:p-12 border border-emerald-500/30">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              Instant Interaction
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3] mt-1">
              Meet Your Farm&apos;s Intelligence
            </h2>
            <p className="text-sm text-neutral-300 font-light mt-2">
              Speak, scan a crop leaf, or type an inquiry. AgriN instantly synthesizes live satellite, weather, and soil context.
            </p>
          </div>

          {/* Quick Interaction Tabs */}
          <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveQuickTab('voice');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all ${
                activeQuickTab === 'voice'
                  ? 'bg-emerald-500 text-black font-semibold shadow-lg'
                  : 'glass-panel-subtle text-neutral-300 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Vernacular Voice</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveQuickTab('scan');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all ${
                activeQuickTab === 'scan'
                  ? 'bg-emerald-500 text-black font-semibold shadow-lg'
                  : 'glass-panel-subtle text-neutral-300 hover:text-white'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Scan Crop Leaf</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveQuickTab('ask');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all ${
                activeQuickTab === 'ask'
                  ? 'bg-emerald-500 text-black font-semibold shadow-lg'
                  : 'glass-panel-subtle text-neutral-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Farm Inquiry</span>
            </button>
          </div>

          {/* Tab Content 1: Voice */}
          {activeQuickTab === 'voice' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-[11px] font-mono text-neutral-400 mb-1">FARMER SAYS (HINDI):</div>
                  <p className="text-base text-emerald-200 font-medium">
                    &ldquo;मेरी गेहूं की फसल के लिए अगले तीन दिन क्या करना चाहिए?&rdquo;
                  </p>
                  <p className="text-xs text-neutral-400 italic mt-1">
                    (What should I do for my wheat crop in the next three days?)
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleVoiceDemo}
                    disabled={voicePlaying}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{voicePlaying ? 'AgriN Speaking...' : 'Listen to AgriN Response'}</span>
                  </button>
                  <button
                    onClick={() => onNavigateToTab('ai-advisory')}
                    className="px-4 py-3 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 text-xs font-medium cursor-pointer"
                  >
                    Open Full Advisor
                  </button>
                </div>
              </div>

              {/* Animated Waveform Display */}
              <div className="p-6 rounded-2xl bg-black/50 border border-emerald-500/20 flex flex-col items-center justify-center min-h-[160px]">
                <div className="flex items-center gap-1.5 h-12 mb-3">
                  {[12, 28, 16, 36, 20, 44, 30, 18, 48, 22, 14, 38, 26, 16].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={voicePlaying ? { height: [6, h, 6] } : { height: 8 }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
                      className={`w-1.5 rounded-full ${voicePlaying ? 'bg-emerald-400' : 'bg-emerald-500/30'}`}
                      style={{ height: voicePlaying ? `${h}px` : '8px' }}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-emerald-300">
                  {voicePlaying ? 'Synthesizing Multilingual Audio Response' : 'Click "Listen" to test voice synthesis'}
                </span>
              </div>
            </div>
          )}

          {/* Tab Content 2: Scan */}
          {activeQuickTab === 'scan' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Real-time segmentation detects foliar fungal blight, yellow rust, and nutrient burn. 
                  Get immediate organic and conventional dosage remedies.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleScanLeafDemo}
                    disabled={cropDoctorScanProgress}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer"
                  >
                    <Scan className="w-4 h-4" />
                    <span>{cropDoctorScanProgress ? 'Scanning Foliar Matrix...' : 'Simulate Leaf Scan'}</span>
                  </button>
                  <button
                    onClick={() => onNavigateToTab('crop-doctor')}
                    className="px-4 py-3 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 text-xs font-medium cursor-pointer"
                  >
                    Launch Crop Doctor
                  </button>
                </div>
              </div>

              {/* Leaf Scanner Graphic */}
              <div className="relative h-44 rounded-2xl bg-gradient-to-b from-forest to-black border border-emerald-500/30 overflow-hidden flex items-center justify-center">
                {cropDoctorScanProgress && <div className="scanner-line" />}
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="text-left font-mono text-xs">
                    <div className="text-emerald-300 font-bold">WHEAT LEAF BLIGHT DETECTED</div>
                    <div className="text-neutral-400">Confidence: 96.4% • Severity: Mild</div>
                    <div className="text-amber-400 mt-1">Recommended: Neem oil 5ml/L spray</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Ask */}
          {activeQuickTab === 'ask' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
                <span className="text-sm text-emerald-200">
                  &ldquo;Should I irrigate my Plot B Mustard field tomorrow morning?&rdquo;
                </span>
                <button
                  onClick={() => onNavigateToTab('ai-advisory')}
                  className="px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold text-xs cursor-pointer hover:bg-emerald-400 whitespace-nowrap"
                >
                  Analyze with Gemini
                </button>
              </div>
              <p className="text-xs text-neutral-400">
                AgriN checks 38mm rainfall probability + soil sensor depth data to formulate an agronomic answer.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Horizontal Showcase Features (01 to 08) */}
      <section className="relative py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 space-y-24">
        {/* Feature 01: Satellite Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              01 — Satellite Intelligence
            </span>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
              Orbital Multispectral Analytics
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Automated Sentinel-2 & Landsat pipelines generate Normalized Difference Vegetation Index (NDVI) 
              and Normalized Difference Water Index (NDWI) maps every 48 hours to detect crop stress 14 days before visible symptoms appear.
            </p>

            <div className="flex gap-2 pt-2">
              {(['rgb', 'ndvi', 'ndwi'] as const).map((band) => (
                <button
                  key={band}
                  onClick={() => {
                    soundFx.playClick();
                    setSatelliteBand(band);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase cursor-pointer transition-all ${
                    satelliteBand === band
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'glass-panel-subtle text-neutral-400 hover:text-white'
                  }`}
                >
                  {band.toUpperCase()} View
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigateToTab('satellite')}
                className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <span>Launch Interactive Satellite Explorer & Timeline</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Satellite Card */}
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 text-xs font-mono text-neutral-400">
              <span>BAND: {satelliteBand.toUpperCase()} (10m Resolution)</span>
              <span className="text-emerald-400">HEALTH: 0.78 (Optimum)</span>
            </div>
            
            {/* Visual simulation of NDVI raster */}
            <div className="relative h-60 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
              <div 
                className={`absolute inset-0 transition-all duration-500 ${
                  satelliteBand === 'ndvi'
                    ? 'bg-gradient-to-br from-emerald-950 via-emerald-600 to-lime-500 opacity-90'
                    : satelliteBand === 'ndwi'
                    ? 'bg-gradient-to-br from-cyan-950 via-blue-700 to-teal-400 opacity-90'
                    : 'bg-gradient-to-br from-[#1b2b1a] via-[#3d5a32] to-[#608040] opacity-90'
                }`}
              />
              {/* Field plot overlays */}
              <div className="absolute inset-4 border border-white/30 rounded-xl pointer-events-none flex flex-col justify-between p-3 font-mono text-[10px]">
                <div className="flex justify-between text-white">
                  <span>PLOT A (Wheat): NDVI 0.82</span>
                  <span>PLOT B (Mustard): NDVI 0.69</span>
                </div>
                <div className="text-white/80">PLOT C (Fallow): NDVI 0.31</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 02: Weather Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 glass-panel rounded-3xl p-6 border border-emerald-500/20">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 block">TEMP</span>
                <span className="text-xl font-bold text-[#ECE8DD]">24°C</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 block">RAIN CHANCE</span>
                <span className="text-xl font-bold text-cyan-400">82%</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 block">WIND SPEED</span>
                <span className="text-xl font-bold text-teal-300">14 km/h</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
              <CloudSun className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-cyan-200 block mb-1">AI AGRICULTURAL INTERPRETATION</span>
                <p className="text-neutral-300/90 leading-relaxed">
                  Heavy thunderstorm scheduled in 14 hours. Delay foliar pesticide spray and hold canal irrigation to avoid waterlogging in low-lying furrow zones.
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-4">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              02 — Weather Intelligence
            </span>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
              Micro-Climate Agronomic Interpretation
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              We translate raw meteorology into actionable agricultural advice. Instead of telling you it might rain, AgriN tells you exactly whether to spray, seed, or hold irrigation.
            </p>
            <button
              onClick={() => onNavigateToTab('weather')}
              className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              <span>View 7-Day Hyperlocal Agri-Weather Radar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature 04 & 05: Soil & Regenerative Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Soil Intelligence Card */}
          <div className="glass-panel rounded-3xl p-8 border border-emerald-500/20 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                04 — Soil Intelligence
              </span>
              <FlaskConical className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-display font-bold text-2xl text-[#F9F8F3]">
              Sub-Surface Soil Chemistry
            </h4>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral-300">Nitrogen (N)</span>
                  <span className="text-emerald-400">42 kg/ha (Deficient)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="w-[42%] h-full bg-amber-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral-300">Phosphorus (P)</span>
                  <span className="text-emerald-400">31 kg/ha (Adequate)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="w-[65%] h-full bg-emerald-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral-300">Potassium (K)</span>
                  <span className="text-emerald-400">68 kg/ha (High)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="w-[85%] h-full bg-emerald-400" />
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-white/5 text-neutral-300">
                <span>Soil pH: <strong className="text-emerald-300">7.8 (Slightly Alkaline)</strong></span>
                <span>Organic Carbon: <strong className="text-emerald-300">0.58%</strong></span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('soil')}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Soil Chemistry Lab</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Regenerative Intelligence Card */}
          <div className="glass-panel rounded-3xl p-8 border border-emerald-500/20 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                05 — Regenerative Intelligence
              </span>
              <RotateCw className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-display font-bold text-2xl text-[#F9F8F3]">
              Don&apos;t Just Grow More. Grow Better.
            </h4>
            
            {/* Animated Circular Score */}
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10B981"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * regenScore) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  <span className="text-2xl font-extrabold text-[#F9F8F3]">{regenScore}</span>
                  <span className="text-[9px] text-neutral-400">/100</span>
                </div>
              </div>

              <div className="text-xs text-neutral-300 space-y-1">
                <span className="font-semibold text-emerald-300 block">Regenerative Practice Score</span>
                <p className="text-neutral-400 leading-snug">
                  Evaluated across cover cropping, zero-till stubble retention, water retention, and microbial biodiversity index.
                </p>
                <div className="text-emerald-400 font-mono text-[11px] font-bold">
                  + ₹14,200 Carbon Credit Value
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('regenerative')}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Regenerative Scorecard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Feature 06: Crop Residue Intelligence (AgriCycle) */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-emerald-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                06 — Crop Residue Intelligence
              </span>
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
                Turn Residue Into a Resource
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Eradicate toxic stubble burning across Northern India. 
                AgriCycle connects farmers with nearby biochar producers, 
                biomass power plants, and compost aggregators with automated logistics dispatch.
              </p>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400">SAMPLE CROP:</span>
                  <span className="text-emerald-300">Paddy Rice Straw (2.5 tonnes)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">ESTIMATED REVENUE:</span>
                  <span className="text-emerald-400 font-bold">₹4,850 Payout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">CO2 EMISSIONS AVERTED:</span>
                  <span className="text-teal-300">3.75 Tonnes CO2e</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab('agricycle')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer"
              >
                <Recycle className="w-4 h-4" />
                <span>Open AgriCycle Marketplace</span>
              </button>
            </div>

            {/* Logistics route visual */}
            <div className="p-6 rounded-2xl bg-black/50 border border-emerald-500/20 font-mono text-xs space-y-4">
              <div className="text-emerald-400 font-bold">NEARBY UTILIZATION NETWORK</div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#ECE8DD]">Awadh Biochar Cooperative</div>
                    <div className="text-[10px] text-neutral-400">Direct soil amendment converter</div>
                  </div>
                  <span className="text-emerald-400 font-bold">4.2 km</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#ECE8DD]">Pratapgarh Biomass Energy Ltd</div>
                    <div className="text-[10px] text-neutral-400">Pelletized boiler fuel</div>
                  </div>
                  <span className="text-emerald-400 font-bold">11.8 km</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#ECE8DD]">Kisan Oyster Mushroom Farm</div>
                    <div className="text-[10px] text-neutral-400">Straw substrate buyer</div>
                  </div>
                  <span className="text-emerald-400 font-bold">8.5 km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 07: Voice AI ("Talk to your farm") */}
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-[#05130D] via-[#0A2618] to-black border border-emerald-500/40 text-center max-w-4xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center">
            <Mic className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
            07 — Vernacular Voice AI
          </span>
          <h3 className="font-display font-extrabold text-4xl sm:text-5xl text-[#F9F8F3]">
            Talk to Your Farm.
          </h3>
          <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Smallholder farmers don&apos;t navigate complex menus. They speak naturally in Hindi, Punjabi, Marathi, Telugu, or Bengali. 
            AgriN grounds vernacular speech directly against live satellite telemetry.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            {onOpenVoiceAssistant && (
              <button
                onClick={() => {
                  soundFx.playChime(520, 0.3);
                  onOpenVoiceAssistant();
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-300 text-black font-extrabold text-xs transition-all cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105"
              >
                <Mic className="w-4 h-4 fill-current text-black" />
                <span>Launch AgriVani Voice AI (22 Indian Languages)</span>
              </button>
            )}
            <button
              onClick={handleVoiceDemo}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full glass-panel hover:border-emerald-500/40 text-emerald-300 text-xs font-semibold cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Simulate Hindi Voice Demo</span>
            </button>
            <button
              onClick={() => onNavigateToTab('ai-advisory')}
              className="px-6 py-3.5 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-neutral-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Open Multimodal Gemini Advisory
            </button>
          </div>
        </div>

        {/* Feature 08: India Intelligence & National Scale */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-emerald-500/30 text-center space-y-6">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
            08 — National Scale Aggregation
          </span>
          <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            From One Farm to 140 Million Farmers
          </h3>
          <p className="text-neutral-300 text-sm max-w-2xl mx-auto leading-relaxed font-light">
            FARM &rarr; VILLAGE &rarr; BLOCK &rarr; DISTRICT &rarr; STATE &rarr; INDIA. 
            Government agriculture officers monitor drought vectors, pest outbreak trajectories, and crop yield security in real time.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
              <span className="text-neutral-400 block mb-1">CROP RISK ZONES</span>
              <span className="text-lg font-bold text-red-400">14 Districts</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
              <span className="text-neutral-400 block mb-1">WATER STRESS</span>
              <span className="text-lg font-bold text-amber-400">Moderate</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
              <span className="text-neutral-400 block mb-1">MONITORED HA</span>
              <span className="text-lg font-bold text-emerald-400">18.4M Ha</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
              <span className="text-neutral-400 block mb-1">BRICS LINK</span>
              <span className="text-lg font-bold text-cyan-400">Federated</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => onNavigateToTab('india-command')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs cursor-pointer shadow-lg"
            >
              <MapPin className="w-4 h-4" />
              <span>Explore India National Command Center</span>
            </button>
            <button
              onClick={() => onNavigateToTab('brics')}
              className="px-6 py-3.5 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 text-xs font-semibold cursor-pointer"
            >
              View BRICS Interoperability Hub
            </button>
          </div>
        </div>

        {/* Feature 01 Spotlight: AI Farm Digital Twin */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-emerald-950/60 via-[#0A2618] to-black border-2 border-emerald-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold">SIGNATURE FEATURE &bull; 2.5D AI FARM DIGITAL TWIN</span>
            </div>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
              Simulate What-If Agricultural Scenarios
            </h3>
            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              Experience the virtual 2.5D twin of your farm. Simulate: &ldquo;What if rainfall increases by 30%?&rdquo; or &ldquo;What if irrigation is cut by 20%?&rdquo;. The field visually shifts in real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigateToTab('digital-twin')}
              className="flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-300 text-black font-extrabold text-xs transition-all cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 fill-current text-black" />
              <span>Launch 2.5D Digital Twin</span>
            </button>

            {onOpenImpactModal && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenImpactModal();
                }}
                className="px-5 py-4 rounded-full glass-panel hover:border-emerald-500/40 text-emerald-300 text-xs font-mono cursor-pointer transition-all whitespace-nowrap"
              >
                View Impact Metrics
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Feature 18: The "Field to Future" Animation / Narrative (Climax) */}
      <FieldToFutureNarrative />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-4 sm:px-8 text-xs text-neutral-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black text-xs">
              A
            </div>
            <span className="text-white font-bold font-sans">AgriN AI</span>
            <span>— Planetary Agriculture Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <span>ISRO & ESA Spectral Feed</span>
            <span>Gemini Multimodal AI</span>
            <span>Indian Agronomy Cloud</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
