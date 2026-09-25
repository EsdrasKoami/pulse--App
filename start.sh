#!/usr/bin/env bash

# ==============================================================================
#  🚀 Pulse — Lanceur Automatique pour Cégep de Trois-Rivières (Bash)
# ==============================================================================

set -e

# Couleurs ANSI
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "  ██████╗ ██╗   ██╗██╗     ███████╗███████╗"
echo "  ██╔══██╗██║   ██║██║     ██╔════╝██╔════╝"
echo "  ██████╔╝██║   ██║██║     ███████╗█████╗  "
echo "  ██╔═══╝ ██║   ██║██║     ╚════██║██╔══╝  "
echo "  ██║     ╚██████╔╝███████╗███████║███████╗"
echo "  ╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝"
echo "   Plateforme de Jumelage Étudiant — Cégep TR"
echo -e "${NC}"

# Répertoire du script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# 1. Vérification des prérequis
echo -e "${BOLD}[1/7] Vérification des prérequis système...${NC}"

if ! command -v php >/dev/null 2>&1; then
    echo -e "${RED}❌ PHP n'est pas installé ou n'est pas dans votre PATH.${NC}"
    echo "Veuillez installer PHP 8.2 ou plus récent pour continuer."
    exit 1
fi

if ! command -v composer >/dev/null 2>&1; then
    echo -e "${RED}❌ Composer n'est pas installé ou n'est pas dans votre PATH.${NC}"
    echo "Veuillez installer Composer (https://getcomposer.org/) pour continuer."
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}❌ Node.js / NPM n'est pas installé ou n'est pas dans votre PATH.${NC}"
    echo "Veuillez installer Node.js 18+ (https://nodejs.org/) pour continuer."
    exit 1
fi

PHP_VER=$(php -r "echo PHP_VERSION;")
echo -e "  ${GREEN}✔${NC} PHP $PHP_VER détecté."
echo -e "  ${GREEN}✔${NC} Composer détecté."
echo -e "  ${GREEN}✔${NC} NPM $(npm -v) détecté."

# 2. Configuration .env
echo -e "\n${BOLD}[2/7] Configuration de l'environnement (.env)...${NC}"
if [ ! -f .env ]; then
    echo -e "  ${YELLOW}➜ Fichier .env manquant. Copie depuis .env.example...${NC}"
    cp .env.example .env
fi

if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
    echo -e "  ${YELLOW}➜ Génération de la clé d'application APP_KEY...${NC}"
    php artisan key:generate --force
else
    echo -e "  ${GREEN}✔${NC} Clé d'application présente."
fi

# 3. Dépendances PHP & Node
echo -e "\n${BOLD}[3/7] Vérification des dépendances...${NC}"
if [ ! -d "vendor" ]; then
    echo -e "  ${YELLOW}➜ Installation des dépendances Composer (PHP)...${NC}"
    composer install --no-interaction --prefer-dist
else
    echo -e "  ${GREEN}✔${NC} Dépendances PHP (vendor) prêtes."
fi

if [ ! -d "node_modules" ]; then
    echo -e "  ${YELLOW}➜ Installation des dépendances NPM (Node/React)...${NC}"
    npm install
else
    echo -e "  ${GREEN}✔${NC} Dépendances Node (node_modules) prêtes."
fi

# 4. Compilation des assets frontend (Vite)
echo -e "\n${BOLD}[4/7] Compilation des assets frontend...${NC}"
rm -f public/hot
if [ ! -f "public/build/manifest.json" ] || [ "$1" == "--build" ]; then
    echo -e "  ${YELLOW}➜ Compilation des styles et composants React via Vite...${NC}"
    npm run build
else
    echo -e "  ${GREEN}✔${NC} Assets compilés prêts (public/build)."
fi

# 5. Base de données SQLite
echo -e "\n${BOLD}[5/7] Préparation de la base de données...${NC}"
mkdir -p database
if [ ! -f "database/database.sqlite" ]; then
    echo -e "  ${YELLOW}➜ Création du fichier SQLite database/database.sqlite...${NC}"
    touch database/database.sqlite
fi

echo -e "  ${CYAN}➜ Exécution des migrations et initialisation des données...${NC}"
php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction 2>/dev/null || true
echo -e "  ${GREEN}✔${NC} Base de données migrée et initialisée."

# 6. Storage Link & Optimisations
echo -e "\n${BOLD}[6/7] Finalisation du stockage et des caches...${NC}"
php artisan storage:link --no-interaction 2>/dev/null || true
php artisan optimize:clear 2>/dev/null || true
rm -f public/hot
echo -e "  ${GREEN}✔${NC} Lien de stockage configuré et caches rafraîchis."

# 7. Démarrage de l'application
PORT=8000
echo -e "\n${BOLD}[7/7] Lancement du serveur...${NC}"
echo -e "${GREEN}================================================================${NC}"
echo -e "  ${BOLD}🎉 PULSE EST PRÊT !${NC}"
echo -e "  🌐 Accès direct : ${CYAN}http://127.0.0.1:${PORT}${NC}"
echo -e "  👤 Administrateur : ${BOLD}admin@edu.cegeptr.qc.ca${NC}"
echo -e "  🔑 Mot de passe   : ${BOLD}admin123${NC}"
echo -e "  Pour arrêter le serveur : ${YELLOW}Ctrl + C${NC}"
echo -e "${GREEN}================================================================${NC}\n"

# Ouvrir le navigateur si disponible
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://127.0.0.1:${PORT}" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
    open "http://127.0.0.1:${PORT}" >/dev/null 2>&1 &
elif command -v start >/dev/null 2>&1; then
    start "http://127.0.0.1:${PORT}" >/dev/null 2>&1 &
fi

# Lancement PHP Serve
php artisan serve --port=${PORT}
