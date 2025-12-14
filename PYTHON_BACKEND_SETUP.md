# Python Backend Setup Guide

This guide explains how to set up and use the Python backend for the Budget Simulator.

## Overview

The Python backend consists of:
1. **Telegram Bot** (`bot.py`) - Handles Telegram bot commands and Mini App integration
2. **FastAPI Server** (`api.py`) - Provides AI advisor API endpoint
3. **Utilities** (`utils.py`) - Helper functions for Telegram validation

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
BOT_TOKEN=your_telegram_bot_token
MINI_APP_URL=https://your-frontend-url.com
OPENAI_API_KEY=your_openai_api_key
# OR for Gemini:
# USE_GEMINI=true
# GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run the API Server

```bash
python api.py
```

Or with auto-reload:
```bash
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

### 4. Run the Telegram Bot

In a separate terminal:

```bash
python bot.py
```

## Frontend Integration

Update your frontend to use the Python API instead of Supabase:

### Option 1: Update Environment Variable

In your frontend `.env`:
```env
VITE_API_URL=http://localhost:8000
# or in production:
VITE_API_URL=https://your-python-api.com
```

### Option 2: Update useAIChat Hook

The hook should automatically use `VITE_API_URL` if set. The endpoint is `/api/financial-advisor`.

## Deployment Options

### Deploy API to Railway

1. Connect your repository to Railway
2. Set environment variables:
   - `OPENAI_API_KEY` (or `GEMINI_API_KEY` if using Gemini)
   - `MINI_APP_URL` (your frontend URL)
3. Railway will auto-deploy on push

### Deploy API to Render

1. Create a new Web Service
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
4. Add environment variables

### Deploy Bot to Railway/Render

1. Create a background worker service
2. Start command: `python bot.py`
3. Add `BOT_TOKEN` and `MINI_APP_URL` environment variables

### Deploy to VPS

See `backend/README.md` for systemd service configuration.

## Testing

### Test API Endpoint

```bash
curl -X POST http://localhost:8000/api/financial-advisor \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "language": "en"
  }'
```

### Test Bot

1. Start the bot: `python bot.py`
2. Open Telegram and find your bot
3. Send `/start` command
4. Click the button to open Mini App

## Differences from TypeScript/Node.js Version

### Bot Implementation
- Uses `python-telegram-bot` library instead of `node-telegram-bot-api` or `telegraf`
- Same functionality, different syntax
- More Pythonic code style

### API Implementation
- FastAPI instead of Supabase Edge Functions
- Same streaming SSE response format
- Can be deployed anywhere (not just Supabase)
- Easier to customize and extend

### Benefits of Python Version
- ✅ More flexible deployment options
- ✅ Better for adding ML/AI features later
- ✅ Easier database integration
- ✅ More Python libraries available
- ✅ Can run on any server/VPS

## Migration from Supabase

If you're currently using Supabase Edge Functions:

1. Deploy the Python API to your preferred hosting
2. Update frontend `VITE_API_URL` to point to new API
3. No changes needed to frontend code (same API interface)

## Production Checklist

- [ ] Set proper CORS origins (not `["*"]`)
- [ ] Use HTTPS for API
- [ ] Set up rate limiting
- [ ] Add logging and monitoring
- [ ] Secure environment variables
- [ ] Set up database (if storing user data)
- [ ] Add error tracking (Sentry, etc.)
- [ ] Set up backups (if using database)

## Support

For issues or questions, check:
- `backend/README.md` for detailed documentation
- API documentation at `http://localhost:8000/docs` (when running)
- Telegram Bot API docs: https://core.telegram.org/bots/api
