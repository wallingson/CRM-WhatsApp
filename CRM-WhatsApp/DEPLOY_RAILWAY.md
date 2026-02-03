# 🚀 Deploy Automático - Railway.app

## 🎯 Por que Railway?

- ✅ **Deploy em 5 minutos** (conecta GitHub, pronto)
- ✅ **PostgreSQL incluído** (grátis)
- ✅ **SSL automático** (HTTPS)
- ✅ **$5 crédito grátis** (~500h de uso)
- ✅ **Logs em tempo real**
- ✅ **Zero configuração**

**Custo:** $0 (trial) ou ~$10-20/mês depois

---

## 📋 Passo a Passo

### 1️⃣ Preparar Código (1 minuto)

**IMPORTANTE:** Você precisa subir o código para o GitHub primeiro.

```bash
# Se ainda não criou repositório:
cd /Users/w.otoni-mac14/Dropbox/Yby/Verdent/CRM-WhatsApp

# Inicializar Git (se ainda não fez)
git init
git add .
git commit -m "Initial commit - CRM WhatsApp"

# Criar repositório no GitHub:
# 1. Vá em https://github.com/new
# 2. Nome: CRM-WhatsApp
# 3. Privado ou Público (sua escolha)
# 4. NÃO adicione README, .gitignore, license (já temos)
# 5. Clique em "Create repository"

# Conectar e enviar código
git remote add origin https://github.com/SEU_USUARIO/CRM-WhatsApp.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Criar Conta Railway (2 minutos)

1. **Acesse:** https://railway.app
2. **Clique em:** "Start a New Project"
3. **Login com:** GitHub (autorize acesso aos repos)
4. **Verificar email** (se pedido)

✅ **Você ganha $5 grátis** (~500 horas)

---

### 3️⃣ Deploy Backend (3 minutos)

#### A. Criar Banco de Dados

1. No Railway Dashboard, clique **"+ New"**
2. Selecione **"Database"** → **"PostgreSQL"**
3. Clique em **"Add PostgreSQL"**
4. ✅ **Banco criado automaticamente!**

#### B. Deploy Backend

1. Clique **"+ New"** novamente
2. Selecione **"GitHub Repo"**
3. Escolha o repo **"CRM-WhatsApp"**
4. Railway detecta automaticamente que é Node.js
5. Clique em **"Deploy"**

#### C. Configurar Variáveis de Ambiente

1. Clique no **serviço do backend**
2. Aba **"Variables"**
3. Clique **"+ New Variable"**

Adicione estas variáveis:

```bash
NODE_ENV=production
PORT=3000

# DATABASE_URL - Railway cria automaticamente quando você conectar
# Vá em: Connect → PostgreSQL → Copie a DATABASE_URL

JWT_SECRET=railway-jwt-secret-change-this-123456789abcdef
JWT_EXPIRES_IN=7d

WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_VERIFY_TOKEN=railway-verify-token-123
WHATSAPP_BUSINESS_ACCOUNT_ID=

# CORS_ORIGIN - Adicionar depois que frontend estiver no ar
CORS_ORIGIN=*

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

**Importante:** Para conectar o banco:
- Clique no serviço **backend**
- Aba **"Connect"**
- Selecione o **PostgreSQL**
- Railway adiciona `DATABASE_URL` automaticamente

4. Clique em **"Deploy"** (se não fez sozinho)

✅ **Backend no ar!** 

**URL do backend:** Clique em "Settings" → "Generate Domain" → Copie a URL (ex: `https://crm-backend-production.up.railway.app`)

---

### 4️⃣ Deploy Frontend (2 minutos)

#### A. Atualizar variável de ambiente

No seu computador, edite:

```bash
# frontend/.env.production
VITE_API_URL=https://SEU-BACKEND.up.railway.app/api
```

Substitua `SEU-BACKEND` pela URL que Railway gerou.

```bash
# Commit a mudança
git add frontend/.env.production
git commit -m "Update API URL for production"
git push
```

#### B. Deploy Frontend no Vercel (GRÁTIS)

Railway cobra por uso. Para frontend estático, **Vercel é grátis ilimitado**.

1. **Acesse:** https://vercel.com
2. **Login com GitHub**
3. **"Add New Project"**
4. **Selecione:** CRM-WhatsApp
5. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Variáveis de Ambiente:**
   - `VITE_API_URL`: `https://SEU-BACKEND.up.railway.app/api`

7. Clique **"Deploy"**

✅ **Frontend no ar em ~2 minutos!**

**URL:** https://crm-whatsapp.vercel.app (ou custom domain)

---

### 5️⃣ Atualizar CORS no Backend (1 minuto)

Agora que você tem a URL do frontend:

1. Volte no **Railway**
2. Clique no serviço **backend**
3. Aba **"Variables"**
4. Edite **CORS_ORIGIN**:
   ```
   CORS_ORIGIN=https://crm-whatsapp.vercel.app
   ```
   (use sua URL do Vercel)

5. Railway faz **redeploy automático**

---

### 6️⃣ Criar Usuário Admin (1 minuto)

```bash
# No seu terminal, execute:
curl -X POST https://SEU-BACKEND.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@seudominio.com",
    "password": "senha_super_segura_123",
    "name": "Administrador",
    "role": "ADMIN"
  }'
```

✅ **Admin criado!**

---

### 7️⃣ Acessar Aplicação (PRONTO!)

1. **Abra:** https://crm-whatsapp.vercel.app
2. **Login:**
   - Email: admin@seudominio.com
   - Senha: senha_super_segura_123

🎉 **MVP ONLINE!**

---

## 🔧 Gerenciamento

### Ver Logs

**Railway (Backend):**
1. Dashboard → Clique no serviço backend
2. Aba **"Deployments"**
3. Clique no deployment ativo
4. **View Logs**

**Vercel (Frontend):**
1. Dashboard → Seu projeto
2. Aba **"Logs"**

### Atualizar Código

```bash
# Fazer alterações
git add .
git commit -m "Nova feature"
git push

# Railway e Vercel fazem deploy automático!
```

### Ver Banco de Dados

**Railway:**
1. Clique no **PostgreSQL**
2. Aba **"Data"**
3. Visualize/edite dados

Ou conecte via Prisma Studio:
```bash
# Localmente, com DATABASE_URL do Railway
DATABASE_URL="postgresql://..." npx prisma studio
```

### Configurar WhatsApp

Quando tiver as credenciais:

1. **Railway** → Backend → **Variables**
2. Adicione:
   ```
   WHATSAPP_PHONE_NUMBER_ID=seu-id
   WHATSAPP_ACCESS_TOKEN=seu-token
   WHATSAPP_BUSINESS_ACCOUNT_ID=seu-account-id
   ```
3. **Webhook URL:** `https://SEU-BACKEND.up.railway.app/api/whatsapp/webhook`
4. **Verify Token:** o que você definiu em `WHATSAPP_VERIFY_TOKEN`

---

## 💰 Custos

### Railway (Backend + PostgreSQL)
- **Grátis:** $5 crédito (~500 horas = 20 dias 24/7)
- **Depois:** ~$5-15/mês
- **Pode pausar:** quando não usar

### Vercel (Frontend)
- **Grátis:** Ilimitado
- **Bandwidth:** 100GB/mês grátis

**Total:** $0-15/mês

---

## 🔒 Segurança

1. **Mudar senhas:**
   - `JWT_SECRET`: Gere com `openssl rand -base64 32`
   - Admin password: Use senha forte

2. **HTTPS:** Automático (Railway + Vercel)

3. **Firewall:** Não precisa (serviços gerenciados)

4. **Backups:**
   - Railway: Backups automáticos do PostgreSQL
   - Código: GitHub

---

## 🚀 Próximos Passos

1. ✅ **Testar aplicação** completamente
2. ✅ **Adicionar domínio customizado** (Vercel: grátis)
3. ✅ **Configurar WhatsApp** quando tiver credenciais
4. ✅ **Monitorar uso** no Railway Dashboard
5. ✅ **Adicionar mais usuários** via API

---

## 🆘 Troubleshooting

### Backend não inicia

**Verificar logs:**
- Railway → Backend → Deployments → View Logs

**Erro comum:** DATABASE_URL incorreta
- Solução: Reconectar PostgreSQL (Connect tab)

### Frontend não conecta no backend

**Verificar:**
1. `VITE_API_URL` está correto no Vercel
2. `CORS_ORIGIN` no Railway tem URL do Vercel
3. Backend está rodando (Railway logs)

### Migrations não rodaram

**Rodar manualmente:**
```bash
# No Railway CLI (instalar: npm i -g @railway/cli)
railway login
railway link
railway run npm run migrate:deploy
```

---

## 🎯 Vantagens vs VPS

| Aspecto | Railway/Vercel | VPS Hostgator |
|---------|----------------|---------------|
| Setup | ⭐⭐⭐⭐⭐ 5 min | ⭐⭐ 2-3 horas |
| Manutenção | ⭐⭐⭐⭐⭐ Zero | ⭐⭐ Você faz |
| Escalabilidade | ⭐⭐⭐⭐⭐ Auto | ⭐⭐ Manual |
| SSL | ⭐⭐⭐⭐⭐ Auto | ⭐⭐⭐ Certbot |
| Logs | ⭐⭐⭐⭐⭐ GUI | ⭐⭐ SSH/arquivos |
| Backups | ⭐⭐⭐⭐⭐ Auto | ⭐⭐ Manual |
| Custo | $0-15/mês | $30-80/mês |

---

**Pronto para começar?** 

**Passo 1:** Suba código para GitHub  
**Passo 2:** Deploy no Railway (5 min)  
**Passo 3:** Deploy no Vercel (2 min)  
**Passo 4:** Acesse e use! 🎉

---

**Tem alguma dúvida ou precisa de ajuda?** Me avise!
