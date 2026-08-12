import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: 'student' | 'teacher' | 'admin' | 'super_admin';
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  enrolledSubjects: mongoose.Types.ObjectId[];
  metadata: {
    grade?: string;
    department?: string;
    rollNumber?: string;
    subjectsTaught?: string[];
  };
  academicInfo?: {
    course?: string;
    year?: string;
    primaryDomain?: string;
    preferredLanguage?: string;
  };
  learningPreferences?: {
    preferredDifficulty?: 'Easy' | 'Medium' | 'Hard' | 'Adaptive';
    preferredQuestionTypes?: string[];
    aiTutorStyle?: 'Beginner' | 'Balanced' | 'Detailed' | 'Exam Focused';
  };
  gamification?: {
    xp: number;
    currentStreak: number;
    longestStreak: number;
    totalChallengesCompleted: number;
  };
  preferences?: {
    appearance?: {
      theme?: string;
      accentColor?: string;
      reduceAnimations?: boolean;
      compactInterface?: boolean;
      dashboardAnimations?: boolean;
    };
    ai?: {
      explanationStyle?: string;
      language?: string;
      recommendationsEnabled?: boolean;
      personalizedLearning?: boolean;
      automaticExplanation?: boolean;
      studySuggestions?: boolean;
    };
    study?: {
      primaryDomain?: string;
      preferredDifficulty?: string;
      dailyStudyGoal?: string;
      preferredLanguage?: string;
      preferredSubjects?: string[];
    };
    notifications?: {
      dailyChallenge?: boolean;
      examReminder?: boolean;
      resultNotification?: boolean;
      aiRecommendation?: boolean;
      certificate?: boolean;
      achievement?: boolean;
      streak?: boolean;
      system?: boolean;
    };
    dailyChallenge?: {
      enabled?: boolean;
      difficulty?: string;
      domains?: string[];
      reminderEnabled?: boolean;
      reminderTime?: string;
      streakNotifications?: boolean;
    };
    exam?: {
      showTimer?: boolean;
      showQuestionNumber?: boolean;
      confirmBeforeStart?: boolean;
      autoSubmit?: boolean;
      leaveWarning?: boolean;
      rememberLanguage?: boolean;
    };
    accessibility?: {
      fontSize?: string;
      highContrast?: boolean;
      reduceMotion?: boolean;
      keyboardNavigation?: boolean;
      screenReader?: boolean;
    };
    sound?: {
      master?: boolean;
      correctAnswer?: boolean;
      incorrectAnswer?: boolean;
      challengeCompletion?: boolean;
      notification?: boolean;
    };
  };
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String }, // optional for OAuth users
    name: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin', 'super_admin'], required: true },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    enrolledSubjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    metadata: {
      grade: String,
      department: String,
      rollNumber: String,
      subjectsTaught: [String],
    },
    academicInfo: {
      course: String,
      year: String,
      primaryDomain: String,
      preferredLanguage: String,
    },
    learningPreferences: {
      preferredDifficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Adaptive'], default: 'Adaptive' },
      preferredQuestionTypes: [{ type: String }],
      aiTutorStyle: { type: String, enum: ['Beginner', 'Balanced', 'Detailed', 'Exam Focused'], default: 'Balanced' },
    },
    gamification: {
      xp: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      totalChallengesCompleted: { type: Number, default: 0 },
    },
    preferences: {
      appearance: {
        theme: { type: String, default: 'dark' },
        accentColor: { type: String, default: 'default' },
        reduceAnimations: { type: Boolean, default: false },
        compactInterface: { type: Boolean, default: false },
        dashboardAnimations: { type: Boolean, default: true },
      },
      ai: {
        explanationStyle: { type: String, default: 'Balanced' },
        language: { type: String, default: 'English' },
        recommendationsEnabled: { type: Boolean, default: true },
        personalizedLearning: { type: Boolean, default: true },
        automaticExplanation: { type: Boolean, default: false },
        studySuggestions: { type: Boolean, default: true },
      },
      study: {
        primaryDomain: { type: String, default: 'CSE Core' },
        preferredDifficulty: { type: String, default: 'Adaptive' },
        dailyStudyGoal: { type: String, default: '30 minutes' },
        preferredLanguage: { type: String, default: 'English' },
        preferredSubjects: [{ type: String }],
      },
      notifications: {
        dailyChallenge: { type: Boolean, default: true },
        examReminder: { type: Boolean, default: true },
        resultNotification: { type: Boolean, default: true },
        aiRecommendation: { type: Boolean, default: true },
        certificate: { type: Boolean, default: true },
        achievement: { type: Boolean, default: true },
        streak: { type: Boolean, default: true },
        system: { type: Boolean, default: true },
      },
      dailyChallenge: {
        enabled: { type: Boolean, default: true },
        difficulty: { type: String, default: 'Adaptive' },
        domains: [{ type: String }],
        reminderEnabled: { type: Boolean, default: true },
        reminderTime: { type: String, default: '09:00' },
        streakNotifications: { type: Boolean, default: true },
      },
      exam: {
        showTimer: { type: Boolean, default: true },
        showQuestionNumber: { type: Boolean, default: true },
        confirmBeforeStart: { type: Boolean, default: true },
        autoSubmit: { type: Boolean, default: true },
        leaveWarning: { type: Boolean, default: true },
        rememberLanguage: { type: Boolean, default: true },
      },
      accessibility: {
        fontSize: { type: String, default: 'Medium' },
        highContrast: { type: Boolean, default: false },
        reduceMotion: { type: Boolean, default: false },
        keyboardNavigation: { type: Boolean, default: false },
        screenReader: { type: Boolean, default: false },
      },
      sound: {
        master: { type: Boolean, default: true },
        correctAnswer: { type: Boolean, default: true },
        incorrectAnswer: { type: Boolean, default: false },
        challengeCompletion: { type: Boolean, default: true },
        notification: { type: Boolean, default: true },
      }
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
