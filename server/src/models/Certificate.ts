import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  certificateId: string;
  userId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  studentName: string;
  studentEmail: string;
  examName: string;
  subject: string;
  score: number;
  percentage: number;
  grade: string;
  difficultyReached: string;
  questionsAttempted: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  timeTaken: number;
  issuedDate: Date;
  verificationCode: string;
  certificateStatus: 'Valid' | 'Revoked' | 'Expired';
  pdfUrl?: string;
  shareUrl?: string;
  strongAreas: string[];
  weakAreas: string[];
  learningRecommendation: string;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    examId: { type: Schema.Types.ObjectId, ref: 'ExamConfig', required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    examName: { type: String, required: true },
    subject: { type: String, required: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    difficultyReached: { type: String, required: true },
    questionsAttempted: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    skippedAnswers: { type: Number, default: 0 },
    timeTaken: { type: Number, required: true }, // in seconds
    issuedDate: { type: Date, default: Date.now },
    verificationCode: { type: String, required: true, unique: true },
    certificateStatus: {
      type: String,
      enum: ['Valid', 'Revoked', 'Expired'],
      default: 'Valid',
    },
    pdfUrl: { type: String },
    shareUrl: { type: String },
    strongAreas: [{ type: String }],
    weakAreas: [{ type: String }],
    learningRecommendation: { type: String },
    badges: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Add compound indexes for performance
CertificateSchema.index({ userId: 1, examId: 1 }, { unique: true }); // Prevent duplicate certificates for the same exam and user

export const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);
