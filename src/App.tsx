import { useState } from 'react';
import { ScreenType, UserAnswerRecord } from './types/game';
import { GAME_QUESTIONS } from './data/questions';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { CipherPuzzleScreen } from './components/CipherPuzzleScreen';
import { CelebrationScreen } from './components/CelebrationScreen';
import { PetalOverlay } from './components/PetalOverlay';
import { ApiKeyModal, GuideModal } from './components/Modals';
import { sound } from './services/soundEngine';
import { voice } from './services/voiceEngine';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);

  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(voice.enabled);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.enabled);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  const handleStartGame = () => {
    sound.init();
    sound.stopAll();
    voice.cancel();

    setQuestionIndex(0);
    setTotalScore(0);
    setUserAnswers([]);
    setCurrentScreen('game');
  };

  const handleGoHome = () => {
    voice.cancel();
    sound.stopAll();
    setCurrentScreen('home');
  };

  const handleFinishQuestionOrAdvance = () => {
    if (questionIndex < GAME_QUESTIONS.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      sound.playKeyEarned();
      setCurrentScreen('cipher-puzzle');
    }
  };

  const handleSolveSuccess = () => {
    setCurrentScreen('celebrate-2010');
  };

  return (
    <div className="text-slate-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white min-h-screen antialiased relative">
      {/* Falling Rose Petals effect for celebration */}
      <PetalOverlay active={currentScreen === 'celebrate-2010'} />

      {/* Global Navigation Header */}
      <Header
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl lg:max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col justify-center items-center relative z-10">
        {currentScreen === 'home' && (
          <HomeScreen
            onStartGame={handleStartGame}
            onOpenGuideModal={() => setIsGuideModalOpen(true)}
          />
        )}

        {currentScreen === 'game' && (
          <GameScreen
            questionIndex={questionIndex}
            totalScore={totalScore}
            setTotalScore={setTotalScore}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            onAdvanceQuestion={handleFinishQuestionOrAdvance}
          />
        )}

        {currentScreen === 'cipher-puzzle' && (
          <CipherPuzzleScreen
            userAnswers={userAnswers}
            onSolveSuccess={handleSolveSuccess}
          />
        )}

        {currentScreen === 'celebrate-2010' && (
          <CelebrationScreen
            totalScore={totalScore}
            userAnswers={userAnswers}
            onRestart={handleStartGame}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full text-center py-2.5 text-[11px] text-pink-400/80 bg-slate-950/90 border-t border-pink-950/60 relative z-10">
        Hệ Thống Trò Chơi Toán Lớp 6 • Bài 10: Số Nguyên Tố • Hành Trình Giải Mã Bức Mật Thư Bí Mật 20/10
      </footer>
    </div>
  );
}
