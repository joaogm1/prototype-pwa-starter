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
const API_BASE_URL = 'http://localhost:8080'; // URL do backend Java

/**
 * Interface que define os dados de um usuário (UserResponse do backend)
 */
export interface User {
  id: number;
  name: string;
  username: string;
  cpf: string;
  role?: string; // 'ADMIN' ou null/undefined para usuários normais
}

/**
 * Interface para dados de login
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Interface para dados de cadastro (deve corresponder ao CreateUserRequest do backend)
 */
export interface RegisterData {
  name: string;
  username: string;
  password: string;
  cpf: string;
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
 * @param credentials - Username e senha do usuário
 * @returns Resposta com dados do usuário
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('📤 Passo 1: Autenticando usuário:', { username: credentials.username });
    
    // Passo 1: Autentica o usuário (retorna true/false)
    const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('📥 Status da autenticação:', loginResponse.status);
    
    const isAuthenticated = await loginResponse.json();
    console.log('📥 Autenticado?', isAuthenticated);

    if (!loginResponse.ok || !isAuthenticated) {
      throw new Error('Username ou senha incorretos');
    }

    // Passo 2: Busca os dados completos do usuário
    console.log('📤 Passo 2: Buscando dados do usuário:', credentials.username);
    
    const userResponse = await fetch(`${API_BASE_URL}/users/${credentials.username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Status da busca do usuário:', userResponse.status);

    if (!userResponse.ok) {
      throw new Error('Erro ao buscar dados do usuário');
    }

    const userData = await userResponse.json();
    console.log('📥 Dados do usuário recebidos:', userData);

    // Salva os dados do usuário no localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    // Marca como autenticado
    localStorage.setItem('authToken', 'authenticated');

    return {
      success: true,
      user: userData,
    };
  } catch (error) {
    console.error('❌ Erro no login:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao fazer login',
    };
  }
};

/**
 * Função para cadastrar um novo usuário
 * 
 * @param userData - Dados do novo usuário (nome, username, senha, cpf)
 * @returns Resposta com dados do usuário criado
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('📤 Enviando dados para o backend:', userData);
    
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('📥 Status da resposta:', response.status);
    
    const data = await response.json();
    console.log('📥 Dados recebidos do backend:', data);

    if (!response.ok) {
      // Backend retorna { message: "..." } em caso de erro (status 400)
      throw new Error(data.message || 'Erro ao cadastrar usuário');
    }

    // Sucesso: Backend retorna diretamente o UserResponse (status 201)
    // Como não há token/autenticação automática, apenas retornamos os dados do usuário
    return {
      success: true,
      user: data, // data já é o UserResponse com {id, name, username, cpf}
    };
  } catch (error) {
    console.error('❌ Erro no cadastro:', error);
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
