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
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, isAuthenticated } from '@/services/authService';
import { getAllInformations, type Information } from '@/services/informationService';
import { ThemeSelector } from '@/components/ThemeSelector';

const Informations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [informations, setInformations] = useState<Information[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadInformations();
  }, [navigate]);

  const loadInformations = async () => {
    try {
      const response = await getAllInformations();
      
      if (response.success && response.data) {
        setInformations(response.data);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as informações.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar informações:', error);
    } finally {
      setIsLoading(false);
    }
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

        {/* Lista de Informações */}
        <div className="space-y-4">
          {informations.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Nenhuma informação disponível no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            informations.map((info) => (
              <Card key={info.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{info.title}</CardTitle>
                  <CardDescription>
                    {new Date(info.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {info.authorName && ` • Por ${info.authorName}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{info.content}</p>
                  
                  {isAdmin && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/informations/edit/${info.id}`)}
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
