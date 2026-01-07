import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, FileText, BarChart3, Eye, Users, DollarSign, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function Modules() {
  const [, setLocation] = useLocation();

  const modules = [
    {
      id: "autenticador",
      title: "AUTENTICADOR",
      description: "Autenticación con preguntas de seguridad basadas en historial crediticio",
      icon: Shield,
      path: "/modules/autenticador",
    },
    {
      id: "reporte-credito",
      title: "REPORTE DE CRÉDITO",
      description: "Reporte completo con historial crediticio, cuentas y pagos",
      icon: FileText,
      path: "/modules/reporte-credito",
    },
    {
      id: "informe-buro",
      title: "INFORME BURÓ",
      description: "Informe detallado del buró con consultas y declaraciones",
      icon: BarChart3,
      path: "/modules/informe-buro",
    },
    {
      id: "monitor",
      title: "MONITOR",
      description: "Monitoreo continuo de cambios en historial crediticio",
      icon: Eye,
      path: "/modules/monitor",
    },
    {
      id: "prospector",
      title: "PROSPECTOR",
      description: "Análisis y prospección de clientes potenciales",
      icon: Users,
      path: "/modules/prospector",
    },
    {
      id: "estimador-ingresos",
      title: "ESTIMADOR DE INGRESOS",
      description: "Estimación de ingresos basada en historial y límites de crédito",
      icon: DollarSign,
      path: "/modules/estimador-ingresos",
    },
    {
      id: "e-score",
      title: "E-SCORE",
      description: "Puntuación de crédito electrónica basada en perfil crediticio",
      icon: TrendingUp,
      path: "/modules/e-score",
    },
  ];

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
            [MÓDULOS BURÓ]
          </h1>
        </div>
      </header>

      {/* Modules Grid */}
      <main className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.id}
                className="border-4 border-black p-8 hover:bg-black hover:text-white transition-colors cursor-pointer group"
                onClick={() => setLocation(module.path)}
              >
                <Icon className="w-16 h-16 mb-6" strokeWidth={3} />
                <h2 className="text-3xl font-black uppercase mb-4">{module.title}</h2>
                <p className="text-lg font-bold">{module.description}</p>
                <Button
                  className="mt-6 w-full border-4 border-black group-hover:border-white font-black uppercase"
                  variant="outline"
                >
                  ABRIR MÓDULO
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 border-4 border-black p-8">
          <h2 className="text-4xl font-black uppercase mb-6">INFORMACIÓN</h2>
          <div className="space-y-4 text-lg font-bold">
            <p>
              • Cada módulo se conecta directamente a la API de Buró de Crédito
            </p>
            <p>
              • Los datos se almacenan de forma segura en la base de datos
            </p>
            <p>
              • Todos los reportes se pueden exportar en PDF
            </p>
            <p>
              • El análisis inteligente con LLM proporciona recomendaciones personalizadas
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
