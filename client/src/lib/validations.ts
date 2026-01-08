/**
 * Validaciones para datos mexicanos
 * RFC, Fecha de Nacimiento, Código Postal
 */

/**
 * Valida el formato de RFC mexicano
 * RFC debe tener 13 caracteres: 6 letras + 6 números + 1 letra/número
 */
export function validateRFC(rfc: string): { valid: boolean; error?: string } {
  if (!rfc) {
    return { valid: false, error: 'RFC es requerido' };
  }

  const rfcClean = rfc.toUpperCase().replace(/\s+/g, '');

  if (rfcClean.length !== 13) {
    return { valid: false, error: 'RFC debe tener 13 caracteres' };
  }

  const rfcPattern = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/;
  if (!rfcPattern.test(rfcClean)) {
    return { valid: false, error: 'RFC tiene formato inválido' };
  }

  return { valid: true };
}

/**
 * Valida la fecha de nacimiento en formato DD/MM/YYYY
 */
export function validateBirthDate(
  dateStr: string
): { valid: boolean; error?: string; date?: Date } {
  if (!dateStr) {
    return { valid: false, error: 'Fecha de nacimiento es requerida' };
  }

  // Remover espacios
  const cleanDate = dateStr.replace(/\s+/g, '');

  // Validar formato DD/MM/YYYY
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = cleanDate.match(datePattern);

  if (!match) {
    return { valid: false, error: 'Formato debe ser DD/MM/YYYY' };
  }

  const [, dayStr, monthStr, yearStr] = match;
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  // Validar rango de día
  if (day < 1 || day > 31) {
    return { valid: false, error: 'Día debe estar entre 01 y 31' };
  }

  // Validar rango de mes
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Mes debe estar entre 01 y 12' };
  }

  // Validar rango de año (persona debe tener al menos 18 años)
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear - 18) {
    return { valid: false, error: 'Debe ser mayor de 18 años' };
  }

  // Crear fecha y validar que sea válida
  const date = new Date(year, month - 1, day);
  if (date.getDate() !== day || date.getMonth() !== month - 1) {
    return { valid: false, error: 'Fecha no válida' };
  }

  return { valid: true, date };
}

/**
 * Valida el código postal mexicano
 * Debe tener 5 dígitos
 */
export function validatePostalCode(cp: string): { valid: boolean; error?: string } {
  if (!cp) {
    return { valid: false, error: 'Código postal es requerido' };
  }

  const cpClean = cp.replace(/\s+/g, '');

  if (!/^\d{5}$/.test(cpClean)) {
    return { valid: false, error: 'Código postal debe tener 5 dígitos' };
  }

  return { valid: true };
}

/**
 * Formatea RFC a mayúsculas sin espacios
 */
export function formatRFC(rfc: string): string {
  return rfc.toUpperCase().replace(/\s+/g, '');
}

/**
 * Formatea fecha de nacimiento a DD/MM/YYYY
 */
export function formatBirthDate(dateStr: string): string {
  // Remover caracteres no numéricos excepto /
  const cleaned = dateStr.replace(/[^\d/]/g, '');

  // Si tiene más de 10 caracteres, truncar
  if (cleaned.length > 10) {
    return cleaned.slice(0, 10);
  }

  // Agregar / automáticamente
  if (cleaned.length === 2 && !cleaned.includes('/')) {
    return cleaned + '/';
  }

  if (cleaned.length === 5 && cleaned.split('/').length === 2) {
    return cleaned + '/';
  }

  return cleaned;
}

/**
 * Formatea código postal (solo números)
 */
export function formatPostalCode(cp: string): string {
  return cp.replace(/\D/g, '').slice(0, 5);
}

/**
 * Base de datos de códigos postales mexicanos (muestra)
 * En producción, esto vendría de una API
 */
export const POSTAL_CODE_DATABASE: Record<
  string,
  { estado: string; ciudad: string }
> = {
  '28001': { estado: 'CHIHUAHUA', ciudad: 'JUAREZ' },
  '28000': { estado: 'CHIHUAHUA', ciudad: 'CHIHUAHUA' },
  '06500': { estado: 'MEXICO', ciudad: 'MEXICO' },
  '06600': { estado: 'MEXICO', ciudad: 'MEXICO' },
  '64000': { estado: 'NUEVO LEON', ciudad: 'MONTERREY' },
  '64010': { estado: 'NUEVO LEON', ciudad: 'MONTERREY' },
  '78000': { estado: 'SAN LUIS POTOSI', ciudad: 'SAN LUIS POTOSI' },
  '20000': { estado: 'AGUASCALIENTES', ciudad: 'AGUASCALIENTES' },
  '37000': { estado: 'GUANAJUATO', ciudad: 'LEON' },
  '76000': { estado: 'QUERETARO', ciudad: 'QUERETARO' },
};

/**
 * Busca localidad por código postal
 */
export function getLocalityByPostalCode(
  cp: string
): { estado: string; ciudad: string } | null {
  const cleanCP = cp.replace(/\D/g, '');
  return POSTAL_CODE_DATABASE[cleanCP] || null;
}
