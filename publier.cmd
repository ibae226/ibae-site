@echo off
chcp 65001 >nul
rem Publie le site IBAE : enregistre les modifications et les envoie sur GitHub.
rem Cloudflare met ensuite le site a jour automatiquement.
cd /d "%~dp0"
echo.
echo === Publication du site IBAE ===
echo.
echo Fichiers modifies :
git status --short
echo.
set "message="
set /p "message=Decris ta modification (Entree seule pour annuler) : "
if "%message%"=="" goto fin
git add .
git commit -m "%message%"
if errorlevel 1 goto erreur
git push
if errorlevel 1 goto erreur
echo.
echo Envoye. Le site sera a jour dans 2 a 3 minutes.
goto fin
:erreur
echo.
echo La publication n'a pas abouti. Lis le message ci-dessus.
:fin
echo.
pause
