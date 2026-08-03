import { Worker } from 'bullmq';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { nlpClient } from '../services/nlpClient';
import { DescriptiveAnswer } from '../models/DescriptiveAnswer';

export const gradeDescriptiveWorker = new Worker('gradeDescriptive', async job => {
  const { answerId } = job.data;
  logger.info(`Processing gradeDescriptive job for answerId: ${answerId}`);
  
  const answer = await DescriptiveAnswer.findById(answerId).populate('questionId');
  if (!answer) throw new Error('Answer not found');

  // Assuming questionId contains the question details including model answer and rubric
  const question: any = answer.questionId;
  
  const gradeResult = await nlpClient.gradeDescriptive({
    answerText: answer.answerText,
    modelAnswer: question.modelAnswer,
    rubric: question.rubric,
  });

  answer.aiGrade = {
    ...gradeResult,
    plagiarismScore: 0,
    marksObtained: gradeResult.finalScore * question.marks,
    maxMarks: question.marks,
    similarityToModel: 0,
    gradedAt: new Date()
  };
  
  answer.gradingStatus = 'graded';
  
  if (gradeResult.confidence < 0.7) {
     answer.gradingStatus = 'reviewed'; // Flag for teacher review
  }
  
  await answer.save();
  
  // TODO: Emit Socket.IO event: 'grade_ready' to student
  // TODO: Queue plagiarism check
}, {
  connection: {
    host: new URL(env.REDIS_URI).hostname,
    port: parseInt(new URL(env.REDIS_URI).port) || 6379,
  }
});

gradeDescriptiveWorker.on('completed', job => {
  logger.info(`gradeDescriptive job ${job.id} has completed`);
});
gradeDescriptiveWorker.on('failed', (job, err) => {
  logger.error(`gradeDescriptive job ${job?.id} has failed with ${err.message}`);
});
