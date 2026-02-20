import React from 'react'
import { useAuth, AVAILABLE_SKINS } from '../context/AuthContext'
import { Coins, Gem, Skull, Trophy, Gamepad2, Target } from 'lucide-react'
import XPProgressBar from '@/components/XPProgressBar'
import { motion } from 'framer-motion'

const Profile = () => {
  const { user } = useAuth()

  if (!user) return null

  const selectedSkin = AVAILABLE_SKINS.find(s => s.id === user.selectedSkin)
  const kd = user.totalMatches > 0 ? (user.totalKills / user.totalMatches).toFixed(1) : '0.0'

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-20">
      <h1 className="text-xl font-bold text-gradient-primary mb-4">الملف الشخصي</h1>

      {/* Player Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl p-4 border border-border mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {user.firstName?.[0] || '👤'}
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-foreground">{user.username}</p>
            <p className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}</p>
            <p className="text-xs text-muted-foreground">{user.country}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded text-xs">
              <Coins size={10} className="text-gold" />
              <span className="font-bold text-foreground">{user.coins}</span>
            </div>
            <div className="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded text-xs">
              <Gem size={10} className="text-primary" />
              <span className="font-bold text-foreground">{user.gems}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* XP & Level */}
      <div className="mb-4">
        <XPProgressBar xp={user.xp} level={user.level} />
      </div>

      {/* Selected Character */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">الشخصية المختارة</h2>
        <div className="flex items-center gap-3">
          <div className="text-4xl">{selectedSkin?.imageUrl}</div>
          <div>
            <p className="font-bold text-foreground">{selectedSkin?.name}</p>
            <p className="text-xs text-muted-foreground">
              {selectedSkin?.price === 0 ? 'مجانية' : 'مدفوعة'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">الإحصائيات</h2>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <Skull className="w-5 h-5 mx-auto text-accent mb-1" />
            <div className="text-base font-bold text-foreground">{user.totalKills}</div>
            <div className="text-[9px] text-muted-foreground">قتلى</div>
          </div>
          <div className="text-center">
            <Trophy className="w-5 h-5 mx-auto text-gold mb-1" />
            <div className="text-base font-bold text-foreground">{user.totalWins}</div>
            <div className="text-[9px] text-muted-foreground">فوز</div>
          </div>
          <div className="text-center">
            <Gamepad2 className="w-5 h-5 mx-auto text-primary mb-1" />
            <div className="text-base font-bold text-foreground">{user.totalMatches}</div>
            <div className="text-[9px] text-muted-foreground">مباريات</div>
          </div>
          <div className="text-center">
            <Target className="w-5 h-5 mx-auto text-neon-green mb-1" />
            <div className="text-base font-bold text-foreground">{kd}</div>
            <div className="text-[9px] text-muted-foreground">K/D</div>
          </div>
        </div>
      </div>

      {/* Owned Skins */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">الشخصيات المملوكة</h2>
        <div className="grid grid-cols-4 gap-2">
          {user.ownedSkins.map(skinId => {
            const skin = AVAILABLE_SKINS.find(s => s.id === skinId)
            const isEquipped = user.selectedSkin === skinId
            return (
              <div
                key={skinId}
                className={`bg-secondary rounded-lg p-2 text-center border ${
                  isEquipped ? 'border-primary' : 'border-transparent'
                }`}
              >
                <div className="text-2xl">{skin?.imageUrl}</div>
                <p className="text-[9px] text-muted-foreground truncate mt-1">{skin?.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Profile
