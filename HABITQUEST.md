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

### 🔐 EPIC 7 — Autenticação (Final)

| ID  | Feature                                  |
| --- | ---------------------------------------- |
| 7.1 | Entity: User (email, passwordHash, name) |
| 7.2 | Registro + Login (JWT)                   |
| 7.3 | Middleware auth                          |
| 7.4 | Tela login/registro                      |
| 7.5 | Hábitos vinculados a user_id             |
| 7.6 | Refresh token + logout                   |

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

---

## Sprints (XP - Small Releases)

### Sprint 1 — Fundação + Quality Gates

> 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7

### Sprint 2 — Core Habits (TDD)

> 2.1 → 2.7 (domain + API + tela principal)

### Sprint 3 — Conquistas

> 3.1 → 3.6

### Sprint 4 — Notifications & PWA

> 4.1 → 4.4, 6.2, 6.3

### Sprint 5 — Polish

> 2.8, 2.9, 3.7, 4.5, 6.1, 6.4, 6.5

### Sprint 6 — WhatsApp

> 5.1 → 5.4

### Sprint 7 — Autenticação

> 7.1 → 7.6

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
