/**
 * API Client Service - Senior Architect Version (Persona Física)
 * Alineado con la documentación oficial de APIHub de Buró de Crédito
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ENV } from '../_core/env';

interface ApiClientConfig {
  baseURL: string;
  apiKey: string;
  apiSecret: string;
  username?: string;
  password?: string;
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
    console.log(`[BuroApiClient-PF] Initializing with baseURL: ${config.baseURL}`);
    
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain',
        'x-api-key': config.apiKey,
        'x-api-secret': config.apiSecret,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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
        console.error('!!! BURO API ERROR !!!', {
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
      const authPayload = payload || {
        username: ENV.buroUsername,
        password: ENV.buroPassword
      };

      console.log(`[BuroApiClient-PF] Authenticating at /credit-report-api/v1/autenticador`);
      
      const response = await this.client.post<any>(
        '/credit-report-api/v1/autenticador',
        authPayload
      );

      let token = '';
      if (response.status === 201 && typeof response.data === 'string') {
        token = response.data;
      } else {
        token = response.data?.respuestaAutenticador || 
                response.data?.respuesta?.token ||
                response.data?.token;
      }

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

  async post<T = any>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
    try {
      // Asegurar autenticación antes de cualquier petición
      if (!this.token) {
        const authResult = await this.authenticate();
        if (!authResult.success) return authResult;
      }
      
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

  // Endpoints alineados con Reporte de Crédito v1 y APIHub
  async prospector(payload: any) { return this.post('/credit-report-api/v1/prospector', payload); }
  async monitor(payload: any) { return this.post('/credit-report-api/v1/monitor', payload); }
  async estimadorIngresos(payload: any) { return this.post('/devpf/estimador-ingresos', payload); }
  async reporteCredito(payload: any) { return this.post('/reporte-de-credito/v1/reporte-de-credito', payload); }
  async informeBuro(payload: any) { return this.post('/credit-report-api/v1/informe-buro', payload); }
}

let apiClientInstance: BuroApiClient | null = null;

export function initializeApiClient(config: ApiClientConfig): BuroApiClient {
  apiClientInstance = new BuroApiClient(config);
  return apiClientInstance;
}

export function getApiClient(): BuroApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new BuroApiClient({
      baseURL: ENV.buroApiBaseUrl,
      apiKey: ENV.buroClientId,
      apiSecret: ENV.buroClientSecret,
      username: ENV.buroUsername,
      password: ENV.buroPassword,
    });
  }
  return apiClientInstance;
}

export { BuroApiClient, ApiResponse, AuthResponse };
