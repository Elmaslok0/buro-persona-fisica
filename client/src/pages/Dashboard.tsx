import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, LogOut, Users, TrendingUp, FileText, Eye } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import Prospector from './Prospector';
import Monitor from './Monitor';
import Ingresos from './Ingresos';
import Reporte from './Reporte';
import Buro from './Buro';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [persona, setPersona] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('prospector');

  useEffect(() => {
    // Cargar datos de persona del localStorage
    const storedPersona = localStorage.getItem('persona');
    if (storedPersona) {
      setPersona(JSON.parse(storedPersona));
    } else {
      // Redirigir al login si no hay datos
      setLocation('/');
    }
  }, [setLocation]);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      localStorage.removeItem('buro_token');
      localStorage.removeItem('persona');
      setLocation('/');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!persona) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  const nombreCompleto = `${persona.nombre?.nombre || ''} ${persona.nombre?.apellidoPaterno || ''} ${persona.nombre?.apellidoMaterno || ''}`.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel Crediticio</h1>
              <p className="text-sm text-gray-500 mt-1">Bienvenido, {nombreCompleto}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                <Users className="h-4 w-4 inline mr-2" />
                Prospección
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Consultar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                <Eye className="h-4 w-4 inline mr-2" />
                Monitoreo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Alertas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                <TrendingUp className="h-4 w-4 inline mr-2" />
                Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Estimar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                <FileText className="h-4 w-4 inline mr-2" />
                Reportes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Generar</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Card>
          <CardHeader>
            <CardTitle>Módulos del Buró de Crédito</CardTitle>
            <CardDescription>
              Accede a los diferentes módulos del sistema de buró de crédito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="prospector">Prospector</TabsTrigger>
                <TabsTrigger value="monitor">Monitor</TabsTrigger>
                <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
                <TabsTrigger value="reporte">Reporte</TabsTrigger>
                <TabsTrigger value="buro">Buró</TabsTrigger>
              </TabsList>

              <TabsContent value="prospector" className="mt-6">
                <Prospector persona={persona} />
              </TabsContent>

              <TabsContent value="monitor" className="mt-6">
                <Monitor persona={persona} />
              </TabsContent>

              <TabsContent value="ingresos" className="mt-6">
                <Ingresos persona={persona} />
              </TabsContent>

              <TabsContent value="reporte" className="mt-6">
                <Reporte persona={persona} />
              </TabsContent>

              <TabsContent value="buro" className="mt-6">
                <Buro persona={persona} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
