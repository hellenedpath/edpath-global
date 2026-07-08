import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SiteLayout from "./components/layout/SiteLayout";
import PagePlaceholder from "./pages/PagePlaceholder";
import About from "./pages/About";
import Before from "./pages/Before";
import Costs from "./pages/Costs";
import Family from "./pages/Family";
import Work from "./pages/Work";
import Canada from "./pages/Canada";
import PgwpChecker from "./pages/PgwpChecker";
import PathQuiz from "./pages/PathQuiz";
import Programs from "./pages/Programs";
import Institutions from "./pages/Institutions";
import FinancialSimulator from "./pages/FinancialSimulator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/canada" element={<Canada />} />
            <Route path="/canada/pgwp" element={<PgwpChecker />} />
            <Route path="/verificador-pgwp" element={<PgwpChecker />} />
          <Route path="/meu-caminho" element={<PathQuiz />} />
            <Route path="/canada/meu-caminho" element={<PathQuiz />} />
            <Route path="/diagnostico" element={<PathQuiz />} />
            <Route path="/programas" element={<Programs />} />
            <Route path="/canada/instituicoes" element={<Institutions />} />
            <Route path="/instituicoes" element={<Institutions />} />
            <Route path="/antes-de-comecar" element={<Before />} />
            <Route path="/custos" element={<Costs />} />
            <Route path="/simulador-financeiro" element={<FinancialSimulator />} />
            <Route path="/canada/simulador" element={<FinancialSimulator />} />
            <Route path="/saude" element={<PagePlaceholder tKey="health" />} />
            <Route path="/familia" element={<Family />} />
            <Route path="/trabalho-moradia" element={<Work />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
