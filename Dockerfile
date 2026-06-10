FROM node:22-alpine

WORKDIR /app

# Copie les fichiers de dependances en premier (optimise le cache Docker)
COPY package*.json ./
COPY drizzle.config.js ./

# Installe toutes les dependances (drizzle-kit est necessaire au demarrage)
RUN npm ci

# Copie le code source
COPY src ./src

# Cree le dossier de la base de donnees (monte en volume en prod)
RUN mkdir -p /app/data

# Copie et rend executable le script de demarrage
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000

# Verifie que l'API repond toutes les 30s
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

ENTRYPOINT ["./entrypoint.sh"]
