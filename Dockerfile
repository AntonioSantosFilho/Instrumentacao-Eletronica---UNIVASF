# Dockerfile para a aplicação Next.js de monitoramento de vacinas

# Stage 1: Build
FROM node:20-alpine AS builder

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json ./

# Copiar pnpm-lock.yaml (usar padrão opcional para não falhar se não existir)
# O padrão * permite que seja opcional, mas vamos verificar explicitamente
COPY pnpm-lock.yaml* ./

# Instalar dependências
# Verifica se o lockfile existe antes de usar --frozen-lockfile
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      echo "pnpm-lock.yaml não encontrado, instalando sem frozen-lockfile..."; \
      pnpm install; \
    fi

# Copiar código fonte
COPY . .

# Build da aplicação
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários do build
# O Next.js standalone já inclui os arquivos estáticos necessários
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Criar diretório public (Next.js pode precisar, mesmo que vazio)
RUN mkdir -p ./public || true

# Definir permissões
USER nextjs

# Expor porta
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
