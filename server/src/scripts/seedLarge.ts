import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Question } from '../models/Question';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adaptiveai';

const structure = {
  'CSE AI/ML': [
    'COMPUTER VISION', 'DEEP LEARNING', 'MACHINE LEARNING', 'NLP', 'REINFORCEMENT LEARNING', 'STATISTICAL LEARNING'
  ],
  'CSE Core': [
    'Algorithm', 'COMPILER DESIGN', 'COMPUTER NETWORK', 'DATA STRUCTURE', 'DBMS', 'OPERATING SYSTEM', 'THEORY OF COMPUTATION'
  ],
  'CSE Cyber Security': [
    'Cryptography', 'Digital Forensics', 'Ethical Hacking', 'Network Security', 'Risk Management'
  ],
  'CSE Data Science': [
    'BIG DATA', 'BUSINESS INTELLIGENCE', 'DATA MINING', 'DATA VISUALIZATION', 'DATA WAREHOUSING', 'ELT'
  ],
  'CSE Software Engineering': [
    'Agile', 'Cloud Computing', 'Design Patterns', 'DevOps', 'SDLC', 'Testing', 'Web Technologies'
  ]
};

const mcqTemplates = [
  'What is the primary function of concept {i} in {subject}?',
  'Which of the following best describes component {i} in {subject}?',
  'In the context of {subject}, what does principle {i} dictate?',
  'How is algorithm {i} typically applied in {subject}?',
  'What is a common pitfall {i} when working with {subject}?',
  'Which mechanism {i} is most associated with {subject}?',
  'What is the expected outcome {i} in a standard {subject} workflow?',
  'Identify the correct sequence {i} for {subject} operations.',
  'Which metric {i} is crucial for evaluating {subject} performance?',
  'What is the theoretical limit {i} of {subject} scaling?'
];

const saqTemplates = [
  'Explain the significance of concept {i} in {subject}.',
  'Describe a real-world application {i} of {subject}.',
  'Compare and contrast method {i} and alternative methods in {subject}.',
  'What are the main challenges {i} faced in {subject}?',
  'How has the evolution of component {i} impacted {subject}?'
];

async function seedLargeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing existing questions...');
    await Question.deleteMany({});
    console.log('Existing questions cleared.');

    const allQuestions = [];

    for (const [domain, subjects] of Object.entries(structure)) {
      for (const subject of subjects) {
        // Generate 100 MCQs
        for (let i = 1; i <= 100; i++) {
          const template = mcqTemplates[i % mcqTemplates.length];
          const questionText = template.replace('{i}', i.toString()).replace('{subject}', subject);
          
          allQuestions.push({
            domain,
            subject,
            questionType: 'MCQ',
            questionText,
            options: [
              { key: 'A', text: `Implementation focusing on scalability and performance for ${i}` },
              { key: 'B', text: `A theoretical framework proposed in standard ${i} literature` },
              { key: 'C', text: `The primary component responsible for state management in ${subject}` },
              { key: 'D', text: `An obsolete method replaced by modern paradigms (version ${i})` }
            ],
            correctAnswer: String.fromCharCode(65 + (i % 4)), // Cycles A, B, C, D
            difficulty: i % 3 === 0 ? 'Hard' : (i % 2 === 0 ? 'Medium' : 'Easy'),
            answerExplanation: `This is the detailed explanation for concept ${i} in ${subject}.`
          });
        }

        // Generate 50 SAQs
        for (let i = 1; i <= 50; i++) {
          const template = saqTemplates[i % saqTemplates.length];
          const questionText = template.replace('{i}', i.toString()).replace('{subject}', subject);
          
          allQuestions.push({
            domain,
            subject,
            questionType: 'SAQ',
            questionText,
            difficulty: i % 3 === 0 ? 'Hard' : (i % 2 === 0 ? 'Medium' : 'Easy'),
            answerExplanation: `The expected answer should comprehensively cover the key points of concept ${i} in ${subject}.`
          });
        }
      }
    }

    console.log(`Inserting ${allQuestions.length} seed questions...`);
    // Insert in batches to avoid document size limits
    const batchSize = 1000;
    for (let i = 0; i < allQuestions.length; i += batchSize) {
      const batch = allQuestions.slice(i, i + batchSize);
      await Question.insertMany(batch);
      console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(allQuestions.length / batchSize)}`);
    }

    console.log('Large seed data inserted successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding large database:', error);
    process.exit(1);
  }
}

seedLargeDatabase();
