import { useRef, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { soundManager } from '@/lib/soundManager';
import { hapticImpact } from '@/lib/telegram';

export interface RemotePlayer {
  userId: string;
  username: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  rotation: number;
  health: number;
  lastUpdate: number;
  team?: 'blue' | 'red';
  skin?: string;
  skinLevel?: number;
}

interface UseBroadcastParams {
  squadCode: string | undefined;
  userId: string | undefined;
  onHit: (damage: number, killerId: string) => void;
  onKill: () => void;
  onTeamAssigned: (team: 'blue' | 'red') => void;
}

export function useBroadcast({ squadCode, userId, onHit, onKill, onTeamAssigned }: UseBroadcastParams) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const remotePlayersRef = useRef<Map<string, RemotePlayer>>(new Map());
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (!squadCode || !userId) return;

    const channel = supabase.channel(`room_${squadCode}`, {
      config: { broadcast: { self: true } },
    });

    channel
      .on('broadcast', { event: 'player_update' }, ({ payload }) => {
        if (payload.userId === userId) return;
        const remote = remotePlayersRef.current.get(payload.userId);
        const now = Date.now();
        if (remote) {
          remote.targetX = payload.x;
          remote.targetY = payload.y;
          remote.rotation = payload.rotation;
          remote.health = payload.health;
          remote.lastUpdate = now;
        } else {
          remotePlayersRef.current.set(payload.userId, {
            ...payload,
            targetX: payload.x,
            targetY: payload.y,
            lastUpdate: now,
          });
        }
        forceUpdate({});
      })
      .on('broadcast', { event: 'player_hit' }, ({ payload }) => {
        if (payload.targetUserId === userId) {
          onHit(payload.damage, payload.killerId);
          soundManager.playHit();
        }
      })
      .on('broadcast', { event: 'player_died' }, ({ payload }) => {
        if (payload.killerId === userId) {
          onKill();
          hapticImpact('heavy');
        }
      })
      .on('broadcast', { event: 'game_started' }, ({ payload }) => {
        const { teams } = payload;
        if (teams.blue.includes(userId)) onTeamAssigned('blue');
        else onTeamAssigned('red');
      })
      .subscribe();

    channelRef.current = channel;
    return () => { channel.unsubscribe(); };
  }, [squadCode, userId]);

  const broadcast = useCallback((event: string, payload: Record<string, unknown>) => {
    channelRef.current?.send({ type: 'broadcast', event, payload });
  }, []);

  return { remotePlayersRef, channelRef, broadcast };
}
