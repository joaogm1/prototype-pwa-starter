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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, isAuthenticated } from '@/services/authService';
import { 
  createContent, 
  getContentById, 
  updateContent,
  deleteContent,
  type Content 
} from '@/services/informationService';
import { ThemeSelector } from '@/components/ThemeSelector';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateEditInformation = () => {
  const [showImageField, setShowImageField] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const [title, setTitle] = useState('');
  const [text, setText] = useState(''); // HTML content
  const [imageUrl, setImageUrl] = useState(''); // Link da imagem
  const [category, setCategory] = useState('gestacao');
  const [role, setRole] = useState('public');
  const [trimester, setTrimester] = useState<number>(1);
  const [weekRangeStart, setWeekRangeStart] = useState<number>(1);
  const [weekRangeEnd, setWeekRangeEnd] = useState<number>(13);
  const [type, setType] = useState('article');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);

  const user = getCurrentUser();

  // Configuração do editor Quill
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

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
      loadContent(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);

  const loadContent = async (contentId: string) => {
    try {
      const response = await getContentById(contentId);
      
      if (response.success && response.data) {
        setTitle(response.data.title);
        setText(response.data.text);
        setImageUrl(response.data.imageUrl || '');
        setCategory(response.data.category);
        setRole(response.data.role);
        setTrimester(response.data.trimester);
        setWeekRangeStart(response.data.weekRangeStart);
        setWeekRangeEnd(response.data.weekRangeEnd);
        setType(response.data.type);
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
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !text.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha título e conteúdo.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      let response;

      const contentData = {
        title,
        text,
        imageUrl,
        category,
        role,
        trimester,
        weekRangeStart,
        weekRangeEnd,
        type,
      };

      if (isEditMode && id) {
        // Atualizar conteúdo existente
        response = await updateContent(id, contentData);
      } else {
        // Criar novo conteúdo
        response = await createContent(contentData);
      }

      if (response.success) {
        toast({
          title: isEditMode ? 'Conteúdo Atualizado!' : 'Conteúdo Criado!',
          description: isEditMode 
            ? 'O conteúdo foi atualizado com sucesso.' 
            : 'O conteúdo foi publicado com sucesso.',
        });
        navigate('/informations');
      } else {
        throw new Error(response.message || 'Erro ao salvar conteúdo');
      }
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Não foi possível salvar o conteúdo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.'
    );
    
    if (!confirmDelete) return;

    setIsLoading(true);

    try {
      const response = await deleteContent(id);

      if (response.success) {
        toast({
          title: 'Conteúdo Excluído',
          description: 'O conteúdo foi excluído com sucesso.',
        });
        navigate('/informations');
      } else {
        throw new Error(response.message || 'Erro ao excluir conteúdo');
      }
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: error instanceof Error ? error.message : 'Não foi possível excluir o conteúdo.',
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
            {isEditMode ? 'Editar Conteúdo' : 'Novo Conteúdo'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Atualize o conteúdo informativo' 
              : 'Crie um novo conteúdo para compartilhar'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Preencha os dados do conteúdo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Cuidados no primeiro trimestre"
                  className="mt-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gestacao">Gestação</SelectItem>
                      <SelectItem value="parto">Parto</SelectItem>
                      <SelectItem value="pos-parto">Pós-Parto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Artigo</SelectItem>
                      <SelectItem value="guide">Guia</SelectItem>
                      <SelectItem value="tip">Dica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Visibilidade *</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="members">Apenas Membros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="trimester">Trimestre *</Label>
                  <Select value={trimester.toString()} onValueChange={(val) => setTrimester(parseInt(val))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1º Trimestre</SelectItem>
                      <SelectItem value="2">2º Trimestre</SelectItem>
                      <SelectItem value="3">3º Trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weekStart">Semana Inicial *</Label>
                  <Input
                    id="weekStart"
                    type="number"
                    min="1"
                    max="40"
                    value={weekRangeStart}
                    onChange={(e) => setWeekRangeStart(parseInt(e.target.value) || 1)}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="weekEnd">Semana Final *</Label>
                  <Input
                    id="weekEnd"
                    type="number"
                    min="1"
                    max="40"
                    value={weekRangeEnd}
                    onChange={(e) => setWeekRangeEnd(parseInt(e.target.value) || 13)}
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              {/* Campo de imagem removido. Use o botão de imagem do editor para inserir imagens no texto. */}

              <div className="mt-4">
                <Label htmlFor="text">Conteúdo (HTML) *</Label>
                <div className="mt-2 border rounded-md">
                  <ReactQuill 
                    theme="snow"
                    value={text}
                    onChange={setText}
                    modules={modules}
                    formats={formats}
                    placeholder="Escreva o conteúdo aqui. Use as ferramentas acima para formatação."
                    className="min-h-[300px]"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use negrito, itálico, listas e outras formatações para destacar informações importantes.
                </p>
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
                  ? '💾 Atualizar Conteúdo' 
                  : '✨ Publicar Conteúdo'}
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
