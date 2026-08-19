import React, { useState, useEffect, useMemo } from 'react';
import { MezastarTag, GradeFilterOption, SortOption, CollectionStats, ScanResult } from './types';
import { INITIAL_MEZASTAR_TAGS } from './data/tagsData';
import { HeaderStats } from './components/HeaderStats';
import { FilterBar } from './components/FilterBar';
import { TagCard } from './components/TagCard';
import { TagDetailModal } from './components/TagDetailModal';
import { CameraScannerModal } from './components/CameraScannerModal';
import { ScanResultModal } from './components/ScanResultModal';
import { TradeCenterModal } from './components/TradeCenterModal';
import { BackupModal } from './components/BackupModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { sounds } from './utils/soundEffects';
import { HelpCircle } from 'lucide-react';

const STORAGE_KEY = 'POKEMON_MEZASTAR_VN_COLLECTION_V2';
const API_KEY_STORAGE = 'MEZASTAR_GEMINI_KEY';

export default function App() {
  // Saved Gemini API Key state (stored permanently in localStorage)
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem(API_KEY_STORAGE) || '';
    } catch {
      return '';
    }
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Load saved collection or initialize with master catalog
  const [tags, setTags] = useState<MezastarTag[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Array<{ id: string; quantity: number; notes?: string; isFavorite?: boolean }> = JSON.parse(saved);
        return INITIAL_MEZASTAR_TAGS.map((item) => {
          const match = parsed.find((p) => p.id === item.id);
          return match
            ? {
                ...item,
                quantity: match.quantity ?? 0,
                notes: match.notes ?? '',
                isFavorite: match.isFavorite ?? false,
              }
            : item;
        });
      }
    } catch (e) {
      console.warn("Could not load stored collection:", e);
    }
    return INITIAL_MEZASTAR_TAGS;
  });

  // Filters & Sorting state
  const [gradeFilter, setGradeFilter] = useState<GradeFilterOption>('all');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('id');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals state
  const [selectedTag, setSelectedTag] = useState<MezastarTag | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedTagResult, setScannedTagResult] = useState<MezastarTag | null>(null);
  const [isTradeCenterOpen, setIsTradeCenterOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Persist collection state on change
  useEffect(() => {
    try {
      const savePayload = tags.map((t) => ({
        id: t.id,
        quantity: t.quantity,
        notes: t.notes,
        isFavorite: t.isFavorite,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savePayload));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [tags]);

  // Audio mute toggle
  const handleToggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    sounds.setMuted(newMuteState);
    if (!newMuteState) {
      sounds.playClick();
    }
  };

  // Increment tag quantity
  const handleIncrement = (id: string) => {
    setTags((prev) =>
      prev.map((t) => (t.id === id ? { ...t, quantity: t.quantity + 1 } : t))
    );
  };

  // Decrement tag quantity
  const handleDecrement = (id: string) => {
    setTags((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, quantity: Math.max(0, t.quantity - 1) } : t
      )
    );
  };

  // Update tag notes
  const handleUpdateNotes = (id: string, notes: string) => {
    setTags((prev) =>
      prev.map((t) => (t.id === id ? { ...t, notes } : t))
    );
    if (selectedTag && selectedTag.id === id) {
      setSelectedTag((prev) => (prev ? { ...prev, notes } : null));
    }
  };

  // Handle successful Gemini Scan result
  const handleScanSuccess = (scanResult: ScanResult) => {
    setIsScannerOpen(false);

    let matchedTag = tags.find((t) => t.id.toLowerCase() === scanResult.tag_id?.toLowerCase());
    
    if (!matchedTag && scanResult.name) {
      const cleanName = scanResult.name.toLowerCase().trim();
      matchedTag = tags.find((t) => t.name.toLowerCase().includes(cleanName) || cleanName.includes(t.name.toLowerCase()));
    }

    if (matchedTag) {
      handleIncrement(matchedTag.id);
      setScannedTagResult({ ...matchedTag, quantity: matchedTag.quantity + 1 });
    } else {
      alert(`Đã nhận diện: ${scanResult.name} (${scanResult.tag_id}) nhưng không khớp với danh mục Set 2 VN.`);
    }
  };

  // Mock Scan for quick testing
  const handleMockScan = () => {
    const unownedTags = tags.filter((t) => t.quantity === 0);
    const pool = unownedTags.length > 0 ? unownedTags : tags;
    const randomTag = pool[Math.floor(Math.random() * pool.length)];

    handleIncrement(randomTag.id);
    setScannedTagResult({ ...randomTag, quantity: randomTag.quantity + 1 });
  };

  // Reset entire collection
  const handleResetCollection = () => {
    setTags(INITIAL_MEZASTAR_TAGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Import collection from backup
  const handleImportData = (importedTags: MezastarTag[]) => {
    setTags(importedTags);
  };

  // Compute live collection statistics
  const stats: CollectionStats = useMemo(() => {
    const totalOwnedTags = tags.reduce((sum, t) => sum + t.quantity, 0);
    const uniqueOwned = tags.filter((t) => t.quantity > 0);
    const totalUniqueTags = uniqueOwned.length;
    const totalCatalogTags = tags.length;
    const completionPercentage = Math.round((totalUniqueTags / totalCatalogTags) * 100);

    const superstarTags = tags.filter((t) => t.grade === 6);
    const superstarOwned = superstarTags.filter((t) => t.quantity > 0).length;

    const starTags = tags.filter((t) => t.grade === 5);
    const starOwned = starTags.filter((t) => t.quantity > 0).length;

    const regularTags = tags.filter((t) => t.grade <= 4);
    const regularOwned = regularTags.filter((t) => t.quantity > 0).length;

    const duplicateCount = tags.filter((t) => t.quantity >= 2).length;

    return {
      totalOwnedTags,
      totalUniqueTags,
      totalCatalogTags,
      completionPercentage,
      superstarOwned,
      superstarTotal: superstarTags.length,
      starOwned,
      starTotal: starTags.length,
      regularOwned,
      regularTotal: regularTags.length,
      duplicateCount,
    };
  }, [tags]);

  // Compute filter counts
  const filterCounts = useMemo(() => {
    return {
      all: tags.length,
      superstar: tags.filter((t) => t.grade === 6).length,
      star: tags.filter((t) => t.grade === 5).length,
      regular: tags.filter((t) => t.grade === 4 || t.grade === 3 || t.grade === 2).length,
      promo: tags.filter((t) => t.setCode.includes('Promo') || t.gradeName === 'Special Starter').length,
      owned: tags.filter((t) => t.quantity > 0).length,
      duplicates: tags.filter((t) => t.quantity >= 2).length,
      unowned: tags.filter((t) => t.quantity === 0).length,
    };
  }, [tags]);

  // Filtered and Sorted Tag list
  const displayTags = useMemo(() => {
    return tags
      .filter((tag) => {
        if (gradeFilter === '6' && tag.grade !== 6) return false;
        if (gradeFilter === '5' && tag.grade !== 5) return false;
        if (gradeFilter === '2-4' && (tag.grade > 4 || tag.gradeName === 'Special Starter')) return false;
        if (gradeFilter === 'special' && tag.gradeName !== 'Special Starter') return false;
        if (gradeFilter === 'owned' && tag.quantity === 0) return false;
        if (gradeFilter === 'duplicates' && tag.quantity < 2) return false;
        if (gradeFilter === 'unowned' && tag.quantity > 0) return false;

        if (selectedType && tag.type !== selectedType && tag.secondaryType !== selectedType) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = tag.id.toLowerCase().includes(q);
          const matchName = tag.name.toLowerCase().includes(q);
          const matchVnName = tag.vietnameseName?.toLowerCase().includes(q);
          const matchMove = tag.moveName.toLowerCase().includes(q);
          const matchType = tag.type.toLowerCase().includes(q);
          if (!matchId && !matchName && !matchVnName && !matchMove && !matchType) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'id') {
          return a.id.localeCompare(b.id, undefined, { numeric: true });
        }
        if (sortBy === 'grade-desc') {
          if (b.grade !== a.grade) return b.grade - a.grade;
          return b.energy - a.energy;
        }
        if (sortBy === 'energy-desc') {
          return b.energy - a.energy;
        }
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'quantity-desc') {
          return b.quantity - a.quantity;
        }
        return 0;
      });
  }, [tags, gradeFilter, selectedType, searchQuery, sortBy]);

  // API Key persistent update handler
  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    try {
      if (key) {
        localStorage.setItem(API_KEY_STORAGE, key);
      } else {
        localStorage.removeItem(API_KEY_STORAGE);
      }
    } catch (e) {
      console.error("Failed to save API Key:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation & Stats Bar */}
      <HeaderStats
        stats={stats}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenScanner={() => setIsScannerOpen(true)}
        onMockScan={handleMockScan}
        onOpenTradeCenter={() => setIsTradeCenterOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        hasApiKey={!!geminiApiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Filter Bar */}
      <FilterBar
        gradeFilter={gradeFilter}
        onGradeFilterChange={setGradeFilter}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        counts={filterCounts}
      />

      {/* Main Grid Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        {displayTags.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Không tìm thấy thẻ nào phù hợp</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Hãy thử thay đổi bộ lọc hoặc chọn tab "Tất cả" để xem toàn bộ danh mục thẻ Mezastar Việt Nam.
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                setGradeFilter('all');
                setSelectedType('');
                setSearchQuery('');
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded-lg shadow cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {displayTags.map((tag) => (
              <TagCard
                key={tag.id}
                tag={tag}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onSelectTag={(t) => setSelectedTag(t)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer / System Status */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 mt-auto">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            System Ready // Regional Database Active
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          MezaMaster VN • Set 2 Collector Edition
        </div>
      </footer>

      {/* Modals */}
      {selectedTag && (
        <TagDetailModal
          tag={selectedTag}
          onClose={() => setSelectedTag(null)}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onUpdateNotes={handleUpdateNotes}
        />
      )}

      <CameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        onMockScan={handleMockScan}
        apiKey={geminiApiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        savedApiKey={geminiApiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {scannedTagResult && (
        <ScanResultModal
          tag={scannedTagResult}
          onClose={() => setScannedTagResult(null)}
          onScanAnother={() => {
            setScannedTagResult(null);
            setIsScannerOpen(true);
          }}
        />
      )}

      <TradeCenterModal
        isOpen={isTradeCenterOpen}
        onClose={() => setIsTradeCenterOpen(false)}
        tags={tags}
        onSelectTag={(t) => {
          setIsTradeCenterOpen(false);
          setSelectedTag(t);
        }}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        tags={tags}
        onImportData={handleImportData}
        onResetCollection={handleResetCollection}
      />
    </div>
  );
}
