import axios from 'axios';
import { env } from '../config/env';

export interface AnswerData {
  questionId: string;
  isCorrect: boolean;
  timeSpent?: number;
}

export interface SelectQuestionDTO {
  currentAbility: number;
  answeredQuestions: string[];
  subject: string;
}

export interface StoppingDTO {
  currentAbility: number;
  answeredCount: number;
  confidenceInterval: [number, number];
}

export interface ScoreDTO {
  sessionId: string;
  answers: AnswerData[];
}

export class IRTClient {
  private baseURL = env.ADAPTIVE_ENGINE_URL;

  async estimateAbility(answers: AnswerData[]): Promise<{ ability: number; confidence: number }> {
    const response = await axios.post(`${this.baseURL}/estimate-ability`, { answers });
    return response.data;
  }

  async selectQuestion(params: SelectQuestionDTO): Promise<{ questionId: string; expectedInfo: number }> {
    const response = await axios.post(`${this.baseURL}/select-question`, params);
    return response.data;
  }

  async checkStopping(params: StoppingDTO): Promise<{ shouldStop: boolean; reason: string }> {
    const response = await axios.post(`${this.baseURL}/check-stopping`, params);
    return response.data;
  }

  async calculateScore(params: ScoreDTO): Promise<{ score: number; grade: string; percentile: number }> {
    const response = await axios.post(`${this.baseURL}/calculate-score`, params);
    return response.data;
  }
}

export const irtClient = new IRTClient();
