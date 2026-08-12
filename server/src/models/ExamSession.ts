import mongoose, { Document, Schema } from 'mongoose';

export interface IExamSession extends Document {
  studentId: mongoose.Types.ObjectId;
  examConfigId?: mongoose.Types.ObjectId; // Make it optional since we use domain/subject now
  domain: string;
  subject: string;
  questionType: string;
  numberOfQuestions: number;
  questionIds: mongoose.Types.ObjectId[];
  language?: string;
  status: 'in_progress' | 'completed' | 'abandoned' | 'timed_out' | 'force_submitted';
  currentAbility: number;
  abilityHistory: Array<{
    questionIndex: number;
    ability: number;
    timestamp: Date;
  }>;
  questionsAsked: Array<{
    questionId: mongoose.Types.ObjectId;
    sequence: number;
    presentedAt: Date;
    answeredAt?: Date;
    timeSpent?: number;
    answer?: string;
    isCorrect?: boolean;
    informationGain?: number;
    aiExplanation?: string;
  }>;
  stopReason?: 'precision_reached' | 'max_questions' | 'time_up' | 'manual' | 'force_submitted';
  totalQuestions: number;
  startedAt: Date;
  completedAt?: Date;
  timeRemainingAtSubmit?: number;
  finalAbility?: number;
  confidenceInterval?: [number, number];
  totalScore?: number;
  maxPossibleScore?: number;
  percentage?: number;
  grade?: string;

  fullscreenExits: number;
  ipAddress: string;
  userAgent: string;
  descriptiveGradingStatus: 'pending' | 'processing' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const ExamSessionSchema = new Schema<IExamSession>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    examConfigId: { type: Schema.Types.ObjectId, ref: 'ExamConfig' },
    domain: { type: String, required: true },
    subject: { type: String, required: true },
    questionType: { type: String, required: true },
    numberOfQuestions: { type: Number, required: true },
    questionIds: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    language: { type: String, default: 'en' },
    status: { type: String, enum: ['in_progress', 'completed', 'abandoned', 'timed_out', 'force_submitted'], required: true },
    currentAbility: { type: Number, default: 0 },
    abilityHistory: [{
      questionIndex: Number,
      ability: Number,
      timestamp: Date,
    }],
    questionsAsked: [{
      questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
      sequence: Number,
      presentedAt: Date,
      answeredAt: Date,
      timeSpent: Number,
      answer: String,
      isCorrect: Boolean,
      informationGain: Number,
      aiExplanation: String,
    }],
    stopReason: { type: String, enum: ['precision_reached', 'max_questions', 'time_up', 'manual', 'force_submitted'] },
    totalQuestions: { type: Number, default: 0 },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date },
    timeRemainingAtSubmit: { type: Number },
    finalAbility: { type: Number },
    confidenceInterval: [{ type: Number }],
    totalScore: { type: Number },
    maxPossibleScore: { type: Number },
    percentage: { type: Number },
    grade: { type: String },

    fullscreenExits: { type: Number, default: 0 },
    ipAddress: { type: String },
    userAgent: { type: String },
    descriptiveGradingStatus: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

ExamSessionSchema.index({ studentId: 1, status: 1 });

export const ExamSession = mongoose.model<IExamSession>('ExamSession', ExamSessionSchema);
