import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientSelector } from "@/components/ClientSelector";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Shield } from "lucide-react";

export default function Autenticador() {
  const [, setLocation] = useLocation();
  const [clientId, setClientId] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: client } = trpc.clientManagement.getById.useQuery(
    { clientId: parseInt(clientId) },
    { enabled: !!clientId }
  );

  const [formData, setFormData] = useState({
    // Autenticación
    ejercidoCreditoAutomotriz: "",
    ejercidoCreditoHipotecario: "",
    tarjetaCredito: "",
    ultimosCuatroDigitos: "",
    referenciaOperador: "",
  });

  const autenticar = trpc.buro.autenticador.useMutation({
    onSuccess: (data) => {
      toast.success("Autenticación exitosa");
      setResult(data);
      setShowResult(true);
    },
    onError: (error) => {
      toast.error("Error en autenticación: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client) {
      toast.error("Selecciona un cliente");
      return;
    }

    autenticar.mutate({
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
      autenticacion: {
        ejercidoCreditoAutomotriz: formData.ejercidoCreditoAutomotriz,
        ejercidoCreditoHipotecario: formData.ejercidoCreditoHipotecario,
        tarjetaCredito: formData.tarjetaCredito,
        tipoReporte: "RCN",
        tipoSalidaAU: "4",
        referenciaOperador: formData.referenciaOperador || new Date().getTime().toString(),
      },
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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
              [RESULTADO AUTENTICADOR]
            </h1>
          </div>
        </header>

        <main className="container py-12">
          <Card className="border-4 border-black p-8">
            <pre className="text-sm font-mono overflow-auto">
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
          <Shield className="w-12 h-12" strokeWidth={3} />
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            [AUTENTICADOR]
          </h1>
        </div>
      </header>

      <main className="container py-12">
        <Card className="border-4 border-black p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase mb-4">DESCRIPCIÓN</h2>
            <p className="text-lg font-bold">
              Autenticación con preguntas de seguridad basadas en el historial crediticio del cliente.
              Valida la identidad mediante información de créditos automotrices, hipotecarios y tarjetas de crédito.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Selector de Cliente */}
            <ClientSelector value={clientId} onChange={setClientId} />

            {clientId && client && (
              <>
                {/* Datos del Cliente Seleccionado */}
                <div className="border-4 border-black p-6 bg-secondary">
                  <h3 className="text-2xl font-black uppercase mb-4">DATOS DEL CLIENTE</h3>
                  <div className="grid grid-cols-2 gap-4 text-lg font-bold">
                    <div>NOMBRE: {client.nombres} {client.apellidoPaterno} {client.apellidoMaterno}</div>
                    <div>RFC: {client.rfc || 'N/A'}</div>
                    <div>CURP: {client.curp || 'N/A'}</div>
                    <div>FECHA NAC: {client.fechaNacimiento || 'N/A'}</div>
                  </div>
                </div>

                {/* Preguntas de Seguridad */}
                <div>
                  <h2 className="text-4xl font-black uppercase mb-6 border-b-4 border-black pb-2">
                    PREGUNTAS DE SEGURIDAD
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-xl font-black uppercase">
                        ¿HA EJERCIDO CRÉDITO AUTOMOTRIZ? *
                      </Label>
                      <Select
                        value={formData.ejercidoCreditoAutomotriz}
                        onValueChange={(value) => handleChange("ejercidoCreditoAutomotriz", value)}
                      >
                        <SelectTrigger className="border-4 border-black text-lg font-bold mt-2 h-14">
                          <SelectValue placeholder="SELECCIONA UNA OPCIÓN" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="V">SÍ (V)</SelectItem>
                          <SelectItem value="F">NO (F)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xl font-black uppercase">
                        ¿HA EJERCIDO CRÉDITO HIPOTECARIO? *
                      </Label>
                      <Select
                        value={formData.ejercidoCreditoHipotecario}
                        onValueChange={(value) => handleChange("ejercidoCreditoHipotecario", value)}
                      >
                        <SelectTrigger className="border-4 border-black text-lg font-bold mt-2 h-14">
                          <SelectValue placeholder="SELECCIONA UNA OPCIÓN" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="V">SÍ (V)</SelectItem>
                          <SelectItem value="F">NO (F)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xl font-black uppercase">
                        ¿TIENE TARJETA DE CRÉDITO? *
                      </Label>
                      <Select
                        value={formData.tarjetaCredito}
                        onValueChange={(value) => handleChange("tarjetaCredito", value)}
                      >
                        <SelectTrigger className="border-4 border-black text-lg font-bold mt-2 h-14">
                          <SelectValue placeholder="SELECCIONA UNA OPCIÓN" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="V">SÍ (V)</SelectItem>
                          <SelectItem value="F">NO (F)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xl font-black uppercase">
                        ÚLTIMOS 4 DÍGITOS DE TARJETA (OPCIONAL)
                      </Label>
                      <Input
                        value={formData.ultimosCuatroDigitos}
                        onChange={(e) => handleChange("ultimosCuatroDigitos", e.target.value)}
                        maxLength={4}
                        placeholder="1234"
                        className="border-4 border-black text-lg font-bold mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-xl font-black uppercase">
                        REFERENCIA OPERADOR (OPCIONAL)
                      </Label>
                      <Input
                        value={formData.referenciaOperador}
                        onChange={(e) => handleChange("referenciaOperador", e.target.value)}
                        placeholder="Se generará automáticamente si se deja vacío"
                        className="border-4 border-black text-lg font-bold mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
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
                    disabled={autenticar.isPending || !formData.ejercidoCreditoAutomotriz || !formData.ejercidoCreditoHipotecario || !formData.tarjetaCredito}
                  >
                    {autenticar.isPending ? "AUTENTICANDO..." : "AUTENTICAR"}
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
