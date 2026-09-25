#!/usr/bin/env bash

# ==============================================================================
#  🐳 Pulse — Lancement avec Docker Compose (Bash)
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "🐳 Démarrage de Pulse avec Docker Compose..."

if ! command -v docker >/dev/null 2>&1; then
    echo "❌ Docker n'est pas détecté. Veuillez installer Docker Desktop ou le moteur Docker."
    exit 1
fi

docker compose up --build -d

echo "========================================================="
echo "🎉 Pulse fonctionne maintenant dans Docker !"
echo "🌐 URL : http://localhost:8000"
echo "👤 Admin : admin@edu.cegeptr.qc.ca | Mot de passe : admin123"
echo "Pour voir les logs : docker compose logs -f"
echo "Pour stopper       : docker compose down"
echo "========================================================="

if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:8000" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
    open "http://localhost:8000" >/dev/null 2>&1 &
fi
