import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Upload, 
  ShieldCheck, 
  Leaf, 
  FileText, 
  Share2
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface SampleCrop {
  id: string;
  name: string;
  crop: string;
  condition: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'None';
  pathogen: string;
  symptoms: string[];
  organicRemedy: string;
  chemicalRemedy: string;
  prevention: string;
  imageColor: string;
}

export const CropDoctorPage: React.FC = () => {
  const samples: SampleCrop[] = [
    {
      id: 'wheat-rust',
      name: 'Sample 1: Wheat Stripe Rust (Puccinia striiformis)',
      crop: 'Sharbati Wheat (Triticum aestivum)',
      condition: 'Yellow Stripe Rust',
      confidence: 96.4,
      severity: 'Moderate',
      pathogen: 'Fungal Basidiomycete',
      symptoms: [
        'Linear yellow-orange uredinial pustules along leaf veins',
        'Stunted grain development if left untreated',
        'Early chlorosis spreading to flag leaf',
      ],
      organicRemedy: 'Neem-seed kernel extract (5%) + bio-fungicide Trichoderma viride (10g/L spray in evening).',
      chemicalRemedy: 'Propiconazole 25% EC @ 1ml/L water or Tebuconazole 250 EC @ 1.25ml/L.',
      prevention: 'Avoid excessive nitrogen fertilization during high humidity; maintain 20cm row spacing for ventilation.',
      imageColor: 'from-amber-900/60 via-amber-700/40 to-emerald-950/60',
    },
    {
      id: 'tomato-blight',
      name: 'Sample 2: Tomato Early Blight (Alternaria solani)',
      crop: 'Hybrid Tomato (Solanum lycopersicum)',
      condition: 'Early Blight Foliar Necrosis',
      confidence: 94.8,
      severity: 'Severe',
      pathogen: 'Fungal Ascomycota',
      symptoms: [
        'Concentric brown-black circular rings with yellow halos (target spots)',
        'Premature defoliation starting on lowest mature leaves',
        'Stem lesions near soil line',
      ],
      organicRemedy: 'Copper oxychloride 50% WP (organic permitted) + Bacillus subtilis soil drench.',
      chemicalRemedy: 'Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 23% SC @ 1ml/L.',
      prevention: 'Drip irrigation instead of overhead sprinklers; mulch beds with paddy straw to prevent spore splash.',
      imageColor: 'from-stone-900/70 via-red-950/40 to-emerald-950/60',
    },
    {
      id: 'healthy-rice',
      name: 'Sample 3: Basmati Rice (Healthy Control)',
      crop: 'Pusa Basmati 1121 (Oryza sativa)',
      condition: 'Optimal Canopy Vigour',
      confidence: 99.1,
      severity: 'None',
      pathogen: 'No pathogen detected',
      symptoms: [
        'Uniform emerald green pigmentation',
        'Intact leaf cuticle and vascular ribs',
        'Zero foliar lesions or necrotic margins',
      ],
      organicRemedy: 'Apply Jeevamrit or fermented bio-fertilizer once every 14 days to sustain soil microbiome.',
      chemicalRemedy: 'No chemical intervention required.',
      prevention: 'Maintain alternate wetting and drying (AWD) water management.',
      imageColor: 'from-emerald-950/80 via-emerald-800/50 to-lime-950/60',
    },
  ];

  const [selectedSample, setSelectedSample] = useState<SampleCrop>(samples[0]);
  const [scanning, setScanning] = useState(false);
  const [diagnosisComplete, setDiagnosisComplete] = useState(true);

  const handleStartScan = (sample: SampleCrop) => {
    soundFx.playScanTone();
    setSelectedSample(sample);
    setScanning(true);
    setDiagnosisComplete(false);

    setTimeout(() => {
      setScanning(false);
      setDiagnosisComplete(true);
      soundFx.playChime(680, 0.4);
    }, 2200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>FOLIAR COMPUTER VISION & PATHOLOGY ENGINE</span>
            <span>•</span>
            <span>VISION TRANSFORMER ViT-H/14</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            AI Crop Doctor
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Real-time microscopic symptom segmentation and dual organic/conventional prescription.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer shadow-lg">
            <Upload className="w-4 h-4" />
            <span>Upload Leaf Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={() => handleStartScan(samples[0])} 
            />
          </label>
        </div>
      </div>

      {/* Preset Test Leaf Specimens */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-xs font-mono text-neutral-400">TEST LEAF SPECIMENS:</span>
        <div className="flex flex-wrap gap-2">
          {samples.map((s) => (
            <button
              key={s.id}
              onClick={() => handleStartScan(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                selectedSample.id === s.id
                  ? 'bg-emerald-500 text-black font-semibold shadow-md'
                  : 'glass-panel-subtle text-neutral-300 hover:text-white'
              }`}
            >
              {s.crop.split(' ')[0]}: {s.condition}
            </button>
          ))}
        </div>
      </div>

      {/* Scanning Stage & Diagnostic Prescription */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Interactive Scanner Canvas */}
        <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>SPECIMEN VIEWPORT</span>
            <span className="text-emerald-400 font-semibold">
              {scanning ? 'SCANNING CELLULAR MATRIX...' : 'SEGMENTATION READY'}
            </span>
          </div>

          {/* Leaf Display with Laser Scanner */}
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
            {/* Simulated leaf background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${selectedSample.imageColor}`} />
            <div className="absolute inset-0 satellite-grid opacity-30 pointer-events-none" />

            {/* Scanning Laser Line */}
            {scanning && <div className="scanner-line" />}

            {/* Leaf Illustration Graphic */}
            <div className="relative z-10 flex flex-col items-center">
              <svg className="w-48 h-48 drop-shadow-[0_0_25px_rgba(16,185,129,0.3)]" viewBox="0 0 100 100" fill="none">
                <path
                  d="M50 10 C75 10 90 35 90 65 C90 85 70 95 50 95 C30 95 10 85 10 65 C10 35 25 10 50 10 Z"
                  fill="#10B981"
                  opacity={selectedSample.id === 'healthy-rice' ? '0.85' : '0.6'}
                />
                <path d="M50 20 C50 70 35 85 50 92" stroke="#ECE8DD" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M50 45 C65 40 75 48 80 52" stroke="#ECE8DD" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <path d="M50 60 C35 55 25 62 20 68" stroke="#ECE8DD" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

                {/* Pathogen Spot Markers if diseased */}
                {selectedSample.severity !== 'None' && (
                  <>
                    <circle cx="62" cy="48" r="7" fill="#F59E0B" opacity="0.85" className="animate-pulse" />
                    <circle cx="38" cy="65" r="5" fill="#EF4444" opacity="0.85" className="animate-pulse" />
                    <circle cx="55" cy="72" r="6" fill="#F59E0B" opacity="0.85" />
                  </>
                )}
              </svg>

              {/* Bounding Box Simulation */}
              {diagnosisComplete && selectedSample.severity !== 'None' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-8 border-2 border-dashed border-red-500/70 rounded-xl pointer-events-none flex items-start justify-end p-2"
                >
                  <span className="bg-red-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    ROI: {selectedSample.condition}
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs font-mono text-neutral-400">
            <span>Crop: {selectedSample.crop}</span>
            <button
              onClick={() => handleStartScan(selectedSample)}
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              Re-Scan Specimen &rarr;
            </button>
          </div>
        </div>

        {/* Right: Pathological Diagnosis & Dual Prescription */}
        <AnimatePresence mode="wait">
          {diagnosisComplete && (
            <motion.div
              key={selectedSample.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6"
            >
              {/* Disease Summary Badge */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                    Diagnostic Report
                  </span>
                  <h3 className="font-display font-bold text-2xl text-[#F9F8F3] mt-0.5">
                    {selectedSample.condition}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Pathogen: {selectedSample.pathogen}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-display font-extrabold text-emerald-400">
                    {selectedSample.confidence}%
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    selectedSample.severity === 'Severe'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : selectedSample.severity === 'Moderate'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {selectedSample.severity} Severity
                  </span>
                </div>
              </div>

              {/* Observed Symptoms */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-neutral-300 font-semibold">
                  CLINICAL SYMPTOM PROFILE:
                </span>
                <ul className="space-y-1.5 text-xs text-neutral-300/80">
                  {selectedSample.symptoms.map((sym, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dual Prescription: Organic & Conventional */}
              <div className="space-y-3 pt-2">
                {/* Organic Treatment */}
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span>ORGANIC & BIO-CONTROL PRESCRIPTION:</span>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed">
                    {selectedSample.organicRemedy}
                  </p>
                </div>

                {/* Chemical Treatment */}
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>CONVENTIONAL TARGETED REMEDY:</span>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed">
                    {selectedSample.chemicalRemedy}
                  </p>
                </div>

                {/* Cultural Prevention */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-400">
                  <strong className="text-neutral-300">Cultural Prevention: </strong>
                  {selectedSample.prevention}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => soundFx.playChime(520, 0.2)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-emerald-300 text-xs font-medium cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Rx PDF</span>
                </button>
                <button
                  onClick={() => soundFx.playClick()}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel-subtle hover:border-emerald-500/40 text-neutral-300 hover:text-white text-xs font-medium cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share with KVK Officer</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
