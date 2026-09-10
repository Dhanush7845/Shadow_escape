import React from 'react';
import { Play, Shield, Terminal, Settings as SettingsIcon, Zap, FileText, ChevronRight, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { CustomizationSettings } from '../types/game';

interface MainMenuProps {
  onStartGame: (levelId?: number) => void;
  onOpenMissions: () => void;
  onOpenCharacter: () => void;
  onOpenUpgrades: () => void;
  onOpenCodex: () => void;
  onOpenSettings: () => void;
  customization: CustomizationSettings;
  highestLevel: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenMissions,
  onOpenCharacter,
  onOpenUpgrades,
  onOpenCodex,
  onOpenSettings,
  customization,
  highestLevel,
}) => {
  const handleHover = () => {
    soundEngine.playMenuClick();
  };

  const visorColorClass =
    customization.visorGlow === 'amber'
      ? 'text-amber-400 border-amber-400 shadow-amber-500/50'
      : customization.visorGlow === 'emerald'
      ? 'text-emerald-400 border-emerald-400 shadow-emerald-500/50'
      : customization.visorGlow === 'crimson'
      ? 'text-rose-500 border-rose-500 shadow-rose-500/50'
      : 'text-cyan-400 border-cyan-400 shadow-cyan-500/50';

  return (
    <div id="main-menu" className="relative w-full h-full flex flex-col justify-between p-6 sm:p-12 overflow-hidden bg-neutral-950 select-none">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/40 via-neutral-950 to-neutral-950 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Header: Subtitle & Classification */}
      <div className="relative z-10 flex justify-between items-center border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse shadow-lg shadow-cyan-500/50" />
          <span className="text-xs font-display tracking-widest text-cyan-400 uppercase">
            BLACKSITE // INFILTRATION PROTOCOL V3.8
          </span>
        </div>
        <div className="text-xs font-display tracking-wider text-neutral-400">
          STATUS: <span className="text-emerald-400 font-bold">OPERATIVE ACTIVE</span>
        </div>
      </div>

      {/* Main Center Area: Title & Interactive Kai Silhouette */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center">
        {/* Left: Game Title & Core Action Buttons */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tight text-white glow-cyan uppercase">
              SHADOW<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-200">
                ESCAPE
              </span>
            </h1>
            <div className="text-sm sm:text-base font-display tracking-widest text-neutral-400 uppercase flex items-center gap-2">
              <span className="text-cyan-400 font-bold">BREAK IN.</span>
              <span className="text-neutral-600">&bull;</span>
              <span className="text-amber-400 font-bold">FIGHT OUT.</span>
              <span className="text-neutral-600">&bull;</span>
              <span className="text-rose-400 font-bold">SURVIVE.</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col space-y-3 max-w-md pt-4">
            <button
              id="menu-play-btn"
              onClick={() => onStartGame(highestLevel)}
              onMouseEnter={handleHover}
              className="group relative flex items-center justify-between px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-neutral-950 font-display font-bold text-lg tracking-wider transition-all shadow-xl shadow-cyan-950/50 cursor-pointer overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <Play className="w-6 h-6 fill-current" />
                <span>{highestLevel > 1 ? `CONTINUE // LEVEL ${highestLevel}` : 'INITIATE ESCAPE'}</span>
              </div>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                id="menu-missions-btn"
                onClick={onOpenMissions}
                onMouseEnter={handleHover}
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/70 hover:border-cyan-500/50 text-neutral-200 font-display text-sm tracking-wider transition-all cursor-pointer shadow-lg"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>MISSIONS</span>
              </button>

              <button
                id="menu-character-btn"
                onClick={onOpenCharacter}
                onMouseEnter={handleHover}
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/70 hover:border-cyan-500/50 text-neutral-200 font-display text-sm tracking-wider transition-all cursor-pointer shadow-lg"
              >
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>CHARACTER</span>
              </button>

              <button
                id="menu-upgrades-btn"
                onClick={onOpenUpgrades}
                onMouseEnter={handleHover}
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/70 hover:border-amber-500/50 text-neutral-200 font-display text-sm tracking-wider transition-all cursor-pointer shadow-lg"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>UPGRADES</span>
              </button>

              <button
                id="menu-codex-btn"
                onClick={onOpenCodex}
                onMouseEnter={handleHover}
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/70 hover:border-purple-500/50 text-neutral-200 font-display text-sm tracking-wider transition-all cursor-pointer shadow-lg"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>DATA ARCHIVE</span>
              </button>
            </div>

            <button
              id="menu-settings-btn"
              onClick={onOpenSettings}
              onMouseEnter={handleHover}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-950/70 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-neutral-200 font-display text-xs tracking-wider transition-all cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>SYSTEM SETTINGS & CONTROLS</span>
            </button>
          </div>
        </div>

        {/* Right: Kai Operative Holographic Showcase Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-72 sm:w-80 p-6 rounded-2xl bg-neutral-900/70 backdrop-blur-md border border-neutral-800 shadow-2xl overflow-hidden group">
            {/* Hologram scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse pointer-events-none" />

            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-display text-cyan-400 tracking-widest uppercase">
                  OPERATIVE ID: #884-KAI
                </span>
                <h3 className="text-xl font-display font-bold text-neutral-100">KAI</h3>
              </div>
              <div className={`px-2.5 py-0.5 rounded text-[10px] font-display font-bold uppercase border ${visorColorClass}`}>
                {customization.armorStyle} SPEC
              </div>
            </div>

            {/* Stylized Kai Hologram Artwork Representation */}
            <div className="relative h-64 w-full rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-center overflow-hidden">
              {/* Radial glow */}
              <div className="absolute w-40 h-40 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />

              {/* Kai Graphic Figure Vector */}
              <svg className="w-44 h-56 drop-shadow-xl" viewBox="0 0 100 130" fill="none">
                {/* Boots */}
                <rect x="36" y="105" width="10" height="15" rx="2" fill="#0f172a" />
                <rect x="54" y="105" width="10" height="15" rx="2" fill="#0f172a" />
                <rect x="36" y="118" width="10" height="3" fill="#06b6d4" />
                <rect x="54" y="118" width="10" height="3" fill="#06b6d4" />

                {/* Tactical Pants / Legs */}
                <rect x="37" y="78" width="9" height="28" rx="2" fill="#1e293b" />
                <rect x="54" y="78" width="9" height="28" rx="2" fill="#1e293b" />

                {/* Coat Duster / Tail */}
                <path d="M 28 65 L 72 65 L 75 100 L 25 100 Z" fill="#0f172a" opacity="0.9" />

                {/* Torso Armor Plates */}
                <rect x="32" y="44" width="36" height="34" rx="4" fill="#334155" />
                <rect x="46" y="48" width="8" height="8" rx="2" fill="#06b6d4" className="animate-pulse" />

                {/* Utility Belt & Pouches */}
                <rect x="30" y="72" width="40" height="6" fill="#020617" />
                <rect x="47" y="72" width="6" height="6" fill="#e2e8f0" />
                <rect x="33" y="73" width="4" height="5" fill="#64748b" />
                <rect x="63" y="73" width="4" height="5" fill="#64748b" />

                {/* Arms & Pulse Blaster Weapon */}
                <path d="M 32 46 L 22 62 L 28 64 L 36 50 Z" fill="#1e293b" />
                <path d="M 68 46 L 82 58 L 78 62 L 64 50 Z" fill="#1e293b" />
                {/* Pulse Blaster */}
                <rect x="78" y="54" width="16" height="8" rx="2" fill="#475569" />
                <rect x="92" y="56" width="6" height="4" fill="#0f172a" />
                <rect x="82" y="56" width="6" height="3" fill="#06b6d4" />

                {/* Neck & Head */}
                <rect x="46" y="36" width="8" height="8" fill="#fecdd3" />
                <circle cx="50" cy="30" r="12" fill="#fecdd3" />

                {/* Kai's Futuristic Asymmetrical Haircut */}
                <path d="M 38 24 Q 45 14 62 20 Q 64 26 56 26 Q 44 26 38 24 Z" fill="#1e293b" />
                <path d="M 37 24 L 42 34 L 46 26 Z" fill="#1e293b" />

                {/* Glowing Tactical Visor / Cyber Eye */}
                <rect x="50" y="27" width="11" height="4" rx="1" fill="#06b6d4" />
              </svg>
            </div>

            {/* Loadout Briefing */}
            <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-1 text-xs font-display">
              <div className="flex justify-between text-neutral-400">
                <span>WEAPON:</span>
                <span className="text-cyan-300 font-bold uppercase">PULSE BLASTER MK-IV</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>TECH ABILITY:</span>
                <span className="text-cyan-300 font-bold uppercase">PHASE DASH & EMP</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>MISSION:</span>
                <span className="text-amber-400 font-bold uppercase">THE BLACKSITE ESCAPE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center text-xs font-display text-neutral-400 border-t border-neutral-800/80 pt-4 gap-2">
        <div>SHADOW ESCAPE &copy; 2026 // ORIGINAL ACTION PLATFORMER</div>
        <div className="flex items-center gap-4">
          <span className="text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 60 FPS ARCADE ENGINE
          </span>
          <span>KEYBOARD & TOUCH CONTROLS ENABLED</span>
        </div>
      </div>
    </div>
  );
};
