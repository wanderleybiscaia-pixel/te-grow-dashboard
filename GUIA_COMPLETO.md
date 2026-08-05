# Te-Grow Dashboard - Sistema de Upload e Análise de Documentos com IA

![Status](https://img.shields.io/badge/status-development-yellow)
![Node](https://img.shields.io/badge/node-18+-green)
![React](https://img.shields.io/badge/react-18+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Sobre o Projeto

Te-Grow Dashboard é um sistema avançado para upload, processamento e análise inteligente de documentos (PDF, Excel, XML, PowerPoint, Word) utilizando OpenAI API. O sistema extrai automaticamente dados relevantes e apresenta visualizações interativas em um dashboard moderno com 12+ tipos de gráficos.

## 🎯 Funcionalidades Principais

### 📁 Upload e Processamento
- ✅ Suporte para múltiplos formatos (PDF, XLS, XLSX, XML, PPT, PPTX, DOC, DOCX)
- ✅ Upload único ou em lote
- ✅ Interface drag-and-drop intuitiva
- ✅ Limite de 50MB por arquivo
- ✅ Processamento automático com IA

### 🤖 Análise com OpenAI
- ✅ Extração inteligente de dados
- ✅ Geração automática de insights
- ✅ Sugestões de tipos de gráficos mais adequados
- ✅ Estruturação automática de informações

### 📊 Dashboard Interativo
- ✅ 12+ tipos de gráficos (barras, linhas, pizza, rosca, área, dispersão, bolhas, radar, caixa, histograma, funil, mapa de calor)
- ✅ Seleção dinâmica de gráficos
- ✅ Edição em tempo real de dados
- ✅ Filtros e buscas avançadas
- ✅ Exportação de dados
- ✅ Interface responsiva e moderna

### 📈 Gerenciamento de Documentos
- ✅ Listagem e visualização de documentos
- ✅ Edição de dados extraídos
- ✅ Exclusão de documentos
- ✅ Tags e categorização
- ✅ Histórico de uploads

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** 18+ + Express.js
- **OpenAI API** - Análise inteligente de documentos
- **Multer** - Upload de arquivos
- **MongoDB** - Banco de dados
- **pdf-parse** - Processamento de PDFs
- **xlsx** - Processamento de Excel
- **xml2js** - Processamento de XML
- **mammoth** - Processamento de Word

### Frontend
- **React** 18+ - Interface de usuário
- **Vite** - Build tool ultra-rápido
- **Recharts** - Visualização de dados
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **React Router** - Navegação
- **Axios** - Cliente HTTP
- **Framer Motion** - Animações

### Infraestrutura
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Reverse proxy

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker e Docker Compose (opcional, para containerização)
- Chave de API OpenAI ([obter em openai.com](https://platform.openai.com/api-keys))

## 🚀 Instalação e Configuração

### Opção 1: Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/wanderleybiscaia-pixel/te-grow-dashboard.git
cd te-grow-dashboard

# Configure as variáveis de ambiente
cp backend/.env.example backend/.env
# Edite backend/.env e adicione sua OPENAI_API_KEY

# Inicie os serviços
docker-compose up -d

# Acesse a aplicação
# Frontend: http://localhost
# Backend API: http://localhost:5000/api
# MongoDB: localhost:27017
```

### Opção 2: Instalação Local

#### Backend

```bash
cd backend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env e adicione sua OPENAI_API_KEY

# Inicie o servidor
npm run dev  # desenvolvimento
npm start    # produção
```

#### Frontend

```bash
cd frontend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env se necessário (padrão: http://localhost:5000/api)

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse em http://localhost:5173
```

## 🔐 Configuração de Variáveis de Ambiente

### Backend (.env)

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/te-grow-dashboard

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=7d
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📖 Endpoints da API

### Upload
- `POST /api/upload` - Upload de arquivo único
- `POST /api/upload/batch` - Upload de múltiplos arquivos

### Documentos
- `GET /api/documents` - Listar todos os documentos
- `GET /api/documents/:id` - Obter detalhes do documento
- `PUT /api/documents/:id` - Atualizar documento
- `DELETE /api/documents/:id` - Deletar documento

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas gerais
- `GET /api/dashboard/data` - Dados do dashboard
- `GET /api/dashboard/charts` - Dados para gráficos

### Health
- `GET /health` - Verificar status do servidor

## 📊 Tipos de Gráficos Disponíveis

1. **📊 Gráfico de Barras** - Comparação de valores
2. **📈 Gráfico de Linhas** - Tendências ao longo do tempo
3. **🥧 Gráfico de Pizza** - Distribuição percentual
4. **🍩 Gráfico de Rosca** - Distribuição em anel
5. **📉 Gráfico de Área** - Visualização de preenchimento
6. **✨ Gráfico de Dispersão** - Relação entre duas variáveis
7. **🧪 Gráfico de Bolhas** - Três dimensões de dados
8. **🎯 Gráfico de Radar** - Múltiplas dimensões
9. **📦 Gráfico de Caixa** - Distribuição estatística
10. **📊 Histograma** - Frequência de dados
11. **🔻 Gráfico de Funil** - Progresso em etapas
12. **🔥 Mapa de Calor** - Intensidade em matriz

## 💡 Como Usar

### 1. Fazer Upload de Documento

1. Acesse a página inicial
2. Arraste um arquivo ou clique para selecionar
3. Aguarde o processamento pela IA
4. Receba automaticamente:
   - Dados extraídos estruturados
   - Insights gerados pela IA
   - Sugestões de gráficos

### 2. Visualizar Dashboard

1. Acesse a seção "Dashboard"
2. Visualize estatísticas gerais
3. Veja gráficos agregados
4. Analise uploads recentes

### 3. Gerenciar Documentos

1. Acesse "Meus Documentos"
2. Visualize todos os documentos processados
3. Clique em um documento para ver detalhes
4. Edite dados extraídos conforme necessário
5. Mude o tipo de gráfico em tempo real

### 4. Editar Dados

1. Abra um documento
2. Clique em "Editar"
3. Modifique os dados conforme necessário
4. Clique em "Salvar Mudanças"
5. Gráficos atualizarão automaticamente

## 📁 Estrutura do Projeto

```
te-grow-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Controladores de requisições
│   │   │   ├── uploadController.js
│   │   │   ├── documentController.js
│   │   │   └── dashboardController.js
│   │   ├── services/            # Lógica de negócio
│   │   │   ├── fileParserService.js
│   │   │   ├── openaiService.js
│   │   │   └── documentService.js
│   │   ├── routes/              # Definição de rotas
│   │   │   ├── uploadRoutes.js
│   │   │   ├── documentRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── middleware/          # Middlewares
│   │   │   ├── errorHandler.js
│   │   │   ├── uploadMiddleware.js
│   │   │   └── validation.js
│   │   ├── utils/               # Utilidades
│   │   └── index.js             # Entrada do servidor
│   ├── uploads/                 # Diretório de arquivos
│   ├── .env.example             # Variáveis de exemplo
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── Navigation.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── Charts.jsx
│   │   │   └── ChartSelector.jsx
│   │   ├── pages/               # Páginas da aplicação
│   │   │   ├── UploadPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── DocumentsPage.jsx
│   │   │   └── DocumentDetailPage.jsx
│   │   ├── services/            # Serviços de API
│   │   │   └── api.js
│   │   ├── store/               # Gerenciamento de estado
│   │   │   └── documentStore.js
│   │   ├── hooks/               # Custom hooks
│   │   │   └── useChartData.js
│   │   ├── App.jsx              # Componente principal
│   │   ├── index.jsx            # Entrada da aplicação
│   │   └── index.css            # Estilos globais
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   └── README.md
├── docker-compose.yml           # Orquestração de containers
├── README.md                    # Este arquivo
└── .gitignore
```

## 🧪 Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## 📦 Build para Produção

### Backend

```bash
cd backend
npm run build  # se disponível
```

### Frontend

```bash
cd frontend
npm run build
# Os arquivos compilados estarão em frontend/dist/
```

## 🐛 Troubleshooting

### Erro: "OPENAI_API_KEY não definida"

```bash
# Certifique-se de que você:
# 1. Copiou .env.example para .env
# 2. Adicionou sua chave de API válida
# 3. Reiniciou o servidor
```

### Erro: "Conexão com MongoDB recusada"

```bash
# Se usando Docker Compose:
docker-compose logs mongo
docker-compose restart mongo

# Se usando MongoDB local:
# Certifique-se de que o MongoDB está rodando
mongodb --version
```

### Erro: "CORS error"

```bash
# Atualize a variável CORS_ORIGIN em backend/.env
CORS_ORIGIN=http://seu-dominio.com,http://localhost:3000
```

## 🚀 Deploy

### Heroku

```bash
heroku login
heroku create seu-app-name
heroku config:set OPENAI_API_KEY=sk-...
git push heroku main
```

### Vercel (Frontend)

```bash
cd frontend
npm install -g vercel
vercel
```

### AWS, Google Cloud, Azure

Consulte a documentação de Docker para deployar containers em nuvem.

## 📚 Documentação Adicional

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker Documentation](https://docs.docker.com/)

## 📝 Licença

MIT License - sinta-se livre para usar este projeto

## 👥 Contribuições

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🆘 Suporte

Tem dúvidas ou encontrou um bug? Abra uma [issue](https://github.com/wanderleybiscaia-pixel/te-grow-dashboard/issues) no GitHub.

## 👨‍💻 Autor

**wanderleybiscaia-pixel**
- GitHub: [@wanderleybiscaia-pixel](https://github.com/wanderleybiscaia-pixel)

## 🙏 Agradecimentos

- OpenAI pela poderosa API de IA
- Comunidade React
- Comunidade Node.js
- Todos os contribuidores

---

<div align="center">

### ⭐ Se este projeto foi útil, considere dar uma estrela! ⭐

**Te-Grow Dashboard** - Transformando documentos em insights inteligentes 🚀

</div>
