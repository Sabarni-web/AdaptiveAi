import { z } from 'zod';

export const updateSettingsSchema = z.object({
  preferences: z.object({
    appearance: z.object({
      theme: z.enum(['dark', 'light', 'system']).optional(),
      accentColor: z.string().optional(),
      reduceAnimations: z.boolean().optional(),
      compactInterface: z.boolean().optional(),
      dashboardAnimations: z.boolean().optional(),
    }).optional(),
    ai: z.object({
      explanationStyle: z.enum(['Beginner', 'Balanced', 'Detailed']).optional(),
      language: z.string().optional(),
      recommendationsEnabled: z.boolean().optional(),
      personalizedLearning: z.boolean().optional(),
      automaticExplanation: z.boolean().optional(),
      studySuggestions: z.boolean().optional(),
    }).optional(),
    study: z.object({
      primaryDomain: z.string().optional(),
      preferredDifficulty: z.enum(['Easy', 'Medium', 'Hard', 'Adaptive']).optional(),
      dailyStudyGoal: z.string().optional(),
      preferredLanguage: z.string().optional(),
      preferredSubjects: z.array(z.string()).optional(),
    }).optional(),
    notifications: z.object({
      dailyChallenge: z.boolean().optional(),
      examReminder: z.boolean().optional(),
      resultNotification: z.boolean().optional(),
      aiRecommendation: z.boolean().optional(),
      certificate: z.boolean().optional(),
      achievement: z.boolean().optional(),
      streak: z.boolean().optional(),
      system: z.boolean().optional(),
    }).optional(),
    dailyChallenge: z.object({
      enabled: z.boolean().optional(),
      difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Adaptive']).optional(),
      domains: z.array(z.string()).optional(),
      reminderEnabled: z.boolean().optional(),
      reminderTime: z.string().optional(),
      streakNotifications: z.boolean().optional(),
    }).optional(),
    exam: z.object({
      showTimer: z.boolean().optional(),
      showQuestionNumber: z.boolean().optional(),
      confirmBeforeStart: z.boolean().optional(),
      autoSubmit: z.boolean().optional(),
      leaveWarning: z.boolean().optional(),
      rememberLanguage: z.boolean().optional(),
    }).optional(),
    accessibility: z.object({
      fontSize: z.enum(['Small', 'Medium', 'Large']).optional(),
      highContrast: z.boolean().optional(),
      reduceMotion: z.boolean().optional(),
      keyboardNavigation: z.boolean().optional(),
      screenReader: z.boolean().optional(),
    }).optional(),
    sound: z.object({
      master: z.boolean().optional(),
      correctAnswer: z.boolean().optional(),
      incorrectAnswer: z.boolean().optional(),
      challengeCompletion: z.boolean().optional(),
      notification: z.boolean().optional(),
    }).optional(),
  }).optional(),
});
