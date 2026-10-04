import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sparkles, RotateCcw, Lightbulb, Unlock, X, Key, CheckCircle2, Lock } from 'lucide-react';
import { AWARDED_LETTERS, TARGET_SECRET_LETTERS, SECRET_WORD } from '../data/questions';
import { UserAnswerRecord } from '../types/game';
import { sound } from '../services/soundEngine';

interface CipherPuzzleScreenProps {
  userAnswers: UserAnswerRecord[];
  onSolveSuccess: () => void;
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const CipherPuzzleScreen: React.FC<CipherPuzzleScreenProps> = ({
  userAnswers,
  onSolveSuccess
}) => {
  // 9 slots for the target word "20THANG10"
  const [placedSlots, setPlacedSlots] = useState<(string | null)[]>(new Array(9).fill(null));
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);

  // Status for each of the 9 questions (index 0..8) based on AWARDED_LETTERS ("21TNAHG00")
  const questionStatus = useMemo(() => {
    return AWARDED_LETTERS.map((letter, idx) => {
      const record = userAnswers.find(a => a.globalIndex === idx);
      const isUnlocked = record ? record.isCorrect : false;
      return {
        questionNum: idx + 1,
        letter: record?.assignedLetter || letter,
        isUnlocked
      };
    });
  }, [userAnswers]);

  // Characters that were successfully unlocked from questions
  const unlockedLetters = useMemo(() => {
    return questionStatus.filter(q => q.isUnlocked).map(q => q.letter);
  }, [questionStatus]);

  const correctCount = unlockedLetters.length;

  const putLetterIntoSlot = useCallback((slotIndex: number, letter: string) => {
    if (slotIndex < 0 || slotIndex >= 9) return;
    const upper = letter.toUpperCase();
    setPlacedSlots(prev => {
      const next = [...prev];
      next[slotIndex] = upper;
      return next;
    });
    sound.playSlotPlace();
  }, []);

  const clearSlot = useCallback((slotIndex: number) => {
    if (slotIndex < 0 || slotIndex >= 9) return;
    setPlacedSlots(prev => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    sound.playSlotClear();
  }, []);

  // Keyboard navigation & typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (/^[0-9A-Z]$/.test(key)) {
        putLetterIntoSlot(selectedSlotIndex, key);
        setSelectedSlotIndex(prev => (prev + 1) % 9);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        clearSlot(selectedSlotIndex);
        setSelectedSlotIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'ArrowRight') {
        setSelectedSlotIndex(prev => (prev + 1) % 9);
      } else if (e.key === 'ArrowLeft') {
        setSelectedSlotIndex(prev => (prev > 0 ? prev - 1 : 8));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSlotIndex, putLetterIntoSlot, clearSlot]);

  // Click on any character tile to insert into the active or first empty slot
  const handleTileClick = (letter: string) => {
    let targetIdx = selectedSlotIndex;
    if (placedSlots[targetIdx] !== null) {
      const firstEmpty = placedSlots.findIndex(s => s === null);
      if (firstEmpty !== -1) targetIdx = firstEmpty;
    }
    putLetterIntoSlot(targetIdx, letter);

    // Auto-advance to the next empty slot
    const nextEmpty = placedSlots.findIndex((s, i) => i !== targetIdx && s === null);
    setSelectedSlotIndex(nextEmpty !== -1 ? nextEmpty : (targetIdx + 1) % 9);
  };

  const handleReset = () => {
    setPlacedSlots(new Array(9).fill(null));
    setSelectedSlotIndex(0);
    setErrorMessage(null);
    sound.playSlotClear();
  };

  const handleAutoHint = () => {
    const firstEmptyIndex = placedSlots.findIndex(s => s === null);
    if (firstEmptyIndex === -1) return;
    const targetChar = TARGET_SECRET_LETTERS[firstEmptyIndex];
    putLetterIntoSlot(firstEmptyIndex, targetChar);
    setSelectedSlotIndex((firstEmptyIndex + 1) % 9);
    sound.playCorrect();
  };

  const handleCheckSolution = () => {
    const currentWord = placedSlots.map(s => s || '').join('');
    if (currentWord === SECRET_WORD) {
      setErrorMessage(null);
      onSolveSuccess();
    } else {
      sound.playWrong();
      setErrorMessage('⚠️ Chưa đúng rồi, em hãy quan sát kỹ các ký tự thu thập được và sắp xếp lại nhé!');
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };

  // Render an individual slot in the 9 target slots
  const renderSlot = (slotIdx: number) => {
    const char = placedSlots[slotIdx];
    const isSelected = selectedSlotIndex === slotIdx;
    const slotNum = slotIdx + 1;

    return (
      <div
        key={slotIdx}
        onDragOver={e => {
          e.preventDefault();
        }}
        onDrop={e => {
          e.preventDefault();
          const letter = e.dataTransfer.getData('text/plain') || draggedLetter;
          if (letter) {
            putLetterIntoSlot(slotIdx, letter);
            setSelectedSlotIndex((slotIdx + 1) % 9);
          }
        }}
        onClick={() => {
          if (char) {
            clearSlot(slotIdx);
            setSelectedSlotIndex(slotIdx);
          } else {
            setSelectedSlotIndex(slotIdx);
          }
        }}
        className={`w-11 h-14 sm:w-14 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all select-none relative cursor-pointer ${
          char
            ? `bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 border-2 ${
                isSelected ? 'border-amber-300 ring-2 ring-amber-300 shadow-amber-400/40' : 'border-pink-200'
              } shadow-lg shadow-pink-600/40 text-white scale-100 hover:scale-105`
            : `border-2 border-dashed ${
                isSelected
                  ? 'border-amber-300 bg-amber-950/50 ring-2 ring-amber-300/80 text-amber-300 scale-105'
                  : 'border-pink-500/70 bg-black/40 text-pink-300 hover:border-pink-300 hover:bg-pink-950/30'
              }`
        }`}
      >
        {char ? (
          <>
            <span className="text-xl sm:text-2xl font-black font-mono tracking-wider drop-shadow-md">
              {char}
            </span>
            <button
              onClick={e => {
                e.stopPropagation();
                clearSlot(slotIdx);
                setSelectedSlotIndex(slotIdx);
              }}
              className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-950 border border-pink-300 text-[10px] text-pink-200 hover:text-white flex items-center justify-center font-bold"
              title="Xóa ký tự này"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <span className="text-lg sm:text-2xl font-black opacity-80">{slotNum}</span>
        )}
      </div>
    );
  };

  return (
    <section className="w-full flex flex-col items-center max-w-4xl py-3 sm:py-6 animate-fadeIn">
      <div className="w-full bg-gradient-to-b from-[#2e1338] via-[#1d0b26] to-[#120619] border-2 border-pink-500/70 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-md text-center">
        {/* Banner Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950 border border-pink-400 text-pink-200 text-xs font-black uppercase mb-3 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>🗝️ THỬ THÁCH CUỐI CÙNG • CHÌA KHÓA YÊU THƯƠNG 🗝️</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-wide title-vietnamese">
          GIẢI MÃ MẬT MÃ YÊU THƯƠNG
        </h3>

        <p className="text-xs sm:text-sm md:text-base text-pink-200 mt-2 max-w-2xl mx-auto leading-relaxed">
          {correctCount > 0 ? (
            <>
              Chúc mừng em đã trả lời đúng và mở được <b>{correctCount}/9 mảnh ký tự</b> bí mật!
              Hãy sắp xếp các ký tự thu thập được vào các ô nét đứt ở giữa để khám phá mật mã nhé!
            </>
          ) : (
            <>
              Hãy quan sát các ô trống nét đứt ở giữa và chủ động kéo thả các ký tự từ <b>Bảng ký tự</b> phía dưới để ghép thành thông điệp ngày 20/10 nhé!
            </>
          )}
        </p>

        {/* ========================================================================= */}
        {/* 1. PHÍA BÊN TRÊN: BẢNG TỔNG KẾT MẬT MÃ ĐÃ THU THẬP TỪ 9 CÂU HỎI           */}
        {/* ========================================================================= */}
        <div className="my-4 p-4 rounded-2xl bg-slate-900/90 border border-pink-500/60 text-left shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-3 border-b border-pink-800/60">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📜</span>
              <div>
                <h4 className="text-xs sm:text-sm md:text-base font-black text-amber-300 uppercase tracking-wide">
                  BẢNG TỔNG KẾT: 9 MẢNH MẬT MÃ BẠN ĐÃ THU THẬP
                </h4>
                <p className="text-[11px] text-pink-300/80">
                  Hiển thị ký tự (chữ hoặc số) đã mở được tương ứng với từng câu hỏi (1 đến 9)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950 border border-pink-500/50 text-pink-300 w-fit font-bold text-xs">
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>Đã mở: <strong className="text-amber-300">{correctCount}/9</strong> ô mật mã</span>
            </div>
          </div>

          {/* 9 Status Slots for 9 Questions */}
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {questionStatus.map(q => {
              if (q.isUnlocked) {
                return (
                  <div
                    key={q.questionNum}
                    className="p-2 rounded-xl bg-gradient-to-b from-pink-900 via-rose-900 to-purple-950 border border-amber-400 text-center shadow-md flex flex-col items-center justify-center animate-fadeIn"
                    title={`Câu ${q.questionNum}: Đã mở thành công ký tự ${q.letter}`}
                  >
                    <span className="text-[10px] text-amber-300 font-bold block leading-none mb-1">
                      Câu {q.questionNum}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-white font-mono leading-tight">
                      {q.letter}
                    </span>
                    <span className="text-[10px] leading-none mt-1">✨</span>
                  </div>
                );
              }
              return (
                <div
                  key={q.questionNum}
                  className="p-2 rounded-xl bg-slate-950/80 border border-slate-700/60 text-center flex flex-col items-center justify-center opacity-60"
                  title={`Câu ${q.questionNum}: Chưa mở được ký tự`}
                >
                  <span className="text-[10px] text-slate-400 font-bold block leading-none mb-1">
                    Câu {q.questionNum}
                  </span>
                  <Lock className="w-4 h-4 text-slate-400 my-1" />
                  <span className="text-[10px] text-slate-500 leading-none">Khóa</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-pink-950 text-xs text-pink-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {correctCount === 9
                ? 'Xuất sắc! Em đã mở được trọn vẹn 9/9 mảnh ghép mật mã!'
                : `Em đã tìm ra ${correctCount} ký tự từ các câu hỏi. Các ký tự còn lại có thể bấm trực tiếp ở bảng phía dưới.`}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. Ở GIỮA: 9 Ô VUÔNG NÉT ĐỨT ĐỂ ĐIỀN "20 THÁNG 10" ("20THANG10")         */}
        {/* ========================================================================= */}
        <div className="my-5 p-4 rounded-2xl bg-black/30 border border-pink-800/60">
          <div className="text-xs sm:text-sm font-bold text-pink-300 uppercase tracking-wider mb-3 flex items-center justify-center gap-2">
            <span>CÁC Ô MẬT MÃ (9 Ô NÉT ĐỨT):</span>
            <span className="text-[11px] text-amber-300 font-normal italic hidden sm:inline">
              (Bấm ô để chọn, kéo thả hoặc chạm ký tự để điền)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3.5">
            {/* 2 first slots: 2 0 (NGÀY 20) */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-pink-300 uppercase tracking-wider mb-1">
                NGÀY (2 ô)
              </span>
              <div className="flex gap-1 sm:gap-2 p-1.5 rounded-2xl bg-black/50 border border-pink-900/60 shadow-inner">
                {[0, 1].map(idx => renderSlot(idx))}
              </div>
            </div>

            {/* Floral separator */}
            <div className="text-pink-400 font-black text-xl sm:text-2xl px-1 pt-4 animate-pulse">
              🌸
            </div>

            {/* 5 middle slots: T H A N G (THÁNG) */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-pink-300 uppercase tracking-wider mb-1">
                THÁNG (5 ô)
              </span>
              <div className="flex gap-1 sm:gap-2 p-1.5 rounded-2xl bg-black/50 border border-pink-900/60 shadow-inner">
                {[2, 3, 4, 5, 6].map(idx => renderSlot(idx))}
              </div>
            </div>

            {/* Floral separator */}
            <div className="text-pink-400 font-black text-xl sm:text-2xl px-1 pt-4 animate-pulse">
              🌸
            </div>

            {/* 2 last slots: 1 0 (THÁNG 10) */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-pink-300 uppercase tracking-wider mb-1">
                SỐ 10 (2 ô)
              </span>
              <div className="flex gap-1 sm:gap-2 p-1.5 rounded-2xl bg-black/50 border border-pink-900/60 shadow-inner">
                {[7, 8].map(idx => renderSlot(idx))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PHÍA BÊN DƯỚI: BẢNG KÝ TỰ (SỐ 0-9 & CHỮ A-Z) ĐỂ ĐIỀN VÀO 9 Ô           */}
        {/* ========================================================================= */}
        <div className="my-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border-2 border-pink-500/70 text-left shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-pink-900/60">
            <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase flex items-center gap-1.5">
              <span>📋</span> BẢNG KÝ TỰ (SỐ & CHỮ CÁI) ĐỂ CHỌN HOẶC KÉO THẢ:
            </span>
            <span className="text-[11px] text-pink-300 italic">
              Chạm hoặc kéo bất kỳ ký tự nào vào 9 ô nét đứt ở trên
            </span>
          </div>

          {/* Hàng Phím Số 0 - 9 */}
          <div>
            <div className="text-[11px] font-bold text-pink-300 mb-1 flex items-center gap-1">
              <span>🔢 Các phím số:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              {DIGITS.map(num => (
                <div
                  key={`digit-${num}`}
                  draggable
                  onDragStart={e => {
                    setDraggedLetter(num);
                    e.dataTransfer.setData('text/plain', num);
                  }}
                  onClick={() => handleTileClick(num)}
                  className="w-9 h-11 sm:w-11 sm:h-13 rounded-xl bg-gradient-to-b from-amber-600 via-orange-700 to-amber-900 border border-amber-400 text-amber-100 hover:text-white font-black font-mono text-base sm:text-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-all shadow-md select-none cursor-pointer"
                  title={`Phím số ${num} - Chạm hoặc kéo vào ô mật mã`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Hàng Chữ Cái A - Z */}
          <div>
            <div className="text-[11px] font-bold text-pink-300 mb-1 flex items-center gap-1">
              <span>🔤 Các chữ cái:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              {ALPHABET.map(letter => (
                <div
                  key={`alpha-${letter}`}
                  draggable
                  onDragStart={e => {
                    setDraggedLetter(letter);
                    e.dataTransfer.setData('text/plain', letter);
                  }}
                  onClick={() => handleTileClick(letter)}
                  className="w-8 h-10 sm:w-10 sm:h-12 rounded-xl bg-gradient-to-b from-[#4a1c5e] via-[#2f113d] to-[#1a0823] border border-pink-500/60 hover:border-amber-300 text-pink-100 hover:text-white font-black text-xs sm:text-base flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-all shadow-md hover:shadow-pink-500/30 select-none cursor-pointer"
                  title={`Chữ cái ${letter} - Chạm hoặc kéo vào ô mật mã`}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CÁC NÚT ĐIỀU KHIỂN & BÁO LỖI                                            */}
        {/* ========================================================================= */}
        {errorMessage && (
          <div className="my-2 p-3 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs sm:text-sm font-bold animate-shake">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
          <button
            onClick={handleReset}
            className="btn-3d px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-200 border border-slate-600 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Xếp lại từ đầu
          </button>
          <button
            onClick={handleAutoHint}
            className="btn-3d px-5 py-3 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-600 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Lightbulb className="w-4 h-4 text-amber-300" /> Gợi ý ký tự
          </button>
          <button
            onClick={handleCheckSolution}
            className="btn-3d px-8 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white font-black text-sm sm:text-base uppercase shadow-lg shadow-pink-500/40 flex items-center gap-2 cursor-pointer"
          >
            <Unlock className="w-4 h-4" /> MỞ MẬT MÃ YÊU THƯƠNG
          </button>
        </div>
      </div>
    </section>
  );
};
