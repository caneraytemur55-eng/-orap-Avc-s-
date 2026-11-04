import React, { useState } from 'react';
import { GameStats, AvatarProfile } from '../types/game';
import { Award, Printer, Share2, Check, X, Sparkles, UserCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface DiplomaModalProps {
  stats: GameStats;
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  activeAvatar: AvatarProfile;
  onClose: () => void;
}

export const DiplomaModal: React.FC<DiplomaModalProps> = ({
  stats,
  playerName,
  onUpdatePlayerName,
  activeAvatar,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState(playerName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate deterministic certificate number based on score and name
  const certNumber = `GM-${stats.highestLevel.toString().padStart(2, '0')}${Math.abs(
    stats.highScore * 7 + 1042
  )
    .toString(16)
    .toUpperCase()
    .slice(0, 6)}`;

  const todayFormatted = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdatePlayerName(nameInput.trim());
      setIsEditingName(false);
      sound.playSelect();
    }
  };

  const handlePrint = () => {
    sound.playSelect();
    window.print();
  };

  const handleShare = async () => {
    sound.playSelect();
    const shareText = `🎓 Çorap Avcısı - GameMaster Diploması Kazandım!\n🏆 Skor: ${stats.highScore} Puan\n⚡ Seviye: ${stats.highestLevel}\n📜 Sertifika No: #${certNumber}\nSen de dağınık yün çorapların eşini bul ve GameMaster diplomasını kap!`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-4 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Bar Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-white font-display">Resmi GameMaster Diploması</h2>
              <p className="text-xs text-slate-400">Üstün Hız & Eşleştirme Refleks Sertifikasyonu</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Yazdır / PDF
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Kopyalandı!' : 'Diplomayı Paylaş'}
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div
          id="printable-diploma"
          className="relative rounded-2xl p-6 sm:p-10 border-4 border-amber-500/60 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5EEDC] text-slate-900 shadow-xl overflow-hidden"
          style={{ minHeight: '440px' }}
        >
          {/* Inner Ornate Double Border */}
          <div className="absolute inset-2 border border-amber-800/30 rounded-xl pointer-events-none" />
          <div className="absolute inset-3 border-2 border-dashed border-amber-700/20 rounded-lg pointer-events-none" />

          {/* Top Crest / Title */}
          <div className="text-center relative z-10">
            <div className="inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-amber-900 font-bold mb-1">
              <span>★</span> ULUSLARARASI ÇORAP EŞLEŞTİRME VE BULMA KURULU <span>★</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 font-display uppercase">
              GameMaster Diploması
            </h1>
            <p className="text-xs sm:text-sm text-amber-800/90 font-serif italic mt-1">
              Certificate of Grandmaster Sock Sorting & Reflex Excellence
            </p>
          </div>

          {/* Certificate Body */}
          <div className="my-6 text-center relative z-10 space-y-4">
            <p className="text-xs sm:text-sm text-slate-700">İşbu diploma, birbirine karışmış yün ve pamuklu çorapların arasında olağanüstü hız ve hızlanan sürelere karşı eşsiz konsantrasyon sergileyen:</p>

            {/* Candidate Name */}
            <div className="inline-block relative">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1 bg-white border-2 border-amber-500 rounded-lg text-slate-900 font-bold text-center text-lg sm:text-xl font-display"
                    maxLength={30}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold"
                  >
                    Kaydet
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className="group cursor-pointer flex items-center justify-center gap-2"
                  title="İsminizi değiştirmek için tıklayın"
                >
                  <span className="text-2xl sm:text-3xl font-black text-amber-900 font-display border-b-2 border-amber-600/50 pb-1 px-4">
                    {playerName}
                  </span>
                  <UserCheck className="w-4 h-4 text-amber-700 opacity-60 group-hover:opacity-100" />
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
              adlı saygıdeğer avcıya; <strong className="text-slate-900">{stats.highScore} Puan</strong> rekor skora ve <strong className="text-slate-900">{stats.highestLevel}. Seviye</strong> zorluğuna ulaşarak kayıp çorapların gizemini çözdüğü için <strong className="text-amber-900">RESMİ YÜCE GAMEMASTER</strong> unvanıyla tevcih edilmiştir.
            </p>
          </div>

          {/* Metrics & Official Gold Seal Footer */}
          <div className="mt-8 pt-4 border-t border-amber-700/20 flex flex-wrap items-end justify-between gap-4 relative z-10 text-xs text-slate-800">
            {/* Left signature */}
            <div className="flex flex-col items-center">
              <div className="font-serif italic text-amber-950 text-base font-bold pb-1 border-b border-slate-700 w-32 text-center">
                Prof. Dr. Yün Çorap
              </div>
              <span className="text-[10px] text-slate-600 mt-0.5">Enstitü Başhakemi</span>
              <span className="text-[10px] text-slate-500 font-mono">Tarih: {todayFormatted}</span>
            </div>

            {/* Center Gold Wax Seal Image */}
            <div className="flex flex-col items-center">
              <img
                src="/src/assets/images/sock_diploma_seal_1793800765377.jpg"
                alt="GameMaster Mührü"
                className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mt-1">
                Resmi Mühür
              </span>
            </div>

            {/* Right validation & avatar badge */}
            <div className="flex flex-col items-center sm:items-end">
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={activeAvatar.avatarUrl}
                  alt={activeAvatar.name}
                  className="w-8 h-8 rounded-full border border-amber-600 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[11px] font-semibold text-slate-900">{activeAvatar.name}</span>
              </div>
              <div className="font-mono text-[10px] text-slate-600 bg-white/70 px-2 py-0.5 rounded border border-amber-700/20">
                Sertifika No: #{certNumber}
              </div>
              <span className="text-[9px] text-emerald-800 font-semibold mt-0.5">✓ E-Devlet & ikas Uyumlu</span>
            </div>
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            İsminizi değiştirmek için diploma üzerindeki isme tıklayın.
          </span>
          <button
            onClick={onClose}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
          >
            Kapat ve Oyuna Dön
          </button>
        </div>
      </div>
    </div>
  );
};
