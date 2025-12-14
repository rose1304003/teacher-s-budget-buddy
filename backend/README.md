# Budget Simulator Backend (Python)

Python backend implementation for the Budget Simulator Telegram bot and API.

## Structure

- `bot.py` - Telegram bot implementation
- `api.py` - FastAPI backend for AI advisor
- `utils.py` - Utility functions (Telegram validation, etc.)
- `requirements.txt` - Python dependencies

## Setup

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

Or using virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
BOT_TOKEN=your_bot_token_from_botfather
MINI_APP_URL=https://your-deployed-app.com
API_URL=http://localhost:8000
OPENAI_API_KEY=your_openai_api_key
# OR for Gemini:
# USE_GEMINI=true
# GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run the API Server

```bash
python api.py
```

Or using uvicorn directly:

```bash
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

### 4. Run the Telegram Bot

In a separate terminal:

```bash
python bot.py
```

## API Endpoints

### POST /api/financial-advisor

AI Financial Advisor endpoint that returns streaming responses.

**Request Body:**
```json
{
  "message": "How can I save more money?",
  "language": "en",
  "userState": {
    "month": 1,
    "virtualIncome": 500000,
    "currentBalance": 450000,
    "savings": 50000,
    "debt": 0,
    "stabilityIndex": 75,
    "stressLevel": 20
  }
}
```

**Response:** Streaming SSE (Server-Sent Events) format

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "ai_configured": true
}
```

## Bot Commands

- `/start` - Start the bot and open Mini App
- `/help` - Show help information
- `/tips` - Get random financial tip
- `/progress` - View progress in Mini App

## Deployment

### Option 1: Deploy API to Cloud (Vercel, Railway, Render, etc.)

1. Update `MINI_APP_URL` in `.env` with your deployed API URL
2. Set environment variables on your hosting platform
3. Deploy the FastAPI app

### Option 2: Deploy Bot to Cloud

1. Use a service like Railway, Render, or Heroku
2. Set `BOT_TOKEN` and other environment variables
3. Keep the bot running 24/7

### Option 3: Run on VPS/Server

1. Install Python and dependencies on your server
2. Use systemd or supervisor to keep services running
3. Use nginx as reverse proxy for API

### Using systemd (Linux)

Create `/etc/systemd/system/budget-bot.service`:

```ini
[Unit]
Description=Budget Simulator Telegram Bot
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/python bot.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Create `/etc/systemd/system/budget-api.service`:

```ini
[Unit]
Description=Budget Simulator API
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/uvicorn api:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable budget-bot
sudo systemctl enable budget-api
sudo systemctl start budget-bot
sudo systemctl start budget-api
```

## Development

### Testing the API

```bash
curl -X POST http://localhost:8000/api/financial-advisor \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "language": "en",
    "userState": {
      "month": 1,
      "virtualIncome": 500000,
      "currentBalance": 500000,
      "savings": 50000,
      "debt": 0,
      "stabilityIndex": 75,
      "stressLevel": 20
    }
  }'
```

### Testing Telegram Init Data Validation

```python
from utils import validate_telegram_init_data, extract_user_from_init_data

init_data = "user=%7B%22id%22%3A123456%7D&hash=..."
bot_token = "your_bot_token"

if validate_telegram_init_data(init_data, bot_token):
    user = extract_user_from_init_data(init_data)
    print(f"Valid! User: {user}")
else:
    print("Invalid init data")
```

## Frontend Integration

Update your frontend `.env` to point to your Python API:

```env
VITE_API_URL=http://localhost:8000
# or
VITE_API_URL=https://your-deployed-api.com
```

Then update `src/hooks/useAIChat.ts` to use the new endpoint:

```typescript
const CHAT_URL = `${import.meta.env.VITE_API_URL}/api/financial-advisor`;
```

## Security Notes

1. **Never commit `.env` file** - it contains secrets
2. **Validate Telegram init data** on backend if storing user data
3. **Use HTTPS** in production
4. **Rate limit** API endpoints if needed
5. **Sanitize user inputs** before processing

## Troubleshooting

### Bot not responding
- Check if `BOT_TOKEN` is correct
- Verify bot is running: `python bot.py`
- Check logs for errors

### API not working
- Verify `OPENAI_API_KEY` (or `GEMINI_API_KEY`) is set
- Check if API is running: `curl http://localhost:8000/health`
- Check logs for errors

### CORS errors
- Update `allow_origins` in `api.py` CORS middleware
- Or use proper origin list instead of `["*"]`

## Next Steps

- Add database support for storing user progress
- Implement voice message processing
- Add user authentication
- Implement data persistence
- Add analytics and reporting
