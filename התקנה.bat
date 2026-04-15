@echo off
chcp 65001 > /dev/null

python --version >/dev/null 2>&1
if errorlevel 1 (
    echo.
    echo  Python לא מותקן.
    echo  הורד מ: https://www.python.org/downloads/
    echo  חשוב: סמן "Add Python to PATH" בהתקנה.
    echo.
    pause
    exit /b 1
)

python "%~dp0setup.py"
