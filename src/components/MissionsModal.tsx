import React from 'react';
import { X, Play, Lock, CheckCircle2, AlertTriangle, Skull } from 'lucide-react';
import { LEVELS_CONFIG } from '../game/levels/levelData';
import { soundEngine } from '../audio/soundEngine';

interface MissionsModalProps {
  onClose: () => void;
  onSelectLevel: (levelId: number) => void;
  highestUnlockedLevel: number;
  completedLevels: number[];
}

export const MissionsModal: React.FC<MissionsModalProps> = ({
  onClose,
  onSelectLevel,
  highestUnlockedLevel,
  completedLevels,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-display text-cyan-400 tracking-widest uppercase">
              SECTOR RECONNAISSANCE // LEVEL PROGRESSION
            </span>
            <h2 className="text-2xl font-display font-bold text-neutral-100">BLACKSITE MISSIONS</h2>
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

        {/* Level List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1">
          {LEVELS_CONFIG.map((lvl) => {
            const isUnlocked = lvl.id <= highestUnlockedLevel;
            const isCompleted = completedLevels.includes(lvl.id);

            return (
              <div
                key={lvl.id}
                className={`relative p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-neutral-950/80 border-neutral-700/80 hover:border-cyan-500/80'
                    : 'bg-neutral-950/40 border-neutral-800/60 opacity-60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-display uppercase tracking-wider text-cyan-400">
                      {lvl.subtitle}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-display font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SECURED
                      </span>
                    ) : !isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-display">
                        <Lock className="w-3.5 h-3.5" /> ENCRYPTED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-amber-400 font-display font-bold animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" /> ACTIVE
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-display font-bold text-neutral-100 mb-1">
                    {lvl.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                    {lvl.description}
                  </p>

                  {/* Objectives summary */}
                  <div className="space-y-1 mb-4">
                    {lvl.objectives.map((obj) => (
                      <div key={obj.id} className="text-[11px] text-neutral-400 flex items-center gap-1.5 font-display">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                        <span>{obj.description}</span>
                      </div>
                    ))}
                    {lvl.bossId && (
                      <div className="text-[11px] text-rose-400 flex items-center gap-1.5 font-display font-bold">
                        <Skull className="w-3.5 h-3.5" />
                        <span>GUARDIAN BOSS ENCOUNTER</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  disabled={!isUnlocked}
                  onClick={() => {
                    soundEngine.playMenuClick();
                    onSelectLevel(lvl.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-lg font-display font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isUnlocked
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-md shadow-cyan-950/50'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isUnlocked ? 'DEPLOY TO SECTOR' : 'SECTOR LOCKED'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
