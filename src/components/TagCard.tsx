import React from 'react';
import { MezastarTag } from '../types';
import { TYPE_COLORS } from '../data/tagsData';
import { formatTypeName } from '../utils/typeMatchupData';
import { Plus, Minus, Zap, Eye } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TagCardProps {
  tag: MezastarTag;
  typeLanguage?: 'en' | 'vi';
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onSelectTag: (tag: MezastarTag) => void;
}

export const TagCard: React.FC<TagCardProps> = ({
  tag,
  typeLanguage = 'en',
  onIncrement,
  onDecrement,
  onSelectTag,
}) => {
  const isOwned = tag.quantity > 0;
  const isSuperstar = tag.grade === 6;
  const isStar = tag.grade === 5;
  const isDuplicate = tag.quantity >= 2;

  const displayType = formatTypeName(tag.typeEn || tag.type, typeLanguage);

  const typeConfig = TYPE_COLORS[tag.type] || TYPE_COLORS[tag.typeEn || ''] || {
    bg: "from-slate-700 to-slate-800",
    text: "text-slate-300",
    border: "border-slate-600",
    glow: "rgba(148, 163, 184, 0.4)",
    badge: "bg-slate-700/50 text-slate-200 border-slate-600"
  };

  // Card theme styling according to Grade and ownership
  let cardBorder = "border border-slate-800 bg-slate-900";
  let ribbonBg = "bg-slate-700 text-slate-300";

  if (isOwned) {
    if (isSuperstar) {
      cardBorder = "border-2 border-purple-500 bg-slate-900 shadow-[0_0_15px_rgba(168,85,247,0.35)]";
      ribbonBg = "bg-purple-500 text-white";
    } else if (isStar) {
      cardBorder = "border border-yellow-500 bg-slate-900 shadow-sm";
      ribbonBg = "bg-yellow-500 text-slate-950 font-black";
    } else if (tag.grade === 4) {
      cardBorder = "border border-blue-500/70 bg-slate-900";
      ribbonBg = "bg-blue-600 text-white";
    } else {
      cardBorder = "border border-slate-700 bg-slate-900";
      ribbonBg = "bg-slate-700 text-slate-200";
    }
  }

  return (
    <div
      id={`meza-tag-${tag.id}`}
      className={`relative rounded-xl p-3 transition-all duration-200 flex flex-col justify-between overflow-hidden select-none group ${cardBorder} ${
        !isOwned ? 'grayscale opacity-40 hover:opacity-75 hover:grayscale-0' : 'hover:border-slate-600'
      }`}
    >
      {/* Corner Grade Ribbon */}
      <div 
        className={`absolute -right-5 -top-5 w-14 h-14 rotate-45 flex items-end justify-center pb-1 shadow z-10 ${ribbonBg}`}
      >
        <span className="font-black text-[10px] -rotate-45 tracking-tight">
          {tag.grade}★
        </span>
      </div>

      {/* Card Header: Tag ID & Quantity */}
      <div>
        <div className="flex justify-between items-start mb-1.5 pr-6">
          <span className="text-[10px] font-mono font-bold text-slate-400">
            {tag.id}
          </span>
          {isOwned ? (
            <span 
              className={`text-[10px] font-black px-1.5 py-0.5 rounded font-mono ${
                isDuplicate 
                  ? 'bg-cyan-500 text-slate-950 ring-1 ring-cyan-300' 
                  : 'bg-blue-600 text-white'
              }`}
              title={`Số lượng: x${tag.quantity}`}
            >
              x{tag.quantity}
            </span>
          ) : (
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
              Chưa có
            </span>
          )}
        </div>

        {/* Official Pokémon Meza Tag Artwork */}
        <div 
          onClick={() => {
            sounds.playClick();
            onSelectTag(tag);
          }}
          className="relative w-full aspect-[16/10] rounded-lg bg-slate-950 border border-slate-800/80 p-1 flex items-center justify-center overflow-hidden cursor-pointer group/art"
        >
          {/* Subtle radial aura */}
          <div 
            className="absolute inset-0 opacity-20 group-hover/art:opacity-40 transition-opacity"
            style={{
              background: `radial-gradient(circle, ${typeConfig.glow} 0%, transparent 70%)`
            }}
          />

          <img
            src={tag.image}
            alt={`${tag.name} (${tag.id})`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] transition-transform duration-200 group-hover/art:scale-105"
          />

          {/* Energy badge */}
          <div className="absolute bottom-1 left-1 bg-slate-900/90 border border-slate-700/80 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold text-amber-300 flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 text-amber-400" />
            <span>{tag.energy}</span>
          </div>

          <div className="absolute top-1 left-1 opacity-0 group-hover/art:opacity-100 transition-opacity bg-slate-900/90 text-slate-200 p-0.5 rounded text-[9px]">
            <Eye className="w-3 h-3 text-cyan-400" />
          </div>
        </div>

        {/* Pokémon Name & Subtitle */}
        <div className="mt-2 text-center">
          <h3 
            onClick={() => {
              sounds.playClick();
              onSelectTag(tag);
            }}
            className="font-black text-xs sm:text-sm uppercase text-white truncate cursor-pointer hover:text-cyan-400 transition-colors"
          >
            {tag.name}
          </h3>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className={`text-[9px] font-bold uppercase ${
              isSuperstar ? 'text-purple-400' : isStar ? 'text-yellow-400' : 'text-slate-400'
            }`}>
              {tag.gradeName}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[9px] font-semibold text-slate-400">
              {displayType}
            </span>
          </div>
        </div>
      </div>

      {/* Card Controls: Minus / View / Plus Buttons */}
      <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80">
        <button
          id={`btn-dec-${tag.id}`}
          onClick={(e) => {
            e.stopPropagation();
            if (tag.quantity > 0) {
              sounds.playDecrement();
              onDecrement(tag.id);
            }
          }}
          disabled={tag.quantity === 0}
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 w-7 h-7 rounded flex items-center justify-center text-slate-300 font-bold transition-colors cursor-pointer"
          title="Giảm 1 thẻ"
          aria-label={`Giảm ${tag.name}`}
        >
          <Minus className="w-3 h-3" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            sounds.playClick();
            onSelectTag(tag);
          }}
          className="flex-1 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase transition-colors text-center cursor-pointer"
        >
          Chi Tiết
        </button>

        <button
          id={`btn-inc-${tag.id}`}
          onClick={(e) => {
            e.stopPropagation();
            sounds.playIncrement();
            onIncrement(tag.id);
          }}
          className="bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white w-7 h-7 rounded flex items-center justify-center font-bold transition-colors cursor-pointer"
          title="Thêm 1 thẻ"
          aria-label={`Thêm ${tag.name}`}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
