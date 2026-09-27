import React, { useState } from 'react';
import { 
  Recycle, 
  MapPin, 
  Truck, 
  Flame, 
  Share2, 
  Building2, 
  Sprout, 
  ChevronRight,
  Layers
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const ResiduePage: React.FC = () => {
  const [crop, setCrop] = useState('Rice (Paddy Straw)');
  const [quantity, setQuantity] = useState('2.5');
  const [location, setLocation] = useState('Plot D, Ayush Farm, Pratapgarh, UP');
  const [selectedBuyer, setSelectedBuyer] = useState<'biochar' | 'biomass' | 'mushroom'>('biochar');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedStream, setSelectedStream] = useState<'biochar' | 'compost' | 'biomass' | 'mushroom'>('biochar');

  const buyers = {
    biochar: {
      name: 'Awadh Biochar Pyrolysis Co-op',
      distance: '4.2 km',
      rate: '₹1,950 / tonne',
      total: '₹4,875',
      time: 'Same-day pickup (14:30)',
      benefit: 'Returns 300kg biochar back to farmer for soil amendment',
    },
    biomass: {
      name: 'Pratapgarh Biomass Fuel Pellets Ltd',
      distance: '11.8 km',
      rate: '₹2,100 / tonne',
      total: '₹5,250',
      time: 'Tomorrow morning (09:00)',
      benefit: 'Replaces coal in industrial boilers',
    },
    mushroom: {
      name: 'Kisan Organic Mushroom Substrates',
      distance: '8.5 km',
      rate: '₹2,200 / tonne',
      total: '₹5,500',
      time: 'Next 48 hours',
      benefit: 'Used directly for high-protein oyster mushroom beds',
    },
  };

  const handleBookDispatch = () => {
    soundFx.playChime(660, 0.4);
    setBookingConfirmed(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Recycle className="w-4 h-4 text-emerald-400" />
            <span>AGRICYCLE CIRCULAR BIOMASS PLATFORM</span>
            <span>•</span>
            <span>ZERO STUBBLE BURN INITIATIVE</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9F8F3]">
            AgriCycle: Circular Economy Hub
          </h1>
          <p className="text-sm text-neutral-300 font-light mt-1">
            Turn crop stubble into high-value biochar, mushroom substrate, or biomass energy.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>AVOIDED CO2: 3.75 TONNES</span>
          </div>
        </div>
      </div>

      {/* FEATURE 11: RESIDUE CIRCULAR ECONOMY NETWORK MAP */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>FEATURE 11 &bull; CIRCULAR ECONOMY NETWORK EFFECT</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[#F9F8F3]">
              Farmers &rarr; Collection Hub &rarr; Processing Network
            </h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            Network Effect Enabled
          </div>
        </div>

        {/* Network Diagram Box */}
        <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* 1. Multiple Farmers */}
            <div className="space-y-3">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                1. CONTRIBUTING FARMERS:
              </span>
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Farmer A (Ayush)</span>
                  <span className="text-[10px] text-neutral-400">Plot D &bull; 2.5 Tonnes</span>
                </div>
                <span className="text-emerald-400 font-bold">₹4,875</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Farmer B (Ramesh)</span>
                  <span className="text-[10px] text-neutral-400">Village Belha &bull; 3.8 Tonnes</span>
                </div>
                <span className="text-emerald-400 font-bold">₹7,410</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Farmer C (Sunita)</span>
                  <span className="text-[10px] text-neutral-400">Block Patti &bull; 1.8 Tonnes</span>
                </div>
                <span className="text-emerald-400 font-bold">₹3,510</span>
              </div>
            </div>

            {/* 2. Collection Hub */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-teal-950/40 to-emerald-950/60 border border-teal-500/40 text-center space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-400/50 mx-auto flex items-center justify-center text-teal-300">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-teal-400 uppercase tracking-widest block font-bold">
                  CENTRAL LOGISTICS
                </span>
                <div className="font-display font-bold text-base text-[#F9F8F3] mt-0.5">
                  Awadh Collection Hub
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">
                  8.1 Tonnes Aggregated Today
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] text-emerald-300">
                Automated Fleet Dispatch
              </div>
            </div>

            {/* 3. Circular Utilization Channels */}
            <div className="space-y-3">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                3. MULTIPLE UTILIZATION CHANNELS:
              </span>

              {[
                { id: 'biochar', label: '🌱 Biochar Pyrolysis', desc: 'Restores degraded soil carbon', icon: Sprout },
                { id: 'compost', label: '🧪 Aerobic Bio-Compost', desc: 'Organic microbial inoculant', icon: Layers },
                { id: 'biomass', label: '⚡ Biomass Boiler Pellets', desc: 'Industrial coal replacement', icon: Flame },
                { id: 'mushroom', label: '🍄 Mushroom Substrates', desc: 'High-protein oyster beds', icon: Building2 },
              ].map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => setSelectedStream(channel.id as typeof selectedStream)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedStream === channel.id
                      ? 'bg-emerald-900/40 border-emerald-400 shadow-md'
                      : 'bg-black/30 border-white/5 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <channel.icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-white block">{channel.label}</span>
                      <span className="text-[10px] text-neutral-400">{channel.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Logistics Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input Form */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-6">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
            Residue Deposit Specification
          </span>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-neutral-400 block mb-1.5 font-bold">CROP SPECIES</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-black/50 border border-emerald-500/30 text-[#ECE8DD] focus:outline-none focus:border-emerald-400"
              >
                <option value="Rice (Paddy Straw)">Rice (Paddy Straw / Parali)</option>
                <option value="Wheat Stubble">Wheat Stubble</option>
                <option value="Sugarcane Bagasse">Sugarcane Bagasse & Trash</option>
                <option value="Mustard Stalks">Mustard Woody Stalks</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1.5 font-bold">ESTIMATED QUANTITY (TONNES)</label>
              <input
                type="number"
                step="0.5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-black/50 border border-emerald-500/30 text-[#ECE8DD] focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1.5 font-bold">FIELD COLLECTION LOCATION</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 rounded-xl bg-black/50 border border-emerald-500/30 text-[#ECE8DD] focus:outline-none focus:border-emerald-400"
                />
                <MapPin className="w-4 h-4 text-emerald-400 absolute left-3" />
              </div>
            </div>
          </div>

          {/* Select Buyer Target */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono text-neutral-300 font-bold block">
              MATCHED UTILIZATION FACILITIES:
            </span>

            <div className="space-y-2.5">
              {[
                { id: 'biochar', ...buyers.biochar },
                { id: 'biomass', ...buyers.biomass },
                { id: 'mushroom', ...buyers.mushroom },
              ].map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedBuyer(b.id as unknown as typeof selectedBuyer);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedBuyer === b.id
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-black/30 border-white/10 hover:border-emerald-500/30'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm text-[#ECE8DD]">{b.name}</div>
                    <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      Distance: <span className="text-emerald-400">{b.distance}</span> • Rate: {b.rate}
                    </div>
                    <div className="text-[10px] text-emerald-300/80 mt-1">{b.benefit}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-[#F9F8F3]">{b.total}</span>
                    <div className="text-[9px] text-neutral-400 font-mono">Estimated Payout (Indicative Rate)</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[10px] font-mono text-neutral-400 mt-2">
              * Note: Demonstrates circular economy workflow with simulated demo network. Payouts are indicative estimates based on regional biomass benchmarks.
            </div>
          </div>

          <button
            onClick={handleBookDispatch}
            disabled={bookingConfirmed}
            className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>{bookingConfirmed ? 'Dispatch Booking Confirmed!' : 'Book Stubble Collection & Pickup'}</span>
          </button>
        </div>

        {/* Right: Animated Logistics Map Visual */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                Logistics Route Pipeline
              </span>
              <Truck className="w-4 h-4 text-emerald-400" />
            </div>

            <h3 className="font-display font-bold text-xl text-[#F9F8F3] mb-6">
              Field &rarr; Collection &rarr; Utilization Unit
            </h3>

            {/* Vertical Flow Diagram */}
            <div className="relative p-6 rounded-2xl bg-black/60 border border-white/10 space-y-8 font-mono text-xs">
              {/* Point 1: Farmer Farm */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-[#ECE8DD]">AYUSH FARM (PLOT D)</div>
                  <div className="text-neutral-400 text-[11px]">2.5t Rice Straw baled & ready at field gate</div>
                </div>
              </div>

              {/* Connector */}
              <div className="ml-4 w-[2px] h-8 bg-gradient-to-b from-emerald-500 to-amber-400 relative">
                <span className="absolute -left-12 top-1 text-[10px] text-neutral-400 font-mono">
                  {buyers[selectedBuyer].distance}
                </span>
              </div>

              {/* Point 2: Collection Truck */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-[#ECE8DD]">DISPATCH LOGISTICS FLEET</div>
                  <div className="text-neutral-400 text-[11px]">Hydraulic baler & 5-ton flatbed truck dispatched</div>
                </div>
              </div>

              {/* Connector */}
              <div className="ml-4 w-[2px] h-8 bg-gradient-to-b from-amber-400 to-teal-400" />

              {/* Point 3: Processing Unit */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-teal-400 text-black flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-[#ECE8DD]">{buyers[selectedBuyer].name}</div>
                  <div className="text-emerald-400 text-[11px]">Immediate instant payment via UPI into Kisan Account</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs font-mono text-neutral-300 mt-6 space-y-1">
            <div className="flex justify-between">
              <span>AVOIDED PARTICULATE MATTER (PM2.5):</span>
              <span className="text-emerald-400 font-bold">14.2 kg</span>
            </div>
            <div className="flex justify-between">
              <span>FARMER CARBON REVENUE SHARE:</span>
              <span className="text-emerald-400 font-bold">100% Direct Deposit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
