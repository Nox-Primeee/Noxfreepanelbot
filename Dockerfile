# Dockerfile
FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier le reste du code
COPY . .

# Build le projet TypeScript
RUN npm run build

# Supprimer les fichiers source pour réduire la taille
RUN rm -rf src/

# Exposer le port (pour l'API web optionnelle)
EXPOSE 3000

# Démarrer le bot
CMD ["npm", "start"]
