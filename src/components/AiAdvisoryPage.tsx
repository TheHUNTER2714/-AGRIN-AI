import React, { useState } from 'react';
import { 
  Send, 
  Volume2, 
  CheckCircle2, 
  HelpCircle, 
  Database, 
  ShieldAlert, 
  Sparkles, 
  CornerDownRight,
  Layers,
  FileCheck,
  RefreshCw,
  Info
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { fetchAgroAdvisory, type AdvisoryResponse } from '../services/api';

interface AiAdvisoryPageProps {
  onOpenWhyModal?: () => void;
}

export const AiAdvisoryPage: React.FC<AiAdvisoryPageProps> = ({ onOpenWhyModal }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(3); // Gemini reasoning

  const [currentResponse, setCurrentResponse] = useState<AdvisoryResponse>({
    advice: 'Hold irrigation completely for the next 48 hours. Convective rainfall is imminent.',
    reasoning: 'Open-Meteo Doppler radar and IMD grid models indicate an 82% probability of 32–38mm convective rainfall across Pratapgarh starting within 14 hours. Current soil moisture at 15cm is 28% (adequate) and Sentinel-2 NDVI is steady at 0.78. Irrigating now would saturate the root zone, trigger crop lodging, and waste ₹1,200 in diesel pumping energy.',
    confidence: 0.95,
    action_items: [
      '1. Delay tube-well / diesel pump startup for 48 hours.',
      '2. Ensure field perimeter drainage channels are clear of silt.',
      '3. Re-evaluate topsoil moisture post-rainfall on Sep 29 before any top-dressing.'
    ],
    warnings: [
      'Heavy convective wind gusts up to 28 km/h may accompany the 35mm precipitation event.'
    ],
    data_sources: [
      'Sentinel-2 MSI MultiSpectral Telemetry (Pass 26 Sep 2026)',
      'Open-Meteo Doppler Radar Grid Model',
      'ICAR In-situ Soil Moisture Sensor (28% vol)',
      'Google Gemini Agro Reasoning'
    ],
    timestamp: '27 Sep 2026, 14:30 IST',
    mode: 'calibrated_model',
    disclaimer: 'AI-generated preliminary advisory — field/agronomist confirmation recommended.'
  });

  const [querySourceLabel, setQuerySourceLabel] = useState<string>('Live Intelligence Mode');

  const exampleAdvisories = [
    {
      id: 'irrigation',
      label: 'Irrigation Timing',
      question: 'Should I irrigate my Plot A Sharbati Wheat field tomorrow morning?'
    },
    {
      id: 'urea',
      label: 'Urea Fertigation',
      question: 'When is the optimal window to apply the second split dose of Urea on wheat?'
    },
    {
      id: 'pest',
      label: 'Pest Identification',
      question: 'Yellowing detected along leaf edges in Plot B mustard. How to treat?'
    }
  ];

  const handleConsultAdvisor = async (queryText: string, isExample = false) => {
    if (!queryText.trim()) return;

    soundFx.playScanTone();
    setIsProcessing(true);
    setActivePipelineStep(1);
    setQuerySourceLabel(isExample ? 'Example Advisory (Demo Benchmark)' : 'Live Gemini Inference');

    // Simulate animated pipeline progression
    const stepInterval = setInterval(() => {
      setActivePipelineStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 400);

    try {
      const res = await fetchAgroAdvisory({
        question: queryText,
        crop: 'Sharbati Wheat (Triticum aestivum)',
        growth_stage: 'Vegetative Tillering',
        soil: { ph: 7.4, nitrogen: 185, potassium: 340, moisture: 28 },
        weather: { temperature: 28.4, rain_prob: 82, rain_mm: 35.0 },
        satellite: { ndvi: 0.78, ndwi: 0.32 }
      });

      clearInterval(stepInterval);
      setActivePipelineStep(4);
      setCurrentResponse(res);
      soundFx.playChime(640, 0.35);
    } catch {
      clearInterval(stepInterval);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpeak = () => {
    soundFx.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(currentResponse.advice);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>GEMINI AGRO-INTELLIGENCE REASONING ENGINE</span>
            <span>•</span>
            <span className="text-zinc-400">CONTEXT FUSION</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            AI Agro-Advisor
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Synthesizes farm telemetry, Doppler radar forecasts, and ICAR soil chemistry into explainable farmer guidance.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-neutral-400 block text-[10px]">REASONING CORE</span>
            <span className="text-emerald-300 font-bold">Gemini 2.5 Flash</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-neutral-400 block text-[10px]">CONFIDENCE</span>
            <span className="text-lime-300 font-bold">
              {(currentResponse.confidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Feature 13: End-to-End AI Model Transparency Pipeline */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            FEATURE 13 • 5-STAGE AI MODEL TRANSPARENCY & DATA PROVENANCE
          </span>
          <span className="text-xs font-mono text-neutral-400">Verifiable Reasoning</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { step: '1. Ingestion', desc: 'Sentinel-2 + Weather + Soil', icon: Layers },
            { step: '2. Validation', desc: 'Cloud mask & range audit', icon: FileCheck },
            { step: '3. Context Fusion', desc: 'Agronomic Knowledge Graph', icon: Database },
            { step: '4. Gemini Reasoning', desc: 'Biological logic synthesis', icon: Sparkles },
            { step: '5. Prescription', desc: 'Actionable farmer protocol', icon: CheckCircle2 }
          ].map((p, idx) => {
            const Icon = p.icon;
            const isActive = activePipelineStep >= idx;
            return (
              <div 
                key={idx}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activePipelineStep === idx
                    ? 'bg-emerald-950/70 border-emerald-400 shadow-md'
                    : isActive
                    ? 'bg-black/40 border-emerald-500/30'
                    : 'bg-black/20 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-neutral-400">0{idx + 1}</span>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                </div>
                <div className="text-xs font-bold text-white mb-0.5">{p.step}</div>
                <div className="text-[10px] text-neutral-400">{p.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Query Bar and Example Benchmarks */}
      <div className="space-y-3">
        {/* Interactive Query Input */}
        <div className="glass-panel p-2.5 rounded-3xl border border-emerald-500/30 flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConsultAdvisor(inputText)}
            placeholder="Ask AgriN (e.g. 'Should I irrigate Plot A tomorrow morning?')"
            className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-neutral-500 outline-none"
          />
          <button
            onClick={() => handleConsultAdvisor(inputText)}
            disabled={isProcessing || !inputText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Thinking...' : 'Consult Advisor'}</span>
          </button>
        </div>

        {/* Example Advisories (Clearly Labeled as Demo Benchmarks) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-400 font-mono text-[11px] flex items-center gap-1">
            <Info className="w-3 h-3 text-emerald-400" />
            EXAMPLE ADVISORY (DEMO BENCHMARK):
          </span>
          {exampleAdvisories.map((ex) => (
            <button
              key={ex.id}
              onClick={() => {
                setInputText(ex.question);
                handleConsultAdvisor(ex.question, true);
              }}
              className="px-3 py-1 rounded-full glass-panel-subtle hover:border-emerald-400 text-neutral-300 text-xs transition-all cursor-pointer"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Advisory Result Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                RECOMMENDED ACTION
              </span>
              <span className="text-[10px] font-mono bg-black/50 text-neutral-400 px-2.5 py-0.5 rounded-full border border-white/10">
                {querySourceLabel}
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white mt-1">
              {currentResponse.advice}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-2 px-4 py-2 rounded-full glass-panel-subtle hover:border-emerald-400 text-emerald-300 text-xs font-semibold cursor-pointer transition-all ${
                isSpeaking ? 'bg-emerald-500/20 border-emerald-400 animate-pulse' : ''
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Speaking...' : 'Listen Audio'}</span>
            </button>

            {onOpenWhyModal && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenWhyModal();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs cursor-pointer transition-all shadow-md"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Explain Why?</span>
              </button>
            )}
          </div>
        </div>

        {/* Explainable AI Reasoning */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
          <div className="font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
            <CornerDownRight className="w-4 h-4 text-emerald-400" />
            AI EXPLAINABLE SCIENTIFIC REASONING:
          </div>
          <p className="text-neutral-200 leading-relaxed font-light">
            {currentResponse.reasoning}
          </p>
        </div>

        {/* Action Items List */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-neutral-400 block">STEP-BY-STEP ACTION PROTOCOL:</span>
          <div className="space-y-1.5 text-xs text-neutral-200">
            {currentResponse.action_items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-black/30 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agronomic Risk Warnings */}
        {currentResponse.warnings.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Weather & Operational Warning:</span>{' '}
              {currentResponse.warnings.join(' ')}
            </div>
          </div>
        )}

        {/* Telemetry Data Provenance Badges */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span>DATA USED:</span>
            {currentResponse.data_sources.map((src, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-emerald-400 text-[10px]">
                {src}
              </span>
            ))}
          </div>
          <div>
            <span>TIMESTAMP: {currentResponse.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
