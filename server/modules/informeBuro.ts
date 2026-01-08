/**
 * Informe Buró Module - Senior Architect Version
 * Alineado con informe-buro.json exactamente
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

interface InformeBuroResponse {
  respuesta?: any;
  error?: any;
}

export async function getBuroReport(
  persona: PersonaBC
): Promise<{
  success: boolean;
  data?: InformeBuroResponse;
  error?: string;
}> {
  try {
    const apiClient = getApiClient();
    
    // Alineado con la estructura de informe-buro.json
    const payload: InformeBuroRequest = {
      consulta: {
        persona,
      },
    };

    // Usar el endpoint directo definido en la arquitectura
    const response = await apiClient.post<InformeBuroResponse>(
      '/informe-buro',
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

// Preservar funciones de extracción y formato existentes
export function extractCreditScore(response: InformeBuroResponse) { return response?.respuesta?.score || null; }
export function extractAccounts(response: InformeBuroResponse) { return response?.respuesta?.cuentas || []; }
export function formatBuroReportForDisplay(response: InformeBuroResponse) {
  const score = extractCreditScore(response);
  const cuentas = extractAccounts(response);
  return {
    score: {
      numerico: score?.scoreNumerico,
      categoria: score?.scoreCategoria,
      interpretacion: score?.scoreInterpretacion,
      fecha: score?.fechaCalculo,
    },
    cuentas: cuentas.map((c: any) => ({
      otorgante: c.nombreOtorgante,
      numeroCuenta: c.numeroCuentaActual,
      saldoActual: c.saldoActual,
      saldoVencido: c.saldoVencido,
    })),
  };
}
