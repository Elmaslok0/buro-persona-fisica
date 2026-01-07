import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NewClient from "./pages/NewClient";
import Modules from "./pages/Modules";
import Autenticador from "./pages/modules/Autenticador";
import ReporteCredito from "./pages/modules/ReporteCredito";
import InformeBuro from "./pages/modules/InformeBuro";
import Monitor from "./pages/modules/Monitor";
import Prospector from "./pages/modules/Prospector";
import EstimadorIngresos from "./pages/modules/EstimadorIngresos";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/clients/new"} component={NewClient} />
      <Route path={"/modules"} component={Modules} />
      <Route path={"/modules/autenticador"} component={Autenticador} />
      <Route path={"/modules/reporte-credito"} component={ReporteCredito} />
      <Route path={"/modules/informe-buro"} component={InformeBuro} />
      <Route path={"/modules/monitor"} component={Monitor} />
      <Route path={"/modules/prospector"} component={Prospector} />
      <Route path={"/modules/estimador-ingresos"} component={EstimadorIngresos} />
      
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
