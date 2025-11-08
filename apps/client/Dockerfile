FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# Copier les fichiers du workspace depuis la racine
COPY pnpm-workspace.yaml pnpm-lock.yaml apps/client/package.json ./
COPY apps/client ./apps/client

# Installer les dépendances pour le workspace client
RUN pnpm install --filter client...

# Déclarer l'ARG et le passer comme variable d'environnement pour Vite
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Compiler le projet Vite
WORKDIR /app/apps/client
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
