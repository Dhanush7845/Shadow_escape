import Phaser from 'phaser';
import { soundEngine } from '../../audio/soundEngine';
import { getLevelMapData, LevelMapData, LORE_SHARDS } from '../levels/levelData';
import { CustomizationSettings, PlayerUpgrades } from '../../types/game';

interface GameSceneInitData {
  levelId?: number;
  customization?: CustomizationSettings;
  upgrades?: PlayerUpgrades;
  soundEnabled?: boolean;
  musicEnabled?: boolean;
}

export class GameScene extends Phaser.Scene {
  private levelId: number = 1;
  private mapData!: LevelMapData;
  private customization!: CustomizationSettings;
  private upgrades!: PlayerUpgrades;

  // Player state
  private player!: Phaser.Physics.Arcade.Sprite;
  private hp: number = 100;
  private maxHp: number = 100;
  private energy: number = 100;
  private maxEnergy: number = 100;
  private score: number = 0;
  private energyCellsCount: number = 0;
  private isDead: boolean = false;
  private lastCheckpoint: { x: number; y: number } = { x: 70, y: 520 };

  // Movement & Abilities
  private isDashing: boolean = false;
  private canDash: boolean = true;
  private dashCooldownTimer: number = 0;
  private isShieldActive: boolean = false;
  private isSliding: boolean = false;
  private isGrounded: boolean = false;
  private coyoteTimer: number = 0;
  private jumpBufferTimer: number = 0;
  private isFacingRight: boolean = true;
  private lastShotTime: number = 0;

  // Groups
  private platformsGroup!: Phaser.Physics.Arcade.StaticGroup;
  private hazardsGroup!: Phaser.Physics.Arcade.StaticGroup;
  private playerBulletsGroup!: Phaser.Physics.Arcade.Group;
  private enemyBulletsGroup!: Phaser.Physics.Arcade.Group;
  private enemiesGroup!: Phaser.Physics.Arcade.Group;
  private itemsGroup!: Phaser.Physics.Arcade.Group;
  private terminalsGroup!: Phaser.Physics.Arcade.StaticGroup;
  private checkpointsGroup!: Phaser.Physics.Arcade.StaticGroup;
  private exitAirlock!: Phaser.Physics.Arcade.Sprite;

  // Boss
  private bossSprite: Phaser.Physics.Arcade.Sprite | null = null;
  private bossHp: number = 0;
  private bossMaxHp: number = 0;
  private bossType: string | null = null;
  private bossTimer: number = 0;
  private bossPhase: number = 1;

  // FX & Visuals
  private shieldGraphic!: Phaser.GameObjects.Image;
  private afterimageTimer: number = 0;
  private footstepTimer: number = 0;

  // Virtual / mobile input flags
  public inputLeft: boolean = false;
  public inputRight: boolean = false;
  public inputJump: boolean = false;
  public inputDown: boolean = false;
  public inputShoot: boolean = false;
  public inputDash: boolean = false;
  public inputShock: boolean = false;
  public inputShield: boolean = false;
  public inputHack: boolean = false;

  // Nearby terminal
  private activeTerminal: { id: string; label: string; obj: Phaser.GameObjects.GameObject } | null = null;

  // Keyboard keys
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyJ!: Phaser.Input.Keyboard.Key;
  private keyK!: Phaser.Input.Keyboard.Key;
  private keyL!: Phaser.Input.Keyboard.Key;
  private keyC!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyShift!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: GameSceneInitData) {
    this.levelId = data.levelId || 1;
    this.customization = data.customization || {
      armorStyle: 'stealth',
      visorGlow: 'cyan',
      weaponSkin: 'standard',
      dashTrail: 'cyber_cyan',
    };
    this.upgrades = data.upgrades || {
      healthLevel: 1,
      energyLevel: 1,
      speedLevel: 1,
      blasterLevel: 1,
      dashLevel: 1,
    };

    // Calculate upgraded maximums
    this.maxHp = 100 + (this.upgrades.healthLevel - 1) * 25;
    this.hp = this.maxHp;
    this.maxEnergy = 100 + (this.upgrades.energyLevel - 1) * 20;
    this.energy = this.maxEnergy;

    this.isDead = false;
    this.isDashing = false;
    this.canDash = true;
    this.isShieldActive = false;
  }

  create() {
    this.mapData = getLevelMapData(this.levelId);
    const { width, height } = this.mapData;

    this.physics.world.setBounds(0, 0, width, height);

    // Parallax background layers
    this.createAtmosphericBackdrop(width, height);

    // Physics Groups
    this.platformsGroup = this.physics.add.staticGroup();
    this.hazardsGroup = this.physics.add.staticGroup();
    this.terminalsGroup = this.physics.add.staticGroup();
    this.checkpointsGroup = this.physics.add.staticGroup();
    this.itemsGroup = this.physics.add.group({ allowGravity: false });
    this.enemiesGroup = this.physics.add.group();
    this.playerBulletsGroup = this.physics.add.group({ allowGravity: false });
    this.enemyBulletsGroup = this.physics.add.group({ allowGravity: false });

    // Spawn platforms & hazards
    this.mapData.platforms.forEach((p) => {
      if (p.isHazard) {
        const hazard = this.hazardsGroup.create(p.x + p.w / 2, p.y + p.h / 2, 'hazard_laser');
        hazard.setDisplaySize(p.w, p.h);
        hazard.refreshBody();
      } else {
        const plat = this.platformsGroup.create(p.x + p.w / 2, p.y + p.h / 2, 'tile_metal');
        plat.setDisplaySize(p.w, p.h);
        plat.refreshBody();
      }
    });

    // Spawn checkpoints
    this.mapData.checkpoints.forEach((cp) => {
      const beacon = this.checkpointsGroup.create(cp.x, cp.y, 'obj_checkpoint');
      beacon.setData('id', cp.id);
      beacon.refreshBody();
    });

    // Spawn terminals
    this.mapData.terminals.forEach((term) => {
      const consoleObj = this.terminalsGroup.create(term.x, term.y, 'obj_terminal');
      consoleObj.setData('id', term.id);
      consoleObj.setData('label', term.label);
      consoleObj.setData('hacked', false);
      consoleObj.refreshBody();
    });

    // Spawn exit airlock
    this.exitAirlock = this.physics.add.sprite(
      this.mapData.exitAirlock.x,
      this.mapData.exitAirlock.y,
      'obj_airlock'
    );
    this.exitAirlock.setImmovable(true);
    (this.exitAirlock.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Spawn items & collectibles
    this.mapData.items.forEach((it) => {
      let textureKey = 'item_energy_cell';
      if (it.type === 'data_shard') textureKey = 'item_data_shard';
      if (it.type === 'medkit') textureKey = 'item_medkit';
      if (it.type === 'access_card') textureKey = 'item_access_card';

      const item = this.itemsGroup.create(it.x, it.y, textureKey);
      item.setData('itemType', it.type);
      item.setData('shardId', it.shardId);

      // Gentle floating animation
      this.tweens.add({
        targets: item,
        y: it.y - 6,
        duration: 1200 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // Spawn Player
    this.lastCheckpoint = { ...this.mapData.playerSpawn };
    this.player = this.physics.add.sprite(
      this.mapData.playerSpawn.x,
      this.mapData.playerSpawn.y,
      'kai_idle'
    );
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(980);
    this.player.setSize(22, 42);
    this.player.setOffset(7, 4);

    // Shield graphic attached to player
    this.shieldGraphic = this.add.image(this.player.x, this.player.y, 'fx_shield');
    this.shieldGraphic.setVisible(false);
    this.shieldGraphic.setDepth(15);

    // Spawn Enemies
    this.mapData.enemies.forEach((en) => {
      this.spawnEnemy(en);
    });

    // Spawn Boss if present
    if (this.mapData.boss) {
      this.spawnBoss(this.mapData.boss.type, this.mapData.boss.x, this.mapData.boss.y);
    }

    // Physics Colliders & Overlaps
    this.physics.add.collider(this.player, this.platformsGroup);
    this.physics.add.collider(this.enemiesGroup, this.platformsGroup);
    this.physics.add.overlap(this.player, this.hazardsGroup, this.handlePlayerHazard, undefined, this);
    this.physics.add.overlap(this.player, this.itemsGroup, this.handleItemCollect, undefined, this);
    this.physics.add.overlap(this.player, this.checkpointsGroup, this.handleCheckpoint, undefined, this);
    this.physics.add.overlap(this.player, this.terminalsGroup, this.handleTerminalApproach, undefined, this);
    this.physics.add.overlap(this.player, this.exitAirlock, this.handleExitAirlock, undefined, this);

    // Bullets vs World & Entities
    this.physics.add.collider(this.playerBulletsGroup, this.platformsGroup, (bullet) => {
      this.createSparkFX(
        (bullet as Phaser.Physics.Arcade.Sprite).x,
        (bullet as Phaser.Physics.Arcade.Sprite).y
      );
      bullet.destroy();
    });

    this.physics.add.collider(this.enemyBulletsGroup, this.platformsGroup, (bullet) => {
      bullet.destroy();
    });

    this.physics.add.overlap(this.playerBulletsGroup, this.enemiesGroup, this.handleBulletHitEnemy, undefined, this);
    this.physics.add.overlap(this.player, this.enemyBulletsGroup, this.handleEnemyBulletHitPlayer, undefined, this);
    this.physics.add.overlap(this.player, this.enemiesGroup, this.handleEnemyMeleeHitPlayer, undefined, this);

    if (this.bossSprite) {
      this.physics.add.overlap(this.playerBulletsGroup, this.bossSprite, this.handleBulletHitBoss, undefined, this);
      this.physics.add.overlap(this.player, this.bossSprite, this.handleBossMeleePlayer, undefined, this);
    }

    // Camera setup
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.0);

    // Setup input keys
    this.setupControls();

    // Start sci-fi synth ambient theme
    soundEngine.startAmbientTrack(this.mapData.config.lightingTone);

    // Emit initial HUD state
    this.emitHUDState();
  }

  private createAtmosphericBackdrop(width: number, height: number) {
    // Dark facility background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x06070a, 0x06070a, 0x0f172a, 0x0f172a, 1);
    bg.fillRect(0, 0, width, height);
    bg.setScrollFactor(0.2);
    bg.setDepth(-10);

    // Industrial structural girders in background
    const girders = this.add.graphics();
    girders.lineStyle(2, 0x1e293b, 0.4);
    for (let x = 40; x < width; x += 180) {
      girders.strokeRect(x, 40, 100, height - 100);
      girders.lineBetween(x, 40, x + 100, height - 60);
    }
    girders.setScrollFactor(0.5);
    girders.setDepth(-8);

    // Glowing conduit lines
    const conduits = this.add.graphics();
    conduits.lineStyle(2, 0x0284c7, 0.25);
    for (let y = 100; y < height; y += 140) {
      conduits.lineBetween(0, y, width, y);
    }
    conduits.setScrollFactor(0.7);
    conduits.setDepth(-7);

    // Floating atmospheric dust / spark particles
    for (let i = 0; i < 35; i++) {
      const pX = Math.random() * width;
      const pY = Math.random() * height;
      const particle = this.add.circle(pX, pY, 1.5, 0x38bdf8, 0.35);
      particle.setDepth(-5);
      this.tweens.add({
        targets: particle,
        y: pY - 30 - Math.random() * 40,
        alpha: { from: 0.1, to: 0.5 },
        duration: 3000 + Math.random() * 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private setupControls() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
      this.keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
      this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
      this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
      this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

      // Direct keyboard action bindings
      this.input.keyboard.on('keydown-J', () => this.firePulseBlaster());
      this.input.keyboard.on('keydown-K', () => this.triggerPhaseDash());
      this.input.keyboard.on('keydown-L', () => this.triggerShockBurst());
      this.input.keyboard.on('keydown-E', () => this.attemptHackTerminal());
    }
  }

  private spawnEnemy(def: { type: string; x: number; y: number; patrolMinX: number; patrolMaxX: number }) {
    let tex = 'enemy_guard_drone';
    if (def.type === 'bot') tex = 'enemy_security_bot';
    if (def.type === 'hunter') tex = 'enemy_shadow_hunter';
    if (def.type === 'void') tex = 'enemy_void_creature';

    const enemy = this.enemiesGroup.create(def.x, def.y, tex);
    enemy.setData('type', def.type);
    enemy.setData('patrolMinX', def.patrolMinX);
    enemy.setData('patrolMaxX', def.patrolMaxX);
    enemy.setData('dir', 1);
    enemy.setData('shootTimer', Math.random() * 120);

    let maxHp = 40;
    if (def.type === 'bot') maxHp = 70;
    if (def.type === 'hunter') maxHp = 50;
    if (def.type === 'void') maxHp = 60;

    enemy.setData('hp', maxHp);
    enemy.setData('maxHp', maxHp);

    if (def.type === 'drone') {
      (enemy.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    } else {
      enemy.setGravityY(800);
      enemy.setSize(24, 34);
    }
  }

  private spawnBoss(type: string, x: number, y: number) {
    this.bossType = type;
    let tex = 'boss_warden';
    let hp = 450;
    let name = 'WARDEN-01';

    if (type === 'experiment') {
      tex = 'boss_experiment';
      hp = 600;
      name = 'THE EXPERIMENT';
    } else if (type === 'core') {
      tex = 'boss_core';
      hp = 750;
      name = 'BLACKSITE CORE';
    }

    this.bossMaxHp = hp;
    this.bossHp = hp;

    this.bossSprite = this.physics.add.sprite(x, y, tex);
    this.bossSprite.setImmovable(true);
    (this.bossSprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.bossSprite.setData('bossName', name);

    soundEngine.playBossWarning();
    this.cameras.main.shake(600, 0.015);

    this.game.events.emit('boss-update', {
      name,
      hp: this.bossHp,
      maxHp: this.bossMaxHp,
      isVisible: true,
      phase: this.bossPhase,
    });
  }

  update(time: number, delta: number) {
    if (this.isDead) return;

    // Passive energy recharge
    const regenRate = (0.12 + (this.upgrades.energyLevel - 1) * 0.03) * (delta / 16.6);
    if (!this.isShieldActive && this.energy < this.maxEnergy) {
      this.energy = Math.min(this.maxEnergy, this.energy + regenRate);
    }

    // Shield energy drain
    if (this.isShieldActive) {
      this.energy -= 0.35 * (delta / 16.6);
      if (this.energy <= 0) {
        this.toggleShield(false);
      }
    }

    // Update Player Movement & State
    this.handlePlayerInput(time, delta);

    // Update Enemies AI
    this.updateEnemies(time, delta);

    // Update Boss AI
    if (this.bossSprite && this.bossHp > 0) {
      this.updateBoss(time, delta);
    }

    // Update Shield visual position
    if (this.isShieldActive) {
      this.shieldGraphic.setPosition(this.player.x, this.player.y);
    }

    // Terminal proximity reset check
    if (this.activeTerminal) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        (this.activeTerminal.obj as Phaser.GameObjects.Sprite).x,
        (this.activeTerminal.obj as Phaser.GameObjects.Sprite).y
      );
      if (dist > 70) {
        this.activeTerminal = null;
        this.game.events.emit('terminal-prompt', null);
      }
    }

    // Periodically sync HUD (every few frames)
    this.emitHUDState();
  }

  private handlePlayerInput(time: number, delta: number) {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    this.isGrounded = body.blocked.down || body.touching.down;

    if (this.isGrounded) {
      this.coyoteTimer = 8; // 8 frames coyote time
    } else if (this.coyoteTimer > 0) {
      this.coyoteTimer--;
    }

    // Check virtual buttons from MobileControls
    const moveLeft = this.cursors.left.isDown || this.keyA.isDown || this.inputLeft;
    const moveRight = this.cursors.right.isDown || this.keyD.isDown || this.inputRight;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keyW) ||
      Phaser.Input.Keyboard.JustDown(this.keySpace) ||
      this.inputJump;
    const crouchDown = this.cursors.down.isDown || this.keyS.isDown || this.inputDown;

    // Direct fire button check from virtual controls
    if (this.inputShoot && time - this.lastShotTime > 220) {
      this.firePulseBlaster();
    }
    if (this.inputDash && this.canDash) {
      this.triggerPhaseDash();
      this.inputDash = false;
    }
    if (this.inputShock) {
      this.triggerShockBurst();
      this.inputShock = false;
    }
    if (this.inputHack) {
      this.attemptHackTerminal();
      this.inputHack = false;
    }
    if (this.inputShield !== this.isShieldActive) {
      this.toggleShield(this.inputShield);
    }

    // Dash motion handling
    if (this.isDashing) {
      // Spawn afterimage ghost trail
      this.afterimageTimer++;
      if (this.afterimageTimer % 3 === 0) {
        const ghost = this.add.image(this.player.x, this.player.y, 'kai_dash');
        ghost.setFlipX(!this.isFacingRight);
        ghost.setTint(0x06b6d4);
        ghost.setAlpha(0.6);
        this.tweens.add({
          targets: ghost,
          alpha: 0,
          scale: 1.1,
          duration: 250,
          onComplete: () => ghost.destroy(),
        });
      }
      return;
    }

    // Base Speed with upgrade bonus
    const baseSpeed = 210 * (1 + (this.upgrades.speedLevel - 1) * 0.08);

    // Crouch slide
    if (crouchDown && this.isGrounded && Math.abs(body.velocity.x) > 40) {
      this.isSliding = true;
      this.player.setTexture('kai_slide');
      this.player.setSize(28, 22);
      this.player.setOffset(4, 24);
      body.velocity.x *= 0.98;
    } else {
      this.isSliding = false;
      this.player.setSize(22, 42);
      this.player.setOffset(7, 4);

      if (moveLeft) {
        body.setVelocityX(-baseSpeed);
        this.isFacingRight = false;
        this.player.setFlipX(true);
        if (this.isGrounded) {
          this.playRunAnimation(time);
        }
      } else if (moveRight) {
        body.setVelocityX(baseSpeed);
        this.isFacingRight = true;
        this.player.setFlipX(false);
        if (this.isGrounded) {
          this.playRunAnimation(time);
        }
      } else {
        body.setVelocityX(body.velocity.x * 0.7);
        if (this.isGrounded && Math.abs(body.velocity.x) < 15) {
          this.player.setTexture('kai_idle');
        }
      }
    }

    // Jump handling with Coyote Time & Wall Jump
    if (jumpPressed) {
      this.jumpBufferTimer = 6;
    } else if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer--;
    }

    if (this.jumpBufferTimer > 0) {
      if (this.coyoteTimer > 0) {
        // Ground Jump
        body.setVelocityY(-470);
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
        this.player.setTexture('kai_jump');
        soundEngine.playJump();
      } else if (body.blocked.left || body.touching.left) {
        // Wall Jump Right
        body.setVelocityY(-430);
        body.setVelocityX(baseSpeed * 1.2);
        this.isFacingRight = true;
        this.player.setFlipX(false);
        this.jumpBufferTimer = 0;
        this.createSparkFX(this.player.x - 12, this.player.y);
        soundEngine.playJump();
      } else if (body.blocked.right || body.touching.right) {
        // Wall Jump Left
        body.setVelocityY(-430);
        body.setVelocityX(-baseSpeed * 1.2);
        this.isFacingRight = false;
        this.player.setFlipX(true);
        this.jumpBufferTimer = 0;
        this.createSparkFX(this.player.x + 12, this.player.y);
        soundEngine.playJump();
      }
    }

    // Mid-air fall texture
    if (!this.isGrounded && body.velocity.y > 50) {
      this.player.setTexture('kai_fall');
    }
  }

  private playRunAnimation(time: number) {
    const frameIndex = Math.floor((time / 110) % 4) + 1;
    this.player.setTexture(`kai_run${frameIndex}`);

    // Footstep audio
    this.footstepTimer++;
    if (this.footstepTimer % 14 === 0) {
      soundEngine.playFootstep();
    }
  }

  public firePulseBlaster() {
    if (this.isDead) return;
    const now = this.time.now;
    const fireCooldown = 190 - (this.upgrades.blasterLevel - 1) * 15;
    if (now - this.lastShotTime < fireCooldown) return;
    this.lastShotTime = now;

    soundEngine.playPulseBlaster();

    const spawnX = this.isFacingRight ? this.player.x + 16 : this.player.x - 16;
    const spawnY = this.player.y - 2;

    const bullet = this.playerBulletsGroup.create(spawnX, spawnY, 'proj_pulse');
    bullet.setFlipX(!this.isFacingRight);

    const speed = 560 + (this.upgrades.blasterLevel - 1) * 40;
    const damage = 22 + (this.upgrades.blasterLevel - 1) * 7;
    bullet.setData('damage', damage);

    if (this.isFacingRight) {
      bullet.setVelocityX(speed);
    } else {
      bullet.setVelocityX(-speed);
    }

    // Auto cleanup bullet
    this.time.delayedCall(1600, () => {
      if (bullet.active) bullet.destroy();
    });

    // Muzzle flash recoil spark
    this.createSparkFX(spawnX, spawnY);
    this.cameras.main.shake(80, 0.003);
  }

  public triggerPhaseDash() {
    if (this.isDead || !this.canDash || this.energy < 15) return;

    this.energy -= 15;
    this.canDash = false;
    this.isDashing = true;
    this.afterimageTimer = 0;

    soundEngine.playPhaseDash();
    this.cameras.main.shake(120, 0.006);

    this.player.setTexture('kai_dash');
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const dashDistance = 580 * (1 + (this.upgrades.dashLevel - 1) * 0.15);
    const dir = this.isFacingRight ? 1 : -1;

    body.setVelocityX(dir * dashDistance);
    body.setVelocityY(0);
    body.setAllowGravity(false);

    // Dash duration
    this.time.delayedCall(220, () => {
      this.isDashing = false;
      body.setAllowGravity(true);
      this.player.setTexture('kai_idle');
    });

    // Cooldown
    const cooldown = 750 * Math.max(0.4, 1 - (this.upgrades.dashLevel - 1) * 0.12);
    this.time.delayedCall(cooldown, () => {
      this.canDash = true;
    });
  }

  public triggerShockBurst() {
    if (this.isDead || this.energy < 25) return;
    this.energy -= 25;

    soundEngine.playShockBurst();
    this.cameras.main.shake(260, 0.012);

    // Expanding shock ring
    const ring = this.add.image(this.player.x, this.player.y, 'fx_shock_burst');
    ring.setScale(0.2);
    ring.setAlpha(1.0);

    this.tweens.add({
      targets: ring,
      scale: 1.8,
      alpha: 0,
      duration: 350,
      onComplete: () => ring.destroy(),
    });

    // Destroy all enemy projectiles within radius
    const radius = 180;
    this.enemyBulletsGroup.getChildren().forEach((b) => {
      const bullet = b as Phaser.Physics.Arcade.Sprite;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, bullet.x, bullet.y) < radius) {
        this.createSparkFX(bullet.x, bullet.y);
        bullet.destroy();
      }
    });

    // Damage & stun all nearby enemies
    this.enemiesGroup.getChildren().forEach((e) => {
      const enemy = e as Phaser.Physics.Arcade.Sprite;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) < radius) {
        this.damageEnemy(enemy, 55);
      }
    });

    // Damage boss if close
    if (
      this.bossSprite &&
      Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bossSprite.x, this.bossSprite.y) < radius + 50
    ) {
      this.damageBoss(60);
    }
  }

  public toggleShield(active: boolean) {
    if (active && this.energy >= 10) {
      this.isShieldActive = true;
      this.shieldGraphic.setVisible(true);
      soundEngine.playShieldActivate();
    } else {
      this.isShieldActive = false;
      this.shieldGraphic.setVisible(false);
    }
  }

  public attemptHackTerminal() {
    if (!this.activeTerminal) return;
    const termObj = this.activeTerminal.obj as Phaser.GameObjects.Sprite;
    if (termObj.getData('hacked')) return;

    termObj.setData('hacked', true);
    termObj.setTint(0x10b981);
    soundEngine.playTerminalHack();

    this.showFloatingText(termObj.x, termObj.y - 20, 'OVERRIDE SUCCESSFUL', '#10b981');
    this.updateObjectiveProgress('terminal', 1);

    this.activeTerminal = null;
    this.game.events.emit('terminal-prompt', null);
  }

  private handleTerminalApproach(
    _player: any,
    terminal: any
  ) {
    const term = terminal as Phaser.GameObjects.Sprite;
    if (term.getData('hacked')) return;

    this.activeTerminal = {
      id: term.getData('id'),
      label: term.getData('label'),
      obj: term,
    };

    this.game.events.emit('terminal-prompt', {
      label: term.getData('label'),
      x: term.x,
      y: term.y,
    });
  }

  private handleCheckpoint(
    _player: any,
    checkpoint: any
  ) {
    const cp = checkpoint as Phaser.GameObjects.Sprite;
    if (cp.getData('activated')) return;

    cp.setData('activated', true);
    cp.setTint(0x10b981);
    this.lastCheckpoint = { x: cp.x, y: cp.y - 10 };

    soundEngine.playCheckpoint();
    this.showFloatingText(cp.x, cp.y - 30, 'CHECKPOINT SYNCED', '#06b6d4');
  }

  private handleItemCollect(
    _player: any,
    itemObj: any
  ) {
    const item = itemObj as Phaser.Physics.Arcade.Sprite;
    const itemType = item.getData('itemType');

    if (itemType === 'energy_cell') {
      this.energyCellsCount++;
      this.score += 250;
      this.energy = Math.min(this.maxEnergy, this.energy + 35);
      soundEngine.playEnergyCellPickup();
      this.showFloatingText(item.x, item.y, '+1 ENERGY CELL', '#06b6d4');
      this.updateObjectiveProgress('cells', 1);
    } else if (itemType === 'data_shard') {
      const shardId = item.getData('shardId');
      const shard = LORE_SHARDS.find((s) => s.id === shardId);
      this.score += 500;
      soundEngine.playDataShardPickup();
      this.showFloatingText(item.x, item.y, 'DATA SHARD DECRYPTED', '#a855f7');
      if (shard) {
        this.game.events.emit('lore-unlocked', shard);
      }
      this.updateObjectiveProgress('shards', 1);
    } else if (itemType === 'medkit') {
      this.hp = Math.min(this.maxHp, this.hp + 40);
      soundEngine.playEnergyCellPickup();
      this.showFloatingText(item.x, item.y, '+40 HP', '#10b981');
    } else if (itemType === 'access_card') {
      this.score += 300;
      soundEngine.playTerminalHack();
      this.showFloatingText(item.x, item.y, 'ACCESS CARD SECURED', '#f59e0b');
      this.updateObjectiveProgress('terminal', 1);
    }

    this.createSparkFX(item.x, item.y);
    item.destroy();
    this.emitHUDState();
  }

  private handleExitAirlock(
    _player: any,
    _airlock: any
  ) {
    // Verify all mandatory objectives complete
    const allObjectivesComplete = this.mapData.config.objectives.every((obj) => {
      if (obj.type === 'reach_exit') return true;
      return obj.isCompleted;
    });

    if (!allObjectivesComplete) {
      this.showFloatingText(this.player.x, this.player.y - 30, 'OBJECTIVES INCOMPLETE', '#ef4444');
      return;
    }

    // Complete exit objective
    this.updateObjectiveProgress('reach_exit', 1);

    soundEngine.playLevelComplete();
    this.physics.pause();

    this.game.events.emit('level-complete', {
      levelId: this.levelId,
      score: this.score,
      energyCells: this.energyCellsCount,
      hpRemaining: this.hp,
    });
  }

  private handlePlayerHazard(
    _player: any,
    _hazard: any
  ) {
    if (this.isDashing) return; // Invulnerable during phase dash
    this.damagePlayer(40, 'Hazard');
  }

  private handleEnemyMeleeHitPlayer(
    _player: any,
    enemyObj: any
  ) {
    if (this.isDashing) return;
    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;
    const type = enemy.getData('type');
    const dmg = type === 'hunter' ? 30 : 18;
    this.damagePlayer(dmg, 'Melee');
  }

  private handleEnemyBulletHitPlayer(
    _player: any,
    bulletObj: any
  ) {
    const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
    bullet.destroy();
    if (this.isDashing) return;
    this.damagePlayer(20, 'Laser');
  }

  private handleBossMeleePlayer(
    _player: any,
    _boss: any
  ) {
    if (this.isDashing) return;
    this.damagePlayer(35, 'Boss Contact');
  }

  private damagePlayer(amount: number, source: string) {
    if (this.isDead) return;

    if (this.isShieldActive && this.energy > 5) {
      soundEngine.playShieldHit();
      this.energy = Math.max(0, this.energy - amount * 0.6);
      this.showFloatingText(this.player.x, this.player.y - 20, 'BLOCKED', '#06b6d4');
      return;
    }

    this.hp = Math.max(0, this.hp - amount);
    soundEngine.playEnemyHit();
    this.cameras.main.shake(200, 0.015);
    this.player.setTint(0xef4444);
    this.time.delayedCall(160, () => this.player.clearTint());

    this.showFloatingText(this.player.x, this.player.y - 20, `-${amount}`, '#ef4444');
    this.emitHUDState();

    if (this.hp <= 0) {
      this.killPlayer();
    }
  }

  private killPlayer() {
    this.isDead = true;
    soundEngine.playEnemyExplode();
    this.createSparkFX(this.player.x, this.player.y);
    this.player.setVisible(false);

    this.cameras.main.flash(400, 239, 68, 68);

    this.time.delayedCall(1200, () => {
      this.respawnAtCheckpoint();
    });
  }

  private respawnAtCheckpoint() {
    this.isDead = false;
    this.hp = this.maxHp;
    this.energy = this.maxEnergy;
    this.player.setPosition(this.lastCheckpoint.x, this.lastCheckpoint.y);
    this.player.setVisible(true);
    this.player.clearTint();
    this.player.setVelocity(0, 0);

    this.cameras.main.fadeIn(400, 0, 0, 0);
    this.emitHUDState();
  }

  private handleBulletHitEnemy(
    bulletObj: any,
    enemyObj: any
  ) {
    const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;
    const dmg = bullet.getData('damage') || 25;

    this.createSparkFX(bullet.x, bullet.y);
    bullet.destroy();

    this.damageEnemy(enemy, dmg);
  }

  private damageEnemy(enemy: Phaser.Physics.Arcade.Sprite, damage: number) {
    const curHp = (enemy.getData('hp') || 40) - damage;
    enemy.setData('hp', curHp);

    soundEngine.playEnemyHit();
    enemy.setTint(0xffffff);
    this.time.delayedCall(80, () => enemy.clearTint());

    this.showFloatingText(enemy.x, enemy.y - 14, `-${damage}`, '#f87171');

    if (curHp <= 0) {
      this.destroyEnemy(enemy);
    }
  }

  private destroyEnemy(enemy: Phaser.Physics.Arcade.Sprite) {
    soundEngine.playEnemyExplode();
    this.createSparkFX(enemy.x, enemy.y);
    this.score += 150;

    // Chance to drop nanite medkit or energy cell
    if (Math.random() < 0.4) {
      const dropType = Math.random() < 0.3 ? 'medkit' : 'energy_cell';
      const tex = dropType === 'medkit' ? 'item_medkit' : 'item_energy_cell';
      const drop = this.itemsGroup.create(enemy.x, enemy.y - 4, tex);
      drop.setData('itemType', dropType);
    }

    this.updateObjectiveProgress('defeat_enemies', 1);
    enemy.destroy();
    this.emitHUDState();
  }

  private handleBulletHitBoss(
    bulletObj: any,
    _bossObj: any
  ) {
    const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
    const dmg = bullet.getData('damage') || 25;
    this.createSparkFX(bullet.x, bullet.y);
    bullet.destroy();

    this.damageBoss(dmg);
  }

  private damageBoss(dmg: number) {
    if (!this.bossSprite || this.bossHp <= 0) return;

    this.bossHp = Math.max(0, this.bossHp - dmg);
    soundEngine.playEnemyHit();

    this.bossSprite.setTint(0xffffff);
    this.time.delayedCall(90, () => {
      if (this.bossSprite) this.bossSprite.clearTint();
    });

    this.showFloatingText(this.bossSprite.x, this.bossSprite.y - 35, `-${dmg}`, '#ef4444');

    // Phase transition check
    if (this.bossHp < this.bossMaxHp * 0.5 && this.bossPhase === 1) {
      this.bossPhase = 2;
      soundEngine.playBossWarning();
      this.cameras.main.shake(400, 0.015);
      this.showFloatingText(this.bossSprite.x, this.bossSprite.y - 50, 'PHASE 2: OVERDRIVE', '#f59e0b');
    }

    this.game.events.emit('boss-update', {
      name: this.bossSprite.getData('bossName'),
      hp: this.bossHp,
      maxHp: this.bossMaxHp,
      isVisible: true,
      phase: this.bossPhase,
    });

    if (this.bossHp <= 0) {
      this.destroyBoss();
    }
  }

  private destroyBoss() {
    if (!this.bossSprite) return;

    soundEngine.playEnemyExplode();
    this.cameras.main.shake(800, 0.02);

    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(i * 120, () => {
        if (this.bossSprite) {
          this.createSparkFX(
            this.bossSprite.x + (Math.random() - 0.5) * 60,
            this.bossSprite.y + (Math.random() - 0.5) * 60
          );
        }
      });
    }

    this.score += 2500;
    this.updateObjectiveProgress('boss', 1);

    this.time.delayedCall(1000, () => {
      if (this.bossSprite) {
        this.bossSprite.destroy();
        this.bossSprite = null;
      }
      this.game.events.emit('boss-update', { isVisible: false });
    });
  }

  private updateEnemies(_time: number, _delta: number) {
    this.enemiesGroup.getChildren().forEach((e) => {
      const enemy = e as Phaser.Physics.Arcade.Sprite;
      const type = enemy.getData('type');
      const minX = enemy.getData('patrolMinX');
      const maxX = enemy.getData('patrolMaxX');
      let dir = enemy.getData('dir');

      // Patrol movement
      if (enemy.x <= minX) {
        dir = 1;
        enemy.setData('dir', 1);
        enemy.setFlipX(false);
      } else if (enemy.x >= maxX) {
        dir = -1;
        enemy.setData('dir', -1);
        enemy.setFlipX(true);
      }

      const speed = type === 'hunter' ? 140 : 60;
      enemy.setVelocityX(dir * speed);

      // Aggro / Shooting logic
      const distToPlayer = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);

      if (distToPlayer < 380) {
        let timer = (enemy.getData('shootTimer') || 0) + 1;
        if (timer > 110) {
          timer = 0;
          this.enemyShoot(enemy);
        }
        enemy.setData('shootTimer', timer);
      }
    });
  }

  private enemyShoot(enemy: Phaser.Physics.Arcade.Sprite) {
    if (!enemy.active) return;
    const bullet = this.enemyBulletsGroup.create(enemy.x, enemy.y, 'proj_enemy_laser');
    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);

    this.physics.velocityFromRotation(angle, 260, bullet.body.velocity);
    bullet.setRotation(angle);

    this.time.delayedCall(2200, () => {
      if (bullet.active) bullet.destroy();
    });
  }

  private updateBoss(_time: number, _delta: number) {
    if (!this.bossSprite) return;

    this.bossTimer++;
    const interval = this.bossPhase === 2 ? 65 : 100;

    // Hover bob
    this.bossSprite.y += Math.sin(this.bossTimer * 0.05) * 0.6;

    if (this.bossTimer % interval === 0) {
      // Choose boss attack
      const attackChoice = Math.floor(Math.random() * 3);

      if (attackChoice === 0) {
        // Laser Burst
        for (let i = -1; i <= 1; i++) {
          const b = this.enemyBulletsGroup.create(this.bossSprite.x - 20, this.bossSprite.y + i * 15, 'proj_enemy_laser');
          b.setVelocityX(-320);
          b.setVelocityY(i * 50);
        }
      } else if (attackChoice === 1) {
        // Homing Missile
        const missile = this.enemyBulletsGroup.create(this.bossSprite.x, this.bossSprite.y - 20, 'proj_missile');
        const angle = Phaser.Math.Angle.Between(this.bossSprite.x, this.bossSprite.y, this.player.x, this.player.y);
        this.physics.velocityFromRotation(angle, 280, missile.body.velocity);
        missile.setRotation(angle);
      } else {
        // Ground Shockwave / Sweep
        for (let a = 0; a < 6; a++) {
          const angle = (Math.PI * 2 * a) / 6;
          const b = this.enemyBulletsGroup.create(this.bossSprite.x, this.bossSprite.y, 'proj_enemy_laser');
          this.physics.velocityFromRotation(angle, 200, b.body.velocity);
        }
      }
    }
  }

  private updateObjectiveProgress(type: string, increment: number) {
    this.mapData.config.objectives.forEach((obj) => {
      if (obj.type === type && !obj.isCompleted) {
        obj.currentCount = Math.min(obj.targetCount, obj.currentCount + increment);
        if (obj.currentCount >= obj.targetCount) {
          obj.isCompleted = true;
          this.showFloatingText(this.player.x, this.player.y - 45, `OBJECTIVE: ${obj.description} [COMPLETED]`, '#10b981');
        }
      }
    });

    this.game.events.emit('objective-update', [...this.mapData.config.objectives]);
  }

  private createSparkFX(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      const spark = this.add.image(x, y, 'fx_spark');
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 80;
      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.2,
        duration: 250,
        onComplete: () => spark.destroy(),
      });
    }
  }

  private showFloatingText(x: number, y: number, text: string, color: string) {
    const txt = this.add.text(x, y, text, {
      fontFamily: 'Chakra Petch',
      fontSize: '14px',
      fontStyle: 'bold',
      color,
    });
    txt.setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: txt,
      y: y - 28,
      alpha: 0,
      duration: 900,
      ease: 'Cubic.easeOut',
      onComplete: () => txt.destroy(),
    });
  }

  private emitHUDState() {
    this.game.events.emit('player-stats', {
      hp: this.hp,
      maxHp: this.maxHp,
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      score: this.score,
      energyCells: this.energyCellsCount,
      canDash: this.canDash,
      isShieldActive: this.isShieldActive,
    });
  }
}
