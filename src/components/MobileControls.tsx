import React from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Crosshair, Sparkles, Zap, Shield, Terminal } from 'lucide-react';

interface MobileControlsProps {
  onLeft: (down: boolean) => void;
  onRight: (down: boolean) => void;
  onDown: (down: boolean) => void;
  onJump: (down: boolean) => void;
  onShoot: (down: boolean) => void;
  onDash: () => void;
  onShock: () => void;
  onShieldToggle: (active: boolean) => void;
  onHack: () => void;
  isShieldActive: boolean;
  canDash: boolean;
  hasTerminalPrompt: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onLeft,
  onRight,
  onDown,
  onJump,
  onShoot,
  onDash,
  onShock,
  onShieldToggle,
  onHack,
  isShieldActive,
  canDash,
  hasTerminalPrompt,
}) => {
  return (
    <div
      id="mobile-controls-layer"
      className="absolute inset-0 pointer-events-none z-30 flex justify-between items-end p-4 pb-6 select-none"
    >
      {/* Left: D-PAD (Left, Down/Slide, Right) */}
      <div className="pointer-events-auto flex items-end gap-2 bg-neutral-900/60 backdrop-blur-sm p-2 rounded-2xl border border-neutral-800/80">
        <button
          id="btn-move-left"
          onPointerDown={() => onLeft(true)}
          onPointerUp={() => onLeft(false)}
          onPointerLeave={() => onLeft(false)}
          className="w-14 h-14 rounded-xl bg-neutral-800/90 active:bg-cyan-500 active:text-neutral-950 text-cyan-300 border border-neutral-700 flex items-center justify-center shadow-lg transition-colors"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <button
          id="btn-crouch-slide"
          onPointerDown={() => onDown(true)}
          onPointerUp={() => onDown(false)}
          onPointerLeave={() => onDown(false)}
          className="w-14 h-14 rounded-xl bg-neutral-800/90 active:bg-cyan-500 active:text-neutral-950 text-cyan-300 border border-neutral-700 flex items-center justify-center shadow-lg transition-colors"
          aria-label="Slide or Crouch"
        >
          <ArrowDown className="w-7 h-7" />
        </button>

        <button
          id="btn-move-right"
          onPointerDown={() => onRight(true)}
          onPointerUp={() => onRight(false)}
          onPointerLeave={() => onRight(false)}
          className="w-14 h-14 rounded-xl bg-neutral-800/90 active:bg-cyan-500 active:text-neutral-950 text-cyan-300 border border-neutral-700 flex items-center justify-center shadow-lg transition-colors"
          aria-label="Move Right"
        >
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>

      {/* Right: Action Buttons (Jump, Blaster, Dash, Shock, Shield, Hack) */}
      <div className="pointer-events-auto flex flex-col items-end gap-2">
        {/* Secondary abilities row */}
        <div className="flex items-center gap-2">
          {hasTerminalPrompt && (
            <button
              id="btn-mobile-hack"
              onClick={onHack}
              className="w-12 h-12 rounded-xl bg-cyan-600 active:bg-cyan-400 text-neutral-950 border border-cyan-400 flex items-center justify-center shadow-xl animate-pulse"
              aria-label="Hack Terminal"
            >
              <Terminal className="w-6 h-6" />
            </button>
          )}

          <button
            id="btn-mobile-shock"
            onClick={onShock}
            className="w-12 h-12 rounded-xl bg-neutral-800/90 active:bg-amber-500 active:text-neutral-950 text-amber-400 border border-neutral-700 flex items-center justify-center shadow-lg"
            aria-label="Shock Burst"
          >
            <Zap className="w-6 h-6" />
          </button>

          <button
            id="btn-mobile-shield"
            onPointerDown={() => onShieldToggle(!isShieldActive)}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-lg transition-all ${
              isShieldActive
                ? 'bg-cyan-500 text-neutral-950 border-cyan-300'
                : 'bg-neutral-800/90 text-cyan-300 border-neutral-700'
            }`}
            aria-label="Toggle Kinetic Shield"
          >
            <Shield className="w-6 h-6" />
          </button>

          <button
            id="btn-mobile-dash"
            onClick={onDash}
            disabled={!canDash}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-lg transition-all ${
              canDash
                ? 'bg-neutral-800/90 active:bg-cyan-500 active:text-neutral-950 text-cyan-400 border-cyan-500/50'
                : 'bg-neutral-900 text-neutral-600 border-neutral-800 opacity-40'
            }`}
            aria-label="Phase Dash"
          >
            <Sparkles className="w-6 h-6" />
          </button>
        </div>

        {/* Primary Row: Jump & Blaster */}
        <div className="flex items-center gap-3">
          <button
            id="btn-mobile-jump"
            onPointerDown={() => onJump(true)}
            onPointerUp={() => onJump(false)}
            onPointerLeave={() => onJump(false)}
            className="w-16 h-16 rounded-2xl bg-cyan-700/80 active:bg-cyan-400 active:text-neutral-950 text-white border-2 border-cyan-400/80 flex flex-col items-center justify-center shadow-2xl transition-all"
            aria-label="Jump"
          >
            <ArrowUp className="w-7 h-7" />
            <span className="text-[10px] font-display font-bold">JUMP</span>
          </button>

          <button
            id="btn-mobile-shoot"
            onPointerDown={() => onShoot(true)}
            onPointerUp={() => onShoot(false)}
            onPointerLeave={() => onShoot(false)}
            className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-400 active:from-cyan-300 active:to-white text-neutral-950 border-2 border-cyan-300 flex flex-col items-center justify-center shadow-2xl font-display font-bold transition-all"
            aria-label="Fire Pulse Blaster"
          >
            <Crosshair className="w-8 h-8" />
            <span className="text-xs tracking-wider">FIRE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
