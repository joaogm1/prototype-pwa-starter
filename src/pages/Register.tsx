/**
 * PÁGINA DE CADASTRO
 * 
 * Esta é a tela onde novos usuários se cadastram no aplicativo.
 * Inclui campos para nome, email, senha, confirmação de senha e tipo de perfil.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { register } from '@/services/authService';

const Register = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate();
  
  // Hook para mostrar mensagens de toast (notificações)
  const { toast } = useToast();

  // Estados para armazenar os valores dos campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoPerfil, setTipoPerfil] = useState<'gestante' | 'acompanhante'>('gestante');
  
  // Estado para indicar se está carregando (fazendo requisição ao backend)
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Função que é chamada quando o usuário clica em "Cadastrar"
   * Valida os campos e chama o serviço de cadastro
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Validação: verifica se todos os campos foram preenchidos
    if (!nome || !email || !senha || !confirmarSenha) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    // Validação: verifica se o nome tem pelo menos 3 caracteres
    if (nome.length < 3) {
      toast({
        title: 'Nome inválido',
        description: 'O nome deve ter pelo menos 3 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    // Validação: verifica se o email está em formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, insira um email válido.',
        variant: 'destructive',
      });
      return;
    }

    // Validação: verifica se a senha tem pelo menos 6 caracteres
    if (senha.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    // Validação: verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
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
        nome,
        email,
        senha,
        tipoPerfil,
      });

      if (response.success) {
        // Cadastro bem-sucedido
        toast({
          title: 'Cadastro realizado!',
          description: `Bem-vindo(a), ${response.user?.nome}!`,
        });
        
        // Redireciona para a página inicial
        navigate('/home');
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
            <Label htmlFor="nome" className="text-sm font-semibold text-foreground">
              Nome Completo
            </Label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input-humaniz mt-2"
              disabled={isLoading}
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
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

          {/* Campo de Tipo de Perfil */}
          <div className="pt-2">
            <Label className="text-sm font-semibold text-foreground mb-3 block">
              Você é:
            </Label>
            <RadioGroup
              value={tipoPerfil}
              onValueChange={(value) => setTipoPerfil(value as 'gestante' | 'acompanhante')}
              className="space-y-3"
              disabled={isLoading}
            >
              {/* Opção Gestante */}
              <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-xl hover:border-primary transition-all cursor-pointer">
                <RadioGroupItem value="gestante" id="gestante" className="text-primary" />
                <Label
                  htmlFor="gestante"
                  className="flex-1 cursor-pointer font-medium text-foreground"
                >
                  Gestante
                  <p className="text-xs text-muted-foreground mt-1">
                    Estou grávida e quero planejar meu parto
                  </p>
                </Label>
              </div>

              {/* Opção Acompanhante */}
              <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-xl hover:border-primary transition-all cursor-pointer">
                <RadioGroupItem value="acompanhante" id="acompanhante" className="text-primary" />
                <Label
                  htmlFor="acompanhante"
                  className="flex-1 cursor-pointer font-medium text-foreground"
                >
                  Acompanhante
                  <p className="text-xs text-muted-foreground mt-1">
                    Quero apoiar e acompanhar uma gestante
                  </p>
                </Label>
              </div>
            </RadioGroup>
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
