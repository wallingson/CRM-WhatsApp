# 🚀 Guia Rápido de Início

## Desenvolvimento Local (5 minutos)

### 1. Pré-requisitos
```bash
node --version  # v18+
psql --version  # v14+
```

### 2. Clone e Configure

```bash
# Clone o projeto
git clone https://github.com/seu-usuario/CRM-WhatsApp.git
cd CRM-WhatsApp

# Backend
cd backend
npm install
cp env.example .env
# Edite o .env com suas configurações

# Criar banco
createdb crm_whatsapp

# Migrations
npx prisma generate
npx prisma migrate dev

# Iniciar
npm run dev  # Roda em http://localhost:3000
```

### 3. Frontend (nova aba do terminal)

```bash
cd frontend
npm install
cp env.example .env
npm run dev  # Roda em http://localhost:5173
```

### 4. Criar usuário admin

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

### 5. Login

Acesse http://localhost:5173 e faça login com:
- Email: `admin@test.com`
- Senha: `admin123`

---

## Deploy na VPS (30 minutos)

### Passo a Passo Resumido

1. **Conectar via SSH**
   ```bash
   ssh root@seu-ip-vps
   ```

2. **Instalar dependências**
   ```bash
   # Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs postgresql nginx
   sudo npm install -g pm2
   ```

3. **Configurar PostgreSQL**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE crm_whatsapp;
   CREATE USER crm_user WITH PASSWORD 'sua_senha';
   GRANT ALL PRIVILEGES ON DATABASE crm_whatsapp TO crm_user;
   \q
   ```

4. **Deploy Backend**
   ```bash
   cd /var/www
   git clone https://github.com/seu-usuario/CRM-WhatsApp.git
   cd CRM-WhatsApp/backend
   npm install
   cp env.example .env
   # Edite o .env
   npx prisma generate
   npx prisma migrate deploy
   npm run build
   pm2 start dist/server.js --name crm-backend
   pm2 save && pm2 startup
   ```

5. **Deploy Frontend**
   ```bash
   cd ../frontend
   npm install
   cp env.example .env.production
   # Edite o .env.production
   npm run build
   ```

6. **Configurar Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/crm-whatsapp
   # Cole a configuração (ver DEPLOY_VPS.md)
   sudo ln -s /etc/nginx/sites-available/crm-whatsapp /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **SSL com Certbot**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d seudominio.com
   ```

8. **Criar usuário admin**
   ```bash
   curl -X POST https://seudominio.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@seudominio.com",
       "password": "senha_segura",
       "name": "Admin",
       "role": "ADMIN"
     }'
   ```

### Configurar WhatsApp

1. Acesse https://developers.facebook.com/
2. Crie um App → Adicione WhatsApp
3. Configure webhook:
   - URL: `https://seudominio.com/api/whatsapp/webhook`
   - Verify Token: o mesmo do seu `.env`
4. Copie credenciais para `.env` e reinicie: `pm2 restart crm-backend`

---

## 📚 Documentação Completa

- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guia completo de desenvolvimento
- [DEPLOY_VPS.md](./DEPLOY_VPS.md) - Deploy detalhado na VPS
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura do sistema
- [README.md](../README.md) - Visão geral do projeto

---

## ⚡ Comandos Úteis

### Backend

```bash
npm run dev              # Dev mode (hot reload)
npm run build            # Build produção
npm start                # Rodar produção
npx prisma studio        # GUI do banco de dados
npx prisma migrate dev   # Criar migration
pm2 logs crm-backend     # Ver logs (produção)
```

### Frontend

```bash
npm run dev        # Dev mode
npm run build      # Build produção
npm run preview    # Preview do build
```

### Banco de Dados

```bash
psql -U crm_user -d crm_whatsapp    # Conectar ao banco
pg_dump crm_whatsapp > backup.sql   # Backup
psql crm_whatsapp < backup.sql      # Restaurar
```

---

## 🆘 Problemas Comuns

### "Cannot connect to database"
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
```

### "403 Forbidden" no webhook
Verifique se o `WHATSAPP_VERIFY_TOKEN` no `.env` está correto

### Frontend não carrega dados
Verifique se `VITE_API_URL` está correto e se CORS está configurado

---

## 📞 Suporte

- Issues: https://github.com/seu-usuario/CRM-WhatsApp/issues
- Email: suporte@seudominio.com

---

**Pronto para começar!** 🎉
