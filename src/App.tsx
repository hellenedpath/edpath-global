import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SiteLayout from "./components/layout/SiteLayout";
import PagePlaceholder from "./pages/PagePlaceholder";
import Before from "./pages/Before";

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
            <Route path="/sobre" element={<PagePlaceholder tKey="about" />} />
            <Route path="/programas" element={<PagePlaceholder tKey="programs" />} />
            <Route path="/antes-de-comecar" element={<Before />} />
            <Route path="/custos" element={<PagePlaceholder tKey="costs" />} />
            <Route path="/familia" element={<PagePlaceholder tKey="family" />} />
            <Route path="/trabalho-moradia" element={<PagePlaceholder tKey="work" />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
