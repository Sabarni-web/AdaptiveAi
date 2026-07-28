import mongoose, { Document, Schema } from 'mongoose';

export interface IResult extends Document {
  sessionId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  examConfigId: mongoose.Types.ObjectId;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  createdAt: Date;
}

const ResultSchema = new Schema<IResult>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'ExamSession', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    examConfigId: { type: Schema.Types.ObjectId, ref: 'ExamConfig', required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
  },
  { timestamps: true }
);

export const Result = mongoose.model<IResult>('Result', ResultSchema);
