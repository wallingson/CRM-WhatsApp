# ⚡ Deploy Instantâneo - 15 Minutos

## 🎯 Objetivo: CRM WhatsApp Online HOJE

**Zero instalação. Zero configuração VPS. Zero complicação.**

---

## 📝 RESUMO SUPER RÁPIDO

### O que você vai fazer:

1. **GitHub** → Subir código (5 min)
2. **Railway** → Backend + Banco (5 min)  
3. **Vercel** → Frontend (3 min)
4. **Configurar** → Admin + Testar (2 min)

**Total: 15 minutos**

---

## 🚀 INSTRUÇÕES PASSO A PASSO

### 📦 1. Subir para GitHub (5 min)

**Via Web (Fácil):**

1. Vá em https://github.com/new
2. Nome: `CRM-WhatsApp`
3. Privado (recomendado)
4. **Criar**
5. **Upload files** → Arraste pasta CRM-WhatsApp
6. **Commit**

✅ **Pronto!**

---

### 🚂 2. Deploy Backend - Railway (5 min)

**A. Conta:**
- https://railway.app
- Login com GitHub
- ✅ Ganhe $5 grátis

**B. Banco:**
- Dashboard → **"+ New"**
- **"Database"** → **"PostgreSQL"**
- ✅ Criado!

**C. Backend:**
- **"+ New"** → **"GitHub Repo"**
- Selecione `CRM-WhatsApp`
- ✅ Deploy automático!

**D. Conectar:**
- Clique no **backend** (não no PostgreSQL)
- Aba **"Connect"**
- Selecione **PostgreSQL**
- ✅ Conectado!

**E. Variáveis:**
- Backend → **"Variables"**
- **"RAW Editor"** → Cole:

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=railway-secret-key-change-this-123456789
JWT_EXPIRES_IN=7d
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_VERIFY_TOKEN=railway-verify-token
WHATSAPP_BUSINESS_ACCOUNT_ID=
CORS_ORIGIN=*
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

**F. Domínio:**
- Backend → **"Settings"**
- **"Generate Domain"**
- **Copie a URL:** `https://xxx.up.railway.app`

✅ **Backend no ar!**

---

### 🎨 3. Deploy Frontend - Vercel (3 min)

**A. Conta:**
- https://vercel.com
- Login com GitHub

**B. Projeto:**
- **"Add New Project"**
- Import `CRM-WhatsApp`

**C. Configuração:**
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

**D. Variável:**
- **Environment Variable:**
  ```
  VITE_API_URL = https://SEU-RAILWAY-URL.up.railway.app/api
  ```
  
**E. Deploy:**
- Clique **"Deploy"**
- Aguarde ~2 min

✅ **Frontend no ar!**

**Copie URL:** `https://xxx.vercel.app`

---

### ⚙️ 4. Finalizar (2 min)

**A. Atualizar CORS:**
1. Railway → Backend → Variables
2. Edite `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://SEU-VERCEL-URL.vercel.app
   ```

**B. Criar Admin:**

Abra terminal ou Postman:

```bash
curl -X POST https://SEU-RAILWAY-URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@crm.com",
    "password": "Admin@123",
    "name": "Admin",
    "role": "ADMIN"
  }'
```

---

## 🎉 PRONTO! ACESSE E USE!

**URL:** https://SEU-VERCEL-URL.vercel.app

**Login:**
- Email: `admin@crm.com`
- Senha: `Admin@123`

---

## 📊 Custos

- **Railway:** $0 (trial $5) → depois $5-15/mês
- **Vercel:** $0 sempre (grátis)
- **Total:** $0-15/mês

**vs VPS:** $30-80/mês → **Economia de 60%**

---

## 🔗 Links Importantes

| Serviço | URL | Uso |
|---------|-----|-----|
| **Railway** | https://railway.app | Backend + Banco |
| **Vercel** | https://vercel.com | Frontend |
| **GitHub** | https://github.com | Código |
| **Guia Completo** | [COMECE_AQUI.md](./COMECE_AQUI.md) | Instruções detalhadas |

---

## ⚡ Benefícios

✅ **15 minutos** para MVP online  
✅ **Zero instalação** no Mac  
✅ **Zero configuração** VPS  
✅ **SSL automático** (HTTPS)  
✅ **Backups automáticos**  
✅ **Logs em tempo real**  
✅ **Deploy automático** (Git push)  

---

## 🆘 Precisa de Ajuda?

1. **Guia Detalhado:** [COMECE_AQUI.md](./COMECE_AQUI.md)
2. **Troubleshooting:** [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md)
3. **Documentação:** [docs/](./docs/)

---

**Bora começar?** 🚀

**Passo 1:** GitHub (5 min)  
**Passo 2:** Railway (5 min)  
**Passo 3:** Vercel (3 min)  
**Passo 4:** Login e usar! 🎉

---

**Sucesso no seu MVP!** 💪
