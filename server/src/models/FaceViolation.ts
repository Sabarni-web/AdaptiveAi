import mongoose, { Document, Schema } from 'mongoose';

export interface IFaceViolation extends Document {
  userId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  questionNumber?: number;
  event: string;
  duration: number;
  confidence: number;
  timestamp: Date;
}

const faceViolationSchema = new Schema<IFaceViolation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: Schema.Types.ObjectId, ref: 'ExamSession', required: true },
  questionNumber: { type: Number },
  event: { type: String, required: true },
  duration: { type: Number, required: true },
  confidence: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

faceViolationSchema.index({ examId: 1, userId: 1, timestamp: -1 });

export const FaceViolation = mongoose.model<IFaceViolation>('FaceViolation', faceViolationSchema);
