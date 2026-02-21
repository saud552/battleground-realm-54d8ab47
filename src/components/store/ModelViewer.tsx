// ============================================
// 3D Model Viewer Card — Canvas wrapper with Bounds for auto-fit
// ============================================

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Bounds } from '@react-three/drei';

interface ModelViewerProps {
  children: React.ReactNode;
  height?: string;
  orbitControls?: boolean;
  bgColor?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  children,
  height = 'h-48',
  orbitControls = false,
  bgColor = 'transparent',
}) => (
  <div className={`${height} w-full rounded-xl overflow-hidden`} style={{ background: bgColor }}>
    <Canvas camera={{ position: [0, 0.5, 3], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={2.0} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} />
      <directionalLight position={[-5, 3, -3]} intensity={1.5} color="#6688ff" />
      <directionalLight position={[0, -3, 5]} intensity={1.0} color="#ff8866" />
      <Environment preset="studio" />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.4}>
          {children}
        </Bounds>
      </Suspense>
      {orbitControls && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />}
    </Canvas>
  </div>
);

export default ModelViewer;
