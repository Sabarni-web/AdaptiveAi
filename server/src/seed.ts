import mongoose from 'mongoose';
import { User } from './models/User';
import { Question } from './models/Question';
import { ExamConfig } from './models/ExamConfig';
import { logger } from './utils/logger';

export const seedDatabase = async () => {
  try {
    // 1. Ensure we have at least one admin/teacher user
    let user = await User.findOne({ email: 'instructor@adaptiveai.com' });
    if (!user) {
      user = new User({
        name: 'System Instructor',
        email: 'instructor@adaptiveai.com',
        password: '$2b$10$R2IVz619A/ahvAwb9zj93uBbqP4Oc2OxkOsQ4EauRq7CM.A4G4kI6', // hash for 'password'
        role: 'teacher'
      });
      await user.save();
      logger.info('Default instructor user seeded.');
    }

    let student = await User.findOne({ email: 'student@adaptiveai.com' });
    if (!student) {
      student = new User({
        name: 'Demo Student',
        email: 'student@adaptiveai.com',
        password: '$2b$10$R2IVz619A/ahvAwb9zj93uBbqP4Oc2OxkOsQ4EauRq7CM.A4G4kI6', // hash for 'password'
        role: 'student'
      });
      await student.save();
      logger.info('Default student user seeded.');
    }

    const userId = user._id as mongoose.Types.ObjectId;

    // 2. Ensure we have the evaluation ExamConfig
    const configId = new mongoose.Types.ObjectId('65f1a2b3c4d5e6f7a8b9c0d1');
    const existingConfig = await ExamConfig.findById(configId);
    if (!existingConfig) {
      const config = new ExamConfig({
        _id: configId,
        title: 'Full Stack Engineering Evaluation',
        subject: 'Computer Science',
        description: 'Take the computer science adaptive evaluation test containing algorithmic and system design questions.',
        createdBy: userId,
        adaptiveSettings: {
          initialQuestions: 1,
          minQuestions: 5,
          maxQuestions: 5,
          targetPrecision: 0.3,
          abilityPrior: 0.0
        },
        questionPool: {
          subjects: ['Computer Science'],
          chapters: ['Data Structures', 'Database Systems', 'System Design'],
          bloomLevels: ['understand', 'apply', 'analyze'],
          tags: ['fullstack', 'core'],
          questionCount: 5
        },
        gradingConfig: {
          mcqWeight: 1,
          descriptiveWeight: 1,
          passingPercentage: 50
        },
        security: {
          shuffleQuestions: true,
          shuffleOptions: true,
          allowNavigation: false,
          showResultImmediately: true,
          fullscreenRequired: false
        },
        status: 'active'
      });
      await config.save();
      logger.info('Default ExamConfig seeded.');
    }

    // 3. Ensure we have sample questions
    const questionCount = await Question.countDocuments();
    if (questionCount === 0) {
      const sampleQuestions = [
        {
          subject: 'Computer Science',
          chapter: 'Data Structures',
          topic: 'Binary Search Trees',
          question: '<p>What is the time complexity of searching in a balanced Binary Search Tree (BST)?</p>',
          type: 'MCQ',
          difficulty: 0.5,
          discrimination: 1.0,
          guessing: 0.25,
          bloomLevel: 'understand',
          tags: ['fullstack', 'core'],
          marks: 2,
          options: [
            { label: 'A', text: 'O(1)' },
            { label: 'B', text: 'O(log n)' },
            { label: 'C', text: 'O(n)' },
            { label: 'D', text: 'O(n log n)' }
          ],
          correctAnswer: 'B',
          createdBy: userId
        },
        {
          subject: 'Computer Science',
          chapter: 'Database Systems',
          topic: 'Normalization',
          question: '<p>Which of the following database normal forms eliminates transitive dependencies?</p>',
          type: 'MCQ',
          difficulty: 1.0,
          discrimination: 1.2,
          guessing: 0.25,
          bloomLevel: 'apply',
          tags: ['fullstack', 'core'],
          marks: 3,
          options: [
            { label: 'A', text: '1NF' },
            { label: 'B', text: '2NF' },
            { label: 'C', text: '3NF' },
            { label: 'D', text: 'BCNF' }
          ],
          correctAnswer: 'C',
          createdBy: userId
        },
        {
          subject: 'Computer Science',
          chapter: 'System Design',
          topic: 'Concurrency Control',
          question: '<p>Explain the difference between optimistic concurrency control and pessimistic concurrency control in database transactions.</p>',
          type: 'DESCRIPTIVE',
          difficulty: 1.8,
          discrimination: 1.5,
          guessing: 0.0,
          bloomLevel: 'analyze',
          tags: ['fullstack', 'core'],
          marks: 5,
          modelAnswer: 'Pessimistic concurrency control locks data items to prevent conflict. Optimistic concurrency control allows transactions to proceed without locks and checks for conflicts at commit time.',
          createdBy: userId
        },
        {
          subject: 'Computer Science',
          chapter: 'Frontend Engineering',
          topic: 'React Hooks',
          question: '<p>In React, what is the main purpose of the <code>useEffect</code> hook?</p>',
          type: 'MCQ',
          difficulty: 0.2,
          discrimination: 0.8,
          guessing: 0.25,
          bloomLevel: 'understand',
          tags: ['fullstack', 'core'],
          marks: 2,
          options: [
            { label: 'A', text: 'To update the state directly' },
            { label: 'B', text: 'To handle side effects in functional components' },
            { label: 'C', text: 'To perform heavy mathematical calculations' },
            { label: 'D', text: 'To memoize expensive child components' }
          ],
          correctAnswer: 'B',
          createdBy: userId
        },
        {
          subject: 'Computer Science',
          chapter: 'System Design',
          topic: 'WebSockets',
          question: '<p>Which protocol is primarily used to transmit real-time bidirectional message packets over a TCP socket?</p>',
          type: 'MCQ',
          difficulty: 0.8,
          discrimination: 1.1,
          guessing: 0.25,
          bloomLevel: 'apply',
          tags: ['fullstack', 'core'],
          marks: 2,
          options: [
            { label: 'A', text: 'HTTP/1.1' },
            { label: 'B', text: 'WebSocket' },
            { label: 'C', text: 'SMTP' },
            { label: 'D', text: 'FTP' }
          ],
          correctAnswer: 'B',
          createdBy: userId
        }
      ];

      await Question.insertMany(sampleQuestions);
      logger.info('Sample evaluation questions seeded.');
    }
  } catch (err) {
    logger.error('Error seeding database:', err);
  }
};
