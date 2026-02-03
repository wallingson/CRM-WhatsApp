# 🚀 CRM WhatsApp - Plataforma de Vendas Integrada

![Status](https://img.shields.io/badge/status-MVP-blue)
![Node](https://img.shields.io/badge/node-18%2B-green)
![React](https://img.shields.io/badge/react-18-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.7-blue)
![License](https://img.shields.io/badge/license-Proprietário-red)

Sistema CRM completo integrado ao **WhatsApp Business API** com funil de vendas visual, automações inteligentes e gestão de equipe. Similar ao [Kommo (br.kommo.com)](https://br.kommo.com/whatsapp-lead-generation).

---

## ✨ Funcionalidades Principais

### 💬 Inbox Unificado de WhatsApp
- Centralização de todas as conversas do WhatsApp
- Chat em tempo real com Socket.io
- Suporte a texto, imagens, áudio, vídeo e documentos
- Status de mensagens (enviado, entregue, lido)
- Webhook para recebimento automático

### 📊 Funil de Vendas Visual
- Pipeline personalizável com etapas configuráveis
- Interface drag-and-drop para movimentação de leads
- Múltiplos funis por equipe
- Indicadores visuais de progresso

### 🤖 Automações e Chatbots
- Triggers configuráveis (nova mensagem, novo lead, mudança de estágio)
- Ações automatizadas (enviar mensagem, criar tarefa, atribuir lead)
- Templates de mensagens rápidas
- Respostas automáticas

### 👥 Gestão de Equipe
- Controle de acesso por roles (Admin, Manager, Agent)
- Atribuição de leads para agentes
- Histórico de atividades
- Permissões granulares

### 📈 Analytics e Relatórios
- Dashboard com métricas em tempo real
- Taxa de conversão por etapa
- Performance da equipe
- Relatórios customizáveis

---

## 🛠️ Stack Tecnológica

### Backend
- **Node.js 18+** + **Express** - API REST
- **TypeScript** - Type safety
- **PostgreSQL 14+** - Banco de dados relacional
- **Prisma ORM** - Database toolkit
- **JWT** - Autenticação stateless
- **Socket.io** - WebSocket para real-time
- **WhatsApp Business API** - Integração oficial Meta
- **Winston** - Logging estruturado

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **TailwindCSS** - Utility-first CSS
- **React Query** - Cache e sincronização de dados
- **Zustand** - State management leve
- **@dnd-kit** - Drag and drop
- **Recharts** - Gráficos interativos
- **Socket.io Client** - WebSocket client
- **Lucide React** - Ícones

### Infraestrutura
- **Nginx** - Proxy reverso e servidor web
- **PM2** - Process manager
- **Certbot** - SSL/HTTPS automático
- **VPS Hostgator** - Hospedagem otimizada

---

## 📦 Estrutura do Projeto

```
CRM-WhatsApp/
├── 📂 backend/          # API REST Node.js + TypeScript
│   ├── prisma/          # Schema do banco de dados
│   └── src/
│       ├── config/      # Configurações
│       ├── controllers/ # Controllers HTTP
│       ├── middleware/  # Middlewares (auth, error)
│       ├── routes/      # Rotas da API
│       ├── services/    # Lógica de negócio
│       └── utils/       # Utilitários
│
├── 📂 frontend/         # React SPA + TypeScript
│   └── src/
│       ├── components/  # Componentes React
│       ├── pages/       # Páginas/Views
│       ├── services/    # Serviços (API client)
│       ├── stores/      # Zustand stores
│       └── types/       # TypeScript types
│
└── 📂 docs/            # Documentação completa
    ├── QUICKSTART.md        # Início rápido (5min)
    ├── DEVELOPMENT.md       # Guia de desenvolvimento
    ├── DEPLOY_VPS.md        # Deploy na VPS Hostgator
    ├── ARCHITECTURE.md      # Arquitetura do sistema
    ├── ROADMAP.md           # Roadmap e próximos passos
    └── PROJECT_STRUCTURE.md # Estrutura detalhada
```

---

## 🚀 Início Rápido

### ⚡ Opção 1: Deploy Instantâneo - RECOMENDADO (15 minutos)

**MVP online HOJE sem instalar nada!**

```bash
1. Suba código para GitHub (5 min)
2. Deploy backend no Railway.app (5 min) - Grátis
3. Deploy frontend no Vercel.com (3 min) - Grátis
4. Criar admin e acessar (2 min)
```

✅ **Zero instalação** no Mac  
✅ **Zero configuração** VPS  
✅ **$0-15/mês** (vs $30-80 VPS)  
✅ **SSL automático**  

**📖 Guia completo:** [COMECE_AQUI.md](./COMECE_AQUI.md) | [DEPLOY_RAPIDO.md](./DEPLOY_RAPIDO.md)

---

### 🖥️ Opção 2: Desenvolvimento Local (30 minutos)

```bash
# 1. Clone o projeto
git clone https://github.com/seu-usuario/CRM-WhatsApp.git
cd CRM-WhatsApp

# 2. Backend
cd backend
npm install
cp env.example .env
# Edite o .env com suas configurações
createdb crm_whatsapp
npx prisma generate
npx prisma migrate dev
npm run dev

# 3. Frontend (nova aba)
cd ../frontend
npm install
cp env.example .env
npm run dev

# 4. Acesse http://localhost:5173
```

**📖 Guia completo:** [docs/QUICKSTART.md](./docs/QUICKSTART.md) | [INSTALACAO_MAC.md](./INSTALACAO_MAC.md)

---

### 🌐 Opção 3: Deploy na VPS Própria (2-3 horas)

```bash
# Conecte na VPS e instale dependências
ssh root@seu-ip-vps
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql nginx
sudo npm install -g pm2

# Clone e configure
cd /var/www
git clone https://github.com/seu-usuario/CRM-WhatsApp.git
cd CRM-WhatsApp/backend
npm install && npm run build
pm2 start dist/server.js --name crm-backend

# Configure Nginx e SSL
sudo certbot --nginx -d seudominio.com
```

**📖 Guia completo:** [docs/DEPLOY_VPS.md](./docs/DEPLOY_VPS.md) | [ANALISE_RISCOS.md](./ANALISE_RISCOS.md)

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [QUICKSTART.md](./docs/QUICKSTART.md) | Guia rápido de início (5-30min) |
| [DEVELOPMENT.md](./docs/DEVELOPMENT.md) | Desenvolvimento local completo |
| [DEPLOY_VPS.md](./docs/DEPLOY_VPS.md) | Deploy detalhado na VPS Hostgator |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Arquitetura e decisões técnicas |
| [ROADMAP.md](./docs/ROADMAP.md) | Roadmap e funcionalidades futuras |
| [PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) | Estrutura de arquivos e pastas |

---

## 🔐 Configuração do WhatsApp Business API

1. **Criar conta Meta for Developers**
   - Acesse: https://developers.facebook.com/
   - Crie um App e adicione o produto WhatsApp

2. **Configurar Webhook**
   - URL: `https://seudominio.com/api/whatsapp/webhook`
   - Verify Token: defina no `.env` como `WHATSAPP_VERIFY_TOKEN`
   - Eventos: `messages` e `message_status`

3. **Obter Credenciais**
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_BUSINESS_ACCOUNT_ID`

4. **Atualizar .env e reiniciar**
   ```bash
   pm2 restart crm-backend
   ```

---

## 🎯 Roadmap

### ✅ MVP Atual (Concluído)
- Estrutura completa backend + frontend
- Autenticação JWT com roles
- Integração WhatsApp Business API
- CRUD de leads, mensagens, tarefas
- Sistema de funil de vendas
- Automações e templates
- Analytics básico
- Deploy para VPS documentado

### 🚧 Fase 2 (Em Desenvolvimento)
- Inbox completo com chat em tempo real
- Funil visual com drag-and-drop
- Gestão avançada de leads
- Automações visuais (builder de fluxos)
- Analytics avançado com gráficos

### 🔮 Futuro
- Mobile app (React Native)
- Integrações (Zapier, Slack, Google Calendar)
- IA e chatbots inteligentes (NLP)
- Multi-tenant (SaaS)
- Omnichannel (Instagram, Messenger, SMS)

**📖 Roadmap completo:** [docs/ROADMAP.md](./docs/ROADMAP.md)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/CRM-WhatsApp/issues) com:
- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (OS, Node version, etc.)

---

## 📞 Suporte

- **Issues:** https://github.com/seu-usuario/CRM-WhatsApp/issues
- **Email:** suporte@seudominio.com
- **Documentação:** [docs/](./docs/)

---

## 📄 Licença

Este projeto é **proprietário**. Todos os direitos reservados.

Para licenciamento comercial, entre em contato: contato@seudominio.com

---

## 🌟 Créditos

Desenvolvido com ❤️ inspirado em [Kommo](https://br.kommo.com/)

**Stack Moderna** • **Código Limpo** • **Documentação Completa** • **Deploy Simples**

---

**Pronto para começar?** 🚀 Veja o [QUICKSTART.md](./docs/QUICKSTART.md)
