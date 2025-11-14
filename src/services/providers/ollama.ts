import axios from 'axios';
import type { AIProvider, AIMessage, AIResponse, ChatOptions } from '../../types/ai';

export class OllamaProvider implements AIProvider {
  name = 'Ollama';
  type = 'ollama' as const;
  private endpoint: string;
  private model: string;

  constructor(endpoint = 'http://localhost:11434', model = 'llama2') {
    this.endpoint = endpoint.replace(/\/$/, ''); // Remove trailing slash
    this.model = model;
  }

  isConfigured(): boolean {
    return !!this.endpoint;
  }

  async chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse> {
    if (!this.isConfigured()) {
      throw new Error('Ollama endpoint is not configured');
    }

    const url = `${this.endpoint}/api/chat`;

    try {
      const response = await axios.post(url, {
        model: this.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: false,
        options: {
          temperature: options?.temperature ?? 0.7,
          num_predict: options?.maxTokens ?? 2048,
        },
      });

      return {
        content: response.data.message.content,
        usage: {
          promptTokens: response.data.prompt_eval_count ?? 0,
          completionTokens: response.data.eval_count ?? 0,
          totalTokens: (response.data.prompt_eval_count ?? 0) + (response.data.eval_count ?? 0),
        },
      };
    } catch (error: any) {
      throw new Error(`Ollama API error: ${error.response?.data?.error || error.message}`);
    }
  }
}
