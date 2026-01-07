import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClientSelector } from "@/components/ClientSelector";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function EScore() {
  const [, setLocation] = useLocation();
  const [clientId, setClientId] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: client } = trpc.clientManagement.getById.useQuery(
    { clientId: parseInt(clientId) },
    { enabled: !!clientId }
  );

  const eScore = trpc.buro.eScore.useMutation({
    onSuccess: (data) => {
      toast.success("E-Score calculado exitosamente");
      setResult(data);
      setShowResult(true);
    },
    onError: (error) => {
      toast.error("Error al calcular E-Score: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client) {
      toast.error("Selecciona un cliente");
      return;
    }

    eScore.mutate({
      clientId: parseInt(clientId),
      persona: {
        primerNombre: client.nombres || "",
        apellidoPaterno: client.apellidoPaterno || "",
        apellidoMaterno: client.apellidoMaterno || "",
        fechaNacimiento: client.fechaNacimiento || "",
        rfc: client.rfc || "",
        curp: client.curp || "",
        nacionalidad: client.nacionalidad || "MX",
      },
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return "text-green-600";
    if (score >= 700) return "text-blue-600";
    if (score >= 600) return "text-yellow-600";
    if (score >= 500) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 800) return "EXCELENTE";
    if (score >= 700) return "MUY BUENO";
    if (score >= 600) return "BUENO";
    if (score >= 500) return "REGULAR";
    return "DEFICIENTE";
  };

  if (showResult && result) {
    const score = result?.eScore?.puntuacion || 0;
    const factores = result?.eScore?.factores || [];

    return (
      <div className="min-h-screen bg-white">
        <header className="border-b-8 border-black py-6">
          <div className="container flex items-center gap-6">
            <Button
              variant="outline"
              size="lg"
              className="border-4 border-black font-black"
              onClick={() => setShowResult(false)}
            >
              <ArrowLeft className="w-6 h-6" strokeWidth={3} />
            </Button>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              [RESULTADO E-SCORE]
            </h1>
          </div>
        </header>

        <main className="container py-12 space-y-8">
          {/* Puntuación Principal */}
          <Card className="border-4 border-black p-8">
            <h2 className="text-3xl font-black uppercase mb-6">PUNTUACIÓN E-SCORE</h2>
            <div className="flex flex-col items-center justify-center py-12">
              <div className={`text-8xl font-black mb-4 ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-4xl font-black text-center">
                {getScoreLabel(score)}
              </div>
              <div className="text-lg font-bold text-gray-600 mt-4">
                Rango: 0 - 1000
              </div>
            </div>
          </Card>

          {/* Análisis de Factores */}
          {factores.length > 0 && (
            <Card className="border-4 border-black p-8">
              <h2 className="text-3xl font-black uppercase mb-6">FACTORES DE ANÁLISIS</h2>
              <div className="space-y-4">
                {factores.map((factor: any, idx: number) => (
                  <div key={idx} className="border-4 border-black p-6">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xl font-black">{factor.nombre}</p>
                      <p className={`text-2xl font-black ${factor.impacto === 'POSITIVO' ? 'text-green-600' : 'text-red-600'}`}>
                        {factor.impacto === 'POSITIVO' ? '+' : '-'}{factor.valor}%
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-600">{factor.descripcion}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recomendaciones */}
          <Card className="border-4 border-black p-8">
            <h2 className="text-3xl font-black uppercase mb-6">RECOMENDACIONES</h2>
            <div className="space-y-3">
              {score >= 800 && (
                <>
                  <p className="text-lg font-bold">✓ Excelente perfil crediticio</p>
                  <p className="text-lg font-bold">✓ Apto para productos premium</p>
                  <p className="text-lg font-bold">✓ Tasas preferenciales disponibles</p>
                </>
              )}
              {score >= 700 && score < 800 && (
                <>
                  <p className="text-lg font-bold">✓ Buen perfil crediticio</p>
                  <p className="text-lg font-bold">✓ Apto para créditos estándar</p>
                  <p className="text-lg font-bold">✓ Mantener buen historial de pagos</p>
                </>
              )}
              {score >= 600 && score < 700 && (
                <>
                  <p className="text-lg font-bold">⚠ Perfil crediticio aceptable</p>
                  <p className="text-lg font-bold">⚠ Mejorar historial de pagos</p>
                  <p className="text-lg font-bold">⚠ Reducir deuda actual</p>
                </>
              )}
              {score < 600 && (
                <>
                  <p className="text-lg font-bold">✗ Perfil crediticio deficiente</p>
                  <p className="text-lg font-bold">✗ Se recomienda mejorar historial</p>
                  <p className="text-lg font-bold">✗ Regularizar pagos atrasados</p>
                </>
              )}
            </div>
          </Card>

          {/* JSON Completo */}
          <Card className="border-4 border-black p-8">
            <h2 className="text-3xl font-black uppercase mb-6">DATOS COMPLETOS</h2>
            <pre className="text-sm font-mono overflow-auto bg-secondary p-6">
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-8 border-black py-6">
        <div className="container flex items-center gap-6">
          <Button
            variant="outline"
            size="lg"
            className="border-4 border-black font-black"
            onClick={() => setLocation("/modules")}
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={3} />
          </Button>
          <TrendingUp className="w-12 h-12" strokeWidth={3} />
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            [E-SCORE]
          </h1>
        </div>
      </header>

      <main className="container py-12">
        <Card className="border-4 border-black p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase mb-4">DESCRIPCIÓN</h2>
            <p className="text-lg font-bold">
              Puntuación de crédito electrónica (E-Score) que evalúa el perfil crediticio de la persona 
              basado en su historial de pagos, deuda actual, antigüedad crediticia y otros factores relevantes.
              La puntuación va de 0 a 1000, donde valores más altos indican mejor solvencia crediticia.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <ClientSelector value={clientId} onChange={setClientId} />

            {clientId && client && (
              <>
                <div className="border-4 border-black p-6 bg-secondary">
                  <h3 className="text-2xl font-black uppercase mb-4">DATOS DEL CLIENTE</h3>
                  <div className="grid grid-cols-2 gap-4 text-lg font-bold">
                    <div>NOMBRE: {client.nombres} {client.apellidoPaterno} {client.apellidoMaterno}</div>
                    <div>RFC: {client.rfc || 'N/A'}</div>
                    <div>CURP: {client.curp || 'N/A'}</div>
                    <div>FECHA NAC: {client.fechaNacimiento || 'N/A'}</div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1 text-2xl font-black uppercase border-4 border-black"
                    onClick={() => setLocation("/modules")}
                  >
                    CANCELAR
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 text-2xl font-black uppercase border-4 border-black"
                    disabled={eScore.isPending}
                  >
                    {eScore.isPending ? "CALCULANDO..." : "CALCULAR E-SCORE"}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Card>
      </main>
    </div>
  );
}
