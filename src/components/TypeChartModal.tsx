import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Swords, 
  Shield, 
  Zap, 
  Sparkles, 
  Grid3X3, 
  Search,
  ArrowRight,
  Info,
  Flame,
  Layers,
  Target,
  Trophy,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Globe
} from 'lucide-react';
import { 
  POKEMON_TYPES, 
  PokemonTypeId, 
  PokemonTypeInfo, 
  getEffectiveness, 
  getAttackingProfile, 
  getDefendingProfile,
  normalizePokemonType,
  MatchupEffectiveness,
  formatTypeName
} from '../utils/typeMatchupData';
import { MezastarTag } from '../types';
import { INITIAL_MEZASTAR_TAGS, TYPE_COLORS } from '../data/tagsData';
import { sounds } from '../utils/soundEffects';

interface TypeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: PokemonTypeId | null;
  initialTagId?: string | null;
  tags?: MezastarTag[];
  typeLanguage?: 'en' | 'vi';
  onToggleTypeLanguage?: () => void;
}

type ViewTab = 'tags' | 'lookup' | 'battle' | 'matrix';
type TagMatchupMode = 'attacking' | 'defending' | 'duel';
type EffectivenessFilter = 'all' | 'super' | 'not_very' | 'no_effect' | 'normal';

export const TypeChartModal: React.FC<TypeChartModalProps> = ({
  isOpen,
  onClose,
  initialType = 'Water',
  initialTagId = null,
  tags = INITIAL_MEZASTAR_TAGS,
  typeLanguage = 'en',
  onToggleTypeLanguage,
}) => {
  // Active Tab
  const [activeTab, setActiveTab] = useState<ViewTab>(initialTagId ? 'tags' : 'tags');
  
  // Tag Matchup State
  const [selectedTagId, setSelectedTagId] = useState<string>(initialTagId || '1-2-001');
  const [tagMatchupMode, setTagMatchupMode] = useState<TagMatchupMode>('attacking');
  const [tagSearchQuery, setTagSearchQuery] = useState<string>('');
  const [tagGradeFilter, setTagGradeFilter] = useState<number | 'all'>('all');
  const [effectivenessFilter, setEffectivenessFilter] = useState<EffectivenessFilter>('super');
  const [duelOpponentTagId, setDuelOpponentTagId] = useState<string>('1-2-002');

  // Type Lookup state
  const [selectedType, setSelectedType] = useState<PokemonTypeId>(initialType || 'Water');
  
  // Battle simulator state
  const [attackerType, setAttackerType] = useState<PokemonTypeId>('Fire');
  const [defenderType, setDefenderType] = useState<PokemonTypeId>('Grass');

  // Matrix interactive highlight state
  const [hoveredCell, setHoveredCell] = useState<{ attacker: PokemonTypeId; defender: PokemonTypeId } | null>(null);

  // Sync initial props if changed
  useEffect(() => {
    if (initialTagId) {
      setSelectedTagId(initialTagId);
      setActiveTab('tags');
    }
    if (initialType) {
      setSelectedType(initialType);
    }
  }, [initialTagId, initialType, isOpen]);

  // Helper to format type names according to typeLanguage
  const getTypeName = (typeVal: { nameEn: string; nameVi?: string } | string | PokemonTypeId | undefined | null): string => {
    if (!typeVal) return '';
    if (typeof typeVal === 'object' && typeVal !== null && 'nameEn' in typeVal) {
      return typeLanguage === 'vi' ? (typeVal.nameVi || typeVal.nameEn) : typeVal.nameEn;
    }
    return formatTypeName(typeVal as string, typeLanguage);
  };

  // Master roster of all tags
  const allTags = useMemo(() => {
    return tags && tags.length > 0 ? tags : INITIAL_MEZASTAR_TAGS;
  }, [tags]);

  // Selected Active Pokémon Tag
  const activeTag = useMemo(() => {
    return allTags.find((t) => t.id === selectedTagId) || allTags[0] || INITIAL_MEZASTAR_TAGS[0];
  }, [allTags, selectedTagId]);

  // Duel Opponent Tag
  const opponentTag = useMemo(() => {
    return allTags.find((t) => t.id === duelOpponentTagId) || allTags[1] || INITIAL_MEZASTAR_TAGS[1];
  }, [allTags, duelOpponentTagId]);

  // Normalized types for the active tag
  const activeTagMoveType = useMemo(() => {
    return normalizePokemonType(activeTag.moveType || activeTag.type);
  }, [activeTag]);

  const activeTagDefType = useMemo(() => {
    return normalizePokemonType(activeTag.type);
  }, [activeTag]);

  // Filtered tag picker list for searching/selecting active tag
  const selectableTags = useMemo(() => {
    return allTags.filter((t) => {
      if (tagGradeFilter !== 'all' && t.grade !== tagGradeFilter) return false;
      if (tagSearchQuery.trim()) {
        const q = tagSearchQuery.toLowerCase().trim();
        const matchName = t.name.toLowerCase().includes(q);
        const matchId = t.id.toLowerCase().includes(q);
        const matchType = t.type.toLowerCase().includes(q);
        const matchMove = (t.moveName || '').toLowerCase().includes(q);
        return matchName || matchId || matchType || matchMove;
      }
      return true;
    });
  }, [allTags, tagGradeFilter, tagSearchQuery]);

  // Comprehensive Matchup Calculations across all tags in the roster
  const tagMatchupList = useMemo(() => {
    return allTags.map((targetTag) => {
      const targetMoveType = normalizePokemonType(targetTag.moveType || targetTag.type);
      const targetDefType = normalizePokemonType(targetTag.type);

      // When activeTag attacks targetTag:
      const attackEffectiveness = getEffectiveness(activeTagMoveType, targetDefType);

      // When targetTag attacks activeTag:
      const defenseEffectiveness = getEffectiveness(targetMoveType, activeTagDefType);

      return {
        tag: targetTag,
        targetMoveType,
        targetDefType,
        attackEffectiveness,
        defenseEffectiveness,
      };
    });
  }, [allTags, activeTagMoveType, activeTagDefType]);

  // Filtered Matchups based on current mode & effectiveness filter
  const displayedTagMatchups = useMemo(() => {
    return tagMatchupList.filter((item) => {
      const eff = tagMatchupMode === 'attacking' ? item.attackEffectiveness : item.defenseEffectiveness;
      if (effectivenessFilter === 'all') return true;
      return eff === effectivenessFilter;
    });
  }, [tagMatchupList, tagMatchupMode, effectivenessFilter]);

  // Matchup counts for badges
  const matchupCounts = useMemo(() => {
    const counts = {
      super: 0,
      normal: 0,
      not_very: 0,
      no_effect: 0,
      total: tagMatchupList.length,
    };
    tagMatchupList.forEach((item) => {
      const eff = tagMatchupMode === 'attacking' ? item.attackEffectiveness : item.defenseEffectiveness;
      if (eff in counts) {
        counts[eff as keyof typeof counts]++;
      }
    });
    return counts;
  }, [tagMatchupList, tagMatchupMode]);

  if (!isOpen) return null;

  // Type lookup info
  const currentTypeInfo = POKEMON_TYPES.find((t) => t.id === selectedType) || POKEMON_TYPES[0];
  const attackingProfile = getAttackingProfile(selectedType);
  const defendingProfile = getDefendingProfile(selectedType);

  // Battle simulator calculation
  const battleEffectiveness = getEffectiveness(attackerType, defenderType);
  const attInfo = POKEMON_TYPES.find((t) => t.id === attackerType)!;
  const defInfo = POKEMON_TYPES.find((t) => t.id === defenderType)!;

  // Duel calculation between activeTag and opponentTag
  const duelActiveToOpponentEff = getEffectiveness(
    activeTagMoveType,
    normalizePokemonType(opponentTag.type)
  );
  const duelOpponentToActiveEff = getEffectiveness(
    normalizePokemonType(opponentTag.moveType || opponentTag.type),
    activeTagDefType
  );

  const renderEffectivenessBadge = (eff: MatchupEffectiveness, mode: 'attacking' | 'defending' = 'attacking') => {
    switch (eff) {
      case 'super':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-950/90 border border-red-500/70 text-red-300 text-[11px] font-black shadow-xs shadow-red-900/40">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>{mode === 'attacking' ? '🔴 Siêu Hiệu Quả (x2.0)' : '⚠️ Bị Khắc Chế (Nhận x2.0)'}</span>
          </span>
        );
      case 'not_very':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950/90 border border-blue-500/60 text-blue-300 text-[11px] font-bold shadow-xs">
            <span className="text-blue-400 font-bold">▲</span>
            <span>{mode === 'attacking' ? '🔺 Kém Hiệu Quả (x0.5)' : '🛡️ Kháng Đòn (Nhận x0.5)'}</span>
          </span>
        );
      case 'no_effect':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-[11px] font-bold">
            <span className="text-slate-500 font-bold">✕</span>
            <span>{mode === 'attacking' ? '❌ Vô Hiệu (x0.0)' : '🛡️ Miễn Nhiễm (Nhận x0.0)'}</span>
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium">
            <span>⚪ Bình Thường (x1.0)</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[94vh]"
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
                <span>Bảng Tương Khắc Hệ Mezastar</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold tracking-wider">
                  Set 2 VN
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Phân tích khắc hệ chiêu thức tấn công & phòng thủ của từng thẻ Pokémon
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleTypeLanguage && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onToggleTypeLanguage();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase transition-all cursor-pointer"
                title="Chuyển đổi ngôn ngữ tên hệ (English / Tiếng Việt)"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[11px]">
                  <span className={typeLanguage === 'en' ? 'text-cyan-300 font-black' : 'text-slate-500'}>EN</span>
                  <span className="text-slate-600 mx-0.5">/</span>
                  <span className={typeLanguage === 'vi' ? 'text-amber-300 font-black' : 'text-slate-500'}>VI</span>
                </span>
              </button>
            )}

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
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            <button
              id="tab-tag-matchups"
              onClick={() => {
                sounds.playClick();
                setActiveTab('tags');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'tags'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Khắc Hệ Theo Thẻ Meza</span>
            </button>

            <button
              id="tab-type-lookup"
              onClick={() => {
                sounds.playClick();
                setActiveTab('lookup');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'lookup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Tra Cứu 18 Hệ</span>
            </button>

            <button
              id="tab-type-battle"
              onClick={() => {
                sounds.playClick();
                setActiveTab('battle');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
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
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <strong className="text-red-400 font-bold">🔴 Siêu hiệu quả (x2)</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-400 font-bold">▲</span>
              <strong className="text-blue-400 font-bold">🔺 Kém hiệu quả (x0.5)</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500 font-bold">✕</span>
              <strong className="text-slate-400 font-bold">❌ Vô hiệu (x0)</strong>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* =========================================================================
              TAB 1: KHẮC HỆ THEO THẺ MEZA (TAG-SPECIFIC MATCHUP ROSTER)
             ========================================================================= */}
          {activeTab === 'tags' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Section 1: Active Tag Selector & Hero Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Col: Tag Picker & Search (5 cols) */}
                <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>Chọn Thẻ Meza Muốn Xem Khắc Hệ:</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {selectableTags.length} thẻ
                    </span>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Tìm tên Pokémon, mã thẻ (1-2-001)..."
                      value={tagSearchQuery}
                      onChange={(e) => setTagSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Grade Filter Chips */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      onClick={() => { sounds.playClick(); setTagGradeFilter('all'); }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        tagGradeFilter === 'all'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => { sounds.playClick(); setTagGradeFilter(6); }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        tagGradeFilter === 6
                          ? 'bg-purple-600 text-white font-black ring-1 ring-purple-400'
                          : 'bg-slate-900 text-purple-400 hover:text-purple-300 border border-purple-900/40'
                      }`}
                    >
                      6★ Superstar
                    </button>
                    <button
                      onClick={() => { sounds.playClick(); setTagGradeFilter(5); }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        tagGradeFilter === 5
                          ? 'bg-yellow-500 text-slate-950 font-black ring-1 ring-yellow-300'
                          : 'bg-slate-900 text-yellow-400 hover:text-yellow-300 border border-yellow-900/40'
                      }`}
                    >
                      5★ Star
                    </button>
                    <button
                      onClick={() => { sounds.playClick(); setTagGradeFilter(4); }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        tagGradeFilter === 4
                          ? 'bg-blue-600 text-white font-black'
                          : 'bg-slate-900 text-blue-400 hover:text-blue-300 border border-blue-900/40'
                      }`}
                    >
                      4★
                    </button>
                    <button
                      onClick={() => { sounds.playClick(); setTagGradeFilter(3); }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        tagGradeFilter === 3
                          ? 'bg-yellow-600 text-white font-black'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      3★
                    </button>
                    <button
                      onClick={() => { sounds.playClick(); setTagGradeFilter(2); }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        tagGradeFilter === 2
                          ? 'bg-emerald-600 text-white font-black'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      2★
                    </button>
                  </div>

                  {/* Scrollable Tag Picker Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                    {selectableTags.map((t) => {
                      const isCurrent = t.id === selectedTagId;
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedTagId(t.id);
                          }}
                          className={`p-1.5 rounded-lg border flex flex-col items-center justify-between cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/50 shadow-md scale-102'
                              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
                            <span className="font-bold">{t.id}</span>
                            <span className={`font-black ${t.grade === 6 ? 'text-purple-400' : t.grade === 5 ? 'text-yellow-400' : 'text-slate-400'}`}>
                              {t.grade}★
                            </span>
                          </div>
                          <div className="w-12 h-10 flex items-center justify-center overflow-hidden my-0.5">
                            <img
                              src={t.image}
                              alt={t.name}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <span className="text-[10px] font-black uppercase text-white truncate w-full text-center mt-1">
                            {t.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Col: Active Pokémon Tag Detailed Profile Card (7 cols) */}
                <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-amber-500/40 p-4 relative overflow-hidden shadow-xl">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    {/* Pokémon Artwork */}
                    <div className="w-28 sm:w-36 aspect-[16/10] bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-inner relative">
                      <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded text-[9px] font-mono font-black">
                        {activeTag.energy}⚡
                      </div>
                      <img
                        src={activeTag.image}
                        alt={activeTag.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain drop-shadow-md"
                      />
                    </div>

                    {/* Pokémon Info */}
                    <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                      <div className="flex items-center justify-center sm:justify-between flex-wrap gap-1.5">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {activeTag.id} • {activeTag.setCode || 'Set 2'}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          activeTag.grade === 6 
                            ? 'bg-purple-600 text-white shadow-sm shadow-purple-900' 
                            : activeTag.grade === 5 
                            ? 'bg-yellow-500 text-slate-950 font-black' 
                            : 'bg-blue-600 text-white'
                        }`}>
                          {activeTag.grade}★ {activeTag.gradeName}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                        {activeTag.name}
                      </h3>

                      {/* Combat Type Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div className="p-2 rounded-lg bg-slate-900 border border-red-900/30 text-xs">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider flex items-center gap-1">
                            <Flame className="w-3 h-3 text-red-500" />
                            <span>Đòn Đánh Tấn Công:</span>
                          </span>
                          <div className="font-bold text-white mt-0.5 truncate">
                            {activeTag.moveName || 'Tấn công cơ bản'}
                          </div>
                          <div className="text-[11px] font-black text-red-400 mt-0.5">
                            Hệ: {getTypeName(activeTag.moveType || activeTag.typeEn || activeTag.type)}
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-900 border border-blue-900/30 text-xs">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider flex items-center gap-1">
                            <Shield className="w-3 h-3 text-blue-500" />
                            <span>Hệ Bản Thân (Phòng Thủ):</span>
                          </span>
                          <div className="font-bold text-white mt-0.5 truncate">
                            Pokémon {activeTag.name}
                          </div>
                          <div className="text-[11px] font-black text-blue-400 mt-0.5">
                            Hệ: {getTypeName(activeTag.typeEn || activeTag.type)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Mode Switcher (Tấn Công vs Phòng Thủ vs So Kèo Trực Tiếp) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Swords className="w-4 h-4 text-amber-400" />
                      <span>Góc Nhìn Khắc Hệ:</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-700/80">
                    <button
                      id="btn-mode-attacking"
                      onClick={() => {
                        sounds.playClick();
                        setTagMatchupMode('attacking');
                        setEffectivenessFilter('super');
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        tagMatchupMode === 'attacking'
                          ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>🎯 Khi Tôi Tấn Công</span>
                    </button>

                    <button
                      id="btn-mode-defending"
                      onClick={() => {
                        sounds.playClick();
                        setTagMatchupMode('defending');
                        setEffectivenessFilter('super');
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        tagMatchupMode === 'defending'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>🛡️ Khi Đối Thủ Đánh Tôi</span>
                    </button>

                    <button
                      id="btn-mode-duel"
                      onClick={() => {
                        sounds.playClick();
                        setTagMatchupMode('duel');
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        tagMatchupMode === 'duel'
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>⚡ So Kèo 2 Thẻ (Duel)</span>
                    </button>
                  </div>
                </div>

                {/* Subview 1 & 2: Attacking or Defending Filter Chips & List */}
                {tagMatchupMode !== 'duel' ? (
                  <div className="space-y-4">
                    {/* Header Description & Filter Chips */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-xs text-slate-300">
                        {tagMatchupMode === 'attacking' ? (
                          <span>
                            Đòn đánh <strong className="text-red-400 font-bold">{activeTag.moveName || 'Tấn công'} (Hệ {getTypeName(activeTag.moveType || activeTag.typeEn || activeTag.type)})</strong> tác động lên các thẻ Meza khác như thế nào:
                          </span>
                        ) : (
                          <span>
                            Khả năng phòng thủ của Pokémon <strong className="text-blue-400 font-bold">{activeTag.name} (Hệ {getTypeName(activeTag.typeEn || activeTag.type)})</strong> trước chiêu thức của các thẻ Meza khác:
                          </span>
                        )}
                      </div>

                      {/* Filter Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => { sounds.playClick(); setEffectivenessFilter('super'); }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                            effectivenessFilter === 'super'
                              ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400'
                              : 'bg-slate-900 text-red-400 hover:bg-slate-850 border border-red-900/40'
                          }`}
                        >
                          <span>{tagMatchupMode === 'attacking' ? '🔴 Siêu hiệu quả (x2)' : '⚠️ Bị khắc chế (x2)'}</span>
                          <span className="px-1.5 py-0.2 bg-black/40 rounded-full text-[10px] font-mono">
                            {matchupCounts.super}
                          </span>
                        </button>

                        <button
                          onClick={() => { sounds.playClick(); setEffectivenessFilter('not_very'); }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                            effectivenessFilter === 'not_very'
                              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                              : 'bg-slate-900 text-blue-400 hover:bg-slate-850 border border-blue-900/40'
                          }`}
                        >
                          <span>{tagMatchupMode === 'attacking' ? '🔺 Kém hiệu quả (x0.5)' : '🛡️ Kháng đòn (x0.5)'}</span>
                          <span className="px-1.5 py-0.2 bg-black/40 rounded-full text-[10px] font-mono">
                            {matchupCounts.not_very}
                          </span>
                        </button>

                        <button
                          onClick={() => { sounds.playClick(); setEffectivenessFilter('no_effect'); }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                            effectivenessFilter === 'no_effect'
                              ? 'bg-slate-700 text-white shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-850 border border-slate-800'
                          }`}
                        >
                          <span>{tagMatchupMode === 'attacking' ? '❌ Vô hiệu (x0)' : '🛡️ Miễn nhiễm (x0)'}</span>
                          <span className="px-1.5 py-0.2 bg-black/40 rounded-full text-[10px] font-mono">
                            {matchupCounts.no_effect}
                          </span>
                        </button>

                        <button
                          onClick={() => { sounds.playClick(); setEffectivenessFilter('normal'); }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                            effectivenessFilter === 'normal'
                              ? 'bg-slate-600 text-white shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-850 border border-slate-800'
                          }`}
                        >
                          <span>⚪ Bình thường (x1)</span>
                          <span className="px-1.5 py-0.2 bg-black/40 rounded-full text-[10px] font-mono">
                            {matchupCounts.normal}
                          </span>
                        </button>

                        <button
                          onClick={() => { sounds.playClick(); setEffectivenessFilter('all'); }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                            effectivenessFilter === 'all'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-850 border border-slate-800'
                          }`}
                        >
                          Tất cả ({matchupCounts.total})
                        </button>
                      </div>
                    </div>

                    {/* Result Matchup Tag Grid */}
                    {displayedTagMatchups.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                        Không có thẻ nào thuộc nhóm hiệu quả này.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[420px] overflow-y-auto p-1">
                        {displayedTagMatchups.map((item) => {
                          const eff = tagMatchupMode === 'attacking' ? item.attackEffectiveness : item.defenseEffectiveness;
                          const t = item.tag;
                          const isSuper = eff === 'super';
                          const isNotVery = eff === 'not_very';
                          const isNoEffect = eff === 'no_effect';

                          return (
                            <div
                              key={t.id}
                              className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all group relative overflow-hidden ${
                                isSuper
                                  ? 'bg-red-950/25 border-red-800/60 hover:border-red-500 hover:bg-red-950/40'
                                  : isNotVery
                                  ? 'bg-blue-950/20 border-blue-800/50 hover:border-blue-500 hover:bg-blue-950/35'
                                  : isNoEffect
                                  ? 'bg-slate-900/40 border-slate-800'
                                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {/* Header: ID and Grade */}
                              <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                                <span className="font-bold text-slate-400">{t.id}</span>
                                <span className={`font-black ${t.grade === 6 ? 'text-purple-400' : t.grade === 5 ? 'text-yellow-400' : 'text-slate-400'}`}>
                                  {t.grade}★
                                </span>
                              </div>

                              {/* Thumbnail */}
                              <div className="w-full aspect-[16/10] bg-slate-950/90 rounded-lg p-1 flex items-center justify-center overflow-hidden relative">
                                <img
                                  src={t.image}
                                  alt={t.name}
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.2 rounded text-[8px] font-mono text-amber-300">
                                  {t.energy}⚡
                                </div>
                              </div>

                              {/* Name & Types */}
                              <div className="mt-2 text-center">
                                <h4 className="font-black text-xs uppercase text-white truncate">
                                  {t.name}
                                </h4>
                                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                  Hệ: <strong className="text-slate-200">{getTypeName(t.typeEn || t.type)}</strong>
                                </div>
                              </div>

                              {/* Matchup Badge */}
                              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-center">
                                {renderEffectivenessBadge(eff, tagMatchupMode)}
                              </div>

                              {/* Quick Action Button to Switch to this tag */}
                              <button
                                onClick={() => {
                                  sounds.playClick();
                                  setSelectedTagId(t.id);
                                }}
                                className="mt-2 w-full py-1 rounded bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Xem Khắc Hệ Thẻ Này
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Subview 3: 1-vs-1 Tag Clash / Duel Simulator */
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>
                        Mô phỏng đọ sức trực tiếp 1-vs-1 giữa 2 thẻ Pokémon Mezastar: xem đồng thời mức sát thương 2 chiều khi đánh nhau tại máy game!
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                      {/* Left: Player's Tag (5 cols) */}
                      <div className="md:col-span-5 p-4 rounded-xl bg-slate-900 border border-amber-500/50 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black uppercase text-amber-400">Thẻ Của Bạn (Player 1)</span>
                          <span className="font-mono text-slate-400 font-bold">{activeTag.id}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-20 h-16 bg-slate-950 rounded-lg p-1 flex items-center justify-center shrink-0">
                            <img src={activeTag.image} alt={activeTag.name} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div>
                            <h4 className="font-black text-sm uppercase text-white">{activeTag.name}</h4>
                            <div className="text-xs text-slate-300 mt-0.5">
                              Đòn: <strong className="text-red-400">{activeTag.moveName || 'Tấn công'}</strong>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Hệ đòn: <span className="font-bold text-red-300">{activeTag.moveType || activeTag.typeEn || activeTag.type}</span> | Hệ thủ: <span className="font-bold text-blue-300">{activeTag.typeEn || activeTag.type}</span>
                            </div>
                          </div>
                        </div>

                        {/* Damage Output to Opponent */}
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Sát thương gây ra lên {opponentTag.name}:
                          </span>
                          <div>{renderEffectivenessBadge(duelActiveToOpponentEff, 'attacking')}</div>
                        </div>
                      </div>

                      {/* Center: VS Badge (1 col) */}
                      <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center font-black text-xs text-white shadow-lg">
                          VS
                        </div>
                      </div>

                      {/* Right: Opponent's Tag (5 cols) */}
                      <div className="md:col-span-5 p-4 rounded-xl bg-slate-900 border border-cyan-500/50 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black uppercase text-cyan-400">Thẻ Đối Thủ (Opponent)</span>
                          {/* Dropdown to change opponent */}
                          <select
                            value={duelOpponentTagId}
                            onChange={(e) => {
                              sounds.playClick();
                              setDuelOpponentTagId(e.target.value);
                            }}
                            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-cyan-400 font-bold"
                          >
                            {allTags.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.id} - {t.name} ({t.grade}★)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-20 h-16 bg-slate-950 rounded-lg p-1 flex items-center justify-center shrink-0">
                            <img src={opponentTag.image} alt={opponentTag.name} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div>
                            <h4 className="font-black text-sm uppercase text-white">{opponentTag.name}</h4>
                            <div className="text-xs text-slate-300 mt-0.5">
                              Đòn: <strong className="text-red-400">{opponentTag.moveName || 'Tấn công'}</strong>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Hệ đòn: <span className="font-bold text-red-300">{getTypeName(opponentTag.moveType || opponentTag.typeEn || opponentTag.type)}</span> | Hệ thủ: <span className="font-bold text-blue-300">{getTypeName(opponentTag.typeEn || opponentTag.type)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Damage Output to Player */}
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Sát thương {opponentTag.name} đánh trả bạn:
                          </span>
                          <div>{renderEffectivenessBadge(duelOpponentToActiveEff, 'attacking')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: TRA CỨU 18 HỆ (1-TYPE PROFILE LOOKUP)
             ========================================================================= */}
          {activeTab === 'lookup' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Type Selection Palette */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
                  Chọn 1 trong 18 hệ Pokémon để tra cứu chi tiết:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
                  {POKEMON_TYPES.map((type) => {
                    const isSelected = type.id === selectedType;
                    return (
                      <button
                        key={type.id}
                        id={`btn-type-select-${type.id}`}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedType(type.id);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                          isSelected
                            ? `${type.bgColor} text-white ring-2 ring-white/80 shadow-lg scale-105 z-10`
                            : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span className="text-base mb-0.5">{type.iconSymbol}</span>
                        <span className="text-[11px] uppercase tracking-tight">{getTypeName(type)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Type Card Banner */}
              <div className={`p-4 sm:p-5 rounded-2xl ${currentTypeInfo.bgColor} text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4`}>
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-black/20 flex items-center justify-center text-3xl shadow-inner">
                    {currentTypeInfo.iconSymbol}
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-white/80">
                      Pokémon Type Profile
                    </span>
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      Hệ {getTypeName(currentTypeInfo)}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xs px-4 py-2 rounded-xl text-xs">
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>Chuẩn Tương Khắc Arcade Mezastar</span>
                </div>
              </div>

              {/* Attacking & Defending Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Attacking Box */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-red-400 border-b border-slate-800 pb-2">
                    <Flame className="w-5 h-5" />
                    <h4 className="font-black text-sm uppercase tracking-wider">
                      Khi Tấn Công (Chiêu Thức Hệ {getTypeName(currentTypeInfo)})
                    </h4>
                  </div>

                  {/* Super Effective (x2) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-red-400 flex items-center gap-1">
                        🔴 Siêu Hiệu Quả (x2.0 sát thương):
                      </span>
                      <span className="text-slate-400 font-mono">({attackingProfile.supers.length} hệ)</span>
                    </div>

                    {attackingProfile.supers.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {attackingProfile.supers.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              sounds.playClick();
                              setSelectedType(t.id);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${t.bgColor} text-white shadow hover:scale-105 transition-transform cursor-pointer`}
                          >
                            {t.iconSymbol} {getTypeName(t)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Không có hệ nào chịu x2 sát thương</p>
                    )}
                  </div>

                  {/* Not Very Effective (x0.5) */}
                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-400 flex items-center gap-1">
                        🔺 Kém Hiệu Quả (x0.5 sát thương):
                      </span>
                      <span className="text-slate-400 font-mono">({attackingProfile.notVeries.length} hệ)</span>
                    </div>

                    {attackingProfile.notVeries.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {attackingProfile.notVeries.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              sounds.playClick();
                              setSelectedType(t.id);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${t.bgColor} text-white/90 shadow hover:scale-105 transition-transform cursor-pointer`}
                          >
                            {t.iconSymbol} {getTypeName(t)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Không có hệ nào</p>
                    )}
                  </div>

                  {/* No Effect (x0) */}
                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-400 flex items-center gap-1">
                        ❌ Gần Như Vô Hiệu (x0.0 sát thương):
                      </span>
                      <span className="text-slate-400 font-mono">({attackingProfile.noEffects.length} hệ)</span>
                    </div>

                    {attackingProfile.noEffects.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {attackingProfile.noEffects.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              sounds.playClick();
                              setSelectedType(t.id);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${t.bgColor} text-white/80 shadow hover:scale-105 transition-transform cursor-pointer`}
                          >
                            {t.iconSymbol} {getTypeName(t)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Không có hệ nào miễn nhiễm</p>
                    )}
                  </div>
                </div>

                {/* Defending Box */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-2">
                    <Shield className="w-5 h-5" />
                    <h4 className="font-black text-sm uppercase tracking-wider">
                      Khi Phòng Thủ (Pokémon Hệ {getTypeName(currentTypeInfo)})
                    </h4>
                  </div>

                  {/* Weaknesses (Takes x2) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        ⚠️ Điểm Yếu (Bị đánh x2.0 sát thương):
                      </span>
                      <span className="text-slate-400 font-mono">({defendingProfile.weaknesses.length} hệ)</span>
                    </div>

                    {defendingProfile.weaknesses.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {defendingProfile.weaknesses.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              sounds.playClick();
                              setSelectedType(t.id);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${t.bgColor} text-white shadow hover:scale-105 transition-transform cursor-pointer`}
                          >
                            {t.iconSymbol} {getTypeName(t)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-400 font-bold">Không có điểm yếu!</p>
                    )}
                  </div>

                  {/* Resistances (Takes x0.5) */}
                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        🛡️ Kháng Đòn (Chỉ nhận x0.5 sát thương):
                      </span>
                      <span className="text-slate-400 font-mono">({defendingProfile.resistances.length} hệ)</span>
                    </div>

                    {defendingProfile.resistances.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {defendingProfile.resistances.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              sounds.playClick();
                              setSelectedType(t.id);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${t.bgColor} text-white/90 shadow hover:scale-105 transition-transform cursor-pointer`}
                          >
                            {t.iconSymbol} {getTypeName(t)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Không kháng hệ nào</p>
                    )}
                  </div>

                  {/* Immunities (Takes x0) */}
                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-400 flex items-center gap-1">
                        ✨ Miễn Nhiễm Hoàn Toàn (Nhận x0.0):
                      </span>
                      <span className="text-slate-400 font-mono">({defendingProfile.immunities.length} hệ)</span>
                    </div>

                    {defendingProfile.immunities.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {defendingProfile.immunities.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              sounds.playClick();
                              setSelectedType(t.id);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${t.bgColor} text-white shadow hover:scale-105 transition-transform cursor-pointer`}
                          >
                            {t.iconSymbol} {getTypeName(t)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Không có hệ miễn nhiễm</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: SO KÈO ĐẤU (VS BATTLE SIMULATOR)
             ========================================================================= */}
          {activeTab === 'battle' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {/* Attacker Box */}
                <div className="md:col-span-5 p-4 rounded-xl bg-slate-950 border border-red-900/40 space-y-3">
                  <div className="flex items-center justify-between text-xs text-red-400 font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-red-500" />
                      <span>Hệ Đòn Đánh (Tấn Công):</span>
                    </span>
                    <span>{getTypeName(attInfo)}</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {POKEMON_TYPES.map((t) => (
                      <button
                        key={`att-${t.id}`}
                        onClick={() => {
                          sounds.playClick();
                          setAttackerType(t.id);
                        }}
                        className={`p-1.5 rounded-lg text-center text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          t.id === attackerType
                            ? `${t.bgColor} text-white ring-2 ring-red-400 shadow scale-105`
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-sm">{t.iconSymbol}</div>
                        <div className="truncate">{getTypeName(t)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* VS Center Marker */}
                <div className="md:col-span-1 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-blue-600 flex items-center justify-center font-black text-xs text-white shadow-lg">
                    VS
                  </div>
                </div>

                {/* Defender Box */}
                <div className="md:col-span-5 p-4 rounded-xl bg-slate-950 border border-blue-900/40 space-y-3">
                  <div className="flex items-center justify-between text-xs text-blue-400 font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>Hệ Pokémon (Phòng Thủ):</span>
                    </span>
                    <span>{getTypeName(defInfo)}</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {POKEMON_TYPES.map((t) => (
                      <button
                        key={`def-${t.id}`}
                        onClick={() => {
                          sounds.playClick();
                          setDefenderType(t.id);
                        }}
                        className={`p-1.5 rounded-lg text-center text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          t.id === defenderType
                            ? `${t.bgColor} text-white ring-2 ring-blue-400 shadow scale-105`
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-sm">{t.iconSymbol}</div>
                        <div className="truncate">{getTypeName(t)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clash Result Showcase */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 text-center space-y-3 shadow-2xl">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-widest">
                  Kết Quả Tương Khắc Chiến Đấu
                </span>

                <div className="flex items-center justify-center gap-3 text-lg sm:text-xl font-black">
                  <span className={`px-3 py-1 rounded-lg ${attInfo.bgColor} text-white`}>
                    {attInfo.iconSymbol} {getTypeName(attInfo)}
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-500" />
                  <span className={`px-3 py-1 rounded-lg ${defInfo.bgColor} text-white`}>
                    {defInfo.iconSymbol} {getTypeName(defInfo)}
                  </span>
                </div>

                <div className="pt-2">
                  {renderEffectivenessBadge(battleEffectiveness)}
                </div>

                <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed pt-1">
                  {battleEffectiveness === 'super' && (
                    <span className="text-red-300">
                      🔥 <strong>Rất tuyệt vời!</strong> Đòn đánh hệ <strong>{getTypeName(attInfo)}</strong> sẽ gây sát thương gấp <strong>2.0 lần</strong> lên Pokémon hệ <strong>{getTypeName(defInfo)}</strong>. Hãy ưu tiên dùng thẻ này khi đối đầu tại máy Mezastar!
                    </span>
                  )}
                  {battleEffectiveness === 'not_very' && (
                    <span className="text-blue-300">
                      ⚠️ <strong>Cảnh báo:</strong> Đối thủ kháng đòn! Đòn đánh chỉ gây <strong>0.5 lần</strong> sát thương. Nên đổi Pokémon có hệ khắc chế khác.
                    </span>
                  )}
                  {battleEffectiveness === 'no_effect' && (
                    <span className="text-slate-400">
                      ❌ <strong>Vô hiệu!</strong> Đòn đánh gần như không gây tổn hại nào (0 sát thương). Tránh dùng đòn này đối đầu trực tiếp.
                    </span>
                  )}
                  {battleEffectiveness === 'normal' && (
                    <span className="text-slate-300">
                      ⚪ Đòn đánh gây sát thương tiêu chuẩn <strong>1.0 lần</strong>.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: MA TRẬN TOÀN BỘ 18x18 (FULL INTERACTIVE GRID)
             ========================================================================= */}
          {activeTab === 'matrix' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    <strong className="text-red-400">Hàng ngang:</strong> Hệ đòn tấn công • <strong className="text-blue-400">Cột dọc:</strong> Hệ Pokémon phòng thủ. Nhấp vào ô bất kỳ để mở mô phỏng trận đấu!
                  </span>
                </div>
              </div>

              {/* 18x18 Grid Table Container */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl shadow-inner bg-slate-950">
                <table className="w-full border-collapse text-center text-[10px]">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 sticky top-0 z-20">
                      <th className="p-2 border-b border-r border-slate-800 text-left font-mono font-bold text-slate-500 bg-slate-950 min-w-[70px]">
                        Tấn công ➔<br />Phòng thủ ⬇
                      </th>
                      {POKEMON_TYPES.map((att) => (
                        <th
                          key={`th-${att.id}`}
                          className="p-1 border-b border-r border-slate-800 min-w-[32px] max-w-[36px] font-bold"
                          title={`Hệ Tấn Công: ${getTypeName(att)}`}
                        >
                          <div className={`py-1 rounded text-white ${att.bgColor} text-[9px] truncate`}>
                            {getTypeName(att).slice(0, 3)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {POKEMON_TYPES.map((def) => (
                      <tr key={`row-${def.id}`} className="hover:bg-slate-900/60">
                        {/* Defender Header Cell */}
                        <th
                          className="p-1.5 border-b border-r border-slate-800 text-left font-bold text-white bg-slate-900/90 whitespace-nowrap sticky left-0 z-10"
                          title={`Hệ Phòng Thủ: ${getTypeName(def)}`}
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{def.iconSymbol}</span>
                            <span className="text-[10px] text-blue-300">{getTypeName(def)}</span>
                          </div>
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
                              title={`${att.nameEn} (Tấn công) vs ${def.nameEn} (Phòng thủ): ${
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
                      Tấn công: {getTypeName(POKEMON_TYPES.find((t) => t.id === hoveredCell.attacker))}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-bold text-blue-400">
                      Phòng thủ: {getTypeName(POKEMON_TYPES.find((t) => t.id === hoveredCell.defender))}
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
