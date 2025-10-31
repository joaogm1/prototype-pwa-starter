/**
 * COMPONENTE PRINCIPAL DA APLICAÇÃO (APP)
 * 
 * Este é o componente raiz que configura:
 * - Sistema de roteamento (navegação entre páginas)
 * - Providers globais (toast, query client, tooltips)
 * - Importação de todas as páginas
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BirthPlan from "./pages/BirthPlan";
import NotFound from "./pages/NotFound";

// Configuração do React Query (gerenciamento de estado e cache)
const queryClient = new QueryClient();

/**
 * Componente App
 * Define todas as rotas da aplicação
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rota raiz redireciona para login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rota de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rota de cadastro */}
          <Route path="/register" element={<Register />} />
          
          {/* Rota da página inicial (após login) */}
          <Route path="/home" element={<Home />} />
          
          {/* Rota do Plano de Parto */}
          <Route path="/birth-plan" element={<BirthPlan />} />
          
          {/* Rota 404 - Página não encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
