import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface ProspectorProps {
  persona: any;
}

export default function Prospector({ persona }: ProspectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const prospectorMutation = trpc.buro.prospector.useMutation({
    onSuccess: (result) => {
      setIsLoading(false);
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Error en la prospección');
      }
    },
    onError: (error) => {
      setIsLoading(false);
      setError(error.message || 'Error en la prospección');
    },
  });

  const handleProspect = () => {
    setIsLoading(true);
    setError(null);
    prospectorMutation.mutate(persona);
  };

  const cuentas = data?.respuesta?.cuentas || [];
  const consultasEfectuadas = data?.respuesta?.consultasEfectuadas || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prospección de Cliente</CardTitle>
          <CardDescription>
            Consulta la información de prospección del cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleProspect}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consultando...
              </>
            ) : (
              'Ejecutar Prospección'
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
          {cuentas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cuentas del Cliente</CardTitle>
                <CardDescription>
                  Total de cuentas: {cuentas.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Otorgante</TableHead>
                        <TableHead>Tipo Contrato</TableHead>
                        <TableHead>Saldo Actual</TableHead>
                        <TableHead>Saldo Vencido</TableHead>
                        <TableHead>Límite Crédito</TableHead>
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

          {consultasEfectuadas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consultas Efectuadas</CardTitle>
                <CardDescription>
                  Total de consultas: {consultasEfectuadas.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Otorgante</TableHead>
                        <TableHead>Tipo Contrato</TableHead>
                        <TableHead>Fecha Consulta</TableHead>
                        <TableHead>Resultado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consultasEfectuadas.map((consulta: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {consulta.nombreOtorgante || consulta.claveOtorgante}
                          </TableCell>
                          <TableCell>{consulta.tipoContrato}</TableCell>
                          <TableCell>{consulta.fechaConsulta}</TableCell>
                          <TableCell>{consulta.resultadoFinal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
