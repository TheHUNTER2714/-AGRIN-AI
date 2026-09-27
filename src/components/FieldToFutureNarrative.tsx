import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sprout, 
  MapPin, 
  Home, 
  Building2, 
  Flag, 
  Globe2, 
  Play, 
  Pause, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

export const FieldToFutureNarrative: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      title: 'ONE SEED',
      icon: Sprout,
      scaleName: 'Cellular / Rhizosphere Scale',
      subtitle: 'A single grain of Sharbati wheat sown in Pratapgarh alluvial soil.',
      narrative: 'Life begins with a germination impulse. Micro-climate humidity, sub-surface capillary tension, and indigenous mycorrhizal fungi activate.',
      badgeColor: 'text-lime-300 bg-lime-950/40 border-lime-500/30',
      telemetry: '0.001 sq.m • Soil Tension: 28% • NPK: 42-31-68',
      visualClass: 'from-lime-500/20 via-emerald-950/50 to-black',
    },
    {
      title: 'FARM',
      icon: MapPin,
      scaleName: '14.2 Hectare Cadastral Parcel',
      subtitle: 'Ayush Farm is mapped by European Sentinel-2 & ISRO Cartosat.',
      narrative: 'Hyperspectral vegetation indices (NDVI) calibrate against in-situ IoT nodes. Every furrow has a real-time digital twin.',
      badgeColor: 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30',
      telemetry: '142,000 sq.m • 10m Pixel Raster • 4 Plots Monitored',
      visualClass: 'from-emerald-500/20 via-emerald-950/50 to-black',
    },
    {
      title: 'VILLAGE',
      icon: Home,
      scaleName: 'Gram Panchayat Micro-Cluster',
      subtitle: '340 smallholder farming families connected via AgriVani Vernacular Voice.',
      narrative: 'Farmers speak in Awadhi and Bhojpuri. Localized biochar collection hubs dispatch balers to convert parali into carbon wealth.',
      badgeColor: 'text-teal-300 bg-teal-950/40 border-teal-500/30',
      telemetry: '340 Farmers • 850 Ha • 12 Vernacular Dialects',
      visualClass: 'from-teal-500/20 via-teal-950/50 to-black',
    },
    {
      title: 'DISTRICT',
      icon: Building2,
      scaleName: 'Pratapgarh Administrative Block',
      subtitle: 'AI aggregates anonymized stress vectors to predict regional outbreaks.',
      narrative: 'Early yellow rust warnings triggered 11 days before spore eruption. Canal irrigation schedules automatically synchronize with IMD Doppler rainfall tracks.',
      badgeColor: 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30',
      telemetry: '75 Blocks • 4.8M Population • 280,000 Ha Farmland',
      visualClass: 'from-cyan-500/20 via-cyan-950/50 to-black',
    },
    {
      title: 'STATE',
      icon: Flag,
      scaleName: 'Uttar Pradesh Gangetic Plain',
      subtitle: 'State Agriculture Directorate coordinates input subsidies and drought insurance.',
      narrative: 'Automated satellite yield verifications eliminate delays in PM Fasal Bima Yojana payouts. Ground-truth verified claims disburse in hours, not months.',
      badgeColor: 'text-amber-300 bg-amber-950/40 border-amber-500/30',
      telemetry: '75 Districts • 14.8M Ha Monitored • ₹1,200 Cr Saved',
      visualClass: 'from-amber-500/20 via-amber-950/50 to-black',
    },
    {
      title: 'INDIA',
      icon: Sparkles,
      scaleName: 'National Digital Public Good (AgriStack)',
      subtitle: '140 Million Indian Smallholders sovereignly interconnected.',
      narrative: 'Interoperable, open-source agronomy models built for marginal farmers. Zero vendor lock-in. 100% DPDP Act compliance and farmer data sovereignty.',
      badgeColor: 'text-orange-300 bg-orange-950/40 border-orange-500/30',
      telemetry: '28 States • 140M Smallholders • 40.0M Ha Telemetry',
      visualClass: 'from-orange-500/20 via-emerald-950/50 to-black',
    },
    {
      title: 'BRICS',
      icon: Globe2,
      scaleName: 'Planetary South-South Cooperation',
      subtitle: 'Federated learning across India, Brazil, South Africa, Russia, and China.',
      narrative: 'Raw data stays within national borders. Only encrypted gradient weights are exchanged to adapt smallholder agriculture to global climate disruption.',
      badgeColor: 'text-emerald-300 bg-cyan-950/60 border-cyan-400/40',
      telemetry: '5 Global Hubs • 240M Ha Managed • Planetary Resilience',
      visualClass: 'from-cyan-500/30 via-emerald-950/60 to-black',
    },
  ];

  // Auto-play timeline loop
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % steps.length;
        if (next === steps.length - 1) {
          // Trigger celebratory confetti on reaching BRICS!
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#10B981', '#34D399', '#6EE7B7', '#F59E0B'],
            });
          } catch {
            // ignore
          }
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const active = steps[currentStep];
  const Icon = active.icon;

  const handleStepClick = (idx: number) => {
    soundFx.playClick();
    setCurrentStep(idx);
    setIsPlaying(false);
  };

  return (
    <section className="relative py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-xs font-mono text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>SCALING PARADIGM: FIELD TO FUTURE</span>
        </div>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-[#F9F8F3]">
          From One Seed to Planetary Intelligence
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
          How AgriN collapses orbital hyperspectral telemetry from 500km space down to a single wheat sprout—and scales back up to 140 million farmers.
        </p>
      </div>

      {/* Interactive Progression Bar (Seed -> Farm -> Village -> District -> State -> India -> BRICS) */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-4 no-scrollbar">
        {steps.map((s, idx) => {
          const StepIcon = s.icon;
          const isCurrent = currentStep === idx;
          const isPassed = currentStep > idx;

          return (
            <React.Fragment key={s.title}>
              <button
                onClick={() => handleStepClick(idx)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl cursor-pointer transition-all border whitespace-nowrap shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-500 text-black font-extrabold border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-105'
                    : isPassed
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                    : 'glass-panel-subtle text-neutral-400 hover:text-white'
                }`}
              >
                <StepIcon className="w-4 h-4" />
                <span className="text-xs font-mono">{s.title}</span>
              </button>

              {idx < steps.length - 1 && (
                <div className={`h-0.5 w-6 sm:w-12 transition-colors ${
                  isPassed ? 'bg-emerald-400' : 'bg-white/10'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Cinematic Feature Stage Card */}
      <div className={`rounded-3xl p-8 sm:p-12 border border-emerald-500/30 bg-gradient-to-br ${active.visualClass} shadow-[0_20px_60px_rgba(0,0,0,0.7)] transition-all duration-700 relative overflow-hidden`}>
        <div className="absolute inset-0 satellite-grid opacity-25 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-3 py-1 rounded-full border uppercase tracking-widest font-bold ${active.badgeColor}`}>
                STAGE 0{currentStep + 1} &bull; {active.scaleName}
              </span>
            </div>

            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
              {active.subtitle}
            </h3>

            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-light">
              {active.narrative}
            </p>

            <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-neutral-300 space-y-1">
              <span className="text-[10px] text-neutral-400 block uppercase">SCALE TELEMETRY:</span>
              <div className="text-emerald-400 font-bold">{active.telemetry}</div>
            </div>

            {/* Controls: Play/Pause, Step Next */}
            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs cursor-pointer shadow-md transition-all"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause Story' : 'Auto Play Story'}</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setCurrentStep((prev) => (prev + 1) % steps.length);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 text-xs font-mono cursor-pointer"
              >
                <span>Next Scale</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Graphic Visualization of Current Stage */}
          <div className="relative h-64 sm:h-80 rounded-2xl bg-black/60 border border-emerald-500/30 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <Icon className="w-10 h-10 text-emerald-300" />
              </div>

              <div>
                <div className="font-display font-extrabold text-2xl text-[#F9F8F3]">
                  {active.title}
                </div>
                <div className="text-xs font-mono text-emerald-400 mt-1">
                  {active.scaleName}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Closing Climax Banner */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center font-display">
          <p className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-lime-300">
            &ldquo;Intelligence that grows with every farm.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};
