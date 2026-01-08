/**
 * API Client Service
 * Gestiona la comunicación con las APIs del buró de crédito
 * Maneja autenticación, tokens y reutilización de credenciales
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

interface ApiClientConfig {
  baseURL: string;
  apiKey: string;
  apiSecret: string;
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
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
        console.error('API Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Autentica con el buró y obtiene un token
   * Este token se reutiliza en todos los demás módulos
   */
  async authenticate(payload: any): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.client.post<any>(
        '/autenticador',
        payload
      );

      // Extraer token de la respuesta
      const token = response.data?.respuestaAutenticador || 
                   response.data?.respuesta?.token ||
                   response.data?.token;

      if (token) {
        this.token = token;
        // Establecer expiración (por defecto 1 hora)
        this.tokenExpiry = Date.now() + (3600 * 1000);

        return {
          success: true,
          data: {
            token,
            expiresIn: 3600,
            tokenType: 'Bearer',
          },
          statusCode: response.status,
        };
      }

      return {
        success: false,
        error: 'No token received from authentication',
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.message,
        statusCode: axiosError.response?.status || 500,
      };
    }
  }

  /**
   * Verifica si el token actual es válido
   */
  isTokenValid(): boolean {
    if (!this.token || !this.tokenExpiry) {
      return false;
    }
    return Date.now() < this.tokenExpiry;
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Establece un token manualmente
   */
  setToken(token: string, expiresIn?: number): void {
    this.token = token;
    if (expiresIn) {
      this.tokenExpiry = Date.now() + (expiresIn * 1000);
    }
  }

  /**
   * Realiza una solicitud POST genérica a un endpoint del buró
   */
  async post<T = any>(
    endpoint: string,
    payload: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(endpoint, payload);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.message,
        statusCode: axiosError.response?.status || 500,
      };
    }
  }

  /**
   * Realiza una solicitud GET genérica a un endpoint del buró
   */
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(endpoint);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.message,
        statusCode: axiosError.response?.status || 500,
      };
    }
  }

  /**
   * Prospección de cliente
   */
  async prospector(payload: any): Promise<ApiResponse> {
    return this.post('/prospector', payload);
  }

  /**
   * Monitoreo de crédito
   */
  async monitor(payload: any): Promise<ApiResponse> {
    return this.post('/monitor', payload);
  }

  /**
   * Estimación de ingresos
   */
  async estimadorIngresos(payload: any): Promise<ApiResponse> {
    return this.post('/estimador-ingresos', payload);
  }

  /**
   * Reporte de crédito
   */
  async reporteCredito(payload: any): Promise<ApiResponse> {
    return this.post('/reporte-de-credito', payload);
  }

  /**
   * Informe del buró
   */
  async informeBuro(payload: any): Promise<ApiResponse> {
    return this.post('/informe-buro', payload);
  }
}

// Crear instancia singleton del cliente
let apiClientInstance: BuroApiClient | null = null;

export function initializeApiClient(config: ApiClientConfig): BuroApiClient {
  apiClientInstance = new BuroApiClient(config);
  return apiClientInstance;
}

export function getApiClient(): BuroApiClient {
  if (!apiClientInstance) {
    throw new Error('API Client not initialized. Call initializeApiClient first.');
  }
  return apiClientInstance;
}

export { BuroApiClient, ApiClientConfig, ApiResponse, AuthResponse };
