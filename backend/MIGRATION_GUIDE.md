# Migration Guide: TypeScript/Node.js to Python

This guide explains how to migrate from the TypeScript/Node.js backend to the Python implementation.

## What Was Converted

### 1. Telegram Bot
- **Before**: JavaScript/Node.js with `node-telegram-bot-api` or `telegraf`
- **After**: Python with `python-telegram-bot`
- **File**: `backend/bot.py`

### 2. AI Advisor API
- **Before**: Supabase Edge Function (Deno/TypeScript)
- **After**: FastAPI (Python)
- **File**: `backend/api.py`

### 3. Utilities
- **Before**: JavaScript crypto functions
- **After**: Python `cryptography` and `hmac` libraries
- **File**: `backend/utils.py`

## Key Features Implemented

### Bot Features (`bot.py`)
✅ `/start` command with Mini App button
✅ `/help` command
✅ `/tips` command with random financial tips
✅ `/progress` command
✅ Web App data handling (from Mini App)
✅ Voice message handling (placeholder)
✅ Text message handling (redirects to Mini App)
✅ Automatic menu button setup

### API Features (`api.py`)
✅ Streaming SSE responses (same as Supabase)
✅ Multi-language support (en, ru, uz)
✅ User state context integration
✅ Error handling and status codes
✅ CORS support
✅ Health check endpoint
✅ FastAPI automatic documentation (`/docs`)

### Utility Functions (`utils.py`)
✅ Telegram init data validation
✅ User data extraction from init data

## API Compatibility

The Python API maintains the **same interface** as the Supabase Edge Function:

- **Endpoint**: `/api/financial-advisor`
- **Method**: POST
- **Request format**: Same JSON structure
- **Response format**: Same SSE streaming format

This means your frontend code will work without changes!

## Setup Comparison

### TypeScript/Node.js Setup
```bash
npm install
# Configure Supabase Edge Functions
# Deploy to Supabase
```

### Python Setup
```bash
pip install -r requirements.txt
# Configure .env file
python api.py  # Start API
python bot.py  # Start bot
```

## Deployment Comparison

### Supabase Edge Functions
- Deploy via Supabase CLI
- Limited to Supabase infrastructure
- Deno runtime

### Python FastAPI
- Deploy to any cloud (Railway, Render, Vercel, AWS, etc.)
- Full control over infrastructure
- Can add databases, Redis, etc. easily

## Advantages of Python Version

1. **More Deployment Options**: Not tied to Supabase
2. **Better for ML/AI**: Python ecosystem for AI features
3. **Easier Database Integration**: SQLAlchemy, Django ORM, etc.
4. **More Libraries**: Rich ecosystem for financial calculations
5. **Better for Voice Processing**: Libraries like SpeechRecognition, Whisper
6. **Flexibility**: Easy to add new features and endpoints

## Migration Steps

### Option 1: Use Python API alongside Supabase (Gradual Migration)

1. Deploy Python API to your cloud
2. Update frontend `.env`:
   ```env
   VITE_API_URL=https://your-python-api.com
   ```
3. Keep Supabase as backup
4. Test thoroughly
5. Remove Supabase dependency when ready

### Option 2: Full Migration

1. Deploy Python API
2. Update frontend `.env` to use Python API
3. Remove Supabase dependencies
4. Deploy bot separately

## Testing

### Test API Locally

```bash
# Start API
python api.py

# In another terminal, test it
curl -X POST http://localhost:8000/api/financial-advisor \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "language": "en"}'
```

### Test Bot Locally

```bash
# Start bot
python bot.py

# In Telegram, send /start to your bot
```

## Production Checklist

- [ ] Update frontend `.env` with Python API URL
- [ ] Deploy Python API to cloud
- [ ] Deploy bot to cloud (or run on VPS)
- [ ] Set all environment variables
- [ ] Test all bot commands
- [ ] Test AI advisor in Mini App
- [ ] Monitor logs
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure CORS properly (not `["*"]`)
- [ ] Use HTTPS
- [ ] Set up rate limiting if needed

## Need Help?

- Check `backend/README.md` for detailed setup
- Check `PYTHON_BACKEND_SETUP.md` for quick start
- API docs available at `http://localhost:8000/docs` when running
