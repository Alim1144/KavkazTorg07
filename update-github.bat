@echo off
chcp 65001 >nul
echo Обновление репозитория GitHub...
echo.

cd /d "%~dp0"

git add .
echo.
echo Файлы добавлены в индекс
echo.

git commit -m "Добавлена админ-панель, система управления товарами и напитки в каталог"
echo.
echo Коммит создан
echo.

git push origin main
echo.
echo Репозиторий обновлен!
echo.
pause
