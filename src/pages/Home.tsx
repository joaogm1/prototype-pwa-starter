/**
 * PÁGINA HOME
 * 
 * Esta é a tela inicial após o login.
 * Exibe uma mensagem de boas-vindas e permite o logout.
 * Futuramente, aqui ficarão as funcionalidades principais do app.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { logout, getCurrentUser, isAuthenticated, type User } from '@/services/authService';

const Home = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate();
  
  // Hook para mostrar mensagens de toast
  const { toast } = useToast();
  
  // Estado para armazenar os dados do usuário logado
  const [user, setUser] = useState<User | null>(null);

  /**
   * useEffect: executa quando o componente é montado (carregado na tela)
   * Verifica se o usuário está autenticado e carrega seus dados
   */
  useEffect(() => {
    // Verifica se o usuário está autenticado
    if (!isAuthenticated()) {
      // Se não estiver, redireciona para o login
      navigate('/login');
      return;
    }

    // Carrega os dados do usuário
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [navigate]);

  /**
   * Função para fazer logout
   * Remove os dados do usuário e redireciona para o login
   */
  const handleLogout = () => {
    logout();
    toast({
      title: 'Logout realizado',
      description: 'Até logo!',
    });
    navigate('/login');
  };

  // Se não há usuário carregado, não renderiza nada
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Container mobile-friendly */}
      <div className="w-full max-w-md mobile-container bg-white min-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-primary">HumanizApp</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Olá, {user.name}!
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              Sair
            </Button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="p-6">
          {/* Card de boas-vindas */}
          <div className="card-accent mb-6">
            <div className="flex items-center mb-3">
              <svg
                className="w-6 h-6 text-primary mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <h2 className="text-xl font-bold text-primary">Bem-vindo(a)!</h2>
            </div>
            <p className="text-foreground">
              Bem-vindo ao HumanizApp! Aqui você poderá planejar seu parto humanizado e acessar conteúdos educativos.
            </p>
          </div>

          {/* Botão Plano de Parto */}
          <Button
            onClick={() => navigate('/birth-plan')}
            className="w-full mb-6"
            size="lg"
          >
            📝 Criar Meu Plano de Parto
          </Button>

          {/* Card informativo */}
          <div className="bg-white p-5 rounded-2xl shadow-lg border border-border">
            <h3 className="text-lg font-bold text-foreground mb-3">
              Funcionalidades Disponíveis
            </h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                Plano de Parto personalizado
              </li>
              <li className="flex items-start">
                <span className="text-muted-foreground mr-2">○</span>
                <span className="text-muted-foreground">Biblioteca de conteúdos educativos (em breve)</span>
              </li>
              <li className="flex items-start">
                <span className="text-muted-foreground mr-2">○</span>
                <span className="text-muted-foreground">Comunidade de apoio (em breve)</span>
              </li>
              <li className="flex items-start">
                <span className="text-muted-foreground mr-2">○</span>
                <span className="text-muted-foreground">Acompanhamento semanal da gestação (em breve)</span>
              </li>
            </ul>
          </div>

          {/* Informações do perfil */}
          <div className="mt-6 p-4 bg-muted rounded-xl">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">
              INFORMAÇÕES DO PERFIL
            </h4>
            <div className="space-y-1 text-sm">
              <p className="text-foreground">
                <span className="font-semibold">Nome:</span> {user.name}
              </p>
              <p className="text-foreground">
                <span className="font-semibold">Username:</span> {user.username}
              </p>
              <p className="text-foreground">
                <span className="font-semibold">CPF:</span> {user.cpf}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
