import React from 'react';
import { AvatarProfile, SubscriptionState } from '../types/game';
import { AVATARS } from '../data/gameData';
import { Check, Lock, Sparkles, X, Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface AvatarSelectorProps {
  activeAvatarId: string;
  onSelectAvatar: (avatarId: string) => void;
  subscription: SubscriptionState;
  highestLevelReached: number;
  onClose: () => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  activeAvatarId,
  onSelectAvatar,
  subscription,
  highestLevelReached,
  onClose,
}) => {
  const isUnlocked = (avatar: AvatarProfile) => {
    if (subscription.isVip) return true; // VIP unlocks all avatars!
    return highestLevelReached >= avatar.unlockLevel;
  };

  const handleSelect = (avatar: AvatarProfile) => {
    if (!isUnlocked(avatar)) {
      sound.playMismatch();
      return;
    }
    sound.playSelect();
    onSelectAvatar(avatar.id);
  };

  const playPreviewVoice = (avatar: AvatarProfile) => {
    sound.playMatch();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center max-w-md mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs font-semibold text-cyan-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Karakterini Seç</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Çorap Avcısı Avatarları</h2>
          <p className="text-xs text-slate-400 mt-1">
            Her avatar eşleşmelerde farklı tepkiler verir ve sana eş bulmanda tezahürat yapar!
          </p>
        </div>

        {/* Avatars List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AVATARS.map((avatar) => {
            const unlocked = isUnlocked(avatar);
            const isSelected = activeAvatarId === avatar.id;

            return (
              <div
                key={avatar.id}
                onClick={() => handleSelect(avatar)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                    : unlocked
                    ? 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/70'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                {/* Avatar Image */}
                <div className="relative shrink-0">
                  <img
                    src={avatar.avatarUrl}
                    alt={avatar.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  {!unlocked && (
                    <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center">
                      <Lock className="w-5 h-5 text-amber-400" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-bold shadow">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white truncate">{avatar.name}</h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPreviewVoice(avatar);
                      }}
                      className="p-1 text-slate-400 hover:text-cyan-400"
                      title="Ses tonu önizle"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-amber-400/90 font-medium">{avatar.title}</p>
                  <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-1">
                    "{avatar.quotes.match[0]}"
                  </p>

                  {!unlocked && (
                    <span className="inline-block mt-1 text-[10px] text-amber-400 font-semibold">
                      🔒 Seviye {avatar.unlockLevel} veya VIP ile Açılır
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{subscription.isVip ? '👑 VIP Üyesiniz: Tüm Avatarlar Açık' : 'Seviye atladıkça yeni avatarlar açılır'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium cursor-pointer transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
