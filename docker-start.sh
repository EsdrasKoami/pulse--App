#!/bin/sh
set -e

echo "========================================================="
echo "🚀 Pulse — Plateforme de Jumelage CEGPTR (Docker)"
echo "========================================================="

PORT="${PORT:-8000}"

# 1. Vérifier .env
if [ ! -f .env ]; then
    echo "📄 Fichier .env manquant. Création depuis .env.example..."
    cp .env.example .env
fi

# 2. Clé d'application
if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
    echo "🔑 Génération d'une nouvelle clé d'application..."
    php artisan key:generate --force
fi

# 3. Base SQLite si utilisée
DB_CONN=$(grep -E "^DB_CONNECTION=" .env | cut -d '=' -f2 | tr -d ' ' || echo "sqlite")
if [ "$DB_CONN" = "sqlite" ] || [ -z "$DB_CONN" ]; then
    mkdir -p database
    if [ ! -f database/database.sqlite ]; then
        echo "📁 Initialisation de la base SQLite database/database.sqlite..."
        touch database/database.sqlite
    fi
    chmod 666 database/database.sqlite 2>/dev/null || true
fi

# 4. Nettoyage et rafraîchissement des caches
echo "🧹 Nettoyage des caches..."
php artisan optimize:clear 2>/dev/null || true

# 5. Migrations
echo "📦 Exécution des migrations..."
php artisan migrate --force --no-interaction || echo "⚠️ Migration ignorée ou base non prête"

# 6. Seeders
echo "🌱 Initialisation des données (intérêts & compte admin)..."
php artisan db:seed --force --no-interaction 2>/dev/null || true

# 7. Lien de stockage public
echo "🔗 Configuration du lien de stockage..."
php artisan storage:link --no-interaction 2>/dev/null || true

# 8. Permissions
chown -R www-data:www-data storage database bootstrap/cache 2>/dev/null || true
chmod -R 775 storage database bootstrap/cache 2>/dev/null || true

echo "========================================================="
echo "✅ Pulse est prêt !"
echo "🌐 URL : http://localhost:${PORT}"
echo "👤 Admin : admin@edu.cegeptr.qc.ca | Mot de passe : admin123"
echo "========================================================="

# 9. Démarrage du serveur PHP
exec php -S 0.0.0.0:${PORT} -t public
