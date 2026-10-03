import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Square, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { GAME_QUESTIONS, SCRAMBLED_QUESTION_LETTERS } from '../data/questions';
import { UserAnswerRecord } from '../types/game';
import { sound } from '../services/soundEngine';
import { voice } from '../services/voiceEngine';

interface GameScreenProps {
  questionIndex: number;
  totalScore: number;
  setTotalScore: React.Dispatch<React.SetStateAction<number>>;
  userAnswers: UserAnswerRecord[];
  setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswerRecord[]>>;
  onFinish12Questions: () => void;
}

interface OptionObj {
  text: string;
  isCorrect: boolean;
  originalIndex: number;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  questionIndex,
  totalScore,
  setTotalScore,
  userAnswers,
  setUserAnswers,
  onFinish12Questions
}) => {
  const currentQ = GAME_QUESTIONS[questionIndex];
  const assignedLetter = SCRAMBLED_QUESTION_LETTERS[questionIndex];
  const currentQuestionNumber = questionIndex + 1;
  const progressPercent = Math.round((currentQuestionNumber / 12) * 100);

  const [isLocked, setIsLocked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Standard fixed options order (A, B, C, D) matching question audio exactly
  const questionOptions: OptionObj[] = useMemo(() => {
    return currentQ.options.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === currentQ.correctIndex,
      originalIndex: idx
    }));
  }, [currentQ]);

  // Reset states on question change
  useEffect(() => {
    setIsLocked(false);
    setSelectedIndex(null);
    voice.cancel();
  }, [questionIndex]);

  // Listen to voice engine state changes
  useEffect(() => {
    const unsubscribe = voice.addListener(speaking => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsubscribe();
      voice.cancel();
    };
  }, []);

  const handleReadQuestion = () => {
    sound.playClick();
    voice.playQuestionAudio(currentQuestionNumber);
  };

  const handleStopVoice = () => {
    voice.cancel();
  };

  const handleSelectOption = (idx: number) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelectedIndex(idx);
    voice.cancel();

    const chosenOption = questionOptions[idx];
    const isCorrect = chosenOption.isCorrect;

    const answerRecord: UserAnswerRecord = {
      questionId: currentQ.id,
      globalIndex: questionIndex,
      topic: currentQ.topic,
      categoryTag: currentQ.categoryTag,
      questionText: currentQ.text,
      chosenText: chosenOption.text,
      isCorrect,
      hint: currentQ.hint,
      assignedLetter
    };

    setUserAnswers(prev => {
      const filtered = prev.filter(a => a.globalIndex !== questionIndex);
      return [...filtered, answerRecord];
    });

    if (isCorrect) {
      sound.playCorrect();
      setTotalScore(prev => prev + 10);
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#ec4899', '#f472b6', '#fbbf24', '#f43f5e']
        });
      } catch {}
      setTimeout(() => {
        voice.playFeedbackAudio(currentQuestionNumber, true);
      }, 350);
    } else {
      sound.playWrong();
      setTimeout(() => {
        voice.playFeedbackAudio(currentQuestionNumber, false);
      }, 350);
    }
  };

  const handleNext = () => {
    voice.cancel();
    sound.stopAll();
    sound.playChestOpen();

    if (questionIndex < 11) {
      onFinish12Questions(); // Trigger next
    } else {
      onFinish12Questions();
    }
  };

  const handleReplayFeedback = () => {
    if (isSpeaking) {
      voice.cancel();
    } else {
      voice.playFeedbackAudio(currentQuestionNumber, Boolean(isSelectedCorrect));
    }
  };

  const correctAnswersCount = userAnswers.filter(a => a.isCorrect).length;
  const letters = ['A', 'B', 'C', 'D'];
  const isSelectedCorrect = selectedIndex !== null && questionOptions[selectedIndex]?.isCorrect;

  return (
    <section className="w-full flex flex-col items-center max-w-5xl py-2 sm:py-4">
      {/* Top HUD Status Banner */}
      <div className="w-full bg-slate-900/95 border border-pink-800/70 rounded-2xl p-3 sm:p-4 mb-3.5 backdrop-blur-md shadow-xl flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Stage & Question info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-pink-500/20 border border-pink-500/50 flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-inner">
            💌
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded bg-pink-700 text-white tracking-wider">
                THỬ THÁCH
              </span>
              <span className="text-xs sm:text-base font-bold text-pink-300 truncate">
                Hành Trình Mật Mã
              </span>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 font-semibold mt-0.5 truncate">
              Câu hỏi:{' '}
              <span className="text-pink-400 font-black text-sm sm:text-base">
                {currentQuestionNumber}
              </span>
              /12
            </div>
          </div>
        </div>

        {/* Right: Score & Letters count */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Score Pill */}
          <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-pink-950/90 border border-pink-700/60 flex items-center gap-1.5 shadow-sm">
            <span className="text-amber-400 text-base sm:text-lg">🪙</span>
            <div>
              <div className="text-[9px] sm:text-[10px] text-pink-300 uppercase leading-none font-bold">
                Điểm
              </div>
              <div className="text-sm sm:text-lg font-black text-amber-300 leading-tight">
                {totalScore}
              </div>
            </div>
          </div>

          {/* Letters collected pill */}
          <div
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-pink-950/90 border border-pink-700/60 flex items-center gap-1 shadow-sm"
            title="Số chữ cái mật mã đã thu thập"
          >
            <span className="text-base sm:text-lg">🔤</span>
            <div>
              <div className="text-[9px] sm:text-[10px] text-pink-300 uppercase leading-none font-bold">
                Chữ cái
              </div>
              <div className="text-sm sm:text-lg font-black text-pink-300 leading-tight">
                {correctAnswersCount}/12
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Progress Bar */}
      <div className="w-full bg-slate-900/80 border border-pink-900/60 rounded-2xl p-2.5 sm:p-3 mb-3.5 shadow-md">
        <div className="flex justify-between items-center text-xs sm:text-sm text-pink-300 font-bold mb-1.5 px-1">
          <span>Tiến độ thử thách</span>
          <span className="text-pink-300">
            Câu {currentQuestionNumber}/12 ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-pink-900/80">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mini Scrambled Secret Letters Shelf */}
      <div className="w-full bg-slate-900/90 border border-pink-900/70 rounded-2xl p-2.5 sm:p-3 mb-3.5 shadow-md">
        <div className="flex items-center justify-between text-xs text-pink-300 font-bold mb-2 px-1">
          <span className="flex items-center gap-1.5">
            <span>🗝️</span> Mảnh ghép mật mã thu thập (Được xáo trộn ngẫu nhiên):
          </span>
          <span className="text-[11px] text-amber-300 font-extrabold">
            Đã mở: {correctAnswersCount}/12
          </span>
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 sm:gap-2">
          {SCRAMBLED_QUESTION_LETTERS.map((letter, idx) => {
            const record = userAnswers.find(a => a.globalIndex === idx);
            const isCurrent = idx === questionIndex;
            const isUnlocked = record?.isCorrect;

            return (
              <div
                key={idx}
                className={`h-9 sm:h-10 rounded-xl flex flex-col items-center justify-center font-black text-xs sm:text-sm border transition-all select-none ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-pink-500 to-rose-600 border-pink-200 text-white shadow-md shadow-pink-500/30 scale-100'
                    : isCurrent
                    ? 'bg-amber-950/60 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 animate-pulse'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
                title={`Câu ${idx + 1}: ${isUnlocked ? `Chữ cái '${letter}'` : isCurrent ? 'Đang giải' : 'Chưa mở'}`}
              >
                {isUnlocked ? (
                  <span>{letter}</span>
                ) : (
                  <span className="text-[10px] font-bold opacity-60">#{idx + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Question Box */}
      <div className="w-full bg-gradient-to-b from-[#241334] to-[#12091b] border-2 border-pink-700/70 rounded-3xl p-4 sm:p-7 shadow-2xl relative">
        {/* Chest Atmosphere Banner */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-pink-800/60 gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className="text-2xl sm:text-3xl animate-bounce">📦</span>
            <span className="text-xs sm:text-base font-extrabold text-pink-300 uppercase tracking-wide truncate">
              Rương Số Nguyên Tố
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Voice Action Buttons */}
            <button
              onClick={handleReadQuestion}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer ${
                isSpeaking
                  ? 'bg-pink-500 text-white ring-2 ring-pink-300 border-pink-300'
                  : 'bg-pink-900/80 hover:bg-pink-800 border-pink-600 text-pink-200 hover:text-white'
              }`}
              title="Nghe cô giáo AI đọc câu hỏi và các đáp án"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">Nghe đọc</span>
            </button>
            <button
              onClick={handleStopVoice}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center transition shadow-sm cursor-pointer"
              title="Dừng giọng đọc"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>

            <span className="text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full bg-pink-950 border border-pink-500/40 text-pink-200 shadow-sm">
              {currentQ.categoryTag}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="min-h-[75px] sm:min-h-[90px] flex items-center justify-center text-center my-2 sm:my-4 px-2 sm:px-6">
          <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed font-display">
            {currentQ.text}
          </h3>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
          {questionOptions.map((opt, idx) => {
            const isChosen = selectedIndex === idx;
            let btnStyle =
              'from-[#29133b] to-[#1c0d29] border-pink-500/40 hover:border-pink-300 text-pink-50';

            if (isLocked) {
              if (opt.isCorrect) {
                btnStyle = 'from-emerald-700 to-emerald-600 border-emerald-300 text-white';
              } else if (isChosen && !opt.isCorrect) {
                btnStyle = 'from-rose-950 to-red-900 border-red-500 text-rose-200 animate-chest-shake';
              }
            }

            return (
              <button
                key={idx}
                disabled={isLocked}
                onClick={() => handleSelectOption(idx)}
                className={`btn-3d w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r border-2 text-left flex items-center gap-4 shadow-lg transition-all group min-h-[72px] sm:min-h-[82px] cursor-pointer disabled:cursor-default ${btnStyle}`}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-pink-950/95 border-2 border-pink-400/60 flex items-center justify-center font-black text-pink-300 text-lg sm:text-xl shrink-0 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-200 transition shadow-md">
                  {letters[idx]}
                </div>
                <div className="flex-1 font-extrabold text-base sm:text-xl md:text-2xl leading-snug tracking-wide">
                  {opt.text}
                </div>
                <span className="text-2xl sm:text-3xl opacity-75 group-hover:opacity-100 group-hover:scale-125 transition shrink-0">
                  {isLocked && opt.isCorrect ? '💖' : isLocked && isChosen && !opt.isCorrect ? '⚠️' : '💌'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback & Reward Box */}
        {isLocked && (
          <div
            className={`mt-5 sm:mt-6 p-4 sm:p-5 rounded-2xl transition-all duration-300 border-2 text-left animate-fadeIn ${
              isSelectedCorrect
                ? 'bg-gradient-to-r from-pink-950/90 via-purple-950/90 to-rose-950/90 border-pink-400'
                : 'bg-rose-950/80 border-rose-600 text-rose-200'
            }`}
          >
            {isSelectedCorrect ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-600 border-2 border-pink-200 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-pink-500/50 animate-bounce shrink-0">
                    {assignedLetter}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs sm:text-sm font-extrabold uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        🎉 CHÍNH XÁC! (+10 ĐIỂM)
                      </div>
                      <button
                        onClick={handleReplayFeedback}
                        className="px-2 py-0.5 rounded-lg bg-pink-900/80 hover:bg-pink-800 border border-pink-500/50 text-[11px] font-bold text-pink-200 hover:text-white flex items-center gap-1 cursor-pointer transition"
                        title={isSpeaking ? 'Dừng đọc' : 'Nghe lại thuyết minh'}
                      >
                        <Volume2 className={`w-3 h-3 ${isSpeaking ? 'animate-pulse text-amber-300' : ''}`} />
                        <span>{isSpeaking ? 'Dừng' : 'Nghe lại'}</span>
                      </button>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-white font-display mt-0.5">
                      Thu thập được 1 Chữ cái Chìa Khóa Yêu Thương:{' '}
                      <span className="text-amber-300">{assignedLetter}</span>!
                    </h4>
                    <p className="text-xs text-pink-200/90 mt-0.5">
                      {questionIndex >= 11
                        ? 'Em đã hoàn thành trọn vẹn 12 câu hỏi!'
                        : 'Hãy bấm tiếp tục để giải các thử thách tiếp theo.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="btn-3d w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white font-black text-sm uppercase shadow-lg shadow-pink-500/40 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                  {questionIndex >= 11 ? 'TIẾN VÀO GIẢI MÃ MẬT THƯ 💌' : 'Tiếp tục câu sau'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm sm:text-base font-black font-display text-amber-300">
                        CHƯA CHÍNH XÁC!
                      </div>
                      <button
                        onClick={handleReplayFeedback}
                        className="px-2 py-0.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-500/50 text-[11px] font-bold text-rose-200 hover:text-white flex items-center gap-1 cursor-pointer transition"
                        title={isSpeaking ? 'Dừng đọc' : 'Nghe lại giải thích gợi ý'}
                      >
                        <Volume2 className={`w-3 h-3 ${isSpeaking ? 'animate-pulse text-amber-300' : ''}`} />
                        <span>{isSpeaking ? 'Dừng' : 'Nghe lại'}</span>
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                      Gợi ý: {currentQ.hint}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="btn-3d w-full sm:w-auto mt-2 sm:mt-0 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm uppercase whitespace-nowrap border border-slate-600 cursor-pointer flex items-center justify-center gap-2"
                >
                  {questionIndex >= 11 ? 'TIẾN VÀO GIẢI MÃ MẬT THƯ' : 'Tiếp tục'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
