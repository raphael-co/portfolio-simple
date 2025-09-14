FROM node:20

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Installation des dépendances
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install; \
    else npm install; fi

# Copie du reste des fichiers, y compris le script
COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

# Commande de démarrage avec attente de PostgreSQL
CMD sh -c "npm start"
