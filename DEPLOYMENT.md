# Te-Grow Dashboard - Guia de Deploy em Produção

## 🚀 Deploy Strategies

### Opção 1: Deploy com Docker (Recomendado)

#### Em VPS/Servidor Linux

```bash
# 1. Instalar Docker e Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 2. Clonar repositório
git clone https://github.com/wanderleybiscaia-pixel/te-grow-dashboard.git
cd te-grow-dashboard
git checkout PROJETO-DASH

# 3. Configurar variáveis de ambiente
cat > backend/.env << EOF
OPENAI_API_KEY=sk-your-production-key
PORT=5000
NODE_ENV=production
DATABASE_URL=mongodb://mongo:27017/te-grow-dashboard
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRATION=7d
EOF

# 4. Iniciar serviços
docker-compose -f docker-compose.yml up -d

# 5. Verificar status
docker-compose ps
docker-compose logs -f backend
```

#### Com Nginx Reverse Proxy

```bash
# Instalar Nginx
sudo apt-get update
sudo apt-get install nginx certbot python3-certbot-nginx

# Criar configuração
sudo nano /etc/nginx/sites-available/te-grow-dashboard
```

```nginx
upstream backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;
    
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://backend/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (se necessário)
        add_header 'Access-Control-Allow-Origin' '$http_origin' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/te-grow-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Obter certificado SSL
sudo certbot certonly --nginx -d seu-dominio.com -d www.seu-dominio.com

# Auto-renovação
sudo systemctl enable certbot.timer
```

### Opção 2: Deploy em Heroku

```bash
# 1. Instalar Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# 2. Login
heroku login

# 3. Criar app
heroku create seu-app-name

# 4. Configurar variáveis
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
heroku config:set CORS_ORIGIN=https://seu-app-name.herokuapp.com
heroku config:set NODE_ENV=production

# 5. Deploy backend
cd backend
heroku create seu-app-name-backend --buildpack heroku/nodejs
git push heroku main

# 6. Deploy frontend (Vercel recomendado)
cd ../frontend
npm install -g vercel
vercel --prod
```

### Opção 3: Deploy em AWS

#### ECS (Elastic Container Service)

```bash
# 1. Push images para ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# 2. Build e push backend
cd backend
docker build -t te-grow-backend .
aws ecr create-repository --repository-name te-grow-backend --region us-east-1
docker tag te-grow-backend:latest ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/te-grow-backend:latest
docker push ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/te-grow-backend:latest

# 3. Build e push frontend
cd ../frontend
docker build -t te-grow-frontend .
aws ecr create-repository --repository-name te-grow-frontend --region us-east-1
docker tag te-grow-frontend:latest ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/te-grow-frontend:latest
docker push ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/te-grow-frontend:latest

# 4. Criar tarefa ECS (via AWS Console ou CLI)
# e depois iniciar serviço
```

## 🔒 Segurança em Produção

### Environment Variables

```bash
# NUNCA commitar .env em produção!
# Usar variáveis de ambiente do sistema

# No Linux/macOS
export OPENAI_API_KEY=sk-...
export DATABASE_URL=mongodb+srv://...
export JWT_SECRET=$(openssl rand -base64 32)

# No Docker
# Usar docker-compose.yml com referências a variáveis
```

### Database Security

```javascript
// Backend - Conexão MongoDB
const mongoURL = process.env.DATABASE_URL;

if (!mongoURL) {
  throw new Error('DATABASE_URL não configurada!');
}

// Sempre usar conexão segura (MongoDB Atlas com IP whitelist)
```

### API Security

```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requests por IP
});

app.use('/api/', limiter);

// Helmet para headers de segurança
const helmet = require('helmet');
app.use(helmet());
```

### SSL/TLS

- ✅ Sempre usar HTTPS em produção
- ✅ Obter certificado válido (Let's Encrypt gratuito)
- ✅ Configurar HSTS
- ✅ Usar TLS 1.2+

## 📊 Monitoring e Logging

### Logs Centralizados

```bash
# Docker - Visualizar logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo

# Com ELK Stack (Elasticsearch, Logstash, Kibana)
# Adicionar em docker-compose.yml
```

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Resposta esperada
{"status": "OK", "timestamp": "2024-01-01T00:00:00Z"}
```

### Alertas

- Configurar alertas de CPU/Memória
- Monitorar erro rates da API
- Verificar status do MongoDB
- Alertas de disco cheio

## 📈 Otimizações de Performance

### Backend

```javascript
// Compressão de responses
const compression = require('compression');
app.use(compression());

// Caching
const redis = require('redis');
const client = redis.createClient();

app.get('/api/documents', async (req, res) => {
  const cached = await client.get('documents');
  if (cached) return res.json(JSON.parse(cached));
  
  const data = await fetchDocuments();
  await client.setex('documents', 3600, JSON.stringify(data));
  res.json(data);
});

// Connection pooling MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
  maxPoolSize: 10,
  minPoolSize: 5
});
```

### Frontend

```javascript
// Code splitting
const UploadPage = lazy(() => import('./pages/UploadPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Image optimization
// Usar formatos modernos (WebP)
// Lazy loading de imagens

// Service Worker para offline
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

### Database

```javascript
// Indexes no MongoDB
db.documents.createIndex({ "createdAt": -1 });
db.documents.createIndex({ "fileName": "text" });
db.documents.createIndex({ "userId": 1 });
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ PROJETO-DASH ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and push Docker images
      run: |
        docker build -t backend:latest ./backend
        docker build -t frontend:latest ./frontend
        # Push to registry
        docker push backend:latest
        docker push frontend:latest
    
    - name: Deploy
      run: |
        ssh user@server 'cd /app && docker-compose pull && docker-compose up -d'
```

## 📋 Checklist de Deploy

### Antes do Deploy

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Database backup realizado
- [ ] SSL/TLS certificado válido
- [ ] Testes passando (`npm test`)
- [ ] Código revisado
- [ ] Documentação atualizada
- [ ] Plano de rollback preparado

### Durante o Deploy

- [ ] Maintenance mode ativado
- [ ] Migrations executadas
- [ ] Services iniciados na ordem correta
- [ ] Health checks passando
- [ ] Logs monitorados

### Após o Deploy

- [ ] Smoke tests executados
- [ ] Funcionalidades críticas testadas
- [ ] Performance monitorada
- [ ] Alertas configurados
- [ ] Rollback desabilitado (confirmando sucesso)
- [ ] Documentação atualizada

## 🚨 Plano de Rollback

```bash
# Manter versão anterior
git tag v1.0.0-prod

# Em caso de problema
git checkout v1.0.0-prod
docker-compose down
docker-compose up -d

# Restaurar database se necessário
mongodump --archive=backup-prod.archive
mongorestore --archive=backup-prod.archive
```

## 📞 Suporte e Monitoramento

### Serviços Recomendados

- **Monitoring**: Datadog, New Relic, or Prometheus
- **Logging**: ELK Stack, Loggly, or Papertrail
- **Uptime**: UptimeRobot, Pingdom
- **Analytics**: Google Analytics, Mixpanel
- **Error Tracking**: Sentry, Rollbar

### Escalabilidade

1. **Horizontal Scaling**
   - Load balancer (nginx, HAProxy)
   - Multiple backend instances
   - Shared database

2. **Vertical Scaling**
   - Aumentar recursos (CPU, RAM)
   - Otimizar queries
   - Cache strategy

3. **Database Scaling**
   - MongoDB Atlas sharding
   - Read replicas
   - Index optimization

## 💰 Custos Estimados

| Serviço | Custo Mensal |
|---------|-------------|
| VPS (2GB RAM) | $10-30 |
| MongoDB Atlas | $10-100+ |
| OpenAI API | $10-500+ |
| CDN | $5-50 |
| Monitoring | $0-50 |
| **Total** | **$35-730+** |

---

**Para mais informações, consulte [GUIA_COMPLETO.md](GUIA_COMPLETO.md)**
