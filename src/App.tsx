import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpeningLogo } from './components/OpeningLogo';
import { NavBar, type NavTab } from './components/NavBar';
import { AlertsDrawer, type FarmAlert } from './components/AlertsDrawer';
import { OverviewPage } from './components/OverviewPage';
import { DashboardHome } from './components/DashboardHome';
import { FarmDigitalTwin } from './components/FarmDigitalTwin';
import { SatellitePage } from './components/SatellitePage';
import { CropDoctorPage } from './components/CropDoctorPage';
import { WeatherPage } from './components/WeatherPage';
import { SoilPage } from './components/SoilPage';
import { RegenerativePage } from './components/RegenerativePage';
import { ResiduePage } from './components/ResiduePage';
import { AiAdvisoryPage } from './components/AiAdvisoryPage';
import { IndiaCommandCenter } from './components/IndiaCommandCenter';
import { BricsNetworkPage } from './components/BricsNetworkPage';
import { AgriVaniVoiceAssistant } from './components/AgriVaniVoiceAssistant';
import { FloatingVoiceTrigger } from './components/FloatingVoiceTrigger';
import { FarmerSimpleMode } from './components/FarmerSimpleMode';
import { FarmerConsentCenterModal } from './components/FarmerConsentCenterModal';
import { ImpactDashboardModal } from './components/ImpactDashboardModal';
import { ExplainableWhyModal, type ExplainableWhyData } from './components/ExplainableWhyModal';
import { soundFx } from './utils/audio';
import { 
  WifiOff, 
  RefreshCw, 
  CloudRain, 
  SunMedium, 
  Sparkles, 
  Satellite as SatIcon, 
  CheckCircle2, 
  Radio
} from 'lucide-react';

export const App: React.FC = () => {
  const [showLogoIntro, setShowLogoIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);

  // Feature 8: Simple Mode vs Expert Mode
  const [isSimpleMode, setIsSimpleMode] = useState(false);

  // Feature 14: Offline / Low-connectivity PWA Mode
  const [isOffline, setIsOffline] = useState(false);

  // Feature 2: Explainable AI "Why?" Modal
  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [customWhyData, setCustomWhyData] = useState<ExplainableWhyData | undefined>(undefined);

  // Feature 15: Farmer Data Consent Center
  const [consentModalOpen, setConsentModalOpen] = useState(false);

  // Feature 12: National Impact Dashboard
  const [impactModalOpen, setImpactModalOpen] = useState(false);

  // Feature 17: Living UI Atmospheric Mode ('auto' | 'rain' | 'heat' | 'flora' | 'satellite')
  const [livingUiOverride, setLivingUiOverride] = useState<'auto' | 'rain' | 'heat' | 'flora' | 'satellite'>('auto');

  // Initial Real-time Farm Alerts
  const [alerts] = useState<FarmAlert[]>([
    {
      id: 'alert-1',
      date: 'TODAY',
      time: '10:32 AM',
      title: 'Heavy Rainfall Risk (35mm)',
      description: 'Convective storm cloud bank moving eastward across Pratapgarh. Imminent in 14 hours. Hold scheduled furrow irrigation.',
      severity: 'high',
      category: 'Weather',
      actionLabel: 'Check Weather Radar',
    },
    {
      id: 'alert-2',
      date: 'TODAY',
      time: '08:15 AM',
      title: 'Vegetation Decline Detected in Plot B',
      description: 'Sentinel-2 multispectral anomaly detected -0.07 NDVI dip along northern perimeter. Early aphid colony formation suspected.',
      severity: 'medium',
      category: 'Vegetation',
      actionLabel: 'Scan with Crop Doctor',
    },
    {
      id: 'alert-3',
      date: 'YESTERDAY',
      time: '06:45 PM',
      title: 'Soil Moisture Improved in Root Zone',
      description: 'Capillary water tension normalized at 28% moisture in Plot A Sharbati Wheat. Favorable root respiration.',
      severity: 'good',
      category: 'Soil',
      actionLabel: 'Inspect Soil Lab',
    },
    {
      id: 'alert-4',
      date: 'THIS WEEK',
      time: '02:10 PM',
      title: 'AgriCycle Stubble Collection Completed',
      description: '2.5 tonnes of rice straw safely hauled to Awadh Biochar Pyrolysis facility. ₹4,875 deposited into Kisan Account.',
      severity: 'good',
      category: 'Residue',
      actionLabel: 'View Carbon Receipt',
    },
  ]);

  const handleAlertAction = (alert: FarmAlert) => {
    if (alert.category === 'Weather') setActiveTab('weather');
    else if (alert.category === 'Vegetation') setActiveTab('crop-doctor');
    else if (alert.category === 'Soil') setActiveTab('soil');
    else if (alert.category === 'Residue') setActiveTab('agricycle');
  };

  const handleReplayLogo = () => {
    soundFx.playChime(440, 0.3);
    setShowLogoIntro(true);
  };

  const openWhyModalWithData = (data?: ExplainableWhyData) => {
    setCustomWhyData(data);
    soundFx.playClick();
    setWhyModalOpen(true);
  };

  // Determine current effective Living UI state
  const effectiveLivingUi = React.useMemo(() => {
    if (livingUiOverride !== 'auto') return livingUiOverride;
    if (activeTab === 'weather') return 'rain';
    if (activeTab === 'satellite') return 'satellite';
    if (activeTab === 'soil' || activeTab === 'regenerative') return 'flora';
    return 'flora';
  }, [livingUiOverride, activeTab]);

  return (
    <div className="min-h-screen bg-[#030B07] text-[#ECE8DD] selection:bg-emerald-500/30 selection:text-white relative">
      {/* 0. Opening Animated AgriN Logo (3–4 seconds) with E-Leaf Liquid Background */}
      <AnimatePresence>
        {showLogoIntro && (
          <OpeningLogo onComplete={() => setShowLogoIntro(false)} />
        )}
      </AnimatePresence>

      {/* Feature 17: Living UI Persistent AI Agriculture Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.img
          src="/assets/ai_agri_bg.jpg"
          alt="AI Agriculture Landscape"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-125 saturate-[1.2]"
        />
        {/* Climate-tech Translucent Dark Overlays & Precision Data Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030B07]/85 via-[#030B07]/75 to-[#030B07]/95" />
        <div className="absolute inset-0 satellite-grid opacity-15" />
        <div className="absolute inset-0 contour-pattern opacity-30" />
        
        {/* Living UI Dynamic Atmospheric Overlays */}
        {effectiveLivingUi === 'rain' && (
          <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden opacity-40">
            {/* Falling rain streaks */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />
            <div className="w-full h-full bg-[repeating-linear-gradient(105deg,transparent,transparent_20px,rgba(56,189,248,0.08)_20px,rgba(56,189,248,0.08)_22px)] animate-pulse" />
          </div>
        )}

        {effectiveLivingUi === 'heat' && (
          <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden opacity-30">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 via-orange-950/20 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent animate-pulse" />
          </div>
        )}

        {effectiveLivingUi === 'flora' && (
          <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden opacity-25">
            <div className="absolute top-1/4 -left-48 w-[550px] h-[550px] bg-emerald-600/15 rounded-full blur-[160px] animate-pulse" />
            <div className="absolute bottom-10 -right-48 w-[500px] h-[500px] bg-teal-600/15 rounded-full blur-[150px]" />
          </div>
        )}

        {effectiveLivingUi === 'satellite' && (
          <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden opacity-30">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49%,rgba(16,185,129,0.12)_50%,transparent_51%)] bg-[length:100%_40px] animate-pulse" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent animate-[scan_4s_linear_infinite]" />
          </div>
        )}

        {/* Ambient Depth Glows */}
        <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] bg-emerald-950/25 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 -right-48 w-[500px] h-[500px] bg-amber-950/20 rounded-full blur-[150px]" />
      </div>

      {/* Feature 14: Rural Offline Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sticky top-0 z-50 bg-gradient-to-r from-amber-950/95 via-yellow-900/90 to-amber-950/95 border-b border-amber-500/40 text-amber-200 px-4 py-2.5 shadow-xl backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className="p-1 rounded-full bg-amber-500/20 text-amber-300 animate-pulse">
                  <WifiOff className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-bold text-amber-100 uppercase tracking-wide">
                    Rural Low-Connectivity Mode:
                  </span>{' '}
                  <span>Running on PWA Offline ServiceWorker cache.</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 4 Telemetry Snapshots Cached
                </span>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Auto-sync queued
                </span>
                <button
                  onClick={() => setIsOffline(false)}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 font-sans transition-colors"
                >
                  Reconnect Online
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature 17: Living UI Atmosphere Quick Switcher (Floating Pill on Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-1.5 bg-[#030B07]/80 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-2xl text-xs">
        <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-emerald-400/80 flex items-center gap-1">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Living UI:
        </span>
        <button
          onClick={() => {
            soundFx.playClick();
            setLivingUiOverride('auto');
          }}
          className={`px-2.5 py-1 rounded-full text-[11px] transition-all ${
            livingUiOverride === 'auto'
              ? 'bg-emerald-500/30 text-emerald-200 font-semibold border border-emerald-500/40 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Living UI responds automatically to currently active page and climate conditions"
        >
          Auto
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            setLivingUiOverride('rain');
          }}
          className={`px-2 py-1 rounded-full text-[11px] flex items-center gap-1 transition-all ${
            livingUiOverride === 'rain'
              ? 'bg-blue-500/30 text-blue-200 font-semibold border border-blue-500/40'
              : 'text-zinc-400 hover:text-blue-300'
          }`}
          title="Monsoon Precipitation Atmosphere"
        >
          <CloudRain className="w-3 h-3 text-blue-400" /> Rain
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            setLivingUiOverride('heat');
          }}
          className={`px-2 py-1 rounded-full text-[11px] flex items-center gap-1 transition-all ${
            livingUiOverride === 'heat'
              ? 'bg-amber-500/30 text-amber-200 font-semibold border border-amber-500/40'
              : 'text-zinc-400 hover:text-amber-300'
          }`}
          title="High Heat Atmosphere"
        >
          <SunMedium className="w-3 h-3 text-amber-400" /> Heat
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            setLivingUiOverride('flora');
          }}
          className={`px-2 py-1 rounded-full text-[11px] flex items-center gap-1 transition-all ${
            livingUiOverride === 'flora'
              ? 'bg-emerald-500/30 text-emerald-200 font-semibold border border-emerald-500/40'
              : 'text-zinc-400 hover:text-emerald-300'
          }`}
          title="Lush Vegetation Growth Atmosphere"
        >
          <Sparkles className="w-3 h-3 text-emerald-400" /> Flora
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            setLivingUiOverride('satellite');
          }}
          className={`px-2 py-1 rounded-full text-[11px] flex items-center gap-1 transition-all ${
            livingUiOverride === 'satellite'
              ? 'bg-cyan-500/30 text-cyan-200 font-semibold border border-cyan-500/40'
              : 'text-zinc-400 hover:text-cyan-300'
          }`}
          title="Sentinel-2 Orbital Pass Atmosphere"
        >
          <SatIcon className="w-3 h-3 text-cyan-400" /> Satellite
        </button>
      </div>

      {/* Floating Glass Navigation Bar */}
      <NavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReplayLogo={handleReplayLogo}
        onOpenVoiceAssistant={() => {
          soundFx.playChime(520, 0.25);
          setVoiceAssistantOpen(true);
        }}
        onToggleAlerts={() => {
          soundFx.playClick();
          setAlertsOpen(true);
        }}
        onToggleSimpleMode={() => {
          soundFx.playClick();
          setIsSimpleMode((prev) => !prev);
        }}
        isSimpleMode={isSimpleMode}
        onToggleOffline={() => {
          soundFx.playClick();
          setIsOffline((prev) => !prev);
        }}
        isOffline={isOffline}
        onOpenConsent={() => {
          soundFx.playClick();
          setConsentModalOpen(true);
        }}
        onOpenImpact={() => {
          soundFx.playClick();
          setImpactModalOpen(true);
        }}
        alertCount={alerts.filter((a) => a.severity === 'high' || a.severity === 'medium').length}
      />

      {/* Alerts Slide-in Drawer */}
      <AlertsDrawer
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        alerts={alerts}
        onSelectAlertAction={handleAlertAction}
      />

      {/* Floating Voice Assistant Trigger (Feature 9) */}
      <FloatingVoiceTrigger onOpen={() => setVoiceAssistantOpen(true)} />

      {/* AgriVani Voice Assistant Modal (22 Indian Languages + English) */}
      <AgriVaniVoiceAssistant
        isOpen={voiceAssistantOpen}
        onClose={() => setVoiceAssistantOpen(false)}
      />

      {/* Feature 2: Explainable AI "Why?" Modal */}
      <ExplainableWhyModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
        data={customWhyData}
      />

      {/* Feature 15: Farmer Data Consent Center Modal */}
      <FarmerConsentCenterModal
        isOpen={consentModalOpen}
        onClose={() => setConsentModalOpen(false)}
      />

      {/* Feature 12: National Impact Dashboard Modal */}
      <ImpactDashboardModal
        isOpen={impactModalOpen}
        onClose={() => setImpactModalOpen(false)}
      />

      {/* Main Content Router with Cinematic Smooth Transitions */}
      <main className="relative z-10">
        {/* Feature 8: High-Accessibility Farmer Simple Mode */}
        {isSimpleMode ? (
          <div className="pt-24 pb-20">
            <FarmerSimpleMode
              onSwitchToExpert={() => setIsSimpleMode(false)}
              onOpenVoiceAssistant={() => setVoiceAssistantOpen(true)}
              onOpenWhyModal={() => openWhyModalWithData()}
              onNavigateToScan={() => {
                setIsSimpleMode(false);
                setActiveTab('crop-doctor');
              }}
            />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'overview' && (
                <OverviewPage 
                  onNavigateToTab={(tab) => setActiveTab(tab)} 
                  onOpenVoiceAssistant={() => setVoiceAssistantOpen(true)}
                  onOpenWhyModal={() => openWhyModalWithData()}
                  onOpenImpactModal={() => setImpactModalOpen(true)}
                />
              )}

              {/* Dashboard Container Wrapper */}
              {activeTab !== 'overview' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-28 pb-20">
                  {/* Feature 1: AI Farm Digital Twin */}
                  {activeTab === 'digital-twin' && (
                    <FarmDigitalTwin onOpenWhyModal={() => openWhyModalWithData()} />
                  )}

                  {/* Feature 6 & 7: Command Center with FPO Multi-tier & Early Warning */}
                  {activeTab === 'dashboard' && (
                    <DashboardHome 
                      onNavigateToTab={(tab) => setActiveTab(tab)} 
                      onOpenWhyModal={() => openWhyModalWithData()}
                    />
                  )}

                  {/* Feature 3: Satellite Page with Farm Time Machine */}
                  {activeTab === 'satellite' && <SatellitePage />}

                  {/* Crop Doctor ViT Diagnostics */}
                  {activeTab === 'crop-doctor' && <CropDoctorPage />}

                  {/* Feature 4: Weather Page with Climate Scenario Simulator */}
                  {activeTab === 'weather' && <WeatherPage />}

                  {/* Soil Health Intelligence */}
                  {activeTab === 'soil' && <SoilPage />}

                  {/* Regenerative Cropping */}
                  {activeTab === 'regenerative' && <RegenerativePage />}

                  {/* Feature 11: Residue Circular Economy Map */}
                  {activeTab === 'agricycle' && <ResiduePage />}

                  {/* Feature 13: AI Advisory with Model Transparency & Reasoning Chain */}
                  {activeTab === 'ai-advisory' && (
                    <AiAdvisoryPage onOpenWhyModal={() => openWhyModalWithData()} />
                  )}

                  {/* Feature 10 & 6: India Command Center with 6-layer Heatmap */}
                  {activeTab === 'india-command' && <IndiaCommandCenter />}

                  {/* Feature 16: BRICS Agricultural Model Exchange */}
                  {activeTab === 'brics' && <BricsNetworkPage />}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default App;

