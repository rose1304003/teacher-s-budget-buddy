@echo off
REM Startup script for Windows to run both bot and API

REM Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM Start API in background
echo Starting API server...
start "Budget API" python api.py

REM Wait a moment for API to start
timeout /t 2 /nobreak >nul

REM Start bot
echo Starting Telegram bot...
python bot.py
