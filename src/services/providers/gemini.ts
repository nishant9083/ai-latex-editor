import axios from 'axios';
import type { AIProvider, AIMessage, AIResponse, ChatOptions } from '../../types/ai';

export class GeminiProvider implements AIProvider {
  name = 'Google Gemini';
  type = 'gemini' as const;
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gemini-pro') {
    this.apiKey = apiKey;
    this.model = model;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key is not configured');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    // Convert messages to Gemini format
    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const systemInstruction = messages.find((m) => m.role === 'system')?.content;

    try {
      const response = await axios.post(url, {
        contents,
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 2048,
        },
      });

      const candidate = response.data.candidates?.[0];
      if (!candidate) {
        throw new Error('No response from Gemini');
      }

      return {
        content: candidate.content.parts[0].text,
        usage: {
          promptTokens: response.data.usageMetadata?.promptTokenCount ?? 0,
          completionTokens: response.data.usageMetadata?.candidatesTokenCount ?? 0,
          totalTokens: response.data.usageMetadata?.totalTokenCount ?? 0,
        },
      };
    } catch (error: any) {
      throw new Error(`Gemini API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
