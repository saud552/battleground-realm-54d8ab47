import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface JoinModalProps {
  isOpen: boolean
  onClose: () => void
  onJoin: (code: string) => Promise<boolean>
}

const JoinModal = ({ isOpen, onClose, onJoin }: JoinModalProps) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const success = await onJoin(code.toUpperCase())
    setLoading(false)
    if (success) {
      onClose()
      setCode('')
    } else {
      setError('الكود غير صحيح أو الفريق ممتلئ')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="bg-card border border-border rounded-xl p-5 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground">الانضمام لفريق</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="أدخل كود الفريق (6 أحرف)"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary text-center text-lg tracking-widest mb-3"
                maxLength={6}
                autoFocus
              />
              {error && <p className="text-accent text-xs mb-3 text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full gradient-primary text-primary-foreground font-semibold py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
              >
                {loading ? 'جارٍ الانضمام...' : 'انضمام'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default JoinModal
