# Te-Grow Dashboard - Sistema Inteligente de Upload e Análise de Documentos

## 📋 Descrição

Sistema avançado para upload de documentos (PDF, XML, XLS, PowerPoint, Word) com extração inteligente de dados via OpenAI API e visualização em dashboard interativo com múltiplas opções de gráficos.

## 🎯 Funcionalidades Principais

### Backend
- ✅ Upload de múltiplos formatos (PDF, XML, XLS, XLSX, PPT, PPTX, DOC, DOCX)
- ✅ Extração inteligente de dados com OpenAI API
- ✅ Análise e estruturação de informações
- ✅ API RESTful para integração frontend
- ✅ Armazenamento seguro de documentos e dados extraídos

### Frontend
- ✅ Interface moderna e responsiva
- ✅ 10+ tipos de gráficos interativos
- ✅ Edição em tempo real de dados
- ✅ Alteração dinâmica de gráficos
- ✅ Filtros e buscas avançadas
- ✅ Exportação de dados
- ✅ Dashboard customizável

## 📊 Tipos de Gráficos Disponíveis

1. **Gráfico de Barras** - Comparação de valores
2. **Gráfico de Linhas** - Tendências ao longo do tempo
3. **Gráfico de Pizza** - Distribuição percentual
4. **Gráfico de Rosca** - Distribuição em anel
5. **Gráfico de Área** - Visualização de preenchimento
6. **Gráfico de Dispersão** - Relação entre duas variáveis
7. **Gráfico de Bolhas** - Três dimensões de dados
8. **Gráfico de Radar** - Múltiplas dimensões
9. **Gráfico de Caixa** - Distribuição estatística
10. **Gráfico de Histograma** - Frequência de dados
11. **Gráfico de Funil** - Progresso em etapas
12. **Mapa de Calor** - Intensidade em matriz

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** + Express.js
- **Python** (alternativa para processamento)
- **OpenAI API**
- **Multer** - Upload de arquivos
- **pdf-parse, xlsx, xml2js** - Parsing de documentos
- **MongoDB/PostgreSQL** - Banco de dados

### Frontend
- **React.js** / **Vue.js**
- **Chart.js** / **Recharts** - Biblioteca de gráficos
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilização

## 📁 Estrutura de Diretórios

```
te-grow-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.js
│   ├── uploads/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── docs/
└── README.md
```

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- Chave OpenAI API

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure suas variáveis de ambiente
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔐 Variáveis de Ambiente

```env
# Backend
OPENAI_API_KEY=your_key_here
DATABASE_URL=your_db_url
PORT=5000
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

## 📖 API Endpoints

- `POST /api/upload` - Upload de documentos
- `GET /api/documents` - Listar documentos
- `GET /api/documents/:id` - Obter detalhes do documento
- `PUT /api/documents/:id` - Atualizar dados extraídos
- `DELETE /api/documents/:id` - Deletar documento
- `GET /api/dashboard` - Dados do dashboard

## 📝 Licença

MIT

## 👤 Autor

wanderleybiscaia-pixel

---

**Status do Projeto**: 🚀 Em Desenvolvimento
