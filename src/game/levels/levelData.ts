import { LevelConfig, DataShard } from '../../types/game';

export interface PlatformDef {
  x: number;
  y: number;
  w: number;
  h: number;
  isHazard?: boolean;
}

export interface EnemySpawnDef {
  type: 'drone' | 'bot' | 'hunter' | 'void';
  x: number;
  y: number;
  patrolMinX: number;
  patrolMaxX: number;
}

export interface ItemSpawnDef {
  type: 'energy_cell' | 'data_shard' | 'medkit' | 'access_card';
  x: number;
  y: number;
  shardId?: string;
}

export interface LevelMapData {
  config: LevelConfig;
  width: number;
  height: number;
  playerSpawn: { x: number; y: number };
  exitAirlock: { x: number; y: number };
  platforms: PlatformDef[];
  terminals: { id: string; x: number; y: number; label: string }[];
  checkpoints: { id: string; x: number; y: number }[];
  enemies: EnemySpawnDef[];
  items: ItemSpawnDef[];
  boss?: {
    type: 'warden' | 'experiment' | 'core';
    x: number;
    y: number;
  };
}

export const LORE_SHARDS: DataShard[] = [
  {
    id: 'shard_01',
    levelId: 1,
    title: 'LOG 01 // CONTAINMENT PROTOCOL',
    classification: 'RESTRICTED // EYES ONLY',
    date: '2086.11.04',
    logText: 'Project Eclipse breached secondary containment at 03:40 hours. Automated protocols sealed Sector 1. Operative Kai, your cybernetic neural dampener was corrupted during the EMP burst. Find an auxiliary power terminal to restore suit diagnostics.',
    isUnlocked: false,
  },
  {
    id: 'shard_02',
    levelId: 2,
    title: 'LOG 02 // AUTOMATED SENTRY GRID',
    classification: 'SECURITY DIVISION',
    date: '2086.11.05',
    logText: 'Security Director Vane authorized lethal engagement rules for all automated sentry drones and ground units. The Blacksite mainframe considers all biological presence hostile.',
    isUnlocked: false,
  },
  {
    id: 'shard_03',
    levelId: 3,
    title: 'LOG 03 // WARDEN-01 ACTIVATION',
    classification: 'DEFENSE ARCHITECTURE',
    date: '2086.11.08',
    logText: 'Heavy autonomous guardian WARDEN-01 deployed to the Power Reactor core. The unit is fitted with thermal-shield plating and twin missile arrays. Its kinetic barrier drops momentarily after firing.',
    isUnlocked: false,
  },
  {
    id: 'shard_04',
    levelId: 4,
    title: 'LOG 04 // EXPERIMENTAL LABS ANOMALY',
    classification: 'CYBER-GENETICS',
    date: '2086.11.12',
    logText: 'Subject 7 has mutated beyond projected biological limits. Tissue regeneration accelerated by 600% when exposed to synthetic coolant plasma. They were never trying to cure the operatives—they were forging living weapons.',
    isUnlocked: false,
  },
  {
    id: 'shard_05',
    levelId: 5,
    title: 'LOG 05 // CONTAINMENT COLLAPSE',
    classification: 'TOP SECRET',
    date: '2086.11.15',
    logText: 'Specimen Alpha broke its magnetic dampeners. It moves through darkness and hunts thermal signatures. Kai, do not let it corner you. Use Phase Dash to evade its sweeping claws.',
    isUnlocked: false,
  },
  {
    id: 'shard_06',
    levelId: 6,
    title: 'LOG 06 // PROJECT BLACKSITE SURFACE ACCESS',
    classification: 'DIRECTIVE TERMINAL',
    date: '2086.11.18',
    logText: 'The escape elevator leads straight to extraction beacon Olympus-9. The Mainframe AI will initiate self-purge of the underground complex if the Core is compromised. Break the Core. Reach the surface. Survive.',
    isUnlocked: false,
  },
];

export const LEVELS_CONFIG: LevelConfig[] = [
  {
    id: 1,
    title: 'LEVEL 1: Abandoned Research Wing',
    subtitle: 'Sector 01 // Sub-Level 4',
    sectorName: 'Research Wing',
    description: 'Awaken in the dark ruins of the laboratory. Restore power via auxiliary terminals and bypass the locked airlock.',
    ambientColor: 0x091e2b,
    lightingTone: 'cyan',
    targetParTime: 75,
    objectives: [
      {
        id: 'obj_terminals',
        description: 'Override Aux Terminals',
        targetCount: 2,
        currentCount: 0,
        isCompleted: false,
        type: 'terminal',
      },
      {
        id: 'obj_cells',
        description: 'Collect Energy Cells',
        targetCount: 3,
        currentCount: 0,
        isCompleted: false,
        type: 'cells',
      },
      {
        id: 'obj_exit',
        description: 'Reach Extraction Airlock',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
        type: 'reach_exit',
      },
    ],
  },
  {
    id: 2,
    title: 'LEVEL 2: Security Complex',
    subtitle: 'Sector 02 // Sentry Grid',
    sectorName: 'Security Complex',
    description: 'Infiltrate the heavy security sector. Avoid lethal laser grids and retrieve the encrypted Security Access Card.',
    ambientColor: 0x1f1609,
    lightingTone: 'amber',
    targetParTime: 90,
    objectives: [
      {
        id: 'obj_card',
        description: 'Acquire Security Access Card',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
        type: 'terminal',
      },
      {
        id: 'obj_enemies',
        description: 'Neutralize Security Bots',
        targetCount: 4,
        currentCount: 0,
        isCompleted: false,
        type: 'defeat_enemies',
      },
      {
        id: 'obj_exit',
        description: 'Bypass Sector Gate',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
        type: 'reach_exit',
      },
    ],
  },
  {
    id: 3,
    title: 'LEVEL 3: Power Reactor',
    subtitle: 'Sector 03 // Core Chamber',
    sectorName: 'Power Reactor',
    description: 'Traverse fluctuating electromagnetic platforms and eliminate the facility defense mech WARDEN-01.',
    ambientColor: 0x1a0f2e,
    lightingTone: 'violet',
    bossId: 'warden',
    targetParTime: 120,
    objectives: [
      {
        id: 'obj_boss',
        description: 'Destroy WARDEN-01 Mech',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
        type: 'boss',
      },
      {
        id: 'obj_exit',
        description: 'Access Coolant Shaft',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
        type: 'reach_exit',
      },
    ],
  },
  {
    id: 4,
    title: 'LEVEL 4: Experimental Labs',
    subtitle: 'Sector 04 // Specimen Bio-Storage',
    sectorName: 'Experimental Labs',
    description: 'Venture through shattered specimen containment chambers and collect classified Project Eclipse data shards.',
    ambientColor: 0x0a2618,
    lightingTone: 'emerald',
    targetParTime: 100,
    objectives: [
      {
        id: 'obj_terminals',
        description: 'Purge Containment Locks',
        targetCount: 2,
        currentCount: 0,
        isCompleted: false,
        type: 'terminal',
      },
      {
        id: 'obj_cells',
        description: 'Gather Plasma Cells',
        targetCount: 4,
        currentCount: 0,
        isCompleted: false,
        type: 'cells',
      },
      {
        id: 'obj_exit',
        description: 'Enter Deep Containment',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
        type: 'reach_exit',
      },
    ],
  },
  {
    id: 5,
    title: 'LEVEL 5: Containment Zone',
    subtitle: 'Sector 05 // Sub-Zero Cryo Hold',
    sectorName: 'Containment Zone',
    description: 'Pitch darkness pierced by red emergency strobes. Hunt down and neutralize the mutated monstrosity: THE EXPERIMENT.',
    ambientColor: 0x240909,
    lightingTone: 'crimson',
    bossId: 'experiment',
    targetParTime: 140,
    objectives: [
      {
        id: 'obj_boss',
        description: 'Neutralize THE EXPERIMENT',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
        type: 'boss',
      },
      {
        id: 'obj_exit',
        description: 'Unlock Escape Tower Lift',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
        type: 'reach_exit',
      },
    ],
  },
  {
    id: 6,
    title: 'LEVEL 6: Escape Tower',
    subtitle: 'Sector 06 // Apex Mainframe & Surface Hangar',
    sectorName: 'Escape Tower',
    description: 'Ascend to the surface extraction hangar. Destroy the autonomous BLACKSITE CORE to terminate facility lockdown!',
    ambientColor: 0x091b29,
    lightingTone: 'cyan',
    bossId: 'core',
    targetParTime: 150,
    objectives: [
      {
        id: 'obj_boss',
        description: 'Destroy BLACKSITE CORE AI',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
        type: 'boss',
      },
      {
        id: 'obj_exit',
        description: 'Board Dropship & Survive',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
        type: 'reach_exit',
      },
    ],
  },
];

// Helper to construct full Level Map layout for any level 1..6
export function getLevelMapData(levelId: number): LevelMapData {
  const cfg = LEVELS_CONFIG.find((l) => l.id === levelId) || LEVELS_CONFIG[0];
  const width = levelId === 3 || levelId === 5 || levelId === 6 ? 1600 : 2000;
  const height = 640;

  // Base ground & walls
  const platforms: PlatformDef[] = [
    // Bottom ground
    { x: 0, y: 580, w: width, h: 60 },
    // Left boundary
    { x: -20, y: 0, w: 30, h: height },
    // Right boundary
    { x: width - 10, y: 0, w: 30, h: height },
    // Ceiling
    { x: 0, y: -20, w: width, h: 30 },
  ];

  const terminals: { id: string; x: number; y: number; label: string }[] = [];
  const checkpoints: { id: string; x: number; y: number }[] = [];
  const enemies: EnemySpawnDef[] = [];
  const items: ItemSpawnDef[] = [];

  if (levelId === 1) {
    // Level 1: Abandoned Research Wing
    platforms.push(
      { x: 180, y: 470, w: 140, h: 20 },
      { x: 380, y: 390, w: 160, h: 20 },
      { x: 600, y: 310, w: 160, h: 20 },
      { x: 820, y: 410, w: 180, h: 20 },
      { x: 1060, y: 340, w: 140, h: 20 },
      { x: 1260, y: 440, w: 160, h: 20 },
      { x: 1480, y: 360, w: 160, h: 20 },
      { x: 1680, y: 460, w: 200, h: 20 },
      // Hazards (laser field on floor gap)
      { x: 500, y: 560, w: 80, h: 20, isHazard: true },
      { x: 1180, y: 560, w: 100, h: 20, isHazard: true }
    );

    terminals.push(
      { id: 'term_1', x: 670, y: 262, label: 'AUX GENERATOR A' },
      { id: 'term_2', x: 1550, y: 312, label: 'SUB-SYSTEM AIRLOCK' }
    );

    checkpoints.push(
      { id: 'cp_1', x: 890, y: 362 }
    );

    enemies.push(
      { type: 'drone', x: 420, y: 280, patrolMinX: 360, patrolMaxX: 520 },
      { type: 'bot', x: 860, y: 375, patrolMinX: 830, patrolMaxX: 980 },
      { type: 'drone', x: 1300, y: 300, patrolMinX: 1220, patrolMaxX: 1400 },
      { type: 'bot', x: 1720, y: 425, patrolMinX: 1690, patrolMaxX: 1850 }
    );

    items.push(
      { type: 'energy_cell', x: 250, y: 430 },
      { type: 'energy_cell', x: 620, y: 270 },
      { type: 'energy_cell', x: 1130, y: 300 },
      { type: 'energy_cell', x: 1340, y: 400 },
      { type: 'data_shard', x: 450, y: 350, shardId: 'shard_01' },
      { type: 'medkit', x: 920, y: 370 }
    );

    return {
      config: cfg,
      width,
      height,
      playerSpawn: { x: 70, y: 520 },
      exitAirlock: { x: 1880, y: 516 },
      platforms,
      terminals,
      checkpoints,
      enemies,
      items,
    };
  }

  if (levelId === 2) {
    // Level 2: Security Complex
    platforms.push(
      { x: 160, y: 460, w: 150, h: 20 },
      { x: 370, y: 370, w: 160, h: 20 },
      { x: 580, y: 470, w: 140, h: 20 },
      { x: 780, y: 360, w: 180, h: 20 },
      { x: 1020, y: 270, w: 160, h: 20 },
      { x: 1240, y: 380, w: 150, h: 20 },
      { x: 1450, y: 460, w: 180, h: 20 },
      { x: 1680, y: 350, w: 180, h: 20 },
      // Hazards
      { x: 330, y: 560, w: 120, h: 20, isHazard: true },
      { x: 740, y: 560, w: 140, h: 20, isHazard: true },
      { x: 1350, y: 560, w: 120, h: 20, isHazard: true }
    );

    terminals.push(
      { id: 'term_sec_card', x: 1090, y: 222, label: 'ENCRYPTION VAULT' }
    );

    checkpoints.push(
      { id: 'cp_sec', x: 860, y: 312 }
    );

    enemies.push(
      { type: 'bot', x: 420, y: 335, patrolMinX: 380, patrolMaxX: 510 },
      { type: 'drone', x: 620, y: 260, patrolMinX: 560, patrolMaxX: 700 },
      { type: 'hunter', x: 840, y: 315, patrolMinX: 790, patrolMaxX: 940 },
      { type: 'drone', x: 1100, y: 190, patrolMinX: 1040, patrolMaxX: 1160 },
      { type: 'bot', x: 1510, y: 425, patrolMinX: 1460, patrolMaxX: 1610 },
      { type: 'hunter', x: 1740, y: 305, patrolMinX: 1690, patrolMaxX: 1840 }
    );

    items.push(
      { type: 'access_card', x: 1120, y: 230 },
      { type: 'energy_cell', x: 220, y: 420 },
      { type: 'energy_cell', x: 820, y: 320 },
      { type: 'energy_cell', x: 1530, y: 420 },
      { type: 'data_shard', x: 1720, y: 310, shardId: 'shard_02' },
      { type: 'medkit', x: 620, y: 430 }
    );

    return {
      config: cfg,
      width,
      height,
      playerSpawn: { x: 70, y: 520 },
      exitAirlock: { x: 1900, y: 516 },
      platforms,
      terminals,
      checkpoints,
      enemies,
      items,
    };
  }

  if (levelId === 3) {
    // Level 3: Power Reactor (BOSS 1: WARDEN-01)
    platforms.push(
      { x: 180, y: 460, w: 180, h: 20 },
      { x: 420, y: 380, w: 220, h: 20 },
      { x: 700, y: 480, w: 240, h: 20 },
      { x: 1000, y: 400, w: 240, h: 20 },
      { x: 1300, y: 470, w: 220, h: 20 },
      // Hazards (reactor plasma core below)
      { x: 400, y: 560, w: 200, h: 20, isHazard: true },
      { x: 800, y: 560, w: 250, h: 20, isHazard: true }
    );

    checkpoints.push(
      { id: 'cp_reactor', x: 500, y: 332 }
    );

    items.push(
      { type: 'energy_cell', x: 260, y: 420 },
      { type: 'energy_cell', x: 1100, y: 360 },
      { type: 'medkit', x: 780, y: 440 },
      { type: 'data_shard', x: 1380, y: 430, shardId: 'shard_03' }
    );

    return {
      config: cfg,
      width,
      height,
      playerSpawn: { x: 80, y: 520 },
      exitAirlock: { x: 1520, y: 516 },
      platforms,
      terminals,
      checkpoints,
      enemies,
      items,
      boss: {
        type: 'warden',
        x: 1150,
        y: 330,
      },
    };
  }

  if (levelId === 4) {
    // Level 4: Experimental Labs
    platforms.push(
      { x: 160, y: 470, w: 150, h: 20 },
      { x: 380, y: 390, w: 160, h: 20 },
      { x: 620, y: 480, w: 150, h: 20 },
      { x: 820, y: 360, w: 180, h: 20 },
      { x: 1080, y: 440, w: 160, h: 20 },
      { x: 1300, y: 340, w: 180, h: 20 },
      { x: 1540, y: 430, w: 180, h: 20 },
      { x: 1760, y: 320, w: 180, h: 20 },
      // Hazards: Acid pools
      { x: 320, y: 560, w: 140, h: 20, isHazard: true },
      { x: 740, y: 560, w: 150, h: 20, isHazard: true },
      { x: 1220, y: 560, w: 140, h: 20, isHazard: true }
    );

    terminals.push(
      { id: 'term_lab_1', x: 440, y: 342, label: 'CRYO PURGE ALPHA' },
      { id: 'term_lab_2', x: 1380, y: 292, label: 'CRYO PURGE BETA' }
    );

    checkpoints.push(
      { id: 'cp_labs', x: 880, y: 312 }
    );

    enemies.push(
      { type: 'void', x: 420, y: 345, patrolMinX: 390, patrolMaxX: 520 },
      { type: 'drone', x: 660, y: 380, patrolMinX: 630, patrolMaxX: 760 },
      { type: 'hunter', x: 900, y: 315, patrolMinX: 840, patrolMaxX: 980 },
      { type: 'void', x: 1140, y: 395, patrolMinX: 1090, patrolMaxX: 1220 },
      { type: 'void', x: 1620, y: 385, patrolMinX: 1560, patrolMaxX: 1700 }
    );

    items.push(
      { type: 'energy_cell', x: 220, y: 430 },
      { type: 'energy_cell', x: 670, y: 440 },
      { type: 'energy_cell', x: 1130, y: 400 },
      { type: 'energy_cell', x: 1600, y: 390 },
      { type: 'data_shard', x: 1820, y: 280, shardId: 'shard_04' },
      { type: 'medkit', x: 850, y: 320 }
    );

    return {
      config: cfg,
      width,
      height,
      playerSpawn: { x: 70, y: 520 },
      exitAirlock: { x: 1900, y: 516 },
      platforms,
      terminals,
      checkpoints,
      enemies,
      items,
    };
  }

  if (levelId === 5) {
    // Level 5: Containment Zone (BOSS 2: THE EXPERIMENT)
    platforms.push(
      { x: 180, y: 470, w: 180, h: 20 },
      { x: 420, y: 390, w: 200, h: 20 },
      { x: 680, y: 480, w: 240, h: 20 },
      { x: 980, y: 380, w: 240, h: 20 },
      { x: 1280, y: 460, w: 220, h: 20 },
      // Hazards: Biohazard bio-mass
      { x: 480, y: 560, w: 180, h: 20, isHazard: true },
      { x: 880, y: 560, w: 200, h: 20, isHazard: true }
    );

    checkpoints.push(
      { id: 'cp_containment', x: 500, y: 342 }
    );

    items.push(
      { type: 'energy_cell', x: 260, y: 430 },
      { type: 'energy_cell', x: 1040, y: 340 },
      { type: 'medkit', x: 740, y: 440 },
      { type: 'data_shard', x: 1360, y: 420, shardId: 'shard_05' }
    );

    return {
      config: cfg,
      width,
      height,
      playerSpawn: { x: 70, y: 520 },
      exitAirlock: { x: 1520, y: 516 },
      platforms,
      terminals,
      checkpoints,
      enemies,
      items,
      boss: {
        type: 'experiment',
        x: 1100,
        y: 320,
      },
    };
  }

  // Level 6: Escape Tower (BOSS 3: BLACKSITE CORE)
  platforms.push(
    { x: 180, y: 480, w: 200, h: 20 },
    { x: 440, y: 400, w: 220, h: 20 },
    { x: 720, y: 470, w: 220, h: 20 },
    { x: 1000, y: 390, w: 260, h: 20 },
    { x: 1300, y: 460, w: 220, h: 20 },
    // Hazards: Overcharged reactor vents
    { x: 420, y: 560, w: 200, h: 20, isHazard: true },
    { x: 860, y: 560, w: 240, h: 20, isHazard: true }
  );

  checkpoints.push(
    { id: 'cp_tower', x: 520, y: 352 }
  );

  items.push(
    { type: 'energy_cell', x: 260, y: 440 },
    { type: 'energy_cell', x: 1060, y: 350 },
    { type: 'medkit', x: 780, y: 430 },
    { type: 'data_shard', x: 1380, y: 420, shardId: 'shard_06' }
  );

  return {
    config: cfg,
    width,
    height,
    playerSpawn: { x: 80, y: 520 },
    exitAirlock: { x: 1520, y: 516 },
    platforms,
    terminals,
    checkpoints,
    enemies,
    items,
    boss: {
      type: 'core',
      x: 1120,
      y: 300,
    },
  };
}
