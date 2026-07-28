import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: 'student' | 'teacher' | 'admin' | 'super_admin';
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  enrolledSubjects: mongoose.Types.ObjectId[];
  metadata: {
    grade?: string;
    department?: string;
    rollNumber?: string;
    subjectsTaught?: string[];
  };
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String }, // optional for OAuth users
    name: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin', 'super_admin'], required: true },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    enrolledSubjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    metadata: {
      grade: String,
      department: String,
      rollNumber: String,
      subjectsTaught: [String],
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
