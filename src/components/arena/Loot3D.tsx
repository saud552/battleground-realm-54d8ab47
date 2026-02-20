import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LootItem } from '@/lib/weapons';
import { MAP_WIDTH, MAP_HEIGHT } from '@/hooks/useGameLoop';

interface Loot3DProps {
  items: LootItem[];
}

const LOOT_COLORS: Record<string, string> = {
  weapon: '#ffc832',
  medkit: '#32ff64',
  armor: '#3264ff',
  ammo_556: '#ffffff',
  ammo_9mm: '#ffffff',
  ammo_300: '#ffffff',
  ammo_12g: '#ffffff',
};

const LootMesh: React.FC<{ item: LootItem; index: number }> = ({ item, index }) => {
  const ref = React.useRef<THREE.Mesh>(null);
  const x = (item.x - MAP_WIDTH / 2) / 10;
  const z = (item.y - MAP_HEIGHT / 2) / 10;
  const color = LOOT_COLORS[item.type] ?? '#ffffff';

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.5 + Math.sin(clock.elapsedTime * 2 + index) * 0.15;
      ref.current.rotation.y = clock.elapsedTime + index;
    }
  });

  return (
    <mesh ref={ref} position={[x, 0.5, z]}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  );
};

const Loot3D: React.FC<Loot3DProps> = ({ items }) => {
  return (
    <group>
      {items.map((item, i) => (
        <LootMesh key={item.id} item={item} index={i} />
      ))}
    </group>
  );
};

export default React.memo(Loot3D);
