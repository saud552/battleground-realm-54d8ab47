import React from 'react';
import { Html } from '@react-three/drei';
import PlayerModel3D from './PlayerModel3D';
import { MAP_WIDTH, MAP_HEIGHT } from '@/hooks/useGameLoop';
import { RemotePlayer } from '@/hooks/useBroadcast';

interface RemotePlayer3DProps {
  player: RemotePlayer;
}

const RemotePlayer3DComp: React.FC<RemotePlayer3DProps> = ({ player }) => {
  const x = (player.x - MAP_WIDTH / 2) / 10;
  const z = (player.y - MAP_HEIGHT / 2) / 10;
  const isDead = player.health <= 0;

  return (
    <group>
      <PlayerModel3D
        position={[x, 0, z]}
        rotation={player.rotation}
        team={(player.team as 'blue' | 'red') ?? 'red'}
        skinLevel={player.skinLevel ?? 1}
        health={player.health}
        isDead={isDead}
        isLocal={false}
      />
      {!isDead && (
        <Html
          position={[x, 2.3, z]}
          center
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div className="text-white text-[10px] font-mono bg-black/50 px-1 rounded whitespace-nowrap">
            {player.username}
          </div>
        </Html>
      )}
    </group>
  );
};

export default React.memo(RemotePlayer3DComp);
