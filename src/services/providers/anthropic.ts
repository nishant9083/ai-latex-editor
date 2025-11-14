import axios from 'axios';
import type { AIProvider, AIMessage, AIResponse, ChatOptions } from '../../types/ai';

export class AnthropicProvider implements AIProvider {
  name = 'Anthropic Claude';
  type = 'anthropic' as const;
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'claude-3-sonnet-20240229') {
    this.apiKey = apiKey;
    this.model = model;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse> {
    if (!this.isConfigured()) {
      throw new Error('Anthropic API key is not configured');
    }

    const url = 'https://api.anthropic.com/v1/messages';

    // Separate system message from other messages
    const systemMessage = messages.find((m) => m.role === 'system')?.content;
    const conversationMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      const response = await axios.post(
        url,
        {
          model: this.model,
          messages: conversationMessages,
          system: systemMessage,
          max_tokens: options?.maxTokens ?? 2048,
          temperature: options?.temperature ?? 0.7,
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        content: response.data.content[0].text,
        usage: {
          promptTokens: response.data.usage.input_tokens,
          completionTokens: response.data.usage.output_tokens,
          totalTokens: response.data.usage.input_tokens + response.data.usage.output_tokens,
        },
      };
    } catch (error: any) {
      throw new Error(`Anthropic API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
