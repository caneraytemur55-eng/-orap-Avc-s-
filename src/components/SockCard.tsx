import React from 'react';
import { SockItem } from '../types/game';

interface SockCardProps {
  sock: SockItem;
  isSelected?: boolean;
  isMatched?: boolean;
  isHinted?: boolean;
  onClick: (event?: React.MouseEvent) => void;
  disabled?: boolean;
}

export const SockCard: React.FC<SockCardProps> = ({
  sock,
  isSelected,
  isMatched,
  isHinted,
  onClick,
  disabled,
}) => {
  const renderSockGraphic = () => {
    switch (sock.pattern) {
      case 'white_wool':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md transition-transform" fill="none">
            {/* Sock Leg & Foot */}
            <path
              d="M38 15 C38 12 62 12 62 15 L62 48 C62 55 66 60 72 65 C80 72 82 82 72 87 C62 92 48 88 40 82 C30 73 38 60 38 48 Z"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Ribbed Wool Cuff */}
            <rect x="36" y="12" width="28" height="10" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="42" y1="12" x2="42" y2="22" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="50" y1="12" x2="50" y2="22" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="58" y1="12" x2="58" y2="22" stroke="#94A3B8" strokeWidth="1.5" />
            {/* Knitted Wool Texture Stitches */}
            <path d="M43 30 Q46 33 49 30 M51 30 Q54 33 57 30" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M43 40 Q46 43 49 40 M51 40 Q54 43 57 40" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Heel & Toe Patches */}
            <path d="M38 52 C34 56 34 66 40 70" stroke="#CBD5E1" strokeWidth="2.5" fill="#E2E8F0" />
            <circle cx="70" cy="80" r="7" fill="#E2E8F0" />
          </svg>
        );

      case 'white_cotton':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
            {/* Sock Outline */}
            <path
              d="M38 15 C38 12 62 12 62 15 L62 48 C62 55 66 60 72 65 C80 72 82 82 72 87 C62 92 48 88 40 82 C30 73 38 60 38 48 Z"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Athletic Dual Blue Stripes */}
            <rect x="38" y="24" width="24" height="4" fill="#0284C7" />
            <rect x="38" y="32" width="24" height="4" fill="#0284C7" />
            {/* Athletic Ribbed Top */}
            <rect x="36" y="13" width="28" height="8" rx="2" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="71" cy="80" r="6" fill="#E0F2FE" />
          </svg>
        );

      case 'argyle_royal':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
            {/* Sock Base */}
            <path
              d="M38 15 C38 12 62 12 62 15 L62 48 C62 55 66 60 72 65 C80 72 82 82 72 87 C62 92 48 88 40 82 C30 73 38 60 38 48 Z"
              fill="#1E293B"
              stroke="#475569"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Argyle Diamond Plaid */}
            <polygon points="50,22 57,32 50,42 43,32" fill="#F59E0B" />
            <polygon points="50,44 57,54 50,64 43,54" fill="#06B6D4" />
            {/* Argyle Dashed Criss-Cross Lines */}
            <line x1="42" y1="20" x2="58" y2="44" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="58" y1="20" x2="42" y2="44" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="36" y="13" width="28" height="7" rx="2" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
          </svg>
        );

      case 'rainbow_stripe':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
            <path
              d="M38 15 C38 12 62 12 62 15 L62 48 C62 55 66 60 72 65 C80 72 82 82 72 87 C62 92 48 88 40 82 C30 73 38 60 38 48 Z"
              fill="#F8FAFC"
              stroke="#64748B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Rainbow Stripe Layers */}
            <path d="M38 22 L62 22 L62 27 L38 27 Z" fill="#EF4444" />
            <path d="M38 29 L62 29 L62 34 L38 34 Z" fill="#F97316" />
            <path d="M38 36 L62 36 L62 41 L38 41 Z" fill="#EAB308" />
            <path d="M38 43 L62 43 L62 48 L38 48 Z" fill="#10B981" />
            <path d="M38 50 L64 50 L66 55 L38 55 Z" fill="#06B6D4" />
            <rect x="36" y="13" width="28" height="7" rx="2" fill="#8B5CF6" />
          </svg>
        );

      case 'cat_paw':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
            <path
              d="M38 15 C38 12 62 12 62 15 L62 48 C62 55 66 60 72 65 C80 72 82 82 72 87 C62 92 48 88 40 82 C30 73 38 60 38 48 Z"
              fill="#FFF1F2"
              stroke="#FDA4AF"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Cute Kitten Paw Print */}
            <ellipse cx="50" cy="38" rx="5" ry="4" fill="#FB7185" />
            <circle cx="43" cy="30" r="2.2" fill="#FB7185" />
            <circle cx="48" cy="27" r="2.2" fill="#FB7185" />
            <circle cx="53" cy="27" r="2.2" fill="#FB7185" />
            <circle cx="57" cy="30" r="2.2" fill="#FB7185" />
            {/* Pink Toe & Heel */}
            <circle cx="70" cy="79" r="6" fill="#FDA4AF" />
            <rect x="36" y="13" width="28" height="7" rx="2" fill="#FFE4E6" stroke="#FB7185" strokeWidth="1.5" />
          </svg>
        );

      case 'polka_dot':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
            <path
              d="M38 15 C38 12 62 12 62 15 L62 48 C62 55 66 60 72 65 C80 72 82 82 72 87 C62 92 48 88 40 82 C30 73 38 60 38 48 Z"
              fill="#CCFBF1"
              stroke="#5EEAD4"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Lilac Polka Dots */}
            <circle cx="45" cy="26" r="3" fill="#A855F7" />
            <circle cx="55" cy="33" r="3" fill="#A855F7" />
            <circle cx="45" cy="40" r="3" fill="#A855F7" />
            <circle cx="56" cy="48" r="3" fill="#A855F7" />
            <circle cx="48" cy="62" r="3" fill="#A855F7" />
            <circle cx="62" cy="74" r="3" fill="#A855F7" />
            <rect x="36" y="13" width="28" height="7" rx="2" fill="#99F6E4" stroke="#2DD4BF" strokeWidth="1.5" />
          </svg>
        );

      case 'holiday_winter':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
            <path
              d="M38 15 C38 12 62 12 62 15 L62 48 C62 55 66 60 72 65 C80 72 82 82 72 87 C62 92 48 88 40 82 C30 73 38 60 38 48 Z"
              fill="#DC2626"
              stroke="#991B1B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* White Snowflake Pattern */}
            <path d="M50 25 L50 43 M41 34 L59 34 M44 28 L56 40 M56 28 L44 40" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
            {/* Fluffy White Holiday Cuff */}
            <rect x="35" y="12" width="30" height="9" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="71" cy="79" r="6" fill="#FFFFFF" />
          </svg>
        );

      case 'starry_night':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
            <path
              d="M38 15 C38 12 62 12 62 15 L62 48 C62 55 66 60 72 65 C80 72 82 82 72 87 C62 92 48 88 40 82 C30 73 38 60 38 48 Z"
              fill="#312E81"
              stroke="#4338CA"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Twinkling Golden Stars */}
            <path d="M50 24 L52 29 L57 30 L53 34 L54 39 L50 36 L46 39 L47 34 L43 30 L48 29 Z" fill="#FBBF24" />
            <circle cx="44" cy="44" r="1.5" fill="#FEF08A" />
            <circle cx="56" cy="46" r="1.5" fill="#FEF08A" />
            <circle cx="60" cy="72" r="2" fill="#FBBF24" />
            <rect x="36" y="13" width="28" height="7" rx="2" fill="#3730A3" stroke="#6366F1" strokeWidth="1.5" />
          </svg>
        );

      case 'heart_cozy':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
            <path
              d="M38 15 C38 12 62 12 62 15 L62 48 C62 55 66 60 72 65 C80 72 82 82 72 87 C62 92 48 88 40 82 C30 73 38 60 38 48 Z"
              fill="#FFF1F2"
              stroke="#F43F5E"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Mini Red Hearts */}
            <path d="M50 30 C50 27 46 25 44 28 C42 31 50 37 50 37 C50 37 58 31 56 28 C54 25 50 27 50 30 Z" fill="#E11D48" />
            <path d="M50 48 C50 45 46 43 44 46 C42 49 50 55 50 55 C50 55 58 49 56 46 C54 43 50 45 50 48 Z" fill="#E11D48" />
            <rect x="36" y="13" width="28" height="7" rx="2" fill="#FFE4E6" stroke="#FB7185" strokeWidth="1.5" />
          </svg>
        );

      case 'golden_sock':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" fill="none">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
            <path
              d="M38 15 C38 12 62 12 62 15 L62 48 C62 55 66 60 72 65 C80 72 82 82 72 87 C62 92 48 88 40 82 C30 73 38 60 38 48 Z"
              fill="url(#goldGrad)"
              stroke="#FDE047"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Golden Sparkles */}
            <path d="M50 28 L51 33 L56 34 L52 37 L53 42 L50 39 L47 42 L48 37 L44 34 L49 33 Z" fill="#FFFFFF" />
            <circle cx="62" cy="70" r="2.5" fill="#FFFFFF" />
            <circle cx="43" cy="68" r="2" fill="#FEF08A" />
            <rect x="35" y="12" width="30" height="9" rx="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isMatched}
      title={`${sock.name}`}
      className={`
        relative group flex flex-col items-center justify-center
        aspect-square p-1.5 sm:p-2 rounded-xl sm:rounded-2xl
        transition-all duration-150 transform cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
        ${isMatched ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100'}
        ${
          isSelected
            ? 'scale-105 bg-amber-500/20 ring-2 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10'
            : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 shadow-sm active:scale-95'
        }
        ${isHinted ? 'animate-bounce ring-2 ring-emerald-400' : ''}
        ${sock.isSpecial ? 'bg-amber-950/40 border-amber-500/40 ring-1 ring-amber-500/50' : ''}
      `}
    >
      {/* Special Badge indicator */}
      {sock.isSpecial && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 shadow">
          ★
        </span>
      )}

      {/* Sock Graphic */}
      <div className="w-full h-full flex items-center justify-center p-0.5">
        {renderSockGraphic()}
      </div>

      {/* Selected Indicator Ping */}
      {isSelected && (
        <span className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-amber-400 animate-ping opacity-30 pointer-events-none" />
      )}
    </button>
  );
};
