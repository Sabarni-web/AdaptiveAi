import mongoose, { Document, Schema } from 'mongoose';

export interface IExamConfig extends Document {
  title: string;
  subject: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  adaptiveSettings: {
    initialQuestions: number;
    minQuestions: number;
    maxQuestions: number;
    targetPrecision: number;
    abilityPrior: number;
  };
  timing: {
    duration?: number;
    perQuestionTime?: number;
    startTime?: Date;
    endTime?: Date;
  };
  questionPool: {
    subjects: string[];
    chapters: string[];
    bloomLevels: string[];
    tags: string[];
    questionCount: number;
  };
  gradingConfig: {
    mcqWeight: number;
    descriptiveWeight: number;
    passingPercentage: number;
  };
  security: {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    allowNavigation: boolean;
    showResultImmediately: boolean;
    fullscreenRequired: boolean;
  };
  status: 'draft' | 'scheduled' | 'active' | 'closed';
  assignedTo: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ExamConfigSchema = new Schema<IExamConfig>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    adaptiveSettings: {
      initialQuestions: { type: Number, required: true, default: 5 },
      minQuestions: { type: Number, required: true, default: 20 },
      maxQuestions: { type: Number, required: true, default: 50 },
      targetPrecision: { type: Number, required: true, default: 0.3 },
      abilityPrior: { type: Number, required: true, default: 0.0 },
    },
    timing: {
      duration: { type: Number },
      perQuestionTime: { type: Number },
      startTime: { type: Date },
      endTime: { type: Date },
    },
    questionPool: {
      subjects: [{ type: String }],
      chapters: [{ type: String }],
      bloomLevels: [{ type: String }],
      tags: [{ type: String }],
      questionCount: { type: Number, required: true },
    },
    gradingConfig: {
      mcqWeight: { type: Number, required: true, default: 1 },
      descriptiveWeight: { type: Number, required: true, default: 1 },
      passingPercentage: { type: Number, required: true, default: 40 },
    },
    security: {
      shuffleQuestions: { type: Boolean, default: true },
      shuffleOptions: { type: Boolean, default: true },
      allowNavigation: { type: Boolean, default: false },
      showResultImmediately: { type: Boolean, default: true },
      fullscreenRequired: { type: Boolean, default: false },
    },
    status: { type: String, enum: ['draft', 'scheduled', 'active', 'closed'], default: 'draft' },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const ExamConfig = mongoose.model<IExamConfig>('ExamConfig', ExamConfigSchema);
