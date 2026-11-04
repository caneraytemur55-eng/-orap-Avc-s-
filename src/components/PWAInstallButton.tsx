import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, MonitorCheck, Smartphone, X, Sparkles, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'hero' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running in standalone PWA window, show small installed badge or nothing
  if (isInstalled) {
    if (variant === 'hero') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-400">
          <MonitorCheck className="w-4 h-4" />
          <span>Bilgisayara Kurulu (PWA Aktif)</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    sound.playSelect();
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstallSuccess(true);
        sound.playLevelUp();
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else {
      setShowGuide(true);
    }
  };

  const renderButtonContent = () => {
    if (installSuccess) {
      return (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Kurulum Başarılı!</span>
        </>
      );
    }

    if (variant === 'hero') {
      return (
        <>
          <Download className="w-5 h-5 text-slate-950" />
          <span>Bilgisayara / Telefona İndir (PWA)</span>
        </>
      );
    }

    return (
      <>
        <Download className="w-3.5 h-3.5 text-cyan-400" />
        <span className="truncate">Uygulamayı İndir</span>
      </>
    );
  };

  const buttonClasses =
    variant === 'hero'
      ? 'flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold rounded-2xl shadow-xl transition-all text-sm active:scale-95 cursor-pointer whitespace-nowrap'
      : 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700/80 rounded-xl hover:bg-slate-800 hover:border-slate-600 transition-colors cursor-pointer whitespace-nowrap shrink-0';

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={buttonClasses}
        title="Uygulamayı bilgisayarınıza veya telefonunuza uygulama olarak kurun"
      >
        {renderButtonContent()}
      </button>

      {/* Guided Install Modal for browsers without direct prompt or iOS */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {isIOS ? 'iPhone / iPad Kurulumu' : 'Bilgisayara / Telefona Kurulum'}
                </h3>
                <p className="text-xs text-slate-400">Tek tıkla masaüstü uygulaması yapın</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-300">
                <p>Safari tarayıcısında oynamak için:</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-cyan-400">1.</span>
                    <span>Safari'nin altındaki <strong>Paylaş</strong> (kare ve yukarı ok) ikonuna dokunun.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-cyan-400">2.</span>
                    <span>Aşağı kaydırıp <strong>"Ana Ekrana Ekle"</strong> seçeneğini seçin.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-cyan-400">3.</span>
                    <span>Sağ üstteki <strong>"Ekle"</strong>ye dokunun. Artık internetsiz de açılacaktır!</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-300">
                <p>Google Chrome, Microsoft Edge veya Brave kullanıyorsanız:</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-400">1.</span>
                    <span>Adres çubuğunun en sağındaki <strong>"Uygulamayı Yükle"</strong> (monitör veya aşağı ok) simgesine tıklayın.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-400">2.</span>
                    <span>Açılan pencerede <strong>"Yükle"</strong> butonuna basın.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-400">3.</span>
                    <span>Oyun masaüstünüze bir uygulama simgesi olarak eklenir ve internetsiz oynanabilir.</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </>
  );
};
