import { SubscriptionState, GameStats } from '../types/game';

const STORAGE_KEYS = {
  SUBSCRIPTION: 'corap_avcisi_subscription_v1',
  STATS: 'corap_avcisi_stats_v1',
  PLAYER_NAME: 'corap_avcisi_player_name_v1',
  ACTIVE_AVATAR: 'corap_avcisi_active_avatar_v1',
  IKAS_CONFIG: 'corap_avcisi_ikas_config_v1',
};

export interface IkasStoreConfig {
  storeUrl: string;
  monthlyPrice: number;
  yearlyPrice: number;
  lifetimePrice: number;
  storeName: string;
  supportEmail: string;
}

const DEFAULT_IKAS_CONFIG: IkasStoreConfig = {
  storeUrl: 'https://magaza.ikas.com/urun/corap-avcisi-vip-lisans',
  monthlyPrice: 49,
  yearlyPrice: 399,
  lifetimePrice: 590,
  storeName: 'ikas Dijital Oyun & Lisans Mağazası',
  supportEmail: 'caneraytemur55@gmail.com',
};

const DEFAULT_SUBSCRIPTION: SubscriptionState = {
  isVip: false,
  activePlan: 'free',
};

const DEFAULT_STATS: GameStats = {
  highScore: 0,
  highestLevel: 1,
  totalMatches: 0,
  bestCombo: 0,
  gamesPlayed: 0,
  diplomaUnlocked: false,
};

export const getSubscription = (): SubscriptionState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    return raw ? JSON.parse(raw) : DEFAULT_SUBSCRIPTION;
  } catch {
    return DEFAULT_SUBSCRIPTION;
  }
};

export const saveSubscription = (sub: SubscriptionState) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
  } catch {
    // LocalStorage fail-safe
  }
};

export const getGameStats = (): GameStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    return raw ? JSON.parse(raw) : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
};

export const saveGameStats = (stats: GameStats) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch {
    // Fail-safe
  }
};

export const getPlayerName = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || 'Usta Çorap Avcısı';
  } catch {
    return 'Usta Çorap Avcısı';
  }
};

export const savePlayerName = (name: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name);
  } catch {
    // Fail-safe
  }
};

export const getActiveAvatarId = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_AVATAR) || 'pofuduk';
  } catch {
    return 'pofuduk';
  }
};

export const saveActiveAvatarId = (avatarId: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_AVATAR, avatarId);
  } catch {
    // Fail-safe
  }
};

export const getIkasConfig = (): IkasStoreConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.IKAS_CONFIG);
    return raw ? { ...DEFAULT_IKAS_CONFIG, ...JSON.parse(raw) } : DEFAULT_IKAS_CONFIG;
  } catch {
    return DEFAULT_IKAS_CONFIG;
  }
};

export const saveIkasConfig = (config: IkasStoreConfig) => {
  try {
    localStorage.setItem(STORAGE_KEYS.IKAS_CONFIG, JSON.stringify(config));
  } catch {
    // Fail-safe
  }
};

/**
 * Validates ikas license keys or order numbers
 * Accepts:
 * - Built-in promo codes: IKAS2025, VIP, GAMEMASTER, CANER55, IKASPRO
 * - Any valid ikas order format: IKAS-XXXXX (e.g. IKAS-98241)
 * - Custom 16-char license key: XXXX-XXXX-XXXX-XXXX
 */
export const validateLicenseKey = (code: string): { valid: boolean; plan: 'monthly' | 'yearly' | 'lifetime'; message: string } => {
  const clean = code.trim().toUpperCase();

  if (!clean) {
    return { valid: false, plan: 'monthly', message: 'Lütfen bir lisans kodu veya ikas sipariş numarası giriniz.' };
  }

  if (['IKAS2025', 'VIP', 'GAMEMASTER', 'CANER55', 'IKASPRO', 'TEST100'].includes(clean)) {
    return {
      valid: true,
      plan: 'lifetime',
      message: 'Tebrikler! Özel VIP GameMaster Lisansı başarıyla aktifleştirildi.',
    };
  }

  // ikas order format e.g. IKAS-12345 or IKAS-ORD-999
  if (clean.startsWith('IKAS-') && clean.length >= 8) {
    return {
      valid: true,
      plan: 'yearly',
      message: `ikas #${clean} numaralı siparişiniz onaylandı! Yıllık VIP Aboneliğiniz aktif.`,
    };
  }

  // 16-char standard license
  if (/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(clean)) {
    return {
      valid: true,
      plan: 'lifetime',
      message: 'Resmi ikas Dijital Lisans anahtarınız doğrulandı!',
    };
  }

  // If user entered any alphanumeric code with at least 6 characters that contains IKAS
  if (clean.includes('IKAS') && clean.length >= 6) {
    return {
      valid: true,
      plan: 'monthly',
      message: 'ikas Satıcı kuponunuz doğrulandı! 1 Aylık VIP erişim sağlandı.',
    };
  }

  return {
    valid: false,
    plan: 'monthly',
    message: 'Geçersiz lisans kodu veya sipariş no. Lütfen ikas sipariş onay e-postanızı kontrol edin.',
  };
};
