import { z } from 'zod';

export const startExamSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  subject: z.string().min(1, 'Subject is required'),
  questionType: z.enum(['MCQ', 'SAQ', 'Mixed']),
  numberOfQuestions: z.number().min(1).max(100),
  language: z.string().optional(),
});

export const answerSchema = z.object({
  questionId: z.string().min(24, 'Invalid Question ID'),
  answer: z.string().min(1, 'Answer is required'),
  timeSpent: z.number().optional(),
});
