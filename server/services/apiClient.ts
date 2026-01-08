/**
 * API Client Service - Senior Architect Version
 * Gestiona la comunicación con las APIs del buró de crédito
 * Alineado con los parámetros obligatorios de Buró de Crédito
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

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
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': config.apiKey,
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
        console.error('Buro API Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Autentica con el buró y obtiene un token
   * Alineado con autenticador.json
   */
  async authenticate(payload: any): Promise<ApiResponse<AuthResponse>> {
    try {
      // Si no se pasa payload, usar credenciales de configuración
      const authPayload = payload || {
        username: this.config.username,
        password: this.config.apiSecret
      };

      const response = await this.client.post<any>(
        '/autenticador',
        authPayload
      );

      // Extraer token según las diversas estructuras posibles en la documentación
      const token = response.data?.respuestaAutenticador || 
                   response.data?.respuesta?.token ||
                   response.data?.token;

      if (token) {
        this.token = token;
        this.tokenExpiry = Date.now() + (3600 * 1000); // 1 hora por defecto

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

  /**
   * Realiza una solicitud POST genérica
   */
  async post<T = any>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
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
        error: (axiosError.response?.data as any)?.message || axiosError.message,
        statusCode: axiosError.response?.status || 500,
      };
    }
  }

  // Métodos específicos alineados con los módulos
  async prospector(payload: any) { return this.post('/prospector', payload); }
  async monitor(payload: any) { return this.post('/monitor', payload); }
  async estimadorIngresos(payload: any) { return this.post('/estimador-ingresos', payload); }
  async reporteCredito(payload: any) { return this.post('/reporte-de-credito', payload); }
  async informeBuro(payload: any) { return this.post('/informe-buro', payload); }
}

let apiClientInstance: BuroApiClient | null = null;

export function initializeApiClient(config: ApiClientConfig): BuroApiClient {
  apiClientInstance = new BuroApiClient(config);
  return apiClientInstance;
}

export function getApiClient(): BuroApiClient {
  if (!apiClientInstance) {
    // Fallback a variables de entorno si no está inicializado
    return initializeApiClient({
      baseURL: process.env.BURO_API_BASE_URL || '',
      apiKey: process.env.BURO_API_CLIENT_ID || '',
      apiSecret: process.env.BURO_API_CLIENT_SECRET || '',
      username: process.env.BURO_API_USERNAME || '',
    });
  }
  return apiClientInstance;
}

export { BuroApiClient, ApiClientConfig, ApiResponse, AuthResponse };
