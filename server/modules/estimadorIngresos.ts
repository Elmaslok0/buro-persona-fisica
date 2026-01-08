/**
 * Estimador de Ingresos Module
 * Implementa la estimación de ingresos basada en historial crediticio
 * Sigue estimador-ingresos.json exactamente
 * NO modificar campos, nombres o estructuras
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

interface EstimadorIngresosRequest {
  consulta: {
    persona: PersonaBC;
  };
}

interface EstimacionIngreso {
  ingresoEstimado?: string;
  ingresoMinimo?: string;
  ingresoMaximo?: string;
  capacidadPago?: string;
  nivelConfianza?: string;
  metodologia?: string;
}

interface AnalisisCapacidadPago {
  capacidadPagoTotal?: string;
  capacidadPagoDisponible?: string;
  porcentajeUtilizacion?: string;
  recomendacionCredito?: string;
}

interface EstimadorIngresosResponse {
  respuesta?: {
    estimacionIngresos?: EstimacionIngreso;
    analisisCapacidadPago?: AnalisisCapacidadPago;
    historicoIngresos?: any[];
    encabezado?: any;
    personaRespBC?: any;
    resumenEstimacion?: any;
  };
  error?: any;
}

/**
 * Construye el payload exacto para el módulo estimador de ingresos
 * Sigue la estructura definida en estimador-ingresos.json
 */
export function buildEstimadorIngresosPayload(
  persona: PersonaBC
): EstimadorIngresosRequest {
  return {
    consulta: {
      persona,
    },
  };
}

/**
 * Realiza estimación de ingresos de un cliente
 * Retorna ingresos estimados y análisis de capacidad de pago
 */
export async function estimateIncome(
  persona: PersonaBC
): Promise<{
  success: boolean;
  data?: EstimadorIngresosResponse;
  error?: string;
}> {
  try {
    const apiClient = getApiClient();

    // Verificar que hay token disponible
    if (!apiClient.isTokenValid()) {
      return {
        success: false,
        error: 'No valid token available. Please authenticate first.',
      };
    }

    // Construir payload exacto según estimador-ingresos.json
    const payload = buildEstimadorIngresosPayload(persona);

    // Realizar estimación
    const response = await apiClient.post<EstimadorIngresosResponse>(
      '/credit-report-api/v1/estimador-ingresos',
      payload
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Income estimation failed',
      };
    }

    return {
      success: true,
      data: response.data as EstimadorIngresosResponse,
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
 * Extrae la estimación de ingresos
 */
export function extractIncomeEstimation(
  response: EstimadorIngresosResponse
): EstimacionIngreso | null {
  return response?.respuesta?.estimacionIngresos || null;
}

/**
 * Extrae el análisis de capacidad de pago
 */
export function extractPaymentCapacityAnalysis(
  response: EstimadorIngresosResponse
): AnalisisCapacidadPago | null {
  return response?.respuesta?.analisisCapacidadPago || null;
}

/**
 * Extrae el histórico de ingresos
 */
export function extractIncomeHistory(
  response: EstimadorIngresosResponse
): any[] {
  return response?.respuesta?.historicoIngresos || [];
}

/**
 * Calcula el rango de ingresos
 */
export function calculateIncomeRange(
  estimation: EstimacionIngreso
): {
  minimo: number;
  estimado: number;
  maximo: number;
} {
  return {
    minimo: parseFloat(estimation?.ingresoMinimo || '0'),
    estimado: parseFloat(estimation?.ingresoEstimado || '0'),
    maximo: parseFloat(estimation?.ingresoMaximo || '0'),
  };
}

/**
 * Evalúa la recomendación de crédito
 */
export function evaluateCreditRecommendation(
  analysis: AnalisisCapacidadPago
): {
  recomendacion: string;
  montoSugerido: string;
  plazoSugerido: string;
} {
  const utilizacion = parseFloat(analysis?.porcentajeUtilizacion || '0');
  const capacidad = parseFloat(analysis?.capacidadPagoDisponible || '0');

  let recomendacion = 'REVISAR';
  if (utilizacion < 30) {
    recomendacion = 'APROBADO';
  } else if (utilizacion < 60) {
    recomendacion = 'APROBADO_CONDICIONADO';
  } else if (utilizacion < 80) {
    recomendacion = 'REVISAR';
  } else {
    recomendacion = 'RECHAZADO';
  }

  return {
    recomendacion,
    montoSugerido: analysis?.capacidadPagoDisponible || '0',
    plazoSugerido: analysis?.recomendacionCredito || 'N/A',
  };
}

/**
 * Formatea la estimación para presentación en el panel
 */
export function formatEstimationForDisplay(
  response: EstimadorIngresosResponse
): any {
  const estimation = extractIncomeEstimation(response);
  const analysis = extractPaymentCapacityAnalysis(response);

  return {
    ingreso: {
      estimado: estimation?.ingresoEstimado,
      minimo: estimation?.ingresoMinimo,
      maximo: estimation?.ingresoMaximo,
      confianza: estimation?.nivelConfianza,
    },
    capacidadPago: {
      total: analysis?.capacidadPagoTotal,
      disponible: analysis?.capacidadPagoDisponible,
      utilizacion: analysis?.porcentajeUtilizacion,
      recomendacion: analysis?.recomendacionCredito,
    },
  };
}

/**
 * Obtiene el resumen de la estimación
 */
export function getEstimationSummary(response: EstimadorIngresosResponse): any {
  return response?.respuesta?.resumenEstimacion || null;
}
