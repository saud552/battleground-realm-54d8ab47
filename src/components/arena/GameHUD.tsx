import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { WEAPONS } from '@/lib/weapons';
import { WeaponSystem } from '@/lib/WeaponSystem';

const WEAPON_LIST = Object.values(WEAPONS);

interface GameHUDProps {
  kills: number;
  localHealth: number;
  armor: number;
  isDead: boolean;
  weaponDisplay: ReturnType<WeaponSystem['getDisplayState']>;
  weaponSystem: WeaponSystem;
  showWeaponSelector: boolean;
  setShowWeaponSelector: (v: boolean) => void;
  onSwitchWeapon: (id: string) => void;
  onReload: () => void;
  onBack: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({
  kills, localHealth, armor, isDead, weaponDisplay, weaponSystem: ws,
  showWeaponSelector, setShowWeaponSelector, onSwitchWeapon, onReload, onBack,
}) => {
  return (
    <>
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 bg-card/80 p-2 rounded-full border border-border text-foreground"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Kills */}
      <div className="absolute top-4 right-4 z-20 bg-card/80 px-3 py-1.5 rounded-lg border border-border text-foreground text-sm font-mono">
        💀 {kills}
      </div>

      {/* Health & Armor */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 w-48">
        <div className="bg-card/80 rounded-lg p-2 border border-border">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs">❤️</span>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div className="bg-neon-green h-2 rounded-full transition-all" style={{ width: `${localHealth}%` }} />
            </div>
            <span className="text-xs text-foreground font-mono">{Math.round(localHealth)}</span>
          </div>
          {armor > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs">🛡️</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-kilegram-blue h-2 rounded-full transition-all" style={{ width: `${armor}%` }} />
              </div>
              <span className="text-xs text-foreground font-mono">{Math.round(armor)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Weapon info */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-card/90 rounded-xl px-4 py-2 border border-primary/20 text-center">
          <button
            onClick={() => setShowWeaponSelector(!showWeaponSelector)}
            className="text-xs text-primary font-bold mb-1 flex items-center gap-1 mx-auto"
          >
            {weaponDisplay.name}
            <span className="text-muted-foreground text-[10px]">Lv.{weaponDisplay.skinLevel}</span>
            <span className="text-[10px]">▲</span>
          </button>
          <div className="flex items-center gap-2">
            {weaponDisplay.isReloading ? (
              <div className="w-24">
                <div className="bg-muted rounded-full h-2">
                  <div className="bg-gold h-2 rounded-full transition-all" style={{ width: `${weaponDisplay.reloadProgress * 100}%` }} />
                </div>
                <div className="text-xs text-gold mt-0.5">إعادة تذخير...</div>
              </div>
            ) : (
              <span className="text-foreground font-mono text-lg">
                {weaponDisplay.ammoInMag} <span className="text-muted-foreground text-sm">/ {weaponDisplay.reserveAmmo}</span>
              </span>
            )}
          </div>
        </div>

        {showWeaponSelector && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card/95 border border-border rounded-xl p-2 min-w-[200px] backdrop-blur-sm">
            {WEAPON_LIST.map(w => {
              const hasAmmo = ws.state.reserveAmmo[w.ammoType] > 0 || w.id === ws.weapon.id;
              return (
                <button
                  key={w.id}
                  onClick={() => onSwitchWeapon(w.id)}
                  disabled={!hasAmmo}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition ${
                    w.id === weaponDisplay.weaponId
                      ? 'bg-primary/20 text-primary'
                      : hasAmmo
                        ? 'text-foreground hover:bg-muted'
                        : 'text-muted-foreground opacity-50'
                  }`}
                >
                  <span>{w.emoji} {w.nameAr}</span>
                  <span className="text-xs text-muted-foreground">
                    {w.id === weaponDisplay.weaponId ? `${ws.state.ammoInMag}/${ws.state.reserveAmmo[w.ammoType]}` : ws.state.reserveAmmo[w.ammoType]}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Reload button */}
      {!weaponDisplay.isReloading && weaponDisplay.ammoInMag < ws.weapon.magazineSize && (
        <button
          onClick={onReload}
          className="absolute bottom-20 right-4 z-20 bg-gold/20 text-gold px-3 py-2 rounded-lg border border-gold/40 text-sm font-bold"
        >
          🔄 تذخير
        </button>
      )}

      {/* Death overlay */}
      {isDead && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75">
          <div className="text-4xl font-bold text-red-500 drop-shadow-lg" style={{ textShadow: '0 0 20px #ff0000' }}>
            ELIMINATED
          </div>
          <div className="text-white text-lg mt-2 font-mono">💀 {kills} قتلى</div>
        </div>
      )}
    </>
  );
};

export default React.memo(GameHUD);
