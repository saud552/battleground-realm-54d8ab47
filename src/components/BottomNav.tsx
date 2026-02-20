import { Home, Store, Users, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/', icon: Home, label: 'الرئيسية' },
  { to: '/store', icon: Store, label: 'المتجر' },
  { to: '/squad', icon: Users, label: 'الفريق' },
  { to: '/profile', icon: User, label: 'الملف' },
]

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border py-2 px-4 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] transition-colors relative ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-2 w-8 h-0.5 rounded-full gradient-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
