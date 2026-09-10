import React from 'react';
import { Award, Zap, ChevronRight, RotateCcw, Home } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface VictoryModalProps {
  levelId: number;
  score: number;
  energyCells: number;
  hpRemaining: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onMainMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelId,
  score,
  energyCells,
  hpRemaining,
  onNextLevel,
  onReplay,
  onMainMenu,
}) => {
  const isFinalLevel = levelId >= 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-cyan-500/60 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-center">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/50 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-400 mx-auto flex items-center justify-center mb-4 text-cyan-300 shadow-xl shadow-cyan-500/20">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-xs font-display text-cyan-400 tracking-widest uppercase">
            {isFinalLevel ? 'EXTRACTION COMPLETE' : 'SECTOR PROTOCOL CLEARED'}
          </span>

          <h2 className="text-3xl font-display font-black text-neutral-100 mt-1 mb-2 tracking-wide">
            {isFinalLevel ? 'SURFACE REACHED' : `LEVEL ${levelId} SECURED`}
          </h2>

          <p className="text-sm text-neutral-400 mb-6">
            {isFinalLevel
              ? 'Blacksite Core has been neutralized. Kai has boarded the extraction craft and escaped the underground research facility!'
              : 'Extraction airlock opened. Operative diagnostics stable. Advancing to the next facility sector.'}
          </p>

          {/* Stats Box */}
          <div className="grid grid-cols-3 gap-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800 mb-6 text-center">
            <div>
              <div className="text-[10px] font-display text-neutral-500 uppercase">SCORE EARNED</div>
              <div className="text-lg font-display font-bold text-amber-300">+{score}</div>
            </div>
            <div>
              <div className="text-[10px] font-display text-neutral-500 uppercase">ENERGY CELLS</div>
              <div className="text-lg font-display font-bold text-cyan-300 flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> {energyCells}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-display text-neutral-500 uppercase">HP SURVIVED</div>
              <div className="text-lg font-display font-bold text-emerald-400">{Math.round(hpRemaining)}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {!isFinalLevel && (
              <button
                onClick={() => {
                  soundEngine.playMenuClick();
                  onNextLevel();
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-neutral-950 font-display font-bold text-base tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 transition-all cursor-pointer"
              >
                <span>CONTINUE TO SECTOR {levelId + 1}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  soundEngine.playMenuClick();
                  onReplay();
                }}
                className="py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-display text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>REPLAY SECTOR</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playMenuClick();
                  onMainMenu();
                }}
                className="py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-display text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>MAIN MENU</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
