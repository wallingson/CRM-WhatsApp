# 🚀 Guia de Instalação e Execução Local - macOS

## ⚠️ Pré-requisitos Necessários

Para rodar este projeto, você precisa instalar algumas ferramentas primeiro.

## 📦 Passo 1: Instalar Homebrew (se não tiver)

Abra o Terminal e execute:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Após a instalação, adicione ao PATH (o instalador mostrará os comandos).

## 🟢 Passo 2: Instalar Node.js

```bash
# Instalar Node.js 20 LTS via Homebrew
brew install node@20

# Verificar instalação
node --version  # Deve mostrar v20.x.x
npm --version   # Deve mostrar 10.x.x
```

## 🐘 Passo 3: Instalar PostgreSQL

```bash
# Instalar PostgreSQL via Homebrew
brew install postgresql@14

# Iniciar serviço do PostgreSQL
brew services start postgresql@14

# Verificar se está rodando
brew services list | grep postgresql
```

## 🗄️ Passo 4: Criar Banco de Dados

```bash
# Criar banco de dados
createdb crm_whatsapp

# Verificar se foi criado (opcional)
psql -l | grep crm_whatsapp
```

## ⚙️ Passo 5: Configurar Backend

```bash
# Navegar para o diretório do backend
cd /Users/w.otoni-mac14/Dropbox/Yby/Verdent/CRM-WhatsApp/backend

# Instalar dependências
npm install

# Copiar arquivo de exemplo de variáveis de ambiente
cp env.example .env

# Editar arquivo .env (pode usar qualquer editor)
nano .env
```

**Configurações mínimas no arquivo .env:**

```env
PORT=3000
NODE_ENV=development

# Usuário padrão do PostgreSQL no Mac é seu nome de usuário
# Substitua 'seu_usuario' pelo resultado do comando: whoami
DATABASE_URL="postgresql://seu_usuario@localhost:5432/crm_whatsapp?schema=public"

JWT_SECRET=desenvolvimento-secret-local-123456789
JWT_EXPIRES_IN=7d

# WhatsApp (pode deixar vazio por enquanto para testes)
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_VERIFY_TOKEN=meu-verify-token-local
WHATSAPP_BUSINESS_ACCOUNT_ID=

CORS_ORIGIN=http://localhost:5173

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

**Dica:** Para descobrir seu usuário PostgreSQL:
```bash
whoami
```

Use esse nome na `DATABASE_URL`.

## 🔧 Passo 6: Configurar Prisma e Migrations

```bash
# Gerar o Prisma Client
npx prisma generate

# Executar migrations (criar tabelas no banco)
npx prisma migrate dev

# Se der erro de permissão no banco, tente:
# psql -d crm_whatsapp -c "GRANT ALL PRIVILEGES ON SCHEMA public TO seu_usuario;"
```

## 🚀 Passo 7: Iniciar Backend

```bash
# Criar diretório de logs
mkdir -p logs

# Iniciar o servidor de desenvolvimento
npm run dev
```

**Você deve ver:**
```
Server running on port 3000
Environment: development
```

✅ **Backend rodando em:** http://localhost:3000

## 🎨 Passo 8: Configurar Frontend (Nova Aba do Terminal)

Abra uma **nova aba/janela do Terminal** (Command + T) e execute:

```bash
# Navegar para o diretório do frontend
cd /Users/w.otoni-mac14/Dropbox/Yby/Verdent/CRM-WhatsApp/frontend

# Instalar dependências
npm install

# Copiar arquivo de variáveis de ambiente
cp env.example .env

# O arquivo .env já está configurado corretamente:
# VITE_API_URL=http://localhost:3000/api
```

## 🚀 Passo 9: Iniciar Frontend

```bash
npm run dev
```

**Você deve ver:**
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ **Frontend rodando em:** http://localhost:5173

## 👤 Passo 10: Criar Usuário Admin

Abra uma **terceira aba do Terminal** e execute:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Administrador",
    "role": "ADMIN"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@test.com",
      "name": "Administrador",
      "role": "ADMIN"
    },
    "token": "..."
  }
}
```

## 🎉 Passo 11: Acessar a Aplicação

1. Abra seu navegador
2. Acesse: **http://localhost:5173**
3. Faça login com:
   - **Email:** admin@test.com
   - **Senha:** admin123

## 🎯 Pronto! Aplicação Rodando!

Agora você tem:
- ✅ Backend rodando na porta 3000
- ✅ Frontend rodando na porta 5173
- ✅ Banco PostgreSQL configurado
- ✅ Usuário admin criado

---

## 🛠️ Comandos Úteis

### Ver logs do backend
Os logs aparecem no terminal onde você executou `npm run dev`

### Abrir interface do banco de dados (Prisma Studio)
```bash
cd backend
npx prisma studio
```
Abre em: http://localhost:5555

### Parar os servidores
- Pressione `Ctrl + C` em cada terminal

### Reiniciar PostgreSQL
```bash
brew services restart postgresql@14
```

### Verificar se portas estão em uso
```bash
lsof -ti:3000  # Backend
lsof -ti:5173  # Frontend
```

### Matar processo em porta específica
```bash
kill -9 $(lsof -ti:3000)
```

---

## ⚠️ Problemas Comuns e Soluções

### Erro: "Cannot connect to database"

**Solução 1:** Verificar se PostgreSQL está rodando
```bash
brew services list | grep postgresql
brew services start postgresql@14
```

**Solução 2:** Verificar credenciais do banco
```bash
# Descobrir seu usuário
whoami

# Testar conexão
psql -d crm_whatsapp

# Se der erro de permissão, criar usuário:
psql postgres
CREATE USER seu_usuario WITH SUPERUSER;
\q
```

**Solução 3:** Recriar banco
```bash
dropdb crm_whatsapp
createdb crm_whatsapp
cd backend
npx prisma migrate dev
```

### Erro: "Port 3000 already in use"

```bash
# Encontrar processo
lsof -ti:3000

# Matar processo
kill -9 $(lsof -ti:3000)
```

### Erro: "command not found: npm"

Node.js não foi instalado corretamente. Reinstale:
```bash
brew install node@20
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Frontend não carrega dados

1. Verificar se backend está rodando: http://localhost:3000/health
2. Verificar console do navegador (F12) para erros
3. Verificar arquivo `.env` do frontend tem `VITE_API_URL=http://localhost:3000/api`

### Erro de CORS

Verificar se no `.env` do backend tem:
```
CORS_ORIGIN=http://localhost:5173
```

---

## 📊 Estrutura de Terminais

Para facilitar, você terá 3 terminais abertos:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

**Terminal 3 (Comandos):**
```bash
# Usar para executar comandos adicionais
# curl, prisma studio, etc.
```

---

## 🔄 Workflow de Desenvolvimento

1. **Sempre inicie o backend primeiro** (Terminal 1)
2. **Depois inicie o frontend** (Terminal 2)
3. **Acesse http://localhost:5173 no navegador**
4. **Faça alterações no código**
5. **Hot reload automático** (não precisa reiniciar)

---

## 📱 Próximos Passos Após Rodar

1. **Explorar a aplicação:**
   - Criar leads
   - Testar navegação
   - Ver estrutura do código

2. **Quando tiver WhatsApp configurado:**
   - Adicionar credenciais no `.env` do backend
   - Reiniciar backend (Ctrl+C e `npm run dev`)
   - Testar envio de mensagens

3. **Personalizar:**
   - Cores (TailwindCSS no frontend)
   - Logo e branding
   - Adicionar features

---

## 🆘 Precisa de Ajuda?

1. Consulte a documentação em `/docs/`
2. Verifique os logs dos terminais
3. Use Prisma Studio para ver dados: `npx prisma studio`
4. Teste endpoints com curl ou Postman

---

**Sucesso!** 🎉 Agora você tem um ambiente de desenvolvimento completo rodando localmente!
