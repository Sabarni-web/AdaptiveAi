import { ExamSession, IExamSession } from '../models/ExamSession';
import { Question, IQuestion } from '../models/Question';
import { Result } from '../models/Result';
import { irtClient } from './irtClient';
import { queueService } from './queueService';
import mongoose from 'mongoose';

export class ExamOrchestrator {
  async startExam(studentId: string, examConfigId: string): Promise<IExamSession> {
    // Validate: student assigned, exam active, no existing session
    const session = new ExamSession({
      studentId,
      examConfigId,
      status: 'in_progress',
      startedAt: new Date(),
    });
    
    await session.save();
    return session;
  }

  async getNextQuestion(sessionId: string): Promise<IQuestion | null> {
    const session = await ExamSession.findById(sessionId);
    if (!session || session.status !== 'in_progress') throw new Error('Invalid session');

    // If in adaptive phase:
    // Call Adaptive Engine: POST /select-question
    /*
    const selected = await irtClient.selectQuestion({
      currentAbility: session.currentAbility,
      answeredQuestions: session.questionsAsked.map(q => q.questionId.toString()),
      subject: 'Math' // fetch from exam config
    });
    */
    
    // Check stopping rule
    /*
    const stopResult = await irtClient.checkStopping({
      currentAbility: session.currentAbility,
      answeredCount: session.questionsAsked.length,
      confidenceInterval: [0, 0] // dummy
    });
    if (stopResult.shouldStop) {
       session.stopReason = 'precision_reached';
       await session.save();
       return null;
    }
    */
    
    // Return a dummy question for now
    const question = await Question.findOne();
    return question;
  }

  async submitAnswer(sessionId: string, questionId: string, answer: string, timeSpent: number): Promise<void> {
    const session = await ExamSession.findById(sessionId);
    if (!session) throw new Error('Session not found');

    // Save answer to StudentAnswer / DescriptiveAnswer
    // Update session.questionsAsked
    // Call Adaptive Engine: POST /estimate-ability
    // Update session.currentAbility + abilityHistory
    // Call Adaptive Engine: POST /check-stopping
    // If should_stop -> mark session ready for submission
  }

  async submitExam(sessionId: string): Promise<any> {
    const session = await ExamSession.findById(sessionId);
    if (!session || session.status !== 'in_progress') throw new Error('Invalid session');

    // Calculate MCQ score
    // Call Adaptive Engine: POST /calculate-score
    // Generate Result document
    // Update session status to 'completed'
    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();
    
    return session;
  }

  async abandonExam(sessionId: string, reason: string): Promise<void> {
    const session = await ExamSession.findById(sessionId);
    if (session && session.status === 'in_progress') {
      session.status = 'abandoned';
      await session.save();
    }
  }
}

export const examOrchestrator = new ExamOrchestrator();
