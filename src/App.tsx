/**
 * SHADOW ESCAPE
 * "Break In. Fight Out. Survive."
 * Original 2026 Action-Platformer
 */

import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { BootScene } from './game/scenes/BootScene';
import { GameScene } from './game/scenes/GameScene';
import { LEVELS_CONFIG } from './game/levels/levelData';
import {
  GameSaveData,
  CustomizationSettings,
  PlayerUpgrades,
  MissionObjective,
  DataShard,
} from './types/game';
import { soundEngine } from './audio/soundEngine';

// Components
import { MainMenu } from './components/MainMenu';
import { HUD } from './components/HUD';
import { MobileControls } from './components/MobileControls';
import { MissionsModal } from './components/MissionsModal';
import { CustomizationModal } from './components/CustomizationModal';
import { UpgradesModal } from './components/UpgradesModal';
import { CodexModal } from './components/CodexModal';
import { SettingsModal } from './components/SettingsModal';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';

const SAVE_KEY = 'shadow_escape_save_v1';

const DEFAULT_SAVE: GameSaveData = {
  version: 1,
  highestUnlockedLevel: 1,
  completedLevels: [],
  totalXP: 1200,
  totalEnergyCells: 0,
  totalScore: 0,
  unlockedShards: ['shard_01'],
  upgrades: {
    healthLevel: 1,
    energyLevel: 1,
    speedLevel: 1,
    blasterLevel: 1,
    dashLevel: 1,
  },
  customization: {
    armorStyle: 'stealth',
    visorGlow: 'cyan',
    weaponSkin: 'standard',
    dashTrail: 'cyber_cyan',
  },
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 0.75,
  touchControls: false,
  screenShake: true,
};

export default function App() {
  const [saveData, setSaveData] = useState<GameSaveData>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) return { ...DEFAULT_SAVE, ...JSON.parse(saved) };
    } catch {
      // LocalStorage unavailable
    }
    return DEFAULT_SAVE;
  });

  // Game UI flow state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'victory'>('menu');
  const [activeModal, setActiveModal] = useState<
    'none' | 'missions' | 'character' | 'upgrades' | 'codex' | 'settings'
  >('none');

  // In-game HUD state
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(100);
  const [playerEnergy, setPlayerEnergy] = useState<number>(100);
  const [playerMaxEnergy, setPlayerMaxEnergy] = useState<number>(100);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [playerCells, setPlayerCells] = useState<number>(0);
  const [canDash, setCanDash] = useState<boolean>(true);
  const [isShieldActive, setIsShieldActive] = useState<boolean>(false);
  const [objectives, setObjectives] = useState<MissionObjective[]>([]);
  const [bossInfo, setBossInfo] = useState<{
    name: string;
    hp: number;
    maxHp: number;
    isVisible: boolean;
    phase?: number;
  } | null>(null);
  const [terminalPrompt, setTerminalPrompt] = useState<{ label: string } | null>(null);
  const [victoryStats, setVictoryStats] = useState<{
    levelId: number;
    score: number;
    energyCells: number;
    hpRemaining: number;
  } | null>(null);

  // Auto-detect mobile device on mount
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  // Sync save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch {
      // ignore
    }
  }, [saveData]);

  // Detect touch device
  useEffect(() => {
    const checkTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobileDevice(checkTouch);
  }, []);

  // Initialize sound settings
  useEffect(() => {
    soundEngine.setSoundEnabled(saveData.soundEnabled);
    soundEngine.setMusicEnabled(saveData.musicEnabled);
    soundEngine.setVolume(saveData.soundVolume);
  }, [saveData.soundEnabled, saveData.musicEnabled, saveData.soundVolume]);

  // Clean up Phaser game instance
  const destroyGame = () => {
    soundEngine.stopAmbientTrack();
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    }
  };

  // Launch Phaser game session
  const startGame = (levelId: number = 1) => {
    destroyGame();
    setCurrentLevelId(levelId);
    setGameState('playing');
    setActiveModal('none');
    setVictoryStats(null);
    setTerminalPrompt(null);
    setBossInfo(null);

    const levelConfig = LEVELS_CONFIG.find((l) => l.id === levelId) || LEVELS_CONFIG[0];
    setObjectives([...levelConfig.objectives]);

    setTimeout(() => {
      if (!gameContainerRef.current) return;

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: gameContainerRef.current,
        width: 1024,
        height: 576,
        backgroundColor: '#06070a',
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0, x: 0 },
            debug: false,
          },
        },
        scene: [BootScene, GameScene],
      };

      const game = new Phaser.Game(config);
      phaserGameRef.current = game;

      // Listen to GameScene events
      game.events.on('player-stats', (stats: {
        hp: number;
        maxHp: number;
        energy: number;
        maxEnergy: number;
        score: number;
        energyCells: number;
        canDash: boolean;
        isShieldActive: boolean;
      }) => {
        setPlayerHp(stats.hp);
        setPlayerMaxHp(stats.maxHp);
        setPlayerEnergy(stats.energy);
        setPlayerMaxEnergy(stats.maxEnergy);
        setPlayerScore(stats.score);
        setPlayerCells(stats.energyCells);
        setCanDash(stats.canDash);
        setIsShieldActive(stats.isShieldActive);
      });

      game.events.on('objective-update', (objs: MissionObjective[]) => {
        setObjectives(objs);
      });

      game.events.on('boss-update', (boss: {
        name: string;
        hp: number;
        maxHp: number;
        isVisible: boolean;
        phase?: number;
      }) => {
        setBossInfo(boss);
      });

      game.events.on('terminal-prompt', (prompt: { label: string } | null) => {
        setTerminalPrompt(prompt);
      });

      game.events.on('lore-unlocked', (shard: DataShard) => {
        setSaveData((prev) => {
          if (prev.unlockedShards.includes(shard.id)) return prev;
          return {
            ...prev,
            unlockedShards: [...prev.unlockedShards, shard.id],
            totalXP: prev.totalXP + 400,
          };
        });
      });

      game.events.on('level-complete', (stats: {
        levelId: number;
        score: number;
        energyCells: number;
        hpRemaining: number;
      }) => {
        setGameState('victory');
        setVictoryStats(stats);

        // Update progression
        setSaveData((prev) => {
          const nextLevel = Math.max(prev.highestUnlockedLevel, stats.levelId + 1);
          const completed = prev.completedLevels.includes(stats.levelId)
            ? prev.completedLevels
            : [...prev.completedLevels, stats.levelId];

          return {
            ...prev,
            highestUnlockedLevel: Math.min(6, nextLevel),
            completedLevels: completed,
            totalXP: prev.totalXP + stats.score + 500,
            totalEnergyCells: prev.totalEnergyCells + stats.energyCells,
            totalScore: prev.totalScore + stats.score,
          };
        });
      });

      // Pass scene parameters to BootScene
      game.scene.start('BootScene', {
        levelId,
        customization: saveData.customization,
        upgrades: saveData.upgrades,
      });
    }, 50);
  };

  // Keyboard shortcut for Pause (ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameState === 'playing') {
        pauseGame();
      } else if (e.key === 'Escape' && gameState === 'paused') {
        resumeGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const pauseGame = () => {
    if (phaserGameRef.current) {
      phaserGameRef.current.scene.pause('GameScene');
    }
    setGameState('paused');
  };

  const resumeGame = () => {
    if (phaserGameRef.current) {
      phaserGameRef.current.scene.resume('GameScene');
    }
    setGameState('playing');
  };

  const returnToMainMenu = () => {
    destroyGame();
    setGameState('menu');
  };

  // Virtual Mobile Controls Handlers
  const getActiveGameScene = (): GameScene | null => {
    if (!phaserGameRef.current) return null;
    return phaserGameRef.current.scene.getScene('GameScene') as GameScene;
  };

  const handleMobileLeft = (down: boolean) => {
    const scene = getActiveGameScene();
    if (scene) scene.inputLeft = down;
  };

  const handleMobileRight = (down: boolean) => {
    const scene = getActiveGameScene();
    if (scene) scene.inputRight = down;
  };

  const handleMobileDown = (down: boolean) => {
    const scene = getActiveGameScene();
    if (scene) scene.inputDown = down;
  };

  const handleMobileJump = (down: boolean) => {
    const scene = getActiveGameScene();
    if (scene) scene.inputJump = down;
  };

  const handleMobileShoot = (down: boolean) => {
    const scene = getActiveGameScene();
    if (scene) {
      scene.inputShoot = down;
      if (down) scene.firePulseBlaster();
    }
  };

  const handleMobileDash = () => {
    const scene = getActiveGameScene();
    if (scene) scene.triggerPhaseDash();
  };

  const handleMobileShock = () => {
    const scene = getActiveGameScene();
    if (scene) scene.triggerShockBurst();
  };

  const handleMobileShield = (active: boolean) => {
    const scene = getActiveGameScene();
    if (scene) scene.toggleShield(active);
  };

  const handleHackTerminal = () => {
    const scene = getActiveGameScene();
    if (scene) scene.attemptHackTerminal();
  };

  // Upgrades & Customization
  const handleApplyUpgrades = (newUpgrades: PlayerUpgrades, xpDeducted: number) => {
    setSaveData((prev) => ({
      ...prev,
      upgrades: newUpgrades,
      totalXP: Math.max(0, prev.totalXP - xpDeducted),
    }));
  };

  const handleApplyCustomization = (newCustom: CustomizationSettings) => {
    setSaveData((prev) => ({
      ...prev,
      customization: newCustom,
    }));
  };

  const handleResetSave = () => {
    setSaveData(DEFAULT_SAVE);
    localStorage.removeItem(SAVE_KEY);
  };

  const showMobileControls =
    (saveData.touchControls || isMobileDevice) && gameState === 'playing';

  const curLevelDef = LEVELS_CONFIG.find((l) => l.id === currentLevelId) || LEVELS_CONFIG[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 font-sans text-neutral-100 flex flex-col items-center justify-center select-none">
      {/* 1. Main Menu View */}
      {gameState === 'menu' && (
        <MainMenu
          onStartGame={(levelId) => startGame(levelId || saveData.highestUnlockedLevel)}
          onOpenMissions={() => setActiveModal('missions')}
          onOpenCharacter={() => setActiveModal('character')}
          onOpenUpgrades={() => setActiveModal('upgrades')}
          onOpenCodex={() => setActiveModal('codex')}
          onOpenSettings={() => setActiveModal('settings')}
          customization={saveData.customization}
          highestLevel={saveData.highestUnlockedLevel}
        />
      )}

      {/* 2. Active Game Canvas Container */}
      <div
        id="phaser-game-wrapper"
        className={`relative w-full h-full flex items-center justify-center ${
          gameState === 'menu' ? 'hidden' : 'block'
        }`}
      >
        <div
          ref={gameContainerRef}
          id="phaser-container"
          className="w-full h-full max-w-full max-h-full flex items-center justify-center overflow-hidden"
        />

        {/* HUD Overlay */}
        {(gameState === 'playing' || gameState === 'paused') && (
          <HUD
            hp={playerHp}
            maxHp={playerMaxHp}
            energy={playerEnergy}
            maxEnergy={playerMaxEnergy}
            score={playerScore}
            energyCells={playerCells}
            objectives={objectives}
            bossInfo={bossInfo}
            terminalPrompt={terminalPrompt}
            canDash={canDash}
            isShieldActive={isShieldActive}
            onHackTerminal={handleHackTerminal}
            onPause={pauseGame}
          />
        )}

        {/* Touch Controls Overlay */}
        {showMobileControls && (
          <MobileControls
            onLeft={handleMobileLeft}
            onRight={handleMobileRight}
            onDown={handleMobileDown}
            onJump={handleMobileJump}
            onShoot={handleMobileShoot}
            onDash={handleMobileDash}
            onShock={handleMobileShock}
            onShieldToggle={handleMobileShield}
            onHack={handleHackTerminal}
            isShieldActive={isShieldActive}
            canDash={canDash}
            hasTerminalPrompt={Boolean(terminalPrompt)}
          />
        )}
      </div>

      {/* 3. Pause Screen Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={resumeGame}
          onRestart={() => startGame(currentLevelId)}
          onMainMenu={returnToMainMenu}
          onOpenSettings={() => setActiveModal('settings')}
          levelTitle={curLevelDef.title}
        />
      )}

      {/* 4. Victory / Level Complete Modal */}
      {gameState === 'victory' && victoryStats && (
        <VictoryModal
          levelId={victoryStats.levelId}
          score={victoryStats.score}
          energyCells={victoryStats.energyCells}
          hpRemaining={victoryStats.hpRemaining}
          onNextLevel={() => startGame(Math.min(6, currentLevelId + 1))}
          onReplay={() => startGame(currentLevelId)}
          onMainMenu={returnToMainMenu}
        />
      )}

      {/* 5. Sub-Modals */}
      {activeModal === 'missions' && (
        <MissionsModal
          onClose={() => setActiveModal('none')}
          onSelectLevel={(levelId) => startGame(levelId)}
          highestUnlockedLevel={saveData.highestUnlockedLevel}
          completedLevels={saveData.completedLevels}
        />
      )}

      {activeModal === 'character' && (
        <CustomizationModal
          onClose={() => setActiveModal('none')}
          customization={saveData.customization}
          onSave={handleApplyCustomization}
        />
      )}

      {activeModal === 'upgrades' && (
        <UpgradesModal
          onClose={() => setActiveModal('none')}
          upgrades={saveData.upgrades}
          totalXP={saveData.totalXP}
          totalEnergyCells={saveData.totalEnergyCells}
          onUpgrade={handleApplyUpgrades}
        />
      )}

      {activeModal === 'codex' && (
        <CodexModal
          onClose={() => setActiveModal('none')}
          unlockedShardIds={saveData.unlockedShards}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          onClose={() => setActiveModal('none')}
          soundEnabled={saveData.soundEnabled}
          musicEnabled={saveData.musicEnabled}
          soundVolume={saveData.soundVolume}
          touchControls={saveData.touchControls}
          screenShake={saveData.screenShake}
          onUpdateSettings={(newSet) => setSaveData((prev) => ({ ...prev, ...newSet }))}
          onResetSave={handleResetSave}
        />
      )}
    </div>
  );
}
