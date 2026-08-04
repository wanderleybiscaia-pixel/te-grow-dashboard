# Doc → Dashboard (Streamlit prototype)

Este projeto contém um protótipo em Python + Streamlit para ler documentos (PDF, DOCX, XLSX, PPTX), extrair texto e tabelas, usar a API da OpenAI para estruturar/semantizar dados e gerar dashboards editáveis com Plotly, persistindo fontes em SQLite.

Principais arquivos adicionados (branch feature/streamlit-dashboard):
- requirements.txt
- .env.example
- README.md
- app/streamlit_app.py
- app/document_parsers.py
- app/openai_client.py
- app/visualization.py
- app/storage.py
- data/.gitkeep
- scripts/setup_windows.ps1
- Dockerfile

Instalação (Windows + VS Code)
1. Clone o repositório e troque para a branch:
   - git clone https://github.com/wanderleybiscaia-pixel/te-grow-dashboard.git
   - cd te-grow-dashboard
   - git checkout feature/streamlit-dashboard

2. Criar e ativar virtualenv (PowerShell):
   - python -m venv .venv
   - .\.venv\Scripts\Activate.ps1

3. Instalar dependências:
   - pip install -r requirements.txt

4. Copiar e editar variáveis de ambiente:
   - copy .env.example .env
   - editar .env e inserir OPENAI_API_KEY

5. Executar app:
   - streamlit run app/streamlit_app.py --server.port 8501

Executando com Docker (opcional)
- Dockerfile incluído para build rápido; se deseja, posso adicionar docker-compose.

Segurança e custos
- O app só envia trechos selecionados para a OpenAI por padrão; monitore o uso da API.
- Não coloque chaves reais em commits. Use .env (já no .gitignore).

Próximos passos
- Teste localmente e me diga se quer que eu ajuste os prompts, limite de tokens, ou adicione busca semântica/embeddings e interface avançada de edição de gráficos.
