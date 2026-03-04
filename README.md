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
> _(em desenvolvimento)_

### Não Implementadas
> _(em desenvolvimento)_

## Conexão com o Backend

O frontend consome a API REST em `VITE_API_URL`. Todas as rotas (exceto login e cadastro) exigem JWT no header `Authorization: Bearer <token>`.

| Role | Acesso |
|---|---|
| `ROLE_ADMIN` | Painel completo |
| `ROLE_USER` | Apenas "Meus Empréstimos" |
