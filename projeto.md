# Projeto de disciplina

1. integrantes do grupo  
   Rafael Dias Ghiorzi - 232006144  
   Bernardo Vilar - 232009487  
   Fernando Lovato - 232037641  
   Lucca Schoen - 231018900  
   Cauê Trindade - 231019003  
   Israel Honório- 231003498  
   Repositório no github: https://github.com/cauetrd/MercadoPlaceTP2.git

2. História de usuário iniciais

- Como usuário, quero criar e editar uma lista de compras para planejar melhor minhas compras.
- Como usuário, quero buscar e adicionar produtos à minha lista de compras para facilitar a seleção.
- Como usuário, quero ver sugestões de produtos com base em listas anteriores para agilizar a criação da lista.
- Como usuário, quero visualizar uma estimativa de preço da minha lista com base em preços compartilhados por outros usuários.
- Como usuário, quero compartilhar o preço que paguei por um produto para ajudar outros usuários.
- Como usuário, quero visualizar os preços compartilhados por outros usuários com data e confiabilidade.
- Como usuário, quero escanear o código de barras de um produto para adicioná-lo rapidamente à lista.
- Como usuário, quero usar a localização para encontrar supermercados próximos e comparar preços.
- Como usuário, quero marcar produtos como "comprados" enquanto faço compras para me organizar melhor.
- Como usuário, quero conferir se o preço no caixa é igual ao que foi exibido anteriormente para evitar erros.
- Como usuário, quero visualizar a localização do produto dentro do supermercado, se disponível.
- Como usuário, quero reconhecer produtos por imagem para facilitar a adição de itens à lista.
- Como usuário, quero receber incentivos ao compartilhar preços para me motivar a contribuir com a comunidade.
- Como usuário, quero importar listas anteriores para criar novas listas com mais rapidez.
- Como administrador, quero aprovar ou editar produtos sugeridos por usuários para manter a qualidade dos dados.
- Como administrador, quero garantir a consistência da base de dados de produtos evitando duplicidades.

3. Linguagens a serem utilizadas

- Para o Backend, TypeScript com Node.js
- Para o Frontend, TypeScript com React/Next.js

  3.1. Padrão de codificação

- TypeScript: Seguindo ESLint + Prettier com configurações do NestJS e Next.js
- Uso de decoradores para validação com class-validator e class-transformer

  3.2 Verificador de padrão de codificação (formatter)

- ESLint para verificação de código
- Prettier para formatação automática
- Configurado para TypeScript em ambos frontend e backend

4. Framework de teste

- Jest para testes unitários e de integração no backend
- Supertest para testes de API endpoints
- Frontend utiliza Jest integrado com Next.js

5. Bibliotecas e Frameworks a serem utilizados

Backend (NestJS):

- NestJS como framework principal para API REST
- Prisma ORM para comunicação com banco de dados
- SQLite como banco de dados
- Swagger UI (@nestjs/swagger) para documentação automática das rotas
- JWT (@nestjs/jwt) para autenticação
- Passport (@nestjs/passport) para estratégias de autenticação
- bcrypt para hash de senhas
- class-validator e class-transformer para validação de dados
- Jest para framework de testes
- cookie-parser para gerenciamento de cookies

Frontend (Next.js):

- Next.js como framework para desenvolvimento web
- React como biblioteca base
- TailwindCSS para estilização
- TypeScript para tipagem estática
- Axios ou fetch para comunicação com backend

6. Verificador estático de código

- TypeScript compiler para verificação de tipos
- ESLint com reglas específicas para NestJS e Next.js
- class-validator para validação de entrada de dados
- Prettier para formatação consistente

7. Sites para controle de versões e Scrum/Kanban

- Git e GitHub (para versionamento de código)
- Asana (para kanban)
- Discord (para reuniões e comunicação)

8. Verificador de cobertura

- Jest com coverage integrado para ambos frontend e backend
- Configuração de cobertura no package.json

9. Ferramenta de documentação

- Backend: Swagger UI integrado com NestJS (@nestjs/swagger)
- Frontend: Documentação com README e comentários

10. Estrutura do Projeto

Backend (NestJS):

- Módulos organizados por funcionalidade (auth, users, products, markets, etc.)
- DTOs para validação de entrada e saída
- Guards para autenticação e autorização
- Interceptors para transformação de dados
- Services para lógica de negócio
- Controllers para endpoints da API
- Prisma para ORM e migrações de banco

Frontend:

- Estrutura Next.js com App Router
- Componentes reutilizáveis
- Hooks customizados para estado
- Integração com API do backend

11. Funcionalidades Implementadas

Autenticação:

- Sistema de login/registro com JWT
- Proteção de rotas com guards
- Middleware de autenticação

Gestão de Usuários:

- CRUD completo de usuários
- Sistema de pontos/gamificação
- Perfis de usuário com localização

Produtos e Mercados:

- Catálogo de produtos com imagens
- Mercados com localização geográfica
- Relacionamento produtos-mercados com preços

Lista de Compras:

- Criação e gerenciamento de listas
- Comparação de preços entre mercados
- Sistema de sugestões

Histórico de Compras:

- Registro de compras realizadas
- Produtos comprados com preços e mercados
- Relatórios de gastos

Avaliações:

- Sistema de avaliação de mercados
- Comentários e ratings

Processo de desenvolvimento:

- especificar os módulos
- especificar as funções
- revisar especificações
- projetar
- fazer diagramas
- revisar projetos
- codificar módulo
- revisar código do módulo
- redigir casos de teste
- realizar os testes
- instrumentar verificando a cobertura
- documentar
