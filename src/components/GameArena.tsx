// ============================================
// GameArena - 3D Orchestrator with React Three Fiber
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useSquad } from '../context/SquadContext';
import { useAuth } from '../context/AuthContext';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useBroadcast } from '@/hooks/useBroadcast';
import Scene3D from './arena/Scene3D';
import GameHUD from './arena/GameHUD';
import GameControls from './arena/GameControls';

const GameArena = () => {
  const navigate = useNavigate();
  const { currentSquad, loading } = useSquad();
  const { user, addCoins, addXP } = useAuth();

  const [myTeam, setMyTeam] = useState<'blue' | 'red'>('blue');
  const [showWeaponSelector, setShowWeaponSelector] = useState(false);

  // Redirect if no squad
  useEffect(() => {
    if (!loading && !currentSquad) navigate('/');
  }, [currentSquad, loading, navigate]);

  const handleBack = useCallback(() => {
    if (gameState.isDead) navigate('/');
    else if (window.confirm('مغادرة اللعبة؟')) navigate('/');
  }, [navigate]);

  const { remotePlayersRef, broadcast } = useBroadcast({
    squadCode: currentSquad?.squad_code,
    userId: user?.id,
    onHit: (damage, killerId) => gameState.handleHit(damage, killerId),
    onKill: () => gameState.handleKill(),
    onTeamAssigned: (team) => setMyTeam(team),
  });

  const gameState = useGameLoop({
    userId: user?.id,
    username: user?.username,
    selectedSkin: user?.selectedSkin,
    myTeam,
    remotePlayersRef,
    broadcast,
    addCoins,
    addXP,
    onSwitchWeapon: (id) => gameState.handleSwitchWeapon(id),
    isInGame: currentSquad?.status === 'in-game',
  });

  return (
    <div className="fixed inset-0 bg-background">
      {/* Touch Controls Layer */}
      <GameControls
        joystickVector={gameState.joystickVector}
        joystickActive={gameState.joystickActive}
        shooting={gameState.shooting}
        isDead={gameState.isDead}
      />

      {/* HUD Layer */}
      <GameHUD
        kills={gameState.kills}
        localHealth={gameState.localHealth}
        armor={gameState.armor}
        isDead={gameState.isDead}
        weaponDisplay={gameState.weaponDisplay}
        weaponSystem={gameState.weaponSystem.current}
        showWeaponSelector={showWeaponSelector}
        setShowWeaponSelector={setShowWeaponSelector}
        onSwitchWeapon={(id) => {
          gameState.handleSwitchWeapon(id);
          setShowWeaponSelector(false);
        }}
        onReload={gameState.handleReload}
        onBack={handleBack}
      />

      {/* 3D Canvas */}
      <Canvas
        orthographic
        camera={{
          position: [0, 50, 0],
          zoom: 15,
          near: 0.1,
          far: 200,
        }}
        shadows
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Scene3D
          playerPos={gameState.playerPos}
          playerRotation={gameState.playerRotation}
          localHealth={gameState.localHealth}
          isDead={gameState.isDead}
          myTeam={myTeam}
          skinLevel={gameState.weaponSystem.current.state.skinLevel}
          remotePlayersRef={remotePlayersRef}
          bullets={gameState.bullets}
          lootItems={gameState.lootItems}
          buildings={gameState.buildings}
          zoneRadius={gameState.zoneRadius}
          zoneCenterX={gameState.zoneCenter.current.x}
          zoneCenterZ={gameState.zoneCenter.current.y}
          tick={gameState.tick}
        />
      </Canvas>
    </div>
  );
};

export default GameArena;
