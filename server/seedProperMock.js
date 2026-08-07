const mongoose = require('mongoose');

async function seedMockTranslations() {
  await mongoose.connect('mongodb://localhost:27017/adaptiveai');
  const db = mongoose.connection.db;
  const questionsCollection = db.collection('questions');

  const mockQuestions = [
    {
      subject: 'Full Stack Engineering',
      chapter: 'Full Stack Engineering',
      topic: 'React',
      question: 'What is the primary purpose of the Virtual DOM in React.js?',
      type: 'MCQ',
      difficulty: 'medium',
      discrimination: 1,
      guessing: 0.25,
      bloomLevel: 'apply',
      tags: [],
      marks: 2,
      options: [
        { label: 'A', text: 'To completely replace the actual DOM' },
        { label: 'B', text: 'To improve rendering performance by minimizing actual DOM manipulation' },
        { label: 'C', text: 'To provide a faster network layer for API calls' },
        { label: 'D', text: 'To store state persistently across sessions' }
      ],
      correctAnswer: 'B',
      explanation: 'The Virtual DOM allows React.js to calculate the minimal set of changes needed to update the UI efficiently.',
      translations: {
        hi: {
          question: 'React.js में Virtual DOM का प्राथमिक उद्देश्य क्या है?',
          options: [
            { label: 'A', text: 'वास्तविक DOM को पूरी तरह से बदलने के लिए' },
            { label: 'B', text: 'वास्तविक DOM हेरफेर को कम करके रेंडरिंग प्रदर्शन को बेहतर बनाने के लिए' },
            { label: 'C', text: 'API कॉल के लिए तेज़ नेटवर्क परत प्रदान करने के लिए' },
            { label: 'D', text: 'सत्रों में स्थिति (state) को लगातार संग्रहीत करने के लिए' }
          ],
          explanation: 'Virtual DOM React.js को UI को कुशलतापूर्वक अपडेट करने के लिए आवश्यक न्यूनतम परिवर्तनों की गणना करने की अनुमति देता है।'
        },
        bn: {
          question: 'React.js-এ Virtual DOM-এর প্রাথমিক উদ্দেশ্য কী?',
          options: [
            { label: 'A', text: 'প্রকৃত DOM কে সম্পূর্ণভাবে প্রতিস্থাপন করতে' },
            { label: 'B', text: 'প্রকৃত DOM ম্যানিপুলেশন কমিয়ে রেন্ডারিং কর্মক্ষমতা উন্নত করতে' },
            { label: 'C', text: 'API কলগুলির জন্য দ্রুততর নেটওয়ার্ক স্তর প্রদান করতে' },
            { label: 'D', text: 'সেশন জুড়ে স্টেট স্থায়ীভাবে সংরক্ষণ করতে' }
          ],
          explanation: 'Virtual DOM React.js কে UI দক্ষতার সাথে আপডেট করার জন্য প্রয়োজনীয় ন্যূনতম পরিবর্তনগুলি গণনা করার অনুমতি দেয়।'
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
  console.log('Successfully injected native translated question into the database.');
  process.exit(0);
}

seedMockTranslations().catch(console.error);
