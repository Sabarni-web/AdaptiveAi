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
    subject: 'Machine Learning',
    questionType: 'SAQ',
    questionText: 'Explain the difference between overfitting and underfitting.',
    difficulty: 'Medium'
  },
  {
    domain: 'CSE AI/ML',
    subject: 'Machine Learning',
    questionType: 'MCQ',
    questionText: 'Which algorithm is typically used for classification?',
    options: [
      { key: 'A', text: 'Linear Regression' },
      { key: 'B', text: 'Logistic Regression' },
      { key: 'C', text: 'K-Means' },
      { key: 'D', text: 'PCA' }
    ],
    correctAnswer: 'B',
    difficulty: 'Easy'
  },
  {
    domain: 'CSE AI/ML',
    subject: 'Machine Learning',
    questionType: 'SAQ',
    questionText: 'What is cross-validation and why is it used?',
    difficulty: 'Medium'
  },
  {
    domain: 'CSE AI/ML',
    subject: 'Machine Learning',
    questionType: 'MCQ',
    questionText: 'What is the purpose of regularization in machine learning models?',
    options: [
      { key: 'A', text: 'To increase model complexity' },
      { key: 'B', text: 'To reduce overfitting' },
      { key: 'C', text: 'To minimize training data' },
      { key: 'D', text: 'To speed up training time' }
    ],
    correctAnswer: 'B',
    difficulty: 'Hard'
  },
  {
    domain: 'CSE AI/ML',
    subject: 'Machine Learning',
    questionType: 'SAQ',
    questionText: 'Describe the Random Forest algorithm in simple terms.',
    difficulty: 'Medium'
  },
  {
    domain: 'CSE AI/ML',
    subject: 'Machine Learning',
    questionType: 'MCQ',
    questionText: 'Which of the following is an unsupervised learning technique?',
    options: [
      { key: 'A', text: 'Support Vector Machines' },
      { key: 'B', text: 'Decision Trees' },
      { key: 'C', text: 'K-Means Clustering' },
      { key: 'D', text: 'Naive Bayes' }
    ],
    correctAnswer: 'C',
    difficulty: 'Easy'
  },
  {
    domain: 'CSE AI/ML',
    subject: 'Machine Learning',
    questionType: 'SAQ',
    questionText: 'How does Gradient Descent optimize a model?',
    difficulty: 'Hard'
  },
  {
    domain: 'CSE AI/ML',
    subject: 'Machine Learning',
    questionType: 'MCQ',
    questionText: 'What evaluation metric is best for imbalanced classification datasets?',
    options: [
      { key: 'A', text: 'Accuracy' },
      { key: 'B', text: 'Mean Squared Error' },
      { key: 'C', text: 'F1 Score' },
      { key: 'D', text: 'R-Squared' }
    ],
    correctAnswer: 'C',
    difficulty: 'Medium'
  },
  {
    domain: 'CSE AI/ML',
    subject: 'Machine Learning',
    questionType: 'MCQ',
    questionText: 'What does SVM stand for?',
    options: [
      { key: 'A', text: 'Simple Vector Model' },
      { key: 'B', text: 'Support Vector Machine' },
      { key: 'C', text: 'Static Variable Method' },
      { key: 'D', text: 'Standard Vector Matrix' }
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
    domain: 'CSE Core',
    subject: 'Data Structures',
    questionType: 'SAQ',
    questionText: 'Explain the difference between a Graph and a Tree.',
    difficulty: 'Medium'
  },
  {
    domain: 'CSE Core',
    subject: 'Data Structures',
    questionType: 'MCQ',
    questionText: 'Which data structure uses FIFO principle?',
    options: [
      { key: 'A', text: 'Queue' },
      { key: 'B', text: 'Stack' },
      { key: 'C', text: 'Array' },
      { key: 'D', text: 'Linked List' }
    ],
    correctAnswer: 'A',
    difficulty: 'Easy'
  },
  {
    domain: 'CSE Core',
    subject: 'Data Structures',
    questionType: 'SAQ',
    questionText: 'What is a Binary Search Tree (BST) and how does it work?',
    difficulty: 'Medium'
  },
  {
    domain: 'CSE Core',
    subject: 'Data Structures',
    questionType: 'MCQ',
    questionText: 'What is the worst-case time complexity of quicksort?',
    options: [
      { key: 'A', text: 'O(n log n)' },
      { key: 'B', text: 'O(n)' },
      { key: 'C', text: 'O(n^2)' },
      { key: 'D', text: 'O(1)' }
    ],
    correctAnswer: 'C',
    difficulty: 'Medium'
  },
  {
    domain: 'CSE Core',
    subject: 'Data Structures',
    questionType: 'SAQ',
    questionText: 'Describe how a hash table handles collisions.',
    difficulty: 'Hard'
  },
  {
    domain: 'CSE Core',
    subject: 'Data Structures',
    questionType: 'MCQ',
    questionText: 'Which traversal visits left, root, then right nodes in a binary tree?',
    options: [
      { key: 'A', text: 'Pre-order' },
      { key: 'B', text: 'Post-order' },
      { key: 'C', text: 'Level-order' },
      { key: 'D', text: 'In-order' }
    ],
    correctAnswer: 'D',
    difficulty: 'Medium'
  },
  {
    domain: 'CSE Core',
    subject: 'Data Structures',
    questionType: 'SAQ',
    questionText: 'What are the advantages of a doubly linked list over a singly linked list?',
    difficulty: 'Hard'
  },
  {
    domain: 'CSE Core',
    subject: 'Data Structures',
    questionType: 'MCQ',
    questionText: 'What data structure is typically used to implement recursion?',
    options: [
      { key: 'A', text: 'Queue' },
      { key: 'B', text: 'Heap' },
      { key: 'C', text: 'Stack' },
      { key: 'D', text: 'Tree' }
    ],
    correctAnswer: 'C',
    difficulty: 'Easy'
  },
  {
    domain: 'CSE Core',
    subject: 'Data Structures',
    questionType: 'MCQ',
    questionText: 'Which graph algorithm finds the shortest path from a source to all other nodes?',
    options: [
      { key: 'A', text: 'Dijkstra’s Algorithm' },
      { key: 'B', text: 'Kruskal’s Algorithm' },
      { key: 'C', text: 'Prim’s Algorithm' },
      { key: 'D', text: 'Depth First Search' }
    ],
    correctAnswer: 'A',
    difficulty: 'Medium'
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
  },
  // --- DEEP LEARNING (9 more) ---
  { domain: 'CSE AI/ML', subject: 'Deep Learning', questionType: 'MCQ', questionText: 'What does CNN stand for?', options: [{key:'A',text:'Convolutional Neural Network'},{key:'B',text:'Complex Neural Network'},{key:'C',text:'Computed Node Network'},{key:'D',text:'Central Neural Node'}], correctAnswer: 'A', difficulty: 'Easy' },
  { domain: 'CSE AI/ML', subject: 'Deep Learning', questionType: 'MCQ', questionText: 'Which neural network is best suited for sequential data?', options: [{key:'A',text:'CNN'},{key:'B',text:'RNN'},{key:'C',text:'MLP'},{key:'D',text:'Autoencoder'}], correctAnswer: 'B', difficulty: 'Medium' },
  { domain: 'CSE AI/ML', subject: 'Deep Learning', questionType: 'MCQ', questionText: 'What is a GAN?', options: [{key:'A',text:'Generative Adversarial Network'},{key:'B',text:'General Artificial Node'},{key:'C',text:'Geometric Algorithm Network'},{key:'D',text:'Gradient Ascent Node'}], correctAnswer: 'A', difficulty: 'Medium' },
  { domain: 'CSE AI/ML', subject: 'Deep Learning', questionType: 'MCQ', questionText: 'What is dropout used for?', options: [{key:'A',text:'Faster training'},{key:'B',text:'Preventing overfitting'},{key:'C',text:'Increasing accuracy directly'},{key:'D',text:'Data augmentation'}], correctAnswer: 'B', difficulty: 'Hard' },
  { domain: 'CSE AI/ML', subject: 'Deep Learning', questionType: 'SAQ', questionText: 'Explain the concept of backpropagation.', difficulty: 'Hard' },
  { domain: 'CSE AI/ML', subject: 'Deep Learning', questionType: 'SAQ', questionText: 'What is a tensor in the context of deep learning?', difficulty: 'Medium' },
  { domain: 'CSE AI/ML', subject: 'Deep Learning', questionType: 'SAQ', questionText: 'Describe the vanishing gradient problem.', difficulty: 'Hard' },
  { domain: 'CSE AI/ML', subject: 'Deep Learning', questionType: 'SAQ', questionText: 'What is the role of pooling layers in a CNN?', difficulty: 'Medium' },
  { domain: 'CSE AI/ML', subject: 'Deep Learning', questionType: 'SAQ', questionText: 'Explain the concept of transfer learning.', difficulty: 'Medium' },
  // --- CRYPTOGRAPHY (9 more) ---
  { domain: 'CSE Cyber Security', subject: 'Cryptography', questionType: 'MCQ', questionText: 'Which of these is an asymmetric encryption algorithm?', options: [{key:'A',text:'AES'},{key:'B',text:'DES'},{key:'C',text:'RSA'},{key:'D',text:'Blowfish'}], correctAnswer: 'C', difficulty: 'Medium' },
  { domain: 'CSE Cyber Security', subject: 'Cryptography', questionType: 'MCQ', questionText: 'What is the primary purpose of a hash function?', options: [{key:'A',text:'Encryption'},{key:'B',text:'Data Integrity'},{key:'C',text:'Compression'},{key:'D',text:'Routing'}], correctAnswer: 'B', difficulty: 'Easy' },
  { domain: 'CSE Cyber Security', subject: 'Cryptography', questionType: 'MCQ', questionText: 'Which algorithm is the current advanced encryption standard?', options: [{key:'A',text:'RSA'},{key:'B',text:'DES'},{key:'C',text:'AES'},{key:'D',text:'MD5'}], correctAnswer: 'C', difficulty: 'Easy' },
  { domain: 'CSE Cyber Security', subject: 'Cryptography', questionType: 'MCQ', questionText: 'What does a digital signature provide?', options: [{key:'A',text:'Confidentiality'},{key:'B',text:'Non-repudiation and Authenticity'},{key:'C',text:'Availability'},{key:'D',text:'Redundancy'}], correctAnswer: 'B', difficulty: 'Medium' },
  { domain: 'CSE Cyber Security', subject: 'Cryptography', questionType: 'MCQ', questionText: 'Which key is used to verify a digital signature?', options: [{key:'A',text:'Private Key'},{key:'B',text:'Public Key'},{key:'C',text:'Session Key'},{key:'D',text:'Symmetric Key'}], correctAnswer: 'B', difficulty: 'Medium' },
  { domain: 'CSE Cyber Security', subject: 'Cryptography', questionType: 'SAQ', questionText: 'Explain Public Key Infrastructure (PKI).', difficulty: 'Hard' },
  { domain: 'CSE Cyber Security', subject: 'Cryptography', questionType: 'SAQ', questionText: 'What is a cryptographic salt and why is it used?', difficulty: 'Medium' },
  { domain: 'CSE Cyber Security', subject: 'Cryptography', questionType: 'SAQ', questionText: 'What is the difference between a block cipher and a stream cipher?', difficulty: 'Hard' },
  { domain: 'CSE Cyber Security', subject: 'Cryptography', questionType: 'SAQ', questionText: 'Explain the Diffie-Hellman key exchange algorithm.', difficulty: 'Hard' },
  // --- DATA VISUALIZATION (9 more) ---
  { domain: 'CSE Data Science', subject: 'Data Visualization', questionType: 'SAQ', questionText: 'What is a scatter plot used for?', difficulty: 'Easy' },
  { domain: 'CSE Data Science', subject: 'Data Visualization', questionType: 'SAQ', questionText: 'Explain what a heat map is.', difficulty: 'Medium' },
  { domain: 'CSE Data Science', subject: 'Data Visualization', questionType: 'SAQ', questionText: 'What is the principle of the data-ink ratio?', difficulty: 'Hard' },
  { domain: 'CSE Data Science', subject: 'Data Visualization', questionType: 'SAQ', questionText: 'Describe a situation where a pie chart is a poor choice.', difficulty: 'Medium' },
  { domain: 'CSE Data Science', subject: 'Data Visualization', questionType: 'MCQ', questionText: 'Which chart is best for showing trends over time?', options: [{key:'A',text:'Bar Chart'},{key:'B',text:'Line Chart'},{key:'C',text:'Pie Chart'},{key:'D',text:'Box Plot'}], correctAnswer: 'B', difficulty: 'Easy' },
  { domain: 'CSE Data Science', subject: 'Data Visualization', questionType: 'MCQ', questionText: 'What does a histogram display?', options: [{key:'A',text:'Frequency distribution'},{key:'B',text:'Categorical totals'},{key:'C',text:'Geographical maps'},{key:'D',text:'Hierarchical data'}], correctAnswer: 'A', difficulty: 'Medium' },
  { domain: 'CSE Data Science', subject: 'Data Visualization', questionType: 'MCQ', questionText: 'Which tool is NOT primarily for data visualization?', options: [{key:'A',text:'Tableau'},{key:'B',text:'PowerBI'},{key:'C',text:'D3.js'},{key:'D',text:'TensorFlow'}], correctAnswer: 'D', difficulty: 'Easy' },
  { domain: 'CSE Data Science', subject: 'Data Visualization', questionType: 'MCQ', questionText: 'What does a box plot show?', options: [{key:'A',text:'Data distribution and outliers'},{key:'B',text:'Exact data values'},{key:'C',text:'Images'},{key:'D',text:'3D surfaces'}], correctAnswer: 'A', difficulty: 'Medium' },
  { domain: 'CSE Data Science', subject: 'Data Visualization', questionType: 'MCQ', questionText: 'Which color scale is best for representing a transition from negative to positive values?', options: [{key:'A',text:'Sequential'},{key:'B',text:'Categorical'},{key:'C',text:'Diverging'},{key:'D',text:'Monochromatic'}], correctAnswer: 'C', difficulty: 'Hard' },
  // --- AGILE METHODOLOGY (9 more) ---
  { domain: 'CSE Software Engineering', subject: 'Agile Methodology', questionType: 'SAQ', questionText: 'What is the Scrum framework?', difficulty: 'Medium' },
  { domain: 'CSE Software Engineering', subject: 'Agile Methodology', questionType: 'SAQ', questionText: 'What is a Kanban board and how is it used?', difficulty: 'Easy' },
  { domain: 'CSE Software Engineering', subject: 'Agile Methodology', questionType: 'SAQ', questionText: 'Explain the role of a Product Owner.', difficulty: 'Medium' },
  { domain: 'CSE Software Engineering', subject: 'Agile Methodology', questionType: 'SAQ', questionText: 'What is backlog grooming (refinement)?', difficulty: 'Medium' },
  { domain: 'CSE Software Engineering', subject: 'Agile Methodology', questionType: 'MCQ', questionText: 'What is the purpose of a daily standup meeting?', options: [{key:'A',text:'To write code'},{key:'B',text:'To sync up on progress and blockers'},{key:'C',text:'To fire employees'},{key:'D',text:'To design architecture'}], correctAnswer: 'B', difficulty: 'Easy' },
  { domain: 'CSE Software Engineering', subject: 'Agile Methodology', questionType: 'MCQ', questionText: 'What is a User Story?', options: [{key:'A',text:'A bug report'},{key:'B',text:'A feature description from the user perspective'},{key:'C',text:'A database schema'},{key:'D',text:'A test case'}], correctAnswer: 'B', difficulty: 'Medium' },
  { domain: 'CSE Software Engineering', subject: 'Agile Methodology', questionType: 'MCQ', questionText: 'What is an Epic in Agile?', options: [{key:'A',text:'A long poem'},{key:'B',text:'A large body of work that can be broken down'},{key:'C',text:'A critical bug'},{key:'D',text:'A daily meeting'}], correctAnswer: 'B', difficulty: 'Medium' },
  { domain: 'CSE Software Engineering', subject: 'Agile Methodology', questionType: 'MCQ', questionText: 'Which of the following is NOT a core value of the Agile Manifesto?', options: [{key:'A',text:'Individuals and interactions'},{key:'B',text:'Comprehensive documentation'},{key:'C',text:'Customer collaboration'},{key:'D',text:'Responding to change'}], correctAnswer: 'B', difficulty: 'Hard' },
  { domain: 'CSE Software Engineering', subject: 'Agile Methodology', questionType: 'MCQ', questionText: 'What does "velocity" measure in Agile?', options: [{key:'A',text:'The speed of the server'},{key:'B',text:'The amount of work a team can tackle during a sprint'},{key:'C',text:'The number of bugs found'},{key:'D',text:'The time taken for a daily standup'}], correctAnswer: 'B', difficulty: 'Medium' }
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
