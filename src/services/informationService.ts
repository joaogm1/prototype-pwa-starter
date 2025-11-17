/**
 * SERVIÇO DE CONTEÚDOS/INFORMAÇÕES
 * 
 * Gerencia todas as chamadas ao backend relacionadas a conteúdos informativos.
 */

const API_BASE_URL = 'https://humanize-app-service.onrender.com';

/**
 * Interface para um conteúdo/informação
 */
export interface Content {
  id: string;
  title: string;
  text: string; // HTML content
  category: string; // 'gestacao', 'parto', 'pos-parto', etc.
  role: string; // 'public' ou 'members'
  trimester: number; // 1, 2 ou 3
  weekRangeStart: number;
  weekRangeEnd: number;
  type: string; // 'article', 'guide', 'tip', etc.
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para criar um novo conteúdo
 */
export interface CreateContentRequest {
  title: string;
  text: string; // HTML
  category: string;
  role: string;
  trimester: number;
  weekRangeStart: number;
  weekRangeEnd: number;
  type: string;
}

/**
 * Interface para filtros de busca
 */
export interface ContentFilters {
  role?: string;
  category?: string;
  week?: number;
  trimester?: number;
}

/**
 * Interface para resposta da API
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Busca todos os conteúdos (sem filtros)
 */
export const getAllContents = async (): Promise<ApiResponse<Content[]>> => {
  try {
    console.log('📰 Buscando todos os conteúdos...');
    
    const response = await fetch(`${API_BASE_URL}/contents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error('Erro ao buscar conteúdos');
    }

    const data = await response.json();
    console.log('📥 Conteúdos recebidos:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar conteúdos:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Busca conteúdos por role (public ou members)
 */
export const getContentsByRole = async (role: string): Promise<ApiResponse<Content[]>> => {
  try {
    console.log('📰 Buscando conteúdos por role:', role);
    
    const response = await fetch(`${API_BASE_URL}/contents/role/${role}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar conteúdos por role');
    }

    const data = await response.json();
    console.log('📥 Conteúdos recebidos:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar conteúdos por role:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Busca conteúdos por categoria
 */
export const getContentsByCategory = async (category: string): Promise<ApiResponse<Content[]>> => {
  try {
    console.log('📰 Buscando conteúdos por categoria:', category);
    
    const response = await fetch(`${API_BASE_URL}/contents/category/${category}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar conteúdos por categoria');
    }

    const data = await response.json();
    console.log('� Conteúdos recebidos:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar conteúdos por categoria:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Busca conteúdos por trimestre
 */
export const getContentsByTrimester = async (trimester: number): Promise<ApiResponse<Content[]>> => {
  try {
    console.log('📰 Buscando conteúdos por trimestre:', trimester);
    
    const response = await fetch(`${API_BASE_URL}/contents/trimester/${trimester}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar conteúdos por trimestre');
    }

    const data = await response.json();
    console.log('📥 Conteúdos recebidos:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar conteúdos por trimestre:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Busca conteúdos por semana gestacional
 */
export const getContentsByWeek = async (week: number): Promise<ApiResponse<Content[]>> => {
  try {
    console.log('📰 Buscando conteúdos por semana:', week);
    
    const response = await fetch(`${API_BASE_URL}/contents/week/${week}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar conteúdos por semana');
    }

    const data = await response.json();
    console.log('📥 Conteúdos recebidos:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar conteúdos por semana:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Busca um conteúdo por ID
 */
export const getContentById = async (id: string): Promise<ApiResponse<Content>> => {
  try {
    console.log('📰 Buscando conteúdo ID:', id);
    
    const response = await fetch(`${API_BASE_URL}/contents/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error('Conteúdo não encontrado');
    }

    const data = await response.json();
    console.log('📥 Conteúdo recebido:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar conteúdo:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Cria um novo conteúdo (apenas ADMIN)
 */
export const createContent = async (
  content: CreateContentRequest
): Promise<ApiResponse<Content>> => {
  try {
    console.log('✨ Criando novo conteúdo:', content);
    
    const response = await fetch(`${API_BASE_URL}/contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    console.log('📥 Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error('Erro ao criar conteúdo');
    }

    const data = await response.json();
    console.log('📥 Conteúdo criado:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao criar conteúdo:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Atualiza um conteúdo existente (apenas ADMIN)
 */
export const updateContent = async (
  id: string,
  content: Partial<CreateContentRequest>
): Promise<ApiResponse<Content>> => {
  try {
    console.log('📝 Atualizando conteúdo ID:', id, content);
    
    const response = await fetch(`${API_BASE_URL}/contents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    console.log('📥 Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error('Erro ao atualizar conteúdo');
    }

    const data = await response.json();
    console.log('📥 Conteúdo atualizado:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao atualizar conteúdo:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Deleta um conteúdo (apenas ADMIN)
 */
export const deleteContent = async (id: string): Promise<ApiResponse<void>> => {
  try {
    console.log('🗑️ Deletando conteúdo ID:', id);
    
    const response = await fetch(`${API_BASE_URL}/contents/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Status da resposta:', response.status);

    if (!response.ok && response.status !== 204) {
      throw new Error('Erro ao deletar conteúdo');
    }

    console.log('✅ Conteúdo deletado com sucesso');

    return {
      success: true,
    };
  } catch (error) {
    console.error('❌ Erro ao deletar conteúdo:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};
