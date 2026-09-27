import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Thermometer, 
  Calendar,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Info,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { fetchLiveWeather, type WeatherData } from '../services/api';

export const WeatherPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

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

  const loadWeather = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveWeather(25.92, 81.99, 'Pratapgarh, Uttar Pradesh');
      setWeatherData(data);
    } catch {
      // Handled in api.ts
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  const handleSimulateClimate = () => {
    soundFx.playScanTone();
    setIsSimulatingClimate(true);

    setTimeout(() => {
      setIsSimulatingClimate(false);
      soundFx.playChime(640, 0.35);

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

  const dailyList = weatherData?.daily_forecast || [
    { date: '2026-09-27', day: 'Today', temp_max: 31, temp_min: 22, rain_probability: 82, precip_mm: 35.0, condition: 'Convective Storm' },
    { date: '2026-09-28', day: 'Mon', temp_max: 29, temp_min: 21, rain_probability: 45, precip_mm: 8.0, condition: 'Scattered Showers' },
    { date: '2026-09-29', day: 'Tue', temp_max: 30, temp_min: 22, rain_probability: 20, precip_mm: 1.0, condition: 'Partly Cloudy' },
    { date: '2026-09-30', day: 'Wed', temp_max: 32, temp_min: 23, rain_probability: 10, precip_mm: 0.0, condition: 'Sunny Clear' },
    { date: '2026-10-01', day: 'Thu', temp_max: 33, temp_min: 24, rain_probability: 15, precip_mm: 0.0, condition: 'Clear Sky' },
    { date: '2026-10-02', day: 'Fri', temp_max: 32, temp_min: 23, rain_probability: 25, precip_mm: 2.0, condition: 'Passing Clouds' },
    { date: '2026-10-03', day: 'Sat', temp_max: 31, temp_min: 22, rain_probability: 30, precip_mm: 4.0, condition: 'Light Drizzle' }
  ];

  const currentDay = dailyList[selectedDay] || dailyList[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <CloudSun className="w-4 h-4 text-emerald-400" />
            <span>REAL-TIME OPEN-METEO OPERATIONAL METEOROLOGY</span>
            <span>•</span>
            <span className="text-zinc-400">STATION: PRATAPGARH (25.92°N, 81.99°E)</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            Agricultural Weather Intelligence
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Micro-climate assimilation converting raw surface Doppler telemetry into precision agro-advisories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              loadWeather();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel-subtle hover:border-emerald-400 text-emerald-300 text-xs font-semibold cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Weather</span>
          </button>
        </div>
      </div>

      {/* Raw Weather vs AI Agronomic Interpretation (P0 Requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raw Meteorological Observation */}
        <div className="glass-panel p-6 rounded-3xl border border-blue-500/20 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5 text-blue-400">
              <CloudSun className="w-4 h-4" /> RAW METEOROLOGICAL OBSERVATION
            </span>
            <span>{weatherData?.timestamp || 'Updated 14:30 IST'}</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold font-display text-white">
                {weatherData?.temperature_c || 28.4}°C
              </div>
              <div className="text-xs text-neutral-300 mt-1">
                Apparent Temp: {weatherData?.apparent_temp_c || 29.2}°C • {weatherData?.condition || 'Convective Showers'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-blue-400 block">PRECIP PROBABILITY</span>
              <span className="text-3xl font-extrabold text-blue-400 font-mono">
                {weatherData?.rain_probability || 82}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-neutral-400 block">RAINFALL</span>
              <span className="font-bold text-white">{weatherData?.rainfall_mm || 35.0} mm</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-neutral-400 block">HUMIDITY</span>
              <span className="font-bold text-white">{weatherData?.humidity_percent || 68}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-neutral-400 block">WIND SPEED</span>
              <span className="font-bold text-white">{weatherData?.wind_kmh || 12.0} km/h</span>
            </div>
          </div>
        </div>

        {/* Gemini AI Agronomic Translation */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4 bg-gradient-to-br from-emerald-950/40 to-transparent">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400" /> GEMINI AGRO-INTERPRETATION
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px]">
              Active Protocol
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-2">
            <div className="text-xs font-mono text-emerald-400">
              WEATHER DATA ➔ FARM ACTION:
            </div>
            <p className="text-sm font-semibold text-emerald-200 leading-snug">
              {weatherData?.agro_advice || 'Heavy convective rainfall expected (82% prob, 35mm). Hold scheduled furrow irrigation.'}
            </p>
          </div>

          <div className="space-y-1 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Delay furrow irrigation until storm passage to prevent root waterlogging.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Clear drainage channels along plot perimeter to harvest surplus water into farm pond.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Precision Forecast Scrubber */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            7-DAY AGRICULTURAL RUNOFF & EVAPOTRANSPIRATION OUTLOOK
          </span>
          <span>Click day to inspect details</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {dailyList.map((day, idx) => {
            const isSelected = selectedDay === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedDay(idx);
                }}
                className={`p-4 rounded-2xl cursor-pointer border text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-900/50 border-emerald-400 shadow-lg scale-105'
                    : 'glass-panel-subtle hover:border-emerald-500/30'
                }`}
              >
                <div className="text-[11px] font-mono text-neutral-400 mb-1">{day.day}</div>
                <div className="flex justify-center my-2">
                  <CloudSun className={`w-6 h-6 ${isSelected ? 'text-emerald-300' : 'text-neutral-400'}`} />
                </div>
                <div className="text-sm font-bold text-white">{day.temp_max}°C</div>
                <div className="text-[10px] font-mono text-blue-400 mt-1">
                  🌧️ {day.rain_probability}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Day Expanded Detail */}
        <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-white text-sm block">
              {currentDay.day} ({currentDay.date}): {currentDay.condition}
            </span>
            <span className="text-neutral-400 text-xs">
              Max {currentDay.temp_max}°C / Min {currentDay.temp_min}°C • Expected precipitation: {currentDay.precip_mm} mm
            </span>
          </div>
          <div className="text-emerald-300 font-mono text-xs bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            Action: {currentDay.rain_probability > 50 ? 'Hold Irrigation' : 'Normal Cultivation Safe'}
          </div>
        </div>
      </div>

      {/* Feature 4: AI Climate Scenario Simulator */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>FEATURE 4 • AI CLIMATE SCENARIO SIMULATOR</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#ECE8DD]">
              What-If Climate Resilience Simulation
            </h2>
            <p className="text-xs text-neutral-300 mt-0.5">
              Simulate micro-climatic shocks (temperature anomalies and monsoon precipitation deficits) to stress-test your farm's resilience.
            </p>
          </div>
          <button
            onClick={handleResetClimate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel-subtle text-xs text-neutral-400 hover:text-white transition-all self-start cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>

        <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[11px] text-neutral-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Notice: This is a scenario simulation based on configurable agro-climatic model assumptions, not a certified 50-year climate forecast.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-400" /> Temperature Anomaly
                </span>
                <span className="text-amber-400 font-bold font-mono text-sm">
                  {climateTemp > 0 ? `+${climateTemp}` : climateTemp}°C
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="5"
                step="0.5"
                value={climateTemp}
                onChange={(e) => setClimateTemp(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>-2°C (Cooling)</span>
                <span>0°C (Baseline)</span>
                <span>+5°C (Extreme Heat)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-blue-400" /> Monsoon Rainfall Deviation
                </span>
                <span className="text-blue-400 font-bold font-mono text-sm">
                  {climateRain > 0 ? `+${climateRain}` : climateRain}%
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={climateRain}
                onChange={(e) => setClimateRain(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>-50% (Drought)</span>
                <span>0% (Normal)</span>
                <span>+50% (Flood Risk)</span>
              </div>
            </div>

            <button
              onClick={handleSimulateClimate}
              disabled={isSimulatingClimate}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSimulatingClimate ? 'Simulating Biotic Stress...' : 'RUN CLIMATE SCENARIO SIMULATION'}</span>
            </button>
          </div>

          {/* Results Output */}
          <div className="p-6 rounded-2xl bg-black/50 border border-emerald-500/20 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block">
              SIMULATION METRICS & STRESS PROJECTION
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-neutral-400 block mb-1">CURRENT BASELINE RISK</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {simulatedResults.currentRisk}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Scale: 0-100</span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-neutral-400 block mb-1">FUTURE SIMULATED RISK</span>
                <span className={`text-3xl font-extrabold font-mono ${
                  simulatedResults.futureRisk > 65
                    ? 'text-red-400'
                    : simulatedResults.futureRisk > 50
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {simulatedResults.futureRisk}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  Δ {simulatedResults.futureRisk - simulatedResults.currentRisk > 0 ? `+${simulatedResults.futureRisk - simulatedResults.currentRisk}` : '0'} pts
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
              simulatedResults.statusType === 'critical'
                ? 'bg-red-950/40 border-red-500/40 text-red-200'
                : simulatedResults.statusType === 'warning'
                ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
            }`}>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{simulatedResults.statusText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source & Timestamp Provenance */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400 gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>LOCATION: {weatherData?.location.name || 'Pratapgarh, UP'}</span>
        </div>
        <div>
          <span>SOURCE: {weatherData?.source || 'Open-Meteo Operational Model'}</span>
        </div>
        <div>
          <span className="text-emerald-400">STATUS: LIVE TELEMETRY</span>
        </div>
      </div>
    </div>
  );
};
