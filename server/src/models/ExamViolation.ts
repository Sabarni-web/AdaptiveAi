import mongoose, { Schema, Document } from 'mongoose';

export interface IExamViolation extends Document {
  userId: mongoose.Types.ObjectId;
  examSessionId: mongoose.Types.ObjectId;
  violationType: 'HEAD_TURN' | 'MULTIPLE_PERSON' | 'PHONE_DETECTED' | 'NO_FACE';
  message: string;
  confidence?: number;
  duration?: number;
  metadata?: any;
  timestamp: Date;
}

const ExamViolationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    examSessionId: { type: Schema.Types.ObjectId, ref: 'ExamSession', required: true },
    violationType: { 
      type: String, 
      enum: ['HEAD_TURN', 'MULTIPLE_PERSON', 'PHONE_DETECTED', 'NO_FACE'], 
      required: true 
    },
    message: { type: String, required: true },
    confidence: { type: Number },
    duration: { type: Number },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

export const ExamViolation = mongoose.model<IExamViolation>('ExamViolation', ExamViolationSchema);
