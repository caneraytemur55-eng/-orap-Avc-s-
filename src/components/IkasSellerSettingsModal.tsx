import React, { useState } from 'react';
import { IkasStoreConfig, getIkasConfig, saveIkasConfig } from '../utils/storage';
import { SubscriptionState } from '../types/game';
import { ShoppingBag, Check, Copy, Sliders, Sparkles, X, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';

interface IkasSellerSettingsModalProps {
  subscription: SubscriptionState;
  onToggleVipDemo: () => void;
  onClose: () => void;
}

export const IkasSellerSettingsModal: React.FC<IkasSellerSettingsModalProps> = ({
  subscription,
  onToggleVipDemo,
  onClose,
}) => {
  const [config, setConfig] = useState<IkasStoreConfig>(getIkasConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const sampleCodes = [
    { label: 'Geliştirici / VIP Tam Kod', code: 'IKAS2025' },
    { label: 'Örnek ikas Sipariş No #1', code: 'IKAS-98421' },
    { label: 'Örnek ikas Sipariş No #2', code: 'IKAS-55001' },
    { label: 'Ömür Boyu GameMaster Kodu', code: 'GAMEMASTER' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSelect();
    saveIkasConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const copyToClipboard = async (code: string) => {
    sound.playSelect();
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl my-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">ikas Satıcı ve Entegrasyon Paneli</h2>
            <p className="text-xs text-slate-400">
              ikas e-ticaret mağazanızda satarken fiyatları ve lisans doğrulamalarını yönetin
            </p>
          </div>
        </div>

        {/* 1-Click VIP Switch for Seller / Buyer Testing */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Mevcut VIP Durumu:</span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold ${
                  subscription.isVip
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {subscription.isVip ? '👑 VIP Aktif (Tüm Seviyeler Açık)' : '🔒 Ücretsiz Mod (1. Seviye Açık)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Satış testleri için tek tıkla VIP modunu açıp kapatabilirsiniz.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playSelect();
              onToggleVipDemo();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              subscription.isVip
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {subscription.isVip ? 'VIP Kapat (Test Et)' : 'VIP Aç (Sınırsız Test)'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Aylık Fiyat (₺)
              </label>
              <input
                type="number"
                value={config.monthlyPrice}
                onChange={(e) => setConfig({ ...config, monthlyPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                min={1}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Yıllık Fiyat (₺)
              </label>
              <input
                type="number"
                value={config.yearlyPrice}
                onChange={(e) => setConfig({ ...config, yearlyPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                min={1}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ömür Boyu VIP (₺)
              </label>
              <input
                type="number"
                value={config.lifetimePrice}
                onChange={(e) => setConfig({ ...config, lifetimePrice: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                min={1}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ikas Ürün / Mağaza URL Bağlantısı
            </label>
            <input
              type="url"
              value={config.storeUrl}
              onChange={(e) => setConfig({ ...config, storeUrl: e.target.value })}
              placeholder="https://magazaniz.ikas.com/urun/corap-avcisi"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Değişiklikler anında abonelik pencerelerine yansır.
            </span>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Sliders className="w-4 h-4" />}
              {savedSuccess ? 'Kaydedildi!' : 'Ayarları Kaydet'}
            </button>
          </div>
        </form>

        {/* Sample Codes for ikas Customers */}
        <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Müşterilerinize Gönderebileceğiniz Hazır Lisans & Sipariş Kodları:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleCodes.map((item) => (
              <div
                key={item.code}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
              >
                <div>
                  <span className="text-[11px] text-slate-400 block">{item.label}</span>
                  <code className="text-amber-300 font-mono font-bold">{item.code}</code>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(item.code)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Kodu Kopyala"
                >
                  {copiedCode === item.code ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ikas Integration Tip */}
        <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            ikas mağazanızda dijital ürün oluşturup sipariş onay şablonunuza "Sipariş numaranız ile oyuna giriş yapabilirsiniz" notunu ekleyerek otomatik teslimat sağlayabilirsiniz.
          </span>
        </div>
      </div>
    </div>
  );
};
