#!/bin/sh

echo "🚀 Pulse — démarrage production..."

PORT="${PORT:-8000}"

# 1. Nettoyage des caches AVANT tout (rapide, critique)
echo "🧹 Nettoyage des caches..."
php artisan optimize:clear 2>/dev/null || true

# 2. Migrations
echo "📦 Migrations..."
php artisan migrate --force --no-interaction 2>/dev/null || echo "⚠️ Migration ignorée (DB pas prête)"

# 3. Seeder minimal
php artisan db:seed --class=InterestSeeder --force --no-interaction 2>/dev/null || true

# 4. Storage link
php artisan storage:link --no-interaction 2>/dev/null || true

echo "✅ Setup terminé. Démarrage PHP sur le port ${PORT}..."

# 5. Démarrage PHP en premier plan
exec php -S 0.0.0.0:${PORT} -t public
