# ⚠️ Riscos e Mitigações - VPS Hostgator

## Análise Completa de Riscos

### 🔴 RISCOS REAIS

#### 1. **Conflito com Outras Aplicações**

**Risco:** Se sua VPS já hospeda outros sites/apps, pode haver conflitos.

**Cenários de conflito:**
- ✅ **Diferentes sites em PHP** → Sem problema (Node.js não interfere)
- ⚠️ **Outro app Node.js rodando** → Conflito de portas e PM2
- ⚠️ **Outro banco PostgreSQL** → Pode compartilhar (usar databases diferentes)
- 🔴 **Nginx já configurado** → Precisa adicionar virtualhost, não sobrescrever

**Como verificar ANTES:**
```bash
# Conectar na VPS
ssh root@seu-ip-vps

# Verificar o que já está rodando
systemctl list-units --type=service --state=running | grep -E "node|postgres|nginx"

# Verificar portas ocupadas
netstat -tulpn | grep -E ":80|:443|:3000|:5432"

# Ver sites no Nginx
ls -la /etc/nginx/sites-enabled/

# Ver processos Node.js
ps aux | grep node
```

**Solução:**
- Use portas diferentes para backend (ex: 3001 em vez de 3000)
- Configure virtualhost no Nginx sem afetar sites existentes
- Use PM2 com namespaces diferentes

#### 2. **Segurança**

**Riscos:**
- 🔴 Expor banco de dados na internet
- 🔴 Credenciais fracas
- 🔴 Portas desnecessárias abertas

**Checklist de Segurança:**

```bash
# ✅ Firewall (UFW)
sudo ufw status

# Deve mostrar apenas:
# 22/tcp (SSH)
# 80/tcp (HTTP)
# 443/tcp (HTTPS)

# ❌ NÃO expor:
# 3000 (backend) - apenas localhost
# 5432 (postgres) - apenas localhost
# 5173 (frontend dev) - não usar em prod

# ✅ PostgreSQL - permitir apenas localhost
sudo nano /etc/postgresql/14/main/postgresql.conf
# listen_addresses = 'localhost'  # ✅ Correto
# listen_addresses = '*'          # ❌ PERIGOSO

# ✅ Verificar usuários do banco
sudo -u postgres psql
\du
# Deve ter apenas: crm_user (sem SUPERUSER em prod)

# ✅ Senha forte do banco
# Mínimo 16 caracteres aleatórios
openssl rand -base64 24  # Gera senha segura
```

#### 3. **Consumo de Recursos**

**Risco:** VPS básica pode ficar lenta.

**Requisitos mínimos:**
- RAM: 1GB (recomendado 2GB)
- CPU: 1 core (recomendado 2 cores)
- Disco: 10GB livres

**Monitorar recursos:**
```bash
# Ver uso de recursos
htop

# Ver uso de memória
free -h

# PostgreSQL consome ~50-150MB
# Node.js backend consome ~100-300MB
# Total: ~200-500MB RAM em idle
```

**Se VPS for pequena (<1GB RAM):**
```bash
# Otimizar PostgreSQL
sudo nano /etc/postgresql/14/main/postgresql.conf

# Adicionar:
shared_buffers = 128MB
effective_cache_size = 256MB
maintenance_work_mem = 32MB
max_connections = 20
```

#### 4. **Backup do Sistema**

**Risco:** Instalação pode sobrescrever arquivos importantes.

**O que será alterado:**
- `/etc/nginx/` - Adiciona configuração (não remove existentes)
- `/var/www/` - Apenas adiciona pasta CRM-WhatsApp
- Instalação de pacotes via `apt`

**Backup ANTES de instalar:**
```bash
# Backup de configurações do Nginx
sudo cp -r /etc/nginx /root/backup-nginx-$(date +%Y%m%d)

# Backup de sites existentes
sudo cp -r /var/www /root/backup-www-$(date +%Y%m%d)

# Lista de pacotes instalados
dpkg --get-selections > /root/packages-before.txt

# Snapshot da VPS (se Hostgator oferece)
# Fazer via painel da Hostgator antes de começar
```

#### 5. **Domínio e DNS**

**Risco:** Configurar errado pode derrubar site existente.

**Cenário seguro:**
- ✅ Subdomínio novo: `crm.seudominio.com`
- ⚠️ Domínio existente: precisa adicionar location no Nginx

**Configuração para NÃO afetar site existente:**

```nginx
# /etc/nginx/sites-available/site-existente (não mexer!)
server {
    server_name seudominio.com;
    # ... configuração existente ...
}

# /etc/nginx/sites-available/crm-whatsapp (criar novo)
server {
    server_name crm.seudominio.com;  # SUBDOMÍNIO diferente
    # ... nova configuração ...
}
```

**Ou adicionar no site existente:**
```nginx
server {
    server_name seudominio.com;
    
    # Site existente
    location / {
        # ... configuração atual ...
    }
    
    # Adicionar CRM em /crm
    location /crm {
        alias /var/www/CRM-WhatsApp/frontend/dist;
        try_files $uri $uri/ /crm/index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        # ...
    }
}
```

---

## ✅ INSTALAÇÃO SEGURA - VPS

### Opção 1: Instalação em VPS Limpa (Recomendado)

Se a VPS é nova ou dedicada apenas para o CRM:

```bash
# Seguir guia completo
# docs/DEPLOY_VPS.md
```

### Opção 2: VPS com Outros Sites (Cuidadosa)

#### Passo 1: Verificação Prévia

```bash
# Conectar na VPS
ssh root@seu-ip-vps

# Criar script de verificação
cat > /tmp/check-conflicts.sh << 'EOF'
#!/bin/bash
echo "=== Verificando Conflitos ==="
echo ""
echo "📦 Pacotes instalados:"
dpkg -l | grep -E "node|postgres|nginx|pm2"
echo ""
echo "🔌 Portas em uso:"
netstat -tulpn | grep -E ":80|:443|:3000|:5432"
echo ""
echo "📂 Sites no Nginx:"
ls -la /etc/nginx/sites-enabled/
echo ""
echo "🏃 Processos Node.js:"
ps aux | grep node
echo ""
echo "💾 Uso de memória:"
free -h
echo ""
echo "💿 Espaço em disco:"
df -h
EOF

chmod +x /tmp/check-conflicts.sh
/tmp/check-conflicts.sh > /tmp/pre-install-check.txt
cat /tmp/pre-install-check.txt
```

#### Passo 2: Backup

```bash
# Backup completo ANTES
sudo tar -czf /root/backup-completo-$(date +%Y%m%d).tar.gz \
  /etc/nginx \
  /var/www \
  /etc/postgresql 2>/dev/null || true

echo "Backup criado em: /root/backup-completo-*.tar.gz"
```

#### Passo 3: Instalação Isolada

```bash
# Usar porta diferente para backend
# Editar .env:
PORT=3001  # Em vez de 3000

# Usar namespace PM2
pm2 start dist/server.js --name crm-backend --namespace crm

# Nginx em subdomínio ou subpasta
# Não sobrescrever configuração existente
```

---

## 🐳 ALTERNATIVA SUPER SEGURA: Docker na VPS

**Vantagens:**
- ✅ Isolamento total
- ✅ Não interfere com sistema
- ✅ Fácil de remover
- ✅ Escalável

**Instalação Docker na VPS:**

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clonar projeto
cd /var/www
git clone https://github.com/seu-usuario/CRM-WhatsApp.git
cd CRM-WhatsApp

# Configurar .env
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env.production

# Iniciar com Docker
docker-compose -f docker-compose.prod.yml up -d

# Pronto! Isolado e seguro
```

**Nginx apenas como proxy reverso:**
```nginx
server {
    server_name crm.seudominio.com;
    
    location / {
        proxy_pass http://localhost:5173;
        # ...
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        # ...
    }
}
```

---

## 📊 Comparação Final

### Mac (Desenvolvimento)

| Método | Segurança | Performance | Facilidade | Limpeza |
|--------|-----------|-------------|------------|---------|
| Docker | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Instalação Direta | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| NVM + PG Docker | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Recomendação Mac:** Docker ou NVM+PostgreSQL-Docker

### VPS (Produção)

| Cenário | Método Recomendado | Risco |
|---------|-------------------|-------|
| VPS dedicada (limpa) | Instalação Direta | ⭐ Baixo |
| VPS com outros sites | Docker | ⭐⭐ Médio |
| VPS compartilhada | Docker em subdomínio | ⭐⭐⭐ Médio-Alto |

**Recomendação VPS:**
- VPS dedicada → Instalação direta
- VPS compartilhada → Docker

---

## ✅ Checklist de Segurança Antes de Instalar

### Mac
- [ ] Backup do Time Machine atualizado
- [ ] Decidir entre Docker ou Instalação Direta
- [ ] Ter tempo para reverter se necessário

### VPS
- [ ] **Snapshot/Backup da VPS completo**
- [ ] Verificar conflitos (`check-conflicts.sh`)
- [ ] Decidir porta do backend (3000 ou outra)
- [ ] Decidir domínio (principal ou subdomínio)
- [ ] Testar em VPS de teste primeiro (ideal)
- [ ] Ter acesso SSH salvo
- [ ] Ter credenciais do Hostgator à mão

---

## 🆘 Plano de Rollback (Se der problema)

### Mac
```bash
# Remover tudo
brew uninstall node@20 postgresql@14
brew autoremove
rm -rf ~/Library/Application\ Support/Postgres
```

### VPS
```bash
# Restaurar backup
sudo systemctl stop nginx
sudo rm -rf /etc/nginx
sudo tar -xzf /root/backup-completo-*.tar.gz -C /

# Remover o que instalamos
sudo apt remove --purge nodejs postgresql-14 nginx
sudo rm -rf /var/www/CRM-WhatsApp

# Restaurar snapshot (Hostgator)
# Via painel da Hostgator
```

---

## 💡 Minha Recomendação Final

### Para você (baseado no receio):

**Mac:**
1. **Use Docker** (isolamento 100%, fácil de remover)
2. Instale apenas Docker Desktop
3. Tudo roda isolado em containers
4. Remove tudo com 1 comando

**VPS:**
1. **Faça snapshot ANTES**
2. **Use subdomínio** (`crm.seudominio.com`)
3. **Ou use Docker** (mais seguro se VPS compartilhada)
4. **Teste em VPS de desenvolvimento primeiro** (se possível)

### Quer que eu crie os arquivos Docker prontos?

Posso criar:
- `docker-compose.yml` para Mac (dev)
- `docker-compose.prod.yml` para VPS (prod)
- Scripts de deploy automatizados
- Guia completo Docker

**Isso elimina 90% dos riscos!** 🐳

O que você prefere? Docker ou Instalação Direta?
