/**
 * PÁGINA DE LOGIN
 * 
 * Esta é a tela onde o usuário faz login no aplicativo.
 * Inclui campos para email e senha, e um link para a página de cadastro.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { login } from '@/services/authService';

const Login = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate();
  
  // Hook para mostrar mensagens de toast (notificações)
  const { toast } = useToast();

  // Estados para armazenar os valores dos campos do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Estado para indicar se está carregando (fazendo requisição ao backend)
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Função que é chamada quando o usuário clica em "Entrar"
   * Valida os campos e chama o serviço de login
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Validação básica dos campos
    if (!email || !senha) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha email e senha.',
        variant: 'destructive',
      });
      return;
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, insira um email válido.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Chama o serviço de login
      const response = await login({ email, senha });

      if (response.success) {
        // Login bem-sucedido
        toast({
          title: 'Login realizado!',
          description: `Bem-vindo(a), ${response.user?.nome}!`,
        });
        
        // Redireciona para a página inicial
        navigate('/home');
      } else {
        // Login falhou
        toast({
          title: 'Erro ao fazer login',
          description: response.message || 'Email ou senha incorretos.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      // Erro inesperado
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao tentar fazer login. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Container mobile-friendly */}
      <div className="w-full max-w-md mobile-container bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-2">HumanizApp</h1>
          <p className="text-muted-foreground">
            Faça login para continuar sua jornada
          </p>
        </div>

        {/* Formulário de login */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Campo de Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-humaniz mt-2"
              disabled={isLoading}
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <Label htmlFor="senha" className="text-sm font-semibold text-foreground">
              Senha
            </Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input-humaniz mt-2"
              disabled={isLoading}
            />
          </div>

          {/* Botão de Login */}
          <Button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {/* Link para cadastro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Ainda não tem uma conta?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary font-semibold hover:underline"
            >
              Cadastre-se aqui
            </button>
          </p>
        </div>

        {/* Informação adicional */}
        <div className="mt-8 p-4 bg-accent rounded-xl">
          <p className="text-xs text-center text-secondary-foreground">
            Ao fazer login, você concorda com nossos Termos de Uso e Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
