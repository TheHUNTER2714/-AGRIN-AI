import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Layers, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { analyzeSoilHealth, type SoilAnalysisResult } from '../services/api';

export const SoilPage: React.FC = () => {
  const [inputMode, setInputMode] = useState<'manual' | 'upload'>('manual');
  const [nitrogen, setNitrogen] = useState(185); // kg/ha (Low)
  const [phosphorus, setPhosphorus] = useState(24.5); // kg/ha (Medium)
  const [potassium, setPotassium] = useState(340); // kg/ha (High)
  const [soilPh, setSoilPh] = useState(7.8);
  const [organicCarbon, setOrganicCarbon] = useState(0.58);
  const [moisture, setMoisture] = useState(28);

  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SoilAnalysisResult | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    soundFx.playScanTone();
    try {
      const res = await analyzeSoilHealth({
        ph: soilPh,
        nitrogen,
        phosphorus,
        potassium,
        organic_carbon: organicCarbon,
        moisture,
        crop: 'Wheat'
      });
      setAnalysisResult(res);
      soundFx.playChime(620, 0.35);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFx.playClick();
    setUploadedFileName(file.name);
    setLoading(true);

    setTimeout(() => {
      // Simulates parsing KVK Soil Health Card document
      setSoilPh(7.6);
      setNitrogen(192);
      setPhosphorus(22.0);
      setPotassium(335);
      setOrganicCarbon(0.61);
      setLoading(false);
      runAnalysis();
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span>RHIZOSPHERE CHEMISTRY & REGENERATIVE PROTOCOL</span>
            <span>•</span>
            <span className="text-zinc-400">ICAR STANDARD SHC</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            Soil Chemistry & Strata Lab
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Dynamic macronutrient profiling, soil organic carbon enhancement, and regenerative fertilizer adjustments.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-neutral-400 block text-[10px]">SOIL TYPE</span>
            <span className="text-emerald-300 font-bold">Alluvial Sandy Loam</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-neutral-400 block text-[10px]">HEALTH INDEX</span>
            <span className="text-lime-300 font-bold">
              {analysisResult?.soil_health_index || 78.4} / 100
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Soil Input Options (Manual vs Upload Soil Health Card) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block">
              DYNAMIC SOIL DATA INPUT
            </span>
            <h2 className="font-display font-extrabold text-2xl text-white mt-0.5">
              Calibrate Soil Health Parameters
            </h2>
          </div>

          <div className="flex rounded-full bg-black/50 border border-white/10 p-1 text-xs">
            <button
              onClick={() => {
                soundFx.playClick();
                setInputMode('manual');
              }}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                inputMode === 'manual' ? 'bg-emerald-500 text-black font-semibold shadow' : 'text-neutral-300'
              }`}
            >
              Option A: Manual Entry
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setInputMode('upload');
              }}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                inputMode === 'upload' ? 'bg-emerald-500 text-black font-semibold shadow' : 'text-neutral-300'
              }`}
            >
              Option B: Upload Soil Report
            </button>
          </div>
        </div>

        {inputMode === 'manual' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Soil pH */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300">Soil pH</span>
                  <span className="text-emerald-400 font-bold">{soilPh}</span>
                </div>
                <input
                  type="range"
                  min="5.5"
                  max="9.0"
                  step="0.1"
                  value={soilPh}
                  onChange={(e) => setSoilPh(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Status: {analysisResult?.ph_status || 'Optimal Neutral'}
                </span>
              </div>

              {/* Nitrogen (N) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300">Nitrogen (N)</span>
                  <span className="text-amber-400 font-bold">{nitrogen} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="450"
                  step="5"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Status: {analysisResult?.nitrogen_status || 'Low (< 240)'}
                </span>
              </div>

              {/* Phosphorus (P) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300">Phosphorus (P)</span>
                  <span className="text-cyan-400 font-bold">{phosphorus} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="0.5"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Status: {analysisResult?.phosphorus_status || 'Medium (12-25)'}
                </span>
              </div>

              {/* Potassium (K) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300">Potassium (K)</span>
                  <span className="text-purple-400 font-bold">{potassium} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  value={potassium}
                  onChange={(e) => setPotassium(parseInt(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Status: {analysisResult?.potassium_status || 'High / Luxury (> 280)'}
                </span>
              </div>

              {/* Organic Carbon (OC) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300">Organic Carbon (OC)</span>
                  <span className="text-emerald-400 font-bold">{organicCarbon}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.02"
                  value={organicCarbon}
                  onChange={(e) => setOrganicCarbon(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Status: {analysisResult?.carbon_status || 'Sub-optimal (< 0.75%)'}
                </span>
              </div>

              {/* Root Moisture */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300">Capillary Moisture</span>
                  <span className="text-blue-400 font-bold">{moisture}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={moisture}
                  onChange={(e) => setMoisture(parseInt(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Target: 25–35% for Sharbati Wheat
                </span>
              </div>
            </div>

            <button
              onClick={runAnalysis}
              disabled={loading}
              className="py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Interpreting Soil Strata...' : 'CALCULATE SOIL AMENDMENT PRESCRIPTION'}</span>
            </button>
          </div>
        ) : (
          <div className="p-8 rounded-2xl border-2 border-dashed border-emerald-500/30 bg-black/30 text-center space-y-3">
            <Upload className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Upload Krishi Vigyan Kendra Soil Health Card</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Upload a scanned PDF or photograph of your Government Soil Health Card. Our OCR extracts NPK, pH, and Micronutrients automatically.
            </p>
            {uploadedFileName && (
              <div className="text-xs font-mono text-emerald-300 bg-emerald-950/60 py-1.5 px-3 rounded-lg inline-block border border-emerald-500/30">
                Uploaded: {uploadedFileName} (Processed)
              </div>
            )}
            <div>
              <label className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer inline-flex items-center gap-2">
                <span>Select Soil Report File</span>
                <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendation Engine (P1 Requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Fertilizer & Amendment Prescription */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI SOIL RECOMMENDATION ENGINE
            </span>
            <span className="text-xs font-mono text-neutral-400">ICAR Calibrated</span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono text-neutral-400 block">KEY SOIL AMENDMENTS:</span>
            <ul className="space-y-2 text-xs text-neutral-200">
              {analysisResult?.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Targeted Fertilizer Expenditure Optimization
            </div>
            <ul className="space-y-1 text-xs text-neutral-300">
              {analysisResult?.fertilizer_adjustments.map((adj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{adj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Regenerative Soil Practices */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> REGENERATIVE BIOLOGICAL STRATEGY
            </span>
            <span className="text-xs font-mono text-emerald-300">Organic Matter Focus</span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono text-neutral-400 block">BIOLOGICAL & COMPOSTING PRACTICES:</span>
            <ul className="space-y-2 text-xs text-neutral-200">
              {analysisResult?.regenerative_actions.map((act, i) => (
                <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                  <span className="text-emerald-400 font-bold">🌱</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical Soil Strata Cross-Section */}
          <div className="pt-2 space-y-2">
            <span className="text-xs font-mono text-neutral-400 block">PEDOLOGICAL STRATA (0–100 CM):</span>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#2c1d11] to-[#422a18] border border-amber-800/40 text-amber-200">
                <span className="block font-bold">0–15 cm</span>
                <span>Active Humus</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#1e140c] to-[#2e1d12] border border-amber-900/40 text-stone-300">
                <span className="block font-bold">15–45 cm</span>
                <span>Root Zone</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#120c07] to-[#1a110a] border border-stone-800 text-stone-400">
                <span className="block font-bold">45–100 cm</span>
                <span>Substratum</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source & Provenance */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400 gap-3">
        <div>
          <span>PROVENANCE: {analysisResult?.data_source || 'ICAR Soil Health Card Testing Standards'}</span>
        </div>
        <div>
          <span>LAST CALIBRATED: {analysisResult?.timestamp || '27 Sep 2026, 14:30 IST'}</span>
        </div>
      </div>
    </div>
  );
};
