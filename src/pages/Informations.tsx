/**
 * PÁGINA DE INFORMAÇÕES
 * 
 * Lista todas as informações/notícias publicadas.
 * Usuários normais podem apenas visualizar.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, isAuthenticated } from '@/services/authService';
import { getAllContents, type Content } from '@/services/informationService';
import { ThemeSelector } from '@/components/ThemeSelector';

const Informations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadContents = async () => {
    try {
      const response = await getAllContents();
      
      if (response.success && response.data) {
        setContents(response.data);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os conteúdos.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error);
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
          <p className="text-lg text-muted-foreground">Carregando informações...</p>
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
              onClick={() => navigate('/home')}
            >
              ← Voltar
            </Button>
            <ThemeSelector />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-primary mb-2">
                Informações
              </h1>
              <p className="text-muted-foreground">
                Fique por dentro das últimas novidades
              </p>
            </div>
            
            {/* Botão Criar só aparece para ADMIN */}
            {isAdmin && (
              <Button
                onClick={() => navigate('/informations/create')}
                className="gap-2"
              >
                ➕ Nova Informação
              </Button>
            )}
          </div>
        </div>

        {/* Lista de Conteúdos */}
        <div className="space-y-4">
          {contents.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Nenhum conteúdo disponível no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            contents.map((content) => (
              <Card 
                key={content.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/informations/view/${content.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{content.title}</CardTitle>
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
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Preview do conteúdo (limitado) */}
                  <div 
                    className="prose prose-sm max-w-none text-foreground line-clamp-3"
                    dangerouslySetInnerHTML={{ 
                      __html: content.text.substring(0, 200) + (content.text.length > 200 ? '...' : '')
                    }}
                  />
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Publicado em: {new Date(content.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary"
                    >
                      Ler mais →
                    </Button>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Impede que o clique abra a visualização
                          navigate(`/informations/edit/${content.id}`);
                        }}
                      >
                        ✏️ Editar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Informations;
