import { quizA } from './parts/quiz-a';
import { quizB } from './parts/quiz-b';
import { quizC } from './parts/quiz-c';

export type Question =
  | { type: 'single'; q: string; options: string[]; answer: number; explain: string; ref?: string }
  | { type: 'ox'; q: string; answer: boolean; explain: string; ref?: string }
  | { type: 'order'; q: string; items: string[]; explain: string; ref?: string };

export const quizzes: Record<number, Question[]> = { ...quizA, ...quizB, ...quizC };
