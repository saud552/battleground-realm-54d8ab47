import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerModel3DProps {
  position: [number, number, number];
  rotation: number;
  team: 'blue' | 'red';
  skinLevel: number;
  health: number;
  isDead: boolean;
  isLocal: boolean;
}

const TEAM_COLORS = { blue: '#4d8fff', red: '#ff4d4d' };
const LEVEL_EMISSIVE: Record<number, string> = {
  1: '#000000',
  2: '#00ff88',
  3: '#00ccff',
  4: '#ff8800',
  5: '#ff00ff',
};

const PlayerModel3D: React.FC<PlayerModel3DProps> = ({
  position, rotation, team, skinLevel, health, isDead, isLocal,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const teamColor = TEAM_COLORS[team];
  const emissiveColor = LEVEL_EMISSIVE[Math.min(5, Math.max(1, skinLevel))];
  const emissiveIntensity = skinLevel >= 2 ? 0.3 * (skinLevel - 1) : 0;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -rotation + Math.PI / 2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 2;
    }
  });

  if (isDead) {
    return (
      <group position={position}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <circleGeometry args={[0.8, 16]} />
          <meshBasicMaterial color="#ff3333" transparent opacity={0.3} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position} ref={groupRef}>
      {/* Body capsule */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
        <meshStandardMaterial
          color={teamColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Weapon barrel */}
      <mesh position={[0, 0.6, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.8, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Local player indicator ring */}
      {isLocal && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.9, 1.0, 32]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Level 4+ rotating ring */}
      {skinLevel >= 4 && (
        <mesh ref={ringRef} position={[0, 1.2, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.7, 0.03, 8, 32]} />
          <meshBasicMaterial color={emissiveColor} transparent opacity={0.7} />
        </mesh>
      )}

      {/* Level 5 sparkles */}
      {skinLevel >= 5 && (
        <Sparkles
          count={20}
          scale={2}
          size={3}
          speed={0.4}
          color={emissiveColor}
          position={[0, 0.8, 0]}
        />
      )}

      {/* Health bar */}
      {health < 100 && health > 0 && (
        <group position={[0, 2, 0]}>
          {/* Background */}
          <mesh>
            <planeGeometry args={[1.2, 0.1]} />
            <meshBasicMaterial color="#222222" />
          </mesh>
          {/* Health fill */}
          <mesh position={[(health / 100 - 1) * 0.6, 0, 0.001]}>
            <planeGeometry args={[1.2 * (health / 100), 0.1]} />
            <meshBasicMaterial
              color={health > 50 ? '#00ff44' : health > 20 ? '#ffcc00' : '#ff3333'}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default React.memo(PlayerModel3D);
