# 📁 Estrutura do Projeto

```
CRM-WhatsApp/
│
├── 📂 backend/                      # API REST Node.js + TypeScript
│   ├── 📂 prisma/
│   │   └── schema.prisma            # Schema do banco de dados
│   │
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   └── database.ts          # Configuração Prisma Client
│   │   │
│   │   ├── 📂 controllers/          # Controllers HTTP
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── lead.controller.ts
│   │   │   ├── message.controller.ts
│   │   │   ├── pipeline.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   ├── automation.controller.ts
│   │   │   ├── template.controller.ts
│   │   │   ├── analytics.controller.ts
│   │   │   └── whatsapp.controller.ts
│   │   │
│   │   ├── 📂 middleware/           # Middlewares
│   │   │   ├── auth.ts              # Autenticação JWT
│   │   │   └── errorHandler.ts      # Tratamento de erros
│   │   │
│   │   ├── 📂 routes/               # Rotas da API
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── lead.routes.ts
│   │   │   ├── message.routes.ts
│   │   │   ├── pipeline.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   ├── automation.routes.ts
│   │   │   ├── template.routes.ts
│   │   │   ├── analytics.routes.ts
│   │   │   └── whatsapp.routes.ts
│   │   │
│   │   ├── 📂 services/             # Lógica de negócio
│   │   │   └── whatsapp.service.ts  # Integração WhatsApp API
│   │   │
│   │   ├── 📂 utils/                # Utilitários
│   │   │   └── logger.ts            # Winston logger
│   │   │
│   │   ├── 📂 types/                # TypeScript types
│   │   │
│   │   └── server.ts                # Entry point
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── env.example                  # Template de variáveis de ambiente
│
├── 📂 frontend/                     # React SPA + TypeScript
│   ├── 📂 public/                   # Assets estáticos
│   │
│   ├── 📂 src/
│   │   ├── 📂 components/           # Componentes React
│   │   │   └── 📂 layout/
│   │   │       └── DashboardLayout.tsx
│   │   │
│   │   ├── 📂 pages/                # Páginas/Views
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── InboxPage.tsx
│   │   │   ├── PipelinePage.tsx
│   │   │   ├── LeadsPage.tsx
│   │   │   ├── TasksPage.tsx
│   │   │   ├── AutomationsPage.tsx
│   │   │   ├── TemplatesPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   │
│   │   ├── 📂 hooks/                # Custom React hooks
│   │   │
│   │   ├── 📂 services/             # Serviços
│   │   │   └── api.ts               # Axios client configurado
│   │   │
│   │   ├── 📂 stores/               # Zustand stores
│   │   │   └── authStore.ts         # Estado global de autenticação
│   │   │
│   │   ├── 📂 types/                # TypeScript types
│   │   │   └── index.ts             # Interfaces globais
│   │   │
│   │   ├── 📂 utils/                # Utilitários
│   │   │
│   │   ├── App.tsx                  # Componente raiz
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Estilos globais
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── env.example
│
├── 📂 docs/                         # Documentação
│   ├── QUICKSTART.md                # Guia rápido de início
│   ├── DEVELOPMENT.md               # Guia de desenvolvimento local
│   ├── DEPLOY_VPS.md                # Guia completo de deploy na VPS
│   ├── ARCHITECTURE.md              # Arquitetura do sistema
│   ├── ROADMAP.md                   # Roadmap e próximos passos
│   └── PROJECT_STRUCTURE.md         # Este arquivo
│
├── .gitignore
└── README.md                        # Visão geral do projeto
```

---

## 📝 Descrição dos Principais Diretórios

### Backend

#### `/backend/prisma/`
Contém o schema do Prisma ORM que define:
- Modelos de dados (tabelas)
- Relacionamentos
- Índices
- Enums

#### `/backend/src/controllers/`
Controllers responsáveis por:
- Receber requisições HTTP
- Validar dados de entrada
- Chamar services/Prisma
- Retornar respostas HTTP

#### `/backend/src/middleware/`
Middlewares para:
- Autenticação JWT
- Autorização por role
- Tratamento de erros
- Rate limiting
- Validação de dados

#### `/backend/src/routes/`
Definição das rotas da API:
- Agrupamento por recurso
- Aplicação de middlewares
- Documentação inline

#### `/backend/src/services/`
Lógica de negócio complexa:
- Integração com APIs externas (WhatsApp)
- Processamento de dados
- Regras de negócio

---

### Frontend

#### `/frontend/src/components/`
Componentes React reutilizáveis:
- Layout components
- UI components (Button, Input, Modal, etc.)
- Feature-specific components

#### `/frontend/src/pages/`
Páginas da aplicação:
- Cada arquivo = uma rota
- Composição de components
- Lógica específica da página

#### `/frontend/src/hooks/`
Custom React hooks para:
- Lógica reutilizável
- Integração com APIs
- State management local

#### `/frontend/src/services/`
Serviços do frontend:
- Cliente HTTP (Axios)
- WebSocket (Socket.io)
- Cache e persistência

#### `/frontend/src/stores/`
Estado global com Zustand:
- Auth store (usuário, token)
- UI store (tema, configurações)
- Feature stores

#### `/frontend/src/types/`
TypeScript interfaces e types:
- Modelos de dados
- Props de components
- API responses

---

## 🗺️ Fluxo de Dados

### Request Backend

```
1. HTTP Request
   ↓
2. Route (routes/*.routes.ts)
   ↓
3. Middleware (auth, validation)
   ↓
4. Controller (controllers/*.controller.ts)
   ↓
5. Service (opcional) (services/*.service.ts)
   ↓
6. Prisma ORM
   ↓
7. PostgreSQL Database
   ↓
8. Response
```

### Request Frontend

```
1. User Action (click, submit)
   ↓
2. Component Event Handler
   ↓
3. API Service (services/api.ts)
   ↓
4. Axios HTTP Client
   ↓
5. Backend API
   ↓
6. Response
   ↓
7. React Query Cache (opcional)
   ↓
8. Component State Update
   ↓
9. UI Re-render
```

---

## 📦 Dependências Principais

### Backend

| Pacote | Descrição |
|--------|-----------|
| `express` | Framework web |
| `@prisma/client` | ORM para PostgreSQL |
| `jsonwebtoken` | Autenticação JWT |
| `bcryptjs` | Hash de senhas |
| `socket.io` | WebSocket para real-time |
| `axios` | Cliente HTTP para WhatsApp API |
| `winston` | Logging |
| `zod` | Validação de schemas |
| `helmet` | Segurança HTTP headers |
| `cors` | Cross-Origin Resource Sharing |

### Frontend

| Pacote | Descrição |
|--------|-----------|
| `react` | Biblioteca UI |
| `react-router-dom` | Roteamento |
| `@tanstack/react-query` | Cache e sincronização de dados |
| `axios` | Cliente HTTP |
| `zustand` | State management |
| `socket.io-client` | WebSocket client |
| `@dnd-kit/*` | Drag and drop |
| `tailwindcss` | CSS utility-first |
| `lucide-react` | Ícones |
| `recharts` | Gráficos |
| `sonner` | Toast notifications |
| `react-hook-form` | Formulários |
| `zod` | Validação |

---

## 🎯 Convenções de Código

### Nomenclatura

- **Arquivos**: `camelCase.ts` ou `PascalCase.tsx` para components
- **Componentes**: `PascalCase`
- **Funções/variáveis**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`
- **Rotas API**: `kebab-case` (`/api/user-settings`)

### Estrutura de Arquivos

```typescript
// 1. Imports externos
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Imports internos (services, types, utils)
import { api } from '@/services/api';
import { User } from '@/types';

// 3. Imports de components
import Button from '@/components/Button';

// 4. Types/Interfaces locais
interface Props {
  user: User;
}

// 5. Componente/Função
export default function Component({ user }: Props) {
  // Hooks
  const [state, setState] = useState();
  const navigate = useNavigate();

  // Handlers
  const handleClick = () => {};

  // Render
  return <div>...</div>;
}
```

### Commits

Seguir padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona inbox de mensagens
fix: corrige erro de autenticação
docs: atualiza README
style: formata código
refactor: refatora controller de leads
test: adiciona testes de integração
chore: atualiza dependências
```

---

## 🔄 Git Workflow

```bash
# 1. Criar branch
git checkout -b feature/nova-funcionalidade

# 2. Fazer alterações e commits
git add .
git commit -m "feat: adiciona nova funcionalidade"

# 3. Push para remote
git push origin feature/nova-funcionalidade

# 4. Abrir Pull Request no GitHub

# 5. Após aprovação, merge para main
git checkout main
git pull origin main
git merge feature/nova-funcionalidade
git push origin main
```

---

## 📚 Recursos Adicionais

- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

---

**Estrutura bem organizada = Código fácil de manter!** 🎯
