import { Request, Response, NextFunction } from 'express';
import { examOrchestrator } from '../services/examOrchestrator';
import { ExamSession } from '../models/ExamSession';

import { ExamConfig } from '../models/ExamConfig';

export class ExamController {
  async searchExams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, domain, subject } = req.query;
      
      const query: any = { status: 'active' };
      
      if (domain) {
        // Here we assume subject maps to domain conceptually or we search pool subjects
        // For strict matching if 'domain' was used in the schema:
        // query['questionPool.subjects'] = { $in: [domain] };
        // We'll just search the subject field for domain to keep it simple, since original DB has 'subject: "Computer Science"'
        query.subject = new RegExp(domain as string, 'i');
      }
      
      if (subject) {
        query['questionPool.chapters'] = new RegExp(subject as string, 'i');
      }

      if (search) {
        const searchRegex = new RegExp(search as string, 'i');
        query.$or = [
          { title: searchRegex },
          { subject: searchRegex },
          { description: searchRegex }
        ];
      }

      const exams = await ExamConfig.find(query).select('-__v -assignedTo').lean();
      res.status(200).json({ success: true, data: exams });
    } catch (error) {
      next(error);
    }
  }

  async getExamDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { examId } = req.params;
      const exam = await ExamConfig.findById(examId).lean();
      
      if (!exam) {
        res.status(404).json({ success: false, message: 'Exam not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: exam });
    } catch (error) {
      next(error);
    }
  }

  async startExam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user.userId;
      const { domain, subject, questionType, numberOfQuestions, language } = req.body;
      const payload = { domain, subject, questionType, numberOfQuestions, language };
      const session = await examOrchestrator.startExam(studentId, payload);
      res.status(200).json({ 
        success: true, 
        data: {
          ...session.toObject(),
          sessionId: session._id,
          config: {
            title: `${subject} Exam`,
            durationSeconds: numberOfQuestions * 120, // 2 mins per question
            questionLimit: numberOfQuestions
          }
        } 
      });
    } catch (error) {
      next(error);
    }
  }

  async getNextQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const question = await examOrchestrator.getNextQuestion(sessionId);
      res.status(200).json({ success: true, data: question });
    } catch (error) {
      next(error);
    }
  }

  async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const { questionId, answer, timeSpent } = req.body;
      const result = await examOrchestrator.submitAnswer(sessionId, questionId, answer, timeSpent);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async submitExam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const result = await examOrchestrator.submitExam(sessionId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const session = await ExamSession.findById(sessionId);
      if (!session) {
        res.status(404).json({ success: false, message: 'Session not found' });
        return;
      }
      res.status(200).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  }

  async getResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const result = await examOrchestrator.getResult(sessionId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user.userId;
      const history = await ExamSession.find({ studentId, status: 'completed' })
        .populate('examConfigId')
        .sort({ completedAt: -1 });

      const formattedHistory = history.map((session: any) => ({
        sessionId: session._id,
        title: session.examConfigId?.title || session.subject || 'Full Stack Engineering Evaluation',
        grade: session.grade || 'B',
        score: session.percentage || 75,
        completedAt: session.completedAt || session.updatedAt
      }));

      res.status(200).json({ success: true, data: formattedHistory });
    } catch (error) {
      next(error);
    }
  }
}

export const examController = new ExamController();
