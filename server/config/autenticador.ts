/**
 * Autenticador Configuration
 * Gestiona la autenticación con el buró de crédito
 * Obtiene y reutiliza tokens para todos los módulos
 */

import { getApiClient } from '../services/apiClient';

interface PersonaBC {
  nombre?: {
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    nombre?: string;
  };
  direccion?: {
    ciudad?: string;
    codPais?: string;
    codigoPostal?: string;
    calle?: string;
    numero?: string;
  };
  empleo?: {
    empresa?: string;
    puesto?: string;
    antiguedad?: string;
  };
  telefonoContacto?: string;
}

interface AutenticadorRequest {
  consulta: {
    persona: PersonaBC;
  };
}

interface AutenticadorResponse {
  respuesta?: any;
  respuestaAutenticador?: string;
  error?: string;
}

/**
 * Construye el payload exacto para el módulo autenticador
 * Sigue la estructura definida en autenticador.json
 */
export function buildAutenticadorPayload(persona: PersonaBC): AutenticadorRequest {
  return {
    consulta: {
      persona,
    },
  };
}

/**
 * Autentica con el buró de crédito
 * Obtiene un token que se reutiliza en todos los demás módulos
 */
export async function authenticate(
  persona: PersonaBC
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const apiClient = getApiClient();

    // Construir payload exacto según autenticador.json
    const payload = buildAutenticadorPayload(persona);

    // Realizar autenticación
    const response = await apiClient.post<AutenticadorResponse>(
      '/autenticador',
      payload
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Authentication failed',
      };
    }

    // Extraer token de la respuesta
    const responseData = response.data as AutenticadorResponse;
    const token = responseData?.respuestaAutenticador || 
                 responseData?.respuesta?.token;

    if (token) {
      // Guardar token en el cliente para reutilización
      apiClient.setToken(token, 3600); // Token válido por 1 hora

      return {
        success: true,
        token,
      };
    }

    return {
      success: false,
      error: 'No token received from authentication response',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verifica si el token actual es válido
 */
export function isTokenValid(): boolean {
  try {
    const apiClient = getApiClient();
    return apiClient.isTokenValid();
  } catch {
    return false;
  }
}

/**
 * Obtiene el token actual
 */
export function getCurrentToken(): string | null {
  try {
    const apiClient = getApiClient();
    return apiClient.getToken();
  } catch {
    return null;
  }
}

/**
 * Ejemplo de estructura de Persona para pruebas
 */
export function createSamplePersona(): PersonaBC {
  return {
    nombre: {
      apellidoPaterno: 'García',
      apellidoMaterno: 'López',
      nombre: 'Juan',
    },
    direccion: {
      ciudad: 'MEXICO',
      codPais: 'MX',
      codigoPostal: '28001',
      calle: 'Avenida Principal',
      numero: '123',
    },
    empleo: {
      empresa: 'Empresa Ejemplo S.A.',
      puesto: 'Analista',
      antiguedad: '5',
    },
    telefonoContacto: '5555555555',
  };
}
