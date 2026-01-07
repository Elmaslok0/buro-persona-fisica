import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientSelector } from "@/components/ClientSelector";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, FileText } from "lucide-react";

export default function ReporteCredito() {
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
    tipoContrato: "",
    importeContrato: "",
  });

  const reporteCredito = trpc.buro.reporteDeCredito.useMutation({
    onSuccess: (data) => {
      toast.success("Reporte generado exitosamente");
      setResult(data);
      setShowResult(true);
    },
    onError: (error) => {
      toast.error("Error al generar reporte: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client) {
      toast.error("Selecciona un cliente");
      return;
    }

    reporteCredito.mutate({
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
        claveOtorgante: formData.claveOtorgante || "0000000000",
        nombreOtorgante: formData.nombreOtorgante || "BANCO PRUEBA",
        folioConsulta: formData.folioConsulta || new Date().getTime().toString(),
        folioConsultaOtorgante: formData.folioConsultaOtorgante || "",
        claveUnidadMonetaria: "MX",
        tipoContrato: formData.tipoContrato || "CC",
        importeContrato: formData.importeContrato || "0.00",
        tipoReporte: "RCN",
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
              [RESULTADO REPORTE]
            </h1>
          </div>
        </header>

        <main className="container py-12 space-y-8">
          {/* Resumen del Reporte */}
          <Card className="border-4 border-black p-8">
            <h2 className="text-3xl font-black uppercase mb-6">RESUMEN DEL REPORTE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-black p-4">
                <p className="text-sm font-bold text-gray-600">CALIFICACIÓN GENERAL</p>
                <p className="text-2xl font-black">{result?.informe?.calificacionGeneral || 'N/A'}</p>
              </div>
              <div className="border-2 border-black p-4">
                <p className="text-sm font-bold text-gray-600">NIVEL DE RIESGO</p>
                <p className="text-2xl font-black">{result?.informe?.riesgo || 'N/A'}</p>
              </div>
              <div className="border-2 border-black p-4">
                <p className="text-sm font-bold text-gray-600">FECHA DE CONSULTA</p>
                <p className="text-2xl font-black">{result?.informe?.fechaConsulta || 'N/A'}</p>
              </div>
              <div className="border-2 border-black p-4">
                <p className="text-sm font-bold text-gray-600">CONSUMIDOR NUEVO</p>
                <p className="text-2xl font-black">{result?.informe?.consumidorNuevo === 'S' ? 'SÍ' : 'NO'}</p>
              </div>
            </div>
          </Card>

          {/* Detalles de Cuentas */}
          {result?.informe?.detallesCuentas && result.informe.detallesCuentas.length > 0 && (
            <Card className="border-4 border-black p-8">
              <h2 className="text-3xl font-black uppercase mb-6">DETALLES DE CUENTAS</h2>
              <div className="space-y-4">
                {result.informe.detallesCuentas.map((cuenta: any, idx: number) => (
                  <div key={idx} className="border-4 border-black p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-600">INSTITUCIÓN</p>
                        <p className="text-lg font-black">{cuenta.institucion}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">TIPO DE PRODUCTO</p>
                        <p className="text-lg font-black">{cuenta.tipoProducto}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">ESTADO</p>
                        <p className="text-lg font-black">{cuenta.estado}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">SALDO</p>
                        <p className="text-lg font-black">${parseFloat(cuenta.saldo).toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">MOP (Meses de Pago)</p>
                        <p className="text-lg font-black">{cuenta.mop}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* JSON Completo */}
          <Card className="border-4 border-black p-8">
            <h2 className="text-3xl font-black uppercase mb-6">DATOS COMPLETOS DE LA RESPUESTA</h2>
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
          <FileText className="w-12 h-12" strokeWidth={3} />
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            [REPORTE DE CRÉDITO]
          </h1>
        </div>
      </header>

      <main className="container py-12">
        <Card className="border-4 border-black p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase mb-4">DESCRIPCIÓN</h2>
            <p className="text-lg font-bold">
              Reporte completo de historial crediticio incluyendo cuentas activas y cerradas, 
              historial de pagos, calificaciones MOP, saldos, límites de crédito y consultas realizadas.
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
                        value={formData.claveOtorgante || "0000000000"}
                        onChange={handleChange}
                        placeholder="0000000000"
                        type="text"
                        maxLength={10}
                        className="border-4 border-black text-lg font-bold mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xl font-black uppercase">NOMBRE OTORGANTE *</Label>
                      <Input
                        name="nombreOtorgante"
                        value={formData.nombreOtorgante}
                        onChange={handleChange}
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
                    <div>
                      <Label className="text-xl font-black uppercase">TIPO DE CONTRATO</Label>
                      <Input
                        name="tipoContrato"
                        value={formData.tipoContrato}
                        onChange={handleChange}
                        placeholder="Ej: CC (Tarjeta de Crédito)"
                        className="border-4 border-black text-lg font-bold mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xl font-black uppercase">IMPORTE CONTRATO</Label>
                      <Input
                        name="importeContrato"
                        value={formData.importeContrato || "0.00"}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, importeContrato: value });
                        }}
                        type="text"
                        placeholder="0.00"
                        className="border-4 border-black text-lg font-bold mt-2"
                      />
                    </div>
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
                    disabled={reporteCredito.isPending}
                  >
                    {reporteCredito.isPending ? "GENERANDO..." : "GENERAR REPORTE"}
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
