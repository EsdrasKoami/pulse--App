# ── Stage 1: Node.js — Build Vite/React assets ───────────────────────────────
FROM node:20-alpine AS frontend

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY vite.config.js tailwind.config.js postcss.config.js jsconfig.json ./
COPY resources/ resources/
COPY public/ public/
RUN npm run build

# ── Stage 2: PHP 8.4 Alpine — Production / Container server ──────────────────
FROM php:8.4-cli-alpine AS app

# Alpine packages & PHP extensions (supports MySQL + SQLite)
RUN apk add --no-cache \
    git curl zip unzip bash sqlite sqlite-libs \
    libpng-dev libjpeg-turbo-dev freetype-dev \
    libzip-dev oniguruma-dev icu-dev sqlite-dev \
    && docker-php-ext-configure gd \
        --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd pdo pdo_mysql pdo_sqlite mbstring zip bcmath intl \
    && rm -rf /var/cache/apk/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts \
    --prefer-dist

# Copy application source
COPY . .

# Copy compiled frontend assets from frontend stage
COPY --from=frontend /app/public/build public/build

# Setup database & cache permissions
RUN mkdir -p database storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && touch database/database.sqlite \
    && chown -R www-data:www-data database storage bootstrap/cache \
    && chmod -R 775 database storage bootstrap/cache

# Startup script
COPY docker-start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000

CMD ["/start.sh"]
