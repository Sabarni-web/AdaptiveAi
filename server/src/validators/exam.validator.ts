import { z } from 'zod';

export const startExamSchema = z.object({
  examConfigId: z.string().min(24, 'Invalid Config ID'),
});

export const answerSchema = z.object({
  questionId: z.string().min(24, 'Invalid Question ID'),
  answer: z.string().min(1, 'Answer is required'),
  timeSpent: z.number().optional(),
});
