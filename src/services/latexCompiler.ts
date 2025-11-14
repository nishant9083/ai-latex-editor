import axios from 'axios';
import { ProjectFile } from '../store/editorStore';

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
  private static readonly PROXY_API = import.meta.env.VITE_LATEX_API_URL || 'http://localhost:3001/api/compile';

  static async compile(
    latexCode: string, 
    projectFiles?: ProjectFile[],
    abortSignal?: AbortSignal
  ): Promise<CompilationResult> {
    try {
      // Send LaTeX code and project files to proxy server
      const response = await axios.post(this.PROXY_API, {
        latexCode: latexCode,
        projectFiles: projectFiles || []
      }, {
        timeout: 60000, // 60 seconds timeout
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
