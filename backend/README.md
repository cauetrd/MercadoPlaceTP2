# MercadoPlace API

API para sistema de marketplace de produtos com gerenciamento de usuários, produtos, mercados, lista de compras e avaliações.

## Autenticação & Autorização

- 🔐 Sistema de registro e login com JWT
- 🔑 Hash de senhas com bcrypt
- 👮‍♂️ Guards para proteção de rotas
- 🛡️ Controle de acesso Admin/Usuário

## Gestão de Usuários

- 👤 Perfil de usuário com localização
- ✏️ Edição de informações pessoais
- 🏆 Sistema de pontos para contribuições
- 📜 Histórico de compras completo

## Produtos

- 📦 CRUD completo de produtos
- ✅ Sistema de aprovação/reprovação (Admin)
- 🔍 Busca por nome
- 📊 Ordenação por preço e distância
- 💰 Histórico de preços automático
- 🎯 Verificação de duplicação por nome

## Mercados

- 🏪 CRUD de mercados (Admin)
- 📍 Busca por proximidade geográfica
- 🗺️ Associação com produtos
- ⭐ Sistema de avaliações

## Lista de Compras

- 🛒 Adicionar/remover produtos
- 🔢 Alterar quantidades
- ✅ Seleção de itens para compra
- 💳 Finalização de compras
- 🧮 Cálculo de totais

## Avaliações

- ⭐ Avaliação de mercados (1-5 estrelas)
- 💬 Comentários opcionais
- 📊 Cálculo de média automático
- 🚫 Uma avaliação por usuário/mercado

## 🏗️ Arquitetura & Qualidade

## Estrutura do Projeto

```bash
src/
├── auth/           # Autenticação JWT
├── users/          # Gestão de usuários
├── products/       # Gestão de produtos
├── markets/        # Gestão de mercados
├── shopping-list/  # Lista de compras
├── reviews/        # Avaliações
└── prisma/         # Configuração de banco
```

## Tecnologias Utilizadas

- ⚡ NestJS - Framework robusto
- 🗄️ Prisma - ORM type-safe
- 🔐 JWT - Autenticação segura
- 📚 Swagger - Documentação automática
- 🧪 Jest - Testes automatizados
- 💾 SQLite - Banco de dados

## Testes Implementados

- ✅ 37 testes unitários passando
- ✅ 10 testes E2E passando
- 🔬 Coverage de serviços principais
- 🚀 Testes de integração completos
- 📊 Dados de Exemplo

## O sistema vem populado com:

- 👨‍💼 Admin: admin@mercadoplace.com (senha: admin123)
- 👤 Usuário: user@mercadoplace.com (senha: user123)
- 🏪 3 mercados com localizações reais
- 📦 6 produtos (5 aprovados, 1 pendente)
- ⭐ 2 avaliações de exemplo
- 🛒 Lista de compras com itens
- 📈 Histórico de compras completo

## 🚀 Como Iniciar

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

Acesse:

- 🌐 API: http://localhost:3001
- 📖 Swagger: http://localhost:3001/api
- 🔍 Prisma Studio: npx prisma studio

## 🧪 Executar Testes

```bash
npm test              # Testes unitários
npm run test:e2e      # Testes E2E
npm run test:cov      # Coverage
```

## 📋 Histórias de Usuário - Status

### Usuário Regular:

<input checked="" disabled="" type="checkbox"> Login/cadastro  
<input checked="" disabled="" type="checkbox"> Ver produtos e ordenar por preço/distância  
<input checked="" disabled="" type="checkbox"> Adicionar/remover itens da lista  
<input checked="" disabled="" type="checkbox"> Reiniciar lista de compras  
<input checked="" disabled="" type="checkbox"> Ver informações dos produtos  
<input checked="" disabled="" type="checkbox"> Atualizar informações de produtos (+1 ponto)  
<input checked="" disabled="" type="checkbox"> Ver compras anteriores  
<input checked="" disabled="" type="checkbox"> Cadastrar novos produtos (+1 ponto)  
<input checked="" disabled="" type="checkbox"> Escrever reviews de lojas  
<input checked="" disabled="" type="checkbox"> Editar perfil  
<input checked="" disabled="" type="checkbox"> Buscar produtos por nome  
<input checked="" disabled="" type="checkbox"> Ver detalhes de mercados  
<input checked="" disabled="" type="checkbox"> Ver produtos de mercado específico

### Administrador:

<input checked="" disabled="" type="checkbox"> Ver produtos pendentes  
<input checked="" disabled="" type="checkbox"> Aprovar/reprovar produtos  
<input checked="" disabled="" type="checkbox"> Cadastrar lojas  
<input checked="" disabled="" type="checkbox"> Editar produtos/mercados  
<input checked="" disabled="" type="checkbox"> Remover mercados/produtos

## 🔧 Recursos Especiais

- 🎯 Validação automática de dados
- 🔒 Segurança JWT robusta
- 📍 Cálculo de distância geográfica
- 💎 TypeScript 100%
- 📖 Documentação Swagger completa
- 🎨 DTOs tipados para todas as operações
- 🚨 Tratamento de erros consistente
