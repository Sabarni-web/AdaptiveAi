import { Certificate, ICertificate } from '../models/Certificate';
import { Types } from 'mongoose';
import crypto from 'crypto';

interface GenerateCertificateParams {
  userId: string;
  examId: string;
  studentName: string;
  studentEmail: string;
  examName: string;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  timeTaken: number; // in seconds
  difficultyReached: string;
  topicPerformance?: Record<string, number>; // Maps topic to percentage correct
}

const generateCertificateId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  // Find the last certificate
  const lastCert = await Certificate.findOne().sort({ createdAt: -1 });
  let nextNum = 1;
  if (lastCert && lastCert.certificateId.startsWith(`AAI-${year}-`)) {
    const parts = lastCert.certificateId.split('-');
    nextNum = parseInt(parts[2]) + 1;
  }
  return `AAI-${year}-${nextNum.toString().padStart(6, '0')}`;
};

const calculateGrade = (percentage: number): string => {
  if (percentage >= 95) return 'A+';
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  return 'Fail';
};

const determineBadges = (params: GenerateCertificateParams, percentage: number): string[] => {
  const badges: string[] = [];
  if (percentage === 100) badges.push('Perfect Score');
  if (params.correctAnswers >= 100) badges.push('100 Correct Answers');
  if (params.timeTaken < (params.totalQuestions * 30)) badges.push('Fast Solver'); // less than 30s per question
  if (percentage >= 80) badges.push('Placement Ready');
  
  if (params.subject.toLowerCase().includes('algorithm') && percentage >= 85) badges.push('Algorithm Expert');
  if (params.subject.toLowerCase().includes('dbms') && percentage >= 85) badges.push('DBMS Master');
  if (params.subject.toLowerCase().includes('python') && percentage >= 85) badges.push('Python Specialist');
  
  return badges;
};

export const generateCertificateLogic = async (params: GenerateCertificateParams): Promise<ICertificate | null> => {
  const percentage = (params.correctAnswers / params.totalQuestions) * 100;
  
  if (percentage < 70) {
    return null; // Not eligible
  }

  // Check if already exists
  const existing = await Certificate.findOne({ userId: params.userId, examId: params.examId });
  if (existing) {
    return existing; // Return existing instead of throwing to be idempotent
  }

  const certificateId = await generateCertificateId();
  const grade = calculateGrade(percentage);
  const verificationCode = crypto.randomBytes(16).toString('hex');
  const badges = determineBadges(params, percentage);

  let strongAreas: string[] = [];
  let weakAreas: string[] = [];
  
  if (params.topicPerformance) {
    for (const [topic, topicScore] of Object.entries(params.topicPerformance)) {
      if (topicScore >= 70) strongAreas.push(topic);
      else weakAreas.push(topic);
    }
  } else {
    strongAreas = [params.subject];
    weakAreas = ['Advanced concepts'];
  }

  let learningRecommendation = 'Keep up the great work!';
  if (weakAreas.length > 0) {
    learningRecommendation = `Practice more on: ${weakAreas.slice(0, 2).join(', ')}`;
  }

  const certificate = new Certificate({
    certificateId,
    userId: new Types.ObjectId(params.userId),
    examId: new Types.ObjectId(params.examId),
    studentName: params.studentName,
    studentEmail: params.studentEmail,
    examName: params.examName,
    subject: params.subject,
    score: params.correctAnswers,
    percentage,
    grade,
    difficultyReached: params.difficultyReached,
    questionsAttempted: params.correctAnswers + params.wrongAnswers,
    correctAnswers: params.correctAnswers,
    wrongAnswers: params.wrongAnswers,
    skippedAnswers: params.skippedAnswers,
    timeTaken: params.timeTaken,
    verificationCode,
    strongAreas,
    weakAreas,
    learningRecommendation,
    badges,
  });

  await certificate.save();
  return certificate;
};
