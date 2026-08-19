import React from 'react';
import { GradeFilterOption, SortOption } from '../types';
import { Search, X, SlidersHorizontal, Sparkles, Star, CheckCircle, Copy, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface FilterBarProps {
  gradeFilter: GradeFilterOption;
  onGradeFilterChange: (grade: GradeFilterOption) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    all: number;
    superstar: number;
    star: number;
    regular: number;
    promo: number;
    owned: number;
    duplicates: number;
    unowned: number;
  };
}

const ELEMENT_TYPES = [
  "Tất cả",
  "Nước",
  "Lửa",
  "Cỏ",
  "Điện",
  "Rồng",
  "Tiên",
  "Siêu Linh",
  "Giác Đấu",
  "Băng",
  "Thép",
  "Đá",
  "Đất",
  "Bóng Tối",
  "Ma",
  "Bay",
  "Độc",
  "Thường"
];

export const FilterBar: React.FC<FilterBarProps> = ({
  gradeFilter,
  onGradeFilterChange,
  selectedType,
  onTypeChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  counts,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-2 space-y-2.5">
      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            id="input-search-tags"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên Pokémon (Kyogre, Lucario...), mã thẻ (1-2-001)..."
            className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => {
                sounds.playClick();
                onSearchChange('');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="select-sort-by" className="text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
            <span>Sắp xếp:</span>
          </label>
          <select
            id="select-sort-by"
            value={sortBy}
            onChange={(e) => {
              sounds.playClick();
              onSortChange(e.target.value as SortOption);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer font-sans"
          >
            <option value="id">Theo Mã Thẻ (1-2-001...)</option>
            <option value="grade-desc">Cấp Sao Giảm Dần (6★ → 2★)</option>
            <option value="energy-desc">Năng Lượng Meza Cao Nhất</option>
            <option value="name-asc">Tên Pokémon (A - Z)</option>
            <option value="quantity-desc">Số Lượng Sở Hữu Nhiều Nhất</option>
          </select>
        </div>
      </div>

      {/* Grade Quick Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {/* All */}
        <button
          id="filter-tab-all"
          onClick={() => {
            sounds.playClick();
            onGradeFilterChange('all');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            gradeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-md font-bold'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <span>Tất cả</span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${gradeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {counts.all}
          </span>
        </button>

        {/* 6★ Superstar */}
        <button
          id="filter-tab-6-superstar"
          onClick={() => {
            sounds.playClick();
            onGradeFilterChange('6');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            gradeFilter === '6'
              ? 'bg-purple-600 text-white shadow-md font-bold'
              : 'bg-slate-900/80 text-purple-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Sparkles className="w-3 h-3 text-yellow-300" />
          <span>Superstar (6★)</span>
          <span className="px-1.5 py-0.2 rounded bg-purple-950 text-[10px] font-mono text-purple-200">
            {counts.superstar}
          </span>
        </button>

        {/* 5★ Star */}
        <button
          id="filter-tab-5-star"
          onClick={() => {
            sounds.playClick();
            onGradeFilterChange('5');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            gradeFilter === '5'
              ? 'bg-yellow-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900/80 text-yellow-400 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Star className="w-3 h-3" />
          <span>Star (5★)</span>
          <span className="px-1.5 py-0.2 rounded bg-yellow-950 text-[10px] font-mono text-yellow-200">
            {counts.star}
          </span>
        </button>

        {/* 2-4★ Regular */}
        <button
          id="filter-tab-regular"
          onClick={() => {
            sounds.playClick();
            onGradeFilterChange('2-4');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            gradeFilter === '2-4'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>Thường (2-4★)</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
            {counts.regular}
          </span>
        </button>

        {/* Promo */}
        <button
          id="filter-tab-promo"
          onClick={() => {
            sounds.playClick();
            onGradeFilterChange('special');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            gradeFilter === 'special'
              ? 'bg-slate-200 text-slate-950 font-black'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>Promo</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
            {counts.promo}
          </span>
        </button>

        {/* Owned */}
        <button
          id="filter-tab-owned"
          onClick={() => {
            sounds.playClick();
            onGradeFilterChange('owned');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            gradeFilter === 'owned'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900/80 text-emerald-400 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <CheckCircle className="w-3 h-3 text-emerald-400" />
          <span>Đã có</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-[10px] font-mono text-emerald-200">
            {counts.owned}
          </span>
        </button>

        {/* Duplicates */}
        <button
          id="filter-tab-duplicates"
          onClick={() => {
            sounds.playClick();
            onGradeFilterChange('duplicates');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            gradeFilter === 'duplicates'
              ? 'bg-cyan-600 text-slate-950 font-black'
              : 'bg-slate-900/80 text-cyan-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Copy className="w-3 h-3 text-cyan-400" />
          <span>Thẻ trùng (x2+)</span>
          <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-[10px] font-mono text-cyan-300">
            {counts.duplicates}
          </span>
        </button>

        {/* Unowned */}
        <button
          id="filter-tab-unowned"
          onClick={() => {
            sounds.playClick();
            onGradeFilterChange('unowned');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            gradeFilter === 'unowned'
              ? 'bg-slate-700 text-white font-bold'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <HelpCircle className="w-3 h-3" />
          <span>Chưa có</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
            {counts.unowned}
          </span>
        </button>
      </div>

      {/* Elemental Type Pills */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap pr-1">Hệ:</span>
        {ELEMENT_TYPES.map((type) => {
          const isSelected = (type === "Tất cả" && selectedType === "") || selectedType === type;
          return (
            <button
              key={type}
              onClick={() => {
                sounds.playClick();
                onTypeChange(type === "Tất cả" ? "" : type);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
};
