import axios, { AxiosInstance } from 'axios';

/**
 * Cliente para la API de Buró de Crédito
 * Implementa autenticación OAuth2 client_credentials
 * SIN fallback a datos simulados - SIEMPRE intenta conectar a la API real
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
    try {
      // Si el token aún es válido, devolverlo
      if (this.accessToken && this.tokenExpiry > Date.now()) {
        return this.accessToken;
      }

      console.log('[BuroClient] Obteniendo nuevo token OAuth2...');
      
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 30000,
          rejectUnauthorizedSSL: false,
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      console.log(`[BuroClient] Token obtenido exitosamente. Expira en ${response.data.expires_in}s`);
      return this.accessToken;
    } catch (error: any) {
      const errorData = error.response?.data;
      
      console.error('[BuroClient] Error al obtener token:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: errorData,
        message: error.message,
      });

      throw new Error(`Error al obtener token de Buró: ${errorData?.error_description || error.message}`);
    }
  }

  /**
   * Realiza una petición a la API - SIN fallback a mock data
   */
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      console.log(`[BuroClient] Realizando petición POST a ${endpoint}`);
      console.log(`[BuroClient] Datos enviados:`, JSON.stringify(data, null, 2));
      
      const response = await this.client.post(endpoint, data);
      
      console.log(`[BuroClient] Respuesta exitosa de ${endpoint}:`, JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      const statusCode = error.response?.status;
      
      console.error(`[BuroClient] Error en ${endpoint}:`, {
        status: statusCode,
        statusText: error.response?.statusText,
        data: errorData,
        message: error.message,
      });

      // Lanzar el error sin fallback
      throw new Error(`Error al conectar con Buró (${statusCode}): ${errorData?.mensaje || errorData?.message || error.message}`);
    }
  }

  /**
   * Autenticador - Preguntas de seguridad basadas en historial crediticio
   */
  async autenticador(data: any) {
    return this.makeRequest('/autenticador', data);
  }

  /**
   * Reporte de Crédito - Reporte completo de historial crediticio
   */
  async reporteDeCredito(clientData: any, otorgante: any) {
    const request = {
      consulta: {
        persona: {
          encabezado: {
            clavePais: 'MX',
            claveUnidadMonetaria: 'MX',
            identificadorBuro: '0000',
            idioma: 'SP',
            importeContrato: otorgante.importeContrato?.padStart(9, '0') || '000000000',
            numeroReferenciaOperador: (otorgante.folioConsulta || 'REF').padEnd(25, ' '),
            productoRequerido: '001',
            tipoConsulta: 'I',
            tipoContrato: otorgante.tipoContrato || 'CC'
          },
          nombre: {
            apellidoPaterno: clientData.apellidoPaterno || '',
            apellidoMaterno: clientData.apellidoMaterno || '',
            nombre: clientData.nombres || '',
            nombreCompleto: `${clientData.nombres} ${clientData.apellidoPaterno} ${clientData.apellidoMaterno}`.trim()
          },
          domicilios: [],
          empleos: [],
          cuentaC: []
        }
      }
    };

    return this.makeRequest('/reporte-de-credito', request);
  }

  /**
   * Informe Buró - Informe detallado del buró de crédito
   */
  async informeBuro(data: any) {
    return this.makeRequest('/informe-buro', data);
  }

  /**
   * Monitor - Monitoreo continuo de cambios
   */
  async monitor(data: any) {
    return this.makeRequest('/monitor', data);
  }

  /**
   * Prospector - Análisis de clientes potenciales
   */
  async prospector(data: any) {
    return this.makeRequest('/prospector', data);
  }

  /**
   * Estimador de Ingresos - Estimación de ingresos
   */
  async estimadorIngresos(data: any) {
    return this.makeRequest('/estimador-ingresos', data);
  }

  /**
   * E-Score - Puntuación de crédito electrónica
   */
  async eScore(data: any) {
    return this.makeRequest('/e-score', data);
  }

  /**
   * Verifica la conexión con la API de Buró de Crédito
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const testData = {
        consulta: {
          persona: {
            encabezado: {
              clavePais: 'MX',
              claveUnidadMonetaria: 'MX',
              identificadorBuro: '0000',
              idioma: 'SP',
              importeContrato: '000000000',
              numeroReferenciaOperador: 'TEST'.padEnd(25, ' '),
              productoRequerido: '001',
              tipoConsulta: 'I',
              tipoContrato: 'CC'
            },
            nombre: {
              apellidoPaterno: 'TEST',
              apellidoMaterno: 'TEST',
              nombre: 'TEST',
              nombreCompleto: 'TEST TEST TEST'
            },
            domicilios: [],
            empleos: [],
            cuentaC: []
          }
        }
      };

      const result = await this.makeRequest('/autenticador', testData);
      return {
        success: true,
        message: 'Conexión exitosa con Buró de Crédito'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error de conexión: ${error.message}`
      };
    }
  }
}

export async function testBuroConnection() {
  const client = new BuroClient();
  return await client.testConnection();
}
