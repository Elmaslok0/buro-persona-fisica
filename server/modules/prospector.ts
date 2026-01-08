/**
 * Prospector Module
 * Implementa la prospección de clientes siguiendo prospector.json exactamente
 * Integración con API real del buró de crédito
 * NO modificar campos, nombres o estructuras
 */

import { getApiClient } from '../services/apiClient';

/**
 * Estructura exacta de Persona según NombreBC y Direccion del autenticador
 */
interface PersonaBC {
  nombre?: {
    primerNombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    rfc?: string;
    fechaNacimiento?: string;
  };
  direccion?: {
    estado?: string;
    ciudad?: string;
    cp?: string;
    numeroTelefono?: string;
  };
  empleo?: {
    empresa?: string;
    puesto?: string;
    antiguedad?: string;
  };
}

/**
 * Request exacto para Prospector según prospector.json
 */
interface ProspectorRequest {
  consulta: {
    persona: PersonaBC;
  };
}

/**
 * Estructura de Cuenta del Cliente
 */
interface CuentaClienteBC {
  claveOtorgante?: string;
  nombreOtorgante?: string;
  numeroCuenta?: string;
}

/**
 * Estructura de Cuentas en la Respuesta
 */
interface CuentasRespBC {
  claveObservacion?: string;
  claveOtorgante?: string;
  claveUnidadMonetaria?: string;
  creditoMaximo?: string;
  fechaActualizacion?: string;
  fechaAperturaCAN?: string;
  fechaAperturaCuenta?: string;
  fechaCancelacionCAN?: string;
  fechaCierreCuenta?: string;
  fechaHistoricaMorosidadMasGrave?: string;
  fechaInicioReestructura?: string;
  fechaMasAntiguaHistoricoCAN?: string;
  fechaMasAntiguaHistoricoPagos?: string;
  fechaMasRecienteHistoricoCAN?: string;
  fechaMasRecienteHistoricoPagos?: string;
  fechaReporte?: string;
  fechaUltimaCompra?: string;
  fechaUltimoPago?: string;
  formaPagoActual?: string;
  frecuenciaPagos?: string;
  garantia?: string;
  historicoCAN?: string;
  historicoPagos?: string;
  identificadorCAN?: string;
  identificadorCredito?: string;
  identificadorSociedadInformacionCrediticia?: string;
  importeSaldoMorosidadHistMasGrave?: string;
  indicadorTipoResponsabilidad?: string;
  limiteCredito?: string;
  modoReportar?: string;
  montoPagar?: string;
  montoUltimoPago?: string;
  mopHistoricoMorosidadMasGrave?: string;
  nombreOtorgante?: string;
  numeroCuentaActual?: string;
  numeroPagos?: string;
  numeroPagosVencidos?: string;
  numeroTelefonoOtorgante?: string;
  registroImpugnado?: string;
  saldoActual?: string;
  saldoVencido?: string;
  tipoContrato?: string;
  tipoCuenta?: string;
  totalPagosCalificadosMOP2?: string;
  totalPagosCalificadosMOP3?: string;
  totalPagosCalificadosMOP4?: string;
  totalPagosCalificadosMOP5?: string;
  totalPagosReportados?: string;
  ultimaFechaSaldoCero?: string;
  valorActivoValuacion?: string;
}

/**
 * Estructura de Consulta Efectuada
 */
interface ConsultaEfectuadaRespBC {
  claveOtorgante?: string;
  claveUnidadMonetaria?: string;
  consumidorNuevo?: string;
  fechaConsulta?: string;
  identificacionBuro?: string;
  identificadorOrigenConsulta?: string;
  importeContrato?: string;
  indicadorTipoResponsabilidad?: string;
  nombreOtorgante?: string;
  resultadoFinal?: string;
  telefonoOtorgante?: string;
  tipoContrato?: string;
}

/**
 * Respuesta exacta del Prospector
 */
interface ProspectorResponse {
  respuesta?: {
    cuentas?: CuentasRespBC[];
    consultasEfectuadas?: ConsultaEfectuadaRespBC[];
    encabezado?: any;
    personaRespBC?: any;
    resumenReporte?: any;
  };
  error?: any;
}

/**
 * Construye el payload exacto para el módulo prospector
 * Sigue la estructura definida en prospector.json
 */
export function buildProspectorPayload(persona: PersonaBC): ProspectorRequest {
  return {
    consulta: {
      persona,
    },
  };
}

/**
 * Realiza prospección de un cliente usando la API real del buró
 * El token debe haber sido obtenido previamente mediante autenticación
 * 
 * @param persona Datos del cliente a prospectar
 * @returns Resultado de la prospección con cuentas y consultas previas
 */
export async function prospectClient(
  persona: PersonaBC
): Promise<{
  success: boolean;
  data?: ProspectorResponse;
  error?: string;
}> {
  try {
    const apiClient = getApiClient();

    // Verificar que hay token disponible
    if (!apiClient.isTokenValid()) {
      return {
        success: false,
        error: 'Token no válido. Por favor auténticate primero.',
      };
    }

    // Construir payload exacto según prospector.json
    const payload = buildProspectorPayload(persona);

    console.log('[Prospector] Enviando solicitud a API del buró', {
      endpoint: '/credit-report-api/v1/prospector',
      payload: JSON.stringify(payload),
    });

    // Realizar prospección usando el cliente de API
    // El token se incluye automáticamente en los headers
    const response = await apiClient.post<ProspectorResponse>(
      '/prospector',
      payload
    );

    if (!response.success) {
      console.error('[Prospector] Error en respuesta de API', {
        statusCode: response.statusCode,
        error: response.error,
      });

      return {
        success: false,
        error: response.error || 'Prospección fallida',
      };
    }

    console.log('[Prospector] Respuesta exitosa de API', {
      statusCode: response.statusCode,
      cuentas: response.data?.respuesta?.cuentas?.length || 0,
      consultas: response.data?.respuesta?.consultasEfectuadas?.length || 0,
    });

    return {
      success: true,
      data: response.data as ProspectorResponse,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[Prospector] Excepción capturada', { error: errorMessage });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Extrae las cuentas de la respuesta de prospección
 */
export function extractAccounts(
  response: ProspectorResponse
): CuentasRespBC[] {
  return response?.respuesta?.cuentas || [];
}

/**
 * Extrae las consultas efectuadas de la respuesta
 */
export function extractQueries(
  response: ProspectorResponse
): ConsultaEfectuadaRespBC[] {
  return response?.respuesta?.consultasEfectuadas || [];
}

/**
 * Obtiene el resumen del reporte
 */
export function getReportSummary(response: ProspectorResponse): any {
  return response?.respuesta?.resumenReporte || null;
}

/**
 * Formatea las cuentas para presentación en el panel
 * Extrae los campos más relevantes para visualización
 */
export function formatAccountsForDisplay(accounts: CuentasRespBC[]): any[] {
  return accounts.map((account) => ({
    otorgante: account.nombreOtorgante || account.claveOtorgante || 'N/A',
    numeroCuenta: account.numeroCuentaActual || account.identificadorCredito || 'N/A',
    tipoContrato: account.tipoContrato || 'N/A',
    saldoActual: account.saldoActual ? `$${parseFloat(account.saldoActual).toLocaleString('es-MX')}` : '$0.00',
    saldoVencido: account.saldoVencido ? `$${parseFloat(account.saldoVencido).toLocaleString('es-MX')}` : '$0.00',
    limiteCredito: account.limiteCredito ? `$${parseFloat(account.limiteCredito).toLocaleString('es-MX')}` : 'N/A',
    creditoMaximo: account.creditoMaximo ? `$${parseFloat(account.creditoMaximo).toLocaleString('es-MX')}` : 'N/A',
    fechaUltimoPago: account.fechaUltimoPago || 'N/A',
    numeroPagosVencidos: account.numeroPagosVencidos || '0',
    estado: account.claveObservacion || 'Activo',
  }));
}

/**
 * Formatea las consultas efectuadas para presentación en el panel
 */
export function formatQueriesForDisplay(queries: ConsultaEfectuadaRespBC[]): any[] {
  return queries.map((query) => ({
    otorgante: query.nombreOtorgante || query.claveOtorgante || 'N/A',
    fechaConsulta: query.fechaConsulta || 'N/A',
    tipoContrato: query.tipoContrato || 'N/A',
    resultado: query.resultadoFinal || 'N/A',
    importe: query.importeContrato ? `$${parseFloat(query.importeContrato).toLocaleString('es-MX')}` : 'N/A',
  }));
}
