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
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
  }

  async generateQuestions(subject: string, difficulty: string, count: number): Promise<any[]> {
    const prompt = `
You are an expert examiner. Generate exactly ${count} unique multiple-choice questions for the subject "${subject}" at a "${difficulty}" difficulty level.

Return ONLY a valid JSON array of objects. Do NOT include markdown blocks like \`\`\`json. Each object MUST strictly follow this schema:
{
  "question": "The question text",
  "options": [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4"
  ],
  "correctAnswer": "The exact string of the correct option",
  "explanation": "Detailed explanation of why the answer is correct",
  "difficulty": "${difficulty}",
  "topic": "${subject}",
  "marks": 2
}

Constraints:
1. Exactly 4 unique options per question.
2. The correctAnswer must exactly match one of the options.
3. Provide a clear explanation.
4. Output must be a pure JSON array starting with '[' and ending with ']'.
`;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const text = result.response.text().trim();
        
        let jsonStr = text;
        const startIndex = jsonStr.indexOf('[');
        const endIndex = jsonStr.lastIndexOf(']');
        if (startIndex !== -1 && endIndex !== -1) {
          jsonStr = jsonStr.substring(startIndex, endIndex + 1);
        }

        const questions = JSON.parse(jsonStr);

        if (!Array.isArray(questions)) {
          throw new Error('Response is not a JSON array');
        }

        const validatedQuestions = [];
        for (const q of questions) {
          if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
            logger.warn('AI generated invalid options length or missing question text');
            continue;
          }
          const uniqueOptions = new Set(q.options);
          if (uniqueOptions.size !== 4) {
            logger.warn('AI generated duplicate options');
            continue;
          }
          if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
            logger.warn('AI generated correctAnswer not in options');
            continue;
          }
          if (!q.explanation) {
            logger.warn('AI generated missing explanation');
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
            options: q.options.map((opt: string, i: number) => ({ label: String.fromCharCode(65 + i), text: opt }))
          });
        }

        if (validatedQuestions.length > 0) {
          return validatedQuestions;
        } else {
          throw new Error('No valid questions generated');
        }

      } catch (error: any) {
        logger.error(`AI Generation attempt ${attempt} failed: ${error.message}`);
        if (attempt === 3) {
          throw new Error('Failed to generate valid questions after 3 attempts');
        }
      }
    }
    return [];
  }
}

export const aiService = new AIService();
