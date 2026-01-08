/**
 * Monitor Module
 * Implementa el monitoreo de crédito con alertas siguiendo monitor.json exactamente
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

interface MonitorRequest {
  consulta: {
    persona: PersonaBC;
  };
}

interface HawkAlertConsultaRespBC {
  claveAlerta?: string;
  descripcionAlerta?: string;
  fechaAlerta?: string;
  tipoAlerta?: string;
  severidad?: string;
  detalles?: string;
}

interface HawkAlertBDRespBC {
  claveAlerta?: string;
  descripcionAlerta?: string;
  fechaAlerta?: string;
  tipoAlerta?: string;
  severidad?: string;
  detalles?: string;
}

interface MonitorResponse {
  respuesta?: {
    alertas?: HawkAlertConsultaRespBC[];
    alertasBaseDatos?: HawkAlertBDRespBC[];
    cambios?: any[];
    encabezado?: any;
    personaRespBC?: any;
    resumenMonitor?: any;
  };
  error?: any;
}

/**
 * Construye el payload exacto para el módulo monitor
 * Sigue la estructura definida en monitor.json
 */
export function buildMonitorPayload(persona: PersonaBC): MonitorRequest {
  return {
    consulta: {
      persona,
    },
  };
}

/**
 * Realiza monitoreo de crédito de un cliente
 * Retorna alertas y cambios en el perfil crediticio
 */
export async function monitorCredit(
  persona: PersonaBC
): Promise<{
  success: boolean;
  data?: MonitorResponse;
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

    // Construir payload exacto según monitor.json
    const payload = buildMonitorPayload(persona);

    // Realizar monitoreo
    const response = await apiClient.post<MonitorResponse>(
      '/credit-report-api/v1/monitor',
      payload
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Monitor failed',
      };
    }

    return {
      success: true,
      data: response.data as MonitorResponse,
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
 * Extrae las alertas de consulta
 */
export function extractConsultationAlerts(
  response: MonitorResponse
): HawkAlertConsultaRespBC[] {
  return response?.respuesta?.alertas || [];
}

/**
 * Extrae las alertas de base de datos
 */
export function extractDatabaseAlerts(
  response: MonitorResponse
): HawkAlertBDRespBC[] {
  return response?.respuesta?.alertasBaseDatos || [];
}

/**
 * Extrae los cambios detectados
 */
export function extractChanges(response: MonitorResponse): any[] {
  return response?.respuesta?.cambios || [];
}

/**
 * Clasifica las alertas por severidad
 */
export function classifyAlertsBySeverity(
  alerts: HawkAlertConsultaRespBC[]
): {
  critical: HawkAlertConsultaRespBC[];
  high: HawkAlertConsultaRespBC[];
  medium: HawkAlertConsultaRespBC[];
  low: HawkAlertConsultaRespBC[];
} {
  return {
    critical: alerts.filter((a) => a.severidad === 'CRITICA' || a.severidad === 'CRITICAL'),
    high: alerts.filter((a) => a.severidad === 'ALTA' || a.severidad === 'HIGH'),
    medium: alerts.filter((a) => a.severidad === 'MEDIA' || a.severidad === 'MEDIUM'),
    low: alerts.filter((a) => a.severidad === 'BAJA' || a.severidad === 'LOW'),
  };
}

/**
 * Formatea las alertas para presentación en el panel
 */
export function formatAlertsForDisplay(
  alerts: HawkAlertConsultaRespBC[]
): any[] {
  return alerts.map((alert) => ({
    id: alert.claveAlerta,
    titulo: alert.descripcionAlerta,
    tipo: alert.tipoAlerta,
    severidad: alert.severidad,
    fecha: alert.fechaAlerta,
    detalles: alert.detalles,
  }));
}

/**
 * Obtiene el resumen del monitoreo
 */
export function getMonitorSummary(response: MonitorResponse): any {
  return response?.respuesta?.resumenMonitor || null;
}

/**
 * Verifica si hay alertas críticas
 */
export function hasCriticalAlerts(response: MonitorResponse): boolean {
  const alerts = extractConsultationAlerts(response);
  return alerts.some((a) => a.severidad === 'CRITICA' || a.severidad === 'CRITICAL');
}
