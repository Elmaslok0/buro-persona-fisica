import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, AlertTriangle } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface MonitorProps {
  persona: any;
}

export default function Monitor({ persona }: MonitorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const monitorMutation = trpc.buro.monitor.useMutation({
    onSuccess: (result) => {
      setIsLoading(false);
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Error en el monitoreo');
      }
    },
    onError: (error) => {
      setIsLoading(false);
      setError(error.message || 'Error en el monitoreo');
    },
  });

  const handleMonitor = () => {
    setIsLoading(true);
    setError(null);
    monitorMutation.mutate(persona);
  };

  const alertas = data?.respuesta?.alertas || [];
  const alertasBaseDatos = data?.respuesta?.alertasBaseDatos || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitoreo de Crédito</CardTitle>
          <CardDescription>Consulta las alertas y cambios en el perfil crediticio</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleMonitor} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Monitoreando...
              </>
            ) : (
              'Ejecutar Monitoreo'
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
          {alertas.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <AlertTriangle className="h-5 w-5" />
                  Alertas ({alertas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertas.map((alerta: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white rounded border border-yellow-200">
                      <p className="font-medium text-sm">{alerta.descripcionAlerta}</p>
                      <p className="text-xs text-gray-500 mt-1">Tipo: {alerta.tipoAlerta} | Severidad: {alerta.severidad}</p>
                      <p className="text-xs text-gray-500">Fecha: {alerta.fechaAlerta}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {alertasBaseDatos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alertas de Base de Datos ({alertasBaseDatos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertasBaseDatos.map((alerta: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-medium text-sm">{alerta.descripcionAlerta}</p>
                      <p className="text-xs text-gray-500 mt-1">Tipo: {alerta.tipoAlerta}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
