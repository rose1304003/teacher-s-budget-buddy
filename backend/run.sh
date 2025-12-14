#!/bin/bash
# Startup script for running both bot and API

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Start API in background
echo "Starting API server..."
python api.py &
API_PID=$!

# Wait a moment for API to start
sleep 2

# Start bot
echo "Starting Telegram bot..."
python bot.py &
BOT_PID=$!

# Wait for user interrupt
echo "Both services are running. Press Ctrl+C to stop."
wait $API_PID $BOT_PID
