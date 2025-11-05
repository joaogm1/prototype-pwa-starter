/**
 * SERVIÇO DE INFORMAÇÕES
 * 
 * Gerencia todas as chamadas ao backend relacionadas a informações/notícias.
 */

const API_BASE_URL = 'http://localhost:8080';

/**
 * Interface para uma informação/notícia
 */
export interface Information {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorId: number;
  authorName?: string;
}

/**
 * Interface para criar uma nova informação
 */
export interface CreateInformationRequest {
  title: string;
  content: string;
  authorId: number;
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
 * Busca todas as informações
 */
export const getAllInformations = async (): Promise<ApiResponse<Information[]>> => {
  try {
    console.log('📰 Buscando todas as informações...');
    
    const response = await fetch(`${API_BASE_URL}/informations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error('Erro ao buscar informações');
    }

    const data = await response.json();
    console.log('📥 Informações recebidas:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar informações:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Busca uma informação por ID
 */
export const getInformationById = async (id: number): Promise<ApiResponse<Information>> => {
  try {
    console.log('📰 Buscando informação ID:', id);
    
    const response = await fetch(`${API_BASE_URL}/informations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error('Informação não encontrada');
    }

    const data = await response.json();
    console.log('📥 Informação recebida:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar informação:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Cria uma nova informação (apenas ADMIN)
 */
export const createInformation = async (
  information: CreateInformationRequest
): Promise<ApiResponse<Information>> => {
  try {
    console.log('✨ Criando nova informação:', information);
    
    const response = await fetch(`${API_BASE_URL}/informations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(information),
    });

    console.log('📥 Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error('Erro ao criar informação');
    }

    const data = await response.json();
    console.log('📥 Informação criada:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao criar informação:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Atualiza uma informação existente (apenas ADMIN)
 */
export const updateInformation = async (
  id: number,
  information: Partial<CreateInformationRequest>
): Promise<ApiResponse<Information>> => {
  try {
    console.log('📝 Atualizando informação ID:', id, information);
    
    const response = await fetch(`${API_BASE_URL}/informations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(information),
    });

    console.log('📥 Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error('Erro ao atualizar informação');
    }

    const data = await response.json();
    console.log('📥 Informação atualizada:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Erro ao atualizar informação:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Deleta uma informação (apenas ADMIN)
 */
export const deleteInformation = async (id: number): Promise<ApiResponse<void>> => {
  try {
    console.log('🗑️ Deletando informação ID:', id);
    
    const response = await fetch(`${API_BASE_URL}/informations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error('Erro ao deletar informação');
    }

    console.log('✅ Informação deletada com sucesso');

    return {
      success: true,
    };
  } catch (error) {
    console.error('❌ Erro ao deletar informação:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};
