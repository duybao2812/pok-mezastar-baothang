import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  X, 
  FlipHorizontal, 
  Upload, 
  Sparkles, 
  Key, 
  AlertCircle, 
  Loader2,
  Scan
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { ScanResult } from '../types';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scanResult: ScanResult) => void;
  onMockScan: () => void;
  apiKey?: string;
  onOpenApiKeyModal?: () => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  onMockScan,
  apiKey: propApiKey,
  onOpenApiKeyModal,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => propApiKey || localStorage.getItem('MEZASTAR_GEMINI_KEY') || '');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [scanStatusMessage, setScanStatusMessage] = useState<string>('');

  useEffect(() => {
    if (propApiKey !== undefined) {
      setApiKey(propApiKey);
    }
  }, [propApiKey]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedPreview(null);
      setCameraError(null);
      setIsScanning(false);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Trình duyệt không hỗ trợ camera. Vui lòng thử tải ảnh từ thư viện.");
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.warn("Camera access warning:", err);
      setCameraError(err.message || "Không thể mở camera. Vui lòng cấp quyền hoặc tải ảnh trực tiếp.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleToggleFacingMode = () => {
    sounds.playClick();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('MEZASTAR_GEMINI_KEY', key.trim());
  };

  const handleCaptureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      sounds.playScanLaser();
      setIsScanning(true);
      setScanStatusMessage('Đang chụp khung hình...');

      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Không thể khởi tạo canvas");

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPreview(base64Image);

      await executeGeminiScan(base64Image);
    } catch (error: any) {
      console.error("Capture error:", error);
      setIsScanning(false);
      setScanStatusMessage('');
      alert("Lỗi khi chụp ảnh: " + (error.message || "Không xác định"));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playClick();
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setCapturedPreview(base64);
        setIsScanning(true);
        sounds.playScanLaser();
        await executeGeminiScan(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const executeGeminiScan = async (base64Image: string) => {
    try {
      setScanStatusMessage('Google Gemini Vision AI đang nhận diện mã thẻ & Pokémon...');

      // 1. First try local backend API (when running in full-stack mode)
      let scanResult: ScanResult | null = null;
      let usedServer = false;

      try {
        const res = await fetch('/api/scan-tag', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageBase64: base64Image,
            customApiKey: apiKey ? apiKey.trim() : undefined,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            scanResult = json.data;
            usedServer = true;
          }
        }
      } catch (e) {
        // Backend not available (e.g. static hosting on Vercel)
        console.log("Server API not available, falling back to direct client-side Gemini API call:", e);
      }

      // 2. If server API was not available or 404 (e.g. deployed on Vercel as SPA), call Google Gemini API directly!
      if (!usedServer || !scanResult) {
        const activeKey = (apiKey || '').trim();
        if (!activeKey) {
          throw new Error("Chưa cài đặt Gemini API Key. Vui lòng bấm vào nút 'API Key' trên góc phải để nhập mã API Key.");
        }

        const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const promptText = `Analyze this image of a physical Pokémon Mezastar Tag (Meza Tag).
Identify:
1. Tag ID: e.g. "1-2-001" to "1-2-070", or "R-1-1", "R-1-2", "R-1-3".
2. Pokémon Name: e.g. Kyogre, Groudon, Koraidon, Miraidon, Pikachu, Lucario, Reshiram, Zekrom, Kyurem, etc.
3. Grade (2 to 6 stars): 6 (Superstar - black), 5 (Star - red), 4 (blue), 3 (yellow), 2 (green/grey).
4. Special Mechanic: Dynamax, Mega Evolution, Z-Move, Terastal, Double, Chain, None.
5. is_valid_tag: boolean true if a Mezastar tag is present.

Return ONLY a valid JSON object matching this schema:
{
  "is_valid_tag": true,
  "tag_id": "1-2-001",
  "name": "Kyogre",
  "grade": 6,
  "special_mechanic": "None",
  "confidence": 0.95,
  "detected_features": "Black Superstar tag with Kyogre artwork"
}`;

        const CANDIDATE_MODELS = [
          'gemini-3.7-flash',
          'gemini-flash-latest',
          'gemini-3.1-flash-lite',
          'gemini-2.5-flash-preview'
        ];

        let googleRes: Response | null = null;
        let lastErrorMsg = '';

        for (const modelName of CANDIDATE_MODELS) {
          try {
            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${activeKey}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  contents: [
                    {
                      parts: [
                        {
                          inline_data: {
                            mime_type: "image/jpeg",
                            data: cleanBase64,
                          },
                        },
                        {
                          text: promptText,
                        },
                      ],
                    },
                  ],
                  generationConfig: {
                    response_mime_type: "application/json",
                  },
                }),
              }
            );

            if (res.ok) {
              googleRes = res;
              break;
            } else {
              const errBody = await res.json().catch(() => ({}));
              lastErrorMsg = errBody.error?.message || `HTTP ${res.status}`;
              console.warn(`Model ${modelName} failed:`, lastErrorMsg);
              // If error is 404 / model not found / deprecated, continue to next model
              if (res.status === 404 || res.status === 400) {
                continue;
              } else {
                // If it's an API key auth error (e.g. 403 or invalid key), break immediately to show clear message
                break;
              }
            }
          } catch (fetchErr: any) {
            lastErrorMsg = fetchErr.message;
          }
        }

        if (!googleRes || !googleRes.ok) {
          throw new Error(lastErrorMsg || "Không thể kết nối đến dịch vụ Google Gemini AI.");
        }

        const data = await googleRes.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textContent) {
          throw new Error("Không nhận được phản hồi phân tích từ Gemini AI.");
        }

        try {
          scanResult = JSON.parse(textContent);
        } catch {
          // If markdown-wrapped json
          const cleanedJson = textContent.replace(/```json/gi, '').replace(/```/g, '').trim();
          scanResult = JSON.parse(cleanedJson);
        }
      }

      setIsScanning(false);
      setScanStatusMessage('');

      if (scanResult && scanResult.is_valid_tag && scanResult.tag_id) {
        onScanSuccess(scanResult);
      } else {
        alert("Gemini AI không tìm thấy thẻ Pokémon Mezastar hợp lệ trong ảnh. Vui lòng căn chỉnh lại khung ngắm và thử lại.");
        setCapturedPreview(null);
      }
    } catch (error: any) {
      setIsScanning(false);
      setScanStatusMessage('');
      console.error("Scan error:", error);
      alert("Lỗi nhận diện Gemini: " + (error.message || "Kiểm tra kết nối mạng hoặc API Key"));
      setCapturedPreview(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight uppercase text-white flex items-center gap-2">
                <span>Quét Thẻ AI Scanner</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-mono font-bold">
                  Gemini Vision
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setShowKeyConfig(!showKeyConfig);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1 ${
                apiKey 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Cấu hình Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-yellow-400" />
              <span>API Key</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Configuration Drawer */}
        {showKeyConfig && (
          <div className="p-4 bg-slate-950 border-b border-slate-800 animate-fadeIn space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Key className="w-3 h-3 text-yellow-400" />
                <span>Google Gemini API Key</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Tự động lưu localStorage</span>
            </div>
            <div className="flex gap-2">
              <input
                id="input-gemini-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                placeholder="Nhập API Key cá nhân hoặc để trống để dùng Cloud Server..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-blue-400 focus:outline-none focus:border-blue-500 font-mono"
              />
              {apiKey && (
                <button
                  onClick={() => handleSaveApiKey('')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase rounded-lg text-slate-300"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        )}

        {/* Viewfinder Camera Area */}
        <div className="relative flex-1 bg-black aspect-[4/3] flex items-center justify-center overflow-hidden border-b border-slate-800">
          {/* Subtle Grid dots */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {cameraError ? (
            <div className="p-6 text-center max-w-sm space-y-3 relative z-10">
              <AlertCircle className="w-10 h-10 text-yellow-400 mx-auto" />
              <p className="text-xs text-slate-300 font-medium">{cameraError}</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Chọn Ảnh Thẻ</span>
                </button>
                <button
                  onClick={onMockScan}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Quét Thử (Mock)</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {capturedPreview ? (
                <img
                  src={capturedPreview}
                  alt="Captured Tag"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {/* Viewfinder Reticle with Corner Brackets */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                <div className="relative w-72 h-88 border-2 border-dashed border-blue-500/50 rounded-2xl flex items-center justify-center overflow-hidden">
                  {/* Corner Accent Brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />

                  {/* Laser Scan Sweep */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,1)] animate-laser-sweep" />

                  <div className="absolute bottom-3 text-center bg-slate-950/80 px-2.5 py-1 rounded text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                    Căn Chỉnh Thẻ Mezastar Vào Khung
                  </div>
                </div>
              </div>

              {/* AI Processing Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
                  <div className="w-12 h-12 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm font-black uppercase tracking-wider text-white">{scanStatusMessage}</p>
                  <p className="text-[11px] text-blue-400 font-mono">Gemini Vision regional database matching...</p>
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Viewfinder Controls Bar */}
        <div className="p-4 bg-slate-900 flex items-center justify-between gap-3">
          <button
            id="btn-switch-camera"
            onClick={handleToggleFacingMode}
            disabled={isScanning || !!cameraError}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer text-xs font-bold uppercase flex items-center gap-1.5"
            title="Đổi camera"
          >
            <FlipHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Đổi Camera</span>
          </button>

          {/* Primary Shutter Action Button */}
          <button
            id="btn-capture-scan"
            onClick={handleCaptureAndScan}
            disabled={isScanning || !!cameraError}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full shadow-lg shadow-red-900/40 text-xs uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Chụp & Nhận Diện</span>
          </button>

          <button
            id="btn-upload-file"
            onClick={() => {
              sounds.playClick();
              fileInputRef.current?.click();
            }}
            disabled={isScanning}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer text-xs font-bold uppercase flex items-center gap-1.5"
            title="Tải ảnh thẻ từ thiết bị"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Tải Ảnh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
