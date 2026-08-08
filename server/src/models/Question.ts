import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  domain: string;
  subject: string;
  questionType: string;
  questionText: string;
  options: Array<{
    key: string;
    text: string;
  }>;
  correctAnswer?: string;
  answerExplanation?: string;
  difficulty: string;
  topic?: string;
  sourceDocument?: string;
  sourceQuestionNumber?: string;
  isActive: boolean;
  translations?: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    domain: { 
      type: String, 
      required: true,
    },
    subject: { type: String, required: true },
    questionType: { type: String, required: true, enum: ['MCQ', 'SAQ'] },
    questionText: { type: String, required: true },
    options: [{
      key: String,
      text: String
    }],
    correctAnswer: { type: String },
    answerExplanation: { type: String },
    difficulty: { type: String, default: 'Medium' },
    topic: { type: String },
    sourceDocument: { type: String },
    sourceQuestionNumber: { type: String },
    isActive: { type: Boolean, default: true },
    translations: { type: Map, of: Object },
  },
  { timestamps: true }
);

QuestionSchema.index({ domain: 1, subject: 1, questionType: 1 });
QuestionSchema.index({ difficulty: 1 });
QuestionSchema.index({ isActive: 1 });

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
