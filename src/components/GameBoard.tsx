import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { BoardCell, SockItem, GameStats, SubscriptionState, AvatarProfile } from '../types/game';
import { SOCK_CATALOG } from '../data/gameData';
import { SockCard } from './SockCard';
import { sound } from '../utils/audio';
import { Zap, Clock, Trophy, Sparkles, Award, RefreshCw, AlertCircle } from 'lucide-react';

interface GameBoardProps {
  currentLevel: number;
  activeAvatar: AvatarProfile;
  subscription: SubscriptionState;
  onLevelComplete: (clearedLevel: number, finalScore: number) => void;
  onGameOver: (finalScore: number, levelReached: number) => void;
  onRequestSubscription: () => void;
  onOpenDiploma: () => void;
  stats: GameStats;
  onUpdateStats: (newStats: Partial<GameStats>) => void;
}

const BOARD_COLS = 6;
const BOARD_ROWS = 6;

// Formula for level target pairs and base duration
const getLevelConfig = (level: number) => {
  // Base time decreases with level (minimum 20s)
  const baseDuration = Math.max(20, 52 - (level - 1) * 4);
  // Countdown tick speed multiplier increases with level! (1.0x at L1, up to 2.8x at L10)
  const speedMultiplier = 1 + (level - 1) * 0.18;
  // Pairs required to clear the level
  const targetPairs = Math.min(18, 5 + level * 2);

  return {
    baseDuration,
    speedMultiplier,
    targetPairs,
  };
};

export const GameBoard: React.FC<GameBoardProps> = ({
  currentLevel,
  activeAvatar,
  subscription,
  onLevelComplete,
  onGameOver,
  onRequestSubscription,
  onOpenDiploma,
  stats,
  onUpdateStats,
}) => {
  const config = getLevelConfig(currentLevel);

  const [grid, setGrid] = useState<BoardCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [matchedPairsInLevel, setMatchedPairsInLevel] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(config.baseDuration);
  const [combo, setCombo] = useState<number>(0);
  const [avatarSpeech, setAvatarSpeech] = useState<string>(activeAvatar.quotes.idle[0]);
  const [floatingScores, setFloatingScores] = useState<
    { id: number; text: string; x: number; y: number }[]
  >([]);
  const [isProcessingMatch, setIsProcessingMatch] = useState<boolean>(false);
  const [hintCells, setHintCells] = useState<{ r: number; c: number }[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef<number>(score);
  scoreRef.current = score;

  // Pick random sock from catalog available for this level
  const getRandomSock = useCallback((allowGolden: boolean = true): SockItem => {
    // Determine catalog pool based on level (more variety as level increases)
    const availablePoolSize = Math.min(SOCK_CATALOG.length - 1, 4 + currentLevel);
    const regularPool = SOCK_CATALOG.slice(0, availablePoolSize);

    // 4% chance of spawning Golden Sock in level 2+
    if (allowGolden && currentLevel >= 2 && Math.random() < 0.05) {
      const golden = SOCK_CATALOG.find((s) => s.pattern === 'golden_sock');
      if (golden) return golden;
    }

    const randomIndex = Math.floor(Math.random() * regularPool.length);
    const base = regularPool[randomIndex];
    return {
      ...base,
      id: `${base.pattern}_${Math.random().toString(36).substring(2, 9)}`,
    };
  }, [currentLevel]);

  // Generate initial board ensuring plenty of matching pairs exist
  const generateBoard = useCallback(() => {
    const totalCells = BOARD_ROWS * BOARD_COLS;
    const numPairs = totalCells / 2;

    const socksPool: SockItem[] = [];
    for (let i = 0; i < numPairs; i++) {
      const sockA = getRandomSock();
      const sockB: SockItem = {
        ...sockA,
        id: `${sockA.pattern}_${Math.random().toString(36).substring(2, 9)}`,
      };
      socksPool.push(sockA, sockB);
    }

    // Shuffle socks array
    for (let i = socksPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [socksPool[i], socksPool[j]] = [socksPool[j], socksPool[i]];
    }

    const newGrid: BoardCell[][] = [];
    let idx = 0;
    for (let r = 0; r < BOARD_ROWS; r++) {
      const row: BoardCell[] = [];
      for (let c = 0; c < BOARD_COLS; c++) {
        row.push({
          id: `cell_${r}_${c}`,
          row: r,
          col: c,
          sock: socksPool[idx++],
        });
      }
      newGrid.push(row);
    }

    return newGrid;
  }, [getRandomSock]);

  // Initialize board & level timer
  useEffect(() => {
    setGrid(generateBoard());
    setTimeLeft(config.baseDuration);
    setMatchedPairsInLevel(0);
    setSelectedCell(null);
    setCombo(0);
    setHintCells([]);
    setAvatarSpeech(activeAvatar.quotes.idle[Math.floor(Math.random() * activeAvatar.quotes.idle.length)]);
  }, [currentLevel, config.baseDuration, generateBoard, activeAvatar]);

  // Accelerated timer tick effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    // Time interval accelerates with speedMultiplier!
    // At speedMultiplier 1.0 -> 1000ms
    // At speedMultiplier 2.0 -> 500ms
    const intervalMs = Math.max(300, Math.round(1000 / config.speedMultiplier));

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          sound.playGameOver();
          onGameOver(scoreRef.current, currentLevel);
          return 0;
        }

        const isUrgent = prev <= 10;
        if (isUrgent && prev % 2 === 0) {
          sound.playTimerTick(true);
        } else if (prev % 5 === 0) {
          sound.playTimerTick(false);
        }

        if (isUrgent) {
          setAvatarSpeech(
            activeAvatar.quotes.urgent[Math.floor(Math.random() * activeAvatar.quotes.urgent.length)]
          );
        }

        return Number((prev - 1).toFixed(1));
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [config.speedMultiplier, onGameOver, currentLevel, activeAvatar]);

  // Cascading drop and replenish
  const cascadeAndReplenish = (currentGrid: BoardCell[][], clearedCells: { r: number; c: number }[]) => {
    const updated = currentGrid.map((row) => row.map((cell) => ({ ...cell })));

    // Mark cleared cells
    clearedCells.forEach(({ r, c }) => {
      updated[r][c].isMatched = true;
    });

    setGrid(updated);

    // After brief delay, drop tiles down and fill from top
    setTimeout(() => {
      const replenishedGrid: BoardCell[][] = [];

      for (let c = 0; c < BOARD_COLS; c++) {
        // Collect surviving socks in this column from bottom to top
        const columnSocks: SockItem[] = [];
        for (let r = BOARD_ROWS - 1; r >= 0; r--) {
          if (!updated[r][c].isMatched) {
            columnSocks.push(updated[r][c].sock);
          }
        }

        // Fill remaining top slots with fresh socks from laundry line
        while (columnSocks.length < BOARD_ROWS) {
          columnSocks.push(getRandomSock());
        }

        // Reassign column socks bottom to top
        for (let r = BOARD_ROWS - 1; r >= 0; r--) {
          const sock = columnSocks.shift()!;
          if (!replenishedGrid[r]) replenishedGrid[r] = [];
          replenishedGrid[r][c] = {
            id: `cell_${r}_${c}_${Date.now()}_${Math.random()}`,
            row: r,
            col: c,
            sock,
            isSelected: false,
            isMatched: false,
          };
        }
      }

      setGrid(replenishedGrid);
      setIsProcessingMatch(false);
    }, 220);
  };

  // Trigger floating score label
  const addFloatingScore = (text: string, x: number, y: number) => {
    const id = Date.now() + Math.random();
    setFloatingScores((prev) => [...prev, { id, text, x, y }]);
    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  // Handle sock cell selection
  const handleCellClick = (r: number, c: number, event?: React.MouseEvent) => {
    if (isProcessingMatch || timeLeft <= 0) return;

    sound.playSelect();
    setHintCells([]);

    // First selection
    if (!selectedCell) {
      setSelectedCell({ row: r, col: c });
      return;
    }

    // Tapping the same cell deselects it
    if (selectedCell.row === r && selectedCell.col === c) {
      setSelectedCell(null);
      return;
    }

    const first = grid[selectedCell.row][selectedCell.col];
    const second = grid[r][c];

    // Check match condition:
    // 1. Same pattern, OR
    // 2. Either sock is 'golden_sock' (matches with anything!)
    const isGolden = first.sock.pattern === 'golden_sock' || second.sock.pattern === 'golden_sock';
    const isPairMatch = first.sock.pattern === second.sock.pattern || isGolden;

    if (isPairMatch) {
      setIsProcessingMatch(true);
      const newCombo = combo + 1;
      setCombo(newCombo);

      // Score calculation with combo multiplier
      const basePoints = isGolden ? 300 : 100;
      const comboMultiplier = 1 + (newCombo - 1) * 0.5;
      const pointsEarned = Math.round(basePoints * comboMultiplier);
      const newScore = score + pointsEarned;
      setScore(newScore);

      // Clutch time bonus (+2.0s or +5.0s for golden)
      const bonusSeconds = isGolden ? 5.0 : 2.0;
      setTimeLeft((prev) => Number((prev + bonusSeconds).toFixed(1)));

      if (isGolden) {
        sound.playGoldenSparkle();
      } else if (newCombo > 1) {
        sound.playCombo(newCombo);
      } else {
        sound.playMatch();
      }

      // Floating text
      if (event && event.target) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const bonusText = isGolden
          ? `+${pointsEarned} ALTIN ÇORAP! (+5s)`
          : newCombo > 1
          ? `+${pointsEarned} (${newCombo}x KOMBO!)`
          : `+${pointsEarned} Eşleşti! (+2s)`;
        addFloatingScore(bonusText, rect.left + rect.width / 2, rect.top);
      }

      // Update avatar dialogue
      if (newCombo >= 3) {
        setAvatarSpeech(
          activeAvatar.quotes.combo[Math.floor(Math.random() * activeAvatar.quotes.combo.length)]
        );
      } else {
        setAvatarSpeech(
          activeAvatar.quotes.match[Math.floor(Math.random() * activeAvatar.quotes.match.length)]
        );
      }

      // Check level clear
      const newPairsCount = matchedPairsInLevel + 1;
      setMatchedPairsInLevel(newPairsCount);

      // Update global persistent stats
      onUpdateStats({
        highScore: Math.max(stats.highScore, newScore),
        totalMatches: stats.totalMatches + 1,
        bestCombo: Math.max(stats.bestCombo, newCombo),
        highestLevel: Math.max(stats.highestLevel, currentLevel),
        diplomaUnlocked: stats.diplomaUnlocked || newScore >= 1500 || currentLevel >= 3,
      });

      // Clear the pair and cascade
      cascadeAndReplenish(grid, [
        { r: selectedCell.row, c: selectedCell.col },
        { r, c },
      ]);
      setSelectedCell(null);

      // Check if level target reached
      if (newPairsCount >= config.targetPairs) {
        if (timerRef.current) clearInterval(timerRef.current);

        setTimeout(() => {
          sound.playLevelUp();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });

          // Level 1 is free! If completing Level 1 and user is not VIP, show subscription prompt
          if (currentLevel === 1 && !subscription.isVip) {
            onRequestSubscription();
          } else {
            onLevelComplete(currentLevel, newScore);
          }
        }, 500);
      }
    } else {
      // Mismatch
      sound.playMismatch();
      setCombo(0);
      setSelectedCell(null);
    }
  };

  // Find a hint pair if player is stuck
  const handleFindHint = () => {
    sound.playSelect();
    for (let r1 = 0; r1 < BOARD_ROWS; r1++) {
      for (let c1 = 0; c1 < BOARD_COLS; c1++) {
        const sock1 = grid[r1][c1].sock;
        for (let r2 = 0; r2 < BOARD_ROWS; r2++) {
          for (let c2 = 0; c2 < BOARD_COLS; c2++) {
            if (r1 === r2 && c1 === c2) continue;
            const sock2 = grid[r2][c2].sock;
            if (sock1.pattern === sock2.pattern || sock1.pattern === 'golden_sock') {
              setHintCells([
                { r: r1, c: c1 },
                { r: r2, c: c2 },
              ]);
              return;
            }
          }
        }
      }
    }
  };

  // Washing machine reshuffle powerup
  const handleReshuffleBoard = () => {
    sound.playSelect();
    setGrid(generateBoard());
    setCombo(0);
    setSelectedCell(null);
    setHintCells([]);
    setAvatarSpeech('Çamaşır sepeti karıştırıldı! Yepyeni eşler hazır!');
  };

  // Timer color shifting
  const timerPercentage = Math.min(100, (timeLeft / config.baseDuration) * 100);
  const getTimerColor = () => {
    if (timeLeft <= 8) return 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]';
    if (timeLeft <= 18) return 'bg-amber-400';
    return 'bg-emerald-400';
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 flex flex-col items-center">
      {/* Floating Animated Score Indicators */}
      {floatingScores.map((item) => (
        <div
          key={item.id}
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-8 font-bold text-sm sm:text-base text-amber-300 drop-shadow-md animate-bubble"
          style={{ left: item.x, top: item.y }}
        >
          {item.text}
        </div>
      ))}

      {/* Top Status Cluster (Unboxed clean stats with tabular numerals) */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-3 shadow-lg backdrop-blur-md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center text-center">
          {/* Level & Speed info */}
          <div className="flex flex-col items-start text-left">
            <span className="text-xs text-slate-400 font-medium">Seviye</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-display text-white tabular-nums">
                {currentLevel}
              </span>
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.5 rounded">
                {config.speedMultiplier.toFixed(2)}x İvme
              </span>
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-start sm:items-center">
            <span className="text-xs text-slate-400 font-medium">Toplam Skor</span>
            <div className="flex items-center gap-1 text-xl sm:text-2xl font-bold font-display text-amber-400 tabular-nums">
              <Trophy className="w-5 h-5 text-amber-400 inline" />
              {score}
            </div>
          </div>

          {/* Target pairs progress */}
          <div className="flex flex-col items-start sm:items-center">
            <span className="text-xs text-slate-400 font-medium">Hedef Çift</span>
            <div className="text-xl sm:text-2xl font-bold font-display text-cyan-400 tabular-nums">
              {matchedPairsInLevel} / {config.targetPairs}
            </div>
          </div>

          {/* Time & Acceleration */}
          <div className="flex flex-col items-end text-right">
            <span className="text-xs text-slate-400 font-medium">Kalan Süre</span>
            <div
              className={`flex items-center gap-1 text-xl sm:text-2xl font-bold font-display tabular-nums ${
                timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'
              }`}
            >
              <Clock className="w-5 h-5 inline" />
              {timeLeft.toFixed(0)}s
            </div>
          </div>
        </div>

        {/* Dynamic Accelerated Timer Bar */}
        <div className="mt-3 w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 rounded-full ${getTimerColor()}`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>

        {/* Acceleration & Combo Indicator Pill */}
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Süre Akış Hızı: <strong className="text-amber-400">%{((config.speedMultiplier - 1) * 100).toFixed(0)} Daha Hızlı</strong>
            </span>
            {combo > 1 && (
              <span className="text-rose-400 font-bold animate-pulse">
                🔥 {combo}x Kombo Katlayıcı!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFindHint}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> İpucu
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={handleReshuffleBoard}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Karıştır
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Avatar Mood Banner */}
      <div className="w-full max-w-xl bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-2 mb-3 flex items-center gap-3 backdrop-blur-sm">
        <div className="relative shrink-0">
          <img
            src={activeAvatar.avatarUrl}
            alt={activeAvatar.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/60"
            referrerPolicy="no-referrer"
          />
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900"
            style={{ backgroundColor: activeAvatar.color }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200">{activeAvatar.name}</span>
            <span className="text-[10px] text-slate-500 font-medium truncate">{activeAvatar.title}</span>
          </div>
          <p className="text-xs text-amber-200/90 italic truncate">"{avatarSpeech}"</p>
        </div>
        {stats.diplomaUnlocked && (
          <button
            onClick={onOpenDiploma}
            className="shrink-0 flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            Diploma
          </button>
        )}
      </div>

      {/* Main Laundry Board Grid (6x6) */}
      <div className="relative p-2.5 sm:p-4 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-md max-w-lg w-full">
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5">
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selectedCell?.row === r && selectedCell?.col === c;
              const isHinted = hintCells.some((h) => h.r === r && h.c === c);

              return (
                <SockCard
                  key={cell.id}
                  sock={cell.sock}
                  isSelected={isSelected}
                  isMatched={cell.isMatched}
                  isHinted={isHinted}
                  onClick={(e) => handleCellClick(r, c, e)}
                  disabled={isProcessingMatch || timeLeft <= 0}
                />
              );
            })
          )}
        </div>

        {/* Free Tier Level 1 Notice */}
        {currentLevel === 1 && !subscription.isVip && (
          <div className="mt-3 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>1. Seviye Ücretsiz Tanıtım Modudur. Sonraki seviyeler ikas VIP aboneliğe tabidir.</span>
          </div>
        )}
      </div>
    </div>
  );
};
