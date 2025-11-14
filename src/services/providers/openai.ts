import axios from 'axios';
import type { AIProvider, AIMessage, AIResponse, ChatOptions } from '../../types/ai';

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  type = 'openai' as const;
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gpt-3.5-turbo') {
    this.apiKey = apiKey;
    this.model = model;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key is not configured');
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    try {
      const response = await axios.post(
        url,
        {
          model: this.model,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 2048,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        content: response.data.choices[0].message.content,
        usage: {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens,
        },
      };
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
