import Phaser from 'phaser';
import { generateAllGameTextures } from '../spriteGenerator';
import { CustomizationSettings } from '../../types/game';

export class BootScene extends Phaser.Scene {
  private customization: CustomizationSettings;

  constructor() {
    super({ key: 'BootScene' });
    this.customization = {
      armorStyle: 'stealth',
      visorGlow: 'cyan',
      weaponSkin: 'standard',
      dashTrail: 'cyber_cyan',
    };
  }

  init(data: { customization?: CustomizationSettings }) {
    if (data.customization) {
      this.customization = data.customization;
    }
  }

  preload() {
    // Generate all procedural textures
    generateAllGameTextures(this, this.customization);
  }

  create() {
    // Move immediately to GameScene with level 1 or requested level
    this.scene.start('GameScene', { levelId: 1, customization: this.customization });
  }
}
