import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CreditCard, FileText, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
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
          <div className="flex gap-4">
            <Link href="/clients/new">
              <Button 
                size="lg" 
                className="text-xl font-black uppercase px-12 py-8 border-4 border-black hover:bg-black hover:text-white transition-colors"
              >
                [NUEVO CLIENTE]
              </Button>
            </Link>
            <Link href="/modules">
              <Button 
                size="lg" 
                className="text-xl font-black uppercase px-12 py-8 border-4 border-black hover:bg-black hover:text-white transition-colors"
              >
                [MÓDULOS BURÓ]
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container py-20 border-t-8 border-black">
        <h2 className="text-6xl md:text-8xl font-black uppercase mb-16">MÓDULOS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "AUTENTICADOR", desc: "Autenticación con preguntas de seguridad", link: "/modules/autenticador" },
            { title: "REPORTE DE CRÉDITO", desc: "Historial crediticio completo", link: "/modules/reporte-credito" },
            { title: "INFORME BURÓ", desc: "Reportes detallados del buró", link: "/modules/informe-buro" },
            { title: "MONITOR", desc: "Monitoreo continuo de cambios", link: "/modules/monitor" },
            { title: "PROSPECTOR", desc: "Análisis de clientes potenciales", link: "/modules/prospector" },
            { title: "ESTIMADOR", desc: "Estimación de ingresos", link: "/modules/estimador-ingresos" },
          ].map((feature, i) => (
            <Link key={i} href={feature.link}>
              <div className="border-4 border-black p-8 bg-white hover:bg-black hover:text-white transition-colors cursor-pointer">
                <h3 className="text-3xl font-black uppercase mb-4">{feature.title}</h3>
                <p className="text-lg font-bold">{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container py-20 border-t-8 border-black">
        <h2 className="text-6xl md:text-8xl font-black uppercase mb-16">ESTADÍSTICAS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-4 border-black p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-12 h-12" strokeWidth={3} />
              <span className="text-5xl font-black">0</span>
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
      </div>
    </div>
  );
}
