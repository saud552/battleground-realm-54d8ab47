import React, { useMemo } from 'react';
import { Edges } from '@react-three/drei';
import { BuildingData } from '@/hooks/useGameLoop';

interface BuildingsProps {
  buildings: BuildingData[];
}

const NEON_COLORS = ['#00ffcc', '#ff0066', '#00aaff', '#ffaa00', '#ff00ff'];

const Buildings: React.FC<BuildingsProps> = ({ buildings }) => {
  const buildingElements = useMemo(() => {
    return buildings.map((b, i) => {
      const neonColor = NEON_COLORS[i % NEON_COLORS.length];
      return (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color="#111827"
              roughness={0.8}
              metalness={0.2}
            />
            <Edges threshold={15} color={neonColor} lineWidth={1} />
          </mesh>
          {/* Neon accent light on top */}
          <pointLight
            position={[0, b.h / 2 + 0.5, 0]}
            color={neonColor}
            intensity={0.5}
            distance={b.h * 2}
          />
        </group>
      );
    });
  }, [buildings]);

  return <group>{buildingElements}</group>;
};

export default React.memo(Buildings);
