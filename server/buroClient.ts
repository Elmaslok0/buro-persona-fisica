import axios, { AxiosInstance } from 'axios';

/**
 * Cliente para la API de Buró de Crédito
 * Implementa autenticación OAuth2 client_credentials y llamadas a todos los endpoints
 */
export class BuroClient {
  private client: AxiosInstance;
  private baseURL: string;
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    // Base URL for API endpoints
    this.baseURL = process.env.BURO_API_BASE_URL || 'https://api.burodecredito.com.mx:4431/devpf';
    
    // OAuth2 Client Credentials
    this.clientId = process.env.BURO_API_CLIENT_ID || '';
    this.clientSecret = process.env.BURO_API_CLIENT_SECRET || '';
    
    // OAuth2 Token URL
    this.tokenUrl = process.env.BURO_TOKEN_URL || 'https://apigateway1.burodecredito.com.mx:8443/auth/oauth/v2/token';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
      rejectUnauthorizedSSL: false,
    });

    // Interceptor para agregar el token de autenticación
    this.client.interceptors.request.use(async (config) => {
      const token = await this.getAccessToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Obtiene un token de acceso OAuth2 usando client_credentials
   */
  private async getAccessToken(): Promise<string | null> {
    // Si el token aún es válido, reutilizarlo
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('[BuroClient] Solicitando nuevo token...');
      
      // Preparar credenciales en formato Base64
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const response = await axios.post(this.tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        timeout: 30000,
        rejectUnauthorizedSSL: false,
      });

      this.accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = Date.now() + (expiresIn - 300) * 1000;

      console.log('[BuroClient] Token obtenido exitosamente, expira en:', expiresIn, 'segundos');
      return this.accessToken;
    } catch (error: any) {
      console.error('[BuroClient] Error obteniendo token:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: this.tokenUrl
      });
      return null;
    }
  }

  /**
   * Realiza una petición a la API con manejo de errores
   */
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      console.log(`[BuroClient] Realizando petición a ${endpoint}`);
      const response = await this.client.post(endpoint, data);
      console.log(`[BuroClient] Respuesta exitosa de ${endpoint}`);
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      const statusCode = error.response?.status;
      
      console.error(`[BuroClient] Error en ${endpoint}:`, {
        status: statusCode,
        statusText: error.response?.statusText,
        data: errorData,
        message: error.message
      });

      // Manejar diferentes tipos de errores
      if (statusCode === 401) {
        // Token inválido, limpiar y reintentar
        this.accessToken = null;
        this.tokenExpiry = 0;
        throw new Error('Error de autenticación (401). Verifique las credenciales de Buró de Crédito.');
      }
      
      if (statusCode === 403) {
        // Acceso denegado
        throw new Error('Acceso denegado (403). Verifique que las credenciales tengan permisos para este endpoint.');
      }
      
      if (statusCode === 400) {
        throw new Error(`Error de solicitud (400): ${errorData?.mensaje || errorData?.message || 'Datos inválidos'}`);
      }

      if (statusCode === 500) {
        throw new Error('Error interno del servidor de Buró de Crédito (500)');
      }

      throw new Error(`Error al conectar con Buró: ${errorData?.mensaje || errorData?.message || error.message}`);
    }
  }

  /**
   * Autenticador - Autenticación con preguntas de seguridad
   */
  async autenticador(data: any) {
    return this.makeRequest('/credit-report-api/v1/autenticador', data);
  }

  /**
   * Reporte de Crédito - Reporte completo de historial crediticio
   */
  async reporteDeCredito(data: any) {
    return this.makeRequest('/credit-report-api/v1/reporte-de-credito', data);
  }

  /**
   * Informe Buró - Informe detallado del buró de crédito
   */
  async informeBuro(data: any) {
    return this.makeRequest('/credit-report-api/v1/informe-buro', data);
  }

  /**
   * Monitor - Monitoreo continuo de cambios
   */
  async monitor(data: any) {
    return this.makeRequest('/credit-report-api/v1/monitor', data);
  }

  /**
   * Prospector - Análisis de clientes potenciales
   */
  async prospector(data: any) {
    return this.makeRequest('/credit-report-api/v1/prospector', data);
  }

  /**
   * Estimador de Ingresos - Estimación de ingresos
   */
  async estimadorIngresos(data: any) {
    return this.makeRequest('/credit-report-api/v1/estimador-ingresos', data);
  }

  /**
   * Verifica la conexión con la API de Buró de Crédito
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const token = await this.getAccessToken();
      if (token) {
        return { success: true, message: 'Conexión exitosa con Buró de Crédito' };
      }
      return { success: false, message: 'No se pudo obtener token de acceso' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}

export const buroClient = new BuroClient();

// Función para testing de conexión
export async function testBuroConnection() {
  return buroClient.testConnection();
}
