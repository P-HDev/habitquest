# 0001. API em DDD com camadas domain, application, infrastructure e presentation

- Data: 2026-10-28 (registro de decisão já tomada em `HABITQUEST.md`) · Status: Aceito

## Contexto

A API precisa trocar o banco (SQLite em dev, outro em produção) sem reescrever regra de negócio, e ser testável sem I/O.

## Decisão

Código em `packages/api/src/{domain,application,infrastructure,presentation}`. Regras em `domain/`, orquestração em `application/use-cases/`, repositórios como interface em `domain/` e implementação SQLite em `infrastructure/`.

## Por quê (e o que foi descartado)

Use cases dependem de abstrações, então testes usam repositório fake ou SQLite em memória (`createApp(deps)`). Fonte: seção "Arquitetura DDD" de `HABITQUEST.md`.

## Consequências

Regra de negócio em controller ou rota é erro. Troca de banco exige novos repositórios, sem tocar em `domain/`.
