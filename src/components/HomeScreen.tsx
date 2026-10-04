import React from 'react';
import { ArrowRight, BookOpen, Sparkles, Heart } from 'lucide-react';

interface HomeScreenProps {
  onStartGame: () => void;
  onOpenGuideModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, onOpenGuideModal }) => {
  return (
    <section className="w-full flex flex-col items-center text-center max-w-4xl py-4 sm:py-6 animate-fadeIn">
      {/* Badge Category */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/90 border border-pink-500/60 text-pink-300 font-extrabold text-xs sm:text-sm mb-3 shadow-lg shadow-pink-950/60">
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
        <span>🗝️ ĐẤU TRƯỜNG TOÁN 6 • MẬT THƯ BÍ MẬT 🗝️</span>
      </div>

      {/* Main Game Title */}
      <div className="relative mb-2">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider font-display bg-gradient-to-b from-pink-200 via-rose-300 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] title-vietnamese">
          MẬT MÃ YÊU THƯƠNG
        </h2>
        <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-pink-400 tracking-widest drop-shadow-[0_3px_10px_rgba(236,72,153,0.6)] font-display title-vietnamese">
          CHINH PHỤC SỐ NGUYÊN TỐ
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-pink-200/90 font-medium mb-5 max-w-xl px-2 leading-relaxed">
        “Vượt qua 9 thử thách toán học – Thu thập 9 mảnh ghép bí ẩn – Mở khóa bức mật thư chứa đựng điều bất ngờ đặc biệt ở cuối hành trình!”
      </p>

      {/* Center Card Illustration */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#241133] to-[#12081d] border-2 border-pink-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md flex flex-col items-center">
        <div className="text-6xl sm:text-7xl mb-3 animate-float filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.5)]">
          💌🌺🗝️
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full my-2">
          <div className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-pink-400/40 shadow-md">
            <span className="text-3xl">📝</span>
            <div className="text-left">
              <div className="text-[11px] text-pink-300 font-bold uppercase tracking-wider">
                9 Thử Thách Toán 6
              </div>
              <div className="text-sm sm:text-base font-black text-slate-100">
                Số Nguyên Tố & Hợp Số
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-pink-950/60 border border-amber-500/60 shadow-md">
            <span className="text-3xl">🗝️</span>
            <div className="text-left">
              <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
                9 Mảnh Ghép Yêu Thương
              </div>
              <div className="text-sm sm:text-base font-black text-amber-300">
                Mở Khóa Mật Thư
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 rounded-xl bg-pink-950/50 border border-pink-700/50 text-xs sm:text-sm text-pink-200 flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400 shrink-0 fill-pink-400" />
          <span>
            Mỗi câu trả lời đúng sẽ giải mã được <b>1 Ký tự bí ẩn (chữ hoặc số)</b> để ghép thành Mật mã yêu thương!
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-5 w-full max-w-md">
        <button
          onClick={onStartGame}
          className="btn-3d w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white font-black text-lg shadow-xl shadow-pink-500/30 flex items-center justify-center gap-3 border-2 border-pink-200 uppercase tracking-wide cursor-pointer"
        >
          <span>💌</span> BẮT ĐẦU NGAY <ArrowRight className="w-5 h-5 ml-1" />
        </button>
        <button
          onClick={onOpenGuideModal}
          className="btn-3d w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-pink-700 font-bold text-sm text-pink-200 hover:text-white flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <BookOpen className="w-4 h-4" /> HƯỚNG DẪN
        </button>
      </div>

      {/* Bottom Tag */}
      <div className="mt-5 text-xs sm:text-sm text-pink-300 font-semibold flex items-center justify-center gap-2">
        <span>⚡ Chơi trực tiếp • Không cần đăng nhập • Tương thích 100% Điện thoại, Tablet & Máy tính</span>
      </div>
    </section>
  );
};
