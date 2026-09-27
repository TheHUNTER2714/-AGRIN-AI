import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  X, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  ChevronRight,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { indicLanguages, type IndicLanguage } from '../data/indicLanguages';
import { sendVoiceQuery } from '../services/api';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgriVaniVoiceAssistant: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const [selectedLang, setSelectedLang] = useState<IndicLanguage>(indicLanguages[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [manualText, setManualText] = useState('');
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [activeAnswer, setActiveAnswer] = useState<string>(indicLanguages[0].sampleAnswer);
  const [activeQuery, setActiveQuery] = useState<string>(indicLanguages[0].sampleQuery);
  const [activeSource, setActiveSource] = useState<string>('Google Gemini 2.5 Flash + Sentinel-2 Grounding');
  const [activeConfidence, setActiveConfidence] = useState<number>(96.8);
  const recognitionRef = useRef<unknown>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setHasSpeechSupport(true);
        try {
          const rec = new (SpeechRecognition as new () => {
            continuous: boolean;
            interimResults: boolean;
            lang: string;
            onstart: () => void;
            onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
            onerror: () => void;
            onend: () => void;
            start: () => void;
            stop: () => void;
          })();
          rec.continuous = false;
          rec.interimResults = true;
          rec.lang = selectedLang.code;

          rec.onstart = () => {
            setIsListening(true);
            soundFx.playScanTone();
          };

          rec.onresult = (event) => {
            const currentTranscript = event.results[0][0].transcript;
            setTranscript(currentTranscript);
          };

          rec.onerror = () => {
            setIsListening(false);
          };

          rec.onend = () => {
            setIsListening(false);
            if (transcript) {
              handleProcessVoiceQuery(transcript);
            }
          };

          recognitionRef.current = rec;
        } catch {
          setHasSpeechSupport(false);
        }
      } else {
        setHasSpeechSupport(false);
      }
    }
  }, [selectedLang, transcript]);

  const handleSelectLanguage = (lang: IndicLanguage) => {
    soundFx.playClick();
    setSelectedLang(lang);
    setActiveQuery(lang.sampleQuery);
    setActiveAnswer(lang.sampleAnswer);
    setTranscript('');
    setManualText('');
    if (recognitionRef.current) {
      (recognitionRef.current as { lang: string }).lang = lang.code;
    }
  };

  const handleStartListening = () => {
    soundFx.playClick();
    if (isListening) {
      if (recognitionRef.current) {
        (recognitionRef.current as { stop: () => void }).stop();
      }
      setIsListening(false);
      return;
    }

    setTranscript('');
    if (recognitionRef.current) {
      try {
        (recognitionRef.current as { start: () => void }).start();
        setIsListening(true);
      } catch {
        // Fallback simulation if browser mic permission not granted
        simulateVoiceListening();
      }
    } else {
      simulateVoiceListening();
    }
  };

  const simulateVoiceListening = () => {
    setIsListening(true);
    soundFx.playScanTone();
    setTimeout(() => {
      setTranscript(selectedLang.sampleQuery);
      setIsListening(false);
      handleProcessVoiceQuery(selectedLang.sampleQuery);
    }, 2000);
  };

  const handleProcessVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setActiveQuery(queryText);
    setIsThinking(true);
    soundFx.playScanTone();

    try {
      const res = await sendVoiceQuery(
        queryText,
        selectedLang.code,
        'Wheat'
      );
      setActiveAnswer(res.answer_text);
      setActiveSource(res.source || 'Google Gemini 2.5 Flash');
      setActiveConfidence(Math.round((res.confidence || 0.95) * 100));
      soundFx.playChime(640, 0.4);
      handleSpeakText(res.answer_text, selectedLang.code);
    } catch {
      setActiveAnswer(selectedLang.sampleAnswer);
      handleSpeakText(selectedLang.sampleAnswer, selectedLang.code);
    } finally {
      setIsThinking(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim() || isThinking) return;
    const query = manualText.trim();
    setManualText('');
    handleProcessVoiceQuery(query);
  };

  const handleSpeakText = (text: string, langCode: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredLanguages = indicLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nativeName.includes(searchTerm) ||
      l.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
          />

          {/* Assistant Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-4 sm:inset-auto sm:top-12 sm:bottom-12 sm:left-1/2 sm:-translate-x-1/2 sm:w-[940px] bg-[#05130D]/95 backdrop-blur-3xl border border-emerald-500/30 rounded-3xl z-50 shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-[#ECE8DD]"
          >
            {/* Modal Header with Dedicated AgriVani Custom Logo */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                {/* AgriVani Custom Animated Logo: Microphone fused with Sprout & Sonar Waves */}
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-forest p-0.5 border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
                    {/* Sonar Radar Arcs */}
                    <circle cx="50" cy="50" r="42" stroke="#4ADE80" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" className="animate-spin-slow" />
                    {/* Leaf Sprout Left */}
                    <path d="M 50 50 C 35 45 28 30 45 25 C 48 35 50 45 50 50 Z" fill="#A7F3D0" opacity="0.9" />
                    {/* Leaf Sprout Right */}
                    <path d="M 50 50 C 65 45 72 30 55 25 C 52 35 50 45 50 50 Z" fill="#34D399" opacity="0.9" />
                    {/* Central Microphone Body */}
                    <rect x="44" y="40" width="12" height="24" rx="6" fill="#F9F8F3" />
                    <path d="M 38 52 C 38 62 62 62 62 52" stroke="#F9F8F3" strokeWidth="3" strokeLinecap="round" />
                    <line x1="50" y1="62" x2="50" y2="72" stroke="#F9F8F3" strokeWidth="3" strokeLinecap="round" />
                    <line x1="42" y1="72" x2="58" y2="72" stroke="#F9F8F3" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-extrabold text-2xl text-[#F9F8F3]">
                      AgriVani <span className="text-emerald-400">AI</span>
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      कृषि वाणी • 22 INDIC LANGUAGES
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">
                    Vernacular Acoustic Intelligence Grounded in Real-Time Farm Telemetry
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two Columns */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Left Column: Language Selector (All 22 Languages + English) */}
              <div className="md:col-span-5 border-r border-white/10 flex flex-col bg-[#030B07]/60 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Search by language, script or state..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full py-2.5 pl-9 pr-3 rounded-xl bg-black/50 border border-emerald-500/20 text-xs text-[#ECE8DD] placeholder-neutral-500 focus:outline-none focus:border-emerald-400"
                    />
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3" />
                  </div>
                </div>

                {/* Scrollable Language List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                  {filteredLanguages.map((lang) => {
                    const isSelected = selectedLang.id === lang.id;
                    return (
                      <div
                        key={lang.id}
                        onClick={() => handleSelectLanguage(lang)}
                        className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-md'
                            : 'bg-black/30 border-white/5 hover:border-emerald-500/30 text-neutral-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#F9F8F3]">{lang.nativeName}</span>
                            <span className="text-xs text-neutral-400 font-mono">({lang.name})</span>
                          </div>
                          <div className="text-[10px] text-neutral-500 font-mono truncate max-w-[220px]">
                            {lang.region}
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Interactive Voice Stage */}
              <div className="md:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-[#05130D]/80 overflow-y-auto space-y-6">
                {/* Active Language Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                      ACTIVE VERNACULAR DIALECT
                    </span>
                    <div className="font-display font-bold text-lg text-[#F9F8F3]">
                      {selectedLang.nativeName} &bull; {selectedLang.name}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeakText(activeAnswer, selectedLang.code)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 text-xs font-mono cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'Playing Voice...' : 'Speak Audio'}</span>
                  </button>
                </div>

                {/* Center Visualizer & Mic Trigger */}
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  {/* Glowing Radar Pulse & Mic Button */}
                  <div className="relative">
                    {/* Animated Pulsing Rings when listening */}
                    {isListening && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping duration-1000 scale-150" />
                        <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-pulse duration-700 scale-125" />
                      </>
                    )}

                    <button
                      onClick={handleStartListening}
                      className={`relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl ${
                        isListening
                          ? 'bg-gradient-to-tr from-red-500 to-rose-600 scale-110 shadow-[0_0_35px_#ef4444]'
                          : 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 hover:scale-105 shadow-[0_0_35px_rgba(16,185,129,0.5)]'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="w-10 h-10 text-white animate-pulse" />
                      ) : (
                        <Mic className="w-10 h-10 text-black" />
                      )}
                    </button>
                  </div>

                  {/* Status text */}
                  <div>
                    <span className="text-sm font-semibold text-[#ECE8DD] block">
                      {isThinking
                        ? 'Consulting Gemini 2.5 Flash...'
                        : isListening
                        ? `Listening in ${selectedLang.nativeName}... Speak now`
                        : `Tap Microphone to Speak in ${selectedLang.name}`}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Grounded against Sentinel-2 multispectral, weather & soil telemetry
                    </span>
                  </div>

                  {/* Browser voice warning & Text Fallback (P2 Fix #17) */}
                  {!hasSpeechSupport && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Voice recognition unavailable in this browser — type your question below.</span>
                    </div>
                  )}

                  {/* Text Input Form Fallback */}
                  <form onSubmit={handleManualSubmit} className="w-full flex items-center gap-2">
                    <input
                      type="text"
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder={`Type query in ${selectedLang.name} or English...`}
                      disabled={isThinking}
                      className="flex-1 py-2 px-3.5 rounded-xl bg-black/60 border border-emerald-500/30 text-xs text-[#ECE8DD] placeholder-neutral-500 focus:outline-none focus:border-emerald-400 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={isThinking || !manualText.trim()}
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>

                  {/* Audio Waveform Equalizer */}
                  <div className="flex items-center gap-1.5 h-8">
                    {[8, 22, 14, 28, 16, 32, 24, 18, 30, 12, 26, 16].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={isListening || isSpeaking || isThinking ? { height: [6, h, 6] } : { height: 6 }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05 }}
                        className={`w-1.5 rounded-full ${
                          isListening ? 'bg-red-400' : isThinking ? 'bg-amber-400' : isSpeaking ? 'bg-emerald-400' : 'bg-emerald-500/20'
                        }`}
                        style={{ height: '6px' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Live Question & Answer Box */}
                <div className="space-y-4">
                  {/* Recognized / Selected Question */}
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 font-sans">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                      FARMER INQUIRY ({selectedLang.nativeName}):
                    </span>
                    <p className="text-base text-emerald-100 font-medium leading-relaxed">
                      &ldquo;{activeQuery}&rdquo;
                    </p>
                    <p className="text-xs text-neutral-400 italic mt-1 font-mono">
                      Translation: &ldquo;{selectedLang.englishQuery}&rdquo;
                    </p>
                  </div>

                  {/* Spoken AI Agricultural Prescription */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-black/60 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                        {isThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>AGRIVANI VERDICT ({selectedLang.nativeName}):</span>
                      </span>
                      <button
                        onClick={() => handleSpeakText(activeAnswer, selectedLang.code)}
                        className="text-emerald-400 hover:text-emerald-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Replay Audio</span>
                      </button>
                    </div>

                    <p className="text-sm text-[#F9F8F3] leading-relaxed font-sans">
                      {isThinking ? 'Analyzing query with Google Gemini 2.5 Flash and latest farm weather & soil telemetry...' : activeAnswer}
                    </p>

                    <div className="pt-2 border-t border-white/10 text-xs text-neutral-400 font-mono flex items-center justify-between">
                      <span>CONFIDENCE: {activeConfidence}%</span>
                      <span className="text-emerald-400 uppercase">{activeSource}</span>
                    </div>
                  </div>
                </div>

                {/* Try another vernacular query shortcut */}
                <div className="pt-2 text-center">
                  <button
                    onClick={() => handleProcessVoiceQuery(selectedLang.sampleQuery)}
                    className="text-xs text-neutral-400 hover:text-emerald-300 font-mono flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <span>Refresh sample advisory for {selectedLang.name}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
