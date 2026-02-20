import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSquad } from '../context/SquadContext'
import { motion } from 'framer-motion'
import { Users, QrCode, Skull, Trophy, Coins, Gem, Gamepad2, Newspaper } from 'lucide-react'
import JoinModal from './JoinModal'
import XPProgressBar from './XPProgressBar'

const HomeScreen = () => {
  const { user } = useAuth()
  const { createSquad, joinSquad } = useSquad()
  const navigate = useNavigate()
  const [joinModalOpen, setJoinModalOpen] = useState(false)

  const handleCreateTeam = async () => {
    await createSquad()
    navigate('/lobby')
  }

  const handleJoinViaCode = () => {
    setJoinModalOpen(true)
  }

  const handleJoin = async (code: string) => {
    const success = await joinSquad(code)
    if (success) navigate('/lobby')
    return success
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
            {user?.firstName?.[0] || '👤'}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">{user?.username}</p>
            <p className="text-[10px] text-muted-foreground">{user?.country} Lv.{user?.level ?? 1}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-card px-2 py-1 rounded-md border border-border text-xs">
            <Coins size={12} className="text-gold" />
            <span className="font-bold text-foreground">{user?.coins ?? 0}</span>
          </div>
          <div className="flex items-center gap-1 bg-card px-2 py-1 rounded-md border border-primary/20 text-xs">
            <Gem size={12} className="text-primary" />
            <span className="font-bold text-foreground">{user?.gems ?? 0}</span>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="px-4 pt-3">
        <XPProgressBar xp={user?.xp ?? 0} level={user?.level ?? 1} />
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 flex flex-col items-center">
        {/* BATTLE Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-44 h-44 rounded-full gradient-primary text-4xl font-black uppercase tracking-wider text-primary-foreground border-2 border-foreground/10 shadow-neon flex items-center justify-center gap-2"
        >
          <Gamepad2 size={28} />
          BATTLE
        </motion.button>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-6 w-full max-w-sm">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCreateTeam}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm hover:bg-secondary transition"
          >
            <Users size={16} className="text-primary" />
            إنشاء فريق
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleJoinViaCode}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm hover:bg-secondary transition"
          >
            <QrCode size={16} className="text-accent" />
            انضمام بكود
          </motion.button>
        </div>

        {/* Stats Card */}
        <div className="mt-6 w-full max-w-sm bg-card rounded-xl p-4 border border-border">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">إحصائيات اللاعب</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <Skull className="w-5 h-5 mx-auto text-accent mb-1" />
              <div className="text-lg font-bold text-foreground">{user?.totalKills ?? 0}</div>
              <div className="text-[10px] text-muted-foreground">قتلى</div>
            </div>
            <div className="text-center">
              <Trophy className="w-5 h-5 mx-auto text-gold mb-1" />
              <div className="text-lg font-bold text-foreground">{user?.totalWins ?? 0}</div>
              <div className="text-[10px] text-muted-foreground">فوز</div>
            </div>
            <div className="text-center">
              <Gamepad2 className="w-5 h-5 mx-auto text-primary mb-1" />
              <div className="text-lg font-bold text-foreground">{user?.totalMatches ?? 0}</div>
              <div className="text-[10px] text-muted-foreground">مباريات</div>
            </div>
          </div>
        </div>

        {/* News Section */}
        <div className="mt-4 w-full max-w-sm bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Newspaper size={14} className="text-primary" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">آخر الأخبار</h3>
          </div>
          <p className="text-xs text-muted-foreground">🎮 الموسم الأول قادم قريباً! ترقبوا التحديثات.</p>
        </div>
      </div>

      <JoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoin={handleJoin}
      />
    </div>
  )
}

export default HomeScreen
