import axios, { AxiosInstance } from 'axios';

/**
 * Cliente para la API de Buró de Crédito
 * Maneja autenticación y llamadas a todos los endpoints
 */
export class BuroClient {
  private client: AxiosInstance;
  private baseURL: string;
  private username: string;
  private password: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.baseURL = process.env.BURO_API_BASE_URL || 'https://api.burodecredito.com.mx:4431/devpf';
    this.username = process.env.BURO_API_USERNAME || '';
    this.password = process.env.BURO_API_PASSWORD || '';
    this.clientId = process.env.BURO_API_CLIENT_ID || '';
    this.clientSecret = process.env.BURO_API_CLIENT_SECRET || '';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      auth: {
        username: this.username,
        password: this.password,
      },
    });

    // Interceptor para agregar client credentials
    this.client.interceptors.request.use((config) => {
      config.headers['x-api-key'] = this.clientId;
      return config;
    });
  }

  /**
   * Autenticador - Autenticación con preguntas de seguridad basadas en historial crediticio
   */
  async autenticador(data: any) {
    try {
      const response = await this.client.post('/autenticador', data);
      return response.data;
    } catch (error: any) {
      console.error('Error en autenticador:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al autenticar');
    }
  }

  /**
   * Reporte de Crédito - Reporte completo de historial crediticio
   */
  async reporteDeCredito(data: any) {
    try {
      const response = await this.client.post('/reporte-de-credito', data);
      return response.data;
    } catch (error: any) {
      console.error('Error en reporte-de-credito:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener reporte de crédito');
    }
  }

  /**
   * Informe Buró - Informe detallado del buró de crédito
   */
  async informeBuro(data: any) {
    try {
      const response = await this.client.post('/informe-buro', data);
      return response.data;
    } catch (error: any) {
      console.error('Error en informe-buro:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener informe de buró');
    }
  }

  /**
   * Monitor - Monitoreo continuo de cambios en historial crediticio
   */
  async monitor(data: any) {
    try {
      const response = await this.client.post('/monitor', data);
      return response.data;
    } catch (error: any) {
      console.error('Error en monitor:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al monitorear');
    }
  }

  /**
   * Prospector - Análisis y prospección de clientes potenciales
   */
  async prospector(data: any) {
    try {
      const response = await this.client.post('/prospector', data);
      return response.data;
    } catch (error: any) {
      console.error('Error en prospector:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al prospectar');
    }
  }

  /**
   * Estimador de Ingresos - Estimación de ingresos basada en historial crediticio
   */
  async estimadorIngresos(data: any) {
    try {
      const response = await this.client.post('/estimador-ingresos', data);
      return response.data;
    } catch (error: any) {
      console.error('Error en estimador-ingresos:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al estimar ingresos');
    }
  }
}

export const buroClient = new BuroClient();
