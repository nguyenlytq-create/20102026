import React from 'react';
import { Volume2, VolumeX, Mic, MicOff, Key, BookOpen, Maximize2, Home } from 'lucide-react';
import { sound } from '../services/soundEngine';
import { voice } from '../services/voiceEngine';

interface HeaderProps {
  voiceEnabled: boolean;
  setVoiceEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenApiKeyModal: () => void;
  onOpenGuideModal: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  voiceEnabled,
  setVoiceEnabled,
  soundEnabled,
  setSoundEnabled,
  onOpenApiKeyModal,
  onOpenGuideModal,
  onGoHome
}) => {
  const toggleVoice = () => {
    const nextState = voice.toggleVoice();
    setVoiceEnabled(nextState);
  };

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
    if (sound.enabled) {
      sound.playClick();
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-pink-900/50 sticky top-0 z-50 px-2 sm:px-6 py-2 sm:py-3 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Logo & Title */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 flex-1 truncate"
          onClick={onGoHome}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-pink-400 via-rose-500 to-amber-500 flex items-center justify-center text-lg sm:text-2xl shadow-md shadow-pink-500/30">
            💌
          </div>
          <div className="min-w-0 flex-1 truncate">
            <h1 className="text-xs sm:text-lg md:text-xl font-black tracking-tight sm:tracking-wide bg-gradient-to-r from-pink-300 via-rose-200 to-amber-300 bg-clip-text text-transparent uppercase font-display title-vietnamese truncate block leading-none">
              MẬT MÃ YÊU THƯƠNG
            </h1>
            <p className="text-[10px] sm:text-xs text-pink-300/80 hidden sm:block font-medium truncate">
              Toán 6 • Bài 10: Số nguyên tố (12 Thử Thách • Giải Mã Mật Thư)
            </p>
          </div>
        </div>

        {/* Quick Action Utilities */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Voice Toggle */}
          <button
            onClick={toggleVoice}
            className={`h-8 px-2 sm:px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition ${
              voiceEnabled
                ? 'bg-pink-950/80 border-pink-700/60 text-pink-300 hover:text-white hover:bg-pink-900'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 opacity-60'
            }`}
            title="Bật/Tắt thuyết minh tiếng Việt AI Studio"
          >
            {voiceEnabled ? <Mic className="w-3.5 h-3.5 text-pink-400" /> : <MicOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline text-xs">
              {voiceEnabled ? 'Giọng AI: Bật' : 'Giọng AI: Tắt'}
            </span>
          </button>

          {/* API Key Settings */}
          <button
            onClick={onOpenApiKeyModal}
            className="h-8 px-2 sm:px-2.5 rounded-xl bg-purple-950/80 border border-purple-700/60 text-purple-300 hover:text-white hover:bg-purple-900 transition flex items-center justify-center gap-1 text-xs font-bold"
            title="Cài đặt khóa API Google AI Studio"
          >
            <Key className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden lg:inline text-xs">AI Studio Key</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`h-8 px-2 sm:px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition ${
              soundEnabled
                ? 'bg-slate-900/80 border-slate-700/60 text-pink-200 hover:text-white hover:bg-slate-800'
                : 'bg-slate-900/80 border-slate-700 text-slate-500 opacity-60'
            }`}
            title="Bật/Tắt âm thanh hiệu ứng"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden md:inline text-xs">Hiệu ứng</span>
          </button>

          {/* Guide Button */}
          <button
            onClick={onOpenGuideModal}
            className="h-8 px-2 sm:px-3 rounded-xl bg-blue-950/80 border border-blue-700/60 text-amber-300 hover:text-amber-200 hover:bg-blue-900 transition flex items-center justify-center gap-1.5 text-xs font-bold"
            title="Luật chơi"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline text-xs">Luật chơi</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullScreen}
            className="w-8 h-8 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 hover:text-white transition flex items-center justify-center text-sm"
            title="Toàn màn hình"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Home Button */}
          <button
            onClick={onGoHome}
            className="h-8 px-2 sm:px-3 rounded-xl bg-rose-950/70 border border-rose-800/60 text-rose-300 hover:text-white hover:bg-rose-900/70 transition flex items-center justify-center gap-1 text-xs font-bold"
            title="Về trang chủ"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-xs">Trang chủ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
