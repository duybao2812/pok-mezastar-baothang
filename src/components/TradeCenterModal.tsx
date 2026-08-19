import React, { useState } from 'react';
import { MezastarTag } from '../types';
import { TYPE_COLORS } from '../data/tagsData';
import { X, Copy, Check, Repeat, Sparkles, MessageSquare, ArrowUpDown } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TradeCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: MezastarTag[];
  onSelectTag: (tag: MezastarTag) => void;
}

export const TradeCenterModal: React.FC<TradeCenterModalProps> = ({
  isOpen,
  onClose,
  tags,
  onSelectTag,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  // Filter duplicate tags (quantity >= 2)
  const duplicateTags = tags.filter((tag) => tag.quantity >= 2);
  const totalDuplicateSpares = duplicateTags.reduce((sum, tag) => sum + (tag.quantity - 1), 0);

  // Generate formatted text for sharing
  const generateTradeText = () => {
    if (duplicateTags.length === 0) {
      return "Hiện tại mình chưa có thẻ Pokémon Mezastar nào bị trùng!";
    }

    const superstars = duplicateTags.filter((t) => t.grade === 6);
    const stars = duplicateTags.filter((t) => t.grade === 5);
    const regulars = duplicateTags.filter((t) => t.grade <= 4);

    let text = `🎮 [POKÉMON MEZASTAR VN - DANH SÁCH THẺ TRÙNG CẦN GIAO LƯU/TRADE]\n`;
    text += `📅 Cập nhật: ${new Date().toLocaleDateString('vi-VN')}\n`;
    text += `Tổng số thẻ dư sẵn sàng đổi: ${totalDuplicateSpares} thẻ\n\n`;

    if (superstars.length > 0) {
      text += `🌟 SUPERSTAR 6★ (Thẻ Đen):\n`;
      superstars.forEach((t) => {
        text += `  • [${t.id}] ${t.name} (Hệ ${t.type}, Power ${t.energy}) - Dư x${t.quantity - 1}\n`;
      });
      text += `\n`;
    }

    if (stars.length > 0) {
      text += `⭐ STAR 5★ (Thẻ Đỏ):\n`;
      stars.forEach((t) => {
        text += `  • [${t.id}] ${t.name} (Hệ ${t.type}) - Dư x${t.quantity - 1}\n`;
      });
      text += `\n`;
    }

    if (regulars.length > 0) {
      text += `🔹 THẺ 2-4★ / PROMO:\n`;
      regulars.forEach((t) => {
        text += `  • [${t.id}] ${t.name} - Dư x${t.quantity - 1}\n`;
      });
      text += `\n`;
    }

    text += `👉 Anh em huấn luyện viên Mezastar ai có nhu cầu giao lưu inbox mình nhé!`;
    return text;
  };

  const handleCopyTradeList = () => {
    sounds.playTradeChime();
    const tradeText = generateTradeText();
    navigator.clipboard.writeText(tradeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="h-2 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Sổ Giao Lưu Thẻ Trùng (Trade Hub)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-bold">
                  {totalDuplicateSpares} thẻ dư
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tự động tổng hợp các thẻ có số lượng x2 trở lên để mang đi trao đổi
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {duplicateTags.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">Chưa có thẻ nào bị trùng (x2+)</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Khi bạn quét hoặc cộng số lượng thẻ lên từ 2 trở lên, thẻ sẽ tự động xuất hiện tại đây để bạn tiện trao đổi với bạn bè.
              </p>
            </div>
          ) : (
            <>
              {/* Quick Copy Banner */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">
                      Tạo bài đăng giao lưu Facebook / Zalo tự động
                    </p>
                    <p className="text-[11px] text-slate-400">
                      1 chạm sao chép toàn bộ danh sách thẻ dư kèm ID và thông số để đăng bài tìm đối tác đổi thẻ.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopyTradeList}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-900/40 border border-cyan-400/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-950" />
                      <span>Đã Sao Chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-950" />
                      <span>Sao Chép Bài Đăng</span>
                    </>
                  )}
                </button>
              </div>

              {/* Duplicate Tags List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {duplicateTags.map((tag) => {
                  const isSuperstar = tag.grade === 6;
                  const isStar = tag.grade === 5;
                  const spareCount = tag.quantity - 1;

                  return (
                    <div
                      key={tag.id}
                      onClick={() => {
                        sounds.playClick();
                        onSelectTag(tag);
                      }}
                      className="bg-slate-950/70 hover:bg-slate-950 p-3 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center gap-3 cursor-pointer group"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-16 h-11 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-1 relative shrink-0 overflow-hidden">
                        <img
                          src={tag.image}
                          alt={tag.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                        <span className={`absolute top-0 right-0 text-[8px] font-black px-1 rounded-bl ${
                          isSuperstar ? 'bg-purple-600 text-white' : isStar ? 'bg-yellow-500 text-slate-950' : 'bg-blue-600 text-white'
                        }`}>
                          {tag.grade}★
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-400">{tag.id}</span>
                          <h4 className="text-xs sm:text-sm font-black text-white truncate">{tag.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Hệ {tag.type} | Năng lượng {tag.energy}
                        </p>
                      </div>

                      {/* Trade Badge */}
                      <div className="text-right shrink-0">
                        <span className="inline-block px-2 py-1 bg-cyan-950/80 border border-cyan-500/50 rounded-xl text-xs font-black text-cyan-300">
                          Dư +{spareCount}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Tổng x{tag.quantity}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
