import React from 'react';
import { Play, RotateCcw, Home, Settings as SettingsIcon } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  onOpenSettings: () => void;
  levelTitle: string;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onMainMenu,
  onOpenSettings,
  levelTitle,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 text-center">
        <span className="text-xs font-display text-cyan-400 tracking-widest uppercase">
          TACTICAL HOLD // {levelTitle}
        </span>
        <h3 className="text-2xl font-display font-bold text-neutral-100 mt-1 mb-6">
          GAME PAUSED
        </h3>

        <div className="space-y-3">
          <button
            onClick={() => {
              soundEngine.playMenuClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME MISSION</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playMenuClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-display text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART SECTOR</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playMenuClick();
              onOpenSettings();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-display text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <SettingsIcon className="w-4 h-4" />
            <span>SETTINGS</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playMenuClick();
              onMainMenu();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-100 font-display text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>ABORT TO MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
