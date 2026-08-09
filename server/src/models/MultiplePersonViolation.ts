import mongoose, { Schema, Document } from 'mongoose';

export interface IMultiplePersonViolation extends Document {
  userId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  questionNumber: number;
  personsDetected: number;
  duration: number;
  warningLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  integrityPenalty: number;
  resolved: boolean;
  timestamp: Date;
}

const MultiplePersonViolationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    examId: { type: Schema.Types.ObjectId, ref: 'ExamConfig', required: true },
    questionNumber: { type: Number, required: true },
    personsDetected: { type: Number, required: true },
    duration: { type: Number, required: true },
    warningLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
    integrityPenalty: { type: Number, required: true },
    resolved: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

export const MultiplePersonViolation = mongoose.model<IMultiplePersonViolation>('MultiplePersonViolation', MultiplePersonViolationSchema);
