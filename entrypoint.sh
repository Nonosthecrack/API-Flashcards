#!/bin/sh
set -e

echo "[API] Initialisation du schema de base de donnees..."
npx drizzle-kit push

echo "[API] Demarrage du serveur..."
exec node src/server.js
