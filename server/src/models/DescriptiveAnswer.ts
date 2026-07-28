import mongoose, { Document, Schema } from 'mongoose';

export interface IDescriptiveAnswer extends Document {
  sessionId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  answerText: string;
  aiGrade?: {
    contentScore: number;
    grammarScore: number;
    coherenceScore: number;
    rubricScore: number;
    plagiarismScore: number;
    finalScore: number;
    marksObtained: number;
    maxMarks: number;
    confidence: number;
    explanation: string;
    similarityToModel: number;
    gradedAt: Date;
  };
  teacherOverride?: {
    marksObtained: number;
    feedback: string;
    overriddenBy: mongoose.Types.ObjectId;
    overriddenAt: Date;
    reason: string;
  };
  plagiarismCheck?: {
    isPlagiarized: boolean;
    similarityScore: number;
    matchedSources: Array<{
      source: string;
      similarity: number;
      url?: string;
    }>;
    checkedAt: Date;
  };
  gradingStatus: 'pending' | 'processing' | 'graded' | 'reviewed';
  gradedAt?: Date;
  createdAt: Date;
}

const DescriptiveAnswerSchema = new Schema<IDescriptiveAnswer>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'ExamSession', required: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answerText: { type: String, required: true },
    aiGrade: {
      contentScore: Number,
      grammarScore: Number,
      coherenceScore: Number,
      rubricScore: Number,
      plagiarismScore: Number,
      finalScore: Number,
      marksObtained: Number,
      maxMarks: Number,
      confidence: Number,
      explanation: String,
      similarityToModel: Number,
      gradedAt: Date,
    },
    teacherOverride: {
      marksObtained: Number,
      feedback: String,
      overriddenBy: { type: Schema.Types.ObjectId, ref: 'User' },
      overriddenAt: Date,
      reason: String,
    },
    plagiarismCheck: {
      isPlagiarized: Boolean,
      similarityScore: Number,
      matchedSources: [{
        source: String,
        similarity: Number,
        url: String,
      }],
      checkedAt: Date,
    },
    gradingStatus: { type: String, enum: ['pending', 'processing', 'graded', 'reviewed'], default: 'pending' },
    gradedAt: { type: Date },
  },
  { timestamps: { updatedAt: false } }
);

DescriptiveAnswerSchema.index({ sessionId: 1, questionId: 1 });
DescriptiveAnswerSchema.index({ gradingStatus: 1, 'aiGrade.confidence': 1 });
DescriptiveAnswerSchema.index({ studentId: 1 });

export const DescriptiveAnswer = mongoose.model<IDescriptiveAnswer>('DescriptiveAnswer', DescriptiveAnswerSchema);
