import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";

interface ClientSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClientSelector({ value, onChange }: ClientSelectorProps) {
  const { data: clients, isLoading, error } = trpc.clientManagement.list.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div className="text-lg font-bold">CARGANDO CLIENTES...</div>;
  }

  if (error) {
    return (
      <div className="border-4 border-red-500 p-6 text-center bg-red-50">
        <p className="text-xl font-black uppercase mb-2 text-red-600">ERROR</p>
        <p className="text-lg font-bold text-red-500">{error.message}</p>
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="border-4 border-black p-6 text-center">
        <p className="text-xl font-black uppercase mb-2">SIN CLIENTES</p>
        <p className="text-lg font-bold">Primero debes agregar un cliente desde la página principal</p>
      </div>
    );
  }

  return (
    <div>
      <Label className="text-xl font-black uppercase">SELECCIONAR CLIENTE *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-4 border-black text-lg font-bold mt-2 h-14">
          <SelectValue placeholder="SELECCIONA UN CLIENTE" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id.toString()}>
              {client.nombres} {client.apellidoPaterno} {client.apellidoMaterno} - {client.rfc || 'SIN RFC'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
