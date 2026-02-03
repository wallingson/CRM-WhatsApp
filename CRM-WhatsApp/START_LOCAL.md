# 🖥️ Executar Localmente no macOS

## 🚀 Método 1: Instalação Automática (Recomendado)

Execute o script de instalação que configura tudo automaticamente:

```bash
cd /Users/w.otoni-mac14/Dropbox/Yby/Verdent/CRM-WhatsApp
./install.sh
```

O script irá:
- ✅ Instalar Homebrew (se necessário)
- ✅ Instalar Node.js 20
- ✅ Instalar PostgreSQL 14
- ✅ Criar banco de dados
- ✅ Instalar dependências (backend + frontend)
- ✅ Configurar arquivos .env
- ✅ Executar migrations
- ✅ Criar usuário admin
- ✅ Criar scripts auxiliares (start.sh, stop.sh, logs.sh)

**Após a instalação:**

```bash
# Iniciar aplicação
./start.sh

# Acessar no navegador
# http://localhost:5173

# Login
# Email: admin@test.com
# Senha: admin123

# Ver logs
./logs.sh

# Parar aplicação
./stop.sh
```

---

## 🔧 Método 2: Instalação Manual

Se preferir instalar manualmente ou o script automático falhar:

### 1. Instalar Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Instalar Node.js e PostgreSQL

```bash
brew install node@20 postgresql@14
brew services start postgresql@14
```

### 3. Criar banco de dados

```bash
createdb crm_whatsapp
```

### 4. Backend

```bash
cd backend
npm install
cp env.example .env

# Editar .env (substitua 'seu_usuario' por resultado de: whoami)
# DATABASE_URL="postgresql://seu_usuario@localhost:5432/crm_whatsapp?schema=public"

npx prisma generate
npx prisma migrate dev
mkdir -p logs uploads
npm run dev
```

### 5. Frontend (nova aba do terminal)

```bash
cd frontend
npm install
cp env.example .env
npm run dev
```

### 6. Criar usuário admin (nova aba)

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

### 7. Acessar

Abra: http://localhost:5173

---

## 📊 Status dos Serviços

### Verificar se tudo está rodando

```bash
# PostgreSQL
brew services list | grep postgresql

# Backend (porta 3000)
curl http://localhost:3000/health

# Frontend (porta 5173)
curl http://localhost:5173
```

### Ver processos

```bash
# Backend
lsof -ti:3000

# Frontend
lsof -ti:5173
```

---

## 🛠️ Comandos Úteis

### Reiniciar PostgreSQL

```bash
brew services restart postgresql@14
```

### Abrir Prisma Studio (GUI do banco)

```bash
cd backend
npx prisma studio
# Abre em http://localhost:5555
```

### Ver logs em tempo real

```bash
# Se usou o script de instalação
./logs.sh

# Ou manualmente nos terminais onde iniciou backend/frontend
```

### Limpar e recomeçar

```bash
# Parar tudo
./stop.sh

# Ou manualmente
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Recriar banco (se necessário)
dropdb crm_whatsapp
createdb crm_whatsapp
cd backend
npx prisma migrate dev
```

---

## ⚠️ Problemas Comuns

### "command not found: npm"

Node.js não está no PATH:

```bash
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### "Cannot connect to database"

PostgreSQL não está rodando:

```bash
brew services start postgresql@14
```

Ou credenciais erradas no .env:

```bash
# Descobrir seu usuário
whoami

# Usar no DATABASE_URL
DATABASE_URL="postgresql://SEU_USUARIO@localhost:5432/crm_whatsapp?schema=public"
```

### "Port already in use"

Matar processo na porta:

```bash
# Backend (3000)
kill -9 $(lsof -ti:3000)

# Frontend (5173)
kill -9 $(lsof -ti:5173)
```

### Frontend não carrega dados

1. Verificar se backend está rodando: http://localhost:3000/health
2. Verificar console do navegador (F12)
3. Verificar arquivo .env do frontend tem `VITE_API_URL=http://localhost:3000/api`

---

## 📁 Estrutura Após Instalação

```
CRM-WhatsApp/
├── install.sh          # Script de instalação
├── start.sh            # Iniciar aplicação
├── stop.sh             # Parar aplicação
├── logs.sh             # Ver logs
├── backend/
│   ├── .env            # Variáveis de ambiente
│   ├── node_modules/   # Dependências instaladas
│   ├── logs/           # Logs do servidor
│   └── uploads/        # Arquivos enviados
└── frontend/
    ├── .env            # Variáveis de ambiente
    └── node_modules/   # Dependências instaladas
```

---

## 🎯 Próximos Passos

1. ✅ Executar `./install.sh`
2. ✅ Executar `./start.sh`
3. ✅ Acessar http://localhost:5173
4. ✅ Login com admin@test.com / admin123
5. 🔧 Explorar a aplicação
6. 📚 Ler documentação em `/docs/`
7. 🎨 Customizar (cores, logo, etc.)
8. 📱 Configurar WhatsApp quando tiver credenciais

---

## 📞 Suporte

- **Documentação completa:** [/docs/README.md](./docs/)
- **Guia de instalação detalhado:** [INSTALACAO_MAC.md](./INSTALACAO_MAC.md)
- **Arquitetura:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Troubleshooting:** [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)

---

**Pronto para começar!** 🎉

Execute `./install.sh` e em poucos minutos você terá tudo rodando! 🚀
