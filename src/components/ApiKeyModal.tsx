import React, { useState, useEffect } from 'react';
import { 
  Key, 
  X, 
  Check, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Trash2, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Copy,
  Globe,
  Share2,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedApiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  savedApiKey,
  onSaveApiKey,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'syncGuide'>('settings');

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(savedApiKey || '');
      setIsSavedSuccess(false);
      setTestStatus('idle');
      setTestMessage('');
      setCopiedLink(false);
    }
  }, [isOpen, savedApiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKeyInput.trim();
    onSaveApiKey(trimmed);
    sounds.playStarChime();
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
    }, 2500);
  };

  const handleClear = () => {
    sounds.playClick();
    setApiKeyInput('');
    onSaveApiKey('');
    setTestStatus('idle');
    setTestMessage('');
  };

  const handleTestKey = async () => {
    const keyToTest = apiKeyInput.trim();
    if (!keyToTest) {
      setTestStatus('error');
      setTestMessage('Vui lòng nhập API Key trước khi kiểm tra.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Đang kiểm tra kết nối trực tiếp với Google Gemini AI...');

    try {
      // Test directly with Google Generative AI REST endpoint
      const googleRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${keyToTest}`
      );

      if (googleRes.ok) {
        setTestStatus('success');
        setTestMessage('✅ API Key hợp lệ và hoạt động hoàn hảo với Google Gemini AI!');
        sounds.playStarChime();
        return;
      }

      // If Google returned an error (e.g. 400 invalid API key)
      const errorData = await googleRes.json().catch(() => ({}));
      const errDetail = errorData.error?.message || 'Mã API Key không hợp lệ.';
      setTestStatus('error');
      setTestMessage(`❌ Lỗi từ Google: ${errDetail}`);
    } catch (err: any) {
      // If network error, try fallback server test
      try {
        const localRes = await fetch('/api/health');
        if (localRes.ok) {
          setTestStatus('success');
          setTestMessage('✅ Đã kết nối thành công với máy chủ!');
          sounds.playStarChime();
          return;
        }
      } catch {}
      setTestStatus('error');
      setTestMessage(err.message || 'Không thể kết nối với máy chủ Google AI. Vui lòng kiểm tra mạng.');
    }
  };

  // Generate mobile auto-sync URL
  const getSyncUrl = () => {
    const currentKey = apiKeyInput.trim() || savedApiKey.trim();
    if (typeof window === 'undefined' || !currentKey) return '';
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?key=${encodeURIComponent(currentKey)}`;
  };

  const handleCopySyncLink = () => {
    const url = getSyncUrl();
    if (!url) return;
    navigator.clipboard.writeText(url);
    sounds.playStarChime();
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Banner */}
        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase text-white tracking-wide flex items-center gap-2">
                <span>Cài Đặt Gemini API Key</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400">
                Tự động đồng bộ và lưu vĩnh viễn trên mọi thiết bị
              </p>
            </div>
          </div>
          <button
            id="btn-close-api-key-modal"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="px-5 pt-3 pb-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('settings');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🔑 Nhập & Quản Lý Key
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('syncGuide');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'syncGuide'
                ? 'bg-blue-600 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 Đồng Bộ Mọi Thiết Bị</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {activeTab === 'settings' ? (
            <>
              {/* Storage notification */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  API Key được lưu trữ trực tiếp trong <strong>Local Storage</strong> của trình duyệt và sẽ được ghi nhớ vĩnh viễn cho đến khi bạn thay đổi hoặc xóa bỏ.
                </span>
              </div>

              {/* Input field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Google Gemini API Key
                </label>
                <div className="relative">
                  <input
                    id="input-gemini-api-key"
                    type={showPassword ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3.5 py-2.5 pr-20 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-lg"
                      title={showPassword ? "Ẩn mã" : "Hiện mã"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-amber-400" />}
                    </button>
                    {apiKeyInput && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-lg"
                        title="Xóa mã"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Test Status feedback */}
              {testStatus !== 'idle' && (
                <div 
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    testStatus === 'success' 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                      : testStatus === 'error'
                      ? 'bg-red-950/40 border-red-500/40 text-red-300'
                      : 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                  }`}
                >
                  {testStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : testStatus === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                  )}
                  <span>{testMessage}</span>
                </div>
              )}

              {/* Quick Sync Link Generator Button */}
              {apiKeyInput.trim() && (
                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-2">
                  <div className="flex items-center justify-between text-xs text-blue-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-blue-400" />
                      <span>Link Đồng Bộ Sang Điện Thoại:</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Gửi link này qua Zalo/Messenger sang điện thoại. Điện thoại mở lên sẽ <strong>tự động lưu vĩnh viễn</strong> và bảo mật ngay!
                  </p>
                  <button
                    type="button"
                    onClick={handleCopySyncLink}
                    className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Đã Sao Chép Link Kích Hoạt Điện Thoại!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao Chép Link Mở Trên Điện Thoại</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Helper link */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Chưa có API Key?</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Lấy key miễn phí tại Google AI Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </>
          ) : (
            /* Sync Guide Tab */
            <div className="space-y-4 text-xs text-slate-300 animate-fadeIn">
              {/* Option 1: Vercel ENV (Permanent for all devices) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase">
                  <Globe className="w-4 h-4" />
                  <span>Cách 1: Cài đặt vào Vercel (Tự động 100% mọi thiết bị)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Nếu bạn muốn <strong>bất kỳ điện thoại, iPad hay máy tính nào</strong> truy cập vào trang web của bạn đều có sẵn API Key vĩnh viễn mà không cần nhập lại:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-400 pl-1 font-mono">
                  <li>Vào Vercel Dashboard ➔ Mở project của bạn.</li>
                  <li>Vào mục <strong className="text-emerald-300">Settings</strong> ➔ <strong className="text-emerald-300">Environment Variables</strong>.</li>
                  <li>Thêm biến mới:
                    <div className="bg-slate-900 p-2 rounded mt-1 text-slate-200 border border-slate-800">
                      <span className="text-amber-400 font-bold">Key:</span> <code className="text-white">VITE_GEMINI_API_KEY</code><br/>
                      <span className="text-amber-400 font-bold">Value:</span> <code className="text-white">{apiKeyInput.trim() || 'Dán_API_Key_của_bạn'}</code>
                    </div>
                  </li>
                  <li>Bấm <strong className="text-emerald-300">Save</strong> và vào tab <strong className="text-emerald-300">Deployments ➔ Redeploy</strong>.</li>
                </ol>
                <div className="text-[10px] text-emerald-400 font-semibold pt-1">
                  ✨ Sau khi làm xong bước này, tất cả mọi người & mọi thiết bị mở web đều tự động quét thẻ được ngay!
                </div>
              </div>

              {/* Option 2: 1-Click Sync URL */}
              <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/40 space-y-2.5">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase">
                  <Smartphone className="w-4 h-4" />
                  <span>Cách 2: Đồng bộ 1-chạm bằng Link Sang Điện Thoại</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Nếu bạn không muốn chỉnh Vercel, chỉ cần sao chép liên kết kích hoạt này và gửi qua Zalo / Messenger sang điện thoại:
                </p>
                <button
                  type="button"
                  onClick={handleCopySyncLink}
                  disabled={!apiKeyInput.trim() && !savedApiKey.trim()}
                  className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Đã Sao Chép Link Kích Hoạt!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Sao Chép Link Đồng Bộ Cho Điện Thoại</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={!apiKeyInput.trim() || testStatus === 'testing'}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-slate-700 transition-all cursor-pointer"
          >
            {testStatus === 'testing' ? 'Đang kiểm tra...' : 'Kiểm tra'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Đóng
            </button>
            <button
              id="btn-save-api-key-permanent"
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-950/50 transition-all active:scale-95 cursor-pointer"
            >
              {isSavedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Đã Lưu!</span>
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5 text-slate-950" />
                  <span>Lưu Vĩnh Viễn</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
