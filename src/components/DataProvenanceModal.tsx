import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Database, 
  ShieldCheck, 
  Search
} from 'lucide-react';
import { 
  type DataProvenanceItem, 
  fetchDataProvenance 
} from '../services/api';
import { soundFx } from '../utils/audio';

interface DataProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMetricId?: string;
  defaultCategory?: string;
}

export const DataProvenanceModal: React.FC<DataProvenanceModalProps> = ({
  isOpen,
  onClose,
  selectedMetricId
}) => {
  const [items, setItems] = useState<DataProvenanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<DataProvenanceItem | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchDataProvenance()
      .then((data) => {
        setItems(data);
        if (selectedMetricId) {
          const match = data.find((i) => i.id === selectedMetricId);
          setActiveItem(match || data[0] || null);
        } else {
          setActiveItem(data[0] || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen, selectedMetricId]);

  if (!isOpen) return null;

  const filteredItems = items.filter((item) =>
    item.metric_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl my-auto rounded-3xl bg-[#04110A] border border-emerald-500/40 p-5 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-[#ECE8DD] max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                    TRUST & PROVENANCE REGISTRY
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Auditable Data Lineage</span>
                </div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#F9F8F3] mt-1 tracking-tight">
                  AgriN Data Provenance Registry
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 mt-3 shrink-0">
            Every metric, risk score, and advisory decision in AgriN traces back to documented source collections, formulas, and sensor timestamps.
          </p>

          {/* Search bar */}
          <div className="mt-4 relative shrink-0">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by metric, provider, or collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Content Body: Split Left List & Right Detail */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto flex-1 pr-1">
            {/* Left list of metrics */}
            <div className="space-y-2 overflow-y-auto max-h-[50vh] md:max-h-[58vh]">
              {loading ? (
                <div className="p-4 text-center text-xs font-mono text-neutral-400">Loading provenance registry...</div>
              ) : filteredItems.length === 0 ? (
                <div className="p-4 text-center text-xs font-mono text-neutral-400">No matching metrics found</div>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = activeItem?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundFx.playClick();
                        setActiveItem(item);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer font-mono ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-500/60 shadow-md'
                          : 'bg-black/30 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate block">{item.metric_name}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          item.source_state === 'LIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : item.source_state === 'CALCULATED'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-zinc-800 text-neutral-300 border border-zinc-700'
                        }`}>
                          {item.source_state}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate mt-1">{item.source}</div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Right detail view for active item */}
            <div className="md:col-span-2 bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 overflow-y-auto max-h-[58vh] font-mono text-xs">
              {activeItem ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-white/10">
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Metric Identifier</div>
                      <h4 className="text-sm sm:text-base font-bold text-emerald-300 mt-0.5">{activeItem.metric_name}</h4>
                      <div className="text-xs text-neutral-200 mt-1">Current Telemetry Value: <span className="text-white font-bold">{activeItem.current_value}</span></div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeItem.source_state === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : activeItem.source_state === 'CALCULATED'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-zinc-800 text-neutral-300 border border-zinc-700'
                      }`}>
                        {activeItem.source_state}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-black/60 border border-white/5">
                      <span className="text-neutral-400 text-[10px] block">SOURCE TELEMETRY</span>
                      <span className="text-white font-semibold mt-0.5 block">{activeItem.source}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/60 border border-white/5">
                      <span className="text-neutral-400 text-[10px] block">PROVIDER / AGENCY</span>
                      <span className="text-white font-semibold mt-0.5 block">{activeItem.provider}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/60 border border-white/5">
                      <span className="text-neutral-400 text-[10px] block">PROCESSING PIPELINE</span>
                      <span className="text-emerald-300 mt-0.5 block">{activeItem.processing}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/60 border border-white/5">
                      <span className="text-neutral-400 text-[10px] block">CATALOG / COLLECTION</span>
                      <span className="text-cyan-300 mt-0.5 block truncate">{activeItem.collection}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/60 border border-white/5">
                      <span className="text-neutral-400 text-[10px] block">SPATIAL / TEMPORAL RESOLUTION</span>
                      <span className="text-white font-semibold mt-0.5 block">{activeItem.resolution}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/60 border border-white/5">
                      <span className="text-neutral-400 text-[10px] block">OBSERVATION TIMESTAMP</span>
                      <span className="text-white font-semibold mt-0.5 block">{activeItem.observation_timestamp}</span>
                    </div>
                  </div>

                  {/* Mathematical Formula */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">
                      MATHEMATICAL FORMULATION / LOGIC:
                    </span>
                    <code className="text-xs text-emerald-200 mt-1 block font-mono bg-black/50 p-2 rounded border border-emerald-500/20">
                      {activeItem.formula}
                    </code>
                  </div>

                  {/* Region of Interest */}
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                      REGION OF INTEREST (ROI):
                    </span>
                    <span className="text-white text-xs mt-0.5 block">{activeItem.roi}</span>
                  </div>

                  {/* Trust Verification Statement */}
                  <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 flex items-start gap-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">
                        TRUST & REPRODUCIBILITY GUARANTEE:
                      </span>
                      <p className="text-neutral-300 text-[11px] mt-0.5 font-light">
                        {activeItem.trust_verification}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-neutral-400 text-xs">
                  Select a metric on the left to inspect its complete provenance lineage.
                </div>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-end shrink-0">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all cursor-pointer"
            >
              Done Inspecting
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
