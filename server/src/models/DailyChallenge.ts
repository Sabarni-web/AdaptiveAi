import mongoose, { Document, Schema } from 'mongoose';

export interface IDailyChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  challengeDate: string; // YYYY-MM-DD in Asia/Kolkata timezone
  questionId: mongoose.Types.ObjectId;
  domain: string;
  subject: string;
  topic?: string;
  difficulty: string;
  startedAt: Date;
  submittedAt?: Date;
  answer?: string;
  isCorrect?: boolean;
  score?: number;
  timeTaken?: number;
  status: 'started' | 'completed' | 'timed_out';
  streakAfterCompletion?: number;
  createdAt: Date;
  updatedAt: Date;
}

const DailyChallengeSchema = new Schema<IDailyChallenge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengeDate: { type: String, required: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    domain: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String },
    difficulty: { type: String, required: true, default: 'Medium' },
    startedAt: { type: Date, required: true },
    submittedAt: { type: Date },
    answer: { type: String },
    isCorrect: { type: Boolean },
    score: { type: Number },
    timeTaken: { type: Number },
    status: { type: String, enum: ['started', 'completed', 'timed_out'], default: 'started' },
    streakAfterCompletion: { type: Number },
  },
  { timestamps: true }
);

// Enforce one challenge per user per day
DailyChallengeSchema.index({ userId: 1, challengeDate: 1 }, { unique: true });

export const DailyChallenge = mongoose.model<IDailyChallenge>('DailyChallenge', DailyChallengeSchema);
