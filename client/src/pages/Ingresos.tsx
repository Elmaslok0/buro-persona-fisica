import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, TrendingUp } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface IngresosProps {
  persona: any;
}

export default function Ingresos({ persona }: IngresosProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const estimadorMutation = trpc.buro.estimadorIngresos.useMutation({
    onSuccess: (result) => {
      setIsLoading(false);
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Error en la estimación');
      }
    },
    onError: (error) => {
      setIsLoading(false);
      setError(error.message || 'Error en la estimación');
    },
  });

  const handleEstimate = () => {
    setIsLoading(true);
    setError(null);
    estimadorMutation.mutate(persona);
  };

  const estimacion = data?.respuesta?.estimacionIngresos;
  const analisis = data?.respuesta?.analisisCapacidadPago;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estimador de Ingresos</CardTitle>
          <CardDescription>Estima ingresos basado en historial crediticio</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleEstimate} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Estimando...
              </>
            ) : (
              'Ejecutar Estimación'
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="flex gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {data && (
        <>
          {estimacion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estimación de Ingresos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ingreso Mínimo</p>
                    <p className="text-2xl font-bold text-blue-900">${parseFloat(estimacion.ingresoMinimo || 0).toLocaleString('es-MX')}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ingreso Estimado</p>
                    <p className="text-2xl font-bold text-green-900">${parseFloat(estimacion.ingresoEstimado || 0).toLocaleString('es-MX')}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ingreso Máximo</p>
                    <p className="text-2xl font-bold text-purple-900">${parseFloat(estimacion.ingresoMaximo || 0).toLocaleString('es-MX')}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">Nivel de Confianza: {estimacion.nivelConfianza}</p>
              </CardContent>
            </Card>
          )}

          {analisis && (
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Capacidad de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Capacidad Total</span>
                    <span>${parseFloat(analisis.capacidadPagoTotal || 0).toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Capacidad Disponible</span>
                    <span>${parseFloat(analisis.capacidadPagoDisponible || 0).toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">% Utilización</span>
                    <span>{analisis.porcentajeUtilizacion}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-medium">Recomendación</span>
                    <span className="text-blue-900 font-semibold">{analisis.recomendacionCredito}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
