# HabitQuest — Instruções para agentes

> Fonte única. CLAUDE.md aponta para cá. Máx. ~120 linhas: só o que o agente erraria sem saber.
> Padrão: https://github.com/Pa1loh/PadraoAI (leia `docs/padraoai/inegociaveis.md`).

## Comandos

- Instalar: `npm install` (monorepo npm workspaces: `packages/api`, `packages/web`)
- Testes: `npm test` (api + web; também roda no pre-push). Um pacote: `npm run test:api` / `npm run test:web`
- Lint: `npm run lint` · Formatar: `npm run format`
- Rodar local: `npm run api` (porta 3000) e `npm run web` (porta 5173, proxy `/api` → 3000)
- Build: `npm run build -w packages/api` e `npm run build -w packages/web`
- Guia: `npm run guia` (abrir) · `npm run guia:check` (caminhos e âncoras)

## Invariantes (o que nunca pode quebrar)

- Um check-in por hábito por dia (`UNIQUE(habit_id, date)` em `packages/api/src/infrastructure/database/connection.ts`).
- Conquista conta o total de check-ins, não dias consecutivos; streak é só bônus visual.
- `domain/` não importa `infrastructure/`: use cases dependem das interfaces de repositório.
- Schema muda só em `runMigrations` (connection.ts), de forma aditiva (`CREATE TABLE IF NOT EXISTS`).
- Segredo só por variável de ambiente (modelos em `packages/api/.env.example` e `packages/web/.env.example`).

## Armadilhas conhecidas

- `/habits`, `/achievements`, `/stats`, `/notifications` não exigem token nem filtram por usuário (só `/auth/me` usa `authMiddleware`). Lacuna em aberto: não "corrija" sem decisão do dono.
- `JWT_SECRET` tem fallback fixo de dev em 3 arquivos; em produção a variável precisa estar definida.
- `HABITQUEST.md` diz marcos de 25/50/75/100%; o código usa 7, 21, 30, 60, 90, 180, 365 dias. Código vence.
- Deploy oficial indefinido: Cloudflare no `HABITQUEST.md`, Fly.io (`fly.toml`) no código. Não assuma.
- Datas de check-in são UTC (`toISOString`); cuidado ao mexer em streak.
- Testes de API usam `createApp(deps)` com repositório fake ou `getTestDatabase()` (SQLite em memória).

## Testes e commits

- TDD: teste vermelho antes do código. Bug ganha teste de regressão vermelho primeiro, com nome `Regressao_Issue{N}_<comportamento>` (vitest).
- Unit em `packages/api/tests/unit/`, integração em `packages/api/tests/integration/`, web em `packages/web/tests/`.
- Cobertura mínima: 80% domínio, 70% geral (`HABITQUEST.md`).
- Conventional Commits, cabeçalho ≤ 72 (`commitlint.config.mjs`). Husky: pre-commit (lint-staged + gitleaks), pre-push (testes).

## Guia de desenvolvimento

- Produto, domínio, regras e "como fazer": `docs/guia-de-desenvolvimento/index.html` (abrir: `npm run guia`).
  Dúvida de negócio, fluxo ou convenção: leia a seção certa (`grep -n 'id="' docs/guia-de-desenvolvimento/index.html`)
  antes de perguntar ou decidir. Se o guia divergir de ADR ou código, ADR/código vence e o guia é corrigido no mesmo PR.
- Mudou regra, fluxo, convenção ou comando? Atualize a seção correspondente do guia no mesmo PR.

## Time de agentes (`npx github:Pa1loh/PadraoAI agents`)

Para criar a issue, rode `/issue-criar`: escreve para agente (exemplo, critério de pronto, onde mexer) e só abre após seu "sim". `docs/engines.yml` guarda a engine recomendada por papel e `docs/agent-log.md` o registro por issue.
Na aba da issue rode `/issue <nº>`: cria a branch, chama o analista (obrigatório se houver API/doc externa), faz TDD, chama o revisor e abre o PR. Merge e deploy são do usuário.
`infra` e `deploy` só em sessão própria (`claude --agent infra|deploy`), com aprovação humana para mudar estado.

- Hosts e comandos que `infra` pode usar: a definir (sem infra documentada).
- Script de deploy e healthcheck: a definir; healthcheck da API é `GET /health`.
- Não use `@import` neste arquivo: Antigravity e dsh leem o texto literal.

## Fluxo

issue → branch → TDD → PR pequeno (template em `.github/pull_request_template.md`) → CI verde → deploy.
Decisões duráveis: `docs/adr/`. Visão e roadmap: `HABITQUEST.md`.
