@echo off
chcp 65001 >nul
title Pulse — Plateforme de Jumelage CEGPTR

echo ==============================================================================
echo   🚀 PULSE — Plateforme de Jumelage Étudiant (Cégep de Trois-Rivières)
echo ==============================================================================
echo.

cd /d "%~dp0"

REM 1. Vérification des prérequis
echo [1/7] Vérification des prérequis système...
where php >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] PHP n'est pas détecté dans votre variable PATH.
    echo Veuillez installer PHP 8.2+ et l'ajouter à votre PATH.
    pause
    exit /b 1
)

where composer >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Composer n'est pas détecté dans votre variable PATH.
    echo Rendez-vous sur https://getcomposer.org/ pour l'installer.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js / NPM n'est pas détecté dans votre variable PATH.
    echo Rendez-vous sur https://nodejs.org/ pour l'installer.
    pause
    exit /b 1
)
echo  [OK] Outils PHP, Composer et NPM détectés.
echo.

REM 2. Configuration .env
echo [2/7] Configuration du fichier d'environnement (.env)...
if not exist .env (
    echo  ➜ Création du fichier .env depuis .env.example...
    copy .env.example .env >nul
)

findstr /m "APP_KEY=base64:" .env >nul 2>nul
if %errorlevel% neq 0 (
    echo  ➜ Génération de la clé d'application...
    php artisan key:generate --force
) else (
    echo  [OK] Clé d'application déjà configurée.
)
echo.

REM 3. Dépendances PHP et Node
echo [3/7] Vérification des dépendances...
if not exist vendor (
    echo  ➜ Installation des dépendances Composer (PHP)...
    call composer install --no-interaction --prefer-dist
) else (
    echo  [OK] Dépendances PHP (vendor) présentes.
)

if not exist node_modules (
    echo  ➜ Installation des dépendances NPM (Node/React)...
    call npm.cmd install
) else (
    echo  [OK] Dépendances Node (node_modules) présentes.
)
echo.

REM 4. Compilation des assets frontend (Vite)
echo [4/7] Compilation des assets frontend...
if exist public\hot del /f /q public\hot >nul 2>nul
if not exist public\build\manifest.json (
    echo  ➜ Compilation des assets avec Vite...
    call npm.cmd run build
) else (
    echo  [OK] Assets compilés prêts (public/build).
)
echo.

REM 5. Base de données SQLite
echo [5/7] Préparation de la base de données...
if not exist database mkdir database
if not exist database\database.sqlite (
    echo  ➜ Création de database\database.sqlite...
    type nul > database\database.sqlite
)
echo  ➜ Exécution des migrations et chargement des seeders...
php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction >nul 2>nul
echo  [OK] Base de données prête.
echo.

REM 6. Stockage et Caches
echo [6/7] Finalisation du stockage et des caches...
php artisan storage:link --no-interaction >nul 2>nul
php artisan optimize:clear >nul 2>nul
if exist public\hot del /f /q public\hot >nul 2>nul
echo  [OK] Caches réinitialisés et storage configuré.
echo.

REM 7. Lancement
echo ==============================================================================
echo   🎉 PULSE EST PRÊT !
echo   🌐 Ouverture du navigateur sur : http://127.0.0.1:8000
echo   👤 Compte Administrateur      : admin@edu.cegeptr.qc.ca
echo   🔑 Mot de passe               : admin123
echo   Pour arrêter le serveur       : Ctrl + C
echo ==============================================================================
echo.

REM Ouvrir le navigateur
start http://127.0.0.1:8000

REM Lancer le serveur Laravel
php artisan serve --port=8000
pause
