import { GoogleGenerativeAI } from '@google/generative-ai';
import { IQuestion } from '../models/Question';
import { logger } from '../utils/logger';

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateQuestions(subject: string, difficulty: string, count: number): Promise<any[]> {
    logger.info(`[AI_SERVICE] Request received. Subject: ${subject}, Difficulty: ${difficulty}, Count: ${count}`);
    const prompt = `
You are an expert examination question generation AI for AdaptiveAI Exam.
Your job is to generate exactly ${count} high-quality university-level multiple-choice questions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LANGUAGE RULES (VERY IMPORTANT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You must generate the question in English, and also provide PERFECT translations for Hindi (hi) and Bengali (bn).

1. For Hindi (hi) and Bengali (bn) translations:
   - Generate the ENTIRE question, options, and explanation in the target language.
   - Do NOT mix English sentences.
   - Use English ONLY for internationally accepted technical words (e.g., AWS, Node.js, React.js, MongoDB, PostgreSQL, Docker, Linux, HTTP, HTTPS, REST API, JSON, JavaScript, Python, TCP/IP, SQL, HTML, CSS). Everything else MUST be translated naturally.

2. NEVER prepend language names. 
   INVALID: "(Hindi) What is MERN Stack?" or "(Bengali) What is..."
   VALID (Hindi): "MERN Stack के संदर्भ में 'E' का क्या अर्थ है?"
   VALID (Bengali): "MERN Stack-এ 'E' দ্বারা কী বোঝায়?"

3. Maintain professional academic terminology. Ensure all grammar follows native speakers' writing style.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Conceptual, technically correct, university level, original, and grammatically correct.
- Subject/Topic: ${subject}
- Difficulty: ${difficulty}
- Exactly 4 unique options per question.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY a valid JSON array of objects. Do NOT use markdown. Do NOT add explanations outside JSON.
[
  {
    "question": "English question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "translations": {
      "hi": {
        "question": "Pure Hindi translation of the question (NO PREFIXES)",
        "options": ["Hindi Option 1", "Hindi Option 2", "Hindi Option 3", "Hindi Option 4"],
        "explanation": "Pure Hindi explanation"
      },
      "bn": {
        "question": "Pure Bengali translation of the question (NO PREFIXES)",
        "options": ["Bengali Option 1", "Bengali Option 2", "Bengali Option 3", "Bengali Option 4"],
        "explanation": "Pure Bengali explanation"
      }
    },
    "correctAnswer": "Exact string of the correct option in English",
    "explanation": "English explanation",
    "difficulty": "${difficulty}",
    "topic": "${subject}",
    "marks": 2
  }
]

FINAL RULE: Before returning, verify that the 'hi' object has pure Hindi (except technical terms) and the 'bn' object has pure Bengali.
`;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        logger.info(`[AI_SERVICE] Attempt ${attempt}. Prompt sent to AI: ${prompt.substring(0, 150)}...`);
        const result = await this.model.generateContent(prompt);
        const text = result.response.text().trim();
        logger.info(`[AI_SERVICE] Raw AI response received. Length: ${text.length}`);
        
        // Robust JSON extraction
        let jsonStr = text;
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1].trim();
        } else {
          const startIndex = jsonStr.indexOf('[');
          const endIndex = jsonStr.lastIndexOf(']');
          if (startIndex !== -1 && endIndex !== -1) {
            jsonStr = jsonStr.substring(startIndex, endIndex + 1);
          }
        }
        
        logger.info(`[AI_SERVICE] JSON after parsing: ${jsonStr.substring(0, 200)}...`);

        let questions;
        try {
          questions = JSON.parse(jsonStr);
        } catch (parseErr: any) {
          throw { stage: 'JSON_PARSING', reason: `Invalid JSON syntax: ${parseErr.message}` };
        }

        if (!Array.isArray(questions)) {
          throw { stage: 'VALIDATION', reason: 'Response is not a JSON array' };
        }

        const validatedQuestions = [];
        let validationErrors = [];
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (!q.question) {
            validationErrors.push(`Question ${i}: Missing question text`);
            continue;
          }
          if (!Array.isArray(q.options) || q.options.length !== 4) {
            validationErrors.push(`Question ${i}: Options must be an array of exactly 4 items`);
            continue;
          }
          const uniqueOptions = new Set(q.options);
          if (uniqueOptions.size !== 4) {
            validationErrors.push(`Question ${i}: Duplicate options found`);
            continue;
          }
          if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
            validationErrors.push(`Question ${i}: correctAnswer must exactly match one option`);
            continue;
          }
          if (!q.explanation) {
            validationErrors.push(`Question ${i}: Missing explanation`);
            continue;
          }

          validatedQuestions.push({
            ...q,
            type: 'MCQ',
            bloomLevel: 'apply',
            discrimination: 1,
            guessing: 0.25,
            subject: subject,
            chapter: subject,
            topic: q.topic || subject,
            generatedBy: 'AI',
            verified: true,
            isActive: true,
            marks: 2,
            options: q.options.map((opt: string, i: number) => ({ label: String.fromCharCode(65 + i), text: opt })),
            translations: {
              hi: q.translations?.hi ? {
                question: q.translations.hi.question,
                options: q.translations.hi.options.map((opt: string, i: number) => ({ label: String.fromCharCode(65 + i), text: opt })),
                explanation: q.translations.hi.explanation
              } : undefined,
              bn: q.translations?.bn ? {
                question: q.translations.bn.question,
                options: q.translations.bn.options.map((opt: string, i: number) => ({ label: String.fromCharCode(65 + i), text: opt })),
                explanation: q.translations.bn.explanation
              } : undefined
            }
          });
        }

        if (validatedQuestions.length > 0) {
          logger.info(`[AI_SERVICE] Validation result: Success. ${validatedQuestions.length} valid questions.`);
          return validatedQuestions;
        } else {
          throw { stage: 'VALIDATION', reason: `No valid questions generated. Errors: ${validationErrors.join(', ')}` };
        }

      } catch (error: any) {
        const failureReason = error.stage ? error.reason : error.message;
        logger.error(`[AI_SERVICE] Attempt ${attempt} failed at stage [${error.stage || 'API_CALL'}]: ${failureReason}`);
        
        if (attempt === 3) {
          // Instead of throwing a string error, throw the structured error object
          throw {
            isAIError: true,
            stage: error.stage || 'API_CALL',
            attempt: 3,
            reason: failureReason
          };
        }
      }
    }
    throw { isAIError: true, stage: 'UNKNOWN', attempt: 3, reason: 'Exhausted retries' };
  }

  async evaluateSAQ(question: string, studentAnswer: string, expectedAnswer: string): Promise<{isCorrect: boolean, explanation: string}> {
    const expectedStr = expectedAnswer ? `Expected Answer: ${expectedAnswer}` : "Expected Answer: (Evaluate conceptually based on general correct knowledge for this topic)";
    const prompt = `You are an objective AI grader for an exam. Your task is to evaluate if the student's answer is conceptually correct.
Rules:
1. Be lenient. If the student demonstrates a basic understanding of the core concept, mark it as true.
2. Ignore grammar and spelling mistakes.
3. Do NOT check or care if the answer is AI-generated. Just evaluate factual correctness.
4. Return ONLY a valid JSON object with a boolean field "isCorrect" and a string field "explanation" detailing why it is correct or incorrect.

Question: ${question}
${expectedStr}
Student Answer: ${studentAnswer}`;
    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text().trim();
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const json = JSON.parse(match[0]);
        return {
          isCorrect: json.isCorrect === true,
          explanation: json.explanation || ''
        };
      }
      return { isCorrect: false, explanation: 'Failed to parse AI response' };
    } catch (error) {
      logger.error('[AI_SERVICE] SAQ evaluation failed: ' + error);
      return { isCorrect: false, explanation: 'AI grading service unavailable' };
    }
  }
}

export const aiService = new AIService();
