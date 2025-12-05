/**
 * SERVIÇO DE PLANO DE PARTO
 * 
 * Este arquivo gerencia todas as chamadas ao backend relacionadas ao plano de parto.
 * 
 * Funções disponíveis:
 * - createBirthPlan: Cria um novo plano de parto
 * - getBirthPlanByUserId: Busca o plano de parto de um usuário
 * - updateBirthPlan: Atualiza um plano de parto existente
 * - deleteBirthPlan: Deleta um plano de parto
 */

const API_BASE_URL = 'https://humanize-app-service.onrender.com';

/**
 * Interface para dados do plano de parto
 */
export interface BirthPlanData {
  companionName: string;
  companionRelationship: string;
  painReliefMethods: string[];
  birthPosition: string;
  cordClamping: string;
  skinToSkin: string;
  breastfeeding: string;
  additionalNotes: string;
}

/**
 * Interface para criar plano de parto (inclui userId)
 */
export interface CreateBirthPlanRequest extends BirthPlanData {
  userId: number;
}

/**
 * Interface para resposta do backend
 */
export interface BirthPlanResponse extends BirthPlanData {
  id: number;
  userId: number;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para resposta de erro
 */
interface ErrorResponse {
  message: string;
}

/**
 * Interface para resposta da API
 */
export interface ApiResponse {
  success: boolean;
  data?: BirthPlanResponse;
  message?: string;
}

/**
 * Função para criar um novo plano de parto
 * 
 * @param birthPlanData - Dados do plano de parto
 * @returns Resposta com dados do plano criado
 */
export const createBirthPlan = async (
  birthPlanData: CreateBirthPlanRequest
): Promise<ApiResponse> => {
  try {
    const url = `${API_BASE_URL}/birth-plans`;


    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(birthPlanData),
    });


    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as ErrorResponse).message || 'Erro ao criar plano de parto');
    }

    return {
      success: true,
      data: data as BirthPlanResponse,
    };
  } catch (error) {

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao criar plano',
    };
  }
};

/**
 * Função para buscar plano de parto por ID do usuário
 * 
 * @param userId - ID do usuário
 * @returns Resposta com dados do plano de parto
 */
export const getBirthPlanByUserId = async (userId: number): Promise<ApiResponse> => {
  try {
    const url = `${API_BASE_URL}/birth-plans/user/${userId}`;


    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });


    if (response.status === 404) {
      // Usuário não tem plano de parto ainda

      return {
        success: true,
        data: undefined,
      };
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as ErrorResponse).message || 'Erro ao buscar plano de parto');
    }

    return {
      success: true,
      data: data as BirthPlanResponse,
    };
  } catch (error) {

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar plano',
    };
  }
};

/**
 * Função para buscar plano de parto por ID
 * 
 * @param id - ID do plano de parto
 * @returns Resposta com dados do plano de parto
 */
export const getBirthPlanById = async (id: number): Promise<ApiResponse> => {
  try {

    const response = await fetch(`${API_BASE_URL}/birth-plans/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });


    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as ErrorResponse).message || 'Erro ao buscar plano de parto');
    }

    return {
      success: true,
      data: data as BirthPlanResponse,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar plano',
    };
  }
};

/**
 * Função para atualizar um plano de parto existente
 * 
 * @param id - ID do plano de parto
 * @param birthPlanData - Dados atualizados do plano
 * @returns Resposta com dados do plano atualizado
 */
export const updateBirthPlan = async (
  id: number,
  birthPlanData: BirthPlanData
): Promise<ApiResponse> => {
  try {

    const response = await fetch(`${API_BASE_URL}/birth-plans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(birthPlanData),
    });


    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as ErrorResponse).message || 'Erro ao atualizar plano de parto');
    }

    return {
      success: true,
      data: data as BirthPlanResponse,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar plano',
    };
  }
};

/**
 * Função para deletar um plano de parto
 * 
 * @param id - ID do plano de parto
 * @returns Resposta de sucesso ou erro
 */
export const deleteBirthPlan = async (id: number): Promise<ApiResponse> => {
  try {

    const response = await fetch(`${API_BASE_URL}/birth-plans/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });


    if (!response.ok && response.status !== 204) {
      const data = await response.json();
      throw new Error((data as ErrorResponse).message || 'Erro ao deletar plano de parto');
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao deletar plano',
    };
  }
};
