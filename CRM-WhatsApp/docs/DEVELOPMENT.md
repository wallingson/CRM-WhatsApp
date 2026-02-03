# Guia de Desenvolvimento Local

Este guia explica como rodar o projeto localmente para desenvolvimento.

## 📋 Pré-requisitos

- Node.js 18+ e npm
- PostgreSQL 14+
- Git

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/CRM-WhatsApp.git
cd CRM-WhatsApp
```

### 2. Configurar o Backend

#### 2.1. Instalar dependências

```bash
cd backend
npm install
```

#### 2.2. Configurar banco de dados

Criar banco de dados PostgreSQL:

```bash
createdb crm_whatsapp
```

Ou via psql:

```sql
CREATE DATABASE crm_whatsapp;
```

#### 2.3. Configurar variáveis de ambiente

```bash
cp env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm_whatsapp?schema=public"

JWT_SECRET=seu-secret-local-para-desenvolvimento
JWT_EXPIRES_IN=7d

WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_VERIFY_TOKEN=meu-verify-token-local
WHATSAPP_BUSINESS_ACCOUNT_ID=

CORS_ORIGIN=http://localhost:5173

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

#### 2.4. Executar migrations

```bash
npx prisma generate
npx prisma migrate dev
```

#### 2.5. (Opcional) Seed do banco

Criar usuário admin de teste:

```bash
npx prisma db seed
```

Ou via API depois que o servidor estiver rodando:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin",
    "role": "ADMIN"
  }'
```

#### 2.6. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### 3. Configurar o Frontend

#### 3.1. Instalar dependências

```bash
cd ../frontend
npm install
```

#### 3.2. Configurar variáveis de ambiente

```bash
cp env.example .env
```

O arquivo já está configurado para desenvolvimento:

```env
VITE_API_URL=http://localhost:3000/api
```

#### 3.3. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 🔧 Scripts Disponíveis

### Backend

```bash
npm run dev          # Iniciar em modo desenvolvimento (hot reload)
npm run build        # Build para produção
npm start            # Iniciar em modo produção
npm run migrate      # Executar migrations
npm run prisma:studio # Abrir Prisma Studio (GUI do banco)
```

### Frontend

```bash
npm run dev      # Iniciar em modo desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
npm run lint     # Executar linter
```

## 🗄️ Prisma Studio

Para visualizar e editar dados do banco via GUI:

```bash
cd backend
npx prisma studio
```

Abre em `http://localhost:5555`

## 📱 Configurar WhatsApp (Opcional para desenvolvimento)

Para testar a integração com WhatsApp:

1. Acesse https://developers.facebook.com/
2. Crie um App de teste
3. Adicione o produto WhatsApp
4. Configure um número de teste
5. Copie as credenciais para o `.env`

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🐛 Debug

### VS Code

Crie `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/backend",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## 📝 Estrutura do Projeto

```
CRM-WhatsApp/
├── backend/              # API REST Node.js
│   ├── src/
│   │   ├── config/      # Configurações
│   │   ├── controllers/ # Controllers
│   │   ├── middleware/  # Middlewares
│   │   ├── routes/      # Rotas
│   │   ├── services/    # Serviços
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utilitários
│   ├── prisma/          # Schema do banco
│   └── package.json
│
├── frontend/            # React SPA
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # Serviços (API)
│   │   ├── stores/      # Zustand stores
│   │   └── types/       # TypeScript types
│   └── package.json
│
└── docs/                # Documentação
```

## ⚠️ Problemas Comuns

### Erro ao conectar no PostgreSQL

Verifique se o PostgreSQL está rodando:

```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

### Porta 3000 ou 5173 já em uso

Mude a porta no arquivo de configuração ou pare o processo:

```bash
# Encontrar processo
lsof -ti:3000

# Matar processo
kill -9 $(lsof -ti:3000)
```

### Erro de CORS

Certifique-se que `CORS_ORIGIN` no backend está configurado para `http://localhost:5173`

## 🔄 Workflow de Desenvolvimento

1. Criar branch para feature: `git checkout -b feature/nova-funcionalidade`
2. Fazer alterações
3. Testar localmente
4. Commit: `git commit -m "feat: adiciona nova funcionalidade"`
5. Push: `git push origin feature/nova-funcionalidade`
6. Abrir Pull Request

## 📚 Recursos Adicionais

- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação Express](https://expressjs.com/)
- [Documentação React](https://react.dev/)
- [Documentação WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
