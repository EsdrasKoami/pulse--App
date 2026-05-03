#!/bin/sh
set -e

echo "🚀 Starting Pulse deployment..."

# Run migrations
php artisan migrate --force

# Seed admin account if needed
php artisan db:seed --class=UserSeeder --force 2>/dev/null || true
php artisan db:seed --class=InterestSeeder --force 2>/dev/null || true

# Create storage link
php artisan storage:link 2>/dev/null || true

# Cache optimization
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Setup complete. Launching server on port ${PORT:-8000}..."

# Start PHP built-in server
exec php -S 0.0.0.0:${PORT:-8000} -t public
