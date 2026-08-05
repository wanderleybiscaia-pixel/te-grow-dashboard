# Te-Grow Dashboard - Development Guide

## 🏗️ Arquitetura

### Backend Architecture

```
Cliente HTTP
    ↓
Router (Express)
    ↓
Middleware (CORS, validation, auth)
    ↓
Controller (Lógica de requisição)
    ↓
Service (Lógica de negócio)
    ↓
Database (MongoDB)
```

### Frontend Architecture

```
App (React Router)
    ↓
Pages (UploadPage, DashboardPage, etc)
    ↓
Components (Reusable UI)
    ↓
Stores (Zustand state management)
    ↓
Services (API calls)
    ↓
Backend API
```

## 🔄 Fluxo de Upload

```
1. Usuário seleciona arquivo (FileUpload component)
   ↓
2. POST /api/upload (multipart/form-data)
   ↓
3. Backend recebe arquivo
   ↓
4. Valida tipo MIME e tamanho
   ↓
5. Salva arquivo em /uploads
   ↓
6. Parse arquivo com FileParserService
   ↓
7. Envia para OpenAI com prompt customizado
   ↓
8. Recebe dados estruturados em JSON
   ↓
9. Gera insights com openaiService.generateInsights()
   ↓
10. Sugere gráficos com openaiService.suggestCharts()
   ↓
11. Salva documento no MongoDB
   ↓
12. Retorna resposta ao frontend
   ↓
13. Frontend redireciona para DocumentDetailPage
```

## 📊 Fluxo de Visualização de Gráficos

```
1. Usuário clica em um documento (DocumentsPage)
   ↓
2. Carrega DocumentDetailPage
   ↓
3. useDocumentStore.fetchDocument(id)
   ↓
4. Backend GET /api/documents/:id
   ↓
5. Retorna document com extractedData
   ↓
6. Frontend renderiza ChartSelector
   ↓
7. Usuário seleciona tipo de gráfico
   ↓
8. renderChart() monta o componente apropriado
   ↓
9. Recharts renderiza visualização
   ↓
10. Usuário pode editar dados
   ↓
11. PUT /api/documents/:id com novos dados
   ↓
12. Gráfico atualiza em tempo real
```

## 🧩 Componentes Principais

### Backend

#### FileParserService
- Detecta tipo de arquivo por MIME type
- Chama parser apropriado (pdf-parse, xlsx, xml2js, mammoth)
- Retorna conteúdo estruturado

```javascript
const content = await FileParserService.parseFile(filePath, mimeType);
// Returns: { text, pages, metadata, format }
```

#### OpenAIService
- Envia conteúdo para GPT-3.5-turbo
- Faz parsing de resposta JSON
- Gera insights e sugestões de gráficos

```javascript
const data = await openaiService.analyzeDocument(content, type);
const insights = await openaiService.generateInsights(data);
const charts = await openaiService.suggestCharts(data);
```

#### DocumentService
- CRUD de documentos
- Simula banco de dados em memória (usar MongoDB em produção)
- Gerencia relacionamentos

### Frontend

#### useDocumentStore (Zustand)
- Estado global de documentos
- Funções de fetch, update, delete
- Gerencia loading e erros

#### Charts Components
- BarChartComponent
- LineChartComponent
- PieChartComponent
- AreaChartComponent
- ScatterChartComponent
- RadarChartComponent

## 🔌 API Response Format

### Upload Response

```json
{
  "success": true,
  "message": "Arquivo uploadado e analisado com sucesso",
  "document": {
    "id": "uuid-123",
    "fileName": "documento.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1024000,
    "extractedData": { /* dados extraídos pela IA */ },
    "insights": { /* insights gerados */ },
    "chartSuggestions": { /* gráficos sugeridos */ },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Document Detail Response

```json
{
  "success": true,
  "document": {
    "id": "uuid-123",
    "fileName": "documento.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1024000,
    "extractedData": {},
    "insights": {},
    "chartSuggestions": {},
    "tags": [],
    "isPublished": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

## 🧪 Adicionar Nova Feature

### Exemplo: Novo tipo de gráfico

#### 1. Backend (Sugerir nos chartSuggestions)

Já está suportado! Só adicione o tipo na lista em `openaiService.js`:

```javascript
// Em openaiService.suggestCharts()
const prompt = `
  ...
  Tipos disponíveis: bar, line, pie, doughnut, area, scatter, bubble, radar, box, histogram, funnel, heatmap, SEU_NOVO_TIPO.
  ...
`;
```

#### 2. Frontend

**a) Adicionar componente em `components/Charts.jsx`:**

```javascript
function NovoGraficoComponent({ data, title }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        {/* Seu componente Recharts */}
      </ResponsiveContainer>
    </div>
  );
}
```

**b) Adicionar ao ChartSelector em `components/ChartSelector.jsx`:**

```javascript
const charts = [
  // ...
  { value: 'novografico', label: '🎨 Meu Novo Gráfico' },
  // ...
];
```

**c) Renderizar em `pages/DocumentDetailPage.jsx`:**

```javascript
const renderChart = () => {
  // ...
  case 'novografico':
    return <NovoGraficoComponent {...chartProps} />;
  // ...
};
```

## 🚀 Otimizações

### Performance

1. **Frontend**
   - Lazy loading de componentes
   - Memoização de props com React.memo
   - Debounce de eventos

2. **Backend**
   - Cache de responses
   - Paginação de listagens
   - Índices no MongoDB

3. **Geral**
   - Compressão gzip
   - CDN para assets estáticos
   - Minificação de código

### Security

1. Validação de MIME types
2. Limite de tamanho de arquivo
3. JWT para autenticação (não implementado, adicionar se necessário)
4. CORS configurado
5. Rate limiting (adicionar com express-rate-limit)

## 🔍 Debug

### Backend

```bash
# Verbose logging
NODE_DEBUG=* npm start

# Debugger
node --inspect src/index.js
# Acesse chrome://inspect

# Logs MongoDB
docker-compose logs -f mongo
```

### Frontend

```bash
# React DevTools
# Instale extensão Chrome

# Console
F12 > Console

# Network
F12 > Network > veja requisições para API

# Zustand DevTools
# Adicionar se necessário via middleware
```

## 📦 Dependências Principais

### Backend
- express: Framework web
- openai: Cliente OpenAI
- multer: Upload de arquivos
- mongodb: Banco de dados
- pdf-parse: Parsing de PDFs
- xlsx: Parsing de Excel
- xml2js: Parsing de XML
- mammoth: Parsing de Word

### Frontend
- react: UI library
- recharts: Gráficos
- tailwindcss: Estilos
- zustand: State management
- axios: HTTP client
- react-router: Routing
- framer-motion: Animações

## 🎓 Recursos de Aprendizado

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Patterns](https://react-patterns.com/)
- [Recharts Examples](https://recharts.org/examples)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [OpenAI Cookbook](https://github.com/openai/openai-cookbook)

---

**Última atualização**: 2026-08-05
**Versão**: 1.0.0
