import { Request, Response } from 'express';
import { DailyStudyPlan, IStudyPlanTask } from '../models/DailyStudyPlan';
import { ExamSession } from '../models/ExamSession';
import { Question } from '../models/Question';
import mongoose from 'mongoose';

const GOAL_MINUTES = 30;
const CHALLENGE_MINUTES = 5;
const REMAINING_MINUTES = GOAL_MINUTES - CHALLENGE_MINUTES; // 25

export const getTodayPlan = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const todayDate = new Date().toISOString().split('T')[0];

    // Check if plan already exists for today
    let plan = await DailyStudyPlan.findOne({ userId, date: todayDate });
    if (plan) {
      // Also calculate average from last 5 for display
      const lastExams = await ExamSession.find({ studentId: userId, status: 'completed' })
        .sort({ completedAt: -1 })
        .limit(5);
        
      let averageScore = 0;
      let latestScore = 0;
      let trend = 'Neutral';

      if (lastExams.length > 0) {
        averageScore = Math.round(lastExams.reduce((sum, exam) => sum + (exam.percentage || 0), 0) / lastExams.length);
        latestScore = Math.round(lastExams[0].percentage || 0);
        if (lastExams.length >= 2) {
           const prevScore = Math.round(lastExams[1].percentage || 0);
           if (latestScore > prevScore) trend = 'Improving';
           else if (latestScore < prevScore) trend = 'Declining';
        }
      }

      return res.status(200).json({ 
        success: true, 
        plan, 
        stats: { averageScore, latestScore, trend, examCount: lastExams.length } 
      });
    }

    // Generate new plan
    const lastExams = await ExamSession.find({ studentId: userId, status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(5);

    if (lastExams.length === 0) {
      return res.status(200).json({ 
        success: true, 
        needsData: true, 
        message: 'No completed exams found' 
      });
    }

    // Analyze performance
    const topicStats: Record<string, { subject: string; correct: number; total: number }> = {};
    const subjectStats: Record<string, { correct: number; total: number }> = {};
    
    // We need to populate the questions to get the topics
    const examIds = lastExams.map(e => e._id);
    const examsWithQuestions = await ExamSession.find({ _id: { $in: examIds } }).populate('questionsAsked.questionId');

    for (const exam of examsWithQuestions) {
      for (const asked of exam.questionsAsked) {
        const q = asked.questionId as any;
        if (!q) continue;
        
        const subject = exam.subject || q.subject || 'General';
        const topic = q.topic || 'General';
        const isCorrect = asked.isCorrect ? 1 : 0;
        
        const topicKey = `${subject}::${topic}`;

        if (!topicStats[topicKey]) topicStats[topicKey] = { subject, correct: 0, total: 0 };
        topicStats[topicKey].correct += isCorrect;
        topicStats[topicKey].total += 1;

        if (!subjectStats[subject]) subjectStats[subject] = { correct: 0, total: 0 };
        subjectStats[subject].correct += isCorrect;
        subjectStats[subject].total += 1;
      }
    }

    // Calculate accuracies
    const topicsArray = Object.entries(topicStats).map(([key, stat]) => {
      const [subject, topic] = key.split('::');
      return {
        subject,
        topic,
        accuracy: stat.total > 0 ? (stat.correct / stat.total) * 100 : 0,
        total: stat.total
      };
    });

    // Sort by accuracy ascending
    topicsArray.sort((a, b) => a.accuracy - b.accuracy);

    // Filter to top 3 worst areas for tasks
    const tasks: IStudyPlanTask[] = [];

    if (topicsArray.length > 0) {
      // Top priority (weakest)
      tasks.push({
        type: 'practice',
        subject: topicsArray[0].subject,
        topic: topicsArray[0].topic,
        title: topicsArray[0].subject,
        durationMinutes: 10,
        completed: false
      });
    }

    if (topicsArray.length > 1) {
      // Secondary Area
      tasks.push({
        type: 'practice',
        subject: topicsArray[1].subject,
        topic: topicsArray[1].topic,
        title: topicsArray[1].subject,
        durationMinutes: 8,
        completed: false
      });
    }

    if (topicsArray.length > 2) {
      // Maintenance
      tasks.push({
        type: 'maintenance',
        subject: topicsArray[2].subject,
        topic: topicsArray[2].topic,
        title: topicsArray[2].subject,
        durationMinutes: 7,
        completed: false
      });
    }

    // Daily Challenge
    tasks.push({
      type: 'daily_challenge',
      title: 'Daily Challenge',
      durationMinutes: 5,
      completed: false
    });

    const newPlan = new DailyStudyPlan({
      userId,
      date: todayDate,
      goalMinutes: GOAL_MINUTES,
      completedMinutes: 0,
      totalMinutes: GOAL_MINUTES,
      tasks
    });

    await newPlan.save();

    let averageScore = Math.round(lastExams.reduce((sum, exam) => sum + (exam.percentage || 0), 0) / lastExams.length);
    let latestScore = Math.round(lastExams[0].percentage || 0);
    let trend = 'Neutral';
    if (lastExams.length >= 2) {
       const prevScore = Math.round(lastExams[1].percentage || 0);
       if (latestScore > prevScore) trend = 'Improving';
       else if (latestScore < prevScore) trend = 'Declining';
    }

    return res.status(200).json({ 
      success: true, 
      plan: newPlan,
      stats: { averageScore, latestScore, trend, examCount: lastExams.length } 
    });

  } catch (error: any) {
    console.error('Error generating study plan:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const startTask = async (req: Request, res: Response) => {
  try {
    const { planId, taskId } = req.params;
    const plan = await DailyStudyPlan.findById(planId);
    
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    
    const task = plan.tasks.find((t: any) => t._id.toString() === taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // If it's a practice task, we fetch relevant questions
    let questions: any[] = [];
    if (task.type === 'practice' || task.type === 'maintenance') {
      const query: any = { isActive: true };
      if (task.subject && task.subject !== 'General') query.subject = task.subject;
      if (task.topic && task.topic !== 'General') query.topic = task.topic;
      
      // Calculate how many questions based on duration (e.g. 1 question per minute)
      const numQuestions = task.durationMinutes;
      
      questions = await Question.aggregate([
        { $match: query },
        { $sample: { size: numQuestions } }
      ]);
      
      // Fallback to subject only if topics don't have enough questions
      if (questions.length === 0 && task.subject && task.subject !== 'General') {
         questions = await Question.aggregate([
          { $match: { subject: task.subject, isActive: true } },
          { $sample: { size: numQuestions } }
        ]);
      }
    }

    res.status(200).json({ success: true, task, questions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const completeTask = async (req: Request, res: Response) => {
  try {
    const { planId, taskId } = req.params;
    const plan = await DailyStudyPlan.findById(planId);
    
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    
    const task = plan.tasks.find((t: any) => t._id.toString() === taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (!task.completed) {
      task.completed = true;
      task.completedAt = new Date();
      plan.completedMinutes += task.durationMinutes;
      
      // Safety bounds
      if (plan.completedMinutes > plan.totalMinutes) {
         plan.completedMinutes = plan.totalMinutes;
      }
      
      await plan.save();
    }

    res.status(200).json({ success: true, plan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
