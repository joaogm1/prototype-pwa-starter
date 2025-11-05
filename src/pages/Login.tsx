/**
 * PÁGINA DE LOGIN
 * 
 * Esta é a tela onde o usuário faz login no aplicativo.
 * Inclui campos para username e senha, e um link para a página de cadastro.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { login } from '@/services/authService';
import { ThemeSelector } from '@/components/ThemeSelector';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha username e senha.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ username, password });

      if (response.success) {
        toast({
          title: 'Login realizado!',
          description: `Bem-vindo(a), ${response.user?.name}!`,
        });
        navigate('/home');
      } else {
        toast({
          title: 'Erro ao fazer login',
          description: response.message || 'Username ou senha incorretos.',
          variant: 'destructive',
        });
      }
    } catch (error) {
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
      <div className="w-full max-w-md mobile-container bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex justify-end mb-4">
          <ThemeSelector />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-2">HumanizApp</h1>
          <p className="text-muted-foreground">
            Faça login para continuar sua jornada
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-sm font-semibold text-foreground">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Seu username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-humaniz mt-2"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-humaniz mt-2"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary font-semibold hover:underline"
            >
              Cadastre-se aqui
            </button>
          </p>
        </div>

        <div className="mt-8 p-4 bg-accent rounded-xl">
          <p className="text-xs text-center text-secondary-foreground">
            Sua privacidade e segurança são importantes para nós.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
