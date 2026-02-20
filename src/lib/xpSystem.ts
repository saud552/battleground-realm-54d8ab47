// ============================================
// XP & Leveling System
// ============================================

/** XP required to reach a given level */
export const xpForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(50 * Math.pow(level - 1, 2));
};

/** Derive level from total XP */
export const levelFromXP = (xp: number): number => {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
};

/** Progress fraction (0–1) towards next level */
export const xpProgress = (xp: number): number => {
  const level = levelFromXP(xp);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const range = nextLevelXP - currentLevelXP;
  if (range <= 0) return 1;
  return (xp - currentLevelXP) / range;
};

/** XP remaining to next level */
export const xpToNextLevel = (xp: number): number => {
  const level = levelFromXP(xp);
  return xpForLevel(level + 1) - xp;
};

// XP rewards
export const XP_REWARDS = {
  kill: 25,
  assist: 10,
  win: 100,
  matchComplete: 15,
  lootPickup: 2,
  headshot: 40,
} as const;

/** Level title based on level range */
export const getLevelTitle = (level: number): string => {
  if (level >= 50) return 'أسطوري';    // Legendary
  if (level >= 40) return 'جنرال';     // General
  if (level >= 30) return 'عقيد';      // Colonel
  if (level >= 20) return 'نقيب';      // Captain
  if (level >= 15) return 'ملازم';     // Lieutenant
  if (level >= 10) return 'رقيب';      // Sergeant
  if (level >= 5) return 'جندي أول';   // Private First Class
  return 'مجند';                       // Recruit
};
