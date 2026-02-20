import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSquad } from '../context/SquadContext'
import { useAuth } from '../context/AuthContext'
import { Users, Copy, Crown, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const Squad = () => {
  const { currentSquad } = useSquad()
  const { user } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (currentSquad) {
      navigate('/lobby')
    }
  }, [currentSquad, navigate])

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-20">
      <h1 className="text-xl font-bold text-gradient-primary mb-4">الفريق</h1>

      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
          <Users size={28} className="text-muted-foreground" />
        </div>
        <h2 className="text-foreground font-semibold mb-1">لست في فريق حالياً</h2>
        <p className="text-sm text-muted-foreground mb-4">
          اذهب إلى الشاشة الرئيسية لإنشاء فريق أو الانضمام بكود
        </p>
        <button
          onClick={() => navigate('/')}
          className="gradient-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold"
        >
          العودة للرئيسية
        </button>
      </motion.div>

      {/* Squad Info Placeholder */}
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">نصائح</h3>
        <div className="bg-card rounded-lg p-3 border border-border flex items-start gap-3">
          <Crown size={16} className="text-gold mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">قائد الفريق فقط يمكنه بدء المعركة</p>
        </div>
        <div className="bg-card rounded-lg p-3 border border-border flex items-start gap-3">
          <Shield size={16} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">الحد الأقصى 4 لاعبين في الفريق الواحد</p>
        </div>
        <div className="bg-card rounded-lg p-3 border border-border flex items-start gap-3">
          <Copy size={16} className="text-neon-green mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">شارك كود فريقك مع أصدقائك للانضمام</p>
        </div>
      </div>
    </div>
  )
}

export default Squad
