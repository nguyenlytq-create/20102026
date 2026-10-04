import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, RotateCcw, Home } from 'lucide-react';
import { UserAnswerRecord } from '../types/game';
import { sound } from '../services/soundEngine';
import { voice } from '../services/voiceEngine';

interface CelebrationScreenProps {
  totalScore: number;
  userAnswers: UserAnswerRecord[];
  onRestart: () => void;
  onGoHome: () => void;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  totalScore,
  userAnswers,
  onRestart,
  onGoHome
}) => {
  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const accuracy = Math.round((correctCount / (userAnswers.length || 9)) * 100);

  const celebrationText =
    'Tuyệt vời! Chúc mừng các em đã giải mã thành công Mật Mã Yêu Thương: 20 Tháng 10! Kính chúc các Cô giáo, các Mẹ và tất cả các bạn nữ luôn luôn xinh đẹp, ngập tràn niềm vui, hạnh phúc và luôn là những đóa hoa rạng rỡ nhất!';

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 130,
        spread: 110,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f472b6', '#fbcfe8', '#fbbf24', '#f43f5e']
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors: ['#db2777', '#f472b6', '#fbbf24']
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors: ['#db2777', '#f472b6', '#fbbf24']
        });
      }, 400);
    } catch {}
  };

  useEffect(() => {
    document.body.classList.add('celebrate-rose');
    sound.playCelebrationFanfare();
    triggerConfetti();
    voice.playCelebrationAudio();

    return () => {
      document.body.classList.remove('celebrate-rose');
      voice.cancel();
      sound.stopAll();
    };
  }, []);

  const handleReadAgain = () => {
    voice.playCelebrationAudio();
  };

  const handleReplayFanfare = () => {
    sound.playCelebrationFanfare();
    triggerConfetti();
  };

  return (
    <section className="w-full flex flex-col items-center max-w-5xl py-4 sm:py-6 animate-fadeIn">
      {/* Big Celebration Floral Frame */}
      <div className="w-full bg-gradient-to-b from-[#db2777]/95 via-[#be185d]/90 to-[#831843]/95 border-4 border-pink-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md text-center relative overflow-hidden">
        {/* Decorative corner glows */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-rose-300/30 rounded-full blur-3xl pointer-events-none" />

        <div className="text-6xl sm:text-8xl mb-3 animate-float filter drop-shadow-[0_10px_20px_rgba(255,255,255,0.4)]">
          💐🌹💖
        </div>

        {/* Big Highlight Word */}
        <div className="my-2">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-amber-200 text-xs sm:text-sm font-black uppercase tracking-widest mb-3">
            ✨ MẬT MÃ YÊU THƯƠNG ĐÃ ĐƯỢC GIẢI MÃ HOÀN TOÀN ✨
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-love tracking-wider text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] uppercase title-vietnamese">
            20 THÁNG 10
          </h1>

          <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-amber-200 mt-2 font-display drop-shadow-[0_3px_10px_rgba(234,179,8,0.7)] title-vietnamese">
            Chúc mừng ngày Phụ nữ Việt Nam 20/10
          </div>
        </div>

        {/* Romantic Dedication Message */}
        <div className="max-w-2xl mx-auto my-5 p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/30 backdrop-blur-sm text-pink-100 text-sm sm:text-base leading-relaxed">
          Kính chúc các Cô giáo, các Mẹ và tất cả các bạn nữ luôn luôn xinh đẹp, ngập tràn niềm vui,
          hạnh phúc và luôn là những đóa hoa rạng rỡ nhất! 🌹
        </div>

        {/* Final Performance Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 max-w-3xl mx-auto">
          <div className="p-3 rounded-2xl bg-white/15 border border-white/30 text-center">
            <span className="text-xs text-pink-200 block font-semibold">Tổng câu</span>
            <span className="text-xl sm:text-2xl font-black text-white">9/9</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/15 border border-white/30 text-center">
            <span className="text-xs text-pink-200 block font-semibold">Tỷ lệ chính xác</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300">{accuracy}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/15 border border-white/30 text-center">
            <span className="text-xs text-pink-200 block font-semibold">Tổng điểm</span>
            <span className="text-xl sm:text-2xl font-black text-yellow-300">{totalScore}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/15 border border-white/30 text-center">
            <span className="text-xs text-pink-200 block font-semibold">Mảnh ghép mở được</span>
            <span className="text-xl sm:text-2xl font-black text-white">{correctCount}/9 🗝️</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-6 pt-4 border-t border-white/30">
          <button
            onClick={handleReadAgain}
            className="btn-3d px-6 py-3.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-black text-sm uppercase shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" /> ĐỌC LẠI LỜI CHÚC
          </button>
          <button
            onClick={handleReplayFanfare}
            className="btn-3d px-6 py-3.5 rounded-xl bg-white text-pink-800 font-black text-sm uppercase shadow-lg shadow-white/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-pink-600" /> BẮN PHÁO HOA LẠI
          </button>
          <button
            onClick={onRestart}
            className="btn-3d px-6 py-3.5 rounded-xl bg-pink-950/80 hover:bg-pink-900 text-white border border-pink-400 font-bold text-sm uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> CHƠI LẠI TỪ ĐẦU
          </button>
          <button
            onClick={onGoHome}
            className="btn-3d px-6 py-3.5 rounded-xl bg-black/40 hover:bg-black/60 text-pink-200 border border-white/30 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" /> VỀ TRANG CHỦ
          </button>
        </div>
      </div>
    </section>
  );
};
