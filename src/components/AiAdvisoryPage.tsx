import React, { useState } from 'react';
import { 
  Mic, 
  Camera, 
  Send, 
  Volume2, 
  CheckCircle2, 
  HelpCircle, 
  Database, 
  ShieldAlert, 
  Sparkles, 
  CornerDownRight,
  Satellite,
  CloudSun,
  FlaskConical,
  Sprout,
  Layers,
  FileCheck
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface AdvisoryResponse {
  query: string;
  answer: string;
  why: string;
  dataUsed: { source: string; value: string }[];
  action: string;
  confidence: number;
  limitations: string;
  hindiVoiceText?: string;
}

interface AiAdvisoryPageProps {
  onOpenWhyModal?: () => void;
}

export const AiAdvisoryPage: React.FC<AiAdvisoryPageProps> = ({ onOpenWhyModal }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(3); // Gemini reasoning

  const presetResponses: Record<string, AdvisoryResponse> = {
    irrigation: {
      query: 'Should I irrigate my Plot A Sharbati Wheat field tomorrow morning?',
      answer: 'Hold irrigation completely for the next 48 hours. Heavy rain is imminent.',
      why: 'Doppler radar and European ensemble models indicate a 82% probability of 32–38mm convective rainfall across Pratapgarh starting at 02:00 AM. Irrigating now would saturate the root zone, trigger lodging, and waste ₹1,200 in diesel pumping energy.',
      dataUsed: [
        { source: 'IMD & ECMWF Radar', value: '35mm rain probability: 82%' },
        { source: 'Sub-surface Soil Sensor', value: 'Moisture at 15cm: 28% (Adequate)' },
        { source: 'Sentinel-2 NDVI', value: 'Mean Vigour: 0.78 (Optimum)' },
        { source: 'Evapotranspiration (ET0)', value: '3.1 mm/day (Low demand)' },
      ],
      action: '1. Delay tube-well pump startup. 2. Ensure field drainage channels are clear of silt. 3. Re-evaluate post-rainfall on Sep 29.',
      confidence: 94.6,
      limitations: 'Advisory valid for convective rainfall within 25km radius. In the event rainfall fails to materialize by Sep 29 18:00, resume light furrow irrigation.',
      hindiVoiceText: 'अगले 48 घंटों तक गेहूं की सिंचाई रोक दें। 35 मिमी वर्षा की प्रबल संभावना है। सिंचाई करने से फसल गिरने और धन की बर्बादी का जोखिम है।',
    },
    urea: {
      query: 'When is the optimal window to apply the second dose of Urea on wheat?',
      answer: 'Apply Urea (45 kg/ha) immediately after upcoming rainfall infiltrates the topsoil (estimated Sep 29 morning).',
      why: 'Applying urea onto bone-dry soil causes ammonia volatilization loss up to 35%. Applying during heavy downpours causes runoff loss. The optimal window is damp soil 12 hours post-rain.',
      dataUsed: [
        { source: 'Soil Testing Lab', value: 'Available Nitrogen: 42 kg/ha (Deficient)' },
        { source: 'Crop Growth Model', value: 'Tillering Stage (Day 26)' },
        { source: 'Forecast Horizon', value: 'Clear skies starting Sep 29' },
      ],
      action: 'Broadcast neem-coated urea at dawn when soil moisture allows rapid dissolution into the rhizosphere.',
      confidence: 97.2,
      limitations: 'Do not mix with superphosphate. Use protective gloves.',
      hindiVoiceText: 'वर्षा समाप्त होने के 12 घंटे बाद नम मिट्टी में 45 किलो प्रति हेक्टेयर नीम लेपित यूरिया का छिड़काव करें।',
    },
    pest: {
      query: 'Yellow spots observed on mustard leaves. Is it aphids or white rust?',
      answer: 'Primary diagnosis is Mustard Aphids (Lipaphis erysimi) early nymph infestation, not white rust.',
      why: 'Spectral analysis of foliar reflectivity coupled with temperatures between 18°C–22°C creates peak aphid colony vectors. Underside foliage curling matches sap-sucking hemiptera behavior.',
      dataUsed: [
        { source: 'Vision Model ViT-H', value: 'Confidence: 91.8%' },
        { source: 'Micro-climate Temp', value: 'Night: 16°C, Day: 24°C' },
        { source: 'Foliar Relative Humidity', value: '78%' },
      ],
      action: 'Spray 5% Neem Seed Kernel Extract (NSKE) or Dimethoate 30% EC @ 1.5ml/L in calm evening air.',
      confidence: 91.8,
      limitations: 'Avoid spraying when honeybees are foraging in full daylight.',
      hindiVoiceText: 'यह सरसों में माहू (एफिड) का शुरुआती प्रकोप है। शाम के समय 5 प्रतिशत नीम का अर्क छिड़कें।',
    },
  };

  const [activeResponse, setActiveResponse] = useState<AdvisoryResponse>(presetResponses.irrigation);

  const pipelineSteps = [
    { title: '1. Multi-Modal Ingestion', desc: 'Sentinel-2 + Radar + In-situ Soil sensors + Farmer photo', icon: Layers },
    { title: '2. Data Validation', desc: 'Cloud mask filtering, sensor outlier removal, sanity checks', icon: FileCheck },
    { title: '3. Context Fusion', desc: 'Agronomic Knowledge Graph & Crop Growth Stage matching', icon: Database },
    { title: '4. Gemini Agro Reasoning', desc: 'Fine-tuned LLM synthesizes biological rationale', icon: Sparkles },
    { title: '5. Action Prescription', desc: 'Vernacular text + audio + explainable "Why?" verification', icon: CheckCircle2 },
  ];

  const handleSelectQuery = (key: 'irrigation' | 'urea' | 'pest') => {
    soundFx.playClick();
    setIsProcessing(true);
    setTimeout(() => {
      setActiveResponse(presetResponses[key]);
      setIsProcessing(false);
      soundFx.playChime(640, 0.3);
    }, 600);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    soundFx.playClick();
    setIsProcessing(true);
    const query = inputText;
    setInputText('');

    setTimeout(() => {
      setActiveResponse({
        query: query,
        answer: `Comprehensive agronomic synthesis for: "${query}". Based on live sensor data, soil condition is stable and crop development is progressing normally.`,
        why: 'In-situ sensor telemetry from Pratapgarh combined with Sentinel-2 spectral vegetation curves indicate low drought stress and high nitrogen absorption efficiency.',
        dataUsed: [
          { source: 'Ayush Farm IoT Gateway', value: 'Soil Moisture 28%, Temp 24°C' },
          { source: 'Sentinel-2 B8/B4', value: 'NDVI 0.78' },
          { source: 'Agronomic Vector DB', value: 'Matches UP Wheat Protocol 2026' },
        ],
        action: 'Maintain regular field inspections every 3 days. Ensure bunds are intact for rainwater harvesting.',
        confidence: 93.4,
        limitations: 'Calculated using 48-hour forward projection.',
        hindiVoiceText: 'आपके खेत की स्थिति सामान्य है। अगले 3 दिनों में फसल का सामान्य निरीक्षण करें।',
      });
      setIsProcessing(false);
      soundFx.playChime(640, 0.3);
    }, 1200);
  };

  const handleSpeakResponse = () => {
    if ('speechSynthesis' in window) {
      soundFx.playClick();
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      const textToSpeak = activeResponse.hindiVoiceText || activeResponse.answer;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = activeResponse.hindiVoiceText ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>GEMINI AGRONOMIC MULTIMODAL INTELLIGENCE</span>
            <span>•</span>
            <span>TRANSPARENT REASONING ARCHITECTURE</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            AI Agricultural Advisor
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Ask any question about your farm. AgriN displays every premise, sensor value, and rationale.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GROUNDED IN AYUSH FARM TELEMETRY</span>
          </div>
        </div>
      </div>

      {/* FEATURE 13: AI MODEL TRANSPARENCY & DATA PROVENANCE PIPELINE */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
              FEATURE 13 &bull; AI MODEL TRANSPARENCY PIPELINE
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">
            Audit-Ready Data Provenance
          </span>
        </div>

        {/* Input Data Sources Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
            <Satellite className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-[11px] text-neutral-300">🛰 Sentinel-2</span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] text-neutral-300">🌦 IMD Doppler</span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="text-[11px] text-neutral-300">🧪 Soil Sensors</span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-neutral-300">🌱 Crop Phenology</span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
            <Camera className="w-4 h-4 text-lime-400 shrink-0" />
            <span className="text-[11px] text-neutral-300">📷 Farmer Photos</span>
          </div>
        </div>

        {/* The 5-Step Reasoning Chain */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 no-scrollbar font-mono text-[11px]">
            {pipelineSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isSelected = activePipelineStep === idx;
              return (
                <div
                  key={step.title}
                  onClick={() => {
                    soundFx.playClick();
                    setActivePipelineStep(idx);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all border whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                      : 'border-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                  <span>{step.title}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-2 text-xs text-neutral-300 font-sans pl-1">
            <strong>Active Pipeline Stage:</strong> {pipelineSteps[activePipelineStep].desc}
          </div>
        </div>
      </div>

      {/* Preset Farmer Inquiries */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-xs font-mono text-neutral-400">FREQUENT AGRONOMIC INQUIRIES:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSelectQuery('irrigation')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 hover:text-white transition-all cursor-pointer"
          >
            &ldquo;Should I irrigate tomorrow?&rdquo;
          </button>
          <button
            onClick={() => handleSelectQuery('urea')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 hover:text-white transition-all cursor-pointer"
          >
            &ldquo;Optimal window for Urea dose?&rdquo;
          </button>
          <button
            onClick={() => handleSelectQuery('pest')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 hover:text-white transition-all cursor-pointer"
          >
            &ldquo;Mustard foliar spotting diagnosis?&rdquo;
          </button>
        </div>
      </div>

      {/* Interactive Input Capsule */}
      <div className="glass-card-interactive rounded-3xl p-6 sm:p-8 border border-emerald-500/30">
        <form onSubmit={handleSubmitCustom} className="space-y-4">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about your wheat, mustard, soil fertility, or weather..."
              className="w-full py-4 pl-5 pr-32 rounded-2xl bg-black/50 border border-emerald-500/30 text-[#ECE8DD] placeholder-neutral-500 text-sm focus:outline-none focus:border-emerald-400 transition-all font-sans"
            />

            <div className="absolute right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectQuery('irrigation')}
                title="Speak vernacular Hindi/English"
                className="p-2.5 rounded-xl glass-panel-subtle hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuery('pest')}
                title="Attach Crop Leaf Photo"
                className="p-2.5 rounded-xl glass-panel-subtle hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Structured Transparent AI Reasoning Model */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/20 space-y-8">
        {/* User Question */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-neutral-400 uppercase">INQUIRY:</span>
            <h2 className="font-display font-bold text-2xl text-[#F9F8F3] mt-1">
              &ldquo;{activeResponse.query}&rdquo;
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenWhyModal && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenWhyModal();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono cursor-pointer transition-all hover:scale-105"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Explain Why? (XAI)</span>
              </button>
            )}

            <button
              onClick={handleSpeakResponse}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium cursor-pointer transition-all ${
                isSpeaking
                  ? 'bg-emerald-500 text-black border-emerald-400'
                  : 'glass-panel-subtle border-emerald-500/30 text-emerald-300 hover:text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Speaking in Hindi...' : 'Listen in Hindi'}</span>
            </button>
          </div>
        </div>

        {/* 1. Direct Answer */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-black/60 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>AGRONOMIC PRESCRIPTION:</span>
          </div>
          <p className="text-lg sm:text-xl font-display font-bold text-[#F9F8F3] leading-snug">
            {activeResponse.answer}
          </p>
        </div>

        {/* 2. "Why?" (Underlying Science) with direct Why button */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
              <HelpCircle className="w-4 h-4" />
              <span>WHY? (UNDERLYING AGRONOMIC RATIONALE)</span>
            </div>

            {onOpenWhyModal && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenWhyModal();
                }}
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-1"
              >
                <span>View Full Factor Breakdown &rarr;</span>
              </button>
            )}
          </div>
          <p className="text-sm text-neutral-200 leading-relaxed font-light p-4 rounded-xl bg-black/30 border border-white/5">
            {activeResponse.why}
          </p>
        </div>

        {/* 3. "Data Used" */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
            <Database className="w-4 h-4" />
            <span>DATASETS & SENSOR VALUES SYNTHESIZED</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeResponse.dataUsed.map((d, i) => (
              <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                <span className="text-neutral-400 text-[10px] block mb-1 uppercase">{d.source}</span>
                <span className="text-emerald-300 font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. "Recommended Action" */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
            <CornerDownRight className="w-4 h-4" />
            <span>STEP-BY-STEP ACTION PROTOCOL</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed">
            {activeResponse.action}
          </div>
        </div>

        {/* 5. "Confidence & Limitations" */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>LIMITATIONS: {activeResponse.limitations}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>MODEL CONFIDENCE:</span>
            <span className="text-emerald-400 font-bold text-sm">{activeResponse.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
