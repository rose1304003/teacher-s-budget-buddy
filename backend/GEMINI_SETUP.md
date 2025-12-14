# Gemini API Setup Guide

This guide shows you how to use Google Gemini API with the official `google-genai` Python SDK.

## 🔑 Getting Your Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key (starts with `AIza...`)
5. **Free tier available!** No credit card required initially

## 📦 Installation

The `google-genai` package is already in `requirements.txt`. Install it:

```bash
cd backend
pip install -r requirements.txt
```

Or install directly:
```bash
pip install google-genai
```

## ⚙️ Configuration

### Option 1: Environment Variables (Recommended)

In Railway → API Service → Variables:
```env
USE_GEMINI=true
GEMINI_API_KEY=your_gemini_api_key_here
```

**Important:** Don't set `OPENAI_API_KEY` if you want to use Gemini, or remove it.

### Option 2: Local Development

In `backend/.env`:
```env
USE_GEMINI=true
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚀 How It Works

The code automatically detects which AI service to use:

1. **If `USE_GEMINI=true` and `GEMINI_API_KEY` is set** → Uses Gemini
2. **Otherwise** → Uses OpenAI (if `OPENAI_API_KEY` is set)

### Code Implementation

The backend uses the official Google `genai` SDK:

```python
from google import genai

# Initialize client
client = genai.Client(api_key=GEMINI_API_KEY)

# Stream response (async)
stream = await client.aio.models.generate_content_stream(
    model="gemini-2.5-flash",
    contents="Your prompt here",
    config={"temperature": 0.7}
)

# Process chunks
async for chunk in stream:
    if chunk.text:
        # Process text chunk
        print(chunk.text)
```

## 📝 Model Options

You can change the model in `backend/api.py`:

Current: `gemini-2.5-flash` (fast, cost-effective)

Other options:
- `gemini-2.0-flash-exp` - Latest experimental
- `gemini-1.5-pro` - More capable, slower
- `gemini-1.5-flash` - Balanced

To change, edit line in `api.py`:
```python
model="gemini-2.5-flash"  # Change this
```

## 🧪 Testing

### Test Locally

1. Set environment variables:
   ```bash
   export USE_GEMINI=true
   export GEMINI_API_KEY=your-key-here
   ```

2. Start the API:
   ```bash
   python api.py
   ```

3. Test the endpoint:
   ```bash
   curl -X POST http://localhost:8000/api/financial-advisor \
     -H "Content-Type: application/json" \
     -d '{
       "message": "Hello!",
       "language": "en"
     }'
   ```

### Test in Railway

1. Deploy with Gemini environment variables
2. Check logs to see which AI service is being used
3. Test via your frontend or API directly

## 🔄 Switching Between OpenAI and Gemini

### Switch to Gemini:
1. Railway → API Service → Variables
2. Add/Update:
   ```env
   USE_GEMINI=true
   GEMINI_API_KEY=your-key
   ```
3. Remove or unset `OPENAI_API_KEY`
4. Redeploy

### Switch to OpenAI:
1. Railway → API Service → Variables
2. Add/Update:
   ```env
   OPENAI_API_KEY=your-key
   ```
3. Remove `USE_GEMINI` or set to `false`
4. Redeploy

## 💰 Pricing

Gemini 2.5 Flash pricing (as of 2024):
- **Free tier**: Generous limits (usually sufficient for testing)
- **Paid**: ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens
- **Much cheaper than OpenAI!**

## ✅ Advantages of Using Official SDK

- ✅ **Cleaner code** - No manual HTTP requests
- ✅ **Better error handling** - SDK handles errors
- ✅ **Type safety** - Better IDE support
- ✅ **Automatic updates** - SDK gets improvements
- ✅ **Official support** - Maintained by Google

## 🐛 Troubleshooting

### Error: "google-genai package not installed"
```bash
pip install google-genai
```

### Error: "Invalid API key"
- Check your API key is correct
- Make sure it starts with `AIza...`
- Verify it's set in environment variables

### Error: "Rate limit exceeded"
- Gemini has free tier limits
- Wait a bit and try again
- Consider upgrading to paid tier if needed

### Not switching to Gemini?
- Check `USE_GEMINI=true` (not `USE_GEMINI=true ` with spaces)
- Make sure `GEMINI_API_KEY` is set
- Remove `OPENAI_API_KEY` if you want to force Gemini

## 📚 Official Documentation

- Google AI SDK: https://ai.google.dev/gemini-api/docs
- Python SDK: https://github.com/googleapis/python-genai
- API Reference: https://ai.google.dev/api

## 🎯 Summary

1. Get API key from https://makersuite.google.com/app/apikey
2. Install: `pip install google-genai`
3. Set env vars: `USE_GEMINI=true` and `GEMINI_API_KEY=...`
4. Deploy and test!

The code is already set up - just add your API key! 🚀
