FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# Copier les fichiers du workspace depuis la racine
COPY pnpm-workspace.yaml pnpm-lock.yaml apps/server/package.json ./
COPY apps/server ./apps/server

# Installer les dépendances pour le workspace server
RUN pnpm install --filter server...

# Compiler TypeScript -> JavaScript
WORKDIR /app/apps/server
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app/apps/server

# Copier tous les node_modules nécessaires
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/server/node_modules ./node_modules

# Copier les fichiers compilés et les sources nécessaires
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/src/core ./src/core
COPY --from=builder /app/apps/server/package.json ./package.json
COPY apps/server/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production

EXPOSE 3000
CMD ["./docker-entrypoint.sh"]
