/**
 * API Client Service - Senior Architect Version (Persona Física)
 * Alineado con los parámetros obligatorios de Buró de Crédito PF
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ENV } from '../_core/env';

interface ApiClientConfig {
  baseURL: string;
  apiKey: string;
  apiSecret: string;
  username?: string;
  timeout?: number;
}

interface AuthResponse {
  token: string;
  expiresIn?: number;
  tokenType?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

class BuroApiClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(config: ApiClientConfig) {
    // Asegurar que usamos devpf para Persona Física
    const finalBaseURL = config.baseURL.includes('devpm') 
      ? config.baseURL.replace('devpm', 'devpf') 
      : config.baseURL;

    console.log(`[BuroApiClient-PF] Initializing with baseURL: ${finalBaseURL}`);
    
    this.client = axios.create({
      baseURL: finalBaseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': config.apiKey,
        // Añadir User-Agent para evitar bloqueos de WAF
        'User-Agent': 'BuroPersonaFisicaPanel/1.0',
      },
    });

    // Interceptor para agregar token a las solicitudes
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('!!! Buro PF API Error !!!', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  async authenticate(payload?: any): Promise<ApiResponse<AuthResponse>> {
    try {
      // Para PF, el flujo es directo al endpoint /autenticador
      const authPayload = payload || {
        username: ENV.buroUsername,
        password: ENV.buroClientSecret
      };

      console.log(`[BuroApiClient-PF] Authenticating: ${ENV.buroUsername}`);
      
      const response = await this.client.post<any>(
        '/autenticador',
        authPayload
      );

      const token = response.data?.respuestaAutenticador || 
                   response.data?.respuesta?.token ||
                   response.data?.token;

      if (token) {
        this.token = token;
        this.tokenExpiry = Date.now() + (3600 * 1000);
        return {
          success: true,
          data: { token, expiresIn: 3600, tokenType: 'Bearer' },
          statusCode: response.status,
        };
      }

      return {
        success: false,
        error: 'No se recibió token de autenticación',
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: (axiosError.response?.data as any)?.message || axiosError.message,
        statusCode: axiosError.response?.status || 500,
      };
    }
  }

  isTokenValid(): boolean {
    return !!this.token && (this.tokenExpiry ? Date.now() < this.tokenExpiry : true);
  }

  setToken(token: string, expiresIn?: number): void {
    this.token = token;
    if (expiresIn) {
      this.tokenExpiry = Date.now() + (expiresIn * 1000);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  async post<T = any>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(endpoint, payload);
      return { success: true, data: response.data, statusCode: response.status };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: (axiosError.response?.data as any)?.message || axiosError.message,
        statusCode: axiosError.response?.status || 500,
      };
    }
  }

  // Endpoints específicos para PF
  async prospector(payload: any) { return this.post('/prospector', payload); }
  async monitor(payload: any) { return this.post('/monitor', payload); }
  async estimadorIngresos(payload: any) { return this.post('/estimador-ingresos', payload); }
  async reporteCredito(payload: any) { return this.post('/reporte-de-credito', payload); }
  async informeBuro(payload: any) { return this.post('/informe-buro', payload); }
}

let apiClientInstance: BuroApiClient | null = null;

export function getApiClient(): BuroApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new BuroApiClient({
      baseURL: ENV.buroApiBaseUrl,
      apiKey: ENV.buroClientId,
      apiSecret: ENV.buroClientSecret,
      username: ENV.buroUsername,
    });
  }
  return apiClientInstance;
}

export { BuroApiClient, ApiResponse, AuthResponse };
