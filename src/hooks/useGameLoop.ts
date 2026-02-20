import { useRef, useState, useCallback, useEffect } from 'react';
import { WeaponSystem, FiredBullet, FireResult } from '@/lib/WeaponSystem';
import { soundManager } from '@/lib/soundManager';
import { hapticImpact } from '@/lib/telegram';
import {
  WEAPONS, LootItem, LootType, LOOT_CONFIGS, AmmoType,
} from '@/lib/weapons';
import { RemotePlayer } from './useBroadcast';

// Constants
export const MAP_WIDTH = 2000;
export const MAP_HEIGHT = 2000;
export const PLAYER_RADIUS = 15;
const PLAYER_SPEED = 4;
const BROADCAST_INTERVAL = 50;
const REMOTE_TIMEOUT = 2000;
const ZONE_START_RADIUS = 800;
const ZONE_SHRINK_RATE = 50;
const ZONE_SHRINK_INTERVAL = 10000;
const ZONE_DAMAGE = 0.5;
const MIN_ZONE_RADIUS = 150;
const LOOT_SPAWN_COUNT = 30;

export interface Vector2 { x: number; y: number }

function generateLoot(): LootItem[] {
  const types: LootType[] = ['ammo_556', 'ammo_9mm', 'ammo_300', 'ammo_12g', 'medkit', 'armor'];
  const weaponIds = Object.keys(WEAPONS);
  const items: LootItem[] = [];
  for (let i = 0; i < LOOT_SPAWN_COUNT; i++) {
    const isWeapon = Math.random() < 0.15;
    const type: LootType = isWeapon ? 'weapon' : types[Math.floor(Math.random() * types.length)];
    const config = LOOT_CONFIGS[type];
    items.push({
      id: `loot_${i}`,
      x: Math.random() * (MAP_WIDTH - 100) + 50,
      y: Math.random() * (MAP_HEIGHT - 100) + 50,
      type,
      amount: config.amount,
      weaponId: isWeapon ? weaponIds[Math.floor(Math.random() * weaponIds.length)] : undefined,
      radius: config.radius,
      emoji: isWeapon ? '🔫' : config.emoji,
    });
  }
  return items;
}

// Building collision data
export interface BuildingData {
  x: number; z: number; w: number; d: number; h: number;
}

function generateBuildings(): BuildingData[] {
  const buildings: BuildingData[] = [];
  const count = 20;
  for (let i = 0; i < count; i++) {
    const w = 3 + Math.random() * 5;
    const d = 3 + Math.random() * 5;
    const h = 2 + Math.random() * 4;
    let x: number, z: number;
    do {
      x = (Math.random() - 0.5) * (MAP_WIDTH / 10 - 20);
      z = (Math.random() - 0.5) * (MAP_HEIGHT / 10 - 20);
    } while (Math.hypot(x, z) < 15); // avoid center spawn
    buildings.push({ x, z, w, d, h });
  }
  return buildings;
}

interface UseGameLoopParams {
  userId: string | undefined;
  username: string | undefined;
  selectedSkin: string | undefined;
  myTeam: 'blue' | 'red';
  remotePlayersRef: React.MutableRefObject<Map<string, RemotePlayer>>;
  broadcast: (event: string, payload: Record<string, unknown>) => void;
  addCoins: (n: number) => void;
  addXP: (n: number) => void;
  onSwitchWeapon: (id: string) => void;
  isInGame: boolean;
}

export function useGameLoop(params: UseGameLoopParams) {
  const {
    userId, username, selectedSkin, myTeam,
    remotePlayersRef, broadcast, addCoins, addXP, onSwitchWeapon, isInGame,
  } = params;

  const weaponSystem = useRef(new WeaponSystem());
  const playerPos = useRef<Vector2>({ x: 0, y: 0 }); // in 3D units (map/10)
  const playerRotation = useRef(0);
  const playerVel = useRef<Vector2>({ x: 0, y: 0 });
  const joystickVector = useRef<Vector2>({ x: 0, y: 0 });
  const joystickActive = useRef(false);
  const shooting = useRef(false);
  const bullets = useRef<FiredBullet[]>([]);
  const lootItems = useRef<LootItem[]>(generateLoot());
  const lastBroadcastTime = useRef(0);

  const [localHealth, setLocalHealth] = useState(100);
  const [armor, setArmor] = useState(0);
  const [isDead, setIsDead] = useState(false);
  const [kills, setKills] = useState(0);
  const [weaponDisplay, setWeaponDisplay] = useState(weaponSystem.current.getDisplayState());
  const [zoneRadius, setZoneRadius] = useState(ZONE_START_RADIUS / 10); // in 3D units
  const zoneCenter = useRef<Vector2>({ x: 0, y: 0 });

  const buildings = useRef<BuildingData[]>(generateBuildings());

  // Zone shrinking
  useEffect(() => {
    if (!isInGame) return;
    const interval = setInterval(() => {
      setZoneRadius(prev => Math.max(MIN_ZONE_RADIUS / 10, prev - ZONE_SHRINK_RATE / 10));
    }, ZONE_SHRINK_INTERVAL);
    return () => clearInterval(interval);
  }, [isInGame]);

  // Cleanup
  useEffect(() => {
    return () => { weaponSystem.current.destroy(); };
  }, []);

  const handleHit = useCallback((damage: number, _killerId: string) => {
    setLocalHealth(prev => {
      const absorbed = Math.min(armor, damage * 0.5);
      const actualDamage = damage - absorbed;
      if (absorbed > 0) setArmor(a => Math.max(0, a - absorbed));
      const newHealth = Math.max(0, prev - actualDamage);
      if (newHealth <= 0 && !isDead) {
        setIsDead(true);
        broadcast('player_died', { userId, killerId: _killerId });
      }
      return newHealth;
    });
  }, [armor, isDead, userId, broadcast]);

  const handleKill = useCallback(() => {
    addCoins(10);
    addXP(20);
    setKills(prev => prev + 1);
  }, [addCoins, addXP]);

  const handleReload = useCallback(() => {
    const started = weaponSystem.current.startReload(() => {
      setWeaponDisplay(weaponSystem.current.getDisplayState());
    });
    if (started) {
      soundManager.playReload();
      setWeaponDisplay(weaponSystem.current.getDisplayState());
    }
  }, []);

  const handleSwitchWeapon = useCallback((weaponId: string) => {
    weaponSystem.current.switchWeapon(weaponId);
    setWeaponDisplay(weaponSystem.current.getDisplayState());
  }, []);

  // Called each frame from useFrame
  const tick = useCallback((timestamp: number, delta: number) => {
    if (isDead) return;

    const ws = weaponSystem.current;
    const speed = PLAYER_SPEED / 10; // scale for 3D units

    // Movement
    if (joystickActive.current) {
      const joy = joystickVector.current;
      const len = Math.hypot(joy.x, joy.y);
      if (len > 0) {
        playerVel.current.x = (joy.x / len) * speed;
        playerVel.current.y = (joy.y / len) * speed;
        playerRotation.current = Math.atan2(joy.y, joy.x);
      }
    } else {
      playerVel.current.x *= 0.95;
      playerVel.current.y *= 0.95;
      if (Math.abs(playerVel.current.x) < 0.01) playerVel.current.x = 0;
      if (Math.abs(playerVel.current.y) < 0.01) playerVel.current.y = 0;
    }

    const mapHalf = MAP_WIDTH / 20; // half map in 3D units
    playerPos.current.x = Math.max(-mapHalf, Math.min(mapHalf, playerPos.current.x + playerVel.current.x));
    playerPos.current.y = Math.max(-mapHalf, Math.min(mapHalf, playerPos.current.y + playerVel.current.y));

    // Shooting
    if (shooting.current) {
      // Convert 3D position to game coords for WeaponSystem
      const px = playerPos.current.x * 10 + MAP_WIDTH / 2;
      const py = playerPos.current.y * 10 + MAP_HEIGHT / 2;
      const result: FireResult | null = ws.tryFire(
        timestamp, px, py,
        playerRotation.current, PLAYER_RADIUS, userId ?? '',
      );
      if (result) {
        // Scale bullets to 3D space
        result.bullets.forEach(b => {
          b.x = (b.x - MAP_WIDTH / 2) / 10;
          b.y = (b.y - MAP_HEIGHT / 2) / 10;
          b.vx /= 10;
          b.vy /= 10;
        });
        bullets.current.push(...result.bullets);
        soundManager.playGunshot(ws.weapon.soundId);
        hapticImpact('light');
        setWeaponDisplay(ws.getDisplayState());
      }
    }

    if (ws.state.isReloading) {
      setWeaponDisplay(ws.getDisplayState());
    }

    // Update bullets
    const playerR3D = PLAYER_RADIUS / 10;
    bullets.current = bullets.current
      .map(b => {
        b.x += b.vx;
        b.y += b.vy;
        b.life -= delta;

        // Check collision with remote players
        for (const [id, remote] of remotePlayersRef.current.entries()) {
          if (remote.health <= 0 || remote.team === myTeam) continue;
          const rx = (remote.x - MAP_WIDTH / 2) / 10;
          const ry = (remote.y - MAP_HEIGHT / 2) / 10;
          const dist = Math.hypot(b.x - rx, b.y - ry);
          if (dist < playerR3D + 0.2) {
            remote.health -= b.damage;
            const isKill = remote.health <= 0;
            broadcast('player_hit', { targetUserId: id, damage: b.damage, killerId: userId });
            if (isKill) {
              broadcast('player_died', { userId: id, killerId: userId });
            }
            return null;
          }
        }
        return b;
      })
      .filter(b => b !== null && b.life > 0 && Math.abs(b.x) < mapHalf && Math.abs(b.y) < mapHalf) as FiredBullet[];

    // Loot pickup
    lootItems.current = lootItems.current.filter(loot => {
      const lx = (loot.x - MAP_WIDTH / 2) / 10;
      const ly = (loot.y - MAP_HEIGHT / 2) / 10;
      const dist = Math.hypot(playerPos.current.x - lx, playerPos.current.y - ly);
      if (dist < playerR3D + loot.radius / 10) {
        soundManager.playPickup();
        hapticImpact('light');
        if (loot.type === 'medkit') setLocalHealth(h => Math.min(100, h + loot.amount));
        else if (loot.type === 'armor') setArmor(a => Math.min(100, a + loot.amount));
        else if (loot.type === 'weapon' && loot.weaponId) handleSwitchWeapon(loot.weaponId);
        else {
          const ammoMap: Record<string, AmmoType> = {
            ammo_556: '5.56mm', ammo_9mm: '9mm', ammo_300: '.300mag', ammo_12g: '12gauge',
          };
          const ammoType = ammoMap[loot.type];
          if (ammoType) { ws.addAmmo(ammoType, loot.amount); setWeaponDisplay(ws.getDisplayState()); }
        }
        return false;
      }
      return true;
    });

    // Remote player interpolation & timeout
    const now = Date.now();
    remotePlayersRef.current.forEach((remote, id) => {
      remote.x += (remote.targetX - remote.x) * 0.1;
      remote.y += (remote.targetY - remote.y) * 0.1;
      if (now - remote.lastUpdate > REMOTE_TIMEOUT) remotePlayersRef.current.delete(id);
    });

    // Zone damage
    const distFromCenter = Math.hypot(playerPos.current.x - zoneCenter.current.x, playerPos.current.y - zoneCenter.current.y);
    if (distFromCenter > zoneRadius) {
      setLocalHealth(prev => Math.max(0, prev - ZONE_DAMAGE));
    }

    // Broadcast
    if (timestamp - lastBroadcastTime.current > BROADCAST_INTERVAL) {
      lastBroadcastTime.current = timestamp;
      const px = playerPos.current.x * 10 + MAP_WIDTH / 2;
      const py = playerPos.current.y * 10 + MAP_HEIGHT / 2;
      broadcast('player_update', {
        userId, username,
        x: px, y: py,
        rotation: playerRotation.current,
        health: localHealth, team: myTeam,
        skin: selectedSkin,
        skinLevel: ws.state.skinLevel,
      });
    }
  }, [isDead, userId, username, selectedSkin, myTeam, broadcast, remotePlayersRef, handleSwitchWeapon, zoneRadius, armor, localHealth]);

  return {
    weaponSystem,
    playerPos,
    playerRotation,
    playerVel,
    joystickVector,
    joystickActive,
    shooting,
    bullets,
    lootItems,
    buildings,
    localHealth,
    armor,
    isDead,
    kills,
    weaponDisplay,
    zoneRadius,
    zoneCenter,
    tick,
    handleReload,
    handleSwitchWeapon,
    handleHit,
    handleKill,
    setWeaponDisplay,
  };
}
