import React from 'react';
import { CollectionStats } from '../types';
import { 
  Camera, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Download, 
  Repeat,
  Layers,
  Award,
  Zap,
  Star,
  Key,
  Swords
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderStatsProps {
  stats: CollectionStats;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenScanner: () => void;
  onMockScan: () => void;
  onOpenTradeCenter: () => void;
  onOpenBackup: () => void;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  onOpenTypeChart: () => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  stats,
  isMuted,
  onToggleMute,
  onOpenScanner,
  onMockScan,
  onOpenTradeCenter,
  onOpenBackup,
  hasApiKey,
  onOpenApiKeyModal,
  onOpenTypeChart,
}) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 shadow-xl sticky top-0 z-40">
      {/* Top ambient highlight line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-blue-500 to-cyan-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        {/* Navigation & Header Main Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            <div className="flex items-center gap-3">
              {/* Pokéball Emblem Logo */}
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-b from-red-600 to-red-500 border-2 border-white flex items-center justify-center shadow-lg shadow-red-950/60 overflow-hidden shrink-0">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-slate-950" />
                <div className="w-3.5 h-3.5 bg-white rounded-full border-2 border-slate-950 z-10 flex items-center justify-center">
                  <div className="w-1 h-1 bg-slate-900 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase text-white flex items-center gap-1.5">
                    <span>MezaMaster</span>
                    <span className="text-red-500">VN</span>
                  </h1>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-mono font-bold tracking-wider uppercase border border-red-800/60">
                    Set 2
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                  Vietnam Collector Edition
                </p>
              </div>
            </div>

            {/* Mobile Sound Mute */}
            <button
              id="btn-mute-mobile"
              onClick={onToggleMute}
              className="lg:hidden p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>

          {/* Collection Status Metric Bar */}
          <div className="flex items-center gap-4 sm:gap-6 bg-slate-950/70 px-4 py-2 rounded-xl border border-slate-800 w-full lg:w-auto justify-between sm:justify-start">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Đã Sưu Tập
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-white">{stats.totalUniqueTags}</span>
                <span className="text-slate-500 text-xs font-mono font-semibold">/ {stats.totalCatalogTags}</span>
              </div>
            </div>

            <div className="w-24 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden shrink-0">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                {stats.completionPercentage}%
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                Hoàn Thành
              </span>
            </div>
          </div>

          {/* Action Tools: Camera Scanner, Mock Scan, Trade Center, Backup */}
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {/* Capture / Scan Camera Button */}
            <button
              id="btn-open-camera-scanner"
              onClick={() => {
                sounds.playClick();
                onOpenScanner();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-red-950/50 border border-red-400/30 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Quét Thẻ AI</span>
            </button>

            {/* Mock Scan Test Button */}
            <button
              id="btn-mock-scan"
              onClick={onMockScan}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-lg border border-slate-700 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              title="Quét thử ngẫu nhiên 1 thẻ"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Quét Thử</span>
            </button>

            {/* Trade Hub */}
            <button
              id="btn-open-trade-center"
              onClick={() => {
                sounds.playClick();
                onOpenTradeCenter();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs uppercase tracking-wider rounded-lg border border-slate-700 transition-all active:scale-95 whitespace-nowrap relative cursor-pointer"
              title="Sổ giao lưu thẻ trùng"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Giao Lưu</span>
              {stats.duplicateCount > 0 && (
                <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-cyan-500 text-slate-950 font-mono">
                  {stats.duplicateCount}
                </span>
              )}
            </button>

            {/* Type Matchup Chart (Bảng Tương Khắc Hệ) */}
            <button
              id="btn-open-type-chart"
              onClick={() => {
                sounds.playClick();
                onOpenTypeChart();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-950/80 to-blue-950/80 hover:from-red-900/80 hover:to-blue-900/80 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-lg border border-amber-500/40 transition-all active:scale-95 whitespace-nowrap shadow-sm cursor-pointer"
              title="Mở Bảng Tương Khắc Hệ (18 hệ Pokémon)"
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Khắc Hệ</span>
            </button>

            {/* API Key Settings Button */}
            <button
              id="btn-open-api-key-modal"
              onClick={() => {
                sounds.playClick();
                onOpenApiKeyModal();
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                hasApiKey 
                  ? 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border-amber-600/40' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={hasApiKey ? "Gemini API Key đã lưu (Nhấp để đổi)" : "Chưa cài API Key (Nhấp để nhập)"}
            >
              <Key className={`w-3.5 h-3.5 ${hasApiKey ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="text-xs font-bold uppercase tracking-wider">API Key</span>
              <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-500'}`} />
            </button>

            {/* Backup JSON */}
            <button
              id="btn-open-backup"
              onClick={() => {
                sounds.playClick();
                onOpenBackup();
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95 cursor-pointer"
              title="Sao lưu & Khôi phục dữ liệu JSON"
              aria-label="Backup"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Desktop Sound Mute */}
            <button
              id="btn-mute-desktop"
              onClick={onToggleMute}
              className="hidden lg:flex p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95 cursor-pointer"
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Breakdown Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-slate-800/80">
          {/* Metric 1: Total Owned */}
          <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tổng Thẻ</p>
                <div className="text-sm font-black text-white font-mono">{stats.totalOwnedTags} thẻ</div>
              </div>
            </div>
            {stats.duplicateCount > 0 && (
              <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                +{stats.duplicateCount} dư
              </span>
            )}
          </div>

          {/* Metric 2: 6★ Superstar */}
          <div className="bg-slate-950/60 rounded-lg p-2.5 border border-purple-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-purple-950/90 border border-purple-500/40 flex items-center justify-center text-purple-300 font-black text-xs">
                6★
              </div>
              <div>
                <p className="text-[9px] font-bold text-purple-300 uppercase tracking-wider">Superstar (6★)</p>
                <div className="text-sm font-black text-purple-200 font-mono">
                  {stats.superstarOwned} <span className="text-xs text-purple-400/60">/ {stats.superstarTotal}</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-purple-400">
              {Math.round((stats.superstarOwned / stats.superstarTotal) * 100)}%
            </span>
          </div>

          {/* Metric 3: 5★ Star */}
          <div className="bg-slate-950/60 rounded-lg p-2.5 border border-yellow-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-yellow-950/90 border border-yellow-500/40 flex items-center justify-center text-yellow-300 font-black text-xs">
                5★
              </div>
              <div>
                <p className="text-[9px] font-bold text-yellow-400 uppercase tracking-wider">Star (5★)</p>
                <div className="text-sm font-black text-yellow-200 font-mono">
                  {stats.starOwned} <span className="text-xs text-yellow-500/60">/ {stats.starTotal}</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-yellow-400">
              {Math.round((stats.starOwned / stats.starTotal) * 100)}%
            </span>
          </div>

          {/* Metric 4: 2-4★ Regular */}
          <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-black text-xs">
                ★
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Thường & Promo</p>
                <div className="text-sm font-black text-slate-200 font-mono">
                  {stats.regularOwned} <span className="text-xs text-slate-500">/ {stats.regularTotal}</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              {Math.round((stats.regularOwned / stats.regularTotal) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
