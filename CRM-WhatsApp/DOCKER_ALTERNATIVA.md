# 🐳 Alternativa SEGURA: Docker (Isolamento Total)

Se você quer **zero risco** de afetar seu Mac, use Docker!

## Por que Docker é mais seguro?

✅ **Isolamento completo** - Nada instalado diretamente no Mac  
✅ **Fácil de remover** - `docker-compose down` e pronto  
✅ **Sem conflitos** - Roda em containers isolados  
✅ **Mesma config em dev e prod** - Funciona igual na VPS  

## Pré-requisito

Instale apenas o Docker Desktop:
- Download: https://www.docker.com/products/docker-desktop/
- **Único software que você instala no Mac**
- Interface gráfica simples
- Fácil de desinstalar depois

## Como usar

### 1. Criar docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: crm_whatsapp
      POSTGRES_USER: crm_user
      POSTGRES_PASSWORD: crm_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U crm_user"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://crm_user:crm_password@postgres:5432/crm_whatsapp?schema=public
      JWT_SECRET: docker-development-secret
      NODE_ENV: development
      CORS_ORIGIN: http://localhost:5173
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3000/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
```

### 2. Criar Dockerfile para Backend

```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### 3. Criar Dockerfile para Frontend

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### 4. Iniciar tudo

```bash
# Primeira vez (demora ~5min)
docker-compose up --build

# Próximas vezes (rápido)
docker-compose up

# Em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Remover TUDO (incluindo banco)
docker-compose down -v
```

### 5. Criar usuário admin

```bash
# Com Docker rodando
docker-compose exec backend npx ts-node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const password = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password,
      name: 'Administrador',
      role: 'ADMIN'
    }
  });
  console.log('Admin criado:', user.email);
}

createAdmin().catch(console.error).finally(() => prisma.\$disconnect());
"
```

## Vantagens Docker

| Aspecto | Docker | Instalação Direta |
|---------|--------|-------------------|
| Isolamento | ✅ Total | ❌ Parcial |
| Limpeza | ✅ `docker-compose down` | ❌ Desinstalar cada coisa |
| Conflitos | ✅ Zero | ⚠️ Possíveis |
| Portabilidade | ✅ Funciona igual em prod | ⚠️ Diferenças |
| Recursos | ⚠️ ~200MB RAM | ✅ ~100MB RAM |

## Comandos Úteis Docker

```bash
# Status dos containers
docker-compose ps

# Entrar no container do backend
docker-compose exec backend sh

# Ver logs específicos
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Reiniciar um serviço
docker-compose restart backend

# Executar migrations
docker-compose exec backend npx prisma migrate dev

# Abrir Prisma Studio
docker-compose exec backend npx prisma studio
# Acessar: http://localhost:5555
```

## Desinstalar Completamente

```bash
# 1. Parar e remover containers
docker-compose down -v

# 2. Remover imagens
docker rmi $(docker images -q crm-whatsapp*)

# 3. Desinstalar Docker Desktop (GUI)
# Apenas arrastar para a lixeira

# Pronto! Mac limpo como antes
```

## Comparação de Uso

### Instalação Direta
```bash
./install.sh        # Instala no sistema
./start.sh          # Inicia
./stop.sh           # Para
```

### Docker
```bash
docker-compose up   # Instala + inicia (isolado)
docker-compose down # Para + limpa
```

## Quando usar cada um?

### Use Docker se:
- ✅ Quer isolamento total
- ✅ Não quer "sujar" o Mac
- ✅ Vai usar em prod também (mesma config)
- ✅ Trabalha com múltiplos projetos Node

### Use Instalação Direta se:
- ✅ Não tem Docker instalado
- ✅ Prefere performance nativa
- ✅ Já usa Node.js em outros projetos
- ✅ Quer desenvolvimento mais ágil (hot reload mais rápido)

## Híbrido (Melhor dos 2 mundos)

Use apenas **PostgreSQL no Docker** e Node.js local:

```bash
# Apenas banco no Docker
docker run -d \
  --name crm-postgres \
  -e POSTGRES_DB=crm_whatsapp \
  -e POSTGRES_USER=crm_user \
  -e POSTGRES_PASSWORD=crm_password \
  -p 5432:5432 \
  postgres:14-alpine

# Backend e Frontend locais (instalação direta)
cd backend && npm run dev
cd frontend && npm run dev
```

**Vantagem:** PostgreSQL isolado + Performance nativa do Node.js

---

## ✅ Minha Recomendação

**Para Mac (desenvolvimento):**
1. **Docker Desktop** (isolamento total, mais seguro)
2. Ou **NVM + PostgreSQL no Docker** (híbrido, boa performance)

**Para VPS (produção):**
- Instalação direta (melhor performance, menos overhead)
- Docker se você já usa em outras aplicações

---

Qual você prefere? Posso criar os arquivos Docker agora! 🐳
