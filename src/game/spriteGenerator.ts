import { CustomizationSettings } from '../types/game';

/**
 * Procedural Sprite & Texture Generator for "Shadow Escape"
 * Generates original futuristic 2D assets using HTML Canvas
 */

export function generateAllGameTextures(
  scene: Phaser.Scene,
  customization: CustomizationSettings
) {
  generateKaiSprites(scene, customization);
  generateEnemySprites(scene);
  generateBossSprites(scene);
  generateEnvironmentTextures(scene);
  generateItemTextures(scene);
  generateFxTextures(scene);
}

// Color palette mapping
function getArmorColors(style: string) {
  switch (style) {
    case 'vanguard':
      return { coat: '#334155', armor: '#64748b', trim: '#94a3b8', belt: '#1e293b' };
    case 'ghost':
      return { coat: '#cbd5e1', armor: '#f8fafc', trim: '#94a3b8', belt: '#475569' };
    case 'ronin':
      return { coat: '#7f1d1d', armor: '#b91c1c', trim: '#f87171', belt: '#450a0a' };
    case 'stealth':
    default:
      return { coat: '#0f172a', armor: '#1e293b', trim: '#38bdf8', belt: '#020617' };
  }
}

function getVisorHex(glow: string) {
  switch (glow) {
    case 'amber':
      return '#f59e0b';
    case 'emerald':
      return '#10b981';
    case 'crimson':
      return '#ef4444';
    case 'cyan':
    default:
      return '#06b6d4';
  }
}

// ---- KAI SPRITES GENERATION ---- //
function generateKaiSprites(scene: Phaser.Scene, customization: CustomizationSettings) {
  const colors = getArmorColors(customization.armorStyle);
  const visorColor = getVisorHex(customization.visorGlow);

  const width = 36;
  const height = 48;

  const renderKaiFrame = (
    key: string,
    legOffset1: number,
    legOffset2: number,
    bodyBob: number,
    armAngle: number,
    isDashing: boolean = false,
    isSliding: boolean = false
  ) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, width, height);

    if (isSliding) {
      // Tactical crouch-slide pose
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(18, 44, 16, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal legs
      ctx.fillStyle = colors.armor;
      ctx.fillRect(4, 34, 20, 8);
      // Boots
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(2, 34, 6, 8);
      ctx.fillStyle = visorColor;
      ctx.fillRect(2, 40, 6, 2);

      // Torso angled
      ctx.fillStyle = colors.coat;
      ctx.fillRect(16, 24, 14, 12);
      // Head
      ctx.fillStyle = '#fecdd3';
      ctx.beginPath();
      ctx.arc(28, 20, 6, 0, Math.PI * 2);
      ctx.fill();
      // Hair
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(24, 14, 10, 4);
      // Visor
      ctx.fillStyle = visorColor;
      ctx.fillRect(27, 19, 6, 3);
      // Blaster forward
      ctx.fillStyle = '#475569';
      ctx.fillRect(30, 26, 6, 4);

      if (scene.textures.exists(key)) scene.textures.remove(key);
      scene.textures.addCanvas(key, canvas);
      return;
    }

    if (isDashing) {
      // Streamlined phase warp pose
      ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.fillRect(0, 8, width, 32);

      // Tilted torso forward
      ctx.fillStyle = colors.coat;
      ctx.fillRect(10, 14, 18, 16);
      ctx.fillStyle = colors.armor;
      ctx.fillRect(14, 16, 12, 12);

      // Trailing legs
      ctx.fillStyle = colors.armor;
      ctx.fillRect(2, 26, 14, 6);
      ctx.fillRect(4, 34, 12, 6);
      // Head
      ctx.fillStyle = '#fecdd3';
      ctx.beginPath();
      ctx.arc(28, 16, 6, 0, Math.PI * 2);
      ctx.fill();
      // Cyber visor streak
      ctx.fillStyle = visorColor;
      ctx.fillRect(24, 15, 10, 3);

      // Blaster
      ctx.fillStyle = '#334155';
      ctx.fillRect(28, 20, 8, 4);

      if (scene.textures.exists(key)) scene.textures.remove(key);
      scene.textures.addCanvas(key, canvas);
      return;
    }

    const midX = 18;
    const baseY = 44;

    // Contact shadow
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(midX, baseY + 2, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Legs & Combat Boots
    // Back leg
    ctx.fillStyle = colors.armor;
    ctx.fillRect(midX - 6 + legOffset1, baseY - 16, 5, 14);
    // Boot
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(midX - 7 + legOffset1, baseY - 5, 7, 7);
    ctx.fillStyle = visorColor; // thruster sole accent
    ctx.fillRect(midX - 7 + legOffset1, baseY + 1, 7, 1.5);

    // Front leg
    ctx.fillStyle = colors.armor;
    ctx.fillRect(midX + 1 + legOffset2, baseY - 16, 5, 14);
    // Boot
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(midX + legOffset2, baseY - 5, 7, 7);
    ctx.fillStyle = visorColor;
    ctx.fillRect(midX + legOffset2, baseY + 1, 7, 1.5);

    // 2. Tactical Coat / Jacket (trailing behind)
    ctx.fillStyle = colors.coat;
    ctx.beginPath();
    ctx.moveTo(midX - 8, baseY - 24 + bodyBob);
    ctx.lineTo(midX + 8, baseY - 24 + bodyBob);
    ctx.lineTo(midX + 9, baseY - 8 + bodyBob);
    ctx.lineTo(midX - 10, baseY - 6 + bodyBob);
    ctx.closePath();
    ctx.fill();

    // 3. Torso & Armor Vest
    ctx.fillStyle = colors.armor;
    ctx.fillRect(midX - 6, baseY - 28 + bodyBob, 12, 14);
    // Chest core / tech light
    ctx.fillStyle = visorColor;
    ctx.fillRect(midX - 2, baseY - 26 + bodyBob, 4, 3);

    // Utility belt
    ctx.fillStyle = colors.belt;
    ctx.fillRect(midX - 7, baseY - 15 + bodyBob, 14, 3);
    ctx.fillStyle = '#e2e8f0'; // Buckle
    ctx.fillRect(midX - 1.5, baseY - 15 + bodyBob, 3, 3);

    // 4. Head & Futuristic Cyber Hairstyle
    // Neck
    ctx.fillStyle = '#fecdd3';
    ctx.fillRect(midX - 2, baseY - 32 + bodyBob, 4, 4);

    // Face / Jaw
    ctx.beginPath();
    ctx.arc(midX, baseY - 34 + bodyBob, 6, 0, Math.PI * 2);
    ctx.fill();

    // Original Hair: Sleek futuristic undercut / asymmetric spiked cyber cut
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(midX - 7, baseY - 36 + bodyBob);
    ctx.lineTo(midX + 7, baseY - 40 + bodyBob);
    ctx.lineTo(midX + 3, baseY - 33 + bodyBob);
    ctx.lineTo(midX - 8, baseY - 33 + bodyBob);
    ctx.closePath();
    ctx.fill();

    // Glowing Tactical Visor / HUD Eye Implant
    ctx.fillStyle = visorColor;
    ctx.fillRect(midX + 1, baseY - 35 + bodyBob, 5, 2.5);

    // 5. Arms & Pulse Blaster
    // Arm
    ctx.fillStyle = colors.coat;
    ctx.save();
    ctx.translate(midX, baseY - 26 + bodyBob);
    ctx.rotate(armAngle);
    ctx.fillRect(0, -3, 10, 5);

    // Pulse Blaster in hand
    ctx.fillStyle = '#334155'; // gun body
    ctx.fillRect(8, -4, 10, 5);
    ctx.fillStyle = '#0f172a'; // barrel
    ctx.fillRect(18, -3, 3, 3);
    ctx.fillStyle = visorColor; // plasma chamber glow
    ctx.fillRect(11, -3, 4, 2);
    ctx.restore();

    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, canvas);
  };

  renderKaiFrame('kai_idle', 0, 0, 0, 0);
  renderKaiFrame('kai_run1', -3, 3, -1, 0.1);
  renderKaiFrame('kai_run2', -1, 1, 0, 0);
  renderKaiFrame('kai_run3', 3, -3, -1, -0.1);
  renderKaiFrame('kai_run4', 1, -1, 0, 0);
  renderKaiFrame('kai_jump', -2, 2, -2, -0.2);
  renderKaiFrame('kai_fall', 2, -2, 1, 0.2);
  renderKaiFrame('kai_dash', 0, 0, 0, 0, true);
  renderKaiFrame('kai_slide', 0, 0, 0, 0, false, true);
}

// ---- ENEMY SPRITES GENERATION ---- //
function generateEnemySprites(scene: Phaser.Scene) {
  // 1. GUARD DRONE (Flying robotic surveillance enemy)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Outer ring / chassis
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, Math.PI * 2);
    ctx.fill();

    // Armor plating
    ctx.fillStyle = '#334155';
    ctx.fillRect(6, 14, 20, 4);

    // Glowing red surveillance optic eye
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(16, 16, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fee2e2';
    ctx.beginPath();
    ctx.arc(15, 15, 2, 0, Math.PI * 2);
    ctx.fill();

    // Quad rotors / thrusters with glow
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(4, 8, 3, 2);
    ctx.fillRect(25, 8, 3, 2);
    ctx.fillRect(4, 22, 3, 2);
    ctx.fillRect(25, 22, 3, 2);

    // Pulse blaster underslung nozzle
    ctx.fillStyle = '#475569';
    ctx.fillRect(14, 25, 4, 5);

    if (scene.textures.exists('enemy_guard_drone')) scene.textures.remove('enemy_guard_drone');
    scene.textures.addCanvas('enemy_guard_drone', canvas);
  }

  // 2. SECURITY BOT (Ground-based heavy treaded patroller)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 36;
    canvas.height = 36;
    const ctx = canvas.getContext('2d')!;

    // Treads / tracks
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4, 26, 28, 8);
    // Tread wheels
    ctx.fillStyle = '#475569';
    for (let x = 6; x <= 26; x += 6) {
      ctx.beginPath();
      ctx.arc(x + 2, 30, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Chassis / Body
    ctx.fillStyle = '#334155';
    ctx.fillRect(6, 12, 24, 14);
    // Hazard stripe
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(8, 22, 20, 3);

    // Sensor head / turret
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 4, 16, 8);
    // Visor sensor
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(12, 7, 12, 3);

    // Dual laser cannon
    ctx.fillStyle = '#64748b';
    ctx.fillRect(24, 9, 10, 4);

    if (scene.textures.exists('enemy_security_bot')) scene.textures.remove('enemy_security_bot');
    scene.textures.addCanvas('enemy_security_bot', canvas);
  }

  // 3. SHADOW HUNTER (Fast humanoid assassin)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 34;
    canvas.height = 46;
    const ctx = canvas.getContext('2d')!;

    // Dark sleek suit
    ctx.fillStyle = '#090a0f';
    ctx.fillRect(12, 12, 10, 18);
    // Legs
    ctx.fillStyle = '#18181b';
    ctx.fillRect(10, 30, 5, 14);
    ctx.fillRect(19, 30, 5, 14);
    // Red cybernetic mask
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.arc(17, 8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(14, 7, 7, 2);

    // Twin energy blade
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(24, 16, 8, 2);
    ctx.fillRect(2, 16, 8, 2);

    if (scene.textures.exists('enemy_shadow_hunter')) scene.textures.remove('enemy_shadow_hunter');
    scene.textures.addCanvas('enemy_shadow_hunter', canvas);
  }

  // 4. VOID CREATURE (Mutated experimental entity)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 36;
    canvas.height = 36;
    const ctx = canvas.getContext('2d')!;

    // Shadowy shifting blob body
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.ellipse(18, 18, 14, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spikes / tendrils
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.moveTo(18, 4);
    ctx.lineTo(24, 10);
    ctx.lineTo(12, 10);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(32, 18);
    ctx.lineTo(26, 12);
    ctx.lineTo(26, 24);
    ctx.closePath();
    ctx.fill();

    // Glowing core
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(18, 18, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.arc(18, 18, 2, 0, Math.PI * 2);
    ctx.fill();

    if (scene.textures.exists('enemy_void_creature')) scene.textures.remove('enemy_void_creature');
    scene.textures.addCanvas('enemy_void_creature', canvas);
  }
}

// ---- BOSS SPRITES GENERATION ---- //
function generateBossSprites(scene: Phaser.Scene) {
  // BOSS 1: WARDEN-01 (Heavy Security Mech)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;

    // Heavy chassis
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 20, 56, 44);
    ctx.fillStyle = '#334155';
    ctx.fillRect(24, 24, 48, 36);

    // Hazard industrial stripes
    ctx.fillStyle = '#eab308';
    ctx.fillRect(26, 50, 44, 6);

    // Core visor eye
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(36, 32, 24, 8);
    ctx.fillStyle = '#fee2e2';
    ctx.fillRect(44, 34, 8, 4);

    // Shoulder missile pods
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(8, 14, 16, 20);
    ctx.fillRect(72, 14, 16, 20);
    ctx.fillStyle = '#ef4444';
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillRect(10 + c * 6, 16 + r * 8, 4, 5);
        ctx.fillRect(74 + c * 6, 16 + r * 8, 4, 5);
      }
    }

    // Heavy Gatling cannon
    ctx.fillStyle = '#475569';
    ctx.fillRect(76, 38, 18, 14);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(90, 42, 4, 6);

    // Bipedal hydraulic legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(24, 64, 14, 14);
    ctx.fillRect(58, 64, 14, 14);

    if (scene.textures.exists('boss_warden')) scene.textures.remove('boss_warden');
    scene.textures.addCanvas('boss_warden', canvas);
  }

  // BOSS 2: THE EXPERIMENT (Failed Biological Specimen)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;

    // Bio-abomination body
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.ellipse(48, 44, 38, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cybernetic spine implants
    ctx.fillStyle = '#022c22';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(24 + i * 10, 20, 6, 12);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(25 + i * 10, 22, 4, 4);
      ctx.fillStyle = '#022c22';
    }

    // Giant fanged maw
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.arc(68, 48, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    for (let t = 0; t < 5; t++) {
      ctx.fillRect(60 + t * 4, 44, 3, 7);
      ctx.fillRect(60 + t * 4, 55, 3, 6);
    }

    // Mutated cyber claws
    ctx.fillStyle = '#334155';
    ctx.fillRect(16, 52, 20, 18);
    ctx.fillRect(64, 52, 20, 18);

    if (scene.textures.exists('boss_experiment')) scene.textures.remove('boss_experiment');
    scene.textures.addCanvas('boss_experiment', canvas);
  }

  // BOSS 3: BLACKSITE CORE (AI Defense Mainframe)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;

    // Central octagonal AI chassis
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(50, 50, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(50, 50, 34, 0, Math.PI * 2);
    ctx.fill();

    // Circuit lines
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 16);
    ctx.lineTo(50, 84);
    ctx.moveTo(16, 50);
    ctx.lineTo(84, 50);
    ctx.stroke();

    // Eye Core
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(50, 50, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fecaca';
    ctx.beginPath();
    ctx.arc(50, 50, 8, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting emitter node
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(44, 2, 12, 8);
    ctx.fillRect(44, 90, 12, 8);
    ctx.fillRect(2, 44, 8, 12);
    ctx.fillRect(90, 44, 8, 12);

    if (scene.textures.exists('boss_core')) scene.textures.remove('boss_core');
    scene.textures.addCanvas('boss_core', canvas);
  }
}

// ---- ENVIRONMENT TEXTURES ---- //
function generateEnvironmentTextures(scene: Phaser.Scene) {
  // Tile: Metal Platform
  {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 32, 32);

    // Bevel edges
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 32, 3);
    ctx.fillRect(0, 0, 3, 32);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 29, 32, 3);
    ctx.fillRect(29, 0, 3, 32);

    // Screws / Rivets
    ctx.fillStyle = '#64748b';
    ctx.fillRect(4, 4, 3, 3);
    ctx.fillRect(25, 4, 3, 3);
    ctx.fillRect(4, 25, 3, 3);
    ctx.fillRect(25, 25, 3, 3);

    // Conduit stripe
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(3, 15, 26, 2);

    if (scene.textures.exists('tile_metal')) scene.textures.remove('tile_metal');
    scene.textures.addCanvas('tile_metal', canvas);
  }

  // Tile: Hazard Laser Grid (spikes/beam substitute)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fillRect(0, 0, 32, 32);

    // Laser emitters
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 24, 32, 8);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(4, 26, 6, 6);
    ctx.fillRect(14, 26, 6, 6);
    ctx.fillRect(24, 26, 6, 6);

    // Glowing laser beams
    ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.fillRect(6, 0, 2, 26);
    ctx.fillRect(16, 0, 2, 26);
    ctx.fillRect(26, 0, 2, 26);

    if (scene.textures.exists('hazard_laser')) scene.textures.remove('hazard_laser');
    scene.textures.addCanvas('hazard_laser', canvas);
  }

  // Object: Security Terminal (Hackable Console)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 36;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;

    // Base pedestal
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, 24, 20, 24);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(6, 44, 24, 4);

    // Angled screen housing
    ctx.fillStyle = '#334155';
    ctx.fillRect(4, 8, 28, 20);

    // Holographic display screen
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(6, 10, 24, 16);

    // Terminal data text lines
    ctx.fillStyle = '#ecfeff';
    ctx.fillRect(8, 13, 12, 2);
    ctx.fillRect(8, 17, 16, 2);
    ctx.fillRect(8, 21, 10, 2);

    if (scene.textures.exists('obj_terminal')) scene.textures.remove('obj_terminal');
    scene.textures.addCanvas('obj_terminal', canvas);
  }

  // Object: Checkpoint Beacon
  {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;

    // Base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(6, 38, 20, 10);
    // Pylon column
    ctx.fillStyle = '#475569';
    ctx.fillRect(13, 14, 6, 24);
    // Holographic emitter bulb
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(16, 10, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f0fdf4';
    ctx.beginPath();
    ctx.arc(16, 10, 3, 0, Math.PI * 2);
    ctx.fill();

    if (scene.textures.exists('obj_checkpoint')) scene.textures.remove('obj_checkpoint');
    scene.textures.addCanvas('obj_checkpoint', canvas);
  }

  // Object: Extraction Airlock / Exit Gate
  {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Frame
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 48, 64);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(6, 6, 36, 58);

    // Hazard frame
    ctx.fillStyle = '#eab308';
    ctx.fillRect(2, 2, 44, 4);

    // Hologram barrier
    ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.fillRect(8, 8, 32, 56);

    // Status indicator
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(24, 20, 6, 0, Math.PI * 2);
    ctx.fill();

    if (scene.textures.exists('obj_airlock')) scene.textures.remove('obj_airlock');
    scene.textures.addCanvas('obj_airlock', canvas);
  }
}

// ---- ITEM & COLLECTIBLE TEXTURES ---- //
function generateItemTextures(scene: Phaser.Scene) {
  // 1. ENERGY CELL (Glowing power core)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.moveTo(12, 2);
    ctx.lineTo(22, 12);
    ctx.lineTo(12, 22);
    ctx.lineTo(2, 12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#cffafe';
    ctx.beginPath();
    ctx.moveTo(12, 6);
    ctx.lineTo(18, 12);
    ctx.lineTo(12, 18);
    ctx.lineTo(6, 12);
    ctx.closePath();
    ctx.fill();

    if (scene.textures.exists('item_energy_cell')) scene.textures.remove('item_energy_cell');
    scene.textures.addCanvas('item_energy_cell', canvas);
  }

  // 2. DATA SHARD (Holographic lore crystal)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(12, 2);
    ctx.lineTo(20, 8);
    ctx.lineTo(18, 22);
    ctx.lineTo(6, 22);
    ctx.lineTo(4, 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.arc(12, 12, 4, 0, Math.PI * 2);
    ctx.fill();

    if (scene.textures.exists('item_data_shard')) scene.textures.remove('item_data_shard');
    scene.textures.addCanvas('item_data_shard', canvas);
  }

  // 3. NANITE MEDKIT (Health pickup)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(2, 4, 20, 16);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(9, 7, 6, 10);
    ctx.fillRect(7, 9, 10, 6);

    if (scene.textures.exists('item_medkit')) scene.textures.remove('item_medkit');
    scene.textures.addCanvas('item_medkit', canvas);
  }

  // 4. SECURITY ACCESS CARD (Golden chip)
  {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(4, 6, 16, 12);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(6, 8, 4, 8);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(12, 10, 6, 2);
    ctx.fillRect(12, 13, 4, 2);

    if (scene.textures.exists('item_access_card')) scene.textures.remove('item_access_card');
    scene.textures.addCanvas('item_access_card', canvas);
  }
}

// ---- FX & PROJECTILE TEXTURES ---- //
function generateFxTextures(scene: Phaser.Scene) {
  // Pulse Blaster Bullet
  {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 8;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(0, 1, 16, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, 2, 10, 4);

    if (scene.textures.exists('proj_pulse')) scene.textures.remove('proj_pulse');
    scene.textures.addCanvas('proj_pulse', canvas);
  }

  // Enemy Laser Bullet
  {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 8;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(0, 1, 16, 6);
    ctx.fillStyle = '#fecaca';
    ctx.fillRect(4, 2, 10, 4);

    if (scene.textures.exists('proj_enemy_laser')) scene.textures.remove('proj_enemy_laser');
    scene.textures.addCanvas('proj_enemy_laser', canvas);
  }

  // Boss Missile
  {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 10;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 2, 12, 6);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(12, 2);
    ctx.lineTo(16, 5);
    ctx.lineTo(12, 8);
    ctx.closePath();
    ctx.fill();

    if (scene.textures.exists('proj_missile')) scene.textures.remove('proj_missile');
    scene.textures.addCanvas('proj_missile', canvas);
  }

  // Particle Spark
  {
    const canvas = document.createElement('canvas');
    canvas.width = 6;
    canvas.height = 6;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(1, 1, 4, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, 2, 2, 2);

    if (scene.textures.exists('fx_spark')) scene.textures.remove('fx_spark');
    scene.textures.addCanvas('fx_spark', canvas);
  }

  // Shock Burst Ring
  {
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 96;
    const ctx = canvas.getContext('2d')!;

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(48, 48, 44, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(48, 48, 40, 0, Math.PI * 2);
    ctx.stroke();

    if (scene.textures.exists('fx_shock_burst')) scene.textures.remove('fx_shock_burst');
    scene.textures.addCanvas('fx_shock_burst', canvas);
  }

  // Kinetic Shield Bubble
  {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (scene.textures.exists('fx_shield')) scene.textures.remove('fx_shield');
    scene.textures.addCanvas('fx_shield', canvas);
  }
}
