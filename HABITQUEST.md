# 🏆 HabitQuest — Sistema de Hábitos com Conquistas

> Gamificação de hábitos diários inspirada em achievements do Xbox.
> Deploy via Docker no OrangePi, acesso remoto via VPN.

---

## 🧬 DNA do Projeto

### Extreme Programming (XP)

- **Pair Programming** — Copilot como par permanente
- **TDD** — Red → Green → Refactor (SEMPRE teste primeiro)
- **Refactoring contínuo** — código limpo a cada commit
- **Small Releases** — features incrementais, sempre deployável
- **Simple Design** — YAGNI, sem over-engineering
- **Collective Ownership** — qualquer parte do código pode ser melhorada
- **Continuous Integration** — Husky + lint-staged garantem qualidade

### 🧪 TDD (Red → Green → Refactor)

```
1. Escreve o teste (RED) — descreve o comportamento esperado
2. Implementa o mínimo (GREEN) — faz o teste passar
3. Refatora (REFACTOR) — melhora sem quebrar
```

- Cobertura mínima: **80% domínio**, **70% geral**
- Nenhum código de produção sem teste correspondente

### 🧱 SOLID

| Princípio                     | Aplicação                                   |
| ----------------------------- | ------------------------------------------- |
| **S** - Single Responsibility | Cada classe/módulo faz UMA coisa            |
| **O** - Open/Closed           | Extensível sem modificar (strategy pattern) |
| **L** - Liskov Substitution   | Repositórios intercambiáveis                |
| **I** - Interface Segregation | Interfaces enxutas e focadas                |
| **D** - Dependency Inversion  | Use Cases dependem de abstrações            |

### 🧹 Clean Code

- Nomes expressivos (`completeHabitForToday`, não `doStuff`)
- Funções pequenas (max ~20 linhas)
- Zero comentários óbvios — código auto-documentável
- Early returns, guard clauses
- DRY sem ser fanático — clareza > abstração prematura

### 🔒 Quality Gates (Husky + lint-staged)

| Hook           | Ação                                             |
| -------------- | ------------------------------------------------ |
| **pre-commit** | lint-staged → ESLint + Prettier nos staged files |
| **pre-push**   | Roda TODOS os testes (unit + integration)        |
| **commit-msg** | commitlint (conventional commits)                |

Formato de commit: `feat(habit): add daily check-in toggle`

---

## Stack

| Camada        | Tech                                                 |
| ------------- | ---------------------------------------------------- |
| Frontend      | React 18 + Vite + TailwindCSS                        |
| Backend       | Node.js + Express + TypeScript                       |
| Database      | SQLite (leve, ideal pro OrangePi)                    |
| Testes        | Vitest + Supertest + Testing Library                 |
| Quality       | Husky + lint-staged + ESLint + Prettier + commitlint |
| Notifications | Web Push API (Service Worker)                        |
| WhatsApp      | Evolution API (futuro)                               |
| Deploy        | Docker + Docker Compose                              |

---

## 🏗️ Arquitetura DDD

```
src/
├── domain/              # Coração — regras de negócio puras
│   ├── entities/        # Habit, Achievement, Checkin
│   ├── value-objects/   # Streak, TargetDays, HabitName
│   ├── repositories/    # Interfaces (contracts)
│   └── services/        # Domain services
├── application/         # Orquestração — Use Cases
│   └── use-cases/       # CompleteHabit, UnlockAchievement
├── infrastructure/      # Implementação concreta
│   ├── repositories/    # SQLiteHabitRepository
│   ├── database/        # Migrations, connection
│   └── services/        # NotificationService impl
└── presentation/        # HTTP layer
    ├── controllers/
    ├── routes/
    ├── middlewares/
    └── dtos/
```

---

## 🧪 Estratégia de Testes

| Tipo        | Ferramenta          | Alvo                               | Hook     |
| ----------- | ------------------- | ---------------------------------- | -------- |
| Unit        | Vitest              | Entities, Use Cases, Value Objects | pre-push |
| Integration | Vitest + Supertest  | API endpoints, DB queries          | pre-push |
| Component   | Testing Library     | Componentes React isolados         | pre-push |
| E2E         | Playwright (futuro) | Fluxos completos                   | CI       |

---

## 📦 Epics & Features

### 🟢 EPIC 1 — Setup & Quality Gates

| ID  | Feature                                              | Status |
| --- | ---------------------------------------------------- | ------ |
| 1.1 | Monorepo structure (packages/api + packages/web)     | ✅     |
| 1.2 | Backend: Express + TypeScript + DDD folders          | ✅     |
| 1.3 | Frontend: Vite + React + Tailwind                    | ✅     |
| 1.4 | Husky + lint-staged + commitlint + ESLint + Prettier | ✅     |
| 1.5 | Vitest config (unit + integration)                   | ✅     |
| 1.6 | Docker + docker-compose (dev + prod)                 | ✅     |
| 1.7 | API REST básica — health check + CRUD habits (TDD)   | ✅     |

### 🟡 EPIC 2 — Hábitos Diários (Core)

| ID  | Feature                                              | Status |
| --- | ---------------------------------------------------- | ------ |
| 2.1 | Entity: Habit (name, targetDays, active, icon)       | ✅     |
| 2.2 | Value Objects: HabitName, TargetDays, Streak         | ✅     |
| 2.3 | Use Case: CreateHabit                                | ✅     |
| 2.4 | Use Case: CompleteHabitForToday                      | ✅     |
| 2.5 | Use Case: ListTodayHabits (com status check/uncheck) | ✅     |
| 2.6 | Tela principal: lista de hábitos do dia              | ✅     |
| 2.7 | Toggle check/uncheck com feedback visual             | ✅     |
| 2.8 | Streak counter (dias consecutivos)                   | ✅     |
| 2.9 | Histórico (calendário de check-ins)                  | ⬜     |

### 🔵 EPIC 3 — Sistema de Conquistas ✅

| ID  | Feature                                                 | Status |
| --- | ------------------------------------------------------- | ------ |
| 3.1 | Entity: Achievement (habit, target, progress, unlocked) | ✅     |
| 3.2 | Use Case: EvaluateAchievements (dispara após check-in)  | ✅     |
| 3.3 | Barra de progresso por hábito (45/90 = 50%)             | ✅     |
| 3.4 | Tela de conquistas (grid cards)                         | ✅     |
| 3.5 | Animação "pop" ao desbloquear                           | ✅     |
| 3.6 | Badge dourado vs cinza (locked/unlocked)                | ✅     |
| 3.7 | Som/vibração ao desbloquear                             | ✅     |

### 🟣 EPIC 4 — Push Notifications ✅

| ID  | Feature                                    | Status |
| --- | ------------------------------------------ | ------ |
| 4.1 | Service Worker registration                | ✅     |
| 4.2 | Permissão de notificação                   | ✅     |
| 4.3 | Horários configuráveis (8h, 14h, 21h)      | ✅     |
| 4.4 | "Faltam X hábitos pro dia perfeito"        | ✅     |
| 4.5 | "Faltam 3 dias pra conquista da academia!" | ✅     |

### 🔴 EPIC 5 — WhatsApp (Futuro)

| ID  | Feature                  |
| --- | ------------------------ |
| 5.1 | Integração Evolution API |
| 5.2 | Config número destino    |
| 5.3 | Lembretes 3x/dia         |
| 5.4 | Resumo noturno           |

### ✅ EPIC 6 — UX & Polish

| ID  | Feature                                        | Status |
| --- | ---------------------------------------------- | ------ |
| 6.1 | Dark mode (padrão)                             | ✅     |
| 6.2 | PWA (instalar como app)                        | ✅     |
| 6.3 | Mobile-first responsivo                        | ✅     |
| 6.4 | Dashboard stats (total conquistas, streak máx) | ✅     |
| 6.5 | Animações (framer-motion)                      | ✅     |

### ✅ EPIC 7 — Autenticação (Final)

| ID  | Feature                                  | Status |
| --- | ---------------------------------------- | ------ |
| 7.1 | Entity: User (email, passwordHash, name) | ✅     |
| 7.2 | Registro + Login (JWT)                   | ✅     |
| 7.3 | Middleware auth                          | ✅     |
| 7.4 | Tela login/registro                      | ✅     |
| 7.5 | Hábitos vinculados a user_id             | ✅     |
| 7.6 | Refresh token + logout                   | ✅     |

### 🖼️ EPIC 8 — Gerador de Wallpaper de Conquistas

| ID  | Feature                                                             |
| --- | ------------------------------------------------------------------- |
| 8.1 | Página `/wallpaper` com grid de conquistas selecionáveis            |
| 8.2 | Escolha de orientação: Vertical (1080×1920) / Horizontal (1920×1080)|
| 8.3 | Canvas renderer (gradient bg + achievements em grid + progress bars)|
| 8.4 | Preview ao vivo do wallpaper conforme seleciona                     |
| 8.5 | Download como PNG (botão "Baixar Wallpaper")                        |
| 8.6 | Temas de cor: Dark (preto/dourado), Light (branco/azul), Neon       |
| 8.7 | Título customizável (frase motivacional no topo)                    |
| 8.8 | Stats no rodapé (X/Y desbloqueadas, streak máximo)                  |

> **Tech:** Canvas API (100% client-side, zero dependências). Gera imagem para o usuário
> usar como fundo de tela no celular ou computador — lembrete visual das metas.

### 🎨 EPIC 9 — UI/UX Juice (Rebranding Gamificado)

> **Inspiração:** Nubank, Uber, iFood, Duolingo — plataformas viciantes e gamificadas.

| ID   | Feature                                                                        |
| ---- | ------------------------------------------------------------------------------ |
| 9.1  | Rebranding de cores: paleta vibrante com gradients (neon/gold accents)         |
| 9.2  | Iconografia custom: ícones animados (Lottie) em vez de emojis                  |
| 9.3  | Micro-interações: haptic feedback, confetti ao completar, som de "level up"    |
| 9.4  | Onboarding gamificado (tutorial interativo com progress bar)                   |
| 9.5  | Barra de XP global: nível do usuário baseado em atividade total                |
| 9.6  | Daily rewards: streak visual estilo calendário com chamas                      |
| 9.7  | Animações de transição de página (page transitions suaves)                     |
| 9.8  | Card redesign: glassmorphism + brilho na borda ao completar                    |
| 9.9  | Empty states ilustrados (sem hábitos, sem conquistas, etc.)                    |
| 9.10 | Loading skeletons + pull-to-refresh no mobile                                  |
| 9.11 | Tema dinâmico: cor do header muda conforme progresso do dia (vermelho→verde)   |

> **Objetivo:** Criar a sensação de "just one more" — o usuário quer abrir o app por vício positivo.

### 👥 EPIC 10 — Social (Amigos & Perfil)

| ID    | Feature                                                                      |
| ----- | ---------------------------------------------------------------------------- |
| 10.1  | Username/nickname único (perfil público simplificado)                        |
| 10.2  | Busca de amigos por nickname                                                 |
| 10.3  | Envio/aceite de solicitação de amizade                                       |
| 10.4  | Lista de amigos + status online/streak atual                                 |
| 10.5  | Configuração de privacidade: escolher quais hábitos compartilhar (default: nenhum) |
| 10.6  | Perfil público: exibe conquistas + hábitos permitidos + streak record        |
| 10.7  | Comparação lado-a-lado (meu progresso vs amigo)                             |
| 10.8  | Feed de atividades: "Fulano completou 30 dias de X 🔥"                      |
| 10.9  | Ranking/Leaderboard entre amigos (streak, conquistas)                        |
| 10.10 | Bloquear/remover amigo                                                       |

> **Privacidade:** Nenhum hábito é público por padrão. O usuário opta-in individualmente.

### 👨‍👩‍👧‍👦 EPIC 11 — Grupos & Metas Conjuntas

| ID    | Feature                                                                      |
| ----- | ---------------------------------------------------------------------------- |
| 11.1  | Criar grupo (nome, descrição, ícone, até 20 membros)                        |
| 11.2  | Convidar amigos para grupo (link ou nickname)                                |
| 11.3  | Meta conjunta: definir hábito compartilhado (ex: "todo mundo meditar 30 dias")|
| 11.4  | Dashboard do grupo: progresso coletivo + individual                          |
| 11.5  | Chat simples no grupo (mensagens motivacionais)                              |
| 11.6  | Conquista de grupo: "Squad Goal" (todos completam meta)                      |
| 11.7  | Notificação: "3/5 do grupo já completaram hoje, falta você!"                |
| 11.8  | Ranking interno do grupo (quem está mais consistente)                        |
| 11.9  | Sair do grupo / admin pode remover membro                                   |

### 🧠 EPIC 12 — Área de Motivação & Afirmações

> **Inspiração:** Mentalidade de campeão — Michael Jackson, Kanye West, Muhammad Ali.
> Afirmar quem você quer ser até se tornar realidade.

| ID    | Feature                                                                      |
| ----- | ---------------------------------------------------------------------------- |
| 12.1  | Seção "Minhas Afirmações": criar frases pessoais (ex: "Eu sou o melhor dev")|
| 12.2  | Rotação diária: afirmação destaque muda todo dia (ou aleatória)             |
| 12.3  | Tela de afirmação morning ritual: ao abrir app, exibe frase full-screen      |
| 12.4  | Banco de imagens motivacionais (upload pessoal ou galeria curada)            |
| 12.5  | Vision Board: montar quadro visual com imagens + frases                      |
| 12.6  | Widget de afirmação (notificação push com afirmação do dia)                  |
| 12.7  | Histórico de afirmações (marcar como "manifested" quando conquistar)         |
| 12.8  | Compartilhar afirmação como story (imagem gerada com a frase)                |

> **Mindset:** Repetição cria crença. Crença cria ação. Ação cria resultado.

### 📤 EPIC 13 — Compartilhamento Social

| ID    | Feature                                                                      |
| ----- | ---------------------------------------------------------------------------- |
| 13.1  | Gerar card de progresso individual (imagem com stats bonitos)                |
| 13.2  | Gerar card de progresso de grupo                                             |
| 13.3  | Share to Instagram Stories (formato 9:16, fundo gradiente)                   |
| 13.4  | Share to WhatsApp / Telegram / Twitter (link + preview)                      |
| 13.5  | Deep link: ao clicar no share, amigo vai pra perfil público no app           |
| 13.6  | Template customizável: escolher tema/cor do card de compartilhamento          |
| 13.7  | "Conquista nova!" — auto-gerar imagem ao desbloquear achievement             |
| 13.8  | QR Code do perfil para adicionar amigo presencialmente                       |

### 💰 EPIC 14 — Monetização (Free vs Premium)

| ID    | Feature                                                                      |
| ----- | ---------------------------------------------------------------------------- |
| 14.1  | Definição de tiers: Free / Premium                                           |
| 14.2  | **Free tier:** máx 5 hábitos, 1 grupo, notificação push apenas              |
| 14.3  | **Premium:** hábitos ilimitados, grupos ilimitados, WhatsApp + email notif.  |
| 14.4  | Premium: temas exclusivos, wallpaper generator avançado                      |
| 14.5  | Premium: analytics avançados (gráficos de streak, heatmap de atividade)      |
| 14.6  | Paywall UI: tela bonita mostrando benefícios (estilo Spotify/iFood)          |
| 14.7  | Integração pagamento: Stripe (cartão) + PIX (Brasil)                        |
| 14.8  | Planos: Mensal (R$14,90) / Anual (R$119,90 = 2 meses grátis)               |
| 14.9  | Trial: 7 dias premium grátis ao registrar                                    |
| 14.10 | Webhook de pagamento + atualização de tier no banco                          |
| 14.11 | Controle de limites no backend (middleware de tier)                          |

> **Estratégia:** Free generoso o suficiente pra viciar. Premium pra quem quer escalar.

### 🔒 EPIC 15 — Infraestrutura SaaS (Segurança & Deploy)

| ID    | Feature                                                                      |
| ----- | ---------------------------------------------------------------------------- |
| 15.1  | Rate limiting (express-rate-limit): 100 req/min por IP                      |
| 15.2  | Helmet.js: headers de segurança (CSP, HSTS, X-Frame-Options)               |
| 15.3  | CORS configurado (só domínios permitidos em produção)                       |
| 15.4  | Validação de input com Zod em todos endpoints                                |
| 15.5  | LGPD: endpoint de exportação de dados pessoais + exclusão de conta           |
| 15.6  | LGPD: termos de uso + política de privacidade (aceite no registro)           |
| 15.7  | DDoS protection: Cloudflare (free tier) como proxy                          |
| 15.8  | Database: migrar para PostgreSQL (Supabase ou Neon.tech — free tier)         |
| 15.9  | Deploy backend: Railway / Render (free tier com auto-sleep)                  |
| 15.10 | Deploy frontend: Vercel (free, edge, CDN global)                            |
| 15.11 | CI/CD: GitHub Actions (lint + test + deploy automático)                      |
| 15.12 | Monitoramento: Sentry (erros) + Uptime Robot (disponibilidade)              |
| 15.13 | Backup automático do banco (cron diário)                                     |
| 15.14 | Variáveis de ambiente seguras (secrets no deploy, nunca no código)           |
| 15.15 | Requisições otimizadas: cache Redis (hot data), pagination, gzip             |

> **Princípio:** Menor superfície de ataque. Menor custo. Máxima resiliência.
> Plataforma sugerida: **Vercel (front) + Railway (back) + Neon.tech (Postgres) + Cloudflare (CDN/DDoS)**

---

## Roadmap de Lançamento

| Fase          | EPICs                   | Objetivo                          |
| ------------- | ----------------------- | --------------------------------- |
| **MVP Local** | 1–4, 6–7 ✅            | App funcional single-user         |
| **Polish**    | 8, 9                    | UX viciante + visual PRO          |
| **Social**    | 10, 11, 13              | Viralização + retenção por grupo  |
| **Mindset**   | 12                      | Diferencial emocional             |
| **SaaS**      | 14, 15                  | Monetização + deploy seguro       |
| **Growth**    | 5 (WhatsApp)            | Canal de retenção premium         |

---

## Sprints (XP - Small Releases)

### Sprint 1 — Fundação + Quality Gates ✅

> 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7

### Sprint 2 — Core Habits (TDD) ✅

> 2.1 → 2.7 (domain + API + tela principal)

### Sprint 3 — Conquistas ✅

> 3.1 → 3.6

### Sprint 4 — Notifications & PWA ✅

> 4.1 → 4.4, 6.2, 6.3

### Sprint 5 — Polish & Auth ✅

> 6.1, 6.4, 6.5, 7.1 → 7.6

### Sprint 6 — Visual Juice 🎨

> 9.1 → 9.11 (rebranding + gamificação visual)

### Sprint 7 — Wallpaper + Sharing

> 8.1 → 8.8, 13.1 → 13.8

### Sprint 8 — Social

> 10.1 → 10.10 (amigos + perfil)

### Sprint 9 — Grupos & Motivação

> 11.1 → 11.9, 12.1 → 12.8

### Sprint 10 — SaaS & Monetização

> 14.1 → 14.11, 15.1 → 15.15

---

## Regras de Negócio

- Hábito só pode ser checkado **1x por dia**
- Conquista desbloqueia quando `dias_completados >= meta_dias`
- Dias **não** precisam ser consecutivos (streak é bônus visual)
- Dia perfeito = todos os hábitos ativos completados
- Notificações configuráveis por horário
- Conquistas são auto-geradas ao criar hábito (milestone: 25%, 50%, 75%, 100%)

---

## Modelo de Dados (SQLite)

```sql
CREATE TABLE habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  target_days INTEGER NOT NULL,
  icon TEXT DEFAULT '🎯',
  active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL,
  date DATE NOT NULL,
  FOREIGN KEY (habit_id) REFERENCES habits(id),
  UNIQUE(habit_id, date)
);

CREATE TABLE achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_days INTEGER NOT NULL,
  unlocked BOOLEAN DEFAULT 0,
  unlocked_at DATETIME,
  FOREIGN KEY (habit_id) REFERENCES habits(id)
);

CREATE TABLE notification_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reminder_times TEXT DEFAULT '08:00,14:00,21:00',
  enabled BOOLEAN DEFAULT 1
);
```
