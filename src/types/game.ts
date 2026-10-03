export interface Question {
  id: number;
  topic: string;
  categoryTag: string;
  text: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

export interface UserAnswerRecord {
  questionId: number;
  globalIndex: number;
  topic: string;
  categoryTag: string;
  questionText: string;
  chosenText: string;
  isCorrect: boolean;
  hint: string;
  assignedLetter: string;
}

export type ScreenType = 'home' | 'game' | 'cipher-puzzle' | 'celebrate-2010';
