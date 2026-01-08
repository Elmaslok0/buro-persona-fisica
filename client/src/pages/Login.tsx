import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import {
  validateRFC,
  validateBirthDate,
  validatePostalCode,
  formatRFC,
  formatBirthDate,
  formatPostalCode,
  getLocalityByPostalCode,
} from '@/lib/validations';

export default function Login() {
  const [, setLocation] = useLocation();
  const [persona, setPersona] = useState<any>({
    nombre: {
      primerNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      rfc: '',
      fechaNacimiento: '',
    },
    domicilios: [
      {
        direccion1: '',
        direccion2: '',
        coloniaPoblacion: '',
        delegacionMunicipio: '',
        ciudad: '',
        estado: '',
        cp: '',
        codPais: 'MX',
        numeroTelefono: '',
      },
    ],
    empleo: {
      empresa: '',
      puesto: '',
      antiguedad: '',
    },
  });

  const [validations, setValidations] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const authenticateMutation = trpc.buro.authenticate.useMutation({
    onSuccess: (result: any) => {
      if (result.success) {
        if (result.token) {
          localStorage.setItem('buro_token', result.token);
          localStorage.setItem('persona', JSON.stringify(persona));
          localStorage.setItem('authenticated', 'true');
        }
        setTimeout(() => {
          setLocation('/dashboard');
        }, 500);
      } else {
        setError(result.error || 'Error en la autenticación');
      }
    },
    onError: (error: any) => {
      setError(error.message || 'Error en la autenticación');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    let formattedValue = value;
    let fieldName = id;

    // Aplicar formateo según el campo
    if (id === 'rfc') {
      formattedValue = formatRFC(value);
    } else if (id === 'fechaNacimiento') {
      formattedValue = formatBirthDate(value);
    } else if (id === 'cp') {
      formattedValue = formatPostalCode(value);
    }

    // Actualizar estado según el campo
    if (['primerNombre', 'apellidoPaterno', 'apellidoMaterno', 'rfc', 'fechaNacimiento'].includes(id)) {
      setPersona((prev: any) => ({
        ...prev,
        nombre: {
          ...prev.nombre,
          [id]: formattedValue,
        },
      }));
    } else if (['direccion1', 'direccion2', 'coloniaPoblacion', 'delegacionMunicipio', 'ciudad', 'estado', 'cp', 'numeroTelefono'].includes(id)) {
      setPersona((prev: any) => ({
        ...prev,
        domicilios: [
          {
            ...prev.domicilios[0],
            [id]: formattedValue,
          },
        ],
      }));
    } else if (['empresa', 'puesto', 'antiguedad'].includes(id)) {
      setPersona((prev: any) => ({
        ...prev,
        empleo: {
          ...prev.empleo,
          [id]: formattedValue,
        },
      }));
    }

    // Validar campo
    validateField(id, formattedValue);

    // Si es código postal, buscar localidad automáticamente
    if (id === 'cp' && formattedValue.length === 5) {
      const locality = getLocalityByPostalCode(formattedValue);
      if (locality) {
        setPersona((prev: any) => ({
          ...prev,
          domicilios: [
            {
              ...prev.domicilios[0],
              estado: locality.estado,
              ciudad: locality.ciudad,
            },
          ],
        }));
      }
    }
  };

  const validateField = useCallback((field: string, value: string) => {
    let isValid = false;

    if (field === 'rfc') {
      isValid = validateRFC(value).valid;
    } else if (field === 'fechaNacimiento') {
      isValid = validateBirthDate(value).valid;
    } else if (field === 'cp') {
      isValid = value.length === 0 || validatePostalCode(value).valid;
    } else if (
      field === 'primerNombre' ||
      field === 'apellidoPaterno' ||
      field === 'empresa' ||
      field === 'direccion1' ||
      field === 'coloniaPoblacion' ||
      field === 'delegacionMunicipio'
    ) {
      isValid = value.trim().length > 0;
    }

    setValidations((prev) => ({
      ...prev,
      [field]: isValid,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar RFC
    const rfcValidation = validateRFC(persona.nombre.rfc);
    if (!rfcValidation.valid) {
      setError(rfcValidation.error || 'RFC inválido');
      return;
    }

    // Validar Fecha de Nacimiento
    const dateValidation = validateBirthDate(persona.nombre.fechaNacimiento);
    if (!dateValidation.valid) {
      setError(dateValidation.error || 'Fecha inválida');
      return;
    }

    // Validar campos requeridos de nombre
    if (
      !persona.nombre.primerNombre ||
      !persona.nombre.apellidoPaterno ||
      !persona.empleo.empresa
    ) {
      setError('Por favor completa todos los campos requeridos de nombre y empresa');
      return;
    }

    // Validar campos requeridos de dirección
    const domicilio = persona.domicilios[0];
    if (
      !domicilio.direccion1 ||
      !domicilio.coloniaPoblacion ||
      !domicilio.delegacionMunicipio ||
      !domicilio.ciudad ||
      !domicilio.estado ||
      !domicilio.cp
    ) {
      setError('Por favor completa todos los campos requeridos de dirección');
      return;
    }

    // Validar código postal
    if (!validatePostalCode(domicilio.cp).valid) {
      setError('Código postal inválido');
      return;
    }

    // Construir payload exacto según autenticador.json
    const payload = {
      nombre: {
        primerNombre: persona.nombre.primerNombre,
        apellidoPaterno: persona.nombre.apellidoPaterno,
        apellidoMaterno: persona.nombre.apellidoMaterno || '',
        rfc: persona.nombre.rfc,
        fechaNacimiento: persona.nombre.fechaNacimiento,
      },
      domicilios: [
        {
          direccion1: domicilio.direccion1,
          direccion2: domicilio.direccion2 || '',
          coloniaPoblacion: domicilio.coloniaPoblacion,
          delegacionMunicipio: domicilio.delegacionMunicipio,
          ciudad: domicilio.ciudad,
          estado: domicilio.estado,
          cp: domicilio.cp,
          codPais: domicilio.codPais,
          numeroTelefono: domicilio.numeroTelefono || '',
        },
      ],
      empleo: {
        empresa: persona.empleo.empresa,
        puesto: persona.empleo.puesto || '',
        antiguedad: persona.empleo.antiguedad || '',
      },
    };

    // Enviar autenticación
    authenticateMutation.mutate(payload);
  };

  const getRFCError = () => {
    if (!persona.nombre.rfc) return null;
    return validateRFC(persona.nombre.rfc).error || null;
  };

  const getDateError = () => {
    if (!persona.nombre.fechaNacimiento) return null;
    return validateBirthDate(persona.nombre.fechaNacimiento).error || null;
  };

  const domicilio = persona.domicilios[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center">Panel Crediticio</CardTitle>
          <CardDescription className="text-center">
            Sistema de Buró de Crédito Profesional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECCIÓN 1: DATOS PERSONALES */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-900">Datos Personales</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primer Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="primerNombre">
                    Nombre *
                    {validations['primerNombre'] && (
                      <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />
                    )}
                  </Label>
                  <Input
                    id="primerNombre"
                    placeholder="Juan"
                    value={persona.nombre.primerNombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Apellido Paterno */}
                <div className="space-y-2">
                  <Label htmlFor="apellidoPaterno">
                    Apellido Paterno *
                    {validations['apellidoPaterno'] && (
                      <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />
                    )}
                  </Label>
                  <Input
                    id="apellidoPaterno"
                    placeholder="García"
                    value={persona.nombre.apellidoPaterno}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Apellido Materno */}
                <div className="space-y-2">
                  <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
                  <Input
                    id="apellidoMaterno"
                    placeholder="López"
                    value={persona.nombre.apellidoMaterno}
                    onChange={handleInputChange}
                  />
                </div>

                {/* RFC */}
                <div className="space-y-2">
                  <Label htmlFor="rfc">
                    RFC *
                    {validations['rfc'] && (
                      <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />
                    )}
                  </Label>
                  <Input
                    id="rfc"
                    placeholder="ABC123456XYZ"
                    value={persona.nombre.rfc}
                    onChange={handleInputChange}
                    required
                    maxLength={13}
                    className={getRFCError() ? 'border-red-500' : ''}
                  />
                  {getRFCError() && (
                    <p className="text-xs text-red-600">{getRFCError()}</p>
                  )}
                </div>

                {/* Fecha de Nacimiento */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fechaNacimiento">
                    Fecha de Nacimiento (DD/MM/YYYY) *
                    {validations['fechaNacimiento'] && (
                      <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />
                    )}
                  </Label>
                  <Input
                    id="fechaNacimiento"
                    placeholder="01/01/1990"
                    value={persona.nombre.fechaNacimiento}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className={getDateError() ? 'border-red-500' : ''}
                  />
                  {getDateError() && (
                    <p className="text-xs text-red-600">{getDateError()}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: DIRECCIÓN COMPLETA */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-900">Dirección Completa</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Calle y Número */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="direccion1">
                    Calle y Número *
                    {validations['direccion1'] && (
                      <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />
                    )}
                  </Label>
                  <Input
                    id="direccion1"
                    placeholder="Avenida Paseo de la Reforma 505"
                    value={domicilio.direccion1}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Apartamento/Complemento */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="direccion2">Apartamento/Complemento</Label>
                  <Input
                    id="direccion2"
                    placeholder="Depto. 1205 (opcional)"
                    value={domicilio.direccion2}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Colonia/Población */}
                <div className="space-y-2">
                  <Label htmlFor="coloniaPoblacion">
                    Colonia/Población *
                    {validations['coloniaPoblacion'] && (
                      <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />
                    )}
                  </Label>
                  <Input
                    id="coloniaPoblacion"
                    placeholder="Cuauhtémoc"
                    value={domicilio.coloniaPoblacion}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Delegación/Municipio */}
                <div className="space-y-2">
                  <Label htmlFor="delegacionMunicipio">
                    Delegación/Municipio *
                    {validations['delegacionMunicipio'] && (
                      <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />
                    )}
                  </Label>
                  <Input
                    id="delegacionMunicipio"
                    placeholder="Cuauhtémoc"
                    value={domicilio.delegacionMunicipio}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Código Postal */}
                <div className="space-y-2">
                  <Label htmlFor="cp">Código Postal *</Label>
                  <Input
                    id="cp"
                    placeholder="28001"
                    value={domicilio.cp}
                    onChange={handleInputChange}
                    required
                    maxLength={5}
                  />
                  <p className="text-xs text-gray-500">
                    Ingresa el CP para obtener automáticamente tu estado y ciudad
                  </p>
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Input
                    id="estado"
                    placeholder="CHIHUAHUA"
                    value={domicilio.estado}
                    onChange={handleInputChange}
                    required
                    readOnly={!!getLocalityByPostalCode(domicilio.cp)}
                    className={
                      getLocalityByPostalCode(domicilio.cp)
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    }
                  />
                </div>

                {/* Ciudad */}
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Input
                    id="ciudad"
                    placeholder="JUAREZ"
                    value={domicilio.ciudad}
                    onChange={handleInputChange}
                    required
                    readOnly={!!getLocalityByPostalCode(domicilio.cp)}
                    className={
                      getLocalityByPostalCode(domicilio.cp)
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    }
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="numeroTelefono">Teléfono de Contacto</Label>
                  <Input
                    id="numeroTelefono"
                    placeholder="5555555555"
                    value={domicilio.numeroTelefono}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: EMPLEO */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-900">Información Laboral</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Empresa */}
                <div className="space-y-2">
                  <Label htmlFor="empresa">
                    Empresa *
                    {validations['empresa'] && (
                      <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />
                    )}
                  </Label>
                  <Input
                    id="empresa"
                    placeholder="Nombre de la empresa"
                    value={persona.empleo.empresa}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Puesto */}
                <div className="space-y-2">
                  <Label htmlFor="puesto">Puesto</Label>
                  <Input
                    id="puesto"
                    placeholder="Analista"
                    value={persona.empleo.puesto}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Antigüedad */}
                <div className="space-y-2">
                  <Label htmlFor="antiguedad">Antigüedad (años)</Label>
                  <Input
                    id="antiguedad"
                    placeholder="5"
                    value={persona.empleo.antiguedad}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={authenticateMutation.isPending}
            >
              {authenticateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Ingresar al Panel'
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              * Campos requeridos | Todos los datos son identificadores principales para el buró
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
