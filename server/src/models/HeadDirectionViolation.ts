import mongoose, { Schema, Document } from 'mongoose';

export interface IHeadDirectionViolation extends Document {
  userId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  questionNumber: number;
  headDirection: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
  yaw: number;
  pitch: number;
  roll: number;
  duration: number;
  warningLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  integrityPenalty: number;
  resolved: boolean;
  timestamp: Date;
}

const HeadDirectionViolationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    examId: { type: Schema.Types.ObjectId, ref: 'ExamConfig', required: true },
    questionNumber: { type: Number, required: true },
    headDirection: { type: String, enum: ['LEFT', 'RIGHT', 'UP', 'DOWN'], required: true },
    yaw: { type: Number, required: true },
    pitch: { type: Number, required: true },
    roll: { type: Number, required: true },
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

export const HeadDirectionViolation = mongoose.model<IHeadDirectionViolation>('HeadDirectionViolation', HeadDirectionViolationSchema);
