#!/bin/sh
set -e

echo "🚀 Pulse — démarrage production..."

# Génération clé si manquante
php artisan key:generate --no-interaction --force 2>/dev/null || true

# Migrations (non-bloquant si DB pas encore prête)
echo "📦 Migrations..."
php artisan migrate --force --no-interaction 2>/dev/null || echo "⚠️ Migration ignorée (DB pas prête)"

# Seeders optionnels
php artisan db:seed --class=InterestSeeder --force --no-interaction 2>/dev/null || true

# Storage link
php artisan storage:link --no-interaction 2>/dev/null || true

# Cache
php artisan config:cache --no-interaction 2>/dev/null || true
php artisan route:cache --no-interaction 2>/dev/null || true
php artisan view:cache --no-interaction 2>/dev/null || true

echo "✅ Setup terminé. Serveur sur le port ${PORT:-8000}..."

# Démarrage PHP
exec php -S 0.0.0.0:${PORT:-8000} -t public
