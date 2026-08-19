import React, { useEffect } from 'react';
import { MezastarTag } from '../types';
import { TYPE_COLORS } from '../data/tagsData';
import { Sparkles, Check, ArrowRight, Camera, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface ScanResultModalProps {
  tag: MezastarTag | null;
  onClose: () => void;
  onScanAnother: () => void;
}

export const ScanResultModal: React.FC<ScanResultModalProps> = ({
  tag,
  onClose,
  onScanAnother,
}) => {
  if (!tag) return null;

  const isSuperstar = tag.grade === 6;
  const isStar = tag.grade === 5;

  const typeConfig = TYPE_COLORS[tag.type] || {
    bg: "from-slate-700 to-slate-800",
    text: "text-slate-300",
    border: "border-slate-600",
    glow: "rgba(148, 163, 184, 0.4)",
    badge: "bg-slate-700 text-slate-200 border-slate-600"
  };

  useEffect(() => {
    // Trigger fanfare and confetti effects
    if (isSuperstar) {
      sounds.playSuperstarFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#f59e0b', '#3b82f6', '#10b981'],
      });
    } else if (isStar) {
      sounds.playStarChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#fbbf24'],
      });
    } else {
      sounds.playIncrement();
    }
  }, [tag.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-purple-500/50 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col text-center p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Holographic Glowing Header */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-300 animate-pulse" />

        {/* Celebration Title */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-500/50 text-xs font-black text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>NHẬN DIỆN THÀNH CÔNG!</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            +1 Thẻ Đã Được Thắp Sáng
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dữ liệu đã tự động cập nhật vào bộ sưu tập Mezastar của bạn
          </p>
        </div>

        {/* Tag Artwork & Holographic Card Frame */}
        <div className={`relative my-3 p-4 rounded-2xl border transition-all ${
          isSuperstar 
            ? 'bg-gradient-to-b from-slate-950 via-purple-950/80 to-slate-950 border-purple-400 shadow-xl shadow-purple-900/60 ring-2 ring-purple-500/50'
            : isStar 
              ? 'bg-gradient-to-b from-slate-950 via-red-950/80 to-slate-950 border-red-400 shadow-lg shadow-red-900/50'
              : 'bg-slate-950 border-slate-700'
        }`}>
          {/* Tag ID & Grade Stars */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-800 text-purple-200 border border-purple-500/30">
              {tag.id}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: tag.grade }).map((_, i) => (
                <span key={i} className="text-sm font-black text-amber-400">★</span>
              ))}
            </div>
          </div>

          {/* Pokémon Meza Tag Artwork */}
          <div className="relative w-full max-w-[260px] aspect-[16/10] mx-auto flex items-center justify-center my-2 bg-slate-950/60 rounded-lg p-1.5 border border-slate-800/80">
            <img
              src={tag.image}
              alt={tag.name}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
            />
          </div>

          {/* Tag Info */}
          <h3 className="text-lg font-black text-white mt-2">{tag.name}</h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${typeConfig.badge}`}>
              {tag.type}
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              <span>Năng lượng: {tag.energy}</span>
            </span>
          </div>

          {/* Current Quantity Badge */}
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-xs font-bold text-slate-300">
            Hiện bạn đang có: <span className="text-emerald-400 font-mono font-black text-sm">x{tag.quantity} thẻ</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => {
              sounds.playClick();
              onScanAnother();
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span>Quét Thêm Thẻ</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 border border-purple-400/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Xem Bộ Sưu Tập</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
