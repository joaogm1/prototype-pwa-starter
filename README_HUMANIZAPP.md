# HumanizApp - Guia de Desenvolvimento

## 📱 Sobre o Projeto

HumanizApp é um Progressive Web App (PWA) desenvolvido com **React** e **Capacitor** para planejamento de parto humanizado e acompanhamento de gestação.

### Tecnologias Utilizadas

- **React 18** - Framework de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de UI
- **Capacitor** - Para transformar em app nativo (iOS/Android)

---

## 🎨 Design System

O projeto usa um sistema de design baseado no protótipo fornecido:

### Cores Principais
- **Primary**: `#a87d90` (Rosa Mauve) - Cor principal do app
- **Background**: `#fffdf7` (Bege Creme) - Cor de fundo
- **Accent**: `#fce4ec` (Rosa Pastel) - Destaques e cards

### Fonte
- **Inter** - Fonte principal (do Google Fonts)

---

## 📂 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis (UI do shadcn)
├── pages/              # Páginas da aplicação
│   ├── Login.tsx       # ✅ Página de login
│   ├── Register.tsx    # ✅ Página de cadastro
│   ├── Home.tsx        # ✅ Página inicial (após login)
│   └── NotFound.tsx    # Página 404
├── services/           # Serviços (APIs, autenticação)
│   └── authService.ts  # ✅ Serviço de autenticação
├── App.tsx             # Componente raiz com rotas
└── index.css           # Estilos globais e design system
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão 18 ou superior)
- npm ou yarn

### Passos

1. **Clone o repositório** (se estiver no GitHub)
```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_PROJETO>
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o backend**

Abra o arquivo `src/services/authService.ts` e altere a URL do backend:

```typescript
const API_BASE_URL = 'https://seu-backend.com/api'; // ⬅️ COLOQUE A URL DO SEU BACKEND AQUI
```

4. **Rode em modo de desenvolvimento**
```bash
npm run dev
```

O app estará disponível em: `https://humanize-app-service.onrender.com`

---

## 📱 Transformar em App Mobile (Capacitor)

### Configuração Inicial

1. **Faça o build da aplicação**
```bash
npm run build
```

2. **Adicione as plataformas desejadas**

Para Android:
```bash
npx cap add android
```

Para iOS (apenas no macOS):
```bash
npx cap add ios
```

3. **Sincronize os arquivos**
```bash
npx cap sync
```

### Rodar no Emulador/Dispositivo

**Android:**
```bash
npx cap run android
```
> Você precisa ter o Android Studio instalado

**iOS:**
```bash
npx cap run ios
```
> Você precisa ter o Xcode instalado (apenas macOS)

### Testar no Dispositivo Físico

O arquivo `capacitor.config.ts` já está configurado para permitir testes no dispositivo físico durante o desenvolvimento. O app carregará diretamente do servidor de desenvolvimento.

---

## 🔐 Integração com Backend

### Endpoints Esperados

O serviço de autenticação (`src/services/authService.ts`) espera os seguintes endpoints no backend:

#### 1. **POST /auth/login**
Faz login do usuário.

**Request:**
```json
{
  "email": "usuario@email.com",
  "senha": "senha123"
}
```

**Response (sucesso):**
```json
{
  "user": {
    "id": "123",
    "nome": "Nome do Usuário",
    "email": "usuario@email.com",
    "tipoPerfil": "gestante"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (erro):**
```json
{
  "message": "Email ou senha incorretos"
}
```

---

#### 2. **POST /auth/register**
Cadastra um novo usuário.

**Request:**
```json
{
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "senha": "senha123",
  "tipoPerfil": "gestante"
}
```

**Response (sucesso):**
```json
{
  "user": {
    "id": "123",
    "nome": "Nome do Usuário",
    "email": "usuario@email.com",
    "tipoPerfil": "gestante",
    "dataCriacao": "2025-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (erro):**
```json
{
  "message": "Email já cadastrado"
}
```

---

### Autenticação

O sistema usa **localStorage** para armazenar:
- `authToken` - Token JWT do backend
- `user` - Dados do usuário logado

Quando o usuário faz login/cadastro com sucesso, esses dados são salvos automaticamente.

---

## 📝 Código Comentado

Todo o código está **extensivamente comentado em português** para facilitar o aprendizado:

- **Componentes**: Explicação do que cada componente faz
- **Funções**: Documentação do propósito e parâmetros
- **Estados**: Descrição do que cada estado armazena
- **Validações**: Explicação de cada regra de validação

### Exemplo:
```typescript
/**
 * Função para fazer login
 * 
 * @param credentials - Email e senha do usuário
 * @returns Resposta com dados do usuário e token de autenticação
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // ... código
}
```

---

## 🎯 Funcionalidades Implementadas (v1.0)

- ✅ Tela de Login
  - Validação de email e senha
  - Integração com backend
  - Feedback de erros

- ✅ Tela de Cadastro
  - Validação de todos os campos
  - Seleção de tipo de perfil (Gestante/Acompanhante)
  - Verificação de senhas coincidentes

- ✅ Tela Home
  - Exibição de dados do usuário
  - Logout
  - Proteção de rota (redireciona para login se não autenticado)

- ✅ Design System
  - Cores pasteis do protótipo
  - Componentes reutilizáveis
  - Responsivo para mobile

- ✅ Configuração PWA
  - Manifest.json
  - Meta tags para mobile

- ✅ Configuração Capacitor
  - Pronto para build iOS/Android

---

## 🔜 Próximos Passos

Funcionalidades que podem ser adicionadas nas próximas versões:

1. **Plano de Parto**
   - Formulário guiado
   - Salvamento no backend
   - Geração de PDF

2. **Biblioteca de Conteúdos**
   - Artigos educativos
   - Vídeos
   - Busca

3. **Acompanhamento de Gestação**
   - Cálculo de semanas
   - Informações semanais
   - Data provável do parto

4. **Comunidade**
   - Fórum de discussão
   - Grupos de apoio

---

## 📚 Recursos para Aprendizado

### React
- [Documentação oficial do React](https://react.dev/)
- [Tutorial interativo](https://react.dev/learn)

### TypeScript
- [Documentação oficial](https://www.typescriptlang.org/docs/)
- [TypeScript para iniciantes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

### Capacitor
- [Documentação oficial](https://capacitorjs.com/docs)
- [Guia de início rápido](https://capacitorjs.com/docs/getting-started)

### Tailwind CSS
- [Documentação oficial](https://tailwindcss.com/docs)
- [Playground online](https://play.tailwindcss.com/)

---

## 🐛 Troubleshooting

### Erro: "Cannot find module..."
```bash
npm install
```

### Erro no build do Capacitor
```bash
npm run build
npx cap sync
```

### App não carrega no dispositivo
Verifique se a URL no `capacitor.config.ts` está correta e acessível.

---

## 📞 Suporte

Para dúvidas sobre:
- **React/TypeScript**: Consulte a documentação oficial
- **Capacitor**: Veja a documentação do Capacitor
- **Backend**: Entre em contato com o desenvolvedor do backend

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de planejamento de parto humanizado.
