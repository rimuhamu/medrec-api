import env from '@/env';
import { GoogleGenAI } from '@google/genai';
import type { diagnosticTestResult } from '@/db/schema';

export class LLMService {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: env.LLM_API_KEY,
    });
  }

  async generateSchedule(medsData: string) {
    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [
          {
            text: `You are a planning assistant. Convert the following list of medications and frequencies into a structured daily schedule. Output ONLY valid JSON in this format: [{ \"time_of_day\": \"Morning\", \"medicines\": [\"Med A\"] }]. ${medsData}`,
          },
        ],
      },
    });
    return response.text;
  }

  async generateTestExplanation(testResult: Pick<typeof diagnosticTestResult.$inferSelect, 'title' | 'result'>) {
    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [
          {
            text: "You are a helpful, empathetic medical assistant. Your goal is to explain medical test results to patients in plain English (5th-grade reading level). Avoid scary jargon. Be reassuring but accurate.",
          },
          {
            text: `Test Name: ${testResult.title || 'Unknown Test'}, Result: ${testResult.result || 'No result available'}. Explain this.`,
          },
        ],
      },
    });
    return response.text;
  }
}

export const llmService = new LLMService();
