export type SockPattern =
  | 'white_wool'
  | 'white_cotton'
  | 'argyle_royal'
  | 'rainbow_stripe'
  | 'cat_paw'
  | 'polka_dot'
  | 'holiday_winter'
  | 'starry_night'
  | 'heart_cozy'
  | 'golden_sock';

export interface SockItem {
  id: string;
  pattern: SockPattern;
  name: string;
  category: 'wool' | 'cotton' | 'pattern' | 'special';
  colorHex: string;
  accentHex: string;
  isSpecial?: boolean;
}

export interface BoardCell {
  id: string;
  row: number;
  col: number;
  sock: SockItem;
  isSelected?: boolean;
  isMatched?: boolean;
  isHinted?: boolean;
}

export interface AvatarProfile {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  color: string;
  unlockLevel: number;
  quotes: {
    idle: string[];
    match: string[];
    combo: string[];
    urgent: string[];
    win: string[];
    lose: string[];
  };
}

export type SubscriptionPlanId = 'free' | 'monthly' | 'yearly' | 'lifetime';

export interface SubscriptionState {
  isVip: boolean;
  activePlan: SubscriptionPlanId;
  licenseKey?: string;
  ikasOrderNumber?: string;
  expiresAt?: string;
}

export interface GameStats {
  highScore: number;
  highestLevel: number;
  totalMatches: number;
  bestCombo: number;
  gamesPlayed: number;
  diplomaUnlocked: boolean;
}

export type GameScreen = 'MENU' | 'PLAYING' | 'PAUSED' | 'LEVEL_CLEARED' | 'GAME_OVER' | 'DIPLOMA';
