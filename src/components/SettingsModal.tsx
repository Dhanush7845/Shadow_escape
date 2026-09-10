import React from 'react';
import { X, Volume2, VolumeX, Music, Smartphone, RotateCcw, Keyboard } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface SettingsModalProps {
  onClose: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  touchControls: boolean;
  screenShake: boolean;
  onUpdateSettings: (settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    soundVolume: number;
    touchControls: boolean;
    screenShake: boolean;
  }) => void;
  onResetSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  soundEnabled,
  musicEnabled,
  soundVolume,
  touchControls,
  screenShake,
  onUpdateSettings,
  onResetSave,
}) => {
  const [sound, setSound] = React.useState(soundEnabled);
  const [music, setMusic] = React.useState(musicEnabled);
  const [vol, setVol] = React.useState(soundVolume);
  const [touch, setTouch] = React.useState(touchControls);
  const [shake, setShake] = React.useState(screenShake);

  const handleSave = () => {
    soundEngine.playMenuClick();
    soundEngine.setSoundEnabled(sound);
    soundEngine.setMusicEnabled(music);
    soundEngine.setVolume(vol);

    onUpdateSettings({
      soundEnabled: sound,
      musicEnabled: music,
      soundVolume: vol,
      touchControls: touch,
      screenShake: shake,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-5">
          <div>
            <span className="text-xs font-display text-cyan-400 tracking-widest uppercase">
              HARDWARE & INTERFACE
            </span>
            <h2 className="text-2xl font-display font-bold text-neutral-100">SYSTEM SETTINGS</h2>
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

        {/* Options */}
        <div className="space-y-5 overflow-y-auto pr-1">
          {/* Sound & Music */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {sound ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-neutral-500" />}
                <div>
                  <div className="text-sm font-display font-bold text-neutral-200">PROCEDURAL SOUND FX</div>
                  <div className="text-xs text-neutral-400">Weapon shots, explosions, jumps, and terminal alarms</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={sound}
                onChange={(e) => setSound(e.target.checked)}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-sm font-display font-bold text-neutral-200">DARK SYNTH AMBIENT DRONE</div>
                  <div className="text-xs text-neutral-400">Dynamic generative sci-fi synthesizer music</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={music}
                onChange={(e) => setMusic(e.target.checked)}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-display text-neutral-400 mb-1.5">
                <span>MASTER AUDIO VOLUME</span>
                <span>{Math.round(vol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={vol}
                onChange={(e) => setVol(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Controls & Display */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-sm font-display font-bold text-neutral-200">ON-SCREEN TOUCH CONTROLS</div>
                  <div className="text-xs text-neutral-400">Display virtual D-Pad and action buttons on screen</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={touch}
                onChange={(e) => setTouch(e.target.checked)}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-sm font-display font-bold text-neutral-200">CAMERA SCREEN SHAKE</div>
                  <div className="text-xs text-neutral-400">Dynamic cinematic camera impact on explosions and recoil</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={shake}
                onChange={(e) => setShake(e.target.checked)}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Keybindings Reference */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <div className="flex items-center gap-2 mb-3 text-xs font-display font-bold text-cyan-400 uppercase">
              <Keyboard className="w-4 h-4" />
              <span>DESKTOP KEYBOARD CONTROLS</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-display">
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                <div className="text-neutral-500">MOVE / RUN</div>
                <div className="text-neutral-200 font-bold">A / D or &larr; / &rarr;</div>
              </div>
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                <div className="text-neutral-500">JUMP / WALL JUMP</div>
                <div className="text-neutral-200 font-bold">W, SPACE or &uarr;</div>
              </div>
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                <div className="text-neutral-500">SLIDE / CROUCH</div>
                <div className="text-neutral-200 font-bold">S or &darr;</div>
              </div>
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                <div className="text-neutral-500">PULSE BLASTER</div>
                <div className="text-cyan-300 font-bold">J or LEFT CLICK</div>
              </div>
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                <div className="text-neutral-500">PHASE DASH</div>
                <div className="text-cyan-300 font-bold">K or SHIFT</div>
              </div>
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                <div className="text-neutral-500">SHOCK BURST</div>
                <div className="text-amber-300 font-bold">L</div>
              </div>
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                <div className="text-neutral-500">KINETIC SHIELD</div>
                <div className="text-cyan-300 font-bold">C or E</div>
              </div>
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                <div className="text-neutral-500">HACK TERMINAL</div>
                <div className="text-emerald-300 font-bold">E</div>
              </div>
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                <div className="text-neutral-500">PAUSE / RESUME</div>
                <div className="text-neutral-300 font-bold">ESC</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 pt-4 mt-5 flex justify-between items-center">
          <button
            onClick={() => {
              if (window.confirm('Reset all saved progress and upgrades?')) {
                onResetSave();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-display text-rose-400 hover:text-rose-300 p-2 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET DATA</span>
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-display font-bold text-sm tracking-wider shadow-md shadow-cyan-950/50 transition-all cursor-pointer"
          >
            SAVE SETTINGS
          </button>
        </div>
      </div>
    </div>
  );
};
