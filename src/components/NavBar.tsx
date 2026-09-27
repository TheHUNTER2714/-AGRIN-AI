import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Satellite, 
  Stethoscope, 
  CloudSun, 
  FlaskConical, 
  RotateCw, 
  Recycle, 
  Bot, 
  MapPin, 
  Globe2, 
  Bell, 
  Volume2, 
  VolumeX, 
  Compass, 
  PlayCircle,
  Menu,
  X,
  Layers,
  ShieldCheck,
  BarChart3,
  Wifi,
  WifiOff
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export type NavTab = 
  | 'overview' 
  | 'digital-twin' 
  | 'dashboard' 
  | 'satellite' 
  | 'crop-doctor' 
  | 'weather' 
  | 'soil' 
  | 'regenerative' 
  | 'agricycle' 
  | 'ai-advisory' 
  | 'india-command' 
  | 'brics';

interface NavBarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onReplayLogo: () => void;
  onToggleAlerts: () => void;
  onOpenVoiceAssistant?: () => void;
  onToggleSimpleMode: () => void;
  isSimpleMode: boolean;
  onToggleOffline: () => void;
  isOffline: boolean;
  onOpenConsent: () => void;
  onOpenImpact: () => void;
  alertCount: number;
}

export const NavBar: React.FC<NavBarProps> = ({
  activeTab,
  setActiveTab,
  onReplayLogo,
  onToggleAlerts,
  onOpenVoiceAssistant,
  onToggleSimpleMode,
  isSimpleMode,
  onToggleOffline,
  isOffline,
  onOpenConsent,
  onOpenImpact,
  alertCount,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabChange = (tab: NavTab) => {
    soundFx.playClick();
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    const state = soundFx.toggle();
    setSoundEnabled(state);
  };

  const primaryNavItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'digital-twin', label: 'Digital Twin', icon: Layers },
    { id: 'dashboard', label: 'Command Center', icon: Sparkles },
    { id: 'satellite', label: 'Satellite', icon: Satellite },
    { id: 'crop-doctor', label: 'Crop Doctor', icon: Stethoscope },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'soil', label: 'Soil Lab', icon: FlaskConical },
    { id: 'regenerative', label: 'Regenerative', icon: RotateCw },
    { id: 'agricycle', label: 'AgriCycle', icon: Recycle },
    { id: 'ai-advisory', label: 'AI Advisor', icon: Bot },
    { id: 'india-command', label: 'India Map', icon: MapPin },
    { id: 'brics', label: 'BRICS', icon: Globe2 },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-2 sm:px-4 pt-2 sm:pt-3 pointer-events-none transition-all duration-300">
      <nav
        className={`pointer-events-auto flex items-center justify-between gap-2 px-3 sm:px-5 rounded-2xl sm:rounded-full transition-all duration-300 border ${
          scrolled
            ? 'py-2 bg-[#05130D]/90 backdrop-blur-xl border-emerald-500/25 shadow-[0_10px_35px_rgba(0,0,0,0.6)] scale-[0.98]'
            : 'py-2.5 bg-[#05130D]/70 backdrop-blur-md border-white/10 shadow-lg'
        } max-w-7xl w-full`}
      >
        {/* Brand Logo */}
        <div 
          onClick={() => handleTabChange('overview')}
          className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
        >
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-[#0A2618] flex items-center justify-center p-0.5 border border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none">
              <path d="M50 15 C70 15 85 35 85 60 C85 80 65 90 50 90 C35 90 15 80 15 60 C15 35 30 15 50 15 Z" fill="#10B981" opacity="0.9" />
              <path d="M50 25 C50 65 35 78 50 85" stroke="#F9F8F3" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-display font-bold text-base tracking-tight text-[#ECE8DD] group-hover:text-emerald-300 transition-colors">
                Agri<span className="text-emerald-400">N</span>
              </span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AI
              </span>
            </div>
            <p className="text-[8px] uppercase tracking-wider text-neutral-400 hidden xl:block -mt-0.5 font-mono">
              From Satellite to Soil
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-0.5 bg-[#030B07]/40 p-1 rounded-full border border-white/5 overflow-x-auto">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-emerald-600/80 to-emerald-700/80 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400/40'
                    : 'text-neutral-300 hover:text-emerald-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-200' : 'text-emerald-400/70'}`} />
                <span className="text-[11px]">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action Tools: Simple Mode Toggle, Offline Sim, Consent, Impact, Voice, Audio, Alerts */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Simple Mode vs Expert Mode Switch */}
          <button
            onClick={() => {
              soundFx.playClick();
              onToggleSimpleMode();
            }}
            title={isSimpleMode ? 'Switch to Expert Agronomist Mode' : 'Switch to Farmer Simple Mode'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer border ${
              isSimpleMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse'
                : 'glass-panel-subtle text-neutral-300 hover:text-emerald-300 border-white/10'
            }`}
          >
            <span>{isSimpleMode ? '🧑🌾 Simple Mode' : '🔬 Expert'}</span>
          </button>

          {/* Offline Simulation Toggle */}
          <button
            onClick={() => {
              soundFx.playClick();
              onToggleOffline();
            }}
            title={isOffline ? 'Offline mode active (Rural PWA cache)' : 'Simulate Low Connectivity / Offline Mode'}
            className={`p-1.5 sm:px-2 sm:py-1 rounded-full text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer border ${
              isOffline
                ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                : 'glass-panel-subtle text-neutral-400 hover:text-emerald-300 border-white/10'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-red-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isOffline ? 'Offline' : 'Online'}</span>
          </button>

          {/* Farmer Data Consent Center */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenConsent();
            }}
            title="Farmer Data Consent Center (DPDP Act Compliance)"
            className="p-1.5 sm:px-2 sm:py-1 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Consent</span>
          </button>

          {/* Impact Dashboard */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenImpact();
            }}
            title="View Ecosystem Impact Metrics"
            className="p-1.5 sm:px-2 sm:py-1 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Impact</span>
          </button>

          {/* AgriVani Voice Trigger */}
          {onOpenVoiceAssistant && (
            <button
              onClick={() => {
                soundFx.playChime(520, 0.2);
                onOpenVoiceAssistant();
              }}
              title="Speak in 22 Indian Languages (AgriVani AI)"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:scale-105"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold">AgriVani</span>
            </button>
          )}

          {/* Intro Replay */}
          <button
            onClick={onReplayLogo}
            title="Replay Cinematic Logo Intro"
            className="hidden sm:flex items-center p-1.5 rounded-full text-xs text-neutral-300 hover:text-emerald-300 glass-panel-subtle hover:border-emerald-500/30 transition-all cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-1.5 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </button>

          {/* Alerts Bell */}
          <button
            onClick={onToggleAlerts}
            title="View Live Farm & Satellite Alerts"
            className="relative p-1.5 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {alertCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-xl glass-panel-subtle text-neutral-300 hover:text-emerald-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed top-16 left-4 right-4 bg-[#05130D]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-4 shadow-2xl flex flex-col gap-1 pointer-events-auto max-h-[75vh] overflow-y-auto">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
