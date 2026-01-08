/**
 * Informe Buró Module
 * Implementa el informe del buró con score crediticio
 * Sigue informe-buro.json exactamente
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

interface InformeBuroRequest {
  consulta: {
    persona: PersonaBC;
  };
}

interface ScoreBuroCreditoRespBC {
  scoreNumerico?: string;
  scoreCategoria?: string;
  scoreInterpretacion?: string;
  fechaCalculo?: string;
  factoresRiesgo?: string[];
  factoresPositivos?: string[];
}

interface CuentasRespBC {
  claveOtorgante?: string;
  nombreOtorgante?: string;
  numeroCuentaActual?: string;
  tipoContrato?: string;
  saldoActual?: string;
  saldoVencido?: string;
  limiteCredito?: string;
  creditoMaximo?: string;
  fechaUltimoPago?: string;
  numeroPagosVencidos?: string;
  [key: string]: any;
}

interface DeclaracionesClienteRespBC {
  declaracionConsumidor?: string;
}

interface InformeBuroResponse {
  respuesta?: {
    score?: ScoreBuroCreditoRespBC;
    cuentas?: CuentasRespBC[];
    declaraciones?: DeclaracionesClienteRespBC[];
    consultasEfectuadas?: any[];
    encabezado?: any;
    personaRespBC?: any;
    resumenInforme?: any;
  };
  error?: any;
}

/**
 * Construye el payload exacto para el módulo informe buró
 * Sigue la estructura definida en informe-buro.json
 */
export function buildInformeBuroPayload(
  persona: PersonaBC
): InformeBuroRequest {
  return {
    consulta: {
      persona,
    },
  };
}

/**
 * Obtiene el informe completo del buró
 * Retorna score crediticio, cuentas, historial y declaraciones
 */
export async function getBuroReport(
  persona: PersonaBC
): Promise<{
  success: boolean;
  data?: InformeBuroResponse;
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

    // Construir payload exacto según informe-buro.json
    const payload = buildInformeBuroPayload(persona);

    // Obtener informe
    const response = await apiClient.post<InformeBuroResponse>(
      '/credit-report-api/v1/informe-buro',
      payload
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Bureau report retrieval failed',
      };
    }

    return {
      success: true,
      data: response.data as InformeBuroResponse,
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
 * Extrae el score crediticio
 */
export function extractCreditScore(
  response: InformeBuroResponse
): ScoreBuroCreditoRespBC | null {
  return response?.respuesta?.score || null;
}

/**
 * Extrae todas las cuentas
 */
export function extractAccounts(response: InformeBuroResponse): CuentasRespBC[] {
  return response?.respuesta?.cuentas || [];
}

/**
 * Extrae las declaraciones del cliente
 */
export function extractDeclarations(
  response: InformeBuroResponse
): DeclaracionesClienteRespBC[] {
  return response?.respuesta?.declaraciones || [];
}

/**
 * Extrae las consultas efectuadas
 */
export function extractQueries(response: InformeBuroResponse): any[] {
  return response?.respuesta?.consultasEfectuadas || [];
}

/**
 * Interpreta el score crediticio
 */
export function interpretCreditScore(
  score: ScoreBuroCreditoRespBC
): {
  calificacion: string;
  riesgo: string;
  recomendacion: string;
  color: string;
} {
  const scoreNum = parseFloat(score?.scoreNumerico || '0');

  let calificacion = 'DESCONOCIDO';
  let riesgo = 'ALTO';
  let recomendacion = 'REVISAR';
  let color = '#FF6B6B';

  if (scoreNum >= 800) {
    calificacion = 'EXCELENTE';
    riesgo = 'BAJO';
    recomendacion = 'APROBADO';
    color = '#51CF66';
  } else if (scoreNum >= 700) {
    calificacion = 'BUENO';
    riesgo = 'BAJO-MEDIO';
    recomendacion = 'APROBADO';
    color = '#94D82D';
  } else if (scoreNum >= 600) {
    calificacion = 'REGULAR';
    riesgo = 'MEDIO';
    recomendacion = 'REVISAR';
    color = '#FFD43B';
  } else if (scoreNum >= 500) {
    calificacion = 'DEFICIENTE';
    riesgo = 'MEDIO-ALTO';
    recomendacion = 'RECHAZAR';
    color = '#FFA94D';
  } else {
    calificacion = 'MALO';
    riesgo = 'ALTO';
    recomendacion = 'RECHAZAR';
    color = '#FF6B6B';
  }

  return {
    calificacion,
    riesgo,
    recomendacion,
    color,
  };
}

/**
 * Analiza los factores de riesgo
 */
export function analyzeRiskFactors(
  score: ScoreBuroCreditoRespBC
): {
  factoresRiesgo: string[];
  factoresPositivos: string[];
  riesgoTotal: number;
} {
  const factoresRiesgo = score?.factoresRiesgo || [];
  const factoresPositivos = score?.factoresPositivos || [];

  // Calcular puntuación de riesgo (0-100)
  const riesgoTotal = Math.min(100, factoresRiesgo.length * 10);

  return {
    factoresRiesgo,
    factoresPositivos,
    riesgoTotal,
  };
}

/**
 * Formatea el informe para presentación en el panel
 */
export function formatBuroReportForDisplay(response: InformeBuroResponse): any {
  const score = extractCreditScore(response);
  const cuentas = extractAccounts(response);
  const declaraciones = extractDeclarations(response);

  const scoreInterpretation = score ? interpretCreditScore(score) : null;
  const riskAnalysis = score ? analyzeRiskFactors(score) : null;

  return {
    score: {
      numerico: score?.scoreNumerico,
      categoria: score?.scoreCategoria,
      interpretacion: score?.scoreInterpretacion,
      calificacion: scoreInterpretation?.calificacion,
      riesgo: scoreInterpretation?.riesgo,
      recomendacion: scoreInterpretation?.recomendacion,
      color: scoreInterpretation?.color,
      fecha: score?.fechaCalculo,
    },
    riesgo: riskAnalysis,
    cuentas: cuentas.map((c) => ({
      otorgante: c.nombreOtorgante,
      numeroCuenta: c.numeroCuentaActual,
      tipo: c.tipoContrato,
      saldoActual: c.saldoActual,
      saldoVencido: c.saldoVencido,
      limiteCredito: c.limiteCredito || c.creditoMaximo,
      pagosVencidos: c.numeroPagosVencidos,
      ultimoPago: c.fechaUltimoPago,
    })),
    declaraciones: declaraciones.map((d) => ({
      declaracion: d.declaracionConsumidor,
    })),
  };
}

/**
 * Obtiene el resumen del informe
 */
export function getInformeSummary(response: InformeBuroResponse): any {
  return response?.respuesta?.resumenInforme || null;
}

/**
 * Genera un reporte ejecutivo
 */
export function generateExecutiveSummary(response: InformeBuroResponse): string {
  const score = extractCreditScore(response);
  const cuentas = extractAccounts(response);
  const interpretation = score ? interpretCreditScore(score) : null;

  const totalCuentas = cuentas.length;
  const cuentasActivas = cuentas.filter((c) => !c.fechaCierreCuenta).length;
  const saldoTotal = cuentas.reduce(
    (sum, c) => sum + (parseFloat(c.saldoActual || '0') || 0),
    0
  );
  const pagosVencidos = cuentas.reduce(
    (sum, c) => sum + (parseFloat(c.numeroPagosVencidos || '0') || 0),
    0
  );

  return `
RESUMEN EJECUTIVO DEL INFORME BURÓ

Score Crediticio: ${score?.scoreNumerico} (${interpretation?.calificacion})
Nivel de Riesgo: ${interpretation?.riesgo}
Recomendación: ${interpretation?.recomendacion}

Perfil del Cliente:
- Total de cuentas: ${totalCuentas}
- Cuentas activas: ${cuentasActivas}
- Saldo total: $${saldoTotal.toLocaleString('es-MX')}
- Pagos vencidos: ${pagosVencidos}

Fecha del Reporte: ${score?.fechaCalculo}
  `.trim();
}
