import axios from 'axios';
import { env } from '../config/env';

export interface GradeDTO {
  answerText: string;
  modelAnswer: string;
  rubric: Array<{ criteria: string; weight: number }>;
}

export interface GradeResult {
  contentScore: number;
  grammarScore: number;
  coherenceScore: number;
  rubricScore: number;
  finalScore: number;
  confidence: number;
  explanation: string;
}

export interface PlagiarismDTO {
  answerText: string;
  modelAnswer: string;
}

export interface PlagiarismResult {
  isPlagiarized: boolean;
  similarityScore: number;
  matchedSources: Array<{ source: string; similarity: number; url?: string }>;
}

export interface ExplainDTO {
  gradeData: GradeResult;
}

export class NLPClient {
  private baseURL = env.NLP_ENGINE_URL;

  async gradeDescriptive(data: GradeDTO): Promise<GradeResult> {
    const response = await axios.post(`${this.baseURL}/grade-descriptive`, data);
    return response.data;
  }

  async checkPlagiarism(data: PlagiarismDTO): Promise<PlagiarismResult> {
    const response = await axios.post(`${this.baseURL}/check-plagiarism`, data);
    return response.data;
  }

  async explainGrade(data: ExplainDTO): Promise<{ explanation: string; highlightedSegments: any[] }> {
    const response = await axios.post(`${this.baseURL}/explain-grade`, data);
    return response.data;
  }
}

export const nlpClient = new NLPClient();
