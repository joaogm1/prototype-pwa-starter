/**
 * PÁGINA DO PLANO DE PARTO
 * 
 * Formulário completo para criação do plano de parto humanizado.
 * Permite que a gestante registre suas preferências para o momento do parto.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, isAuthenticated } from '@/services/authService';
import { 
  createBirthPlan, 
  getBirthPlanByUserId, 
  updateBirthPlan,
  deleteBirthPlan,
  type BirthPlanData,
  type BirthPlanResponse
} from '@/services/birthPlanService';
import jsPDF from 'jspdf';

interface BirthPlanFormData {
  companionName: string;
  companionRelationship: string;
  painReliefMethods: string[];
  birthPosition: string;
  cordClamping: string;
  skinToSkin: string;
  breastfeeding: string;
  additionalNotes: string;
}

const BirthPlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Estrutura do formulário
  const painMethodsOptions = [
    'Massagem',
    'Banho morno/chuveiro',
    'Bola suíça',
    'Música/Aromaterapia'
  ];

  // Estado do formulário
  const [birthPlan, setBirthPlan] = useState<BirthPlanFormData>({
    companionName: '',
    companionRelationship: '',
    painReliefMethods: [],
    birthPosition: '',
    cordClamping: '',
    skinToSkin: '',
    breastfeeding: '',
    additionalNotes: ''
  });

  const [existingPlanId, setExistingPlanId] = useState<number | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isViewMode, setIsViewMode] = useState(false); // Modo de visualização vs edição

  useEffect(() => {
    // Carrega dados do backend
    loadBirthPlan();
  }, [navigate]);

  // Função para carregar plano de parto existente
  const loadBirthPlan = async () => {
    try {
      // Pega o usuário logado
      const user = getCurrentUser();
      console.log('🔍 Usuário logado:', user);
      
      if (!user || !user.id) {
        console.error('❌ Nenhum usuário logado encontrado');
        toast({
          title: 'Erro',
          description: 'Faça login primeiro para acessar o plano de parto.',
          variant: 'destructive',
        });
        setIsLoadingData(false);
        return;
      }
      
      console.log('🔍 Carregando plano do usuário ID:', user.id);
      
      const response = await getBirthPlanByUserId(user.id);
      
      if (response.success && response.data) {
        // Carrega dados existentes
        setBirthPlan({
          companionName: response.data.companionName,
          companionRelationship: response.data.companionRelationship,
          painReliefMethods: response.data.painReliefMethods,
          birthPosition: response.data.birthPosition,
          cordClamping: response.data.cordClamping,
          skinToSkin: response.data.skinToSkin,
          breastfeeding: response.data.breastfeeding,
          additionalNotes: response.data.additionalNotes,
        });
        setExistingPlanId(response.data.id);
        setIsViewMode(true); // Inicia em modo visualização quando já tem plano
        
        toast({
          title: 'Plano carregado',
          description: 'Seu plano de parto foi carregado com sucesso.',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar plano:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Função para lidar com mudanças nos checkboxes
  const handleCheckboxChange = (value: string, checked: boolean) => {
    setBirthPlan(prev => {
      const newMethods = checked
        ? [...prev.painReliefMethods, value]
        : prev.painReliefMethods.filter(m => m !== value);
      
      return { ...prev, painReliefMethods: newMethods };
    });
  };

  // Função para salvar o plano
  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Pega o usuário logado
      const user = getCurrentUser();
      console.log('💾 Usuário ao salvar:', user);
      
      if (!user || !user.id) {
        throw new Error('Faça login primeiro para salvar o plano de parto');
      }
      
      console.log('💾 Salvando plano - User ID:', user.id, 'Existing Plan ID:', existingPlanId);

      let response;

      if (existingPlanId) {
        // Atualizar plano existente
        console.log('📝 Atualizando plano existente...');
        response = await updateBirthPlan(existingPlanId, birthPlan);
        
        if (response.success) {
          setIsViewMode(true); // Volta para modo visualização após salvar
          toast({
            title: 'Plano Atualizado!',
            description: 'Suas preferências foram atualizadas com sucesso.',
          });
        }
      } else {
        // Criar novo plano
        console.log('✨ Criando novo plano...');
        response = await createBirthPlan({
          userId: user.id,
          ...birthPlan
        });
        
        if (response.success && response.data) {
          setExistingPlanId(response.data.id);
          setIsViewMode(true); // Entra em modo visualização após criar
          toast({
            title: 'Plano Criado!',
            description: 'Seu plano de parto foi criado com sucesso.',
          });
        }
      }

      if (!response.success) {
        throw new Error(response.message || 'Erro ao salvar plano');
      }

    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Não foi possível salvar o plano de parto.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para deletar o plano
  const handleDelete = async () => {
    if (!existingPlanId) return;

    const confirmDelete = window.confirm('Tem certeza que deseja excluir seu plano de parto? Esta ação não pode ser desfeita.');
    
    if (!confirmDelete) return;

    setIsLoading(true);

    try {
      const response = await deleteBirthPlan(existingPlanId);

      if (response.success) {
        toast({
          title: 'Plano Excluído',
          description: 'Seu plano de parto foi excluído com sucesso.',
        });

        // Limpa o formulário e volta para modo criação
        setBirthPlan({
          companionName: '',
          companionRelationship: '',
          painReliefMethods: [],
          birthPosition: '',
          cordClamping: '',
          skinToSkin: '',
          breastfeeding: '',
          additionalNotes: ''
        });
        setExistingPlanId(null);
        setIsViewMode(false);
      } else {
        throw new Error(response.message || 'Erro ao excluir plano');
      }
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: error instanceof Error ? error.message : 'Não foi possível excluir o plano de parto.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para exportar para PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const user = getCurrentUser();
    
    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = 20;

    // Título
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Plano de Parto Humanizado', margin, yPosition);
    yPosition += 15;

    // Nome do usuário
    if (user && user.name) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Gestante: ${user.name}`, margin, yPosition);
      yPosition += 10;
    }

    // Data de geração
    const today = new Date().toLocaleDateString('pt-BR');
    doc.text(`Data: ${today}`, margin, yPosition);
    yPosition += 15;

    // Linha divisória
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Seções do plano
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');

    // 1. Acompanhante
    doc.text('1. Acompanhante no Parto', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    if (birthPlan.companionName) {
      doc.text(`Nome: ${birthPlan.companionName}`, margin + 5, yPosition);
      yPosition += 6;
    }
    if (birthPlan.companionRelationship) {
      doc.text(`Relação: ${birthPlan.companionRelationship}`, margin + 5, yPosition);
      yPosition += 10;
    }

    // 2. Métodos de alívio da dor
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Métodos Não Farmacológicos para Dor', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    if (birthPlan.painReliefMethods.length > 0) {
      birthPlan.painReliefMethods.forEach((method) => {
        doc.text(`• ${method}`, margin + 5, yPosition);
        yPosition += 6;
      });
      yPosition += 4;
    } else {
      doc.text('Nenhum método selecionado', margin + 5, yPosition);
      yPosition += 10;
    }

    // 3. Posição preferida
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Posição Preferida para o Parto', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(birthPlan.birthPosition || 'Não especificado', margin + 5, yPosition);
    yPosition += 10;

    // 4. Clampeamento do cordão
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Clampeamento do Cordão Umbilical', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(birthPlan.cordClamping || 'Não especificado', margin + 5, yPosition);
    yPosition += 10;

    // 5. Contato pele-a-pele
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('5. Contato Pele-a-Pele Pós-Parto', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(birthPlan.skinToSkin || 'Não especificado', margin + 5, yPosition);
    yPosition += 10;

    // 6. Amamentação
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('6. Amamentação na Primeira Hora', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(birthPlan.breastfeeding || 'Não especificado', margin + 5, yPosition);
    yPosition += 10;

    // 7. Observações adicionais
    if (birthPlan.additionalNotes) {
      // Verifica se precisa de nova página
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('7. Outras Observações', margin, yPosition);
      yPosition += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      // Quebra o texto em múltiplas linhas
      const splitNotes = doc.splitTextToSize(birthPlan.additionalNotes, maxWidth - 5);
      doc.text(splitNotes, margin + 5, yPosition);
    }

    // Salva o PDF
    const fileName = `plano-parto-${user?.name?.replace(/\s+/g, '-') || 'documento'}.pdf`;
    doc.save(fileName);

    toast({
      title: 'PDF Gerado!',
      description: 'Seu plano de parto foi exportado com sucesso.',
    });
  };

  const user = getCurrentUser();

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Carregando plano de parto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="mb-4"
          >
            ← Voltar
          </Button>
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            Plano de Parto {isViewMode ? '(Visualização)' : existingPlanId ? '(Editando)' : '(Novo)'}
          </h1>
          <p className="text-muted-foreground">
            {isViewMode 
              ? 'Visualize seu plano de parto. Clique em "Editar" para fazer alterações.'
              : 'Preencha suas preferências para o momento do parto.'}
          </p>
        </div>

        {/* Formulário */}
        <div className="space-y-6">
          {/* Nome do Acompanhante */}
          <Card>
            <CardHeader>
              <CardTitle>Acompanhante no Parto</CardTitle>
              <CardDescription>Quem você gostaria que estivesse presente?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companionName">Nome do Acompanhante</Label>
                <Input
                  id="companionName"
                  value={birthPlan.companionName}
                  onChange={(e) => setBirthPlan(prev => ({ ...prev, companionName: e.target.value }))}
                  placeholder="Ex: Maria Silva"
                  className="mt-2"
                  disabled={isViewMode}
                />
              </div>
              <div>
                <Label htmlFor="companionRelationship">Relação</Label>
                <Input
                  id="companionRelationship"
                  value={birthPlan.companionRelationship}
                  onChange={(e) => setBirthPlan(prev => ({ ...prev, companionRelationship: e.target.value }))}
                  placeholder="Ex: Mãe, Esposo, Irmã"
                  className="mt-2"
                  disabled={isViewMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Métodos Não Farmacológicos para Dor */}
          <Card>
            <CardHeader>
              <CardTitle>Métodos Não Farmacológicos para Dor</CardTitle>
              <CardDescription>Selecione os métodos de alívio da dor que gostaria de usar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {painMethodsOptions.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={method}
                    checked={birthPlan.painReliefMethods.includes(method)}
                    onCheckedChange={(checked) => handleCheckboxChange(method, checked as boolean)}
                    disabled={isViewMode}
                  />
                  <Label htmlFor={method} className="cursor-pointer">
                    {method}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Posição Preferida para o Parto */}
          <Card>
            <CardHeader>
              <CardTitle>Posição Preferida para o Parto</CardTitle>
              <CardDescription>Como você prefere dar à luz?</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={birthPlan.birthPosition}
                onValueChange={(value) => setBirthPlan(prev => ({ ...prev, birthPosition: value }))}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Livre (escolhida na hora)">
                    Livre (escolhida na hora)
                  </SelectItem>
                  <SelectItem value="Verticalizada (cócoras, em pé)">
                    Verticalizada (cócoras, em pé)
                  </SelectItem>
                  <SelectItem value="Horizontal (deitada)">
                    Horizontal (deitada)
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Clampeamento do Cordão Umbilical */}
          <Card>
            <CardHeader>
              <CardTitle>Clampeamento do Cordão Umbilical</CardTitle>
              <CardDescription>Quando o cordão deve ser cortado?</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={birthPlan.cordClamping}
                onValueChange={(value) => setBirthPlan(prev => ({ ...prev, cordClamping: value }))}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Imediatamente">
                    Imediatamente
                  </SelectItem>
                  <SelectItem value="Clampeamento tardio (após cessar pulsação)">
                    Clampeamento tardio (após cessar pulsação)
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Contato Pele-a-Pele Pós-Parto */}
          <Card>
            <CardHeader>
              <CardTitle>Contato Pele-a-Pele Pós-Parto</CardTitle>
              <CardDescription>Deseja contato imediato com o bebê?</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={birthPlan.skinToSkin}
                onValueChange={(value) => setBirthPlan(prev => ({ ...prev, skinToSkin: value }))}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim, imediato, por pelo menos 1 hora">
                    Sim, imediato, por pelo menos 1 hora
                  </SelectItem>
                  <SelectItem value="Sim, após procedimentos iniciais">
                    Sim, após procedimentos iniciais
                  </SelectItem>
                  <SelectItem value="Não">
                    Não
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Amamentação na Primeira Hora */}
          <Card>
            <CardHeader>
              <CardTitle>Amamentação na Primeira Hora</CardTitle>
              <CardDescription>Deseja tentar amamentar logo após o nascimento?</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={birthPlan.breastfeeding}
                onValueChange={(value) => setBirthPlan(prev => ({ ...prev, breastfeeding: value }))}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim, buscar iniciar na primeira hora">
                    Sim, buscar iniciar na primeira hora
                  </SelectItem>
                  <SelectItem value="Não">
                    Não
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Outras Observações */}
          <Card>
            <CardHeader>
              <CardTitle>Outras Observações Importantes</CardTitle>
              <CardDescription>Adicione qualquer informação adicional relevante</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={birthPlan.additionalNotes}
                onChange={(e) => setBirthPlan(prev => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder="Escreva aqui seus desejos e observações..."
                rows={5}
                className="resize-none"
                disabled={isViewMode}
              />
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            {isViewMode ? (
              <>
                <Button
                  onClick={() => setIsViewMode(false)}
                  className="flex-1"
                  size="lg"
                >
                  ✏️ Editar Plano
                </Button>
                
                <Button
                  onClick={handleExportPDF}
                  variant="secondary"
                  size="lg"
                >
                  📄 Exportar PDF
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? 'Excluindo...' : '🗑️ Excluir'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/home')}
                  size="lg"
                >
                  Voltar
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1"
                  size="lg"
                >
                  {isLoading ? 'Salvando...' : existingPlanId ? '💾 Atualizar Plano' : '💾 Criar Plano'}
                </Button>

                {existingPlanId && (
                  <Button
                    onClick={handleExportPDF}
                    variant="secondary"
                    size="lg"
                  >
                    📄 Exportar PDF
                  </Button>
                )}
                
                {existingPlanId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewMode(true);
                      loadBirthPlan(); // Recarrega os dados originais
                    }}
                    size="lg"
                  >
                    Cancelar
                  </Button>
                )}
                
                {!existingPlanId && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/home')}
                    size="lg"
                  >
                    Cancelar
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthPlan;
