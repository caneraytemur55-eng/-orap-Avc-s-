import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Ağ durumu bildirimi"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900/95 border border-amber-500/40 px-3 py-2 text-xs font-medium text-amber-200 shadow-2xl backdrop-blur-md animate-fade-in"
    >
      <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>Çevrimdışı Mod: Oyun internetsiz oynanabilir.</span>
    </aside>
  );
};
