export type ArmorStyle = 'stealth' | 'vanguard' | 'ghost' | 'ronin';
export type VisorGlow = 'cyan' | 'amber' | 'emerald' | 'crimson';
export type WeaponSkin = 'standard' | 'obsidian' | 'prototype' | 'plasma';
export type DashTrail = 'cyber_cyan' | 'solar_amber' | 'neon_glitch' | 'void_purple';

export interface CustomizationSettings {
  armorStyle: ArmorStyle;
  visorGlow: VisorGlow;
  weaponSkin: WeaponSkin;
  dashTrail: DashTrail;
}

export interface PlayerUpgrades {
  healthLevel: number;    // Tier 1..5: +25 HP per tier
  energyLevel: number;    // Tier 1..5: +20 Energy & +15% regen
  speedLevel: number;     // Tier 1..5: +8% run speed
  blasterLevel: number;   // Tier 1..5: +20% damage & faster projectile
  dashLevel: number;      // Tier 1..5: -15% cooldown, +15% range
}

export interface MissionObjective {
  id: string;
  description: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  type: 'terminal' | 'cells' | 'defeat_enemies' | 'boss' | 'reach_exit' | 'shards';
}

export interface DataShard {
  id: string;
  levelId: number;
  title: string;
  classification: string;
  date: string;
  logText: string;
  isUnlocked: boolean;
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  sectorName: string;
  description: string;
  ambientColor: number;
  lightingTone: 'cyan' | 'amber' | 'crimson' | 'emerald' | 'violet';
  objectives: MissionObjective[];
  bossId?: 'warden' | 'experiment' | 'core';
  targetParTime: number; // in seconds
}

export interface GameSaveData {
  version: number;
  highestUnlockedLevel: number;
  completedLevels: number[];
  totalXP: number;
  totalEnergyCells: number;
  totalScore: number;
  unlockedShards: string[];
  upgrades: PlayerUpgrades;
  customization: CustomizationSettings;
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  touchControls: boolean;
  screenShake: boolean;
}

export interface CombatTextEvent {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}
