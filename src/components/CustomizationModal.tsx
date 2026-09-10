import React from 'react';
import { X, Check, Shield, Crosshair, Sparkles, Eye } from 'lucide-react';
import { CustomizationSettings, ArmorStyle, VisorGlow, WeaponSkin, DashTrail } from '../types/game';
import { soundEngine } from '../audio/soundEngine';

interface CustomizationModalProps {
  onClose: () => void;
  customization: CustomizationSettings;
  onSave: (newSettings: CustomizationSettings) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  onClose,
  customization,
  onSave,
}) => {
  const [settings, setSettings] = React.useState<CustomizationSettings>({ ...customization });

  const armorOptions: { id: ArmorStyle; name: string; desc: string; color: string }[] = [
    { id: 'stealth', name: 'Carbon Infiltrator', desc: 'Dark matte carbon fibers designed for silent facility penetration.', color: '#1e293b' },
    { id: 'vanguard', name: 'Titanium Vanguard', desc: 'Reinforced industrial slate plates with ceramic blast shielding.', color: '#64748b' },
    { id: 'ghost', name: 'Arctic Ghost Spec-Ops', desc: 'Thermal dampening synthetic white weave with chrome trim.', color: '#cbd5e1' },
    { id: 'ronin', name: 'Crimson Cyber-Ronin', desc: 'Hostile combat weave with aggressive crimson impact plating.', color: '#b91c1c' },
  ];

  const visorOptions: { id: VisorGlow; name: string; hex: string }[] = [
    { id: 'cyan', name: 'Plasma Cyan', hex: '#06b6d4' },
    { id: 'amber', name: 'Hyper Amber', hex: '#f59e0b' },
    { id: 'emerald', name: 'Bio Emerald', hex: '#10b981' },
    { id: 'crimson', name: 'Crimson Threat', hex: '#ef4444' },
  ];

  const weaponSkins: { id: WeaponSkin; name: string; desc: string }[] = [
    { id: 'standard', name: 'Pulse Blaster MK-I', desc: 'Standard Blacksite security issue energy sidearm.' },
    { id: 'obsidian', name: 'Void Obsidian', desc: 'Stealth black polymer with suppressed muzzle dissipation.' },
    { id: 'prototype', name: 'Prototype Railgun', desc: 'Overclocked magnetic coil accelerator casing.' },
    { id: 'plasma', name: 'Hyper-Plasma Core', desc: 'Exposed cooling conduits with high-yield thermal emitter.' },
  ];

  const dashTrails: { id: DashTrail; name: string; desc: string }[] = [
    { id: 'cyber_cyan', name: 'Cyan Phase Echo', desc: 'Crisp quantum holographic trail behind rapid movement.' },
    { id: 'solar_amber', name: 'Solar Surge', desc: 'Blazing thermal afterimages with kinetic heat dissipation.' },
    { id: 'neon_glitch', name: 'Digital Fracture', desc: 'Fragmented matrix voxel displacement during phase dash.' },
    { id: 'void_purple', name: 'Void Singularity', desc: 'Dark energy rift distortion that bends surrounding light.' },
  ];

  const handleApply = () => {
    soundEngine.playMenuClick();
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-display text-cyan-400 tracking-widest uppercase">
              ARMORY // SUIT CALIBRATION
            </span>
            <h2 className="text-2xl font-display font-bold text-neutral-100">KAI'S SPEC-OPS LOADOUT</h2>
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

        {/* Customization Sections */}
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Armor Style */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-display font-bold text-neutral-200">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>TACTICAL ARMOR COAT & PLATING</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {armorOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundEngine.playMenuClick();
                    setSettings({ ...settings, armorStyle: opt.id });
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    settings.armorStyle === opt.id
                      ? 'bg-neutral-800 border-cyan-400 shadow-md shadow-cyan-950/50'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border border-neutral-600 mt-0.5" style={{ backgroundColor: opt.color }} />
                    <div>
                      <div className="text-sm font-display font-bold text-neutral-100">{opt.name}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">{opt.desc}</div>
                    </div>
                  </div>
                  {settings.armorStyle === opt.id && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Visor & Tech Glow */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-display font-bold text-neutral-200">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>CYBER VISOR & CONDUIT GLOW</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {visorOptions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    soundEngine.playMenuClick();
                    setSettings({ ...settings, visorGlow: v.id });
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    settings.visorGlow === v.id
                      ? 'bg-neutral-800 border-cyan-400'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: v.hex }} />
                    <span className="text-xs font-display font-bold text-neutral-200">{v.name}</span>
                  </div>
                  {settings.visorGlow === v.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Weapon Skin */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-display font-bold text-neutral-200">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span>PRIMARY PULSE BLASTER MODEL</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weaponSkins.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    soundEngine.playMenuClick();
                    setSettings({ ...settings, weaponSkin: w.id });
                  }}
                  className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    settings.weaponSkin === w.id
                      ? 'bg-neutral-800 border-cyan-400 shadow-md shadow-cyan-950/50'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="text-sm font-display font-bold text-neutral-100">{w.name}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{w.desc}</div>
                  </div>
                  {settings.weaponSkin === w.id && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Dash Trail */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-display font-bold text-neutral-200">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>PHASE DASH WARP EFFECT</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dashTrails.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    soundEngine.playMenuClick();
                    setSettings({ ...settings, dashTrail: d.id });
                  }}
                  className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    settings.dashTrail === d.id
                      ? 'bg-neutral-800 border-cyan-400 shadow-md shadow-cyan-950/50'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="text-sm font-display font-bold text-neutral-100">{d.name}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{d.desc}</div>
                  </div>
                  {settings.dashTrail === d.id && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Apply */}
        <div className="border-t border-neutral-800 pt-4 mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              soundEngine.playMenuClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-lg font-display text-sm text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-display font-bold text-sm tracking-wider shadow-md shadow-cyan-950/50 transition-all cursor-pointer"
          >
            CONFIRM LOADOUT
          </button>
        </div>
      </div>
    </div>
  );
};
