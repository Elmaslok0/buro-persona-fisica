/**
 * Monitor Module - Senior Architect Version
 * Alineado con monitor.json exactamente
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
}

interface MonitorResponse {
  respuesta?: any;
  error?: any;
}

export async function monitorCredit(
  persona: PersonaBC
): Promise<{
  success: boolean;
  data?: MonitorResponse;
  error?: string;
}> {
  try {
    const apiClient = getApiClient();
    
    const payload = {
      consulta: {
        persona,
      },
    };

    // Usar el endpoint directo definido en la arquitectura
    const response = await apiClient.post<MonitorResponse>(
      '/monitor',
      payload
    );

    return response;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export function extractConsultationAlerts(response: MonitorResponse) { return response?.respuesta?.alertas || []; }
export function extractDatabaseAlerts(response: MonitorResponse) { return response?.respuesta?.alertasBaseDatos || []; }
export function formatAlertsForDisplay(alerts: any[]) {
  return alerts.map((alert) => ({
    id: alert.claveAlerta,
    titulo: alert.descripcionAlerta,
    severidad: alert.severidad,
    fecha: alert.fechaAlerta,
  }));
}
