/**
 * PÁGINA DE CRIAR/EDITAR INFORMAÇÃO
 * 
 * Apenas ADMIN pode acessar esta página.
 * Permite criar novas informações ou editar existentes.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, isAuthenticated } from '@/services/authService';
import { 
  createInformation, 
  getInformationById, 
  updateInformation,
  deleteInformation,
  type Information 
} from '@/services/informationService';
import { ThemeSelector } from '@/components/ThemeSelector';

const CreateEditInformation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);

  const user = getCurrentUser();

  useEffect(() => {
    // Verifica autenticação
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Verifica se é ADMIN
    if (user?.role !== 'ADMIN') {
      toast({
        title: 'Acesso Negado',
        description: 'Apenas administradores podem acessar esta página.',
        variant: 'destructive',
      });
      navigate('/informations');
      return;
    }

    // Se está em modo edição, carrega os dados
    if (isEditMode && id) {
      loadInformation(parseInt(id));
    }
  }, [navigate, user, isEditMode, id]);

  const loadInformation = async (informationId: number) => {
    try {
      const response = await getInformationById(informationId);
      
      if (response.success && response.data) {
        setTitle(response.data.title);
        setContent(response.data.content);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a informação.',
          variant: 'destructive',
        });
        navigate('/informations');
      }
    } catch (error) {
      console.error('Erro ao carregar informação:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha título e conteúdo.',
        variant: 'destructive',
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Usuário não identificado.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      let response;

      if (isEditMode && id) {
        // Atualizar informação existente
        response = await updateInformation(parseInt(id), {
          title,
          content,
          authorId: user.id,
        });
      } else {
        // Criar nova informação
        response = await createInformation({
          title,
          content,
          authorId: user.id,
        });
      }

      if (response.success) {
        toast({
          title: isEditMode ? 'Informação Atualizada!' : 'Informação Criada!',
          description: isEditMode 
            ? 'A informação foi atualizada com sucesso.' 
            : 'A informação foi publicada com sucesso.',
        });
        navigate('/informations');
      } else {
        throw new Error(response.message || 'Erro ao salvar informação');
      }
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Não foi possível salvar a informação.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir esta informação? Esta ação não pode ser desfeita.'
    );
    
    if (!confirmDelete) return;

    setIsLoading(true);

    try {
      const response = await deleteInformation(parseInt(id));

      if (response.success) {
        toast({
          title: 'Informação Excluída',
          description: 'A informação foi excluída com sucesso.',
        });
        navigate('/informations');
      } else {
        throw new Error(response.message || 'Erro ao excluir informação');
      }
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: error instanceof Error ? error.message : 'Não foi possível excluir a informação.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/informations')}
            >
              ← Voltar
            </Button>
            <ThemeSelector />
          </div>
          
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            {isEditMode ? 'Editar Informação' : 'Nova Informação'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Atualize o conteúdo da informação' 
              : 'Crie uma nova informação para compartilhar'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Informação</CardTitle>
              <CardDescription>Preencha os campos abaixo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Novidades sobre parto humanizado"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva aqui o conteúdo da informação..."
                  rows={10}
                  className="mt-2 resize-none"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
              size="lg"
            >
              {isLoading 
                ? 'Salvando...' 
                : isEditMode 
                  ? '💾 Atualizar Informação' 
                  : '✨ Publicar Informação'}
            </Button>

            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                size="lg"
              >
                🗑️ Excluir
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/informations')}
              size="lg"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditInformation;
