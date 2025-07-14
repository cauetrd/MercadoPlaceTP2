# MercadoPlace

## Como Rodar o Projeto

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm**
- **Git**

### 1. Clone o Repositório

```bash
git clone https://github.com/cauetrd/MercadoPlaceTP2
cd MercadoPlaceTP2
```

### 2. Configure o Backend

```bash
cd backend

npm install

npx prisma generate
npx prisma migrate dev

npx prisma db seed

npm run start:dev
```

O backend estará rodando em `http://localhost:3001`

### 3. Configure o Frontend

```bash
# Em um novo terminal, entre na pasta frontend
cd frontend

npm install

npm run dev
```

O frontend estará rodando em `http://localhost:3000`

## 🎯 Acesso Rápido

### URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Documentação API**: http://localhost:3001/api
- **Prisma Studio**: `npx prisma studio` (na pasta backend)

### Contas de Teste

| Tipo        | Email                  | Senha    | Descrição                  |
| ----------- | ---------------------- | -------- | -------------------------- |
| **Admin**   | admin@mercadoplace.com | admin123 | Acesso completo ao sistema |
| **Usuário** | maria.silva@email.com  | user123  | Usuário padrão             |
| **Usuário** | joao.santos@email.com  | user123  | Usuário padrão             |

## Comandos Úteis

### Backend

```bash
cd backend

# Desenvolvimento
npm run start:dev          # Servidor com hot reload
npm run build             # Build para produção
npm run start:prod        # Servidor de produção

# Banco de dados
npx prisma studio         # Interface visual do banco
npx prisma migrate reset  # Reset completo do banco
npx prisma db seed        # Repovoar com dados

# Testes
npm test                  # Testes unitários
npm run test:e2e         # Testes de integração
npm run test:cov         # Coverage dos testes
```

### Frontend

```bash
cd frontend

# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build para produção
npm run start           # Servidor de produção
npm run lint            # Verificar código
```

## Dados de Teste

O sistema vem populado com:

- **8 usuários** (1 admin + 7 usuários)
- **30+ produtos** em diversas categorias
- **10 mercados** com localizações
- **Preços variados** para comparação
- **Avaliações** e **histórico de compras**

## Tecnologias

### Backend

- **NestJS** - Framework Node.js
- **Prisma** - ORM type-safe
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação API

### Frontend

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Axios** - Requisições HTTP
