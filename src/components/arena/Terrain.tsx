import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MAP_WIDTH, MAP_HEIGHT } from '@/hooks/useGameLoop';

const MAP_SIZE_3D = MAP_WIDTH / 10; // 200 units

interface TerrainProps {
  zoneRadius: number;
  zoneCenterX: number;
  zoneCenterZ: number;
}

const Terrain: React.FC<TerrainProps> = ({ zoneRadius, zoneCenterX, zoneCenterZ }) => {
  const zoneRef = useRef<THREE.Mesh>(null);

  // Grid texture
  const gridTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0a0f1a';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.12)';
    ctx.lineWidth = 1;
    const step = 512 / 10;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(512, i * step);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(MAP_SIZE_3D / 10, MAP_SIZE_3D / 10);
    return tex;
  }, []);

  useFrame(() => {
    if (zoneRef.current) {
      zoneRef.current.scale.set(zoneRadius * 2, 1, zoneRadius * 2);
    }
  });

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[MAP_SIZE_3D, MAP_SIZE_3D]} />
        <meshStandardMaterial map={gridTexture} color="#0d1525" />
      </mesh>

      {/* Zone ring */}
      <mesh
        ref={zoneRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[zoneCenterX, 0.02, zoneCenterZ]}
      >
        <ringGeometry args={[0.48, 0.5, 64]} />
        <meshBasicMaterial color="#00ff44" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Danger zone (large red overlay outside zone) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[zoneCenterX, 0.01, zoneCenterZ]}>
        <ringGeometry args={[zoneRadius, MAP_SIZE_3D, 64]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      {/* Map boundary edges */}
      <lineSegments position={[0, 0.05, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(MAP_SIZE_3D, MAP_SIZE_3D)]} />
        <lineBasicMaterial color="#00aaff" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
};

export default React.memo(Terrain);
