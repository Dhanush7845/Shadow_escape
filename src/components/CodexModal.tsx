import React from 'react';
import { X, Lock, FileText, Calendar, ShieldAlert } from 'lucide-react';
import { LORE_SHARDS } from '../game/levels/levelData';
import { soundEngine } from '../audio/soundEngine';

interface CodexModalProps {
  onClose: () => void;
  unlockedShardIds: string[];
}

export const CodexModal: React.FC<CodexModalProps> = ({ onClose, unlockedShardIds }) => {
  const [selectedShardId, setSelectedShardId] = React.useState<string>(
    unlockedShardIds[0] || 'shard_01'
  );

  const selectedShard = LORE_SHARDS.find((s) => s.id === selectedShardId) || LORE_SHARDS[0];
  const isSelectedUnlocked = unlockedShardIds.includes(selectedShard.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-4">
          <div>
            <span className="text-xs font-display text-purple-400 tracking-widest uppercase">
              DECRYPTED MEMORY CORES // THE BLACKSITE ARCHIVES
            </span>
            <h2 className="text-2xl font-display font-bold text-neutral-100">CLASSIFIED DATA SHARDS</h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playMenuClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden flex-1">
          {/* Shard list */}
          <div className="md:col-span-5 space-y-2 overflow-y-auto pr-1">
            {LORE_SHARDS.map((shard) => {
              const isUnlocked = unlockedShardIds.includes(shard.id);
              const isSelected = selectedShardId === shard.id;

              return (
                <button
                  key={shard.id}
                  onClick={() => {
                    soundEngine.playMenuClick();
                    setSelectedShardId(shard.id);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-800 border-purple-400 shadow-md shadow-purple-950/40'
                      : isUnlocked
                      ? 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                      : 'bg-neutral-950/40 border-neutral-900 opacity-60'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-purple-950/70 text-purple-400' : 'bg-neutral-900 text-neutral-600'}`}>
                    {isUnlocked ? <FileText className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold text-neutral-200">
                      {isUnlocked ? shard.title : `ENCRYPTED LOG // SECTOR ${shard.levelId}`}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-display">
                      {isUnlocked ? shard.classification : 'COLLECT DATA SHARD TO DECRYPT'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Shard details panel */}
          <div className="md:col-span-7 bg-neutral-950 border border-neutral-800 rounded-xl p-6 flex flex-col justify-between overflow-y-auto">
            {isSelectedUnlocked ? (
              <div>
                <div className="flex justify-between items-center border-b border-neutral-800/80 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-display font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{selectedShard.classification}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-display">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedShard.date}</span>
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-purple-300 mb-4">
                  {selectedShard.title}
                </h3>

                <p className="text-sm text-neutral-300 font-mono leading-relaxed bg-neutral-900/60 p-4 rounded-lg border border-neutral-800">
                  {selectedShard.logText}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 text-neutral-500">
                <Lock className="w-12 h-12 mb-3 text-neutral-600" />
                <h4 className="text-base font-display font-bold text-neutral-300 mb-1">
                  QUANTUM ENCRYPTED MEMORY SHARD
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Infiltrate Sector {selectedShard.levelId} of the Blacksite and recover the floating memory crystal to decode this security transmission.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-800/80 flex justify-between items-center text-xs text-neutral-500 font-display">
              <span>SECURITY LEVEL: OMEGA</span>
              <span>KAI RESTRICTED CLEARANCE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
