import React from 'react';
import { MissionObjective } from '../types/game';
import { Shield, Zap, Crosshair, Sparkles, Terminal, Activity, Award } from 'lucide-react';

interface HUDProps {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  score: number;
  energyCells: number;
  objectives: MissionObjective[];
  bossInfo?: {
    name: string;
    hp: number;
    maxHp: number;
    isVisible: boolean;
    phase?: number;
  } | null;
  terminalPrompt?: { label: string } | null;
  canDash: boolean;
  isShieldActive: boolean;
  onHackTerminal: () => void;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  hp,
  maxHp,
  energy,
  maxEnergy,
  score,
  energyCells,
  objectives,
  bossInfo,
  terminalPrompt,
  canDash,
  isShieldActive,
  onHackTerminal,
  onPause,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const energyPercent = Math.max(0, Math.min(100, (energy / maxEnergy) * 100));

  return (
    <div id="hud-container" className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-20">
      {/* Top Bar: Kai Profile, HP, Energy, Score & Pause */}
      <div className="flex justify-between items-start">
        {/* Kai Status Card */}
        <div id="kai-status-card" className="bg-neutral-900/85 backdrop-blur-md border border-neutral-700/60 rounded-lg p-3 shadow-xl min-w-[280px]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center font-display font-bold text-cyan-400 text-sm tracking-widest shadow-inner">
              KAI
            </div>
            <div>
              <div className="text-xs text-neutral-400 font-display uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Operative Diagnostics
              </div>
              <div className="text-sm font-bold text-neutral-200 tracking-wide">
                HP: {Math.round(hp)} / {maxHp}
              </div>
            </div>
          </div>

          {/* Health Bar */}
          <div className="w-full bg-neutral-950 rounded-sm h-3 p-0.5 border border-neutral-800 mb-1.5 overflow-hidden">
            <div
              className={`h-full rounded-xs transition-all duration-150 ${
                hpPercent > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : hpPercent > 25
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                  : 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          {/* Energy Bar */}
          <div className="flex items-center justify-between text-[11px] text-cyan-300 font-display mb-0.5">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> ENERGY
            </span>
            <span>{Math.round(energy)} / {maxEnergy}</span>
          </div>
          <div className="w-full bg-neutral-950 rounded-sm h-2 p-0.5 border border-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-xs bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-150"
              style={{ width: `${energyPercent}%` }}
            />
          </div>
        </div>

        {/* Center: Boss Health Bar (if active) */}
        {bossInfo && bossInfo.isVisible && (
          <div id="boss-health-bar" className="w-full max-w-md mx-4 bg-neutral-900/90 backdrop-blur-md border border-red-500/40 rounded-lg p-3 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center text-xs font-display font-bold text-red-400 tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                BOSS // {bossInfo.name}
              </span>
              <span className="text-neutral-400">
                PHASE {bossInfo.phase || 1} &bull; {Math.round(bossInfo.hp)} / {bossInfo.maxHp}
              </span>
            </div>
            <div className="w-full bg-neutral-950 h-3.5 p-0.5 border border-neutral-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-200"
                style={{ width: `${Math.max(0, (bossInfo.hp / bossInfo.maxHp) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Right: Score, Collectibles & Pause */}
        <div className="flex items-center gap-3">
          <div id="score-counter" className="bg-neutral-900/85 backdrop-blur-md border border-neutral-700/60 rounded-lg px-3.5 py-2 text-right shadow-xl">
            <div className="text-[11px] text-neutral-400 font-display uppercase tracking-wider flex items-center justify-end gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Score
            </div>
            <div className="text-lg font-bold text-amber-300 font-display">
              {score.toLocaleString()}
            </div>
            <div className="text-xs text-cyan-300 font-display flex items-center justify-end gap-1 mt-0.5">
              <Zap className="w-3 h-3 text-cyan-400" /> {energyCells} Cells
            </div>
          </div>

          <button
            id="pause-button"
            onClick={onPause}
            className="pointer-events-auto bg-neutral-900/85 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500/60 text-neutral-200 px-3 py-2.5 rounded-lg text-xs font-display uppercase tracking-wider shadow-lg transition-colors cursor-pointer"
          >
            Pause [ESC]
          </button>
        </div>
      </div>

      {/* Middle Center: Terminal Hack Prompt Banner */}
      {terminalPrompt && (
        <div id="terminal-prompt-banner" className="self-center bg-cyan-950/90 border border-cyan-400 text-cyan-100 px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 pointer-events-auto animate-bounce">
          <Terminal className="w-5 h-5 text-cyan-300 animate-pulse" />
          <div>
            <div className="text-xs font-display text-cyan-300 tracking-widest uppercase">TERMINAL DETECTED</div>
            <div className="text-sm font-bold tracking-wide">{terminalPrompt.label}</div>
          </div>
          <button
            id="hack-terminal-action-button"
            onClick={onHackTerminal}
            className="ml-2 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-display font-bold px-3.5 py-1.5 rounded text-xs tracking-wider transition-all cursor-pointer shadow-md"
          >
            HACK [E]
          </button>
        </div>
      )}

      {/* Bottom Row: Objectives on left, Ability Hotbar on center/right */}
      <div className="flex justify-between items-end">
        {/* Objective Tracker */}
        <div id="objective-tracker" className="bg-neutral-900/85 backdrop-blur-md border border-neutral-700/60 rounded-lg p-3 max-w-sm shadow-xl">
          <div className="text-xs font-display font-bold text-neutral-300 tracking-wider uppercase mb-1.5 flex items-center gap-1.5 border-b border-neutral-800 pb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            MISSION OBJECTIVES
          </div>
          <div className="space-y-1">
            {objectives.map((obj) => (
              <div
                key={obj.id}
                className={`text-xs flex items-center justify-between gap-2 font-display ${
                  obj.isCompleted ? 'text-emerald-400 line-through opacity-80' : 'text-neutral-300'
                }`}
              >
                <span>&bull; {obj.description}</span>
                <span className="font-bold text-[11px]">
                  {obj.currentCount}/{obj.targetCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ability Hotbar */}
        <div id="ability-hotbar" className="hidden sm:flex items-center gap-2 bg-neutral-900/85 backdrop-blur-md border border-neutral-700/60 rounded-lg p-2 shadow-xl">
          {/* Primary Blaster */}
          <div className="flex flex-col items-center p-2 rounded bg-neutral-800/80 border border-neutral-700 text-cyan-400 min-w-[64px]">
            <Crosshair className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-display text-neutral-400">PULSE</span>
            <span className="text-[10px] font-bold text-neutral-200">[J / CLICK]</span>
          </div>

          {/* Phase Dash */}
          <div
            className={`flex flex-col items-center p-2 rounded border min-w-[64px] transition-all ${
              canDash
                ? 'bg-neutral-800/80 border-cyan-500/50 text-cyan-400'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-500 opacity-60'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-display">DASH</span>
            <span className="text-[10px] font-bold text-neutral-300">[K / SHIFT]</span>
          </div>

          {/* Shock Burst */}
          <div
            className={`flex flex-col items-center p-2 rounded border min-w-[64px] transition-all ${
              energy >= 25
                ? 'bg-neutral-800/80 border-amber-500/50 text-amber-400'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-500 opacity-60'
            }`}
          >
            <Zap className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-display">SHOCK</span>
            <span className="text-[10px] font-bold text-neutral-300">[L]</span>
          </div>

          {/* Kinetic Shield */}
          <div
            className={`flex flex-col items-center p-2 rounded border min-w-[64px] transition-all ${
              isShieldActive
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300 animate-pulse'
                : 'bg-neutral-800/80 border-neutral-700 text-neutral-400'
            }`}
          >
            <Shield className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-display">SHIELD</span>
            <span className="text-[10px] font-bold text-neutral-300">[C / E]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
