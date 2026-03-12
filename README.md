# LibraManager — Frontend

Sistema de Gerenciamento de Empréstimos de Livros.

## Stack

- React 18 + Vite + TypeScript
- TailwindCSS
- React Router DOM v6
- Axios
- React Hook Form + Zod

## Arquitetura

Clean Architecture + DDD Modular, organizada por domínios de negócio:

```
src/
├── modules/          # Domínios: auth, books, authors, categories, users, loans
│   └── [modulo]/
│       ├── domain/          # Entidades e interfaces de repositório
│       ├── application/     # Use cases e DTOs
│       ├── infrastructure/  # Implementações HTTP (axios)
│       └── presentation/    # Páginas e hooks React
├── shared/           # UI components, layout, httpClient, AuthContext
└── router/           # Rotas + PrivateRoute + AdminRoute
```

## Gitflow

| Branch | Propósito |
|---|---|
| `main` | Produção estável |
| `develop` | Integração de features |
| `feature/*` | Novas funcionalidades |
| `fix/*` | Correções de bugs |
| `release/*` | Preparação de release |

## Como Rodar

### Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:3333`

### Instalação

```bash
npm install
```

### Ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3333
```

### Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

## Funcionalidades

### Implementadas
- [x] **Autenticação**: Login, Registro (com confirmação de senha) e logout com persistência via JWT.
- [x] **Dashboard**: Indicadores em tempo real (Livros, Usuários, Empréstimos Ativos/Atrasados) e lista de atividades recentes.
- [x] **Livros**: CRUD completo com listagem refinada, busca e filtros por categoria/status.
- [x] **Autores**: CRUD completo integrado com livros.
- [x] **Categorias**: CRUD completo com integração na listagem de livros.
- [x] **Cadastro de Livro**: Campo de ano limitado a 4 dígitos.
- [x] **Perfil do Usuário**: Menu de usuário com dropdown de ações.

### Módulo de Empréstimos & Histórico
- **Leitor**: Acesso somente a “Meus Empréstimos” e “Novo Empréstimo” (autoatendido).
- **Registro com Preview**: Novo layout em duas colunas com pré-visualização em tempo real do livro e resumo dos dados antes da confirmação.
- **Detalhes do Livro**: Visualização rápida de ano, editora, páginas e sinopse ao selecionar o livro.
- **Cálculo Automático**: Data de devolução sugerida automaticamente para 14 dias.
- **Indicadores de Atraso**: Destaque visual e contagem de dias para livros em atraso.

## Responsividade
A aplicação foi otimizada para diferentes tamanhos de tela:
- **Desktop (> 1024px)**: Sidebar fixa e visualização completa de dados.
- **Tablet (768px - 1024px)**: Sidebar retrátil e grids adaptados.
- **Mobile (< 768px)**: Menu hamburger, layouts de coluna única e inputs otimizados para touch.

### Não Implementadas / Próximos Passos
- [ ] **Testes de Integração**: Expandir cobertura de testes para fluxos de ponta a ponta no frontend.
- [ ] **Notificações**: Alertas em tempo real para devoluções próximas ou atrasadas.
- [ ] **Relatórios Avançados**: Exportação de dados em PDF/Excel.

## Conexão com o Backend

O frontend consome a API REST em `VITE_API_URL`. Todas as rotas (exceto login e cadastro) exigem JWT no header `Authorization: Bearer <token>`.

| Role | Acesso |
|---|---|
| `ROLE_ADMIN` | Painel completo |
| `ROLE_USER` | Apenas “Meus Empréstimos” e “Novo Empréstimo” |