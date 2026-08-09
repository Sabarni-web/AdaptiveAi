import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Question } from '../models/Question';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adaptiveai';

const seedData = [
  {
    domain: 'CSE AI/ML',
    subject: 'Machine Learning',
    questionType: 'MCQ',
    questionText: 'What is the most common algorithm for supervised learning?',
    options: [
      { key: 'A', text: 'K-Means' },
      { key: 'B', text: 'Linear Regression' },
      { key: 'C', text: 'Apriori' },
      { key: 'D', text: 'PCA' }
    ],
    correctAnswer: 'B',
    difficulty: 'Easy'
  },
  {
    domain: 'CSE AI/ML',
    subject: 'Deep Learning',
    questionType: 'MCQ',
    questionText: 'Which activation function is widely used in hidden layers?',
    options: [
      { key: 'A', text: 'Sigmoid' },
      { key: 'B', text: 'Tanh' },
      { key: 'C', text: 'ReLU' },
      { key: 'D', text: 'Softmax' }
    ],
    correctAnswer: 'C',
    difficulty: 'Medium'
  },
  {
    domain: 'CSE Core',
    subject: 'Data Structures',
    questionType: 'MCQ',
    questionText: 'Which data structure uses LIFO principle?',
    options: [
      { key: 'A', text: 'Queue' },
      { key: 'B', text: 'Stack' },
      { key: 'C', text: 'Tree' },
      { key: 'D', text: 'Graph' }
    ],
    correctAnswer: 'B',
    difficulty: 'Easy'
  },
  {
    domain: 'CSE Cyber Security',
    subject: 'Cryptography',
    questionType: 'SAQ',
    questionText: 'Explain the difference between symmetric and asymmetric encryption.',
    difficulty: 'Hard'
  },
  {
    domain: 'CSE Data Science',
    subject: 'Data Visualization',
    questionType: 'MCQ',
    questionText: 'Which library is commonly used for plotting in Python?',
    options: [
      { key: 'A', text: 'Numpy' },
      { key: 'B', text: 'Pandas' },
      { key: 'C', text: 'Matplotlib' },
      { key: 'D', text: 'Scikit-learn' }
    ],
    correctAnswer: 'C',
    difficulty: 'Easy'
  },
  {
    domain: 'CSE Software Engineering',
    subject: 'Agile Methodology',
    questionType: 'MCQ',
    questionText: 'What is a sprint in Agile?',
    options: [
      { key: 'A', text: 'A short run' },
      { key: 'B', text: 'A time-boxed iteration' },
      { key: 'C', text: 'A type of requirement' },
      { key: 'D', text: 'A testing phase' }
    ],
    correctAnswer: 'B',
    difficulty: 'Medium'
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing existing questions...');
    await Question.deleteMany({});
    console.log('Existing questions cleared.');

    console.log('Inserting seed data...');
    await Question.insertMany(seedData);
    console.log('Seed data inserted successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
