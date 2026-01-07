import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientSelector } from "@/components/ClientSelector";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, BarChart3 } from "lucide-react";

export default function InformeBuro() {
  const [, setLocation] = useLocation();
  const [clientId, setClientId] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: client } = trpc.clientManagement.getById.useQuery(
    { clientId: parseInt(clientId) },
    { enabled: !!clientId }
  );

  const [formData, setFormData] = useState({
    claveOtorgante: "",
    nombreOtorgante: "",
    folioConsulta: "",
    folioConsultaOtorgante: "",
  });

  const informeBuro = trpc.buro.informeBuro.useMutation({
    onSuccess: (data) => {
      toast.success("Informe generado exitosamente");
      setResult(data);
      setShowResult(true);
    },
    onError: (error) => {
      toast.error("Error al generar informe: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client) {
      toast.error("Selecciona un cliente");
      return;
    }

    informeBuro.mutate({
      clientId: parseInt(clientId),
      persona: {
        primerNombre: client.nombres || "",
        apellidoPaterno: client.apellidoPaterno || "",
        apellidoMaterno: client.apellidoMaterno || "",
        fechaNacimiento: client.fechaNacimiento || "",
        rfc: client.rfc || "",
        curp: client.curp || "",
        nacionalidad: client.nacionalidad || "MX",
        domicilio: {
          direccion1: "CALLE EJEMPLO 123",
          coloniaPoblacion: "CENTRO",
          delegacionMunicipio: "BENITO JUAREZ",
          ciudad: "CIUDAD DE MEXICO",
          estado: "CDMX",
          cp: "03100",
          codPais: "MX",
        },
      },
      encabezado: {
        claveOtorgante: formData.claveOtorgante,
        nombreOtorgante: formData.nombreOtorgante,
        folioConsulta: formData.folioConsulta || new Date().getTime().toString(),
        folioConsultaOtorgante: formData.folioConsultaOtorgante,
        claveUnidadMonetaria: "MX",
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (showResult && result) {
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
              [RESULTADO INFORME]
            </h1>
          </div>
        </header>

        <main className="container py-12">
          <Card className="border-4 border-black p-8">
            <h2 className="text-3xl font-black uppercase mb-6">INFORME DETALLADO</h2>
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
          <BarChart3 className="w-12 h-12" strokeWidth={3} />
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            [INFORME BURÓ]
          </h1>
        </div>
      </header>

      <main className="container py-12">
        <Card className="border-4 border-black p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase mb-4">DESCRIPCIÓN</h2>
            <p className="text-lg font-bold">
              Informe detallado del buró de crédito que incluye consultas realizadas por otros otorgantes,
              declaraciones del consumidor, datos de empleo y domicilio, y resumen del comportamiento crediticio.
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

                <div>
                  <h2 className="text-4xl font-black uppercase mb-6 border-b-4 border-black pb-2">
                    DATOS DEL OTORGANTE
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-xl font-black uppercase">CLAVE OTORGANTE *</Label>
                      <Input
                        name="claveOtorgante"
                        value={formData.claveOtorgante}
                        onChange={handleChange}
                        required
                        placeholder="0000000000"
                        className="border-4 border-black text-lg font-bold mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xl font-black uppercase">NOMBRE OTORGANTE *</Label>
                      <Input
                        name="nombreOtorgante"
                        value={formData.nombreOtorgante}
                        onChange={handleChange}
                        required
                        placeholder="NOMBRE DE LA INSTITUCIÓN"
                        className="border-4 border-black text-lg font-bold mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xl font-black uppercase">FOLIO CONSULTA</Label>
                      <Input
                        name="folioConsulta"
                        value={formData.folioConsulta}
                        onChange={handleChange}
                        placeholder="Se generará automáticamente"
                        className="border-4 border-black text-lg font-bold mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xl font-black uppercase">FOLIO CONSULTA OTORGANTE</Label>
                      <Input
                        name="folioConsultaOtorgante"
                        value={formData.folioConsultaOtorgante}
                        onChange={handleChange}
                        placeholder="Opcional"
                        className="border-4 border-black text-lg font-bold mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-4 border-black p-6 bg-accent">
                  <h3 className="text-2xl font-black uppercase mb-4">INFORMACIÓN DEL INFORME</h3>
                  <ul className="space-y-2 text-lg font-bold">
                    <li>• Consultas realizadas por otros otorgantes</li>
                    <li>• Declaraciones del consumidor</li>
                    <li>• Datos de empleo actualizados</li>
                    <li>• Historial de direcciones</li>
                    <li>• Resumen de comportamiento crediticio</li>
                  </ul>
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
                    disabled={informeBuro.isPending}
                  >
                    {informeBuro.isPending ? "GENERANDO..." : "GENERAR INFORME"}
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
