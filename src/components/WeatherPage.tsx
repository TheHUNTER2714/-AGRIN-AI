import React, { useState } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  Calendar,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Info
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const WeatherPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);

  // Climate Scenario Simulator state
  const [climateTemp, setClimateTemp] = useState<number>(2); // +2°C
  const [climateRain, setClimateRain] = useState<number>(-20); // -20%
  const [isSimulatingClimate, setIsSimulatingClimate] = useState(false);
  const [simulatedResults, setSimulatedResults] = useState({
    currentRisk: 42,
    futureRisk: 67,
    statusText: '⚠️ Increased water stress predicted in root zone. High evapotranspiration requires soil mulching.',
    statusType: 'warning' as 'warning' | 'critical' | 'stable',
  });

  const forecast = [
    { day: 'Today (Sep 27)', temp: '24°C', rain: '82%', icon: CloudRain, condition: 'Convective Storm', advice: 'Delay furrow irrigation. Secure drainage bunds.' },
    { day: 'Tomorrow (Sep 28)', temp: '22°C', rain: '65%', icon: CloudRain, condition: 'Scattered Showers', advice: 'Avoid chemical spray; waterlogged soil risks wheel compaction.' },
    { day: 'Mon (Sep 29)', temp: '26°C', rain: '15%', icon: CloudSun, condition: 'Clearing Skies', advice: 'Prime window: Broadcast neem-coated urea on damp soil.' },
    { day: 'Tue (Sep 30)', temp: '28°C', rain: '5%', icon: CloudSun, condition: 'Sunny / Dry', advice: 'Resume normal weeding and foliar micronutrient applications.' },
    { day: 'Wed (Oct 01)', temp: '29°C', rain: '0%', icon: CloudSun, condition: 'Clear', advice: 'Monitor soil moisture sensor in Plot B.' },
    { day: 'Thu (Oct 02)', temp: '30°C', rain: '0%', icon: CloudSun, condition: 'Clear', advice: 'High evapotranspiration. Schedule drip run if deficit > 30%.' },
    { day: 'Fri (Oct 03)', temp: '29°C', rain: '10%', icon: CloudSun, condition: 'Partly Cloudy', advice: 'Normal seasonal growth conditions.' },
  ];

  const current = forecast[selectedDay];

  const handleSimulateClimate = () => {
    soundFx.playScanTone();
    setIsSimulatingClimate(true);

    setTimeout(() => {
      setIsSimulatingClimate(false);
      soundFx.playChime(640, 0.35);

      // Recalculate
      const calculatedFutureRisk = Math.min(95, Math.max(20, Math.round(42 + climateTemp * 8 - climateRain * 0.45)));
      let text = '⚠️ Increased water stress predicted in root zone.';
      let type: 'warning' | 'critical' | 'stable' = 'warning';

      if (climateRain <= -25 && climateTemp >= 2.5) {
        text = '🚨 Severe drought anomaly: Critical soil moisture exhaustion. Drought-resistant variety transition recommended.';
        type = 'critical';
      } else if (climateRain >= 20 && climateTemp <= 1) {
        text = '🟢 Favorable precipitation resilience: Adequate groundwater replenishment with minimal heat penalty.';
        type = 'stable';
      } else {
        text = '⚠️ Increased water stress predicted in root zone. High evapotranspiration requires soil mulching.';
        type = 'warning';
      }

      setSimulatedResults({
        currentRisk: 42,
        futureRisk: calculatedFutureRisk,
        statusText: text,
        statusType: type,
      });
    }, 700);
  };

  const handleResetClimate = () => {
    soundFx.playClick();
    setClimateTemp(0);
    setClimateRain(0);
    setSimulatedResults({
      currentRisk: 42,
      futureRisk: 42,
      statusText: 'Current baseline climate balance maintained.',
      statusType: 'stable',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <CloudSun className="w-4 h-4 text-emerald-400" />
            <span>HYPERLOCAL DOPPLER RADAR & ECMWF ENSEMBLE</span>
            <span>•</span>
            <span>MICRO-STATION ID: PRATAP-04</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            Agricultural Weather Intelligence
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Translating meteorological dynamics into precise farm scheduling decisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <span>RAIN RADAR ACTIVE: 35mm PROBABLE</span>
          </div>
        </div>
      </div>

      {/* Main Weather Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Current Micro-Climate Gauge & AI Interpretation */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400 uppercase">
              OBSERVED CONDITIONS — {current.day}
            </span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              {current.condition}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 font-mono">
              <span className="text-[10px] text-neutral-400 block mb-1">AIR TEMP</span>
              <div className="flex items-baseline gap-1 text-2xl font-bold text-[#F9F8F3]">
                <Thermometer className="w-5 h-5 text-amber-400 -ml-1 inline" />
                <span>{current.temp}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 font-mono">
              <span className="text-[10px] text-neutral-400 block mb-1">RAIN PROBABILITY</span>
              <div className="flex items-baseline gap-1 text-2xl font-bold text-cyan-400">
                <CloudRain className="w-5 h-5 text-cyan-400 -ml-1 inline" />
                <span>{current.rain}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 font-mono">
              <span className="text-[10px] text-neutral-400 block mb-1">RH HUMIDITY</span>
              <div className="flex items-baseline gap-1 text-2xl font-bold text-teal-300">
                <Droplets className="w-5 h-5 text-teal-400 -ml-1 inline" />
                <span>78%</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 font-mono">
              <span className="text-[10px] text-neutral-400 block mb-1">WIND VELOCITY</span>
              <div className="flex items-baseline gap-1 text-2xl font-bold text-emerald-300">
                <Wind className="w-5 h-5 text-emerald-400 -ml-1 inline" />
                <span>14 km/h</span>
              </div>
            </div>
          </div>

          {/* AI Agricultural Interpretation (Not just raw weather!) */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-black/60 border border-cyan-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI AGRICULTURAL INTERPRETATION & ACTION VERDICT</span>
            </div>
            <p className="text-sm text-[#F9F8F3] leading-relaxed">
              {current.advice}
            </p>
            <div className="text-xs text-neutral-400 font-mono pt-2 border-t border-white/10 flex items-center justify-between">
              <span>ESTIMATED IRRIGATION ENERGY SAVED: 18.4 kWh (₹1,200)</span>
              <span className="text-emerald-400 font-bold">SOIL SATURATION SAFE</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Soil Moisture Balance & Evapotranspiration */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
            Soil Hydration Matrix
          </span>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-neutral-400">Root Zone Moisture (0-30cm)</span>
                <span className="text-cyan-300 font-bold">28% (Field Capacity)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="w-[70%] h-full bg-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-neutral-400">Atmospheric Evapotranspiration (ET0)</span>
                <span className="text-emerald-300 font-bold">3.1 mm/day (Low)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="w-[35%] h-full bg-emerald-400" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="text-neutral-400 text-[10px]">DEW POINT & FOLIAR MOISTURE:</div>
              <div className="text-emerald-300 font-semibold">18.2°C (Morning dew duration: 4.2 hours)</div>
              <p className="text-[11px] text-neutral-400 font-sans">
                Foliar moisture window increases fungal spore germination risk. Monitor Wheat Plot A flag leaves.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 4: AI CLIMATE SCENARIO SIMULATOR */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>FEATURE 04 &bull; WHAT-IF CLIMATE SIMULATION</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[#F9F8F3]">
              AI Climate Scenario Simulator
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetClimate}
              title="Reset Climate Sliders"
              className="p-2 rounded-xl glass-panel-subtle hover:border-amber-500/40 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
            </button>
            <div className="px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono">
              Forward 5-Year Horizon
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-6 font-mono text-xs">
            {/* Slider 1: Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-amber-400" />
                  <span>Temperature Anomaly:</span>
                </span>
                <span className="text-base font-bold text-amber-300">
                  {climateTemp > 0 ? `+${climateTemp}°C` : `${climateTemp}°C`}
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="4"
                step="0.5"
                value={climateTemp}
                onChange={(e) => {
                  soundFx.playClick();
                  setClimateTemp(parseFloat(e.target.value));
                }}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Cooler (-2°C)</span>
                <span>Normal (0°C)</span>
                <span>+2°C (IPCC 1.5 Target)</span>
                <span>Heatwave (+4°C)</span>
              </div>
            </div>

            {/* Slider 2: Rainfall */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                  <span>Precipitation / Rainfall Change:</span>
                </span>
                <span className="text-base font-bold text-cyan-300">
                  {climateRain > 0 ? `+${climateRain}%` : `${climateRain}%`}
                </span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                step="5"
                value={climateRain}
                onChange={(e) => {
                  soundFx.playClick();
                  setClimateRain(parseInt(e.target.value, 10));
                }}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Severe Deficit (-40%)</span>
                <span>-20% Deficit</span>
                <span>Baseline (0%)</span>
                <span>Excess Monsoon (+40%)</span>
              </div>
            </div>

            <button
              onClick={handleSimulateClimate}
              disabled={isSimulatingClimate}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current text-black" />
              <span>{isSimulatingClimate ? 'Simulating Climate Model...' : 'Simulate Climate Impact'}</span>
            </button>
          </div>

          {/* Results Score Box (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-black/60 border border-amber-500/30 space-y-4 font-mono text-xs">
            <span className="text-neutral-400 text-[10px] uppercase tracking-wider block">
              MODEL PREDICTION OUTCOME:
            </span>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[10px] text-neutral-400 block mb-1">CURRENT RISK</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {simulatedResults.currentRisk}
                </span>
                <span className="text-[9px] text-neutral-400 block mt-0.5">Baseline Risk</span>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-amber-500/30">
                <span className="text-[10px] text-amber-300 block mb-1">FUTURE RISK</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">
                  {simulatedResults.futureRisk}
                </span>
                <span className="text-[9px] text-amber-300 block mt-0.5">Projected Risk</span>
              </div>
            </div>

            {/* Diagnostic Message */}
            <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
              simulatedResults.statusType === 'critical'
                ? 'bg-red-950/30 border-red-500/30 text-red-300'
                : simulatedResults.statusType === 'warning'
                ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[11px] font-sans leading-relaxed">
                {simulatedResults.statusText}
              </p>
            </div>

            {/* Hackathon Disclaimer */}
            <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 pt-1">
              <Info className="w-3 h-3 text-neutral-400 shrink-0" />
              <span>*Clearly labeled as a scenario simulation based on AgriN model assumptions.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Agricultural Forecast Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <h3 className="font-display font-bold text-lg text-[#F9F8F3]">
            7-Day Agronomic Forecast
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
          {forecast.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = selectedDay === idx;
            return (
              <div
                key={item.day}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedDay(idx);
                }}
                className={`p-4 rounded-2xl cursor-pointer border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/60 to-emerald-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105'
                    : 'glass-panel-subtle hover:border-emerald-500/30'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block mb-2">{item.day}</span>
                  <Icon className={`w-6 h-6 mb-2 ${parseInt(item.rain) > 50 ? 'text-cyan-400' : 'text-amber-400'}`} />
                  <div className="text-lg font-bold text-[#F9F8F3]">{item.temp}</div>
                  <div className="text-xs font-mono text-cyan-300">{item.rain} rain</div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-neutral-400 font-mono truncate">
                  {item.condition}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
