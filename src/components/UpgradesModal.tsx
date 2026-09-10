import React from 'react';
import { X, Zap, Heart, Footprints, Crosshair, Sparkles, Plus, Award } from 'lucide-react';
import { PlayerUpgrades } from '../types/game';
import { soundEngine } from '../audio/soundEngine';

interface UpgradesModalProps {
  onClose: () => void;
  upgrades: PlayerUpgrades;
  totalXP: number;
  totalEnergyCells: number;
  onUpgrade: (newUpgrades: PlayerUpgrades, xpDeducted: number) => void;
}

export const UpgradesModal: React.FC<UpgradesModalProps> = ({
  onClose,
  upgrades,
  totalXP,
  totalEnergyCells,
  onUpgrade,
}) => {
  const getUpgradeCost = (currentTier: number) => {
    return currentTier * 600;
  };

  const handleUpgradeTier = (type: keyof PlayerUpgrades) => {
    const curLevel = upgrades[type];
    if (curLevel >= 5) return;
    const cost = getUpgradeCost(curLevel);
    if (totalXP < cost) return;

    soundEngine.playLevelComplete();
    const updated = {
      ...upgrades,
      [type]: curLevel + 1,
    };
    onUpgrade(updated, cost);
  };

  const categories = [
    {
      id: 'healthLevel' as keyof PlayerUpgrades,
      name: 'NANO-COMPOSITE HEALTH MATRIX',
      icon: Heart,
      color: 'text-rose-400',
      desc: '+25 Maximum Hit Points per tier',
      curBonus: `${100 + (upgrades.healthLevel - 1) * 25} HP`,
      level: upgrades.healthLevel,
    },
    {
      id: 'energyLevel' as keyof PlayerUpgrades,
      name: 'PLASMA BATTERY & DISSIPATION',
      icon: Zap,
      color: 'text-cyan-400',
      desc: '+20 Max Energy & +15% passive recharge',
      curBonus: `${100 + (upgrades.energyLevel - 1) * 20} Max Energy`,
      level: upgrades.energyLevel,
    },
    {
      id: 'speedLevel' as keyof PlayerUpgrades,
      name: 'HYDRAULIC SERVO EXOSKELETON',
      icon: Footprints,
      color: 'text-emerald-400',
      desc: '+8% Movement speed & agile wall jumping',
      curBonus: `+${(upgrades.speedLevel - 1) * 8}% Sprint Speed`,
      level: upgrades.speedLevel,
    },
    {
      id: 'blasterLevel' as keyof PlayerUpgrades,
      name: 'PULSE BLASTER OVERCLOCK',
      icon: Crosshair,
      color: 'text-amber-400',
      desc: '+20% Damage & faster projectile velocity',
      curBonus: `${22 + (upgrades.blasterLevel - 1) * 7} Base Damage`,
      level: upgrades.blasterLevel,
    },
    {
      id: 'dashLevel' as keyof PlayerUpgrades,
      name: 'PHASE DASH DRIVE CAPACITOR',
      icon: Sparkles,
      color: 'text-purple-400',
      desc: '+15% Dash distance & -15% cooldown delay',
      curBonus: `-${(upgrades.dashLevel - 1) * 12}% Cooldown`,
      level: upgrades.dashLevel,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-4">
          <div>
            <span className="text-xs font-display text-amber-400 tracking-widest uppercase">
              RESEARCH LAB // CYBERNETIC AUGMENTATION
            </span>
            <h2 className="text-2xl font-display font-bold text-neutral-100">OPERATIVE UPGRADES</h2>
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

        {/* Currency Bar */}
        <div className="flex items-center gap-4 bg-neutral-950 p-3 rounded-xl border border-neutral-800 mb-5">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-display text-neutral-400">AVAILABLE XP:</span>
            <span className="text-sm font-display font-bold text-amber-300">{totalXP.toLocaleString()} XP</span>
          </div>
          <div className="h-4 w-[1px] bg-neutral-800" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-display text-neutral-400">ENERGY CELLS FOUND:</span>
            <span className="text-sm font-display font-bold text-cyan-300">{totalEnergyCells}</span>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-3 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isMax = cat.level >= 5;
            const cost = getUpgradeCost(cat.level);
            const canAfford = totalXP >= cost && !isMax;

            return (
              <div
                key={cat.id}
                className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-display font-bold text-neutral-100">{cat.name}</h4>
                      <span className="text-[10px] font-display px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        TIER {cat.level} / 5
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">{cat.desc}</p>
                    <div className="text-xs font-display text-cyan-300 font-bold mt-1">
                      CURRENT: {cat.curBonus}
                    </div>
                  </div>
                </div>

                {/* Progress Blocks & Upgrade Button */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`w-3 h-6 rounded-xs ${
                          lvl <= cat.level ? 'bg-cyan-500' : 'bg-neutral-800'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => handleUpgradeTier(cat.id)}
                    className={`px-4 py-2 rounded-lg font-display font-bold text-xs tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      isMax
                        ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        : canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-950/50'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    {isMax ? (
                      'MAX TIER'
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>UPGRADE ({cost} XP)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
