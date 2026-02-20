import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import Terrain from './Terrain';
import Buildings from './Buildings';
import PlayerModel3D from './PlayerModel3D';
import RemotePlayer3D from './RemotePlayer3D';
import Loot3D from './Loot3D';
import Bullets3D from './Bullets3D';
import VFX3D from './VFX3D';
import { Vector2, BuildingData, MAP_WIDTH, MAP_HEIGHT } from '@/hooks/useGameLoop';
import { RemotePlayer } from '@/hooks/useBroadcast';
import { FiredBullet } from '@/lib/WeaponSystem';
import { LootItem } from '@/lib/weapons';

interface Scene3DProps {
  playerPos: React.MutableRefObject<Vector2>;
  playerRotation: React.MutableRefObject<number>;
  localHealth: number;
  isDead: boolean;
  myTeam: 'blue' | 'red';
  skinLevel: number;
  remotePlayersRef: React.MutableRefObject<Map<string, RemotePlayer>>;
  bullets: React.MutableRefObject<FiredBullet[]>;
  lootItems: React.MutableRefObject<LootItem[]>;
  buildings: React.MutableRefObject<BuildingData[]>;
  zoneRadius: number;
  zoneCenterX: number;
  zoneCenterZ: number;
  tick: (timestamp: number, delta: number) => void;
}

const Scene3D: React.FC<Scene3DProps> = ({
  playerPos, playerRotation, localHealth, isDead, myTeam, skinLevel,
  remotePlayersRef, bullets, lootItems, buildings,
  zoneRadius, zoneCenterX, zoneCenterZ, tick,
}) => {
  const { camera } = useThree();
  const remotePlayers = useRef<RemotePlayer[]>([]);
  const lootRef = useRef<LootItem[]>([]);

  useFrame((state, delta) => {
    const timestamp = state.clock.elapsedTime * 1000;
    tick(timestamp, delta);

    // Follow camera
    const px = playerPos.current.x;
    const pz = playerPos.current.y;
    camera.position.set(px, 50, pz);
    (camera as THREE.OrthographicCamera).lookAt(px, 0, pz);

    // Snapshot remote players for rendering
    remotePlayers.current = Array.from(remotePlayersRef.current.values());
    lootRef.current = lootItems.current;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#8888ff" />
      <directionalLight
        position={[30, 50, 30]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Fog */}
      <fog attach="fog" args={['#0a0f1a', 60, 120]} />

      {/* Terrain */}
      <Terrain zoneRadius={zoneRadius} zoneCenterX={zoneCenterX} zoneCenterZ={zoneCenterZ} />

      {/* Buildings */}
      <Buildings buildings={buildings.current} />

      {/* Local Player */}
      <PlayerModel3D
        position={[playerPos.current.x, 0, playerPos.current.y]}
        rotation={playerRotation.current}
        team={myTeam}
        skinLevel={skinLevel}
        health={localHealth}
        isDead={isDead}
        isLocal
      />

      {/* Remote Players */}
      {remotePlayers.current.map(p => (
        <RemotePlayer3D key={p.userId} player={p} />
      ))}

      {/* Loot */}
      <Loot3D items={lootRef.current} />

      {/* Bullets */}
      <Bullets3D bullets={bullets} />

      {/* VFX */}
      <VFX3D />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.8}
          luminanceSmoothing={0.3}
          intensity={0.6}
        />
      </EffectComposer>
    </>
  );
};

export default Scene3D;
