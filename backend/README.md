
projeto-backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py                 # Ponto de entrada da aplicação
│   ├── database.py             # Configuração do banco de dados
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py          # Modelos Pydantic
│   ├── routes/
│   │   ├── __init__.py
│   │   └── users.py            # Rotas de exemplo
│   └── services/
│       ├── __init__.py
│       └── user_service.py     # Lógica de negócio
│
├── prisma/
│   ├── schema.prisma           # Schema do Prisma
│   └── migrations/             # Migrações (geradas automaticamente)
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py             # Configurações do pytest
│   └── test_users.py           # Testes de exemplo
│
├── requirements.txt            # Dependências do projeto
├── .env                        # Variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo git
└── README.md                   # Documentação do projeto