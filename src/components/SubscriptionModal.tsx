import React, { useState } from 'react';
import { SubscriptionState, SubscriptionPlanId } from '../types/game';
import { validateLicenseKey, getIkasConfig, IkasStoreConfig } from '../utils/storage';
import { Check, ShieldCheck, Zap, Award, Sparkles, ExternalLink, Key, CreditCard, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface SubscriptionModalProps {
  subscription: SubscriptionState;
  onActivateSubscription: (plan: SubscriptionPlanId, code?: string) => void;
  onClose: () => void;
  reason?: 'level_gate' | 'user_menu';
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  subscription,
  onActivateSubscription,
  onClose,
  reason = 'level_gate',
}) => {
  const [ikasConfig] = useState<IkasStoreConfig>(getIkasConfig());
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>('yearly');
  const [licenseCode, setLicenseCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [isSimulatingCheckout, setIsSimulatingCheckout] = useState(false);

  // Validate license code or ikas order number
  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSelect();

    const res = validateLicenseKey(licenseCode);
    if (res.valid) {
      setCodeStatus({ type: 'success', message: res.message });
      sound.playLevelUp();
      setTimeout(() => {
        onActivateSubscription(res.plan, licenseCode.trim().toUpperCase());
        onClose();
      }, 1000);
    } else {
      setCodeStatus({ type: 'error', message: res.message });
      sound.playMismatch();
    }
  };

  // Simulated instant checkout flow (demonstrates ikas integration in practice)
  const handleSimulateCheckout = () => {
    sound.playSelect();
    setIsSimulatingCheckout(true);

    setTimeout(() => {
      setIsSimulatingCheckout(false);
      sound.playLevelUp();
      const mockOrderNo = `IKAS-${Math.floor(100000 + Math.random() * 900000)}`;
      onActivateSubscription(selectedPlan, mockOrderNo);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ikas E-Ticaret Lisanslı Ürün</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {reason === 'level_gate'
              ? 'Tebrikler! 1. Seviyeyi Ücretsiz Tamamladınız'
              : 'Çorap Avcısı VIP & GameMaster Aboneliği'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {reason === 'level_gate'
              ? '2. Seviye ve hızlanan sonsuz seviyelere devam etmek, GameMaster diploması almak için abonelik paketinizi seçin.'
              : 'Tüm seviyeler, hız çarpanları, özel altın çorap ve resmi GameMaster diploması kilidini açın.'}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === 'monthly'
                ? 'bg-slate-800/90 border-amber-500 ring-2 ring-amber-500/50 shadow-lg'
                : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
            }`}
          >
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aylık Plan</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold font-display text-white tabular-nums">
                  {ikasConfig.monthlyPrice} ₺
                </span>
                <span className="text-xs text-slate-400">/ ay</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Kısa süreli oyun ve pratik için ideal başlangıç.</p>

              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Sınırsız Seviye Erişimi
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Hızlanan İvme Modu
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> GameMaster Diploması
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-700/50">
              <span className="text-xs font-medium text-amber-400">Aylık Yenilenir · İptal Kolay</span>
            </div>
          </div>

          {/* Yearly Plan (Featured) */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === 'yearly'
                ? 'bg-slate-800/95 border-amber-400 ring-2 ring-amber-400/80 shadow-xl'
                : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
            }`}
          >
            {/* Best Value Badge */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[11px] font-extrabold rounded-full shadow">
              EN ÇOK TERCİH EDİLEN · %35 TASARRUF
            </span>

            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Yıllık Plan</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-display text-white tabular-nums">
                  {ikasConfig.yearlyPrice} ₺
                </span>
                <span className="text-xs text-slate-400">/ yıl</span>
              </div>
              <p className="text-xs text-slate-300 mt-2">Ayda sadece {(ikasConfig.yearlyPrice / 12).toFixed(1)} ₺!</p>

              <ul className="mt-4 space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Sınırsız Seviye & Hızlanma
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Özel Altın Çorap Desteği
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Altın Mühürlü GameMaster Diploması
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Tüm Avatarlar Açık
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-700/50">
              <span className="text-xs font-bold text-emerald-400">Yıllık 189 ₺ Tasarruf</span>
            </div>
          </div>

          {/* Lifetime / GameMaster VIP */}
          <div
            onClick={() => setSelectedPlan('lifetime')}
            className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === 'lifetime'
                ? 'bg-slate-800/90 border-amber-500 ring-2 ring-amber-500/50 shadow-lg'
                : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
            }`}
          >
            <div>
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Ömür Boyu VIP</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold font-display text-white tabular-nums">
                  {ikasConfig.lifetimePrice} ₺
                </span>
                <span className="text-xs text-slate-400">tek seferlik</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Abonelik derdi yok. Bir kez ödeyin, sonsuza kadar oynayın.</p>

              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Ömür Boyu Sınırsız VIP Lisans
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> VIP GameMaster Statüsü
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Öncelikli Güncellemeler
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-700/50">
              <span className="text-xs font-medium text-purple-400">Tek Seferlik Ödeme</span>
            </div>
          </div>
        </div>

        {/* Action Zone: ikas Checkout or License Activation */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left: Instant Buy / Checkout button */}
            <div>
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Seçilen Plan: {selectedPlan === 'monthly' ? 'Aylık' : selectedPlan === 'yearly' ? 'Yıllık' : 'Ömür Boyu'}
              </span>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleSimulateCheckout}
                  disabled={isSimulatingCheckout}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  {isSimulatingCheckout ? 'Ödeme Onaylanıyor...' : 'Hemen Satın Al & VIP Başlat'}
                </button>

                <a
                  href={ikasConfig.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
                  title="ikas e-ticaret mağaza sayfasını aç"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  ikas Mağazasında İncele
                </a>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                256-bit SSL ve ikas Güvenli Ödeme Altyapısı ile Korunmaktadır.
              </p>
            </div>

            {/* Right: Have an ikas Order Number or License Key? */}
            <div className="border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <Key className="w-4 h-4 text-cyan-400" />
                ikas'tan Satın Aldınız mı? Kodunuzu Girin:
              </span>
              <p className="text-[11px] text-slate-500 mb-2">
                Sipariş onay e-postanızdaki Sipariş No (örn: <code className="text-slate-400">IKAS-12345</code>) veya VIP Lisans Kodu (örn: <code className="text-slate-400">IKAS2025</code>)
              </p>

              <form onSubmit={handleValidateCode} className="flex gap-2">
                <input
                  type="text"
                  value={licenseCode}
                  onChange={(e) => setLicenseCode(e.target.value)}
                  placeholder="Örn: IKAS2025 veya IKAS-98241"
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0"
                >
                  Aktifleştir
                </button>
              </form>

              {codeStatus.message && (
                <p
                  className={`text-xs mt-2 font-medium ${
                    codeStatus.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {codeStatus.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Free Tier Level 1 Reminder */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Şimdilik 1. Seviyeyi Tekrar Oyna
          </button>
        </div>
      </div>
    </div>
  );
};
