# ── Stage 1: Node.js — Build Vite/React assets ───────────────────────────────
FROM node:20-alpine AS frontend

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY vite.config.js tailwind.config.js postcss.config.js jsconfig.json ./
COPY resources/ resources/
COPY public/ public/
RUN npm run build

# ── Stage 2: PHP 8.3 Alpine — Production server ───────────────────────────────
FROM php:8.3-fpm-alpine AS app

# Alpine packages (much faster than apt-get)
RUN apk add --no-cache \
    git curl zip unzip bash \
    libpng-dev libjpeg-turbo-dev freetype-dev \
    libzip-dev oniguruma-dev icu-dev \
    && docker-php-ext-configure gd \
        --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd pdo pdo_mysql mbstring zip bcmath intl \
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

# Copy application
COPY . .

# Copy compiled frontend assets
COPY --from=frontend /app/public/build public/build

# Permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Startup script
COPY docker-start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000
CMD ["/start.sh"]
