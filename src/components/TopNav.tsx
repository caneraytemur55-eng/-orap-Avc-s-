import React from 'react';
import { SubscriptionState, GameStats } from '../types/game';
import { Crown, Volume2, VolumeX, Award, Settings, User } from 'lucide-react';
import { sound } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface TopNavProps {
  subscription: SubscriptionState;
  stats: GameStats;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSubscription: () => void;
  onOpenDiploma: () => void;
  onOpenAvatars: () => void;
  onOpenSellerSettings: () => void;
  onGoToMenu: () => void;
  onStartGame: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  subscription,
  stats,
  isMuted,
  onToggleMute,
  onOpenSubscription,
  onOpenDiploma,
  onOpenAvatars,
  onOpenSellerSettings,
  onGoToMenu,
  onStartGame,
}) => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <button
          type="button"
          onClick={onGoToMenu}
          className="text-lg sm:text-xl font-bold tracking-tight text-white font-display hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
        >
          <span className="text-2xl">🧦</span>
          <span>Çorap Avcısı</span>
        </button>

        {/* Zone 2: 4-5 Clean single-line nav links with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
          <button
            onClick={onStartGame}
            className="hover:text-white transition-colors hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Oyna
          </button>
          <button
            onClick={onOpenAvatars}
            className="hover:text-white transition-colors hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            Avatarlar
          </button>
          <button
            onClick={onOpenDiploma}
            className="hover:text-white transition-colors hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            GameMaster Diploması
          </button>
          <button
            onClick={onOpenSubscription}
            className="hover:text-white transition-colors hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-amber-300"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            ikas VIP Abonelik
          </button>
          <button
            onClick={onOpenSellerSettings}
            className="text-slate-400 hover:text-slate-200 transition-colors hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5" />
            Satıcı Ayarları
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Utility Toggles */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* PWA Install Button */}
          <PWAInstallButton variant="nav" />

          {/* Mute button */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Primary Action Button */}
          {subscription.isVip ? (
            <button
              onClick={onOpenSubscription}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/50 rounded-xl hover:bg-amber-900/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>VIP Üye</span>
            </button>
          ) : (
            <button
              onClick={onOpenSubscription}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-md whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>VIP'e Geç (49 ₺)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
