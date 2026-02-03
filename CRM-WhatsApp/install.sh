#!/bin/bash

# Script de instalação automática do CRM WhatsApp - macOS
# Autor: Yby/Verdent
# Data: 2026-02-02

set -e  # Parar se houver erro

echo "🚀 Instalação Automática do CRM WhatsApp"
echo "========================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções auxiliares
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "ℹ️  $1"
}

# Verificar macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    error "Este script é apenas para macOS"
    exit 1
fi

success "Sistema macOS detectado"

# 1. Verificar/Instalar Homebrew
echo ""
info "Passo 1/10: Verificando Homebrew..."
if ! command -v brew &> /dev/null; then
    warning "Homebrew não encontrado. Instalando..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Adicionar ao PATH para Apple Silicon
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    success "Homebrew instalado"
else
    success "Homebrew já instalado"
fi

# 2. Verificar/Instalar Node.js
echo ""
info "Passo 2/10: Verificando Node.js..."
if ! command -v node &> /dev/null; then
    warning "Node.js não encontrado. Instalando Node.js 20..."
    brew install node@20
    
    # Adicionar ao PATH
    echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
    export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
    
    success "Node.js instalado"
else
    NODE_VERSION=$(node --version)
    success "Node.js já instalado (${NODE_VERSION})"
fi

# 3. Verificar/Instalar PostgreSQL
echo ""
info "Passo 3/10: Verificando PostgreSQL..."
if ! command -v psql &> /dev/null; then
    warning "PostgreSQL não encontrado. Instalando PostgreSQL 14..."
    brew install postgresql@14
    
    # Iniciar serviço
    brew services start postgresql@14
    
    # Aguardar inicialização
    sleep 3
    
    success "PostgreSQL instalado e iniciado"
else
    # Verificar se está rodando
    if brew services list | grep -q "postgresql.*started"; then
        success "PostgreSQL já instalado e rodando"
    else
        warning "PostgreSQL instalado mas não está rodando. Iniciando..."
        brew services start postgresql@14
        sleep 3
        success "PostgreSQL iniciado"
    fi
fi

# 4. Criar banco de dados
echo ""
info "Passo 4/10: Criando banco de dados..."
if psql -lqt | cut -d \| -f 1 | grep -qw crm_whatsapp; then
    warning "Banco crm_whatsapp já existe. Pulando..."
else
    createdb crm_whatsapp
    success "Banco de dados crm_whatsapp criado"
fi

# 5. Configurar Backend
echo ""
info "Passo 5/10: Configurando backend..."

cd "$(dirname "$0")/backend"

# Instalar dependências
if [ ! -d "node_modules" ]; then
    info "Instalando dependências do backend..."
    npm install
    success "Dependências do backend instaladas"
else
    success "Dependências do backend já instaladas"
fi

# Configurar .env
if [ ! -f ".env" ]; then
    info "Criando arquivo .env..."
    USER=$(whoami)
    
    cat > .env << EOF
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://${USER}@localhost:5432/crm_whatsapp?schema=public"

JWT_SECRET=desenvolvimento-secret-local-$(date +%s)
JWT_EXPIRES_IN=7d

WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_VERIFY_TOKEN=meu-verify-token-local
WHATSAPP_BUSINESS_ACCOUNT_ID=

CORS_ORIGIN=http://localhost:5173

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
EOF
    success "Arquivo .env criado"
else
    success "Arquivo .env já existe"
fi

# 6. Configurar Prisma
echo ""
info "Passo 6/10: Configurando Prisma ORM..."

# Gerar Prisma Client
info "Gerando Prisma Client..."
npx prisma generate > /dev/null 2>&1
success "Prisma Client gerado"

# Executar migrations
info "Executando migrations..."
npx prisma migrate dev --name init > /dev/null 2>&1 || true
success "Migrations executadas"

# Criar diretórios necessários
mkdir -p logs uploads

# 7. Configurar Frontend
echo ""
info "Passo 7/10: Configurando frontend..."

cd ../frontend

# Instalar dependências
if [ ! -d "node_modules" ]; then
    info "Instalando dependências do frontend..."
    npm install
    success "Dependências do frontend instaladas"
else
    success "Dependências do frontend já instaladas"
fi

# Configurar .env
if [ ! -f ".env" ]; then
    info "Criando arquivo .env..."
    cat > .env << EOF
VITE_API_URL=http://localhost:3000/api
EOF
    success "Arquivo .env criado"
else
    success "Arquivo .env já existe"
fi

# 8. Criar usuário admin
echo ""
info "Passo 8/10: Configurando usuário admin..."

cd ../backend

# Iniciar backend em background temporariamente
info "Iniciando backend temporariamente..."
npm run dev > /tmp/crm-backend.log 2>&1 &
BACKEND_PID=$!

# Aguardar backend iniciar
sleep 8

# Criar usuário admin
info "Criando usuário admin..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Administrador",
    "role": "ADMIN"
  }')

# Parar backend temporário
kill $BACKEND_PID 2>/dev/null || true
sleep 2

if echo "$RESPONSE" | grep -q "success"; then
    success "Usuário admin criado"
    info "   Email: admin@test.com"
    info "   Senha: admin123"
else
    warning "Usuário admin pode já existir ou houve erro"
fi

# 9. Criar scripts de inicialização
echo ""
info "Passo 9/10: Criando scripts de inicialização..."

cd ..

# Script para iniciar tudo
cat > start.sh << 'EOF'
#!/bin/bash

echo "🚀 Iniciando CRM WhatsApp..."
echo ""

# Verificar PostgreSQL
if ! brew services list | grep -q "postgresql.*started"; then
    echo "⚠️  Iniciando PostgreSQL..."
    brew services start postgresql@14
    sleep 2
fi

# Iniciar backend em background
echo "🔧 Iniciando backend..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend.pid
cd ..

# Aguardar backend iniciar
sleep 5

# Iniciar frontend em background
echo "🎨 Iniciando frontend..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid
cd ..

sleep 3

echo ""
echo "✅ CRM WhatsApp iniciado!"
echo ""
echo "📍 Acessos:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo "   Health:   http://localhost:3000/health"
echo ""
echo "👤 Login:"
echo "   Email: admin@test.com"
echo "   Senha: admin123"
echo ""
echo "📊 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "⏹️  Para parar: ./stop.sh"
echo ""

# Abrir navegador
sleep 2
open http://localhost:5173
EOF

chmod +x start.sh

# Script para parar tudo
cat > stop.sh << 'EOF'
#!/bin/bash

echo "⏹️  Parando CRM WhatsApp..."

# Parar backend
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    kill $BACKEND_PID 2>/dev/null || true
    rm backend.pid
    echo "✅ Backend parado"
fi

# Parar frontend
if [ -f frontend.pid ]; then
    FRONTEND_PID=$(cat frontend.pid)
    kill $FRONTEND_PID 2>/dev/null || true
    rm frontend.pid
    echo "✅ Frontend parado"
fi

# Matar processos nas portas (garantia)
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

echo "✅ CRM WhatsApp parado completamente"
EOF

chmod +x stop.sh

# Script para ver logs
cat > logs.sh << 'EOF'
#!/bin/bash

echo "📊 Logs do CRM WhatsApp"
echo "======================="
echo ""
echo "Pressione Ctrl+C para sair"
echo ""

tail -f logs/backend.log logs/frontend.log
EOF

chmod +x logs.sh

mkdir -p logs

success "Scripts de inicialização criados"

# 10. Finalizar
echo ""
echo "=========================================="
echo "🎉 Instalação Concluída com Sucesso!"
echo "=========================================="
echo ""
info "Próximos passos:"
echo ""
echo "1️⃣  Iniciar aplicação:"
echo "   ./start.sh"
echo ""
echo "2️⃣  Acessar no navegador:"
echo "   http://localhost:5173"
echo ""
echo "3️⃣  Fazer login:"
echo "   Email: admin@test.com"
echo "   Senha: admin123"
echo ""
echo "4️⃣  Ver logs (opcional):"
echo "   ./logs.sh"
echo ""
echo "5️⃣  Parar aplicação:"
echo "   ./stop.sh"
echo ""
info "Comandos úteis:"
echo "   - Abrir Prisma Studio: cd backend && npx prisma studio"
echo "   - Ver status PostgreSQL: brew services list | grep postgresql"
echo "   - Reiniciar PostgreSQL: brew services restart postgresql@14"
echo ""
success "Tudo pronto! Execute ./start.sh para começar! 🚀"
echo ""
