import React, { useState } from 'react';
import { X, Key, ExternalLink, Check, BookOpen } from 'lucide-react';
import { voice } from '../services/voiceEngine';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKeyInput, setApiKeyInput] = useState(voice.getApiKey());
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    voice.setCustomApiKey(apiKeyInput);
    setSaveStatus(apiKeyInput ? '✓ Đã lưu khóa API AI Studio thành công!' : '✓ Đã dùng khóa cấp sẵn của hệ thống');
    setTimeout(() => {
      setSaveStatus(null);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setApiKeyInput('');
    voice.setCustomApiKey('');
    setSaveStatus('✓ Đã khôi phục cài đặt mặc định');
    setTimeout(() => {
      setSaveStatus(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-[#241334] to-[#14081e] border-2 border-pink-500/60 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <Key className="w-8 h-8 text-amber-300" />
          <div>
            <h3 className="text-base sm:text-lg font-black text-pink-300 font-display uppercase">
              Khóa API Google AI Studio
            </h3>
            <p className="text-xs text-pink-200/80">Giọng đọc nữ Việt Nam Gemini AI</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-2 leading-relaxed">
          Hệ thống tự động sử dụng giọng đọc tiếng Việt mượt mà. Nếu bạn muốn sử dụng mô hình Gemini 2.5 Flash TTS cao cấp với khóa API riêng từ Google AI Studio, hãy lấy miễn phí tại đây:
        </p>

        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white underline font-bold mb-3"
        >
          <span>Lấy khóa API tại Google AI Studio (aistudio.google.com)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Dán Gemini API Key của bạn:
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder="Dán mã khóa AI Studio bắt đầu bằng AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-pink-600 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {saveStatus && (
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> {saveStatus}
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
          >
            Khôi phục mặc định
          </button>
          <button
            onClick={handleSave}
            className="btn-3d px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs uppercase shadow-md cursor-pointer"
          >
            Lưu & Áp Dụng
          </button>
        </div>
      </div>
    </div>
  );
};

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-[#241334] to-[#12091b] border-2 border-pink-500/60 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-amber-300" />
          <div>
            <h3 className="text-base sm:text-lg font-black text-pink-300 font-display uppercase">
              Luật Chơi: Mật Mã Yêu Thương
            </h3>
            <p className="text-xs text-pink-200">9 câu hỏi Toán 6 & Giải mã bức mật thư bí mật</p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-200 max-h-[60vh] overflow-y-auto pr-2">
          <div className="p-3 rounded-xl bg-pink-950/60 border border-pink-800/50">
            <b className="text-pink-300 block mb-1">🗺️ Cấu trúc Hành Trình:</b>
            <p>• Vượt qua <b>9 câu hỏi thử thách Toán 6</b> về Số nguyên tố & Hợp số.</p>
            <p>• Mỗi câu trả lời đúng sẽ giúp em thu thập thêm 1 Mảnh ghép ký tự bí ẩn (+10 điểm).</p>
          </div>

          <div className="p-3 rounded-xl bg-pink-950/60 border border-pink-800/50">
            <b className="text-amber-400 block mb-1">💌 Thu thập Ký tự Mật mã:</b>
            <p>
              • Mỗi câu trả lời đúng sẽ mở ra <b>1 ký tự vàng (chữ hoặc số)</b> trong chuỗi 9 ký tự bí mật.
            </p>
            <p>
              • Sau 9 câu, em sẽ tiến vào màn hình <b>Giải Mã Mật Mã Yêu Thương</b> để sắp xếp các ký tự thành thông điệp chào mừng ngày 20/10!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-pink-950/60 border border-pink-800/50">
            <b className="text-rose-400 block mb-1">✨ Bức Mật Thư Bí Mật:</b>
            <p>
              Khi giải mã chính xác mật mã <b>"20 THÁNG 10"</b>, điều bất ngờ đặc biệt chúc mừng ngày Phụ Nữ Việt Nam sẽ được khai mở với hiệu ứng pháo hoa và cánh hoa hồng tuyệt đẹp!
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="btn-3d px-6 py-2.5 rounded-xl bg-pink-500 text-white font-black text-sm uppercase cursor-pointer"
          >
            ĐÃ HIỂU! TIẾP TỤC
          </button>
        </div>
      </div>
    </div>
  );
};
