const mongoose = require('mongoose');

async function seedMoreMocks() {
  await mongoose.connect('mongodb://localhost:27017/adaptiveai');
  const db = mongoose.connection.db;
  const questionsCollection = db.collection('questions');

  const mockQuestions = [
    {
      subject: 'Full Stack Engineering',
      chapter: 'Full Stack Engineering',
      topic: 'Node.js',
      question: 'Which of the following is true about Node.js event loop?',
      type: 'MCQ',
      difficulty: 'medium',
      discrimination: 1,
      guessing: 0.25,
      bloomLevel: 'apply',
      tags: [],
      marks: 2,
      options: [
        { label: 'A', text: 'It runs in a separate process for each request' },
        { label: 'B', text: 'It handles asynchronous operations in a single thread' },
        { label: 'C', text: 'It blocks the main thread during I/O operations' },
        { label: 'D', text: 'It can only handle HTTP requests' }
      ],
      correctAnswer: 'B',
      explanation: 'Node.js uses a single-threaded event loop to handle non-blocking asynchronous I/O operations.',
      translations: {
        hi: {
          question: 'Node.js इवेंट लूप के बारे में निम्नलिखित में से कौन सा सत्य है?',
          options: [
            { label: 'A', text: 'यह प्रत्येक अनुरोध के लिए एक अलग प्रक्रिया (process) में चलता है' },
            { label: 'B', text: 'यह एक सिंगल थ्रेड में एसिंक्रोनस ऑपरेशन्स को संभालता है' },
            { label: 'C', text: 'यह I/O ऑपरेशन्स के दौरान मुख्य थ्रेड को ब्लॉक करता है' },
            { label: 'D', text: 'यह केवल HTTP अनुरोधों को संभाल सकता है' }
          ],
          explanation: 'Node.js गैर-अवरुद्ध एसिंक्रोनस I/O संचालन को संभालने के लिए सिंगल-थ्रेडेड इवेंट लूप का उपयोग करता है।'
        },
        bn: {
          question: 'Node.js ইভেন্ট লুপ সম্পর্কে নিচের কোনটি সত্য?',
          options: [
            { label: 'A', text: 'এটি প্রতিটি অনুরোধের জন্য একটি পৃথক প্রক্রিয়ায় চলে' },
            { label: 'B', text: 'এটি একক থ্রেডে অ্যাসিঙ্ক্রোনাস অপারেশন পরিচালনা করে' },
            { label: 'C', text: 'এটি I/O অপারেশনের সময় মূল থ্রেডকে ব্লক করে' },
            { label: 'D', text: 'এটি শুধুমাত্র HTTP অনুরোধ পরিচালনা করতে পারে' }
          ],
          explanation: 'Node.js নন-ব্লকিং অ্যাসিঙ্ক্রোনাস I/O অপারেশন পরিচালনা করার জন্য একটি একক-থ্রেডেড ইভেন্ট লুপ ব্যবহার করে।'
        }
      },
      generatedBy: 'AI',
      verified: true,
      isActive: true,
      version: 1,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      subject: 'Full Stack Engineering',
      chapter: 'Full Stack Engineering',
      topic: 'Database',
      question: 'What is the primary benefit of database indexing?',
      type: 'MCQ',
      difficulty: 'hard',
      discrimination: 1,
      guessing: 0.25,
      bloomLevel: 'apply',
      tags: [],
      marks: 2,
      options: [
        { label: 'A', text: 'It reduces the storage space required for tables' },
        { label: 'B', text: 'It speeds up data retrieval operations' },
        { label: 'C', text: 'It automatically encrypts sensitive data' },
        { label: 'D', text: 'It prevents SQL injection attacks' }
      ],
      correctAnswer: 'B',
      explanation: 'Indexes create a data structure that helps the database engine locate rows much faster.',
      translations: {
        hi: {
          question: 'डेटाबेस इंडेक्सिंग का प्राथमिक लाभ क्या है?',
          options: [
            { label: 'A', text: 'यह तालिकाओं के लिए आवश्यक भंडारण स्थान को कम करता है' },
            { label: 'B', text: 'यह डेटा पुनर्प्राप्ति कार्यों को गति देता है' },
            { label: 'C', text: 'यह संवेदनशील डेटा को स्वचालित रूप से एन्क्रिप्ट करता है' },
            { label: 'D', text: 'यह SQL इंजेक्शन हमलों को रोकता है' }
          ],
          explanation: 'इंडेक्स एक डेटा संरचना बनाते हैं जो डेटाबेस इंजन को पंक्तियों को बहुत तेज़ी से खोजने में मदद करता है।'
        },
        bn: {
          question: 'ডেটাবেস ইনডেক্সিং এর প্রাথমিক সুবিধা কি?',
          options: [
            { label: 'A', text: 'এটি টেবিলের জন্য প্রয়োজনীয় স্টোরেজ স্পেস কমায়' },
            { label: 'B', text: 'এটি ডেটা পুনরুদ্ধারের ক্রিয়াকলাপকে গতি দেয়' },
            { label: 'C', text: 'এটি সংবেদনশীল ডেটা স্বয়ংক্রিয়ভাবে এনক্রিপ্ট করে' },
            { label: 'D', text: 'এটি SQL ইনজেকশন আক্রমণ প্রতিরোধ করে' }
          ],
          explanation: 'ইনডেক্সগুলি এমন একটি ডেটা স্ট্রাকচার তৈরি করে যা ডেটাবেস ইঞ্জিনকে সারিগুলি খুব দ্রুত সনাক্ত করতে সহায়তা করে।'
        }
      },
      generatedBy: 'AI',
      verified: true,
      isActive: true,
      version: 1,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await questionsCollection.insertMany(mockQuestions);
  console.log('Successfully injected more native translated questions into the database.');
  process.exit(0);
}

seedMoreMocks().catch(console.error);
