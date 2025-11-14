import axios from 'axios';

export interface CompilationResult {
  success: boolean;
  pdf?: string; // Base64 encoded PDF
  log?: string;
  errors?: CompilationError[];
}

export interface CompilationError {
  line: number;
  message: string;
  type: 'error' | 'warning';
}

export class LaTeXCompiler {
  // Use local proxy server to avoid CORS issues
  private static readonly PROXY_API = 'http://localhost:3001/api/compile';

  static async compile(latexCode: string, abortSignal?: AbortSignal): Promise<CompilationResult> {
    try {
      // Send LaTeX code to proxy server
      const response = await axios.post(this.PROXY_API, {
        latexCode: latexCode
      }, {
        timeout: 30000, // 30 seconds timeout
        signal: abortSignal,
      });

      if (response.data.success) {
        return {
          success: true,
          pdf: response.data.pdf,
        };
      } else {
        return {
          success: false,
          log: response.data.error,
          errors: response.data.errors || [],
        };
      }
    } catch (error: any) {
      console.error('LaTeX compilation error:', error);

      // Handle network or server errors
      const errorMessage = error.response?.data?.error || error.message;
      const errors = error.response?.data?.errors || [];

      return {
        success: false,
        log: errorMessage,
        errors,
      };
    }
  }
}
