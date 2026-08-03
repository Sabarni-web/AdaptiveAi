import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  subject: string;
  chapter: string;
  topic?: string;
  question: string;
  type: 'MCQ' | 'DESCRIPTIVE';
  difficulty: number | string; // Updated to string 'easy', 'medium', 'hard' or number
  discrimination: number;
  guessing: number;
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  tags: string[];
  marks: number;
  options?: Array<{ label: string; text: string }>;
  correctAnswer?: string;
  modelAnswer?: string;
  explanation?: string;
  rubric?: Array<{
    criteria: string;
    description: string;
    weight: number;
    maxMarks: number;
  }>;
  createdBy?: mongoose.Types.ObjectId;
  generatedBy?: 'Human' | 'AI';
  verified?: boolean;
  isActive: boolean;
  version: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    subject: { type: String, required: true },
    chapter: { type: String, required: true },
    topic: { type: String },
    question: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'DESCRIPTIVE'], required: true },
    difficulty: { type: Schema.Types.Mixed, required: true },
    discrimination: { type: Number, default: 1 },
    guessing: { type: Number, default: 0 },
    bloomLevel: { type: String, enum: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'], default: 'apply' },
    tags: [{ type: String }],
    marks: { type: Number, required: true },
    options: [{ label: String, text: String }],
    correctAnswer: { type: String },
    modelAnswer: { type: String },
    explanation: { type: String },
    rubric: [{
      criteria: String,
      description: String,
      weight: Number,
      maxMarks: Number,
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    generatedBy: { type: String, enum: ['Human', 'AI'], default: 'Human' },
    verified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    version: { type: Number, default: 1 },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

QuestionSchema.index({ subject: 1, chapter: 1 });
QuestionSchema.index({ type: 1, difficulty: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ isActive: 1 });

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

