import React, { useRef, useCallback } from 'react';
import { Vector2 } from '@/hooks/useGameLoop';

interface GameControlsProps {
  joystickVector: React.MutableRefObject<Vector2>;
  joystickActive: React.MutableRefObject<boolean>;
  shooting: React.MutableRefObject<boolean>;
  isDead: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  joystickVector, joystickActive, shooting, isDead,
}) => {
  const touchStartPos = useRef<Vector2 | null>(null);
  const joystickBasePos = useRef<Vector2>({ x: 100, y: 100 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (isDead) return;
    const touch = e.touches[0];
    if (!touch) return;

    const x = touch.clientX;
    const halfScreen = window.innerWidth / 2;

    if (x < halfScreen) {
      joystickActive.current = true;
      const pos = { x: touch.clientX, y: touch.clientY };
      touchStartPos.current = pos;
      joystickBasePos.current = pos;
      joystickVector.current = { x: 0, y: 0 };
    } else {
      shooting.current = true;
    }
  }, [isDead, joystickActive, joystickVector, shooting]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (isDead || !joystickActive.current || !touchStartPos.current) return;
    const touch = e.touches[0];
    if (!touch) return;

    const dx = touch.clientX - joystickBasePos.current.x;
    const dy = touch.clientY - joystickBasePos.current.y;
    const distance = Math.hypot(dx, dy);
    const maxDistance = 50;
    if (distance > maxDistance) {
      joystickVector.current = { x: Math.cos(Math.atan2(dy, dx)), y: Math.sin(Math.atan2(dy, dx)) };
    } else {
      joystickVector.current = { x: dx / maxDistance, y: dy / maxDistance };
    }
  }, [isDead, joystickActive, joystickVector]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    joystickActive.current = false;
    shooting.current = false;
    joystickVector.current = { x: 0, y: 0 };
    touchStartPos.current = null;
  }, [joystickActive, joystickVector, shooting]);

  return (
    <div
      className="absolute inset-0 z-10 touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    />
  );
};

export default React.memo(GameControls);
