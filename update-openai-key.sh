#!/bin/bash

# Script rápido para atualizar apenas a chave OpenAI
# Uso: ./update-openai-key.sh "sua_chave_aqui"

if [ -z "$1" ]; then
    echo "❌ Erro: Chave OpenAI não fornecida!"
    echo ""
    echo "Uso: ./update-openai-key.sh 'sk-sua_chave_aqui'"
    echo ""
    echo "Exemplo:"
    echo "  ./update-openai-key.sh 'sk-proj-123abc456def'"
    exit 1
fi

OPENAI_KEY="$1"
ENV_FILE="backend/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Arquivo $ENV_FILE não encontrado!"
    echo "   Criando arquivo com valores padrão..."
    
    cat > "$ENV_FILE" << 'EOF'
OPENAI_API_KEY=PLACEHOLDER
CORS_ORIGIN=http://localhost:3000,http://localhost
PORT=5000
MONGODB_URI=mongodb://mongo:27017/te-grow-dashboard
LOG_LEVEL=info
EOF
    echo "✅ Arquivo criado!"
fi

# Verifica se a chave começa com 'sk_' ou 'sk-'
if [[ ! "$OPENAI_KEY" =~ ^sk[-_] ]]; then
    echo "⚠️  Aviso: A chave não parece válida (deveria começar com 'sk-' ou 'sk_')"
    read -p "Deseja continuar mesmo assim? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Atualiza a chave no arquivo .env (funciona em Linux, macOS e Windows com git bash)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/^OPENAI_API_KEY=.*/OPENAI_API_KEY=$OPENAI_KEY/" "$ENV_FILE"
else
    # Linux e Windows (git bash)
    sed -i "s/^OPENAI_API_KEY=.*/OPENAI_API_KEY=$OPENAI_KEY/" "$ENV_FILE"
fi

echo "✅ Chave OpenAI atualizada com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Reinicie o container:"
echo "      docker-compose restart te-grow-backend"
echo ""
echo "   2. Verifique os logs:"
echo "      docker logs te-grow-backend --tail 50"
echo ""
echo "   3. Se tiver sucesso, vá para:"
echo "      https://seu-url:3000"
echo ""
