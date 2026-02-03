# Arquitetura do Sistema

## 📐 Visão Geral

O CRM WhatsApp é uma aplicação full-stack moderna com arquitetura separada em:

- **Backend**: API REST em Node.js + Express + TypeScript
- **Frontend**: SPA em React + TypeScript
- **Banco de Dados**: PostgreSQL
- **Real-time**: Socket.io para mensagens em tempo real
- **Integração**: WhatsApp Business API oficial

## 🏗️ Arquitetura do Backend

### Camadas

```
┌─────────────────────────────────────┐
│         Rotas (Routes)              │
├─────────────────────────────────────┤
│      Controllers (Lógica HTTP)      │
├─────────────────────────────────────┤
│     Services (Lógica de Negócio)    │
├─────────────────────────────────────┤
│    Prisma ORM (Acesso a Dados)      │
├─────────────────────────────────────┤
│         PostgreSQL Database          │
└─────────────────────────────────────┘
```

### Principais Módulos

#### Autenticação
- JWT para autenticação stateless
- Bcrypt para hash de senhas
- Middleware de autenticação e autorização por role

#### Leads e CRM
- CRUD completo de leads
- Atribuição de leads para agentes
- Sistema de tags e campos customizados
- Histórico de atividades

#### Pipeline de Vendas
- Funil configurável com múltiplos estágios
- Movimentação de leads entre estágios
- Múltiplos pipelines por organização

#### Mensagens WhatsApp
- Integração com WhatsApp Business API
- Webhook para receber mensagens
- Suporte a texto, imagens, áudio, vídeo e documentos
- Status de entrega (enviado, entregue, lido)
- Socket.io para atualização em tempo real

#### Automações
- Triggers configuráveis (nova mensagem, novo lead, mudança de estágio, etc.)
- Condições customizáveis
- Ações automatizadas (enviar mensagem, criar tarefa, atribuir lead, etc.)

#### Templates
- Biblioteca de mensagens rápidas
- Variáveis dinâmicas
- Categorização

#### Analytics
- Métricas de performance
- Conversão por etapa do funil
- Performance da equipe
- Relatórios customizáveis

## 🎨 Arquitetura do Frontend

### Estrutura de Componentes

```
App
├── LoginPage
└── DashboardLayout
    ├── Sidebar (Navegação)
    ├── Header (Usuário, notificações)
    └── Content
        ├── DashboardPage (Overview)
        ├── InboxPage (Mensagens)
        ├── PipelinePage (Funil)
        ├── LeadsPage (Lista de leads)
        ├── TasksPage (Tarefas)
        ├── AutomationsPage (Automações)
        ├── TemplatesPage (Templates)
        ├── AnalyticsPage (Relatórios)
        └── SettingsPage (Configurações)
```

### State Management

- **Zustand**: Estado global (autenticação, usuário)
- **React Query**: Cache e sincronização de dados do servidor
- **React Hook Form**: Gerenciamento de formulários

### Principais Bibliotecas

- **React Router**: Roteamento
- **Axios**: Cliente HTTP
- **Socket.io Client**: WebSocket para real-time
- **@dnd-kit**: Drag and drop para o funil
- **Recharts**: Gráficos e visualizações
- **TailwindCSS**: Estilização
- **Lucide React**: Ícones
- **Sonner**: Notificações toast

## 🔄 Fluxo de Dados

### Mensagem Recebida do WhatsApp

```
WhatsApp → Meta Webhook → Backend Webhook Controller
                                    ↓
                            Criar/Buscar Lead
                                    ↓
                            Salvar Mensagem (DB)
                                    ↓
                            Emitir evento Socket.io
                                    ↓
                            Frontend (atualização em tempo real)
```

### Envio de Mensagem

```
Frontend → API POST /messages/send
              ↓
         WhatsApp Service
              ↓
         WhatsApp Business API
              ↓
         Salvar mensagem (DB)
              ↓
         Socket.io emit
              ↓
         Frontend (confirmação)
```

### Automação

```
Trigger Event → Automation Service
                      ↓
              Verificar condições
                      ↓
              Executar ações
                (enviar msg, criar tarefa, etc.)
```

## 🗄️ Modelo de Dados

### Entidades Principais

- **User**: Usuários do sistema (admins, managers, agents)
- **Team**: Equipes de vendas
- **Lead**: Contatos/prospects
- **Message**: Mensagens do WhatsApp
- **Pipeline**: Funis de vendas
- **Stage**: Etapas do funil
- **Task**: Tarefas e lembretes
- **Automation**: Regras de automação
- **Template**: Templates de mensagens
- **Activity**: Histórico de atividades

### Relacionamentos

```
User ─┬─ 1:N ─→ Lead (criados)
      ├─ 1:N ─→ Lead (atribuídos)
      ├─ 1:N ─→ Message
      ├─ 1:N ─→ Task
      └─ N:M ─→ Team

Lead ─┬─ 1:N ─→ Message
      ├─ 1:N ─→ Task
      ├─ 1:N ─→ Activity
      └─ N:1 ─→ Stage

Pipeline ─┬─ 1:N ─→ Stage
          └─ 1:N ─→ Lead (via Stage)
```

## 🔐 Segurança

### Backend

- JWT com expiração configurável
- Senhas hasheadas com bcrypt (salt rounds: 10)
- Rate limiting em endpoints sensíveis
- Helmet para headers HTTP seguros
- CORS configurável
- Validação de entrada com Zod
- Autorização baseada em roles (RBAC)

### Frontend

- Token JWT em localStorage
- Interceptors Axios para refresh automático
- Validação de formulários
- Sanitização de inputs
- HTTPS obrigatório em produção

## 📊 Performance

### Backend

- Prisma para queries otimizadas
- Índices no banco de dados
- Conexão pool com PostgreSQL
- Cache de sessões
- Compressão de resposta (gzip)

### Frontend

- Code splitting por rota
- Lazy loading de componentes
- React Query para cache inteligente
- Debounce em pesquisas
- Otimização de imagens

## 🔌 Integrações

### WhatsApp Business API

- Webhook para mensagens recebidas
- API REST para envio de mensagens
- Suporte a múltiplos tipos de mídia
- Templates pré-aprovados pela Meta
- Status de entrega em tempo real

### Futuras Integrações Planejadas

- Email (SMTP)
- Zapier / Make (webhooks)
- Google Calendar (tarefas)
- Slack (notificações)
- Stripe (pagamentos)

## 🚀 Escalabilidade

### Horizontal

- Stateless API (múltiplas instâncias)
- Socket.io com Redis adapter (cluster)
- Load balancer (Nginx)
- CDN para assets estáticos

### Vertical

- PostgreSQL com replicas de leitura
- Queue system (Bull/Redis) para jobs pesados
- Cache distribuído (Redis)
- Object storage (S3) para mídia

## 📈 Monitoramento

### Logs

- Winston para logging estruturado
- Níveis: error, warn, info, debug
- Rotação de logs
- Integração com Sentry (erro tracking)

### Métricas

- PM2 para processo management
- New Relic / Datadog (APM)
- Uptime monitoring
- Database query performance

## 🧪 Testes

### Backend

- Jest para testes unitários
- Supertest para testes de integração
- Coverage mínimo: 70%

### Frontend

- React Testing Library
- Jest para testes unitários
- Cypress para E2E (planejado)

## 📱 Responsividade

- Mobile-first design
- Breakpoints TailwindCSS
- Progressive Web App (PWA) ready
- Offline-first para mensagens (planejado)
