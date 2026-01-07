import axios, { AxiosInstance } from 'axios';

/**
 * Cliente para la API de Buró de Crédito
 * Implementa autenticación OAuth2 client_credentials y llamadas a todos los endpoints
 * 
 * URLs de la API:
 * - https://api.burodecredito.com.mx:4431/devpf/autenticador
 * - https://api.burodecredito.com.mx:4431/devpf/reporte-de-credito
 * - https://api.burodecredito.com.mx:4431/devpf/informe-buro
 * - https://api.burodecredito.com.mx:4431/devpf/monitor
 * - https://api.burodecredito.com.mx:4431/devpf/prospector
 * - https://api.burodecredito.com.mx:4431/devpf/estimador-ingresos
 */
export class BuroClient {
  private client: AxiosInstance;
  private baseURL: string;
  private username: string;
  private password: string;
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    // Base URL for API endpoints
    this.baseURL = process.env.BURO_API_BASE_URL || 'https://api.burodecredito.com.mx:4431/devpf';
    
    // Credentials - format: apif.burodecredito.com.mx:Onsite:Onsite007$$
    this.username = process.env.BURO_API_USERNAME || '';
    this.password = process.env.BURO_API_PASSWORD || '';
    
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
      // Preparar credenciales en formato correcto
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const response = await axios.post(this.tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        timeout: 30000,
      });

      this.accessToken = response.data.access_token;
      // Establecer expiración 5 minutos antes del tiempo real para evitar tokens expirados
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = Date.now() + (expiresIn - 300) * 1000;

      console.log('[BuroClient] Token obtenido exitosamente');
      return this.accessToken;
    } catch (error: any) {
      console.error('[BuroClient] Error obteniendo token:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return null;
    }
  }

  /**
   * Realiza una petición a la API con manejo de errores
   */
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      const statusCode = error.response?.status;
      
      console.error(`[BuroClient] Error en ${endpoint}:`, {
        status: statusCode,
        data: errorData,
        message: error.message
      });

      // Manejar diferentes tipos de errores
      if (statusCode === 401) {
        // Token inválido, limpiar y reintentar
        this.accessToken = null;
        this.tokenExpiry = 0;
        throw new Error('Error de autenticación con Buró de Crédito. Verifique las credenciales.');
      }
      
      if (statusCode === 403) {
        // Acceso denegado
        throw new Error('Acceso denegado (403). Verifique que las credenciales tengan permisos para este endpoint.');
      }
      
      if (statusCode === 400) {
        throw new Error(errorData?.mensaje || errorData?.message || 'Datos de solicitud inválidos');
      }

      if (statusCode === 500) {
        throw new Error('Error interno del servidor de Buró de Crédito');
      }

      throw new Error(errorData?.mensaje || errorData?.message || error.message || 'Error al conectar con Buró de Crédito');
    }
  }

  /**
   * Genera respuestas simuladas para pruebas
   */
  private getMockResponse(endpoint: string): any {
    const mockResponses: { [key: string]: any } = {
      '/credit-report-api/v1/autenticador': {
        status: 'success',
        mensaje: 'Autenticación exitosa',
        preguntas: [
          {
            id: 1,
            pregunta: '¿Cuál es el saldo actual de su tarjeta de crédito?',
            opciones: ['$0 - $5,000', '$5,001 - $10,000', '$10,001 - $20,000', 'No tengo tarjeta']
          },
          {
            id: 2,
            pregunta: '¿Cuántos créditos activos tiene?',
            opciones: ['0', '1', '2', '3 o más']
          },
          {
            id: 3,
            pregunta: '¿Ha tenido retrasos en pagos en los últimos 12 meses?',
            opciones: ['No', 'Sí, 1-2 veces', 'Sí, 3-5 veces', 'Sí, más de 5 veces']
          }
        ]
      },
      '/credit-report-api/v1/reporte-de-credito': {
        status: 'success',
        mensaje: 'Reporte generado exitosamente',
        folioConsulta: 'FC' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        fechaConsulta: new Date().toISOString(),
        cuentasActivas: 3,
        cuentasCerradas: 2,
        saldoTotal: 45000,
        limiteDisponible: 55000,
        historiaPagos: {
          puntual: 85,
          conRetraso: 15,
          enMoratorios: 0
        },
        calificacionMOP: 'A',
        consultas: [
          {
            fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            otorgante: 'BANCO PRUEBA',
            tipo: 'CC'
          }
        ]
      },
      '/credit-report-api/v1/informe-buro': {
        status: 'success',
        mensaje: 'Informe generado exitosamente',
        resumen: {
          scoreBuro: 750,
          riesgo: 'BAJO',
          recomendacion: 'APROBADO'
        },
        detalles: {
          cuentasActivas: 3,
          cuentasCerradas: 2,
          saldoTotal: 45000,
          pagosAlDia: 85
        }
      },
      '/credit-report-api/v1/monitor': {
        status: 'success',
        mensaje: 'Monitoreo activo',
        cambiosRecientes: [],
        alertas: []
      },
      '/credit-report-api/v1/prospector': {
        status: 'success',
        mensaje: 'Análisis completado',
        potencial: 'ALTO',
        recomendaciones: [
          'Oferta de aumento de límite de crédito',
          'Producto de inversión',
          'Seguros complementarios'
        ]
      },
      '/credit-report-api/v1/estimador-ingresos': {
        status: 'success',
        mensaje: 'Estimación completada',
        ingresoEstimado: 50000,
        rangoInferior: 40000,
        rangoSuperior: 60000,
        confianza: 85
      }
    };

    return mockResponses[endpoint] || { status: 'success', mensaje: 'Datos simulados' };
  }

  /**
   * Autenticador - Autenticación con preguntas de seguridad basadas en historial crediticio
   * POST /credit-report-api/v1/autenticador
   */
  async autenticador(data: any) {
    return this.makeRequest('/credit-report-api/v1/autenticador', data);
  }

  /**
   * Reporte de Crédito - Reporte completo de historial crediticio
   * POST /credit-report-api/v1/reporte-de-credito
   */
  async reporteDeCredito(data: any) {
    return this.makeRequest('/credit-report-api/v1/reporte-de-credito', data);
  }

  /**
   * Informe Buró - Informe detallado del buró de crédito
   * POST /credit-report-api/v1/informe-buro
   */
  async informeBuro(data: any) {
    return this.makeRequest('/credit-report-api/v1/informe-buro', data);
  }

  /**
   * Monitor - Monitoreo continuo de cambios en historial crediticio
   * POST /credit-report-api/v1/monitor
   */
  async monitor(data: any) {
    return this.makeRequest('/credit-report-api/v1/monitor', data);
  }

  /**
   * Prospector - Análisis y prospección de clientes potenciales
   * POST /credit-report-api/v1/prospector
   */
  async prospector(data: any) {
    return this.makeRequest('/credit-report-api/v1/prospector', data);
  }

  /**
   * Estimador de Ingresos - Estimación de ingresos basada en historial crediticio
   * POST /credit-report-api/v1/estimador-ingresos
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

// Instancia singleton del cliente
export const buroClient = new BuroClient();

// Función para testing de conexión
export async function testBuroConnection() {
  return buroClient.testConnection();
}
