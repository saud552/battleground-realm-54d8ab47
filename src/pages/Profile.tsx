// ============================================
// ملف: src/pages/Profile.tsx
// الوظيفة: صفحة الملف الشخصي مع عرض الشخصية المختارة والإحصائيات
// ============================================

import React from 'react'
import { useAuth, AVAILABLE_SKINS } from '../context/AuthContext'
import { Coins, Skull, Trophy } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()

  if (!user) return null

  const selectedSkin = AVAILABLE_SKINS.find(s => s.id === user.selectedSkin)

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 pb-20">
      <h1 className="text-2xl font-bold text-kilegram-blue mb-6">الملف الشخصي</h1>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-kilegram-blue to-kill-red flex items-center justify-center text-4xl">
            {user.photoUrl || '👤'}
          </div>
          <div>
            <p className="text-xl font-semibold">{user.username}</p>
            <p className="text-gray-400">ID: {user.id}</p>
            <p className="text-gray-400">البلد: {user.country} اليمن</p>
          </div>
        </div>
      </div>

      {/* الشخصية المختارة */}
      <div className="bg-slate-900 rounded-xl p-4 border border-white/10 mb-6">
        <h2 className="text-lg font-semibold mb-3">الشخصية المختارة</h2>
        <div className="flex items-center gap-4">
          <div className="text-6xl">{selectedSkin?.imageUrl}</div>
          <div>
            <p className="font-bold text-xl">{selectedSkin?.name}</p>
            <p className="text-gray-400">
              {selectedSkin?.price === 0 ? 'مجانية' : 'مدفوعة'}
            </p>
          </div>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="bg-slate-900 rounded-xl p-4 border border-white/10">
        <h2 className="text-lg font-semibold mb-3">الإحصائيات</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Skull className="w-8 h-8 mx-auto text-kill-red mb-2" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-gray-400">قتلى</div>
          </div>
          <div className="text-center">
            <Trophy className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-gray-400">فوز</div>
          </div>
          <div className="text-center">
            <Coins className="w-8 h-8 mx-auto text-kilegram-blue mb-2" />
            <div className="text-2xl font-bold">{user.coins}</div>
            <div className="text-xs text-gray-400">عملات</div>
          </div>
        </div>
      </div>

      {/* قائمة الشخصيات المملوكة */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">الشخصيات المملوكة</h2>
        <div className="grid grid-cols-4 gap-2">
          {user.ownedSkins.map(skinId => {
            const skin = AVAILABLE_SKINS.find(s => s.id === skinId)
            return (
              <div key={skinId} className="bg-slate-800 rounded-lg p-2 text-center">
                <div className="text-3xl">{skin?.imageUrl}</div>
                <p className="text-xs truncate">{skin?.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Profile