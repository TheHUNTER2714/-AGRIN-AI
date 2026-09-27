import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FastForward } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface OpeningLogoProps {
  onComplete: () => void;
}

export const OpeningLogo: React.FC<OpeningLogoProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'seed' | 'sprout' | 'morph' | 'reflection' | 'reveal'>('seed');

  useEffect(() => {
    // Sound cue
    soundFx.playChime(320, 0.4);

    const timer1 = setTimeout(() => {
      setPhase('sprout');
      soundFx.playChime(440, 0.4);
    }, 700);

    const timer2 = setTimeout(() => {
      setPhase('morph');
      soundFx.playChime(580, 0.3);
    }, 1600);

    const timer3 = setTimeout(() => {
      setPhase('reflection');
      soundFx.playScanTone();
    }, 2400);

    const timer4 = setTimeout(() => {
      setPhase('reveal');
      soundFx.playChime(660, 0.6);
    }, 3000);

    const timerComplete = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030B07] text-[#ECE8DD] overflow-hidden"
    >
      {/* E-Leaf Liquid Glass Nature Background Image (Dribbble shot 26302261) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.img
          src="/assets/eleaf_liquid_bg.jpg"
          alt="E-Leaf Liquid Nature Background"
          initial={{ scale: 1.15, opacity: 0.7 }}
          animate={{ scale: 1.02, opacity: 0.85 }}
          transition={{ duration: 4.0, ease: 'easeOut' }}
          className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
        />
        {/* Liquid Glass Overlay & Refractive Caustics */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030B07]/80 via-[#030B07]/40 to-[#030B07]/90" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>

      {/* Background ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/15 rounded-full blur-[160px] animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-lime-400/15 rounded-full blur-[90px]" />
        {/* Subtle satellite radar rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-emerald-500/10 rounded-full animate-ping duration-1000 opacity-20" />
      </div>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs tracking-wider uppercase text-emerald-400/80 hover:text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer"
      >
        <span>Skip Intro</span>
        <FastForward className="w-3.5 h-3.5" />
      </button>

      {/* Main Logo Canvas / Center Stage */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Seed & Leaf Morph SVG */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            {phase === 'seed' && (
              <motion.div
                key="seed-stage"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="relative flex items-center justify-center"
              >
                {/* Glowing seed particle */}
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-400 to-lime-300 shadow-[0_0_25px_#10B981] animate-pulse" />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 18 }}
                  className="absolute -bottom-4 w-[2px] bg-emerald-400/60 rounded-full"
                />
              </motion.div>
            )}

            {phase === 'sprout' && (
              <motion.div
                key="sprout-stage"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="relative flex items-center justify-center"
              >
                <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                  {/* Stem */}
                  <motion.path
                    d="M 50 85 Q 50 50 50 35"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Left unfolding leaf */}
                  <motion.path
                    d="M 50 55 C 30 50 25 35 45 35 C 50 35 50 45 50 55"
                    fill="url(#leafGrad)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.85 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />
                  {/* Right unfolding leaf */}
                  <motion.path
                    d="M 50 45 C 70 40 75 25 55 25 C 50 25 50 35 50 45"
                    fill="url(#leafGradLight)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.85 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="leafGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#A7F3D0" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            )}

            {(phase === 'morph' || phase === 'reflection' || phase === 'reveal') && (
              <motion.div
                key="agrin-symbol"
                initial={{ scale: 0.7, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className="relative"
              >
                {/* Liquid Glass AgriN Emblem */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full drop-shadow-[0_0_35px_rgba(16,185,129,0.5)]" viewBox="0 0 120 120" fill="none">
                    {/* Outer organic ring with satellite nodes */}
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="54" 
                      stroke="url(#ringGradient)" 
                      strokeWidth="2.5" 
                      strokeDasharray="4 4" 
                      className="animate-spin-slow"
                    />

                    {/* Left Arch / Farm furrows */}
                    <motion.path
                      d="M 38 86 C 30 70 30 45 60 22 C 60 45 48 72 38 86 Z"
                      fill="url(#agriGradDark)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Right Arch / AI Satellite Beam */}
                    <motion.path
                      d="M 60 22 C 90 45 90 70 82 86 C 72 72 60 45 60 22 Z"
                      fill="url(#agriGradLight)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Central Core Sprout / Seed of Intelligence */}
                    <circle cx="60" cy="58" r="7" fill="#F9F8F3" />
                    <circle cx="60" cy="58" r="14" stroke="#10B981" strokeWidth="1.5" opacity="0.6" />

                    <defs>
                      <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#4ADE80" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0A2618" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="agriGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#064E3B" />
                      </linearGradient>
                      <linearGradient id="agriGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6EE7B7" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Liquid-glass specular sweep across emblem */}
                  {phase === 'reflection' && (
                    <motion.div
                      initial={{ x: '-150%', opacity: 0 }}
                      animate={{ x: '150%', opacity: 1 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none"
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brand Typography */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-[#ECE8DD]">
              Agri<span className="text-emerald-400">N</span>
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              AI
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium tracking-[0.22em] uppercase text-emerald-300/80 mb-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Intelligence For Every Farm</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.6 }}
            className="text-xs text-neutral-400 tracking-wider font-light"
          >
            From Satellite to Soil.
          </motion.p>
        </motion.div>
      </div>

      {/* Progress pill indicator (0 to 3.8s) */}
      <div className="absolute bottom-10 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 3.8, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-emerald-500 to-lime-400"
        />
      </div>
    </motion.div>
  );
};
