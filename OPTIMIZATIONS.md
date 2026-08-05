# Te-Grow Dashboard - Otimizações de Performance

## 🚀 Frontend Optimizations

### 1. Bundle Size Reduction

```bash
# Analisar bundle size
cd frontend
npm install --save-dev vite-plugin-visualizer
```

```javascript
// vite.config.js
import { visualizer } from 'vite-plugin-visualizer';

export default {
  plugins: [visualizer()]
};

// npm run build
// Abrirá stats.html mostrando tamanho de cada dependência
```

### 2. Code Splitting

```jsx
// App.jsx
import { Suspense, lazy } from 'react';
const UploadPage = lazy(() => import('./pages/UploadPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const DocumentDetailPage = lazy(() => import('./pages/DocumentDetailPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/documents/:id" element={<DocumentDetailPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 3. Image Optimization

```jsx
// Usar formatos modernos
function OptimizedImage() {
  return (
    <picture>
      <source srcSet="image.webp" type="image/webp" />
      <source srcSet="image.jpg" type="image/jpeg" />
      <img src="image.jpg" alt="Descrição" loading="lazy" />
    </picture>
  );
}
```

### 4. Memoization

```jsx
import { memo, useMemo, useCallback } from 'react';

// Memoizar componente
const DocumentCard = memo(({ document, onSelect }) => {
  return (
    <div onClick={() => onSelect(document.id)}>
      {document.fileName}
    </div>
  );
});

// Memoizar callback
function DocumentsPage() {
  const handleSelect = useCallback((id) => {
    navigate(`/documents/${id}`);
  }, [navigate]);

  // Memoizar dados
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => doc.isPublished);
  }, [documents]);

  return <DocumentList docs={filteredDocs} onSelect={handleSelect} />;
}
```

### 5. Virtual Scrolling

```jsx
// Para listas grandes, usar react-window
import { FixedSizeList } from 'react-window';

function DocumentList({ documents }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {documents[index].fileName}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={documents.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 6. Debouncing

```jsx
import { useCallback, useRef } from 'react';

function SearchDocuments() {
  const timeoutRef = useRef(null);
  
  const handleSearch = useCallback((query) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // Chamar API após 500ms de inatividade
      fetchDocuments(query);
    }, 500);
  }, []);

  return (
    <input
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Buscar documentos..."
    />
  );
}
```

## 🖥️ Backend Optimizations

### 1. Response Compression

```javascript
// backend/src/index.js
const compression = require('compression');

app.use(compression({
  level: 6,
  threshold: 1024 // Só comprimir respostas > 1KB
}));
```

### 2. Database Query Optimization

```javascript
// ❌ Ruim - N+1 query problem
const documents = await Document.find();
for (let doc of documents) {
  const insights = await Insight.find({ documentId: doc.id });
  doc.insights = insights;
}

// ✅ Bom - Usar populate ou batch queries
const documents = await Document.find()
  .populate('insights')
  .lean(); // Retornar plain objects (mais rápido)

// ✅ Melhor - Select apenas campos necessários
const documents = await Document.find()
  .select('id fileName mimeType createdAt')
  .limit(20)
  .sort({ createdAt: -1 });
```

### 3. Caching com Redis

```javascript
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

// Middleware de cache
const cacheMiddleware = (duration = 3600) => {
  return (req, res, next) => {
    const key = `${req.originalUrl}`;
    
    client.get(key, (err, data) => {
      if (err) throw err;
      
      if (data) {
        res.json(JSON.parse(data));
      } else {
        res.sendResponse = res.json;
        res.json = (body) => {
          client.setex(key, duration, JSON.stringify(body));
          res.sendResponse(body);
        };
        next();
      }
    });
  };
};

// Usar em rotas
router.get(
  '/documents',
  cacheMiddleware(3600),
  DocumentController.getAll
);
```

### 4. Connection Pooling

```javascript
// MongoDB
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000
});
```

### 5. Asynchronous Processing

```javascript
// Usar queue para tasks pesadas
const Queue = require('bull');
const analyzeQueue = new Queue('document-analysis', {
  redis: { host: '127.0.0.1', port: 6379 }
});

// Adicionar job
router.post('/upload', upload.single('file'), async (req, res) => {
  const job = await analyzeQueue.add({
    filePath: req.file.path,
    mimeType: req.file.mimetype
  });

  res.json({ jobId: job.id, status: 'queued' });
});

// Processar job
analyzeQueue.process(async (job) => {
  const data = await FileParserService.parseFile(
    job.data.filePath,
    job.data.mimeType
  );
  
  return await openaiService.analyzeDocument(data);
});
```

### 6. Index Optimization

```javascript
// MongoDB indexes
const documentSchema = new Schema({
  fileName: { type: String, index: true },
  createdAt: { type: Date, index: true },
  userId: { type: String, index: true },
  mimeType: { type: String, index: true }
});

// Text search index
documentSchema.index({ fileName: 'text', content: 'text' });

// Compound index para queries comuns
documentSchema.index({ userId: 1, createdAt: -1 });
```

## 📊 Monitoramento

### Application Performance Monitoring (APM)

```bash
# Instalar APM agent
npm install elastic-apm-node
```

```javascript
// backend/src/index.js (antes de outros imports)
const apm = require('elastic-apm-node');

apm.start({
  serviceName: 'te-grow-backend',
  serverUrl: 'https://apm.example.com:8200',
  environment: process.env.NODE_ENV
});

// Rastrear transações
app.use((req, res, next) => {
  const transaction = apm.startTransaction(`${req.method} ${req.path}`);
  res.on('finish', () => transaction.end());
  next();
});
```

### Métricas

```javascript
const prometheus = require('prom-client');

// Métrica de requisições
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route, res.statusCode)
      .observe(duration);
  });
  next();
});

// Expor métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

## 🧪 Benchmarking

```bash
# Testar performance com Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/documents

# Testar com wrk (mais realista)
wrk -t4 -c100 -d30s http://localhost:5000/api/documents

# Lighthouse para Frontend
npm install -g lighthouse
lighthouse https://localhost:3000
```

## 📈 Benchmark Targets

| Métrica | Target | Crítico |
|---------|--------|----------|
| Upload Document | < 5s | 10s |
| Load Documents | < 500ms | 2s |
| Get Chart Data | < 200ms | 1s |
| Render Dashboard | < 1s | 3s |
| API Response Time | < 100ms | 500ms |
| First Contentful Paint | < 1s | 3s |
| Time to Interactive | < 3s | 5s |

## 🔧 Configuração de Produção

```javascript
// backend/.env.production
NODE_ENV=production
PORT=5000
LOG_LEVEL=warn
CACHE_TTL=3600
MAX_UPLOAD_SIZE=50mb
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

```javascript
// Desabilitar features de desenvolvimento
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
  
  // Desabilitar morgan logging
  // Habilitar apenas para erros críticos
}
```

---

**Implementar essas otimizações pode resultar em:** 
- ⚡ 50-70% redução no tempo de carregamento
- 💰 Economia de 30-50% nos custos de infraestrutura
- 📈 Melhor user experience
- 🔒 Melhor segurança

**Revisar [DEPLOYMENT.md](DEPLOYMENT.md) para mais informações de produção.**
