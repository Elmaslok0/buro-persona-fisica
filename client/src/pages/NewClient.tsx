import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function NewClient() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    rfc: "",
    curp: "",
    fechaNacimiento: "",
    nacionalidad: "MX",
    telefono: "",
    celular: "",
    email: "",
  });

  const createClient = trpc.clientManagement.create.useMutation({
    onSuccess: () => {
      toast.success("Cliente creado exitosamente");
      setLocation("/");
    },
    onError: (error) => {
      toast.error("Error al crear cliente: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClient.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-8 border-black py-6">
        <div className="container flex items-center gap-6">
          <Button
            variant="outline"
            size="lg"
            className="border-4 border-black font-black"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={3} />
          </Button>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            [NUEVO CLIENTE]
          </h1>
        </div>
      </header>

      {/* Form */}
      <main className="container py-12">
        <Card className="border-4 border-black p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Datos Personales */}
            <div>
              <h2 className="text-4xl font-black uppercase mb-6 border-b-4 border-black pb-2">
                DATOS PERSONALES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xl font-black uppercase">NOMBRE(S) *</Label>
                  <Input
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    required
                    className="border-4 border-black text-lg font-bold mt-2"
                  />
                </div>
                <div>
                  <Label className="text-xl font-black uppercase">APELLIDO PATERNO *</Label>
                  <Input
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    required
                    className="border-4 border-black text-lg font-bold mt-2"
                  />
                </div>
                <div>
                  <Label className="text-xl font-black uppercase">APELLIDO MATERNO</Label>
                  <Input
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    className="border-4 border-black text-lg font-bold mt-2"
                  />
                </div>
                <div>
                  <Label className="text-xl font-black uppercase">FECHA DE NACIMIENTO</Label>
                  <Input
                    name="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="border-4 border-black text-lg font-bold mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Identificación */}
            <div>
              <h2 className="text-4xl font-black uppercase mb-6 border-b-4 border-black pb-2">
                IDENTIFICACIÓN
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xl font-black uppercase">RFC</Label>
                  <Input
                    name="rfc"
                    value={formData.rfc}
                    onChange={handleChange}
                    maxLength={13}
                    className="border-4 border-black text-lg font-bold mt-2 uppercase"
                  />
                </div>
                <div>
                  <Label className="text-xl font-black uppercase">CURP</Label>
                  <Input
                    name="curp"
                    value={formData.curp}
                    onChange={handleChange}
                    maxLength={18}
                    className="border-4 border-black text-lg font-bold mt-2 uppercase"
                  />
                </div>
                <div>
                  <Label className="text-xl font-black uppercase">NACIONALIDAD</Label>
                  <Input
                    name="nacionalidad"
                    value={formData.nacionalidad}
                    onChange={handleChange}
                    maxLength={2}
                    className="border-4 border-black text-lg font-bold mt-2 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div>
              <h2 className="text-4xl font-black uppercase mb-6 border-b-4 border-black pb-2">
                CONTACTO
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xl font-black uppercase">TELÉFONO</Label>
                  <Input
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="border-4 border-black text-lg font-bold mt-2"
                  />
                </div>
                <div>
                  <Label className="text-xl font-black uppercase">CELULAR</Label>
                  <Input
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    className="border-4 border-black text-lg font-bold mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xl font-black uppercase">EMAIL</Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                onClick={() => setLocation("/")}
              >
                CANCELAR
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1 text-2xl font-black uppercase border-4 border-black"
                disabled={createClient.isPending}
              >
                {createClient.isPending ? "GUARDANDO..." : "GUARDAR CLIENTE"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
