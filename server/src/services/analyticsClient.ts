import axios from 'axios';
import { env } from '../config/env';

export interface PredictionDTO {
  studentId: string;
  examConfigId: string;
}

export interface PredictionResult {
  expectedScore: number;
  confidence: number;
}

export interface ClusterDTO {
  studentIds: string[];
}

export interface ClusterResult {
  clusters: Array<{
    clusterId: string;
    studentIds: string[];
    characteristics: string[];
  }>;
}

export interface RecommendDTO {
  studentId: string;
  weakTopics: string[];
}

export interface RecommendResult {
  topicsToReview: string[];
  suggestedQuestions: string[];
}

export interface ReportDTO {
  examId: string;
  type: 'summary' | 'detailed';
}

export class AnalyticsClient {
  private baseURL = env.ANALYTICS_ENGINE_URL;

  async predictPerformance(data: PredictionDTO): Promise<PredictionResult> {
    const response = await axios.post(`${this.baseURL}/predict-performance`, data);
    return response.data;
  }

  async clusterStudents(data: ClusterDTO): Promise<ClusterResult> {
    const response = await axios.post(`${this.baseURL}/cluster-students`, data);
    return response.data;
  }

  async recommendStudy(data: RecommendDTO): Promise<RecommendResult> {
    const response = await axios.post(`${this.baseURL}/recommend-study`, data);
    return response.data;
  }

  async generateReport(data: ReportDTO): Promise<{ downloadUrl: string }> {
    const response = await axios.post(`${this.baseURL}/generate-report`, data);
    return response.data;
  }
}

export const analyticsClient = new AnalyticsClient();
