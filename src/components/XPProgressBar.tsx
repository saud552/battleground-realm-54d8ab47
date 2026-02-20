import React from 'react';
import { motion } from 'framer-motion';
import { levelFromXP, xpProgress, xpToNextLevel, getLevelTitle } from '@/lib/xpSystem';

interface XPProgressBarProps {
  xp: number;
  level: number;
  compact?: boolean;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({ xp, level, compact = false }) => {
  const progress = xpProgress(xp);
  const remaining = xpToNextLevel(xp);
  const title = getLevelTitle(level);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-black text-primary-foreground">
          {level}
        </div>
        <div className="flex-1">
          <div className="bg-muted rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(var(--kilegram-blue)), hsl(var(--gold)))' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg font-black text-primary-foreground shadow-neon">
            {level}
          </div>
          <div>
            <span className="text-sm font-bold text-foreground">{title}</span>
            <p className="text-xs text-muted-foreground">المستوى {level}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground">{remaining} XP للمستوى التالي</span>
        </div>
      </div>
      <div className="bg-muted rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, hsl(var(--kilegram-blue)), hsl(var(--gold)))' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">{xp} XP</span>
        <span className="text-[10px] text-muted-foreground">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
};

export default XPProgressBar;
