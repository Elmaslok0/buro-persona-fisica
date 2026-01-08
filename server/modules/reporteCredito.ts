/**
 * Reporte de Crédito Module
 * Implementa la generación de reporte completo de crédito
 * Sigue reporte-de-credito.json exactamente
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

interface CreditReportRequest {
  consulta: {
    persona: PersonaBC;
  };
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

interface CreditReportResponse {
  respuesta?: {
    cuentas?: CuentasRespBC[];
    consultasEfectuadas?: any[];
    declaraciones?: any[];
    encabezado?: any;
    personaRespBC?: any;
    resumenReporte?: any;
    historicoCompleto?: any;
  };
  error?: any;
}

/**
 * Construye el payload exacto para el módulo reporte de crédito
 * Sigue la estructura definida en reporte-de-credito.json
 */
export function buildCreditReportPayload(
  persona: PersonaBC
): CreditReportRequest {
  return {
    consulta: {
      persona,
    },
  };
}

/**
 * Genera el reporte completo de crédito
 * Retorna todas las cuentas, historial y análisis
 */
export async function generateCreditReport(
  persona: PersonaBC
): Promise<{
  success: boolean;
  data?: CreditReportResponse;
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

    // Construir payload exacto según reporte-de-credito.json
    const payload = buildCreditReportPayload(persona);

    // Generar reporte
    const response = await apiClient.post<CreditReportResponse>(
      '/credit-report-api/v1/reporte-de-credito',
      payload
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Credit report generation failed',
      };
    }

    return {
      success: true,
      data: response.data as CreditReportResponse,
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
 * Extrae todas las cuentas del reporte
 */
export function extractAllAccounts(
  response: CreditReportResponse
): CuentasRespBC[] {
  return response?.respuesta?.cuentas || [];
}

/**
 * Extrae las consultas efectuadas
 */
export function extractQueries(response: CreditReportResponse): any[] {
  return response?.respuesta?.consultasEfectuadas || [];
}

/**
 * Extrae las declaraciones del cliente
 */
export function extractDeclarations(response: CreditReportResponse): any[] {
  return response?.respuesta?.declaraciones || [];
}

/**
 * Extrae el histórico completo
 */
export function extractCompleteHistory(response: CreditReportResponse): any {
  return response?.respuesta?.historicoCompleto || null;
}

/**
 * Calcula estadísticas del reporte
 */
export function calculateReportStatistics(
  response: CreditReportResponse
): {
  totalCuentas: number;
  cuentasActivas: number;
  cuentasCerradas: number;
  saldoTotalActual: number;
  saldoTotalVencido: number;
  creditoMaximoTotal: number;
} {
  const cuentas = extractAllAccounts(response);

  const saldoTotalActual = cuentas.reduce(
    (sum, c) => sum + (parseFloat(c.saldoActual || '0') || 0),
    0
  );
  const saldoTotalVencido = cuentas.reduce(
    (sum, c) => sum + (parseFloat(c.saldoVencido || '0') || 0),
    0
  );
  const creditoMaximoTotal = cuentas.reduce(
    (sum, c) => sum + (parseFloat(c.creditoMaximo || c.limiteCredito || '0') || 0),
    0
  );

  return {
    totalCuentas: cuentas.length,
    cuentasActivas: cuentas.filter((c) => !c.fechaCierreCuenta).length,
    cuentasCerradas: cuentas.filter((c) => c.fechaCierreCuenta).length,
    saldoTotalActual,
    saldoTotalVencido,
    creditoMaximoTotal,
  };
}

/**
 * Agrupa las cuentas por tipo
 */
export function groupAccountsByType(
  cuentas: CuentasRespBC[]
): {
  [key: string]: CuentasRespBC[];
} {
  const grouped: { [key: string]: CuentasRespBC[] } = {};

  cuentas.forEach((cuenta) => {
    const tipo = cuenta.tipoContrato || 'DESCONOCIDO';
    if (!grouped[tipo]) {
      grouped[tipo] = [];
    }
    grouped[tipo].push(cuenta);
  });

  return grouped;
}

/**
 * Identifica cuentas problemáticas
 */
export function identifyProblematicAccounts(
  cuentas: CuentasRespBC[]
): CuentasRespBC[] {
  return cuentas.filter(
    (c) =>
      (parseFloat(c.numeroPagosVencidos || '0') || 0) > 0 ||
      (parseFloat(c.saldoVencido || '0') || 0) > 0
  );
}

/**
 * Formatea el reporte para presentación en el panel
 */
export function formatReportForDisplay(response: CreditReportResponse): any {
  const cuentas = extractAllAccounts(response);
  const stats = calculateReportStatistics(response);
  const problematicas = identifyProblematicAccounts(cuentas);

  return {
    estadisticas: stats,
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
    cuentasProblematicas: problematicas.length,
    resumen: extractCompleteHistory(response),
  };
}

/**
 * Obtiene el resumen del reporte
 */
export function getReportSummary(response: CreditReportResponse): any {
  return response?.respuesta?.resumenReporte || null;
}
