import axios, { AxiosInstance } from 'axios';

/**
 * Cliente para la API de Buró de Crédito
 * Implementa autenticación OAuth2 client_credentials y llamadas a todos los endpoints
 * SIN fallback a datos simulados para diagnóstico real
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
    this.clientId = process.env.BURO_API_CLIENT_ID || 'l7f4ab9619923343069e3a48c3209b61e4';
    this.clientSecret = process.env.BURO_API_CLIENT_SECRET || 'ee9ba699e9f54cd7bbe7948e0884ccc9';
    
    // OAuth2 Token URL
    this.tokenUrl = process.env.BURO_TOKEN_URL || 'https://apigateway1.burodecredito.com.mx:8443/auth/oauth/v2/token';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
      // En desarrollo de Buró a veces es necesario ignorar certificados no válidos si no se tienen los .pem
      // pero en producción debe ser true
      // rejectUnauthorized: false 
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
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('[BuroClient] Solicitando nuevo token a:', this.tokenUrl);
      
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const response = await axios.post(this.tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        timeout: 30000
      });

      this.accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = Date.now() + (expiresIn - 300) * 1000;

      console.log('[BuroClient] Token obtenido exitosamente');
      return this.accessToken;
    } catch (error: any) {
      console.error('[BuroClient] Error crítico obteniendo token:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return null;
    }
  }

  /**
   * Realiza una petición a la API con manejo de errores real
   */
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      console.log(`[BuroClient] Petición REAL a ${endpoint}`);
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      const statusCode = error.response?.status;
      
      console.error(`[BuroClient] ERROR REAL en ${endpoint}:`, {
        status: statusCode,
        data: errorData,
        message: error.message
      });

      // Lanzamos el error real para que el frontend lo cache y lo muestre
      throw new Error(
        errorData?.mensaje || 
        errorData?.message || 
        `Error ${statusCode} al conectar con Buró de Crédito: ${error.message}`
      );
    }
  }

  async autenticador(data: any) {
    return this.makeRequest('/autenticador', data);
  }

  async reporteDeCredito(clientData: any, otorgante: any) {
    // Estructura basada en la especificación oficial encontrada en el RAR
    const request = {
      consulta: {
        persona: {
          encabezado: {
            clavePais: 'MX',
            claveUnidadMonetaria: 'MX',
            identificadorBuro: '0000',
            idioma: 'SP',
            importeContrato: otorgante.importeContrato?.toString().padStart(9, '0') || '000000000',
            numeroReferenciaOperador: (otorgante.folioConsulta || 'REF').padEnd(25, ' '),
            productoRequerido: '001',
            tipoConsulta: 'I',
            tipoContrato: otorgante.tipoContrato || 'CC'
          },
          nombre: {
            apellidoPaterno: clientData.apellidoPaterno || '',
            apellidoMaterno: clientData.apellidoMaterno || '',
            nombre: clientData.nombres || ''
          },
          domicilios: clientData.domicilios || [],
        }
      }
    };

    return this.makeRequest('/reporte-de-credito', request);
  }

  async informeBuro(data: any) {
    return this.makeRequest('/informe-buro', data);
  }

  async monitor(data: any) {
    return this.makeRequest('/monitor', data);
  }

  async prospector(data: any) {
    return this.makeRequest('/prospector', data);
  }

  async estimadorIngresos(data: any) {
    return this.makeRequest('/estimador-ingresos', data);
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    const token = await this.getAccessToken();
    if (token) {
      return { success: true, message: 'Conexión OAuth2 establecida correctamente' };
    }
    return { success: false, message: 'Fallo en la autenticación OAuth2' };
  }
}

export const buroClient = new BuroClient();

export async function testBuroConnection() {
  return buroClient.testConnection();
}
