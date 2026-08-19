import React, { useState } from 'react';
import { 
  X, 
  Swords, 
  Shield, 
  Zap, 
  Sparkles, 
  Grid3X3, 
  HelpCircle,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Volume2
} from 'lucide-react';
import { 
  POKEMON_TYPES, 
  PokemonTypeId, 
  PokemonTypeInfo, 
  getEffectiveness, 
  getAttackingProfile, 
  getDefendingProfile,
  MatchupEffectiveness
} from '../utils/typeMatchupData';
import { sounds } from '../utils/soundEffects';

interface TypeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: PokemonTypeId | null;
}

type ViewTab = 'lookup' | 'battle' | 'matrix';

export const TypeChartModal: React.FC<TypeChartModalProps> = ({
  isOpen,
  onClose,
  initialType = 'Water',
}) => {
  const [activeTab, setActiveTab] = useState<ViewTab>('lookup');
  const [selectedType, setSelectedType] = useState<PokemonTypeId>(initialType || 'Water');
  
  // Battle simulator state
  const [attackerType, setAttackerType] = useState<PokemonTypeId>('Fire');
  const [defenderType, setDefenderType] = useState<PokemonTypeId>('Grass');

  // Matrix interactive highlight state
  const [hoveredCell, setHoveredCell] = useState<{ attacker: PokemonTypeId; defender: PokemonTypeId } | null>(null);

  if (!isOpen) return null;

  const currentTypeInfo = POKEMON_TYPES.find((t) => t.id === selectedType) || POKEMON_TYPES[0];
  const attackingProfile = getAttackingProfile(selectedType);
  const defendingProfile = getDefendingProfile(selectedType);

  // Battle matchup calculation
  const battleEffectiveness = getEffectiveness(attackerType, defenderType);
  const attInfo = POKEMON_TYPES.find((t) => t.id === attackerType)!;
  const defInfo = POKEMON_TYPES.find((t) => t.id === defenderType)!;

  const renderEffectivenessBadge = (eff: MatchupEffectiveness) => {
    switch (eff) {
      case 'super':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-500/60 text-red-300 text-xs font-black shadow-sm shadow-red-900/40">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm animate-pulse" />
            <span>🔴 Siêu Hiệu Quả (x2.0)</span>
          </span>
        );
      case 'not_very':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/60 text-blue-300 text-xs font-black shadow-sm shadow-blue-900/40">
            <span className="text-blue-400 font-bold">▲</span>
            <span>🔺 Không Hiệu Quả Lắm (x0.5)</span>
          </span>
        );
      case 'no_effect':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-xs font-black">
            <span className="text-slate-500 font-bold">✕</span>
            <span>❌ Gần Như Vô Hiệu (x0.0)</span>
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
            <span>⚪ Hiệu Quả Bình Thường (x1.0)</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-blue-600 p-[1px] shadow-lg">
              <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center text-yellow-400">
                <Swords className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-white flex items-center gap-2">
                <span>Bảng Tương Khắc Hệ</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold tracking-wider">
                  Mezastar VN
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tra cứu chiêu thức tấn công & khắc chế phòng thủ theo chuẩn arcade
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              id="tab-type-lookup"
              onClick={() => {
                sounds.playClick();
                setActiveTab('lookup');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'lookup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Tra Cứu Hệ</span>
            </button>

            <button
              id="tab-type-battle"
              onClick={() => {
                sounds.playClick();
                setActiveTab('battle');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'battle'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>So Kèo Đấu (VS)</span>
            </button>

            <button
              id="tab-type-matrix"
              onClick={() => {
                sounds.playClick();
                setActiveTab('matrix');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Ma Trận 18x18</span>
            </button>
          </div>

          {/* Quick Legend Indicator */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <strong className="text-red-400 font-bold">🔴 Siêu hiệu quả (x2)</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-400 font-bold">▲</span>
              <strong className="text-blue-400 font-bold">🔺 Kém hiệu quả (x0.5)</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500 font-bold">✕</span>
              <strong className="text-slate-400 font-bold">❌ Gần như vô hiệu (x0)</strong>
            </span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: TRA CỨU HỆ TẬP TRUNG */}
          {activeTab === 'lookup' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Type Selection Palette */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
                  1. Chọn một hệ Pokémon để xem chi tiết khắc chế:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
                  {POKEMON_TYPES.map((type) => {
                    const isSelected = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        id={`btn-select-type-${type.id}`}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedType(type.id);
                        }}
                        className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl font-bold text-xs transition-all border cursor-pointer active:scale-95 ${
                          isSelected
                            ? `${type.bgColor} text-white border-white shadow-lg ring-2 ring-blue-400/80 scale-105 z-10`
                            : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <span className="text-sm">{type.iconSymbol}</span>
                        <span className="truncate">{type.nameVi}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Type Card Banner */}
              <div className={`p-4 sm:p-5 rounded-2xl border ${currentTypeInfo.borderColor} ${currentTypeInfo.bgColor}/25 bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-14 h-14 rounded-2xl ${currentTypeInfo.bgColor} border border-white/20 flex items-center justify-center text-3xl shadow-inner`}>
                    {currentTypeInfo.iconSymbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
                        Hệ {currentTypeInfo.nameVi}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 font-mono font-bold border border-slate-700">
                        {currentTypeInfo.nameEn}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      {currentTypeInfo.description}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setAttackerType(selectedType);
                      setActiveTab('battle');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Lấy làm Tấn Công</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setDefenderType(selectedType);
                      setActiveTab('battle');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Lấy làm Phòng Thủ</span>
                  </button>
                </div>
              </div>

              {/* 2-Column Grid: Attacking vs Defending Profile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Column 1: Khi TẤN CÔNG (Hệ chiêu thức) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-red-900/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-red-900/30 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-500/40 flex items-center justify-center text-red-400">
                        <Swords className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase text-white tracking-wide">
                          Khi Tấn Công (Chiêu Thức)
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          Sát thương gây ra lên Pokémon đối thủ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Super Effective (2x) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-pulse" />
                        🔴 Siêu Hiệu Quả (x2.0 Sát Thương):
                      </span>
                      <span className="text-xs font-mono font-bold text-red-300">
                        {attackingProfile.supers.length} hệ
                      </span>
                    </div>
                    {attackingProfile.supers.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {attackingProfile.supers.map((type) => (
                          <span
                            key={type.id}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${type.bgColor} text-white font-bold text-xs shadow-sm border border-white/20`}
                          >
                            <span>{type.iconSymbol}</span>
                            <span>{type.nameVi}</span>
                            <span className="text-[10px] opacity-80">({type.nameEn})</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Không có hệ nào chịu x2 sát thương</p>
                    )}
                  </div>

                  {/* Normal (1x) */}
                  <div className="space-y-2 pt-1 border-t border-slate-850">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        ⚪ Hiệu Quả Bình Thường (x1.0):
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {attackingProfile.normals.length} hệ
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {attackingProfile.normals.map((type) => (
                        <span
                          key={type.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-850 text-slate-300 text-[11px] border border-slate-700/60"
                        >
                          <span>{type.iconSymbol}</span>
                          <span>{type.nameVi}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Not Very Effective (0.5x) */}
                  <div className="space-y-2 pt-1 border-t border-slate-850">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-blue-400 font-bold">▲</span>
                        🔺 Không Hiệu Quả Lắm (x0.5 Sát Thương):
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-300">
                        {attackingProfile.notVeries.length} hệ
                      </span>
                    </div>
                    {attackingProfile.notVeries.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {attackingProfile.notVeries.map((type) => (
                          <span
                            key={type.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/70 text-blue-200 border border-blue-600/40 text-xs font-medium"
                          >
                            <span>{type.iconSymbol}</span>
                            <span>{type.nameVi}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Không có hệ nào kháng đòn</p>
                    )}
                  </div>

                  {/* No Effect (0x) */}
                  {attackingProfile.noEffects.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-slate-850">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="text-slate-400 font-bold">✕</span>
                          ❌ Gần Như Không Hiệu Quả (x0.0):
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {attackingProfile.noEffects.length} hệ
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {attackingProfile.noEffects.map((type) => (
                          <span
                            key={type.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-700 text-xs font-medium"
                          >
                            <span>{type.iconSymbol}</span>
                            <span>{type.nameVi} (Không tác dụng)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Column 2: Khi PHÒNG THỦ (Hệ của Pokémon) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-blue-900/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-blue-900/30 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase text-white tracking-wide">
                          Khi Phòng Thủ (Hệ Bản Thân)
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          Sát thương nhận vào khi bị tấn công
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Weaknesses (Take 2x Damage) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        🔴 Bị Khắc Chế (Nhận x2.0 Sát Thương Từ):
                      </span>
                      <span className="text-xs font-mono font-bold text-red-300">
                        {defendingProfile.weaknesses.length} hệ
                      </span>
                    </div>
                    {defendingProfile.weaknesses.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {defendingProfile.weaknesses.map((type) => (
                          <span
                            key={type.id}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${type.bgColor} text-white font-bold text-xs shadow-sm border border-white/20`}
                          >
                            <span>{type.iconSymbol}</span>
                            <span>{type.nameVi}</span>
                            <span className="text-[10px] opacity-80">({type.nameEn})</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-400 italic">Không có điểm yếu!</p>
                    )}
                  </div>

                  {/* Resistances (Take 0.5x Damage) */}
                  <div className="space-y-2 pt-1 border-t border-slate-850">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        🔺 Kháng Đòn (Chỉ Nhận x0.5 Sát Thương Từ):
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-300">
                        {defendingProfile.resistances.length} hệ
                      </span>
                    </div>
                    {defendingProfile.resistances.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {defendingProfile.resistances.map((type) => (
                          <span
                            key={type.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-200 border border-emerald-600/40 text-xs font-medium"
                          >
                            <span>{type.iconSymbol}</span>
                            <span>{type.nameVi}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Không có kháng đòn</p>
                    )}
                  </div>

                  {/* Immunities (Take 0x Damage) */}
                  {defendingProfile.immunities.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-slate-850">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          ❌ Miễn Nhiễm Hoàn Toàn (Nhận x0.0 Từ):
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {defendingProfile.immunities.length} hệ
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {defendingProfile.immunities.map((type) => (
                          <span
                            key={type.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-200 border border-cyan-500/40 text-xs font-bold shadow-sm"
                          >
                            <span>{type.iconSymbol}</span>
                            <span>{type.nameVi}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Normal Defense (1x) */}
                  <div className="space-y-2 pt-1 border-t border-slate-850">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        ⚪ Nhận Sát Thương Bình Thường (x1.0):
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {defendingProfile.normals.length} hệ
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {defendingProfile.normals.map((type) => (
                        <span
                          key={type.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-850 text-slate-300 text-[11px] border border-slate-700/60"
                        >
                          <span>{type.iconSymbol}</span>
                          <span>{type.nameVi}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SO KÈO ĐẤU TAY ĐÔI (MATCHUP VS SIMULATOR) */}
          {activeTab === 'battle' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
                <h3 className="text-base font-black uppercase text-white tracking-wide flex items-center justify-center gap-2">
                  <Swords className="w-5 h-5 text-red-500" />
                  <span>Mô Phỏng Tương Khắc Đấu Trận Mezastar</span>
                </h3>
                <p className="text-xs text-slate-400 max-w-xl mx-auto">
                  Chọn <strong>Hệ Chiêu Thức Tấn Công</strong> của bạn và <strong>Hệ Pokémon Đối Thủ</strong> để kiểm tra mức độ hiệu quả và nhận lời khuyên chiến thuật!
                </p>
              </div>

              {/* 2-Side Selector with VS in Middle */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {/* Left: Attacker Type Selector */}
                <div className="md:col-span-5 p-4 rounded-2xl bg-slate-950 border border-red-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-red-500" />
                      <span>Hệ Chiêu Thức Tấn Công</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Bạn</span>
                  </div>

                  <div className={`p-3 rounded-xl ${attInfo.bgColor} text-white font-black text-center flex items-center justify-center gap-2 shadow-lg border border-white/20`}>
                    <span className="text-2xl">{attInfo.iconSymbol}</span>
                    <span className="text-lg uppercase tracking-wide">Hệ {attInfo.nameVi}</span>
                    <span className="text-xs opacity-80 font-normal font-mono">({attInfo.nameEn})</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {POKEMON_TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          sounds.playClick();
                          setAttackerType(t.id);
                        }}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          attackerType === t.id
                            ? `${t.bgColor} text-white border-white shadow scale-105`
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-center">{t.iconSymbol}</div>
                        <div className="text-[10px] truncate text-center">{t.nameVi}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Center: VS Badge */}
                <div className="md:col-span-1 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xl border-2 border-slate-900">
                    VS
                  </div>
                </div>

                {/* Right: Defender Type Selector */}
                <div className="md:col-span-5 p-4 rounded-2xl bg-slate-950 border border-blue-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>Hệ Pokémon Phòng Thủ</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Đối Thủ</span>
                  </div>

                  <div className={`p-3 rounded-xl ${defInfo.bgColor} text-white font-black text-center flex items-center justify-center gap-2 shadow-lg border border-white/20`}>
                    <span className="text-2xl">{defInfo.iconSymbol}</span>
                    <span className="text-lg uppercase tracking-wide">Hệ {defInfo.nameVi}</span>
                    <span className="text-xs opacity-80 font-normal font-mono">({defInfo.nameEn})</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {POKEMON_TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          sounds.playClick();
                          setDefenderType(t.id);
                        }}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          defenderType === t.id
                            ? `${t.bgColor} text-white border-white shadow scale-105`
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-center">{t.iconSymbol}</div>
                        <div className="text-[10px] truncate text-center">{t.nameVi}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Matchup Outcome Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4 shadow-2xl">
                <div className="inline-block">
                  {renderEffectivenessBadge(battleEffectiveness)}
                </div>

                <div className="max-w-xl mx-auto space-y-2">
                  <h4 className="text-lg font-black text-white">
                    {battleEffectiveness === 'super' && (
                      <span className="text-red-400">🔥 Đòn Đánh Cực Kỳ Uy Lực! Gấp Đôi Sát Thương (x2)</span>
                    )}
                    {battleEffectiveness === 'normal' && (
                      <span className="text-slate-200">⚔️ Đòn Đánh Trúng Đích Chuẩn Xác (x1)</span>
                    )}
                    {battleEffectiveness === 'not_very' && (
                      <span className="text-blue-400">🛡️ Bị Giảm Sát Thương! Đối Thủ Kháng Đòn (x0.5)</span>
                    )}
                    {battleEffectiveness === 'no_effect' && (
                      <span className="text-slate-400">🚫 Hoàn Toàn Vô Hiệu! Đòn Đánh Không Gây Sát Thương (x0)</span>
                    )}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {battleEffectiveness === 'super' && 
                      `Chiêu thức hệ ${attInfo.nameVi} khắc chế trực tiếp hệ ${defInfo.nameVi}. Trong ván đấu Mezastar, hãy tung chiêu này để kích hoạt đòn Super Effective và rút cạn thanh máu Boss nhanh chóng!`}
                    {battleEffectiveness === 'normal' && 
                      `Chiêu thức hệ ${attInfo.nameVi} gây lượng sát thương tiêu chuẩn lên hệ ${defInfo.nameVi}.`}
                    {battleEffectiveness === 'not_very' && 
                      `Hệ ${defInfo.nameVi} có khả năng kháng đòn hệ ${attInfo.nameVi}. Bạn nên cân nhắc đổi thẻ Pokémon có hệ khắc chế khác để tối ưu hóa lượng năng lượng (Energy) gây ra!`}
                    {battleEffectiveness === 'no_effect' && 
                      `Chiêu thức hệ ${attInfo.nameVi} hoàn toàn không có tác dụng lên Pokémon hệ ${defInfo.nameVi}. Hãy lập tức chọn chiêu thức hoặc Pokémon khác!`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MA TRẬN 18x18 TOÀN DIỆN (FULL MATRIX VIEW) */}
          {activeTab === 'matrix' && (
            <div className="space-y-4 animate-fadeIn">
              {/* How to read instructions */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-400" />
                    <span>Cách Dùng Bảng Tương Khắc Hệ:</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    <strong>1.</strong> Tìm hệ chiêu thức tấn công ở <strong>hàng màu đỏ</strong> phía trên.<br />
                    <strong>2.</strong> Tìm hệ Pokémon đối thủ ở <strong>cột màu xanh</strong> bên trái.<br />
                    <strong>3.</strong> Xem ô giao nhau giữa hai hệ để biết mức độ khắc nhau!
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-500/40">
                    🔴 Siêu hiệu quả (2x)
                  </span>
                  <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-500/40">
                    ▲ Không hiệu quả lắm (0.5x)
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-850 text-slate-400 border border-slate-700">
                    ✕ Vô hiệu (0x)
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-500 border border-slate-800">
                    [Trống] Chuẩn (1x)
                  </span>
                </div>
              </div>

              {/* Scrollable 18x18 Matrix Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-2xl bg-slate-950">
                <table className="w-full border-collapse text-center text-xs">
                  {/* Top Red Header Row: Attacking Moves */}
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-30 p-2 bg-slate-950 border-b border-r border-slate-800 min-w-[120px] text-left">
                        <div className="text-[10px] font-bold text-blue-400 uppercase">↓ Phòng Thủ</div>
                        <div className="text-[10px] font-bold text-red-400 uppercase">Tấn Công →</div>
                      </th>
                      {POKEMON_TYPES.map((att) => (
                        <th
                          key={att.id}
                          className={`p-1.5 border-b border-r border-slate-800 min-w-[42px] max-w-[48px] bg-red-950/60 text-red-200 font-bold transition-colors ${
                            hoveredCell?.attacker === att.id ? 'bg-red-800 text-white' : ''
                          }`}
                          title={`Hệ Tấn Công: ${att.nameVi} (${att.nameEn})`}
                        >
                          <div className="text-sm">{att.iconSymbol}</div>
                          <div className="text-[9px] truncate">{att.nameVi}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Body Rows: Defending Pokémon Types */}
                  <tbody>
                    {POKEMON_TYPES.map((def) => (
                      <tr 
                        key={def.id} 
                        className={`transition-colors ${
                          hoveredCell?.defender === def.id ? 'bg-blue-950/40' : 'hover:bg-slate-900/50'
                        }`}
                      >
                        {/* Blue Left Column: Defender Type */}
                        <th
                          className={`sticky left-0 z-20 p-2 border-b border-r border-slate-800 bg-blue-950/70 text-blue-200 font-bold text-left flex items-center gap-1.5 transition-colors ${
                            hoveredCell?.defender === def.id ? 'bg-blue-800 text-white' : ''
                          }`}
                          title={`Hệ Phòng Thủ: ${def.nameVi} (${def.nameEn})`}
                        >
                          <span className="text-sm">{def.iconSymbol}</span>
                          <span className="text-xs truncate">{def.nameVi}</span>
                        </th>

                        {/* Matrix Cells */}
                        {POKEMON_TYPES.map((att) => {
                          const eff = getEffectiveness(att.id, def.id);
                          const isHovered = hoveredCell?.attacker === att.id && hoveredCell?.defender === def.id;

                          return (
                            <td
                              key={`${att.id}-${def.id}`}
                              onMouseEnter={() => setHoveredCell({ attacker: att.id, defender: def.id })}
                              onMouseLeave={() => setHoveredCell(null)}
                              onClick={() => {
                                sounds.playClick();
                                setAttackerType(att.id);
                                setDefenderType(def.id);
                                setActiveTab('battle');
                              }}
                              className={`p-1.5 border-b border-r border-slate-850 font-bold cursor-pointer transition-all ${
                                isHovered 
                                  ? 'ring-2 ring-yellow-400 bg-yellow-950/80 scale-110 z-10' 
                                  : eff === 'super'
                                  ? 'bg-red-950/40 hover:bg-red-900/60'
                                  : eff === 'not_very'
                                  ? 'bg-blue-950/30 hover:bg-blue-900/50'
                                  : eff === 'no_effect'
                                  ? 'bg-slate-900/80 hover:bg-slate-800'
                                  : 'hover:bg-slate-800/40'
                              }`}
                              title={`${att.nameVi} (Tấn công) vs ${def.nameVi} (Phòng thủ): ${
                                eff === 'super' ? 'Siêu hiệu quả (2x)' : eff === 'not_very' ? 'Không hiệu quả lắm (0.5x)' : eff === 'no_effect' ? 'Vô hiệu (0x)' : 'Bình thường (1x)'
                              }`}
                            >
                              {eff === 'super' && (
                                <span className="text-red-400 text-sm font-black drop-shadow">🔴</span>
                              )}
                              {eff === 'not_very' && (
                                <span className="text-blue-400 text-xs font-black">▲</span>
                              )}
                              {eff === 'no_effect' && (
                                <span className="text-slate-500 text-xs font-black">✕</span>
                              )}
                              {eff === 'normal' && (
                                <span className="text-slate-800 text-[10px]">·</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Matrix Live Selection Callout */}
              {hoveredCell && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between text-xs animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-400">
                      Tấn công: {POKEMON_TYPES.find((t) => t.id === hoveredCell.attacker)?.nameVi}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-bold text-blue-400">
                      Phòng thủ: {POKEMON_TYPES.find((t) => t.id === hoveredCell.defender)?.nameVi}
                    </span>
                  </div>
                  <div>
                    {renderEffectivenessBadge(getEffectiveness(hoveredCell.attacker, hoveredCell.defender))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
