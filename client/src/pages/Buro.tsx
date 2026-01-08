import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, TrendingUp } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface BuroProps {
  persona: any;
}

export default function Buro({ persona }: BuroProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const burMutation = trpc.buro.informeBuro.useMutation({
    onSuccess: (result) => {
      setIsLoading(false);
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Error en la obtención del informe');
      }
    },
    onError: (error) => {
      setIsLoading(false);
      setError(error.message || 'Error en la obtención del informe');
    },
  });

  const handleGetReport = () => {
    setIsLoading(true);
    setError(null);
    burMutation.mutate(persona);
  };

  const score = data?.respuesta?.score;
  const cuentas = data?.respuesta?.cuentas || [];

  const getScoreColor = (scoreNum: number) => {
    if (scoreNum >= 800) return 'bg-green-100 text-green-900';
    if (scoreNum >= 700) return 'bg-blue-100 text-blue-900';
    if (scoreNum >= 600) return 'bg-yellow-100 text-yellow-900';
    if (scoreNum >= 500) return 'bg-orange-100 text-orange-900';
    return 'bg-red-100 text-red-900';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Informe del Buró de Crédito
          </CardTitle>
          <CardDescription>Obtén el informe completo con score crediticio</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetReport} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Obteniendo...
              </>
            ) : (
              'Obtener Informe'
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

      {data && score && (
        <>
          <Card className={getScoreColor(parseFloat(score.scoreNumerico || 0))}>
            <CardHeader>
              <CardTitle>Score Crediticio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-6xl font-bold">{score.scoreNumerico}</p>
                <p className="text-lg mt-2">{score.scoreCategoria}</p>
                <p className="text-sm mt-2">{score.scoreInterpretacion}</p>
                <p className="text-xs mt-4">Fecha: {score.fechaCalculo}</p>
              </div>
            </CardContent>
          </Card>

          {cuentas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cuentas ({cuentas.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cuentas.map((cuenta: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-medium">{cuenta.nombreOtorgante}</p>
                      <p className="text-sm text-gray-600">Saldo: ${parseFloat(cuenta.saldoActual || 0).toLocaleString('es-MX')}</p>
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
