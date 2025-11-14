import { AIProvider, AIProviderType, ProviderSettings } from '../types/ai';
import { GeminiProvider } from './providers/gemini';
import { OllamaProvider } from './providers/ollama';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';

export class AIService {
  private static instance: AIService;
  private currentProvider: AIProvider | null = null;
  private settings: ProviderSettings = {};

  private constructor() {
    this.loadSettings();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private loadSettings() {
    const saved = localStorage.getItem('ai-provider-settings');
    if (saved) {
      this.settings = JSON.parse(saved);
      this.loadProvider();
    }
  }

  saveSettings(settings: ProviderSettings) {
    this.settings = settings;
    localStorage.setItem('ai-provider-settings', JSON.stringify(settings));
  }

  getSettings(): ProviderSettings {
    return { ...this.settings };
  }

  setProvider(type: AIProviderType): void {
    switch (type) {
      case 'gemini':
        if (this.settings.gemini?.apiKey) {
          this.currentProvider = new GeminiProvider(
            this.settings.gemini.apiKey,
            this.settings.gemini.model
          );
        }
        break;
      case 'ollama':
        if (this.settings.ollama?.endpoint) {
          this.currentProvider = new OllamaProvider(
            this.settings.ollama.endpoint,
            this.settings.ollama.model
          );
        }
        break;
      case 'openai':
        if (this.settings.openai?.apiKey) {
          this.currentProvider = new OpenAIProvider(
            this.settings.openai.apiKey,
            this.settings.openai.model
          );
        }
        break;
      case 'anthropic':
        if (this.settings.anthropic?.apiKey) {
          this.currentProvider = new AnthropicProvider(
            this.settings.anthropic.apiKey,
            this.settings.anthropic.model
          );
        }
        break;
    }
  }

  loadProvider(): void {
    if (this.currentProvider) {
      return;
    }
    if (this.settings.gemini?.apiKey) {
        this.setProvider('gemini');
    } else if (this.settings.ollama?.endpoint) {
        this.setProvider('ollama');
    } else if (this.settings.openai?.apiKey) {
        this.setProvider('openai'); 
    } else if (this.settings.anthropic?.apiKey) {
        this.setProvider('anthropic');
    }
  }

  getProvider(): AIProvider | null {
    return this.currentProvider;
  }

  isConfigured(): boolean {
    return this.currentProvider?.isConfigured() ?? false;
  }
}
