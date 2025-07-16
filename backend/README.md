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
- 🔢 Adicionar múltiplos produtos
- 📊 Comparar preços entre mercados
- 🧮 Cálculo de subtotais por mercado
- 🎯 Ordenação por preço e distância
- 🗑️ Limpar lista completa

## Compras

- 💳 Registrar compras com múltiplos itens
- 📅 Data customizada de compra
- 📊 Estatísticas de compras por usuário
- 🔍 Histórico completo de compras
- ✏️ Edição de compras (Admin)
- 🗑️ Exclusão de compras (Admin)

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
├── shopping-list/  # Lista de compras e comparação
├── purchase/       # Gestão de compras
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

- ✅ 65+ testes unitários passando
- ✅ 25+ testes E2E passando
- 🔬 Coverage completo de todos os serviços
- 🚀 Testes de integração abrangentes
- 📊 Dados de Exemplo

## O sistema vem populado com:

- 👨‍💼 Admin: admin@mercadoplace.com (senha: admin123)
- 👤 8 usuários diversos com localizações
- 🏪 10 mercados com localizações reais
- 📦 32 produtos variados (90% aprovados)
- ⭐ Avaliações distribuídas entre mercados
- 🛒 Listas de compras populadas
- 📈 Histórico extenso de compras

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
npm run test:watch    # Modo watch
```

## 📋 Histórias de Usuário - Status

### Usuário Regular:

<input checked="" disabled="" type="checkbox"> Login/cadastro  
<input checked="" disabled="" type="checkbox"> Ver produtos e ordenar por preço/distância  
<input checked="" disabled="" type="checkbox"> Adicionar/remover itens da lista  
<input checked="" disabled="" type="checkbox"> Adicionar múltiplos itens à lista  
<input checked="" disabled="" type="checkbox"> Comparar preços entre mercados  
<input checked="" disabled="" type="checkbox"> Reiniciar lista de compras  
<input checked="" disabled="" type="checkbox"> Registrar compras realizadas  
<input checked="" disabled="" type="checkbox"> Ver histórico de compras  
<input checked="" disabled="" type="checkbox"> Ver estatísticas pessoais  
<input checked="" disabled="" type="checkbox"> Ver informações dos produtos  
<input checked="" disabled="" type="checkbox"> Atualizar informações de produtos (+1 ponto)  
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
<input checked="" disabled="" type="checkbox"> Ver todas as compras  
<input checked="" disabled="" type="checkbox"> Editar compras de usuários  
<input checked="" disabled="" type="checkbox"> Remover compras  
<input checked="" disabled="" type="checkbox"> Ver estatísticas globais

## 🔧 Recursos Especiais

- 🎯 Validação automática de dados
- 🔒 Segurança JWT robusta
- 📍 Cálculo de distância geográfica
- 🧮 Comparação inteligente de preços
- 💎 TypeScript 100%
- 📖 Documentação Swagger completa
- 🎨 DTOs tipados para todas as operações
- 🚨 Tratamento de erros consistente
- 📊 Sistema de pontuação por contribuições
- 🔄 Transações de banco de dados seguras
