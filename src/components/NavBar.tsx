import React, { useState, useEffect, useRef } from 'react';
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
  WifiOff, 
  PlusCircle, 
  Activity, 
  FileSearch, 
  Zap,
  MoreVertical,
  ChevronRight
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
  onOpenRegisterLand?: () => void;
  onEnterDemoFarm?: () => void;
  onOpenSystemStatus?: () => void;
  onOpenProvenance?: () => void;
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
  onOpenRegisterLand,
  onEnterDemoFarm,
  onOpenSystemStatus,
  onOpenProvenance,
  alertCount,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [threeDotOpen, setThreeDotOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close 3-dot dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThreeDotOpen(false);
      }
    };
    if (threeDotOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [threeDotOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setThreeDotOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTabChange = (tab: NavTab) => {
    soundFx.playClick();
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setThreeDotOpen(false);
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

        {/* Right Action Tools: AgriVani Voice, Sound FX, Alerts, and 3-Dot Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0" ref={dropdownRef}>
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

          {/* Clean 3-Dot (More Options) Button */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playClick();
                setThreeDotOpen((prev) => !prev);
              }}
              title="More Options & System Controls"
              aria-label="More Options"
              className={`p-1.5 sm:px-2 sm:py-1 rounded-full text-xs font-mono flex items-center gap-1 transition-all cursor-pointer border ${
                threeDotOpen
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-105'
                  : 'glass-panel-subtle hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-300 border-white/10'
              }`}
            >
              <MoreVertical className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline text-[11px] font-bold">Options</span>
            </button>

            {/* 3-Dot Dropdown Menu Modal/Popover */}
            {threeDotOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-[#04110A]/95 backdrop-blur-2xl border border-emerald-500/40 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-[#ECE8DD] z-50 flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="px-2.5 py-1.5 border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  <span className="text-emerald-400 font-bold">AgriN Intelligence Menu</span>
                  <span>Control Center</span>
                </div>

                {/* 1. AI Crop Doctor */}
                <button
                  onClick={() => handleTabChange('crop-doctor')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer border ${
                    activeTab === 'crop-doctor'
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-white'
                      : 'hover:bg-white/5 border-transparent text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400 shrink-0">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        AI Crop Doctor
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Live AI
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400">Gemini Vision plant pathology</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                </button>

                <div className="h-px bg-white/5 my-0.5" />

                {/* 2. Simple Mode / Expert Mode Toggle */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onToggleSimpleMode();
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer border ${
                    isSimpleMode
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      : 'hover:bg-white/5 border-transparent text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 text-xs">
                      🧑🌾
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Simple Farmer Mode</div>
                      <div className="text-[10px] text-neutral-400">
                        {isSimpleMode ? 'Active (High-contrast, audio-first)' : 'Inactive (Full agronomist suite)'}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    isSimpleMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-white/5 text-neutral-400 border-white/10'
                  }`}>
                    {isSimpleMode ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* 3. Online / Offline Simulation Toggle */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onToggleOffline();
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer border ${
                    isOffline
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                      : 'hover:bg-white/5 border-transparent text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      isOffline
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    }`}>
                      {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Network State</div>
                      <div className="text-[10px] text-neutral-400">
                        {isOffline ? 'Offline (Simulating rural field cache)' : 'Online (Live cloud satellite/weather)'}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    isOffline
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  }`}>
                    {isOffline ? 'Offline' : 'Online'}
                  </span>
                </button>

                <div className="h-px bg-white/5 my-0.5" />

                {/* 4. Farmer Consent Center */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setThreeDotOpen(false);
                    onOpenConsent();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-white/5 transition-all cursor-pointer border border-transparent text-neutral-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Consent Center</div>
                      <div className="text-[10px] text-neutral-400">DPDP Act compliance & data rights</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                </button>

                {/* 5. Ecosystem Impact Dashboard (with voice) */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setThreeDotOpen(false);
                    onOpenImpact();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-white/5 transition-all cursor-pointer border border-transparent text-neutral-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        Ecosystem Impact
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          🔊 Voice
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400">Water, CO2 & Nitrogen metrics</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                </button>

                {/* 6. System Status Inspector */}
                {onOpenSystemStatus && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setThreeDotOpen(false);
                      onOpenSystemStatus();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-white/5 transition-all cursor-pointer border border-transparent text-neutral-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Subsystems Status</div>
                        <div className="text-[10px] text-neutral-400">Ping live Gemini, Meteo & Sentinel</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                  </button>
                )}

                {/* 7. Data Provenance Registry */}
                {onOpenProvenance && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setThreeDotOpen(false);
                      onOpenProvenance();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-white/5 transition-all cursor-pointer border border-transparent text-neutral-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                        <FileSearch className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Data Provenance</div>
                        <div className="text-[10px] text-neutral-400">Auditable formulas & sensor lineage</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                  </button>
                )}

                <div className="h-px bg-white/5 my-0.5" />

                {/* 8. Register Land Parcel */}
                {onOpenRegisterLand && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setThreeDotOpen(false);
                      onOpenRegisterLand();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-500/40 text-emerald-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                        <PlusCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">+ Register Land Parcel</div>
                        <div className="text-[10px] text-neutral-300">Khasra, soil & GPS cadastre</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
                  </button>
                )}

                {/* 9. One-Click Demo Farm */}
                {onEnterDemoFarm && (
                  <button
                    onClick={() => {
                      soundFx.playChime(640, 0.25);
                      setThreeDotOpen(false);
                      onEnterDemoFarm();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                        <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">One-Click Demo Farm</div>
                        <div className="text-[10px] text-neutral-300">Pratapgarh Sharbati Wheat (14.2 ha)</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
                  </button>
                )}

                {/* 10. Replay Intro */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setThreeDotOpen(false);
                    onReplayLogo();
                  }}
                  className="w-full flex items-center justify-between p-1.5 px-2.5 rounded-lg text-left hover:bg-white/5 text-[11px] text-neutral-400 hover:text-white transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <PlayCircle className="w-3.5 h-3.5 text-neutral-400" /> Replay Cinematic Intro
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Toggle */}
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
        <div className="xl:hidden fixed top-16 left-4 right-4 bg-[#05130D]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-4 shadow-2xl flex flex-col gap-2 pointer-events-auto max-h-[85vh] overflow-y-auto z-50">
          {/* Quick Access Tools */}
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/10">
            {/* AI Crop Doctor */}
            <button
              onClick={() => handleTabChange('crop-doctor')}
              className="flex items-center gap-2 p-2 rounded-xl bg-lime-950/40 border border-lime-500/30 text-lime-300 text-xs font-medium cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-lime-400 shrink-0" />
              <span className="truncate">AI Crop Doctor</span>
            </button>

            {/* Simple Farmer Mode */}
            <button
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
                onToggleSimpleMode();
              }}
              className={`flex items-center justify-between p-2 rounded-xl border text-xs font-medium cursor-pointer ${
                isSimpleMode 
                  ? 'bg-amber-950/50 border-amber-500/50 text-amber-300' 
                  : 'bg-white/5 border-white/10 text-neutral-300'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <span>🧑‍🌾</span> Simple Mode
              </span>
              <span className="text-[10px] font-mono px-1 rounded bg-black/40">
                {isSimpleMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Online / Offline */}
            <button
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
                onToggleOffline();
              }}
              className={`flex items-center justify-between p-2 rounded-xl border text-xs font-medium cursor-pointer ${
                isOffline
                  ? 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                  : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                {isOffline ? <WifiOff className="w-3.5 h-3.5 text-rose-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                {isOffline ? 'Offline' : 'Online'}
              </span>
            </button>

            {/* Consent Center */}
            <button
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
                onOpenConsent();
              }}
              className="flex items-center gap-2 p-2 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-300 text-xs font-medium cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="truncate">Consent</span>
            </button>

            {/* Ecosystem Impact */}
            <button
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
                onOpenImpact();
              }}
              className="flex items-center gap-2 p-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-medium cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">Impact (🔊 Voice)</span>
            </button>

            {/* Subsystems Status */}
            {onOpenSystemStatus && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  setMobileMenuOpen(false);
                  onOpenSystemStatus();
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Live Status</span>
              </button>
            )}

            {/* Data Provenance */}
            {onOpenProvenance && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  setMobileMenuOpen(false);
                  onOpenProvenance();
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-medium cursor-pointer"
              >
                <FileSearch className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">Provenance</span>
              </button>
            )}
          </div>

          {onEnterDemoFarm && (
            <button
              onClick={() => {
                soundFx.playChime(640, 0.25);
                setMobileMenuOpen(false);
                onEnterDemoFarm();
              }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-mono text-xs font-extrabold border border-amber-300 shadow-lg cursor-pointer"
            >
              <Zap className="w-4 h-4 text-black fill-black" />
              <span>⚡ One-Click Demo Farm</span>
            </button>
          )}

          {onOpenRegisterLand && (
            <button
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
                onOpenRegisterLand();
              }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-mono text-xs font-bold border border-emerald-400/50 shadow-lg cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>+ Register New Land Parcel</span>
            </button>
          )}

          {/* Core Navigation Items */}
          <div className="pt-1 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider px-2">Navigation</span>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
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
        </div>
      )}
    </header>
  );
};
