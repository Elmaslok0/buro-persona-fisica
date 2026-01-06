import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CreditCard, FileText, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: clients, isLoading: clientsLoading } = trpc.clientManagement.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl font-black">CARGANDO...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section - Brutalist */}
        <div className="container py-20">
          <div className="max-w-5xl">
            <h1 className="text-[12vw] md:text-[8rem] font-black leading-[0.85] tracking-tighter uppercase mb-8">
              BURÓ DE
              <br />
              <span className="inline-block border-8 border-black px-4 py-2">CRÉDITO</span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-12 max-w-2xl">
              Panel de persona física con actividad empresarial
            </p>
            <Button 
              size="lg" 
              className="text-xl font-black uppercase px-12 py-8 border-4 border-black hover:bg-black hover:text-white transition-colors"
              onClick={() => window.location.href = getLoginUrl()}
            >
              [INICIAR SESIÓN]
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container py-20 border-t-8 border-black">
          <h2 className="text-6xl md:text-8xl font-black uppercase mb-16">MÓDULOS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "AUTENTICADOR", desc: "Autenticación con preguntas de seguridad" },
              { title: "REPORTE DE CRÉDITO", desc: "Historial crediticio completo" },
              { title: "INFORME BURÓ", desc: "Reportes detallados del buró" },
              { title: "MONITOR", desc: "Monitoreo continuo de cambios" },
              { title: "PROSPECTOR", desc: "Análisis de clientes potenciales" },
              { title: "ESTIMADOR", desc: "Estimación de ingresos" },
            ].map((feature, i) => (
              <div key={i} className="border-4 border-black p-8 bg-white hover:bg-black hover:text-white transition-colors">
                <h3 className="text-3xl font-black uppercase mb-4">{feature.title}</h3>
                <p className="text-lg font-bold">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-8 border-black py-6">
        <div className="container flex items-center justify-between">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            [BURÓ]
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold uppercase">{user?.name}</span>
            <Button 
              variant="outline" 
              className="border-4 border-black font-black uppercase"
              onClick={() => window.location.href = '/'}
            >
              SALIR
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main className="container py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-4 border-black p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-12 h-12" strokeWidth={3} />
              <span className="text-5xl font-black">{clients?.length || 0}</span>
            </div>
            <h3 className="text-2xl font-black uppercase">CLIENTES</h3>
          </Card>

          <Card className="border-4 border-black p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-12 h-12" strokeWidth={3} />
              <span className="text-5xl font-black">0</span>
            </div>
            <h3 className="text-2xl font-black uppercase">REPORTES</h3>
          </Card>

          <Card className="border-4 border-black p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-12 h-12" strokeWidth={3} />
              <span className="text-5xl font-black">0</span>
            </div>
            <h3 className="text-2xl font-black uppercase">CUENTAS</h3>
          </Card>

          <Card className="border-4 border-black p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-12 h-12" strokeWidth={3} />
              <span className="text-5xl font-black">0</span>
            </div>
            <h3 className="text-2xl font-black uppercase">ALERTAS</h3>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-5xl md:text-7xl font-black uppercase mb-8">ACCIONES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/clients/new">
              <Button className="w-full h-32 text-3xl font-black uppercase border-4 border-black hover:bg-black hover:text-white transition-colors">
                + NUEVO CLIENTE
              </Button>
            </Link>
            <Link href="/modules">
              <Button className="w-full h-32 text-3xl font-black uppercase border-4 border-black hover:bg-black hover:text-white transition-colors">
                CONSULTAR BURÓ
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Clients */}
        {clients && clients.length > 0 && (
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-8">CLIENTES</h2>
            <div className="space-y-4">
              {clients.map((client) => (
                <Link key={client.id} href={`/clients/${client.id}`}>
                  <Card className="border-4 border-black p-6 hover:bg-black hover:text-white transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-3xl font-black uppercase">
                          {client.nombres} {client.apellidoPaterno} {client.apellidoMaterno}
                        </h3>
                        <p className="text-lg font-bold mt-2">RFC: {client.rfc || 'N/A'}</p>
                      </div>
                      <TrendingUp className="w-12 h-12" strokeWidth={3} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {clients && clients.length === 0 && (
          <div className="border-4 border-black p-12 text-center">
            <h3 className="text-4xl font-black uppercase mb-4">SIN CLIENTES</h3>
            <p className="text-xl font-bold mb-8">Agrega tu primer cliente para comenzar</p>
            <Link href="/clients/new">
              <Button className="text-2xl font-black uppercase px-8 py-6 border-4 border-black">
                + AGREGAR CLIENTE
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
