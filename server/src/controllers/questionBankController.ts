import { Request, Response } from 'express';
import { Question } from '../models/Question';

export const questionBankController = {
  getDomains: async (req: Request, res: Response) => {
    try {
      // Get unique domains and the count of subjects in each
      const domainsInfo = await Question.aggregate([
        {
          $group: {
            _id: { domain: '$domain', subject: '$subject' }
          }
        },
        {
          $group: {
            _id: '$_id.domain',
            subjectCount: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const formattedDomains = domainsInfo.map(d => ({
        name: d._id,
        subjectCount: d.subjectCount
      }));

      res.status(200).json({ success: true, data: formattedDomains });
    } catch (error) {
      console.error('Error fetching domains:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getSubjects: async (req: Request, res: Response) => {
    try {
      const { domain } = req.query;

      const subjectsInfo = await Question.aggregate([
        { $match: { domain } },
        {
          $group: {
            _id: { subject: '$subject', type: '$questionType' },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.subject',
            counts: {
              $push: {
                type: '$_id.type',
                count: '$count'
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const formattedSubjects = subjectsInfo.map(s => {
        const mcqCount = s.counts.find((c: any) => c.type === 'MCQ')?.count || 0;
        const saqCount = s.counts.find((c: any) => c.type === 'SAQ')?.count || 0;
        
        return {
          name: s._id,
          mcqCount,
          saqCount,
          totalQuestions: mcqCount + saqCount
        };
      });

      res.status(200).json({ success: true, data: formattedSubjects });
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getQuestionCount: async (req: Request, res: Response) => {
    try {
      const { domain, subject, questionType } = req.query;
      
      const query: any = {};
      if (domain) query.domain = domain;
      if (subject) query.subject = subject;
      if (questionType) query.questionType = questionType;

      const count = await Question.countDocuments(query);

      res.status(200).json({ success: true, count });
    } catch (error) {
      console.error('Error fetching question count:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};
