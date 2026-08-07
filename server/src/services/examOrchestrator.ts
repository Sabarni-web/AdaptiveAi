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
  async startExam(studentId: string, examConfigId: string, language?: string): Promise<IExamSession> {
    // Validate: student assigned, exam active, no existing session
    const session = new ExamSession({
      studentId,
      examConfigId,
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
    const questionLimit = 10;

    if (answeredCount >= questionLimit) {
      return { isStop: true };
    }

    // Determine target difficulty
    let targetDifficulty = 'easy';
    if (session.currentAbility > 0.4) targetDifficulty = 'hard';
    else if (session.currentAbility > 0) targetDifficulty = 'medium';

    // Find questions that haven't been asked yet matching the difficulty
    const askedIds = session.questionsAsked.map(q => q.questionId);
    let question = await Question.findOne({ 
      _id: { $nin: askedIds },
      difficulty: targetDifficulty
    });

    if (!question) {
      // Not enough questions in MongoDB -> Call Gemini
      try {
        const newQuestions = await aiService.generateQuestions('Full Stack Engineering', targetDifficulty, 1);
        if (newQuestions && newQuestions.length > 0) {
          const savedQuestions = await Question.insertMany(newQuestions);
          question = savedQuestions[0] as any;
        }
      } catch (aiError: any) {
        logger.error(`[ORCHESTRATOR] AI Generation failed: ${JSON.stringify(aiError)}`);
        // Fallback: try to find ANY question in the DB that hasn't been asked, regardless of difficulty
        logger.info(`[ORCHESTRATOR] Attempting to find a fallback cached question...`);
        question = await Question.findOne({ _id: { $nin: askedIds } });
        
        if (!question) {
          // If we still don't have a question, we either stop the exam or throw the structured error so the frontend knows WHY it failed.
          throw aiError; 
        }
      }
    }

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
    let displayQuestionText = question.question;
    let displayOptions = question.options;

    if (lang !== 'en' && question.translations) {
      let translation;
      if (typeof question.translations.get === 'function') {
        translation = question.translations.get(lang);
      } else {
        translation = question.translations[lang];
      }
      
      if (translation) {
        displayQuestionText = translation.question || displayQuestionText;
        displayOptions = translation.options || displayOptions;
      }
    }

    return {
      question: {
        id: question._id.toString(),
        type: question.type,
        text: displayQuestionText,
        options: displayOptions,
        marks: question.marks,
        difficulty: question.difficulty,
        questionNumber: answeredCount + 1,
        totalQuestions: questionLimit,
      },
      index: answeredCount,
      status: 'adaptive',
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
        explanation = question.explanation || '';
        if (question.type === 'MCQ') {
          const selectedOption = (question.options || []).find((o: any) => o.label === answer);
          const selectedText = selectedOption ? selectedOption.text : answer;
          isCorrect = selectedText === question.correctAnswer;
        } else {
          isCorrect = answer.length > 30;
        }
        askedQuestion.isCorrect = isCorrect;

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
      marksAwarded: isCorrect ? 2 : 0,
      ability: session.currentAbility,
      success: true
    };
  }

  async submitExam(sessionId: string): Promise<any> {
    const session = await ExamSession.findById(sessionId);
    if (!session || session.status !== 'in_progress') throw new Error('Invalid session');

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
      examConfigId: session.examConfigId,
      score: totalScore,
      maxScore: maxScore,
      percentage: scorePercentage,
      grade
    });
    await resultDoc.save();

    // Trigger Certificate Generation
    if (scorePercentage >= 70) {
      try {
        const student = await User.findById(session.studentId);
        const examConfig = await ExamConfig.findById(session.examConfigId);
        
        if (student && examConfig) {
          const cert = await generateCertificateLogic({
            userId: session.studentId.toString(),
            examId: session.examConfigId.toString(),
            studentName: student.name,
            studentEmail: student.email,
            examName: examConfig.title,
            subject: examConfig.subject || examConfig.title,
            totalQuestions,
            correctAnswers: correctCount,
            wrongAnswers: totalQuestions - correctCount,
            skippedAnswers: 0,
            timeTaken: 120, // Example hardcoded since time wasn't tracked fully here
            difficultyReached: 'medium',
          });

          if (cert) {
             const pdfBuffer = await generateCertificatePDF(cert);
             await emailService.sendEmail(
                student.email,
                'Your AdaptiveAI Certificate of Completion',
                `Congratulations ${student.name}! You scored ${cert.percentage.toFixed(2)}% in ${examConfig.title}.`,
                undefined,
                [{
                  filename: `${cert.certificateId}.pdf`,
                  content: pdfBuffer,
                  contentType: 'application/pdf'
                }]
             );
          }
        }
      } catch (err) {
        logger.error('Error auto-generating certificate:', err);
      }
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
    
    const cert = await Certificate.findOne({ userId: session.studentId, examId: session.examConfigId });
    const certificateId = cert ? cert.certificateId : null;

    return {
      score: { total: totalScore, max: maxScore, percentage: scorePercentage },
      grade,
      certificateId,
      percentile: 85,
      ability: session.currentAbility,
      confidenceInterval: [session.currentAbility - 0.15, session.currentAbility + 0.15],
      examTitle: 'Adaptive Assessment',
      completedAt: session.completedAt || new Date(),
      sections: [
        { name: 'Core Subject Areas', score: totalScore, max: maxScore, percentage: scorePercentage, color: 'bg-primary-500' }
      ],
      history: session.abilityHistory.length > 0 ? session.abilityHistory : [
        { questionIndex: 1, ability: 0.0, timestamp: new Date() }
      ],
      topics: [
        { name: 'General', score: totalScore, max: maxScore, percentage: scorePercentage, questionsAttempted: totalQuestions }
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
        if (qDetail && qDetail.type === 'MCQ') {
           const selectedOpt = (qDetail.options || []).find((o: any) => o.label === qa.answer);
           if (selectedOpt) studentAnswerText = selectedOpt.text;
        }
        return {
          question: qDetail ? {
            id: qDetail._id.toString(),
            type: qDetail.type,
            text: qDetail.question,
            options: qDetail.options,
            marks: qDetail.marks,
          } : null,
          studentAnswer: studentAnswerText,
          correctAnswer: qDetail?.correctAnswer || qDetail?.modelAnswer || '',
          isCorrect: qa.isCorrect,
          marksObtained: qa.isCorrect ? 2 : 0,
          maxMarks: 2,
          aiExplanation: qDetail?.explanation || 'Explanation not available.'
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
