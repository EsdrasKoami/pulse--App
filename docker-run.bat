@echo off
chcp 65001 >nul
title Pulse — Lancement Docker Compose

echo ==============================================================================
echo   🐳 PULSE — Lancement avec Docker Compose
echo ==============================================================================
echo.

cd /d "%~dp0"

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Docker n'est pas détecté. Veuillez installer et démarrer Docker Desktop.
    pause
    exit /b 1
)

echo ➜ Construction et lancement des conteneurs...
docker compose up --build -d

echo.
echo ==============================================================================
echo   🎉 Pulse fonctionne dans Docker !
echo   🌐 Ouverture sur : http://localhost:8000
echo   👤 Admin : admin@edu.cegeptr.qc.ca ^| Mot de passe : admin123
echo   Pour voir les logs : docker compose logs -f
echo   Pour stopper       : docker compose down
echo ==============================================================================
echo.

start http://localhost:8000
pause
