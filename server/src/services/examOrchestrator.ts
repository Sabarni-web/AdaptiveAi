import { ExamSession, IExamSession } from '../models/ExamSession';
import { Question, IQuestion } from '../models/Question';
import { Result } from '../models/Result';
import { Certificate } from '../models/Certificate';
import { irtClient } from './irtClient';
import { queueService } from './queueService';
import { aiService } from './aiService';
import mongoose from 'mongoose';
import { generateCertificateLogic } from './certificate.service';
import { generateCertificatePDF } from './pdfGenerator.service';
import { emailService } from './emailService';
import { User } from '../models/User';
import { ExamConfig } from '../models/ExamConfig';
import { logger } from '../utils/logger';

export class ExamOrchestrator {
  async startExam(studentId: string, payload: any): Promise<IExamSession> {
    const { domain, subject, questionType, numberOfQuestions, language } = payload;
    
    const matchQuery: any = { domain, subject, isActive: true };
    if (questionType && questionType !== 'Mixed') {
      matchQuery.questionType = questionType;
    }

    // Fetch random questions using MongoDB $sample
    const questions = await Question.aggregate([
      { $match: matchQuery },
      { $sample: { size: numberOfQuestions } }
    ]);

    if (questions.length === 0) {
      throw new Error(`No questions found for domain: ${domain}, subject: ${subject}, type: ${questionType}`);
    }

    const questionIds = questions.map(q => q._id);

    const session = new ExamSession({
      studentId,
      domain,
      subject,
      questionType,
      numberOfQuestions: questionIds.length,
      questionIds,
      language: language || 'en',
      status: 'in_progress',
      startedAt: new Date(),
    });
    
    await session.save();
    return session;
  }

  async getNextQuestion(sessionId: string): Promise<any> {
    const session = await ExamSession.findById(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.status === 'completed' || session.status === 'force_submitted') {
      return { isStop: true };
    }
    if (session.status !== 'in_progress') throw new Error('Invalid session status');
    
    const answeredCount = session.questionsAsked.length;
    const questionLimit = session.numberOfQuestions;

    // If the last asked question hasn't been answered yet (e.g. page refresh), return it again
    if (answeredCount > 0) {
      const lastAsked = session.questionsAsked[answeredCount - 1];
      if (!lastAsked.answeredAt) {
        const question = await Question.findById(lastAsked.questionId);
        if (question) {
          return {
            question: {
              id: question._id.toString(),
              type: question.questionType,
              text: question.questionText,
              options: question.options,
              difficulty: question.difficulty,
              questionNumber: answeredCount,
              totalQuestions: questionLimit,
              startedAt: lastAsked.presentedAt,
            },
            index: answeredCount - 1,
            status: 'deterministic',
            isStop: false,
          };
        }
      }
    }

    if (answeredCount >= questionLimit) {
      return { isStop: true };
    }

    const nextQuestionId = session.questionIds[answeredCount];
    const question = await Question.findById(nextQuestionId);

    if (!question) {
      return { isStop: true };
    }

    // Add to questionsAsked so it doesn't get asked again
    session.questionsAsked.push({
      questionId: question._id as mongoose.Types.ObjectId,
      sequence: answeredCount + 1,
      presentedAt: new Date()
    });
    await session.save();

    // Handle translation based on session language
    const lang = session.language || 'en';
    let displayQuestionText = question.questionText;
    let displayOptions = question.options;

    return {
      question: {
        id: question._id.toString(),
        type: question.questionType,
        text: displayQuestionText,
        options: displayOptions,
        difficulty: question.difficulty,
        questionNumber: answeredCount + 1,
        totalQuestions: questionLimit,
        startedAt: session.questionsAsked[answeredCount].presentedAt,
      },
      index: answeredCount,
      status: 'deterministic',
      isStop: false,
    };
  }

  async submitAnswer(sessionId: string, questionId: string, answer: string, timeSpent: number): Promise<any> {
    const session = await ExamSession.findById(sessionId);
    if (!session) throw new Error('Session not found');

    const askedQuestion = session.questionsAsked.find(q => q.questionId.toString() === questionId);
    let isCorrect = false;
    let explanation = '';
    let correctAnswer = '';

    if (askedQuestion) {
      askedQuestion.answer = answer;
      askedQuestion.answeredAt = new Date();
      askedQuestion.timeSpent = timeSpent;

      const question = await Question.findById(questionId);
      if (question) {
        correctAnswer = question.correctAnswer || '';
        explanation = question.answerExplanation || '';
        if (question.questionType === 'MCQ') {
          const selectedOption = (question.options || []).find((o: any) => o.key === answer || o.text === answer);
          const selectedText = selectedOption ? selectedOption.key : answer;
          isCorrect = (selectedText === question.correctAnswer) || (answer === question.correctAnswer);
        } else {
          // For SAQs, the correct answer to show should be the expected explanation or answer, not "Option A"
          correctAnswer = question.answerExplanation || question.correctAnswer || '';
          
          // Use AI to evaluate SAQ answers against the explanation/expected answer
          const [aiResult, aiDetected] = await Promise.all([
            aiService.evaluateSAQ(question.questionText, answer, question.answerExplanation || ''),
            aiService.detectAIGeneratedText(answer)
          ]);
          isCorrect = aiResult.isCorrect;
          explanation = aiResult.explanation;
          (askedQuestion as any).isAIGenerated = aiDetected.isAIGenerated; // For schema flexibility
          (askedQuestion as any).aiPercentage = aiDetected.aiPercentage;
        }
        askedQuestion.isCorrect = isCorrect;
        askedQuestion.aiExplanation = explanation;

        const oldAbility = session.currentAbility;
        session.currentAbility = isCorrect ? oldAbility + 0.5 : oldAbility - 0.5;

        session.abilityHistory.push({
          questionIndex: session.questionsAsked.length - 1,
          ability: session.currentAbility,
          timestamp: new Date()
        });
      }
    }

    await session.save();
    return {
      isCorrect,
      correctAnswer,
      explanation,
      isAIGenerated: (askedQuestion as any)?.isAIGenerated || false,
      aiPercentage: (askedQuestion as any)?.aiPercentage || 0,
      marksAwarded: isCorrect ? 2 : 0,
      ability: session.currentAbility,
      success: true
    };
  }

  async submitExam(sessionId: string): Promise<any> {
    const session = await ExamSession.findById(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.status === 'completed' || session.status === 'force_submitted') return session;
    if (session.status !== 'in_progress') throw new Error('Invalid session');

    // Run scoring logic (Every question is 2 marks)
    const totalQuestions = session.questionsAsked.length;
    const correctCount = session.questionsAsked.filter(q => q.isCorrect).length;
    const maxScore = totalQuestions * 2;
    const totalScore = correctCount * 2;
    const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    let grade = 'Fail';
    if (scorePercentage >= 90) grade = 'A';
    else if (scorePercentage >= 80) grade = 'B';
    else if (scorePercentage >= 70) grade = 'C';
    else if (scorePercentage >= 50) grade = 'D';

    session.status = 'completed';
    session.completedAt = new Date();
    session.totalScore = totalScore;
    session.maxPossibleScore = maxScore;
    session.percentage = scorePercentage;
    session.grade = grade;
    await session.save();

    // Store in Result collection
    const resultDoc = new Result({
      sessionId: session._id,
      studentId: session.studentId,
      score: totalScore,
      maxScore: maxScore,
      percentage: scorePercentage,
      grade
    });
    await resultDoc.save();

    // Generate certificate if eligible
    const user = await User.findById(session.studentId);
    if (scorePercentage >= 70) {
      await generateCertificateLogic({
        userId: user ? user._id.toString() : session.studentId.toString(),
        examId: session._id.toString(),
        studentName: user ? (user.name || 'Student') : 'Anonymous Student',
        studentEmail: user ? user.email : 'student@adaptiveai.com',
        examName: (session.subject ? session.subject + ' Evaluation' : 'Full Stack Engineering Evaluation'),
        subject: session.subject || 'Full Stack Engineering',
        totalQuestions: totalQuestions,
        correctAnswers: correctCount,
        wrongAnswers: totalQuestions - correctCount,
        skippedAnswers: 0,
        timeTaken: session.questionsAsked.reduce((acc, q) => acc + (q.timeSpent || 0), 0),
        difficultyReached: 'Adaptive'
      });
    }

    return session;
  }

  async getResult(sessionId: string): Promise<any> {
    const session = await ExamSession.findById(sessionId);
    if (!session) throw new Error('Session not found');

    const totalQuestions = session.questionsAsked.length;
    const correctCount = session.questionsAsked.filter(q => q.isCorrect).length;
    const maxScore = totalQuestions * 2;
    const totalScore = correctCount * 2;
    const scorePercentage = session.percentage || 0;
    const grade = session.grade || 'Fail';

    const questionIds = session.questionsAsked.map(q => q.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const cert = await Certificate.findOne({ examId: session._id });

    return {
      score: { total: totalScore, max: maxScore, percentage: scorePercentage },
      grade,
      certificateId: cert ? cert.certificateId : null,
      percentile: 85,
      ability: session.currentAbility,
      confidenceInterval: [session.currentAbility - 0.15, session.currentAbility + 0.15],
      examTitle: `${session.subject} Exam`,
      completedAt: session.completedAt || new Date(),
      sections: [
        { name: 'Core Subject Areas', score: totalScore, max: maxScore, percentage: scorePercentage, color: 'bg-primary-500' }
      ],
      history: session.abilityHistory.length > 0 ? session.abilityHistory : [
        { questionIndex: 1, ability: 0.0, timestamp: new Date() }
      ],
      topics: [
        { name: session.subject, score: totalScore, max: maxScore, percentage: scorePercentage, questionsAttempted: totalQuestions }
      ],
      recommendations: [
        {
          topic: 'Review Incorrect Questions',
          priority: 'high',
          resources: []
        }
      ],
      answers: session.questionsAsked.map(qa => {
        const qDetail = questions.find(q => q._id.toString() === qa.questionId.toString());
        let studentAnswerText = qa.answer;
        if (qDetail && qDetail.questionType === 'MCQ') {
           const selectedOpt = (qDetail.options || []).find((o: any) => o.key === qa.answer);
           if (selectedOpt) studentAnswerText = selectedOpt.text;
        }
        return {
          question: qDetail ? {
            id: qDetail._id.toString(),
            type: qDetail.questionType,
            text: qDetail.questionText,
            options: qDetail.options,
          } : null,
          studentAnswer: studentAnswerText,
          correctAnswer: qDetail?.correctAnswer || '',
          isCorrect: qa.isCorrect,
          marksObtained: qa.isCorrect ? 2 : 0,
          maxMarks: 2,
          aiExplanation: qa.aiExplanation || qDetail?.answerExplanation || 'Explanation not available.'
        };
      })
    };
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
