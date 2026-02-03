# Guia de Deploy na VPS Hostgator

Este guia explica como fazer o deploy completo da plataforma CRM WhatsApp na sua VPS Hostgator.

## 📋 Pré-requisitos

### Na sua máquina local:
- Git instalado
- Node.js 18+ e npm
- Acesso SSH à VPS

### Na VPS Hostgator:
- Ubuntu 20.04+ ou similar
- Acesso root ou sudo
- Porta 80 e 443 disponíveis

## 🚀 Passo 1: Preparar a VPS

### 1.1. Conectar via SSH

```bash
ssh root@seu-ip-da-vps
# ou
ssh seu-usuario@seu-ip-da-vps
```

### 1.2. Atualizar o sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3. Instalar dependências

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL 14
sudo apt install -y postgresql postgresql-contrib

# Nginx (proxy reverso)
sudo apt install -y nginx

# PM2 (gerenciador de processos)
sudo npm install -g pm2

# Git
sudo apt install -y git
```

## 🗄️ Passo 2: Configurar o Banco de Dados

### 2.1. Criar banco de dados e usuário

```bash
sudo -u postgres psql

# No console do PostgreSQL:
CREATE DATABASE crm_whatsapp;
CREATE USER crm_user WITH PASSWORD 'sua_senha_segura_aqui';
GRANT ALL PRIVILEGES ON DATABASE crm_whatsapp TO crm_user;
\q
```

### 2.2. Configurar acesso remoto (opcional)

```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
# Descomentar e alterar: listen_addresses = 'localhost'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Adicionar: host all all 127.0.0.1/32 md5

sudo systemctl restart postgresql
```

## 📦 Passo 3: Deploy do Backend

### 3.1. Clonar o repositório

```bash
cd /var/www
sudo git clone https://github.com/seu-usuario/CRM-WhatsApp.git
sudo chown -R $USER:$USER CRM-WhatsApp
cd CRM-WhatsApp/backend
```

### 3.2. Instalar dependências

```bash
npm install
```

### 3.3. Configurar variáveis de ambiente

```bash
cp env.example .env
nano .env
```

Edite o arquivo `.env`:

```env
PORT=3000
NODE_ENV=production

DATABASE_URL="postgresql://crm_user:sua_senha_segura_aqui@localhost:5432/crm_whatsapp?schema=public"

JWT_SECRET=gere-uma-chave-aleatoria-segura-aqui-min-32-chars
JWT_EXPIRES_IN=7d

WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=seu-phone-number-id
WHATSAPP_ACCESS_TOKEN=seu-access-token
WHATSAPP_VERIFY_TOKEN=seu-verify-token-customizado
WHATSAPP_BUSINESS_ACCOUNT_ID=seu-business-account-id

CORS_ORIGIN=https://seudominio.com

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### 3.4. Executar migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

### 3.5. Build da aplicação

```bash
npm run build
```

### 3.6. Configurar PM2

```bash
pm2 start dist/server.js --name crm-backend
pm2 save
pm2 startup
# Execute o comando que aparecer na tela
```

## 🌐 Passo 4: Deploy do Frontend

### 4.1. Configurar variáveis de ambiente

```bash
cd /var/www/CRM-WhatsApp/frontend
cp env.example .env.production
nano .env.production
```

Edite:

```env
VITE_API_URL=https://seudominio.com/api
```

### 4.2. Instalar e build

```bash
npm install
npm run build
```

## 🔧 Passo 5: Configurar Nginx

### 5.1. Criar arquivo de configuração

```bash
sudo nano /etc/nginx/sites-available/crm-whatsapp
```

Adicione:

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    # Frontend
    root /var/www/CRM-WhatsApp/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    client_max_body_size 10M;
}
```

### 5.2. Ativar o site

```bash
sudo ln -s /etc/nginx/sites-available/crm-whatsapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 Passo 6: Configurar SSL (HTTPS)

### 6.1. Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2. Obter certificado SSL

```bash
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

Siga as instruções na tela.

### 6.3. Renovação automática

O Certbot já configura renovação automática, mas você pode testar:

```bash
sudo certbot renew --dry-run
```

## 🔐 Passo 7: Segurança Adicional

### 7.1. Configurar Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 7.2. Configurar fail2ban

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📱 Passo 8: Configurar WhatsApp Business API

### 8.1. Criar conta Meta for Developers

1. Acesse: https://developers.facebook.com/
2. Crie uma conta e um App
3. Adicione o produto "WhatsApp"

### 8.2. Configurar webhook

1. No painel do Meta for Developers, vá em WhatsApp > Configuration
2. Configure o webhook:
   - URL: `https://seudominio.com/api/whatsapp/webhook`
   - Verify Token: o mesmo que você definiu no `.env` (`WHATSAPP_VERIFY_TOKEN`)
3. Inscreva-se nos eventos: `messages` e `message_status`

### 8.3. Obter credenciais

1. Anote o `WHATSAPP_PHONE_NUMBER_ID`
2. Gere um token de acesso permanente
3. Atualize o `.env` com essas credenciais
4. Reinicie o backend: `pm2 restart crm-backend`

## 🎯 Passo 9: Criar Usuário Admin

### 9.1. Via API (Postman ou cURL)

```bash
curl -X POST https://seudominio.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@seudominio.com",
    "password": "senha_segura_123",
    "name": "Administrador",
    "role": "ADMIN"
  }'
```

## 🔄 Manutenção e Monitoramento

### Logs do Backend

```bash
pm2 logs crm-backend
```

### Status dos serviços

```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql
```

### Atualizar código

```bash
cd /var/www/CRM-WhatsApp
git pull origin main

# Backend
cd backend
npm install
npm run build
pm2 restart crm-backend

# Frontend
cd ../frontend
npm install
npm run build
```

### Backup do banco de dados

```bash
pg_dump -U crm_user -h localhost crm_whatsapp > backup_$(date +%Y%m%d).sql
```

## ⚠️ Troubleshooting

### Backend não inicia

```bash
pm2 logs crm-backend --lines 50
# Verificar logs de erro
```

### Erro de conexão com banco

```bash
sudo systemctl status postgresql
# Verificar se PostgreSQL está rodando

# Testar conexão
psql -U crm_user -h localhost -d crm_whatsapp
```

### Nginx retorna 502

```bash
sudo nginx -t
sudo systemctl status nginx
pm2 status
# Verificar se backend está rodando na porta 3000
```

## 📞 Suporte

Para dúvidas sobre hospedagem na Hostgator:
- Suporte Hostgator: https://www.hostgator.com.br/suporte
- Documentação VPS: https://suporte.hostgator.com.br/hc/pt-br

## ✅ Checklist Final

- [ ] PostgreSQL configurado e rodando
- [ ] Backend buildado e rodando via PM2
- [ ] Frontend buildado
- [ ] Nginx configurado e rodando
- [ ] SSL/HTTPS ativo via Certbot
- [ ] Firewall configurado
- [ ] WhatsApp webhook configurado
- [ ] Usuário admin criado
- [ ] Backup automático configurado

---

**Pronto!** Sua plataforma CRM WhatsApp está online e pronta para uso! 🎉
