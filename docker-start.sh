#!/bin/sh

echo "🚀 Pulse — démarrage..."

PORT="${PORT:-8000}"

# Lance PHP en premier (en arrière-plan)
php -S 0.0.0.0:${PORT} -t public &
PHP_PID=$!

echo "✅ PHP démarré sur le port ${PORT} (PID: $PHP_PID)"

# Attend 3s que PHP soit prêt
sleep 3

# Setup en arrière-plan (non-bloquant)
(
  echo "⚙️ Setup post-démarrage..."
  php artisan migrate --force --no-interaction 2>&1 || echo "⚠️ Migration échouée"
  php artisan db:seed --class=InterestSeeder --force --no-interaction 2>&1 || true
  php artisan storage:link --no-interaction 2>&1 || true
  php artisan config:clear --no-interaction 2>&1 || true
  php artisan view:clear --no-interaction 2>&1 || true
  echo "✅ Setup terminé"
) &

# Garde PHP en premier plan
wait $PHP_PID
