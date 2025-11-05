/**
 * PÁGINA DE CADASTRO
 * 
 * Esta é a tela onde novos usuários se cadastram no aplicativo.
 * Inclui campos para nome, username, CPF, senha e confirmação de senha.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { register } from '@/services/authService';
import { ThemeSelector } from '@/components/ThemeSelector';

const Register = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate();
  
  // Hook para mostrar mensagens de toast (notificações)
  const { toast } = useToast();

  // Estados para armazenar os valores dos campos do formulário
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Estado para indicar se está carregando (fazendo requisição ao backend)
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Função que é chamada quando o usuário clica em "Cadastrar"
   * Valida os campos e chama o serviço de cadastro
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Validação: verifica se todos os campos foram preenchidos
    if (!name || !username || !cpf || !password || !confirmarSenha) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    // Validação: verifica se o nome tem pelo menos 3 caracteres
    if (name.length < 3) {
      toast({
        title: 'Nome inválido',
        description: 'O nome deve ter pelo menos 3 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    // Validação: verifica se o username tem pelo menos 3 caracteres
    if (username.length < 3) {
      toast({
        title: 'Username inválido',
        description: 'O username deve ter pelo menos 3 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    // Validação básica de CPF (11 dígitos)
    const cpfRegex = /^\d{11}$/;
    if (!cpfRegex.test(cpf.replace(/\D/g, ''))) {
      toast({
        title: 'CPF inválido',
        description: 'Por favor, insira um CPF válido com 11 dígitos.',
        variant: 'destructive',
      });
      return;
    }

    // Validação: verifica se a senha tem pelo menos 6 caracteres
    if (password.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    // Validação: verifica se as senhas coincidem
    if (password !== confirmarSenha) {
      toast({
        title: 'Senhas não coincidem',
        description: 'As senhas digitadas não são iguais.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Chama o serviço de cadastro
      const response = await register({
        name,
        username,
        password,
        cpf: cpf.replace(/\D/g, ''), // Remove formatação do CPF
      });

      if (response.success) {
        // Cadastro bem-sucedido
        toast({
          title: 'Cadastro realizado!',
          description: `Bem-vindo(a), ${response.user?.name}! Agora faça login.`,
        });
        
        // Redireciona para a página de login
        navigate('/login');
      } else {
        // Cadastro falhou
        toast({
          title: 'Erro ao cadastrar',
          description: response.message || 'Não foi possível completar o cadastro.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      // Erro inesperado
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao tentar cadastrar. Tente novamente.',
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
        <div className="flex justify-end mb-4">
          <ThemeSelector />
        </div>
        
        {/* Logo e título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-2">HumanizApp</h1>
          <p className="text-muted-foreground">
            Crie sua conta e comece sua jornada
          </p>
        </div>

        {/* Formulário de cadastro */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Campo de Nome */}
          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-foreground">
              Nome Completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-humaniz mt-2"
              disabled={isLoading}
            />
          </div>

          {/* Campo de Username */}
          <div>
            <Label htmlFor="username" className="text-sm font-semibold text-foreground">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Escolha um username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-humaniz mt-2"
              disabled={isLoading}
            />
          </div>

          {/* Campo de CPF */}
          <div>
            <Label htmlFor="cpf" className="text-sm font-semibold text-foreground">
              CPF
            </Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => {
                // Aceita apenas números e formata o CPF
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                  setCpf(value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'));
                }
              }}
              className="input-humaniz mt-2"
              disabled={isLoading}
              maxLength={14}
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-humaniz mt-2"
              disabled={isLoading}
            />
          </div>

          {/* Campo de Confirmar Senha */}
          <div>
            <Label htmlFor="confirmarSenha" className="text-sm font-semibold text-foreground">
              Confirmar Senha
            </Label>
            <Input
              id="confirmarSenha"
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="input-humaniz mt-2"
              disabled={isLoading}
            />
          </div>

          {/* Botão de Cadastro */}
          <Button
            type="submit"
            className="btn-primary w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Cadastrando...' : 'Criar Conta'}
          </Button>
        </form>

        {/* Link para login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-semibold hover:underline"
            >
              Faça login aqui
            </button>
          </p>
        </div>

        {/* Informação adicional */}
        <div className="mt-8 p-4 bg-accent rounded-xl">
          <p className="text-xs text-center text-secondary-foreground">
            Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
