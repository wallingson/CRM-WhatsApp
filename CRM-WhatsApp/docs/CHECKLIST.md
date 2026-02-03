# ✅ Checklist de Início - CRM WhatsApp

Use este checklist para começar a usar o CRM WhatsApp do zero.

---

## 🚀 Opção 1: Desenvolvimento Local

### Pré-requisitos
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] PostgreSQL 14+ instalado (`psql --version`)
- [ ] Git instalado (`git --version`)
- [ ] Editor de código (VS Code recomendado)

### Setup Inicial

#### 1. Clonar Repositório
```bash
git clone https://github.com/seu-usuario/CRM-WhatsApp.git
cd CRM-WhatsApp
```

#### 2. Backend

- [ ] Entrar no diretório: `cd backend`
- [ ] Instalar dependências: `npm install`
- [ ] Copiar env: `cp env.example .env`
- [ ] Editar `.env` com suas configurações:
  - [ ] `DATABASE_URL` com suas credenciais PostgreSQL
  - [ ] `JWT_SECRET` com uma chave segura
  - [ ] `CORS_ORIGIN=http://localhost:5173`

#### 3. Banco de Dados

- [ ] Criar banco: `createdb crm_whatsapp`
- [ ] Gerar Prisma Client: `npx prisma generate`
- [ ] Executar migrations: `npx prisma migrate dev`
- [ ] (Opcional) Abrir Prisma Studio: `npx prisma studio`

#### 4. Iniciar Backend

- [ ] Rodar servidor: `npm run dev`
- [ ] Verificar se está rodando em `http://localhost:3000`
- [ ] Testar health check: `curl http://localhost:3000/health`

#### 5. Frontend

- [ ] Abrir nova aba do terminal
- [ ] Entrar no diretório: `cd frontend`
- [ ] Instalar dependências: `npm install`
- [ ] Copiar env: `cp env.example .env`
- [ ] Verificar se `VITE_API_URL=http://localhost:3000/api`

#### 6. Iniciar Frontend

- [ ] Rodar servidor: `npm run dev`
- [ ] Verificar se está rodando em `http://localhost:5173`
- [ ] Abrir no navegador: `http://localhost:5173`

#### 7. Criar Usuário Admin

Opção A - cURL:
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

Opção B - Postman/Insomnia:
- [ ] POST para `http://localhost:3000/api/auth/register`
- [ ] Body (JSON):
  ```json
  {
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin",
    "role": "ADMIN"
  }
  ```

#### 8. Fazer Login

- [ ] Acessar `http://localhost:5173`
- [ ] Login com:
  - Email: `admin@test.com`
  - Senha: `admin123`
- [ ] Verificar se dashboard carrega

### ✅ Desenvolvimento Local Completo!

---

## 🌐 Opção 2: Deploy em Produção (VPS)

### Pré-requisitos
- [ ] VPS contratada (Hostgator, DigitalOcean, AWS, etc.)
- [ ] Domínio registrado (opcional mas recomendado)
- [ ] Acesso SSH à VPS
- [ ] Conta Meta for Developers (para WhatsApp)

### Setup VPS

#### 1. Conectar na VPS

- [ ] Conectar via SSH: `ssh root@seu-ip-vps`
- [ ] Atualizar sistema: `sudo apt update && sudo apt upgrade -y`

#### 2. Instalar Dependências

- [ ] Node.js 20:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  ```
- [ ] PostgreSQL: `sudo apt install -y postgresql postgresql-contrib`
- [ ] Nginx: `sudo apt install -y nginx`
- [ ] PM2: `sudo npm install -g pm2`
- [ ] Git: `sudo apt install -y git`

#### 3. Configurar PostgreSQL

- [ ] Entrar no psql: `sudo -u postgres psql`
- [ ] Criar banco:
  ```sql
  CREATE DATABASE crm_whatsapp;
  CREATE USER crm_user WITH PASSWORD 'senha_segura_aqui';
  GRANT ALL PRIVILEGES ON DATABASE crm_whatsapp TO crm_user;
  \q
  ```

#### 4. Clonar e Configurar Backend

- [ ] Clonar projeto:
  ```bash
  cd /var/www
  sudo git clone https://github.com/seu-usuario/CRM-WhatsApp.git
  sudo chown -R $USER:$USER CRM-WhatsApp
  cd CRM-WhatsApp/backend
  ```
- [ ] Instalar dependências: `npm install`
- [ ] Copiar env: `cp env.example .env`
- [ ] Editar `.env` com suas configurações:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` com credenciais corretas
  - [ ] `JWT_SECRET` com chave segura (min 32 chars)
  - [ ] `CORS_ORIGIN=https://seudominio.com`
  - [ ] Credenciais do WhatsApp (deixar vazio por enquanto)

#### 5. Build e Deploy Backend

- [ ] Gerar Prisma: `npx prisma generate`
- [ ] Executar migrations: `npx prisma migrate deploy`
- [ ] Build: `npm run build`
- [ ] Iniciar com PM2: `pm2 start dist/server.js --name crm-backend`
- [ ] Salvar config PM2: `pm2 save`
- [ ] Configurar startup: `pm2 startup` (executar comando que aparecer)

#### 6. Build Frontend

- [ ] Entrar no diretório: `cd ../frontend`
- [ ] Instalar dependências: `npm install`
- [ ] Copiar env: `cp env.example .env.production`
- [ ] Editar `.env.production`:
  - [ ] `VITE_API_URL=https://seudominio.com/api`
- [ ] Build: `npm run build`

#### 7. Configurar Nginx

- [ ] Criar arquivo de config:
  ```bash
  sudo nano /etc/nginx/sites-available/crm-whatsapp
  ```
- [ ] Colar configuração (ver `docs/DEPLOY_VPS.md` seção 5.1)
- [ ] Ativar site:
  ```bash
  sudo ln -s /etc/nginx/sites-available/crm-whatsapp /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl restart nginx
  ```

#### 8. Configurar SSL/HTTPS

- [ ] Instalar Certbot: `sudo apt install -y certbot python3-certbot-nginx`
- [ ] Obter certificado: `sudo certbot --nginx -d seudominio.com`
- [ ] Testar renovação automática: `sudo certbot renew --dry-run`

#### 9. Configurar Firewall

- [ ] Configurar UFW:
  ```bash
  sudo ufw allow OpenSSH
  sudo ufw allow 'Nginx Full'
  sudo ufw enable
  ```

#### 10. Criar Usuário Admin

- [ ] Via cURL:
  ```bash
  curl -X POST https://seudominio.com/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "email": "admin@seudominio.com",
      "password": "senha_muito_segura_123",
      "name": "Administrador",
      "role": "ADMIN"
    }'
  ```

#### 11. Testar Aplicação

- [ ] Acessar `https://seudominio.com`
- [ ] Fazer login com as credenciais criadas
- [ ] Verificar se dashboard carrega
- [ ] Testar navegação entre páginas

### ✅ Deploy em Produção Completo!

---

## 📱 Configurar WhatsApp Business API

### 1. Criar App Meta

- [ ] Acessar https://developers.facebook.com/
- [ ] Fazer login ou criar conta
- [ ] Criar novo App
- [ ] Adicionar produto "WhatsApp"
- [ ] Selecionar tipo "Business"

### 2. Configurar Número

- [ ] Adicionar número de telefone
- [ ] Verificar número
- [ ] Aceitar termos de uso

### 3. Configurar Webhook

- [ ] Na seção WhatsApp > Configuration
- [ ] Clicar em "Edit" em Webhook
- [ ] Configurar:
  - **Callback URL:** `https://seudominio.com/api/whatsapp/webhook`
  - **Verify Token:** criar um token customizado (ex: `meu-token-secreto-123`)
- [ ] Salvar e verificar
- [ ] Inscrever-se nos campos:
  - [ ] `messages`
  - [ ] `message_status`

### 4. Obter Credenciais

- [ ] Anotar **Phone Number ID**
- [ ] Gerar **Token de Acesso** (permanente)
- [ ] Anotar **WhatsApp Business Account ID**

### 5. Atualizar .env

- [ ] Editar `.env` no backend:
  ```env
  WHATSAPP_PHONE_NUMBER_ID=seu-phone-number-id
  WHATSAPP_ACCESS_TOKEN=seu-token-de-acesso
  WHATSAPP_VERIFY_TOKEN=meu-token-secreto-123
  WHATSAPP_BUSINESS_ACCOUNT_ID=seu-business-account-id
  ```

### 6. Reiniciar Backend

- [ ] Desenvolvimento: reiniciar o servidor (`npm run dev`)
- [ ] Produção: `pm2 restart crm-backend`

### 7. Testar Webhook

- [ ] Enviar mensagem de teste para o número configurado
- [ ] Verificar logs: `pm2 logs crm-backend`
- [ ] Verificar se lead foi criado automaticamente
- [ ] Verificar se mensagem aparece no sistema

### ✅ WhatsApp Integrado!

---

## 🧪 Testes Finais

### Backend
- [ ] Health check: `curl https://seudominio.com/health`
- [ ] Login: testar endpoint `/api/auth/login`
- [ ] Criar lead: testar endpoint `/api/leads`
- [ ] Listar leads: testar endpoint `/api/leads`

### Frontend
- [ ] Login funciona
- [ ] Dashboard carrega métricas
- [ ] Navegação entre páginas funciona
- [ ] Responsividade mobile
- [ ] Logout funciona

### WhatsApp
- [ ] Webhook recebe mensagens
- [ ] Leads são criados automaticamente
- [ ] Envio de mensagens funciona
- [ ] Status de entrega atualiza

### Produção
- [ ] HTTPS funcionando (cadeado verde)
- [ ] Backend rodando via PM2
- [ ] Logs sem erros
- [ ] Banco de dados acessível
- [ ] Backup configurado (opcional)

---

## 📚 Recursos Úteis

- [ ] Marcar docs importantes:
  - [ ] [QUICKSTART.md](./QUICKSTART.md)
  - [ ] [DEVELOPMENT.md](./DEVELOPMENT.md)
  - [ ] [DEPLOY_VPS.md](./DEPLOY_VPS.md)
  - [ ] [ARCHITECTURE.md](./ARCHITECTURE.md)

- [ ] Salvar comandos úteis:
  - Ver logs backend: `pm2 logs crm-backend`
  - Reiniciar backend: `pm2 restart crm-backend`
  - Status serviços: `pm2 status`
  - Ver logs Nginx: `sudo tail -f /var/log/nginx/error.log`

- [ ] Anotar credenciais importantes (em local seguro!):
  - [ ] URL da aplicação
  - [ ] Email/senha admin
  - [ ] Credenciais PostgreSQL
  - [ ] Credenciais WhatsApp
  - [ ] IP da VPS
  - [ ] Senha SSH

---

## 🆘 Em Caso de Problemas

### Backend não inicia
1. [ ] Ver logs: `pm2 logs crm-backend --lines 50`
2. [ ] Verificar `.env` está correto
3. [ ] Verificar PostgreSQL: `sudo systemctl status postgresql`
4. [ ] Testar conexão DB: `psql -U crm_user -h localhost -d crm_whatsapp`

### Frontend não carrega
1. [ ] Verificar build: `npm run build` (dentro de `frontend/`)
2. [ ] Verificar Nginx: `sudo nginx -t`
3. [ ] Ver logs Nginx: `sudo tail -f /var/log/nginx/error.log`
4. [ ] Verificar `VITE_API_URL` no `.env.production`

### WhatsApp não funciona
1. [ ] Verificar credenciais no `.env`
2. [ ] Testar webhook manualmente
3. [ ] Ver logs: `pm2 logs crm-backend | grep -i whatsapp`
4. [ ] Verificar status no painel Meta for Developers

---

## 🎉 Conclusão

Agora você tem um CRM WhatsApp completo e funcional!

**Próximos passos:**
1. [ ] Customizar branding (logo, cores)
2. [ ] Convidar usuários da equipe
3. [ ] Criar pipeline personalizado
4. [ ] Configurar automações
5. [ ] Importar leads existentes
6. [ ] Treinar equipe

**Divirta-se construindo seu CRM!** 🚀

---

**Dúvidas?** Consulte a [documentação completa](./README.md) ou abra uma [issue](https://github.com/seu-usuario/CRM-WhatsApp/issues).
