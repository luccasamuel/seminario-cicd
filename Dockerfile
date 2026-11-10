# Imagem base com versão fixa (evita surpresas de usar "latest")
FROM node:22.23-alpine AS base
WORKDIR /app

# ---------- Etapa de dependências de produção ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------- Etapa final ----------
FROM base AS final

# Recebidos do pipeline: versão SemVer e short hash do commit
ARG APP_VERSION=dev
ARG GIT_COMMIT=local
ENV NODE_ENV=production \
    APP_VERSION=${APP_VERSION} \
    GIT_COMMIT=${GIT_COMMIT} \
    PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

# Roda como usuário sem privilégios (já existe na imagem node)
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
