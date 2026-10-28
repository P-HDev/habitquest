# 0002. Conquista conta o total de check-ins; streak é só bônus visual

- Data: 2026-10-28 (registro de decisão já tomada em `HABITQUEST.md`) · Status: Aceito

## Contexto

Usuários perdem dias; punir a quebra de sequência desmotiva.

## Decisão

Uma conquista desbloqueia quando `check-ins >= targetDays` (`packages/api/src/application/use-cases/evaluate-achievements.use-case.ts`). Os marcos são fixos: 7, 21, 30, 60, 90, 180, 365 (`packages/api/src/domain/entities/achievement.ts`).

## Por quê (e o que foi descartado)

Regra "dias não precisam ser consecutivos" em `HABITQUEST.md`. A frase de `HABITQUEST.md` sobre marcos de 25/50/75/100% está desatualizada: o código vence.

## Consequências

Streak (`packages/api/src/domain/value-objects/streak.ts`) não pode influenciar desbloqueio.
