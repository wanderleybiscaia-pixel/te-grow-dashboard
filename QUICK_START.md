# Te-Grow Dashboard - Guia Rápido de Início

## ⚡ Quick Start (5 minutos)

### 1. Pré-requisitos

```bash
# Verificar versão do Node
node --version  # deve ser 18+
npm --version
```

### 2. Clonar Repositório

```bash
git clone https://github.com/wanderleybiscaia-pixel/te-grow-dashboard.git
cd te-grow-dashboard
git checkout PROJETO-DASH
```

### 3. Com Docker (Mais Fácil)

```bash
# Criar arquivo .env
echo 'OPENAI_API_KEY=sk-sua-chave-aqui' > backend/.env

# Iniciar tudo
docker-compose up -d

# Aguardar 30 segundos
sleep 30

# Acessar
# Frontend: http://localhost
# API Backend: http://localhost:5000/api
# MongoDB: localhost:27017
```

### 4. Sem Docker (Desenvolvimento Local)

#### Terminal 1 - Backend

```bash
cd backend
npm install

# Criar e configurar .env
echo 'OPENAI_API_KEY=sk-sua-chave-aqui' > .env
echo 'PORT=5000' >> .env
echo 'NODE_ENV=development' >> .env
echo 'DATABASE_URL=mongodb://localhost:27017/te-grow-dashboard' >> .env
echo 'CORS_ORIGIN=http://localhost:3000' >> .env

# Iniciar servidor
npm run dev
# Deve exibir: 🚀 Servidor iniciado em http://localhost:5000
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm install

# Criar e configurar .env
echo 'VITE_API_URL=http://localhost:5000/api' > .env

# Iniciar dev server
npm run dev
# Deve exibir: ➜  Local:   http://localhost:5173/
```

#### Terminal 3 - MongoDB (se não tiver Docker)

```bash
# No Windows
mongod

# No macOS (com Homebrew)
brew services start mongodb-community

# No Linux
sudo systemctl start mongod
```

### 5. Acessar Aplicação

- **Frontend**: http://localhost:5173 (ou http://localhost se com Docker)
- **API Backend**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🔑 Obter Chave OpenAI

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Faça login ou crie conta
3. Vá para "API keys"
4. Clique "Create new secret key"
5. Copie e guarde a chave (não será exibida novamente)
6. Adicione ao arquivo `.env`

## 📝 Exemplo de Uso

### 1. Fazer Upload

1. Clique em "Upload"
2. Arraste um PDF, Excel ou Word
3. Aguarde processamento (~30 segundos)
4. Verá dados extraídos e insights

### 2. Ver Dashboard

1. Clique em "Dashboard"
2. Visualize estatísticas
3. Veja gráficos agregados

### 3. Gerenciar Documentos

1. Clique em "Documentos"
2. Selecione um documento
3. Mude tipo de gráfico
4. Edite dados se necessário

## 🧹 Limpeza

### Parar Docker

```bash
docker-compose down
# Remover volumes (cuidado - deleta dados!)
docker-compose down -v
```

### Limpar Node Modules

```bash
rm -rf backend/node_modules frontend/node_modules
npm install  # reinstalar
```

## 🐛 Solução Rápida de Problemas

| Problema | Solução |
|----------|----------|
| "Port 5000 already in use" | `lsof -i :5000` e `kill -9 <PID>` ou mude PORT em .env |
| "Cannot connect to MongoDB" | Certifique-se MongoDB está rodando: `mongosh` |
| "CORS error" | Verificar CORS_ORIGIN no backend/.env |
| "API key not valid" | Verificar OpenAI_API_KEY no backend/.env |
| "Frontend não conecta backend" | Verificar VITE_API_URL no frontend/.env |

## 📚 Próximos Passos

1. Ler [GUIA_COMPLETO.md](GUIA_COMPLETO.md) para detalhes
2. Explorar código em `backend/src` e `frontend/src`
3. Consultar documentação:
   - [Express.js](https://expressjs.com/)
   - [React](https://react.dev/)
   - [Recharts](https://recharts.org/)

## 🚀 Dicas de Desenvolvimento

```bash
# Adicionar dependência no backend
cd backend
npm install nome-do-pacote

# Adicionar dependência no frontend
cd frontend
npm install nome-do-pacote

# Ver logs do Docker
docker-compose logs -f backend
docker-compose logs -f frontend

# Reconstruir containers
docker-compose up --build
```

## ✅ Checklist Verificação

- [ ] Node 18+ instalado
- [ ] OpenAI API key obtida
- [ ] Repositório clonado
- [ ] .env configurado
- [ ] Backend rodando na porta 5000
- [ ] Frontend acessível em localhost
- [ ] MongoDB conectado
- [ ] Primeiro upload feito com sucesso

## 💬 Precisa de Ajuda?

- Verifique [Issues](https://github.com/wanderleybiscaia-pixel/te-grow-dashboard/issues)
- Abra uma nova issue se o problema não estiver resolvido
- Consulte [GUIA_COMPLETO.md](GUIA_COMPLETO.md) para documentação detalhada

---

**Pronto para começar? Faça seu primeiro upload agora! 🚀**
