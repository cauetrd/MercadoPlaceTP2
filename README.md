```bash
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
```

# Tutorial de como rodar o projeto completo

- Instale as dependências primárias
    - Python 3.12 ou superior
    - Node.Js

1. Para rodar o backend com prisma
Navegue até a pasta backend e execute:
*OBS: utilize um ambiente virtual (venv) para instalar as dependências do Python*
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
2. Para rodar o Prisma
Navegue até a pasta prisma e execute:
```bash
cd prisma
prisma generate
prisma migrate dev --name init
```
Supostamente, isso vai funcionar e o backend vai rodar

3. Para rodar os testes
Apenas execute:
```bash
pytest
```

4. Para rodar o frontend
Navegue até a pasta frontend e execute:
```bash
cd frontend
npm install
npm run dev
```