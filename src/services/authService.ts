/**
 * SERVIÇO DE AUTENTICAÇÃO
 * 
 * Este arquivo gerencia todas as chamadas ao backend relacionadas a autenticação.
 * Aqui você deve configurar a URL do seu backend real.
 * 
 * Funções disponíveis:
 * - login: Autentica o usuário com email e senha
 * - register: Cadastra um novo usuário
 * - logout: Encerra a sessão do usuário
 */

// IMPORTANTE: Configure aqui a URL do seu backend
const API_BASE_URL = 'https://seu-backend.com/api'; // ⬅️ ALTERE PARA A URL DO SEU BACKEND

/**
 * Interface que define os dados de um usuário
 */
export interface User {
  id: string;
  nome: string;
  email: string;
  tipoPerfil: 'gestante' | 'acompanhante';
  dataCriacao?: string;
}

/**
 * Interface para dados de login
 */
export interface LoginCredentials {
  email: string;
  senha: string;
}

/**
 * Interface para dados de cadastro
 */
export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  tipoPerfil: 'gestante' | 'acompanhante';
}

/**
 * Interface para resposta do backend
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

/**
 * Função para fazer login
 * 
 * @param credentials - Email e senha do usuário
 * @returns Resposta com dados do usuário e token de autenticação
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    // Salva o token no localStorage para manter o usuário logado
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error('Erro no login:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao fazer login',
    };
  }
};

/**
 * Função para cadastrar um novo usuário
 * 
 * @param userData - Dados do novo usuário (nome, email, senha, tipo de perfil)
 * @returns Resposta com dados do usuário criado
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao cadastrar usuário');
    }

    // Após cadastro bem-sucedido, salva o token
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao cadastrar',
    };
  }
};

/**
 * Função para fazer logout
 * Remove os dados do usuário do localStorage
 */
export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

/**
 * Função para verificar se o usuário está autenticado
 * 
 * @returns true se o usuário estiver logado, false caso contrário
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

/**
 * Função para obter os dados do usuário logado
 * 
 * @returns Dados do usuário ou null se não estiver logado
 */
export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  
  try {
    return JSON.parse(userString);
  } catch {
    return null;
  }
};

/**
 * Função para obter o token de autenticação
 * 
 * @returns Token de autenticação ou null
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};
