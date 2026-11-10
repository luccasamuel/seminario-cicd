# Seminário CI/CD

[![CI](https://github.com/luccasamuel/seminario-cicd/actions/workflows/ci.yml/badge.svg)](https://github.com/luccasamuel/seminario-cicd/actions/workflows/ci.yml)
[![Deploy](https://github.com/luccasamuel/seminario-cicd/actions/workflows/deploy.yml/badge.svg)](https://github.com/luccasamuel/seminario-cicd/actions/workflows/deploy.yml)

**Produção:** https://seminario-lucca.chilecentral.cloudapp.azure.com

Aplicação Node.js de exemplo para demonstrar um pipeline CI/CD com GitHub Actions, Docker Hub, deploy via SSH, proxy reverso e observabilidade.

## Rotas

| Rota | O que faz |
|------|-----------|
| `GET /` | No navegador: painel ao vivo da versão em produção. Em scripts/pipeline: JSON com cliente, versão e commit |
| `GET /sobre` | Informações do projeto |
| `GET /health` | Health check usado pelo Docker e pelo deploy |
| `GET /soma?a=2&b=3` | Exemplo de regra de negócio coberta por testes |
| `GET /metrics` | Métricas no formato do Prometheus |

## Rodar localmente

```bash
npm install
npm test
npm start          # http://localhost:3000
```

## Rodar com Docker

```bash
docker build --build-arg APP_VERSION=1.0.0 --build-arg GIT_COMMIT=$(git rev-parse --short HEAD) -t seminario-cicd:1.0.0 .
docker run -p 3000:3000 seminario-cicd:1.0.0
```

## Versionamento

A imagem recebe duas tags:
- `1.0.0` → SemVer, vem do `version` do `package.json`
- `1.0.0-abc1234` → SemVer + short hash do commit, identifica exatamente o código

## Rollback em um clique

Actions → **Deploy** → **Run workflow** → informe a tag de uma versão anterior (ex.: `1.2.0-7d9e8a8`).
