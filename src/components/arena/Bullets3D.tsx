import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FiredBullet } from '@/lib/WeaponSystem';

interface Bullets3DProps {
  bullets: React.MutableRefObject<FiredBullet[]>;
}

const MAX_BULLETS = 100;

const Bullets3D: React.FC<Bullets3DProps> = ({ bullets }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useFrame(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const list = bullets.current;

    for (let i = 0; i < MAX_BULLETS; i++) {
      if (i < list.length) {
        const b = list[i];
        dummy.current.position.set(b.x, 0.5, b.y);
        dummy.current.scale.setScalar(1);
      } else {
        dummy.current.position.set(0, -100, 0);
        dummy.current.scale.setScalar(0);
      }
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_BULLETS]}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshStandardMaterial
        color="#ffcc00"
        emissive="#ffaa00"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

export default React.memo(Bullets3D);
