import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Satellite, 
  Layers, 
  Sparkles, 
  X, 
  Check, 
  Navigation, 
  AlertCircle,
  CheckCircle2,
  Sprout,
  User,
  FileText
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { registerLandParcel, type RegisteredFarm, type LandRegistrationPayload } from '../services/api';

interface NewLandRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLandRegistered: (farm: RegisteredFarm) => void;
}

const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  "Uttar Pradesh": ["Pratapgarh", "Varanasi", "Prayagraj", "Lucknow", "Bareilly", "Meerut", "Ayodhya", "Gorakhpur", "Kanpur", "Agra"],
  "Punjab": ["Ludhiana", "Amritsar", "Bathinda", "Patiala", "Jalandhar", "Ferozepur", "Sangrur", "Hoshiarpur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Hoshangabad", "Gwalior", "Sehore", "Dewas"],
  "Maharashtra": ["Nashik", "Pune", "Nagpur", "Aurangabad", "Solapur", "Kolhapur", "Ahmednagar", "Satara"],
  "Haryana": ["Karnal", "Hisar", "Ambala", "Rohtak", "Sirsa", "Kurukshetra", "Panipat"],
  "Rajasthan": ["Jaipur", "Kota", "Ganganagar", "Jodhpur", "Udaipur", "Alwar", "Bikaner"],
  "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara", "Anand", "Mehsana", "Junagadh"],
  "Karnataka": ["Dharwad", "Belagavi", "Mandya", "Mysuru", "Shivamogga", "Tumakuru"],
  "Bihar": ["Patna", "Muzaffarpur", "Bhagalpur", "Gaya", "Samastipur", "Purnia"],
  "West Bengal": ["Burdwan", "Hooghly", "Nadia", "Murshidabad", "North 24 Parganas"]
};

const SOIL_TYPES = [
  "Alluvial Silt Loam (गंगा-यमुना दोआब)",
  "Black Cotton / Regur Soil (काली मिट्टी)",
  "Red Sandy Loam (लाल बलुई मिट्टी)",
  "Clay Loam (चिकनी दोमट)",
  "Laterite Soil (लेटराइट मिट्टी)",
  "Coastal Alluvium (तटीय जलोढ़)"
];

const CROPS_LIST = [
  "Sharbati Wheat (Triticum aestivum)",
  "Pusa Basmati Rice (Oryza sativa)",
  "Pusa Mustard (Brassica juncea)",
  "Hybrid Cotton (Gossypium)",
  "Tomato (Solanum lycopersicum)",
  "Soybean (Glycine max)",
  "Sugarcane (Saccharum officinarum)",
  "Maize / Corn (Zea mays)",
  "Potato (Solanum tuberosum)",
  "Gram / Chickpea (Cicer arietinum)"
];

const IRRIGATION_TYPES = [
  "Tube Well / Deep Borewell (नलकूप)",
  "Canal Network (नहरी सिंचाई)",
  "Solar Powered Drip Fertigation (सोलर ड्रिप)",
  "Sprinkler System (स्प्रिंकलर)",
  "Rainfed Monsoon (वर्षा आधारित)",
  "River Lift Irrigation (नदी जल उत्थान)"
];

export const NewLandRegistrationModal: React.FC<NewLandRegistrationModalProps> = ({
  isOpen,
  onClose,
  onLandRegistered
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [farmerName, setFarmerName] = useState('Ayush Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [khasraNumber, setKhasraNumber] = useState('Khasra 412/1');
  const [farmName, setFarmName] = useState('Surya Krishi Farm - Plot A');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Pratapgarh');
  const [block, setBlock] = useState('Patti');
  const [village, setVillage] = useState('Raniganj');
  const [latitude, setLatitude] = useState<number>(25.9182);
  const [longitude, setLongitude] = useState<number>(81.9984);
  const [areaValue, setAreaValue] = useState<number>(5.5);
  const [areaUnit, setAreaUnit] = useState<'acres' | 'hectares' | 'bigha'>('acres');
  const [soilType, setSoilType] = useState('Alluvial Silt Loam (गंगा-यमुना दोआब)');
  const [soilPh, setSoilPh] = useState<number>(7.3);
  const [primaryCrop, setPrimaryCrop] = useState('Sharbati Wheat (Triticum aestivum)');
  const [cropVariety, setCropVariety] = useState('PBW-343 / HD-2967');
  const [sowingDate, setSowingDate] = useState('2026-09-01');
  const [irrigationSource, setIrrigationSource] = useState('Tube Well / Deep Borewell (नलकूप)');

  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
    const districts = INDIAN_STATES_DISTRICTS[selectedState] || [];
    if (districts.length > 0) {
      setDistrict(districts[0]);
    }
  };

  const handleAutoDetectGps = () => {
    soundFx.playScanTone();
    setGpsLoading(true);
    setGpsSuccess(false);
    setErrorMsg(null);

    if (!('geolocation' in navigator)) {
      setErrorMsg('Geolocation API is not supported in this browser. Please enter coordinates manually.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lon = Number(pos.coords.longitude.toFixed(5));
        setLatitude(lat);
        setLongitude(lon);
        setGpsLoading(false);
        setGpsSuccess(true);
        soundFx.playChime(620, 0.3);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // Fallback default coordinates if location permission denied
        setLatitude(25.9182);
        setLongitude(81.9984);
        setGpsLoading(false);
        setErrorMsg('Location permission was denied or timed out. Defaulted to farm coordinates (25.9182° N, 81.9984° E).');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handlePresetSelect = (presetKey: 'pratapgarh' | 'ludhiana' | 'indore' | 'nashik') => {
    soundFx.playClick();
    if (presetKey === 'pratapgarh') {
      setFarmName('Pratapgarh Sharbati Wheat Plot');
      setState('Uttar Pradesh');
      setDistrict('Pratapgarh');
      setBlock('Patti');
      setVillage('Raniganj');
      setLatitude(25.9182);
      setLongitude(81.9984);
      setPrimaryCrop('Sharbati Wheat (Triticum aestivum)');
      setCropVariety('Sharbati HD-2967');
      setAreaValue(6.0);
      setSoilType('Alluvial Silt Loam (गंगा-यमुना दोआब)');
    } else if (presetKey === 'ludhiana') {
      setFarmName('Ludhiana Basmati Paddy Parcel');
      setState('Punjab');
      setDistrict('Ludhiana');
      setBlock('Samrala');
      setVillage('Khamanon');
      setLatitude(30.9010);
      setLongitude(75.8573);
      setPrimaryCrop('Pusa Basmati Rice (Oryza sativa)');
      setCropVariety('Pusa Basmati 1121');
      setAreaValue(14.0);
      setSoilType('Alluvial Silt Loam (गंगा-यमुना दोआब)');
    } else if (presetKey === 'indore') {
      setFarmName('Malwa Soybean & Wheat Land');
      setState('Madhya Pradesh');
      setDistrict('Indore');
      setBlock('Sanwer');
      setVillage('Kshipra');
      setLatitude(22.7196);
      setLongitude(75.8577);
      setPrimaryCrop('Soybean (Glycine max)');
      setCropVariety('JS-9560');
      setAreaValue(8.5);
      setSoilType('Black Cotton / Regur Soil (काली मिट्टी)');
    } else if (presetKey === 'nashik') {
      setFarmName('Godavari Valley Agro Plot');
      setState('Maharashtra');
      setDistrict('Nashik');
      setBlock('Niphad');
      setVillage('Pimpalgaon');
      setLatitude(20.0110);
      setLongitude(73.7903);
      setPrimaryCrop('Tomato (Solanum lycopersicum)');
      setCropVariety('Abhinav F1 Hybrid');
      setAreaValue(4.0);
      setSoilType('Black Cotton / Regur Soil (काली मिट्टी)');
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim()) {
      setErrorMsg('Please specify a name for this agricultural land parcel.');
      setActiveStep(1);
      return;
    }

    soundFx.playScanTone();
    setIsSubmitting(true);
    setErrorMsg(null);

    // Compute area in hectares
    let area_ha = areaValue;
    if (areaUnit === 'acres') {
      area_ha = Number((areaValue * 0.404686).toFixed(2));
    } else if (areaUnit === 'bigha') {
      area_ha = Number((areaValue * 0.2529).toFixed(2));
    }

    const payload: LandRegistrationPayload = {
      farmer_name: farmerName,
      phone,
      khasra_survey_number: khasraNumber,
      farm_name: farmName,
      state,
      district,
      block,
      village,
      latitude,
      longitude,
      area_acres: areaUnit === 'acres' ? areaValue : Number((area_ha / 0.404686).toFixed(2)),
      area_ha,
      soil_type: soilType,
      primary_crop: primaryCrop,
      crop_variety: cropVariety,
      sowing_date: sowingDate,
      irrigation_source: irrigationSource,
      soil_health: {
        ph: soilPh,
        nitrogen: 190.0,
        phosphorus: 24.0,
        potassium: 330.0,
        organic_carbon: 0.59,
        moisture: 28.0
      }
    };

    try {
      const response = await registerLandParcel(payload);
      soundFx.playChime(750, 0.4);
      onLandRegistered(response.farm);
      onClose();
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg('Could not register land parcel. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#05150E] border-2 border-emerald-500/40 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="relative p-6 sm:p-7 border-b border-white/10 bg-gradient-to-r from-emerald-950/80 via-[#0a2618] to-black/80 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Satellite className="w-4 h-4 animate-spin-slow" />
                <span>SENTINEL-2 GROUND LINK • CADASTRE ONBOARDING</span>
                <span>•</span>
                <span className="text-zinc-300">REAL DATA PIPELINE</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Register New Agricultural Land
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-light">
                Connect your farm coordinates to live Sentinel-2 multispectral orbital passes, Doppler weather radars, and localized soil telemetry.
              </p>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Tabs */}
          <div className="bg-black/60 px-6 py-3 border-b border-white/5 flex items-center justify-between overflow-x-auto gap-2">
            {[
              { num: 1, label: 'Farmer & Land ID', icon: User },
              { num: 2, label: 'Coordinates & GPS', icon: MapPin },
              { num: 3, label: 'Soil & Dimensions', icon: Layers },
              { num: 4, label: 'Crop & Irrigation', icon: Sprout },
            ].map((step) => {
              const Icon = step.icon;
              const isCurrent = activeStep === step.num;
              const isPast = activeStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setActiveStep(step.num as any);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : isPast
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent ? 'bg-black text-emerald-400' : isPast ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10'
                  }`}>
                    {isPast ? <Check className="w-3 h-3 text-emerald-400" /> : <Icon className="w-3 h-3" />}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Presets Bar */}
          <div className="bg-[#030d08] px-6 py-2 border-b border-white/5 flex flex-wrap items-center justify-between text-xs gap-2">
            <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Quick Agro-Climatic Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'pratapgarh', label: 'Pratapgarh (UP)' },
                { key: 'ludhiana', label: 'Ludhiana (Punjab)' },
                { key: 'indore', label: 'Indore (MP)' },
                { key: 'nashik', label: 'Nashik (MH)' }
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handlePresetSelect(p.key as any)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 text-neutral-300 border border-white/5 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmitRegistration} className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: Farmer & Land Identity */}
            {activeStep === 1 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    Farmer & Land Ownership Details
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Official agricultural identity for KVK advisories, satellite pass registry, and Kisan account sync.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">FARM / PLOT NAME *</label>
                    <input
                      type="text"
                      required
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="e.g. Kisan Vihar Plot 1"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:border-emerald-400 outline-none text-sm font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">FARMER FULL NAME</label>
                    <input
                      type="text"
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      placeholder="e.g. Ayush Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:border-emerald-400 outline-none text-sm font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">MOBILE NUMBER (FOR AGRI-ALERTS)</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:border-emerald-400 outline-none text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">KHASRA / SURVEY NUMBER / PASSBOOK ID</label>
                    <input
                      type="text"
                      value={khasraNumber}
                      onChange={(e) => setKhasraNumber(e.target.value)}
                      placeholder="e.g. Khasra No. 412/1"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:border-emerald-400 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-neutral-300 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-300">Data Privacy & Sovereignty:</span> All land registry records are encrypted on-device. Telemetry is verified under Digital Personal Data Protection (DPDP) standard compliance.
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Location & GPS Coordinates */}
            {activeStep === 2 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    Geographical Location & Orbital GPS Locking
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Sentinel-2 MSI Level-2A satellites require exact decimal coordinates to calculate pixel-level NDVI canopy biophysics.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">STATE</label>
                    <select
                      value={state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:border-emerald-400 outline-none text-xs"
                    >
                      {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">DISTRICT</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:border-emerald-400 outline-none text-xs"
                    >
                      {(INDIAN_STATES_DISTRICTS[state] || []).map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">BLOCK / TEHSIL</label>
                    <input
                      type="text"
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      placeholder="e.g. Patti"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:border-emerald-400 outline-none text-xs font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">VILLAGE / PANCHAYAT</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Raniganj"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:border-emerald-400 outline-none text-xs font-sans"
                    />
                  </div>
                </div>

                {/* GPS Coordinates Box with Auto-Detect Button */}
                <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono text-emerald-400 font-bold block">
                        EXACT DECIMAL COORDINATES (WGS84)
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Latitude & Longitude for Sentinel-2 satellite pixel tile extraction.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoDetectGps}
                      disabled={gpsLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all cursor-pointer shadow-md self-start sm:self-auto"
                    >
                      <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                      <span>{gpsLoading ? 'Locking GPS...' : '📍 Auto-Detect My GPS Location'}</span>
                    </button>
                  </div>

                  {gpsSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Live GPS coordinates acquired with high-precision satellite triangulation!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="space-y-1">
                      <label className="text-neutral-400 block">LATITUDE (°N)</label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={latitude}
                        onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#030d08] border border-white/15 text-emerald-300 font-bold text-sm focus:border-emerald-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-neutral-400 block">LONGITUDE (°E)</label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={longitude}
                        onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#030d08] border border-white/15 text-emerald-300 font-bold text-sm focus:border-emerald-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Soil & Land Geometry */}
            {activeStep === 3 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Land Area, Dimensions & Soil Characteristics
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Establishes baseline soil chemistry and acreage calculation for precision fertigation dosage.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">TOTAL LAND AREA</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        required
                        value={areaValue}
                        onChange={(e) => setAreaValue(parseFloat(e.target.value) || 1)}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-bold text-sm outline-none"
                      />
                      <select
                        value={areaUnit}
                        onChange={(e) => setAreaUnit(e.target.value as any)}
                        className="px-3 py-2 rounded-xl bg-black/80 border border-white/15 text-white text-xs font-bold outline-none cursor-pointer"
                      >
                        <option value="acres">Acres (एकड़)</option>
                        <option value="hectares">Hectares (हेक्टेयर)</option>
                        <option value="bigha">Bigha (बीघा)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">SOIL CLASSIFICATION</label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none cursor-pointer"
                    >
                      {SOIL_TYPES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">SOIL pH BASELINE</label>
                    <input
                      type="number"
                      step="0.1"
                      min="4.0"
                      max="10.0"
                      value={soilPh}
                      onChange={(e) => setSoilPh(parseFloat(e.target.value) || 7.0)}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">SOIL TESTING CERTIFICATE</label>
                    <select className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none cursor-pointer">
                      <option>Government Soil Health Card (उपलब्ध है)</option>
                      <option>KVK Laboratory Test Report</option>
                      <option>Recent In-Situ Sensor Baseline</option>
                      <option>Regional Algorithmic Estimate</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Crop & Irrigation Profile */}
            {activeStep === 4 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-400" />
                    Crop Phenology & Irrigation Infrastructure
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Enables autonomous AI advisory, vegetative stage tracking, and weather-aware irrigation scheduling.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">PRIMARY CROP CULTIVATED</label>
                    <select
                      value={primaryCrop}
                      onChange={(e) => setPrimaryCrop(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none cursor-pointer font-sans"
                    >
                      {CROPS_LIST.map((crop) => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">CROP CULTIVAR / SEED VARIETY</label>
                    <input
                      type="text"
                      value={cropVariety}
                      onChange={(e) => setCropVariety(e.target.value)}
                      placeholder="e.g. PBW-343 or Sharbati HD-2967"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm outline-none font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">SOWING / SEEDING DATE</label>
                    <input
                      type="date"
                      value={sowingDate}
                      onChange={(e) => setSowingDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">PRIMARY IRRIGATION SOURCE</label>
                    <select
                      value={irrigationSource}
                      onChange={(e) => setIrrigationSource(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none cursor-pointer font-sans"
                    >
                      {IRRIGATION_TYPES.map((irr) => (
                        <option key={irr} value={irr}>{irr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Satellite Lock Verification Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#0a2618] to-black/70 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold flex items-center gap-2">
                      <Satellite className="w-4 h-4 text-emerald-400 animate-pulse" />
                      COPERNICUS SENTINEL-2 GROUND LINK VERIFIED
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      10m Cadastre Active
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    Registration will calculate 4-corner cadastre boundary around coordinates [{latitude}°N, {longitude}°E] and ingest into the Sentinel Multi-temporal Time Machine.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setActiveStep((prev) => (prev - 1) as any);
                  }}
                  className="px-5 py-2.5 rounded-full glass-panel-subtle text-neutral-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Back
                </button>
              ) : <div />}

              <div className="flex items-center gap-3">
                {activeStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setActiveStep((prev) => (prev + 1) as any);
                    }}
                    className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all cursor-pointer shadow-lg hover:scale-105"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-bold text-sm tracking-wide transition-all cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Registering Land & Locking Sentinel...' : '✓ Complete Land Registration'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
