import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Loader2, FileText } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface ReporteProps {
  persona: any;
}

export default function Reporte({ persona }: ReporteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const reporteMutation = trpc.buro.reporteCredito.useMutation({
    onSuccess: (result) => {
      setIsLoading(false);
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Error en la generación del reporte');
      }
    },
    onError: (error) => {
      setIsLoading(false);
      setError(error.message || 'Error en la generación del reporte');
    },
  });

  const handleGenerate = () => {
    setIsLoading(true);
    setError(null);
    reporteMutation.mutate(persona);
  };

  const cuentas = data?.respuesta?.cuentas || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reporte de Crédito Completo
          </CardTitle>
          <CardDescription>Genera el reporte completo del cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              'Generar Reporte'
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

      {data && cuentas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cuentas del Reporte</CardTitle>
            <CardDescription>Total de cuentas: {cuentas.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Otorgante</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Saldo Actual</TableHead>
                    <TableHead>Saldo Vencido</TableHead>
                    <TableHead>Límite</TableHead>
                    <TableHead>Pagos Vencidos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cuentas.map((cuenta: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {cuenta.nombreOtorgante || cuenta.claveOtorgante}
                      </TableCell>
                      <TableCell>{cuenta.tipoContrato}</TableCell>
                      <TableCell>${parseFloat(cuenta.saldoActual || 0).toLocaleString('es-MX')}</TableCell>
                      <TableCell className={parseFloat(cuenta.saldoVencido || 0) > 0 ? 'text-red-600 font-medium' : ''}>
                        ${parseFloat(cuenta.saldoVencido || 0).toLocaleString('es-MX')}
                      </TableCell>
                      <TableCell>${parseFloat(cuenta.limiteCredito || cuenta.creditoMaximo || 0).toLocaleString('es-MX')}</TableCell>
                      <TableCell className={parseInt(cuenta.numeroPagosVencidos || 0) > 0 ? 'text-red-600 font-medium' : ''}>
                        {cuenta.numeroPagosVencidos || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
