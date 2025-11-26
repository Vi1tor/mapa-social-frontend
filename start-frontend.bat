@echo off
echo.
echo ===================================
echo  Mapa Social - FRONTEND APENAS
echo  React + Vite Dev Server
echo ===================================
echo.
echo [INFO] Porta: 5173
echo [INFO] API Backend: http://localhost:8080/api/v1
echo.
echo [AVISO] O BACKEND precisa estar rodando na porta 8080!
echo.
echo [DICA] Para rodar Backend + Frontend junto, use:
echo        ..\mapa-social-backend-tmp\start-fullstack.bat
echo.
cd /d "%~dp0"

if not exist "node_modules" (
    echo [ERRO] node_modules nao encontrado!
    echo [INFO] Execute 'npm install' primeiro.
    pause
    exit /b 1
)

npm run dev
pause
