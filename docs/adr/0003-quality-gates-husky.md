# 0003. Quality gates locais com Husky, lint-staged e commitlint

- Data: 2026-10-28 (registro de decisão já tomada em `HABITQUEST.md`) · Status: Aceito

## Contexto

Não havia CI; a qualidade depende de barreiras locais.

## Decisão

pre-commit roda lint-staged (ESLint + Prettier) e gitleaks nos arquivos staged; pre-push roda `npm run test`; commit-msg roda commitlint (Conventional Commits).

## Por quê (e o que foi descartado)

Barreira mecânica vence instrução em texto (`docs/padraoai/inegociaveis.md`, item 9). E2E com Playwright foi adiado ("futuro" em `HABITQUEST.md`).

## Consequências

`--no-verify` só com pedido explícito. Um workflow de CI repete as mesmas checagens (`.github/workflows/ci.yml`).
