# 🏆 HabitQuest — Sistema de Hábitos com Conquistas

> Gamificação de hábitos diários inspirada em achievements do Xbox.
> Deploy via Cloudflare (Pages + Workers + D1) — 100% free tier.

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
| Backend       | Node.js + Express + TypeScript (prod: Hono + Workers) |
| Database      | SQLite (dev) / Cloudflare D1 (prod)                  |
| Testes        | Vitest + Supertest + Testing Library                 |
| Quality       | Husky + lint-staged + ESLint + Prettier + commitlint |
| Auth          | JWT + Google OAuth2 (@react-oauth/google)            |
| Notifications | Web Push API (Service Worker)                        |
| WhatsApp      | Evolution API (futuro — premium only)                |
| Deploy        | Cloudflare (Pages + Workers + D1)                    |
| CI/CD         | GitHub Actions → auto-deploy Cloudflare              |

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
> Plataforma: **Cloudflare (Pages + Workers + D1)** — infraestrutura definida no EPIC 18.

### ✅ EPIC 16 — Login com Google (OAuth2)

| ID    | Feature                                                                      | Status |
| ----- | ---------------------------------------------------------------------------- | ------ |
| 16.1  | Backend: rota POST /auth/google (recebe Google ID token)                    | ✅     |
| 16.2  | Backend: verificar token com Google API (google-auth-library)                | ✅     |
| 16.3  | Backend: criar/vincular user automaticamente (email do Google)               | ✅     |
| 16.4  | Backend: retornar JWT access+refresh token (mesmo fluxo do login normal)     | ✅     |
| 16.5  | Frontend: botão "Entrar com Google" na tela de login                         | ✅     |
| 16.6  | Frontend: Google Sign-In SDK (@react-oauth/google)                           | ✅     |
| 16.7  | Frontend: fluxo seamless (1 clique → logado)                                 | ✅     |
| 16.8  | Vincular conta existente: se email já existe, faz merge (não duplica)        | ✅     |

> **Tech:** google-auth-library (backend) + @react-oauth/google (frontend).
> Não precisa de senha quando vem pelo Google. O user ganha `authProvider: 'google'` no banco.

### 🚀 EPIC 17 — Onboarding & Perfil

| ID    | Feature                                                                      |
| ----- | ---------------------------------------------------------------------------- |
| 17.1  | Página de perfil (`/profile`) com avatar, nome, email                       |
| 17.2  | Editar perfil: alterar nome, avatar                                          |
| 17.3  | Onboarding flow: 3 steps após primeiro login (Google ou email)              |
| 17.4  | Step 1: "Bem-vindo!" — configurar nome/foto (se Google, já preenche)         |
| 17.5  | Step 2: "Seus primeiros hábitos" — escolher 3 hábitos de uma lista sugerida |
| 17.6  | Step 3: "Como funciona" — mini-tutorial (check-in, streak, conquistas)       |
| 17.7  | Hábitos sugeridos: Meditação, Exercício, Leitura, Água, Sono, Código, etc.  |
| 17.8  | Marcar onboarding como completo (flag no user, não mostra novamente)         |
| 17.9  | Link para perfil no Header (avatar ou iniciais)                             |

### ☁️ EPIC 18 — Deploy Cloudflare (Lançamento Produção)

> **Objetivo:** Hospedar TUDO no Cloudflare free tier. Zero custo. Global CDN. Auto-scale.

| ID    | Feature                                                                      |
| ----- | ---------------------------------------------------------------------------- |
| 18.1  | **Frontend:** Cloudflare Pages (static build do Vite React)                 |
| 18.2  | **Backend:** Cloudflare Workers (migrar Express → Hono ou adapter)          |
| 18.3  | **Database:** Cloudflare D1 (SQLite serverless — substitui better-sqlite3)  |
| 18.4  | **Auth secrets:** Cloudflare Workers Secrets (env vars seguras)             |
| 18.5  | **Domínio custom:** Configurar DNS no Cloudflare (free SSL automático)      |
| 18.6  | **CI/CD:** GitHub Actions → deploy automático no push (Pages + Workers)     |
| 18.7  | **Rate limiting:** Cloudflare WAF rules (free tier: 5 custom rules)         |
| 18.8  | **DDoS:** Proteção automática incluída no Cloudflare free                   |
| 18.9  | **Cache:** Cloudflare CDN para assets estáticos (auto)                      |
| 18.10 | **Wrangler config:** wrangler.toml para Workers + D1 bindings               |
| 18.11 | **Migration D1:** Adaptar schema SQL para Cloudflare D1                     |
| 18.12 | **CORS/Headers:** Configurar headers de segurança via _headers file         |
| 18.13 | **Preview deploys:** Branch previews automáticos no Cloudflare Pages        |
| 18.14 | **Monitoring:** Cloudflare Analytics (grátis) + Workers Logs                |

> **Stack produção Cloudflare (100% free tier):**
>
> | Componente | Serviço Cloudflare | Limite Free |
> |---|---|---|
> | Frontend | Pages | Unlimited bandwidth, 500 builds/mês |
> | Backend API | Workers | 100k requests/dia, 10ms CPU/req |
> | Database | D1 | 5GB storage, 5M reads/dia, 100k writes/dia |
> | CDN/Cache | Automático | Ilimitado |
> | SSL | Universal SSL | Grátis + auto-renew |
> | DDoS | Always-on | Layer 3/4/7 gratuito |
> | DNS | Cloudflare DNS | Fastest DNS global |
> | Secrets | Workers Secrets | Ilimitado |
>
> **Nota sobre Workers:** Express não roda direto em Workers. Opções:
> 1. **Hono** (drop-in replacement, 14KB, feito pra Workers) — recomendado
> 2. **itty-router** (micro-router pra Workers)
> 3. **@cloudflare/workers-types** + fetch handler manual
>
> **Migração recomendada:**
> - Express routes → Hono routes (sintaxe quase idêntica)
> - better-sqlite3 → D1 client (SQL compatível, async)
> - dotenv → Workers Secrets (wrangler secret put)
> - fs/path → não disponível (serverless = stateless)

### 📱 EPIC 19 — App Mobile (Capacitor — APK/IPA)

> **Objetivo:** Transformar o app Vite React em app nativo Android/iOS usando Capacitor.
> O app continua sendo web (mesma codebase), mas roda dentro de um WebView nativo com acesso a APIs do celular.

| ID    | Feature                                                                      |
| ----- | ---------------------------------------------------------------------------- |
| 19.1  | Instalar Capacitor no monorepo (`@capacitor/core` + `@capacitor/cli`)       |
| 19.2  | `npx cap init` — configurar nome, bundle ID (com.habitquest.app)            |
| 19.3  | Adicionar plataforma Android (`npx cap add android`)                        |
| 19.4  | Adicionar plataforma iOS (`npx cap add ios`) — opcional, requer Mac         |
| 19.5  | Configurar `capacitor.config.ts` (server URL dev/prod, plugins)             |
| 19.6  | Build pipeline: `vite build` → `npx cap sync` → APK                        |
| 19.7  | **Plugin: Push Notifications** — `@capacitor/push-notifications` (nativo)   |
| 19.8  | **Plugin: Haptics** — `@capacitor/haptics` (vibração ao completar hábito)   |
| 19.9  | **Plugin: Local Notifications** — lembretes mesmo offline                   |
| 19.10 | **Plugin: Status Bar** — customizar cor da status bar (dark theme)           |
| 19.11 | **Plugin: Splash Screen** — tela de loading customizada com logo            |
| 19.12 | **Plugin: App Badge** — badge com número de hábitos pendentes               |
| 19.13 | Splash screen + app icon (gerar em todos os tamanhos necessários)            |
| 19.14 | Deep links: abrir app direto em hábito/conquista via URL                     |
| 19.15 | Testar em dispositivo real via `npx cap run android`                         |
| 19.16 | Gerar APK assinado (release build) para distribuição direta                  |
| 19.17 | Configurar live reload em dev (`npx cap run android --livereload`)           |

> **Por que Capacitor (e não React Native)?**
> - ✅ Mesma codebase (zero rewrite)
> - ✅ Todos os plugins nativos (push, haptics, camera, etc.)
> - ✅ Build APK/IPA direto
> - ✅ Mantido pela Ionic (empresa grande, estável)
> - ✅ Hot reload em dev
> - ✅ Pode publicar na Play Store / App Store
> - ✅ PWA + Nativo com mesmo código
>
> **Alternativas descartadas:**
> - **TWA (Trusted Web Activity):** Só Chrome, sem acesso a APIs nativas, sem iOS
> - **React Native:** Rewrite completo, codebase separada
> - **Flutter:** Linguagem diferente (Dart), rewrite total
> - **Electron:** Desktop only, não mobile
>
> **Requisitos:**
> - Android Studio instalado (para build APK)
> - JDK 17+ (para Gradle)
> - Xcode (apenas se quiser iOS — precisa de Mac)

### 🏪 EPIC 20 — Publicação nas Lojas (Play Store & App Store)

> **Objetivo:** Publicar o app nas lojas oficiais para distribuição pública.

| ID    | Feature                                                                      |
| ----- | ---------------------------------------------------------------------------- |
| 20.1  | Criar conta Google Play Console (taxa única $25 USD)                        |
| 20.2  | Criar conta Apple Developer ($99/ano — opcional, só se quiser iOS)           |
| 20.3  | Gerar keystore de produção (signing key Android)                             |
| 20.4  | Configurar versionamento (versionCode + versionName no Gradle)               |
| 20.5  | Gerar AAB (Android App Bundle) assinado para Play Store                      |
| 20.6  | Screenshots do app (mínimo 2, recomendado 8 — phone + tablet)                |
| 20.7  | Feature graphic (1024×500) + app icon (512×512 hi-res)                       |
| 20.8  | Descrição da loja (título, descrição curta/longa, tags, categoria)            |
| 20.9  | Política de privacidade (LGPD — URL pública obrigatória)                    |
| 20.10 | Classificação de conteúdo (IARC rating questionnaire)                        |
| 20.11 | Upload AAB + preencher listing → Enviar para revisão                        |
| 20.12 | Configurar Google Play App Signing (chave gerenciada pelo Google)             |
| 20.13 | Internal testing track → Closed beta → Open → Production                    |
| 20.14 | CI/CD: GitHub Actions → build AAB → upload Play Store (Fastlane)             |
| 20.15 | ASO (App Store Optimization): keywords, A/B test de ícone/screenshots        |
| 20.16 | In-app updates: `@capacitor-community/in-app-updates` (forçar update)       |
| 20.17 | Crash reporting: Firebase Crashlytics (free, integra com Capacitor)           |
| 20.18 | Analytics: Firebase Analytics (free, eventos custom)                          |

> **Custo total para lançar:**
>
> | Item | Custo | Frequência |
> |------|-------|-----------|
> | Google Play Console | $25 | Uma vez (lifetime) |
> | Apple Developer | $99 | Anual (opcional) |
> | Cloudflare (backend) | $0 | Free tier |
> | Firebase Crashlytics | $0 | Free |
> | Total mínimo (só Android) | **~R$140** | Uma vez |
>
> **Timeline sugerido:**
> 1. EPIC 19 primeiro → gera APK → testa no seu celular
> 2. Distribui APK direto (sem loja) para amigos/beta testers
> 3. Quando validar com ~10 users → EPIC 20 → Play Store
>
> **Dica:** Antes de pagar a conta de dev, distribui o APK diretamente (sideload).
> Android permite instalar APK sem loja. Perfeito pra validar o produto primeiro.

---

## Roadmap de Lançamento

| Fase          | EPICs                   | Objetivo                          | Status |
| ------------- | ----------------------- | --------------------------------- | ------ |
| **MVP Local** | 1–4, 6–7, 16–17        | App funcional com auth + onboarding | ✅     |
| **Launch Web**| 18                      | Deploy Cloudflare (produção free) | ⬜     |
| **Mobile**    | 19                      | APK nativo via Capacitor          | ⬜     |
| **Lojas**     | 20                      | Play Store + App Store            | ⬜     |
| **Polish**    | 8, 9                    | UX viciante + visual PRO          | ⬜     |
| **Social**    | 10, 11, 13              | Viralização + retenção por grupo  | ⬜     |
| **Mindset**   | 12                      | Diferencial emocional             | ⬜     |
| **SaaS**      | 14, 15                  | Monetização + segurança avançada  | ⬜     |
| **Growth**    | 5 (WhatsApp)            | Canal de retenção premium         | ⬜     |

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

### Sprint 6 — Google OAuth + Onboarding ✅

> 16.1 → 16.8, 17.1 → 17.9

### Sprint 7 — Deploy Cloudflare (Lançamento Web) 🚀

> 18.1 → 18.14 (migração pra produção serverless)

### Sprint 8 — Mobile App (Capacitor) 📱

> 19.1 → 19.17 (gerar APK, plugins nativos, testar no celular)

### Sprint 9 — Visual Juice 🎨

> 9.1 → 9.11 (rebranding + gamificação visual)

### Sprint 10 — Wallpaper + Sharing

> 8.1 → 8.8, 13.1 → 13.8

### Sprint 11 — Social

> 10.1 → 10.10 (amigos + perfil público)

### Sprint 12 — Grupos & Motivação

> 11.1 → 11.9, 12.1 → 12.8

### Sprint 13 — SaaS & Monetização

> 14.1 → 14.11, 15.1 → 15.15

### Sprint 14 — Play Store Launch 🏪

> 20.1 → 20.18 (publicar nas lojas oficiais)

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

---

## 🏁 Concorrentes & Diferenciais

| App | Forte em | Fraco em | HabitQuest supera em |
|-----|----------|----------|----------------------|
| **Habitica** | Gamificação RPG, social | UI datada, complexa demais, intimidante | UI moderna + simplicidade + conquistas estilo Xbox |
| **Streaks** | Minimalismo, iOS nativo | Só iOS, sem social, sem gamificação | Multiplataforma + achievements + grupos |
| **Loop Habit Tracker** | Open source, gráficos | Sem gamificação, sem social, feio | Gamificação viciante + UX premium |
| **Daylio** | Mood tracking, journaling | Sem hábitos puros, paywall agressivo | Foco em hábitos + free generoso |
| **Fabulous** | Onboarding incrível, coaching | Muito caro ($99/ano), sem social | Preço justo + comunidade + achievements |
| **Duolingo** | Gamificação PERFEITA, streaks | Só idiomas | Inspiração direta: mecânicas aplicadas a qualquer hábito |
| **Notion/Todoist** | Flexível, tudo-em-um | Não gamificado, requer setup manual | Zero-config + dopamina instantânea |

### 🎯 Posicionamento HabitQuest
> **"Duolingo para qualquer hábito"** — a gamificação viciante do Duo aplicada a metas pessoais.
> Fácil como Streaks, viciante como Duolingo, social como Habitica, bonito como Nubank.

### Diferenciais únicos:
1. **Achievements estilo Xbox/PlayStation** — não existe em nenhum concorrente
2. **Wallpaper motivacional gerado** — lembrete visual no celular 24h
3. **Afirmações + Vision Board** — mentalidade integrada ao app de hábitos
4. **Grupos com metas conjuntas** — accountability + competição saudável
5. **Share automático p/ Stories** — viralização orgânica
6. **100% gratuito pra funcionar bem** — premium é upgrade, não necessidade

---

## 💡 Ideias Futuras (Backlog de Inovação)

> Ideias para explorar após lançamento dos EPICs 1-18. Priorizadas por impacto estimado.

### 🔥 Alto Impacto (próximos EPICs após lançamento)

| Ideia | Descrição | Inspiração |
|-------|-----------|------------|
| **AI Coach** | IA que analisa seus padrões e sugere hábitos, horários ideais, e dá coaching personalizado | Fabulous + ChatGPT |
| **Habit Stacking** | Conectar hábitos em cadeia (ex: "após café → meditar → ler 10min"). Baseado em Atomic Habits | James Clear |
| **Streak Insurance** | 1x por mês pode "recuperar" um dia perdido sem quebrar streak (premium) | Duolingo freeze |
| **Weekly Review** | Resumo semanal automatizado com gráficos + insights + sugestões | Notion recap |
| **Widgets nativos** | Widget iOS/Android com progresso do dia (PWA → futuro nativo) | Streaks widget |
| **Apple Watch / WearOS** | Check-in rápido pelo relógio (vibra no horário do hábito) | Apple Health |
| **Pomodoro integrado** | Timer Pomodoro vinculado a hábitos de foco/estudo | Forest app |

### 🌟 Médio Impacto (diferenciação)

| Ideia | Descrição | Inspiração |
|-------|-----------|------------|
| **Habit Marketplace** | Compartilhar/importar "packs" de hábitos (ex: "Pack Atleta", "Pack Dev Sênior") | Notion templates |
| **Challenges semanais** | Desafios da comunidade com prêmios (badges exclusivos) | Fitbit challenges |
| **Dark/Light auto** | Tema muda baseado no horário (escuro à noite) | iOS auto theme |
| **Integração Saúde** | Conectar Google Fit/Apple Health → auto-check hábitos de exercício | Strava |
| **Música ambiente** | Playlists lofi/focus enquanto pratica hábitos | Brain.fm |
| **Habit Analytics Pro** | Heatmap anual (estilo GitHub), correlações entre hábitos, predição | GitHub contributions |
| **Modo Foco** | Bloquear notificações e mostrar só o hábito atual (deep work) | Forest |
| **Rewards reais** | Parceria com marcas: complete 30 dias → cupom de desconto | Sweatcoin |

### 🚀 Moonshots (longo prazo)

| Ideia | Descrição | Inspiração |
|-------|-----------|------------|
| **App nativo (React Native)** | Migrar PWA → app nativo pra notificações ricas + widgets + Siri/Google Assistant | — |
| **HabitQuest for Teams** | Versão B2B para empresas (wellness corporativo, OKRs pessoais) | Headspace for Work |
| **API pública** | Permitir integrações externas (Zapier, IFTTT, automações) | Todoist API |
| **Voz** | "Hey Google, completar hábito meditação" (Actions on Google) | Google Home |
| **AR Badges** | Ver conquistas em realidade aumentada (hype viral) | Pokémon GO |
| **NFT Achievements** | Achievements como NFTs colecionáveis (se mercado voltar) | StepN |
| **Comunidade global** | Feed público de conquistas, trending habits, top users do mês | Twitter/Reddit |
| **Plano família** | Pais acompanham hábitos dos filhos, gamificação para crianças | Family plan |
| **White-label** | Empresas customizam o app com marca delas (receita B2B) | — |

### 🎮 Gamificação Avançada (ideias de mecânica)

| Mecânica | Como funciona |
|----------|--------------|
| **Boss Battles** | A cada 30 dias de streak, enfrenta um "boss" (desafio intenso de 3 dias) |
| **Skill Tree** | Árvore de habilidades que desbloqueia conforme evolui em categorias |
| **Seasons** | Seasons trimestrais com recompensas exclusivas (tipo Fortnite Battle Pass) |
| **Pet Virtual** | Bichinho virtual que evolui conforme você completa hábitos (Tamagotchi) |
| **Random Events** | "Evento surpresa: complete 2 hábitos extras hoje → 3x XP!" |
| **Loot Boxes** | Ao desbloquear conquista, ganha "caixa" com tema/avatar/título aleatório |
| **Clãs** | Evolução de "Grupos" → Clãs com nome, brasão, guerras entre clãs |
| **Prestige** | Ao completar TODAS as conquistas, pode "prestigiar" (reset + badge ouro) |

---

> **Prioridade:** Lançar MVP (EPICs 1-7, 16-18) → validar com usuários reais → decidir próximos EPICs baseado em feedback.
> **Mantra:** Ship fast, iterate faster. 🚀
