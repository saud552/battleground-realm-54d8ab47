// ============================================
// ملف: src/App.tsx
// الوظيفة: المكون الرئيسي للتطبيق - إدارة المزودات والمسارات ومعالجة الروابط العميقة
// ============================================

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SquadProvider, useSquad } from './context/SquadContext';
import { getStartParam } from './lib/telegram';
import SplashScreen from './components/SplashScreen';
import CharacterSelect from './components/CharacterSelect';
import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import GameArena from './components/GameArena';
import Store from './pages/Store';
import Squad from './pages/Squad';
import Profile from './pages/Profile';
import Wiki from './components/wiki';
import BottomNav from './components/BottomNav';

// مكون داخلي للتعامل مع التوجيه بناءً على حالة المستخدم والروابط العميقة
function AppRoutes() {
  const { user, isLoading } = useAuth();
  const { joinSquad } = useSquad();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isLoading) return; // انتظار تحميل المستخدم

    // التحقق من وجود start_param (رابط عميق)
    const startParam = getStartParam();
    
    if (startParam) {
      // محاولة الانضمام إلى السكواد تلقائياً
      joinSquad(startParam).then(success => {
        if (success) {
          navigate('/lobby');
        } else {
          // إذا فشل، نذهب إلى الصفحة الرئيسية
          navigate('/');
        }
        setInitialized(true);
      });
    } else {
      setInitialized(true);
    }
  }, [isLoading, joinSquad, navigate]);

  if (isLoading || !initialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-kilegram-blue animate-pulse">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/lobby" element={<LobbyScreen />} />
      <Route path="/arena" element={<GameArena />} />
      <Route path="/store" element={<Store />} />
      <Route path="/squad" element={<Squad />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/wiki" element={<Wiki />} />
    </Routes>
  );
}

// المكون الرئيسي
function AppContent() {
  const { user, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);

  useEffect(() => {
    // بعد انتهاء شاشة البداية
    if (!showSplash && !isLoading) {
      // إذا كان المستخدم جديداً (ليس لديه شخصية مختارة في localStorage؟ نتحقق من وجود selectedSkin)
      // ولكننا نخزن الشخصية في localStorage ضمن user object، لذلك نعتمد على user
      // إذا كان user موجوداً ولكن لم يختر شخصية بعد؟ في الواقع المستخدم الجديد لديه selectedSkin = 'soldier' افتراضياً.
      // لجعل شاشة اختيار الشخصية تظهر مرة واحدة فقط، يمكننا استخدام متغير منفصل في localStorage
      const hasSeenCharacterSelect = localStorage.getItem('kilegram_has_seen_character_select');
      if (!hasSeenCharacterSelect && user) {
        setShowCharacterSelect(true);
        localStorage.setItem('kilegram_has_seen_character_select', 'true');
      }
    }
  }, [showSplash, isLoading, user]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (showCharacterSelect) {
    return <CharacterSelect />;
  }

  return (
    <>
      <AppRoutes />
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <SquadProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SquadProvider>
    </AuthProvider>
  );
}

export default App;