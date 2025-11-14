// AI Provider types and interfaces

export type AIProviderType = 'gemini' | 'ollama' | 'openai' | 'anthropic';

export interface AIProviderConfig {
  type: AIProviderType;
  apiKey?: string;
  endpoint?: string;
  model?: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIProvider {
  name: string;
  type: AIProviderType;
  chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse>;
  isConfigured(): boolean;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ProviderSettings {
  gemini?: {
    apiKey: string;
    model: string;
  };
  ollama?: {
    endpoint: string;
    model: string;
  };
  openai?: {
    apiKey: string;
    model: string;
  };
  anthropic?: {
    apiKey: string;
    model: string;
  };
}
