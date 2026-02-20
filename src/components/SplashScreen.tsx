import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onFinish: () => void
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onFinish, 300)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)
    return () => clearInterval(interval)
  }, [onFinish])

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative text-center z-10"
      >
        {/* Logo */}
        <h1 className="text-6xl font-black tracking-tighter text-gradient-primary">
          KILEGRAM
        </h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mt-3 text-xs tracking-[0.3em] uppercase"
        >
          Enter The Battlefield
        </motion.p>

        {/* Loading bar */}
        <div className="mt-8 w-48 mx-auto">
          <div className="bg-muted rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            {progress < 100 ? 'جارٍ التحميل...' : 'جاهز!'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default SplashScreen
