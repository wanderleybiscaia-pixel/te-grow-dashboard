require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
const documentRoutes = require('./routes/documentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Verificar se OPENAI_API_KEY está configurada
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
  console.warn('⚠️  AVISO: OPENAI_API_KEY não está configurada!');
  console.warn('ℹ️  Configure a variável de ambiente OPENAI_API_KEY antes de usar o sistema');
  console.warn('ℹ️  Obtenha em: https://platform.openai.com/account/api-keys');
}

// Middlewares
// Support multiple origins provided via CORS_ORIGIN env var (comma-separated)
// and echo back only the single allowed origin per request.
const rawCorsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
let whitelist = [];
if (rawCorsOrigin && rawCorsOrigin.trim() !== '') {
  whitelist = rawCorsOrigin.split(',').map(s => s.trim());
}

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (e.g. curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    // allow if origin is in whitelist
    if (whitelist.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Criar diretório de uploads se não existir
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handler
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado em http://localhost:${PORT}`);
  console.log(`📊 Dashboard API rodando`);
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
    console.log(`🤖 OpenAI Integration habilitada`);
  } else {
    console.warn(`⚠️  OpenAI Integration DESABILITADA - Configure OPENAI_API_KEY`);
  }
});

module.exports = app;
