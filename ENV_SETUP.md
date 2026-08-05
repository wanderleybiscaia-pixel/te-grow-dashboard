# Guia de Setup de Variáveis de Ambiente

## 📋 Opção 1: Setup Interativo (Recomendado)

Para configurar todas as variáveis de forma interativa:

```bash
chmod +x setup-env.sh
./setup-env.sh
```

Este script vai:
1. Solicitar a chave OpenAI
2. Configurar CORS Origins
3. Definir a porta
4. Configurar MongoDB
5. Criar arquivo `.env` automaticamente

## ⚡ Opção 2: Update Rápido (Apenas Chave OpenAI)

Se você já tem um `.env` e quer apenas atualizar a chave OpenAI:

```bash
chmod +x update-openai-key.sh
./update-openai-key.sh "sk-proj-seu_api_key_aqui"
```

## 🔧 Opção 3: Manual

1. Copie o arquivo de exemplo:
```bash
cp backend/.env.example backend/.env
```

2. Edite o arquivo:
```bash
nano backend/.env
```

3. Substitua os valores placeholders pelos reais

## 🔑 Obtendo a Chave OpenAI

1. Acesse: https://platform.openai.com/account/api-keys
2. Clique em "Create new secret key"
3. Copie a chave (format: `sk-proj-...`)
4. Cole no arquivo `.env` ou no script

## 🚀 Após Configurar

1. Reinicie o container:
```bash
docker-compose restart te-grow-backend
```

2. Verifique se está tudo certo:
```bash
docker logs te-grow-backend --tail 50
```

3. Teste a API:
```bash
curl https://seu-url:5000/health
```

## 📝 Arquivo .env esperado

```
OPENAI_API_KEY=sk-proj-seu_verdadeiro_api_key
CORS_ORIGIN=http://localhost:3000,http://localhost
PORT=5000
MONGODB_URI=mongodb://mongo:27017/te-grow-dashboard
LOG_LEVEL=info
```

## ⚠️ Segurança

- **Nunca commit** o arquivo `.env` no Git
- O arquivo `.env.example` contém apenas placeholders
- Mantenha sua chave OpenAI **secreta e segura**
- Use `.gitignore` para evitar commit acidental

## 🆘 Troubleshooting

### Erro: "You didn't provide an API key"
- Verifique se `OPENAI_API_KEY` está preenchida
- Confirme que a chave começa com `sk-`

### Erro: "Not allowed by CORS"
- Verifique se sua URL está em `CORS_ORIGIN`
- Reinicie o container após mudanças

### Erro: "mongodb connection refused"
- Verifique se o container MongoDB está rodando: `docker ps`
- Confirme se `MONGODB_URI` está correta
