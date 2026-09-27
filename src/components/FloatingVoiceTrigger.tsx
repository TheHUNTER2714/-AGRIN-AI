import React from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FloatingVoiceTriggerProps {
  onOpen: () => void;
}

export const FloatingVoiceTrigger: React.FC<FloatingVoiceTriggerProps> = ({ onOpen }) => {
  const handleClick = () => {
    soundFx.playChime(520, 0.25);
    onOpen();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={handleClick}
        className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-2xl cursor-pointer hover:border-emerald-400 transition-all hover:scale-105"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-bold">AgriVani 🎙️ Speak in Any Indian Language</span>
        <span className="text-[10px] text-neutral-400 font-sans">22 Languages</span>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        title="Open AgriVani Voice Assistant (22 Indian Languages)"
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 text-black flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] border-2 border-emerald-300 cursor-pointer group"
      >
        {/* Radar Ring */}
        <div className="absolute inset-0 rounded-full border border-emerald-400/60 animate-ping duration-1000 pointer-events-none" />

        {/* Custom Mini AgriVani Icon */}
        <div className="relative flex items-center justify-center">
          <Mic className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
          {/* Emerald Leaf Sprout Accent */}
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-lime-300 border border-black shadow" />
        </div>
      </motion.button>
    </div>
  );
};
