# ── Stage 1: Node.js — Build frontend assets ─────────────────────────────────
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY resources/ resources/
COPY public/ public/
COPY vite.config.js .
COPY tailwind.config.js .
COPY postcss.config.js .
COPY jsconfig.json .

RUN npm run build

# ── Stage 2: PHP — Laravel production server ──────────────────────────────────
FROM php:8.3-cli AS app

# Install system dependencies + PHP extensions
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libjpeg-dev libfreetype6-dev \
    libzip-dev libonig-dev libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd pdo pdo_mysql mbstring zip bcmath ctype xml tokenizer fileinfo \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first (layer caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy the rest of the application
COPY . .

# Copy compiled frontend from Stage 1
COPY --from=frontend /app/public/build public/build

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Copy and set the startup script
COPY docker-start.sh /usr/local/bin/start
RUN chmod +x /usr/local/bin/start

EXPOSE 8000

CMD ["/usr/local/bin/start"]
