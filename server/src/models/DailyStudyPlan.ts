import mongoose, { Document, Schema } from 'mongoose';

export interface IStudyPlanTask {
  _id?: mongoose.Types.ObjectId;
  type: 'practice' | 'daily_challenge' | 'maintenance';
  subject?: string;
  topic?: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  completedAt?: Date;
  questionIds?: mongoose.Types.ObjectId[];
}

export interface IDailyStudyPlan extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  goalMinutes: number;
  completedMinutes: number;
  totalMinutes: number;
  tasks: IStudyPlanTask[];
  createdAt: Date;
  updatedAt: Date;
}

const StudyPlanTaskSchema = new Schema<IStudyPlanTask>({
  type: { type: String, enum: ['practice', 'daily_challenge', 'maintenance'], required: true },
  subject: { type: String },
  topic: { type: String },
  title: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  questionIds: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});

const DailyStudyPlanSchema = new Schema<IDailyStudyPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    goalMinutes: { type: Number, required: true, default: 30 },
    completedMinutes: { type: Number, default: 0 },
    totalMinutes: { type: Number, required: true, default: 30 },
    tasks: [StudyPlanTaskSchema]
  },
  { timestamps: true }
);

DailyStudyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyStudyPlan = mongoose.model<IDailyStudyPlan>('DailyStudyPlan', DailyStudyPlanSchema);
