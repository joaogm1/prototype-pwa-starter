/**
 * PÁGINA DE VISUALIZAÇÃO DE INFORMAÇÃO
 * 
 * Exibe uma informação/notícia individual em tela cheia.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, isAuthenticated } from '@/services/authService';
import { getContentById, type Content } from '@/services/informationService';
import { ThemeSelector } from '@/components/ThemeSelector';

const ViewInformation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (id) {
      loadContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadContent = async () => {
    if (!id) return;
    
    try {
      const response = await getContentById(id);
      
      if (response.success && response.data) {
        setContent(response.data);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o conteúdo.',
          variant: 'destructive',
        });
        navigate('/informations');
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar o conteúdo.',
        variant: 'destructive',
      });
      navigate('/informations');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      gestacao: 'Gestação',
      parto: 'Parto',
      'pos-parto': 'Pós-Parto',
    };
    return labels[category] || category;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      article: 'Artigo',
      guide: 'Guia',
      tip: 'Dica',
    };
    return labels[type] || type;
  };

  const isAdmin = user?.role === 'ADMIN';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Conteúdo não encontrado.</p>
          <Button onClick={() => navigate('/informations')} className="mt-4">
            Voltar
          </Button>
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
              ← Voltar para Informações
            </Button>
            <ThemeSelector />
          </div>
        </div>

        {/* Conteúdo Principal */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div>
                <CardTitle className="text-3xl mb-3">{content.title}</CardTitle>
                <CardDescription className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{getCategoryLabel(content.category)}</Badge>
                  <Badge variant="outline">{getTypeLabel(content.type)}</Badge>
                  <Badge variant="outline">
                    {content.trimester}º Trimestre ({content.weekRangeStart}-{content.weekRangeEnd} semanas)
                  </Badge>
                  {content.role === 'members' && (
                    <Badge className="bg-primary">Membros</Badge>
                  )}
                </CardDescription>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Publicado em: {new Date(content.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Renderiza HTML com segurança */}
            <div 
              className="prose prose-lg max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: content.text }}
            />
            
            {/* Botão de editar só para ADMIN */}
            {isAdmin && (
              <div className="flex gap-2 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/informations/edit/${content.id}`)}
                >
                  ✏️ Editar este Conteúdo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewInformation;
