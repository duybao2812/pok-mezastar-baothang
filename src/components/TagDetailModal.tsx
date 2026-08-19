import React, { useState } from 'react';
import { MezastarTag } from '../types';
import { TYPE_COLORS } from '../data/tagsData';
import { 
  X, 
  Plus, 
  Minus, 
  Zap, 
  Shield, 
  Swords, 
  Heart, 
  Gauge, 
  Share2, 
  Check, 
  FileText, 
  Sparkles,
  ExternalLink,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { 
  normalizePokemonType, 
  getAttackingProfile, 
  getDefendingProfile,
  PokemonTypeId 
} from '../utils/typeMatchupData';

interface TagDetailModalProps {
  tag: MezastarTag;
  onClose: () => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onOpenTypeChart?: (type?: PokemonTypeId) => void;
}

export const TagDetailModal: React.FC<TagDetailModalProps> = ({
  tag,
  onClose,
  onIncrement,
  onDecrement,
  onUpdateNotes,
  onOpenTypeChart,
}) => {
  const [noteText, setNoteText] = useState(tag.notes || '');
  const [isSavedNote, setIsSavedNote] = useState(false);
  const [copied, setCopied] = useState(false);

  const isSuperstar = tag.grade === 6;
  const isStar = tag.grade === 5;
  const typeConfig = TYPE_COLORS[tag.type] || {
    bg: "from-slate-700 to-slate-800",
    text: "text-slate-300",
    border: "border-slate-600",
    glow: "rgba(148, 163, 184, 0.4)",
    badge: "bg-slate-700/50 text-slate-200 border-slate-600"
  };

  // Compute Type Matchups for this Pokemon
  const primaryTypeId = normalizePokemonType(tag.type);
  const moveTypeId = normalizePokemonType(tag.moveType) || primaryTypeId;

  const attackingProfile = moveTypeId ? getAttackingProfile(moveTypeId) : null;
  const defendingProfile = primaryTypeId ? getDefendingProfile(primaryTypeId) : null;

  const handleSaveNote = () => {
    sounds.playClick();
    onUpdateNotes(tag.id, noteText);
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  const handleShareTag = () => {
    sounds.playClick();
    const shareText = `🎮 [Pokémon Mezastar VN] Thẻ ${tag.grade}★ ${tag.name} (${tag.id}) - Năng lượng Meza: ${tag.energy} | Chiêu: ${tag.moveName} | Số lượng sở hữu: x${tag.quantity}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Highlight Ribbon */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${
          isSuperstar 
            ? 'from-purple-600 via-pink-500 to-amber-300' 
            : isStar 
              ? 'from-yellow-500 via-red-500 to-amber-400' 
              : 'from-blue-600 to-cyan-400'
        }`} />

        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 border border-purple-500/30">
              {tag.id}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>{tag.name}</span>
              {tag.japaneseName && (
                <span className="text-xs text-slate-400 font-normal">({tag.japaneseName})</span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareTag}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Sao chép thông tin thẻ"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Visual & Key Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            {/* Tag Artwork Preview Box */}
            <div className="relative rounded-xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
              {/* Radial glow background */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(circle, ${typeConfig.glow} 0%, transparent 70%)`
                }}
              />

              {/* Meza Tag Grade Ribbon */}
              <div className="w-full flex items-center justify-between mb-2 relative z-10">
                <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                  isSuperstar 
                    ? 'bg-purple-900/90 text-amber-300 border border-purple-400' 
                    : isStar 
                      ? 'bg-yellow-900/90 text-yellow-200 border border-yellow-400' 
                      : 'bg-slate-800 text-slate-300'
                }`}>
                  {tag.gradeName} {tag.grade}★
                </span>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: tag.grade }).map((_, i) => (
                    <span key={i} className="text-sm font-black text-amber-400 drop-shadow">★</span>
                  ))}
                </div>
              </div>

              {/* Official Pokémon Meza Tag Image */}
              <div className="relative w-full aspect-[16/10] flex items-center justify-center my-2 bg-slate-950/60 rounded-lg p-2 border border-slate-800/80">
                <img
                  src={tag.image}
                  alt={`${tag.name} (${tag.id})`}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
                />
              </div>

              {/* Meza Power & Mechanic Badges */}
              <div className="w-full flex items-center justify-between gap-2 mt-2 pt-3 border-t border-slate-800 relative z-10">
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Meza Energy: {tag.energy}</span>
                </div>

                {tag.specialMechanic !== 'None' && (
                  <span className="text-xs font-black px-2 py-1 rounded-md bg-purple-600 text-white shadow">
                    {tag.specialMechanic}
                  </span>
                )}
              </div>
            </div>

            {/* Stats & Battle Info */}
            <div className="space-y-4">
              {/* Type Badges */}
              <div>
                <span className="text-xs text-slate-400 font-medium">Hệ Pokémon:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${typeConfig.badge}`}>
                    {tag.type} ({tag.typeEn})
                  </span>
                  {tag.secondaryType && (
                    <span className="px-3 py-1 rounded-lg text-xs font-bold border bg-slate-800 text-slate-300 border-slate-700">
                      {tag.secondaryType} ({tag.secondaryTypeEn})
                    </span>
                  )}
                </div>
              </div>

              {/* Move info */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Chiêu Thức Chiến Đấu</span>
                <p className="text-sm font-black text-white mt-0.5 flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-red-400" />
                  <span>{tag.moveName}</span>
                </p>
                <span className="text-[11px] text-slate-400">Hệ chiêu: <strong className="text-slate-200">{tag.moveType}</strong></span>
              </div>

              {/* Battle Stat Bars */}
              <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Chỉ Số Trận Đấu (Arcade Stats)</span>
                
                {/* HP */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1"><Heart className="w-3 h-3 text-emerald-400" /> Máu (HP)</span>
                    <span className="font-bold text-emerald-400">{tag.hp}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (tag.hp / 240) * 100)}%` }} />
                  </div>
                </div>

                {/* Attack */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1"><Swords className="w-3 h-3 text-red-400" /> Tấn Công (ATK)</span>
                    <span className="font-bold text-red-400">{tag.attack}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, (tag.attack / 200) * 100)}%` }} />
                  </div>
                </div>

                {/* Defense */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1"><Shield className="w-3 h-3 text-blue-400" /> Phòng Thủ (DEF)</span>
                    <span className="font-bold text-blue-400">{tag.defense}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (tag.defense / 180) * 100)}%` }} />
                  </div>
                </div>

                {/* Speed */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1"><Gauge className="w-3 h-3 text-cyan-400" /> Tốc Độ (SPD)</span>
                    <span className="font-bold text-cyan-400">{tag.speed}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (tag.speed / 160) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {tag.description && (
            <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-slate-200">Giới thiệu Pokémon: </span>
              {tag.description}
            </div>
          )}

          {/* Combat Type Matchup Analysis Box (Tương Khắc Thực Chiến) */}
          {(attackingProfile || defendingProfile) && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-black uppercase text-white tracking-wide">
                    Tương Khắc Thực Chiến (Arcade Matchups)
                  </span>
                </div>
                {onOpenTypeChart && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenTypeChart(primaryTypeId || 'Water');
                    }}
                    className="text-[11px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Mở Bảng Khắc Hệ</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Attacking Highlights */}
                {attackingProfile && (
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-red-900/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                        <span>Đòn {tag.moveName || 'Tấn công'} (Hệ {tag.moveType || tag.type}):</span>
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[11px] text-slate-400">
                        🔴 <strong className="text-red-300">Siêu hiệu quả (x2) lên:</strong>
                      </div>
                      {attackingProfile.supers.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {attackingProfile.supers.map((t) => (
                            <span
                              key={t.id}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.bgColor} text-white shadow-xs`}
                            >
                              {t.iconSymbol} {t.nameVi}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500 italic">Không có hệ nào chịu x2</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Defending Highlights */}
                {defendingProfile && (
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-blue-900/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                        <span>Phòng thủ (Hệ {tag.type}):</span>
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[11px] text-slate-400">
                        ⚠️ <strong className="text-amber-300">Bị khắc chế bởi (Nhận x2):</strong>
                      </div>
                      {defendingProfile.weaknesses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {defendingProfile.weaknesses.map((t) => (
                            <span
                              key={t.id}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.bgColor} text-white shadow-xs`}
                            >
                              {t.iconSymbol} {t.nameVi}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-emerald-400 italic">Không có điểm yếu!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Notes Area */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="tag-notes-input" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Ghi chú cá nhân (Vị trí hộp thẻ, tình trạng, cần đổi...)</span>
              </label>
              {isSavedNote && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Đã lưu
                </span>
              )}
            </div>
            <textarea
              id="tag-notes-input"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Nhập ghi chú cho thẻ này (ví dụ: Thẻ mới 100%, đựng ở trang 2 album, muốn đổi lấy Kyogre...)..."
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNote}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
              >
                Lưu Ghi Chú
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Quantity Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 uppercase font-bold">Số lượng sở hữu:</span>
            <span className="text-xl font-black text-cyan-400 font-mono px-3 py-0.5 rounded-lg bg-slate-950 border border-slate-800">
              x{tag.quantity}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (tag.quantity > 0) {
                  sounds.playDecrement();
                  onDecrement(tag.id);
                }
              }}
              disabled={tag.quantity === 0}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-xs font-bold uppercase text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Giảm</span>
            </button>

            <button
              onClick={() => {
                sounds.playIncrement();
                onIncrement(tag.id);
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase shadow-lg shadow-blue-900/40 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Thẻ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
