import React, { useState, useRef } from 'react';
import { MezastarTag } from '../types';
import { Download, Upload, Trash2, X, Check, AlertTriangle, FileJson, Copy } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: MezastarTag[];
  onImportData: (importedTags: MezastarTag[]) => void;
  onResetCollection: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  tags,
  onImportData,
  onResetCollection,
}) => {
  if (!isOpen) return null;

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Export collection to JSON file
  const handleExport = () => {
    sounds.playClick();
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      appName: "Pokemon Mezastar VN Collector",
      totalTags: tags.length,
      tags: tags.map((t) => ({
        id: t.id,
        name: t.name,
        grade: t.grade,
        quantity: t.quantity,
        notes: t.notes || "",
        isFavorite: t.isFavorite || false,
      })),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pokemon_mezastar_vn_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import collection from JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        let importedList: any[] = [];
        if (Array.isArray(parsed)) {
          importedList = parsed;
        } else if (parsed && Array.isArray(parsed.tags)) {
          importedList = parsed.tags;
        } else {
          throw new Error("Định dạng file JSON không đúng cấu trúc bộ sưu tập Mezastar.");
        }

        // Merge quantities with current catalog
        const updated = tags.map((t) => {
          const matched = importedList.find((imp) => imp.id === t.id);
          if (matched) {
            return {
              ...t,
              quantity: typeof matched.quantity === 'number' ? matched.quantity : t.quantity,
              notes: typeof matched.notes === 'string' ? matched.notes : t.notes,
              isFavorite: typeof matched.isFavorite === 'boolean' ? matched.isFavorite : t.isFavorite,
            };
          }
          return t;
        });

        onImportData(updated);
        setImportStatus('Khôi phục bộ sưu tập thành công!');
        sounds.playSuperstarFanfare();
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 2000);
      } catch (err: any) {
        setImportStatus('Lỗi: ' + (err.message || 'Không thể đọc file JSON'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Sao Lưu & Khôi Phục Dữ Liệu
              </h2>
              <p className="text-xs text-slate-400">
                Lưu trữ bộ sưu tập an toàn hoặc đồng bộ sang máy khác
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {importStatus && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Action 1: Export */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Xuất File JSON (Export)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Tải xuống toàn bộ số lượng thẻ và ghi chú dưới dạng file .json
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Tải JSON</span>
            </button>
          </div>

          {/* Action 2: Import */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Nhập File JSON (Import)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Đọc file sao lưu trước đó để cập nhật lại danh sách thẻ
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-950/50 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              <span>Chọn File</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Action 3: Reset */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-red-950/60 mt-4">
            {!showResetConfirm ? (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Đặt lại bộ sưu tập về 0 thẻ</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Xóa toàn bộ số lượng thẻ đã lưu trên thiết bị
                  </p>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 font-bold text-xs rounded-xl border border-red-800 transition-colors cursor-pointer"
                >
                  Đặt lại
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
                  <span>Bạn có chắc chắn muốn xóa toàn bộ dữ liệu thẻ đã sưu tập?</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={() => {
                      sounds.playDecrement();
                      onResetCollection();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
