import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SiteLayout from "./components/layout/SiteLayout";
import PagePlaceholder from "./pages/PagePlaceholder";
import About from "./pages/About";
import Costs from "./pages/Costs";
import Family from "./pages/Family";
import Work from "./pages/Work";
import Canada from "./pages/Canada";
import PgwpChecker from "./pages/PgwpChecker";
import PathQuiz from "./pages/PathQuiz";
import Programs from "./pages/Programs";
import Institutions from "./pages/Institutions";
import FinancialSimulator from "./pages/FinancialSimulator";
import HighSchools from "./pages/HighSchools";
import Renting from "./pages/Renting";
import RentalScams from "./pages/RentalScams";
import StudyPermit from "./pages/StudyPermit";
import Health from "./pages/Health";
import AvatarPreview from "./pages/AvatarPreview";

const queryClient = new QueryClient();

// Redirect preserving query string
const Redirect = ({ to }: { to: string }) => {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: to, search, hash }} replace />;
};

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
            {/* Canonical Canada routes */}
            <Route path="/canada" element={<Canada />} />
            <Route path="/canada/pgwp" element={<PgwpChecker />} />
            <Route path="/canada/meu-caminho" element={<PathQuiz />} />
            <Route path="/canada/programas" element={<Programs />} />
            <Route path="/canada/instituicoes" element={<Institutions />} />
            <Route path="/canada/ensino-medio" element={<HighSchools />} />
            <Route path="/canada/custos" element={<Costs />} />
            <Route path="/canada/alugar" element={<Renting />} />
            <Route path="/canada/golpes-de-aluguel" element={<RentalScams />} />
            <Route path="/canada/study-permit" element={<StudyPermit />} />
            <Route path="/canada/simulador" element={<FinancialSimulator />} />
            <Route path="/canada/saude" element={<Health />} />
            <Route path="/canada/familia" element={<Family />} />
            <Route path="/canada/trabalho-moradia" element={<Work />} />

            {/* Legacy redirects → canonical routes (preserve query strings) */}
            <Route path="/verificador-pgwp" element={<Redirect to="/canada/pgwp" />} />
            <Route path="/meu-caminho" element={<Redirect to="/canada/meu-caminho" />} />
            <Route path="/diagnostico" element={<Redirect to="/canada/meu-caminho" />} />
            <Route path="/programas" element={<Redirect to="/canada/programas" />} />
            <Route path="/instituicoes" element={<Redirect to="/canada/instituicoes" />} />
            <Route path="/ensino-medio" element={<Redirect to="/canada/ensino-medio" />} />
            <Route path="/custos" element={<Redirect to="/canada/custos" />} />
            <Route path="/alugar-no-canada" element={<Redirect to="/canada/alugar" />} />
            <Route path="/golpes-de-aluguel" element={<Redirect to="/canada/golpes-de-aluguel" />} />
            <Route path="/study-permit" element={<Redirect to="/canada/study-permit" />} />
            <Route path="/antes-de-comecar" element={<Redirect to="/canada/study-permit" />} />
            <Route path="/simulador-financeiro" element={<Redirect to="/canada/simulador" />} />
            <Route path="/saude" element={<Redirect to="/canada/saude" />} />
            <Route path="/familia" element={<Redirect to="/canada/familia" />} />
            <Route path="/trabalho-moradia" element={<Redirect to="/canada/trabalho-moradia" />} />
            <Route path="/avatar-preview" element={<AvatarPreview />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
