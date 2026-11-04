import React, { useState, useEffect } from 'react';
import { GameScreen, SubscriptionState, GameStats, SubscriptionPlanId } from './types/game';
import { AVATARS } from './data/gameData';
import {
  getSubscription,
  saveSubscription,
  getGameStats,
  saveGameStats,
  getPlayerName,
  savePlayerName,
  getActiveAvatarId,
  saveActiveAvatarId,
} from './utils/storage';
import { sound } from './utils/audio';
import { TopNav } from './components/TopNav';
import { GameBoard } from './components/GameBoard';
import { DiplomaModal } from './components/DiplomaModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AvatarSelector } from './components/AvatarSelector';
import { IkasSellerSettingsModal } from './components/IkasSellerSettingsModal';
import { DownloadGuideModal } from './components/DownloadGuideModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  Play,
  RotateCcw,
  Award,
  Zap,
  Crown,
  Trophy,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  Flame,
  Clock,
  Layers,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // State management
  const [screen, setScreen] = useState<GameScreen>('MENU');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [subscription, setSubscription] = useState<SubscriptionState>(getSubscription());
  const [stats, setStats] = useState<GameStats>(getGameStats());
  const [playerName, setPlayerName] = useState<string>(getPlayerName());
  const [activeAvatarId, setActiveAvatarId] = useState<string>(getActiveAvatarId());
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  // Modal open states
  const [showDiplomaModal, setShowDiplomaModal] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [subscriptionReason, setSubscriptionReason] = useState<'level_gate' | 'user_menu'>('user_menu');
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [showSellerSettingsModal, setShowSellerSettingsModal] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

  // Level Clear & Game Over Data
  const [lastRoundScore, setLastRoundScore] = useState<number>(0);

  // Active avatar object
  const activeAvatar = AVATARS.find((a) => a.id === activeAvatarId) || AVATARS[0];

  // Update persistent stats helper
  const handleUpdateStats = (newPartial: Partial<GameStats>) => {
    setStats((prev) => {
      const merged = { ...prev, ...newPartial };
      saveGameStats(merged);
      return merged;
    });
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // Start Playing
  const handleStartGame = (targetLevel: number = 1) => {
    sound.playSelect();

    // Check if level > 1 and user is not VIP
    if (targetLevel > 1 && !subscription.isVip) {
      setSubscriptionReason('level_gate');
      setShowSubscriptionModal(true);
      return;
    }

    setCurrentLevel(targetLevel);
    setScreen('PLAYING');
  };

  // Level Completed
  const handleLevelComplete = (clearedLevel: number, finalScore: number) => {
    setLastRoundScore(finalScore);

    // If next level is 2+ and user is not VIP, trigger subscription modal
    const nextLevel = clearedLevel + 1;
    if (nextLevel > 1 && !subscription.isVip) {
      setScreen('LEVEL_CLEARED');
      setSubscriptionReason('level_gate');
      setShowSubscriptionModal(true);
    } else {
      setScreen('LEVEL_CLEARED');
    }
  };

  // Proceed to Next Level
  const handleProceedNextLevel = () => {
    sound.playSelect();
    const next = currentLevel + 1;
    if (next > 1 && !subscription.isVip) {
      setSubscriptionReason('level_gate');
      setShowSubscriptionModal(true);
      return;
    }
    setCurrentLevel(next);
    setScreen('PLAYING');
  };

  // Game Over
  const handleGameOver = (finalScore: number) => {
    setLastRoundScore(finalScore);
    setScreen('GAME_OVER');
  };

  // Activate Subscription (via purchase or license code)
  const handleActivateSubscription = (plan: SubscriptionPlanId, code?: string) => {
    const updated: SubscriptionState = {
      isVip: true,
      activePlan: plan,
      licenseKey: code,
      ikasOrderNumber: code?.startsWith('IKAS-') ? code : undefined,
    };
    setSubscription(updated);
    saveSubscription(updated);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  };

  // 1-Click Seller VIP toggle
  const handleToggleVipDemo = () => {
    const updated: SubscriptionState = {
      isVip: !subscription.isVip,
      activePlan: subscription.isVip ? 'free' : 'yearly',
      licenseKey: subscription.isVip ? undefined : 'IKAS-DEMO-2026',
    };
    setSubscription(updated);
    saveSubscription(updated);
  };

  // Save Player Name
  const handleUpdatePlayerName = (name: string) => {
    setPlayerName(name);
    savePlayerName(name);
  };

  // Save Active Avatar
  const handleSelectAvatar = (avatarId: string) => {
    setActiveAvatarId(avatarId);
    saveActiveAvatarId(avatarId);
    setShowAvatarModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-amber-500 selection:text-slate-950">
      {/* Background Graphic Decor */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 bg-cover bg-center mix-blend-luminosity filter blur-[1px]"
        style={{
          backgroundImage: `url('/src/assets/images/sock_game_hero_banner_1793800748006.jpg')`,
        }}
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />

      {/* Strict 3-Zone Top Navigation */}
      <TopNav
        subscription={subscription}
        stats={stats}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenSubscription={() => {
          sound.playSelect();
          setSubscriptionReason('user_menu');
          setShowSubscriptionModal(true);
        }}
        onOpenDiploma={() => {
          sound.playSelect();
          setShowDiplomaModal(true);
        }}
        onOpenAvatars={() => {
          sound.playSelect();
          setShowAvatarModal(true);
        }}
        onOpenSellerSettings={() => {
          sound.playSelect();
          setShowSellerSettingsModal(true);
        }}
        onGoToMenu={() => {
          sound.playSelect();
          setScreen('MENU');
        }}
        onStartGame={() => handleStartGame(1)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-6xl mx-auto">
        {/* ================= SCREEN: TITLE / MENU ================= */}
        {screen === 'MENU' && (
          <div className="w-full max-w-4xl py-4 sm:py-8 flex flex-col items-center">
            {/* Hero Banner Card */}
            <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md mb-8">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <img
                  src="/src/assets/images/sock_game_hero_banner_1793800748006.jpg"
                  alt="Çorap Avcısı Çamaşır Odası"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Hero Title Lockup */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-xs font-semibold text-amber-300 mb-2 backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hızlanan Seviyeler & Candy Refleks Eşleştirme</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
                      Çorap Avcısı
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
                      Birbirine karışmış beyaz yün ve desenli çorapların eşini bul, ivme kazanan süreye meydan oku ve resmi GameMaster diploması al!
                    </p>
                  </div>

                  {/* Quick Play & PWA Install CTAs */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartGame(1)}
                      className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all text-sm sm:text-base active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <Play className="w-5 h-5 fill-slate-950" />
                      <span>Oyunu Başlat (1. Seviye Ücretsiz)</span>
                    </button>
                    <PWAInstallButton variant="hero" />
                  </div>
                </div>
              </div>

              {/* Unboxed Metadata Strip */}
              <div className="px-6 py-3.5 bg-slate-950/70 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span>En Yüksek Skor: <strong className="text-amber-400 tabular-nums">{stats.highScore}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>En Yüksek Seviye: <strong className="text-white tabular-nums">{stats.highestLevel}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Eşleşen Çift: <strong className="text-cyan-400 tabular-nums">{stats.totalMatches}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDiplomaModal(true)}
                    className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Award className="w-3.5 h-3.5" /> GameMaster Diplomasını Görüntüle
                  </button>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-semibold">1. Seviye Ücretsiz</span>
                </div>
              </div>
            </div>

            {/* Quick Level Selector & Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Active Avatar Spotlight Card */}
              <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400">Seçili Avatarın</span>
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="text-xs text-cyan-400 hover:underline cursor-pointer"
                    >
                      Değiştir
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={activeAvatar.avatarUrl}
                      alt={activeAvatar.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400/70"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white">{activeAvatar.name}</h3>
                      <p className="text-xs text-amber-400/90">{activeAvatar.title}</p>
                      <p className="text-[11px] text-slate-400 italic mt-0.5">"{activeAvatar.quotes.idle[0]}"</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Tüm Avatarları Gör ({AVATARS.length})
                </button>
              </div>

              {/* Game Mechanics Card */}
              <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-3">Oyun Kuralları & İvme</span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                      <span><strong>Hızlanan Zaman:</strong> Her seviyede sayaç daha hızlı geriye sayar!</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>Candy Crush Şelalesi:</strong> Eşleşen çoraplar patlar, üstten yenileri düşer.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Zaman Bonusu:</strong> Her çift eşleştiğinde +2.0 sn kazanırsın!</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  Sonsuz seviyeler ile rekor skoru zorla!
                </div>
              </div>

              {/* Commercial ikas License Card */}
              <div className="p-5 bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5" /> ikas Lisans Durumu
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        subscription.isVip
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {subscription.isVip ? '👑 VIP Aktif' : '1. Seviye Ücretsiz'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {subscription.isVip
                      ? 'Sınırsız seviyeler, hız modu ve GameMaster diploması erişiminiz açık.'
                      : 'İlk seviye herkese ücretsizdir. Sonraki seviyeler aylık & yıllık ikas aboneliği ile sunulur.'}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSubscriptionReason('user_menu');
                      setShowSubscriptionModal(true);
                    }}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow cursor-pointer text-center"
                  >
                    {subscription.isVip ? 'Abonelik Detayı' : 'VIP Paketleri İncele'}
                  </button>
                  <button
                    onClick={() => setShowSellerSettingsModal(true)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                    title="Satıcı Yönetim Paneli"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SCREEN: PLAYING ================= */}
        {screen === 'PLAYING' && (
          <GameBoard
            currentLevel={currentLevel}
            activeAvatar={activeAvatar}
            subscription={subscription}
            onLevelComplete={handleLevelComplete}
            onGameOver={handleGameOver}
            onRequestSubscription={() => {
              setSubscriptionReason('level_gate');
              setShowSubscriptionModal(true);
            }}
            onOpenDiploma={() => setShowDiplomaModal(true)}
            stats={stats}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {/* ================= SCREEN: LEVEL CLEARED ================= */}
        {screen === 'LEVEL_CLEARED' && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center backdrop-blur-md animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
              <Trophy className="w-8 h-8" />
            </div>

            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Tebrikler! Seviye Temizlendi
            </span>
            <h2 className="text-3xl font-extrabold text-white font-display mt-1">
              Seviye {currentLevel} Başarılı!
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Çamaşır sepetindeki tüm eşleri hızlanan süreye rağmen ustalıkla buldun!
            </p>

            {/* Next Level Acceleration Warning */}
            <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400">Sonraki Seviye:</span>
                <strong className="text-white">Seviye {currentLevel + 1}</strong>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400">Geri Sayım İvmesi:</span>
                <span className="text-amber-400 font-bold">
                  {(1 + currentLevel * 0.18).toFixed(2)}x Hız (%{Math.round(currentLevel * 18)} Daha Hızlı!)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Toplam Puanın:</span>
                <strong className="text-amber-400 font-display text-sm tabular-nums">
                  {lastRoundScore} Puan
                </strong>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleProceedNextLevel}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Sonraki Seviyeye Geç</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  setShowDiplomaModal(true);
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4 text-amber-400" />
                GameMaster Diplomamı Gör
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN: GAME OVER ================= */}
        {screen === 'GAME_OVER' && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center backdrop-blur-md animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400">
              <Clock className="w-8 h-8" />
            </div>

            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">
              Süre Doldu!
            </span>
            <h2 className="text-3xl font-extrabold text-white font-display mt-1">
              Oyun Sona Erdi
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Hızlanan geriye sayım bu tur kazandı, ama her çorap avcısı yeniden dener!
            </p>

            {/* Score summary */}
            <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bu Tur Skoru:</span>
                <strong className="text-white text-sm font-display tabular-nums">{lastRoundScore}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ulaşılan Seviye:</span>
                <strong className="text-cyan-400 font-bold tabular-nums">Seviye {currentLevel}</strong>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Rekor Skorun:</span>
                <strong className="text-amber-400 text-sm font-display tabular-nums">{stats.highScore}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleStartGame(1)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tekrar Oyna</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDiplomaModal(true)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4 text-amber-400" />
                Diplomamı İncele & Paylaş
              </button>

              <button
                type="button"
                onClick={() => setScreen('MENU')}
                className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Ana Menüye Dön
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-sm py-4 px-6 text-center text-xs text-slate-500 relative z-20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Çorap Avcısı · ikas Dijital E-Ticaret ve Oyun Aboneliği</span>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setShowDownloadModal(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Bilgisayara İndir (Rehber)
            </button>
            <span>·</span>
            <button
              onClick={() => setShowSellerSettingsModal(true)}
              className="hover:text-amber-400 cursor-pointer"
            >
              Satıcı Ayarları
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setSubscriptionReason('user_menu');
                setShowSubscriptionModal(true);
              }}
              className="hover:text-amber-400 cursor-pointer"
            >
              Lisans Doğrulama
            </button>
            <span>·</span>
            <button
              onClick={() => setShowDiplomaModal(true)}
              className="hover:text-amber-400 cursor-pointer"
            >
              GameMaster Diploması
            </button>
          </div>
        </div>
      </footer>

      {/* ================= MODALS ================= */}

      {/* 0. Bilgisayara İndir & Kurulum Rehberi */}
      {showDownloadModal && (
        <DownloadGuideModal onClose={() => setShowDownloadModal(false)} />
      )}

      {/* 1. GameMaster Diploma Modal */}
      {showDiplomaModal && (
        <DiplomaModal
          stats={stats}
          playerName={playerName}
          onUpdatePlayerName={handleUpdatePlayerName}
          activeAvatar={activeAvatar}
          onClose={() => setShowDiplomaModal(false)}
        />
      )}

      {/* 2. Commercial ikas Subscription Modal */}
      {showSubscriptionModal && (
        <SubscriptionModal
          subscription={subscription}
          onActivateSubscription={handleActivateSubscription}
          onClose={() => setShowSubscriptionModal(false)}
          reason={subscriptionReason}
        />
      )}

      {/* 3. Avatar Selector Modal */}
      {showAvatarModal && (
        <AvatarSelector
          activeAvatarId={activeAvatarId}
          onSelectAvatar={handleSelectAvatar}
          subscription={subscription}
          highestLevelReached={stats.highestLevel}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {/* 4. ikas Seller & Demo Settings Modal */}
      {showSellerSettingsModal && (
        <IkasSellerSettingsModal
          subscription={subscription}
          onToggleVipDemo={handleToggleVipDemo}
          onClose={() => setShowSellerSettingsModal(false)}
        />
      )}

      {/* PWA Offline Network Banner */}
      <OfflineIndicator />
    </div>
  );
}
