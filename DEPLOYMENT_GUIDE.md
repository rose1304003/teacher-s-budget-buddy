# Complete Deployment Guide

This guide will help you deploy your Budget Simulator:
- **Backend (Bot + API)** → Railway
- **Frontend (React App)** → Vercel or Netlify

## Prerequisites

1. **Telegram Bot Token** from [BotFather](https://t.me/botfather)
2. **OpenAI API Key** from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Or **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Accounts on:
   - [Railway](https://railway.app) (for backend)
   - [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (for frontend)

---

## Part 1: Deploy Backend to Railway

Railway will host both your Telegram bot and FastAPI server.

### Step 1: Prepare Your Repository

1. Push your code to GitHub/GitLab/Bitbucket
2. Make sure `backend/` folder is included

### Step 2: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository

### Step 3: Deploy the API Server

1. In Railway, click **"New"** → **"Service"**
2. Choose **"GitHub Repo"** and select your repository
3. Railway will detect the project - click **"Deploy Now"**
4. Go to **Settings** → **Service Settings** → **Source**
5. Set **Root Directory** to `backend`
6. Go to **Deployments** → **Settings** → **Build & Deploy**
7. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
   - **Healthcheck Path**: `/health`

### Step 4: Set Environment Variables (API Service)

Go to **Variables** tab and add:

```env
OPENAI_API_KEY=your_openai_api_key_here
# OR if using Gemini:
# USE_GEMINI=true
# GEMINI_API_KEY=your_gemini_api_key_here

# CORS: Add your frontend URL (will set after deploying frontend)
FRONTEND_URL=https://your-frontend.vercel.app
```

### Step 5: Get API URL

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"** to get a public URL
3. Copy the URL (e.g., `https://your-api-production.up.railway.app`)
4. Note this URL - you'll need it for frontend

### Step 6: Deploy the Telegram Bot (Separate Service)

1. In Railway, click **"New"** → **"Service"** again
2. Select **"GitHub Repo"** → same repository
3. Go to **Settings** → **Source**
4. Set **Root Directory** to `backend`
5. Go to **Deployments** → **Settings** → **Build & Deploy**
6. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python bot.py`

### Step 7: Set Environment Variables (Bot Service)

Go to **Variables** tab and add:

```env
BOT_TOKEN=your_telegram_bot_token
MINI_APP_URL=https://your-frontend.vercel.app
API_URL=https://your-api-production.up.railway.app
```

> **Note**: You'll update `MINI_APP_URL` after deploying the frontend.

### Step 8: Verify Backend is Running

1. Visit `https://your-api-production.up.railway.app/health`
2. You should see: `{"status":"ok","ai_configured":true}`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. Make sure your frontend code is in the repository root
2. Create/update `.env.production` (or set in Vercel):

```env
VITE_API_URL=https://your-api-production.up.railway.app
```

> **Note**: You don't need Supabase variables if using Python API only.

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add **Environment Variables**:
   ```
   VITE_API_URL=https://your-api-production.up.railway.app
   ```

6. Click **"Deploy"**

#### Option B: Via Vercel CLI

```bash
npm i -g vercel
cd your-project
vercel
# Follow prompts
vercel --prod
```

### Step 3: Update CORS in Backend

1. Go back to Railway → API Service → **Variables**
2. Add/Update:
   ```env
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

3. Update `backend/api.py` CORS to use this variable:
   ```python
   FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://your-frontend.vercel.app')
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[FRONTEND_URL],  # More secure than ["*"]
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### Step 4: Update Bot Environment Variables

1. Go to Railway → Bot Service → **Variables**
2. Update:
   ```env
   MINI_APP_URL=https://your-frontend.vercel.app
   ```

3. Redeploy the bot service

### Step 5: Configure Telegram Bot

1. Go to [BotFather](https://t.me/botfather) on Telegram
2. Send `/mybots` → Select your bot
3. Go to **"Bot Settings"** → **"Menu Button"**
4. Click **"Configure Menu Button"**
5. Choose **"Web App"**
6. Set URL to: `https://your-frontend.vercel.app`

---

## Part 2 Alternative: Deploy Frontend to Netlify

### Step 1: Deploy via Netlify Dashboard

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your repository
4. Configure build settings:
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. Go to **Site settings** → **Environment variables**
6. Add:
   ```
   VITE_API_URL=https://your-api-production.up.railway.app
   ```

7. Click **"Deploy site"**

### Step 2: Update URLs

1. Note your Netlify URL (e.g., `https://your-app.netlify.app`)
2. Update Railway Bot service environment variable:
   ```env
   MINI_APP_URL=https://your-app.netlify.app
   ```
3. Update Railway API service CORS (see Vercel Step 3)

### Step 3: Configure Telegram Bot

Same as Vercel Step 5, but use your Netlify URL.

---

## Part 3: Testing Deployment

### Test API

```bash
curl https://your-api-production.up.railway.app/health
# Should return: {"status":"ok","ai_configured":true}
```

### Test Frontend

1. Visit `https://your-frontend.vercel.app` (or Netlify URL)
2. Check browser console for errors
3. Try the AI advisor - it should connect to Railway API

### Test Telegram Bot

1. Open Telegram
2. Find your bot
3. Send `/start`
4. Click the menu button or button to open Mini App
5. Mini App should load your frontend
6. Test AI advisor in the Mini App

---

## Environment Variables Summary

### Railway API Service
```env
OPENAI_API_KEY=sk-...
# OR
USE_GEMINI=true
GEMINI_API_KEY=...
FRONTEND_URL=https://your-frontend.vercel.app
```

### Railway Bot Service
```env
BOT_TOKEN=123456:ABC-...
MINI_APP_URL=https://your-frontend.vercel.app
API_URL=https://your-api-production.up.railway.app
```

### Vercel/Netlify Frontend
```env
VITE_API_URL=https://your-api-production.up.railway.app
```

---

## Troubleshooting

### Backend Issues

**Problem**: API returns 500 errors
- **Solution**: Check Railway logs → Deployments → View logs
- Check if `OPENAI_API_KEY` is set correctly

**Problem**: CORS errors in browser
- **Solution**: Update `FRONTEND_URL` in Railway API service
- Redeploy API service

**Problem**: Bot not responding
- **Solution**: Check Railway Bot service logs
- Verify `BOT_TOKEN` is correct
- Check if bot service is running (should be "Active")

### Frontend Issues

**Problem**: Can't connect to API
- **Solution**: Check `VITE_API_URL` is correct
- Verify API is accessible: `curl https://your-api-url/health`
- Check browser console for CORS errors

**Problem**: Mini App not loading in Telegram
- **Solution**: Ensure frontend URL uses HTTPS
- Check Telegram bot menu button is configured
- Try opening URL directly in browser first

---

## Cost Estimates

### Railway (Backend)
- **Free tier**: $5 credit/month
- **Hobby plan**: $20/month (includes 2 services)
- Bot + API = 2 services
- **Estimated cost**: Free tier sufficient for testing, ~$20/month for production

### Vercel (Frontend)
- **Free tier**: Unlimited personal projects
- **Hobby plan**: $20/month (for team features)
- **Estimated cost**: Free for personal use

### Netlify (Frontend)
- **Free tier**: 100GB bandwidth, 300 build minutes
- **Pro plan**: $19/month
- **Estimated cost**: Free tier sufficient for most projects

### OpenAI API
- **GPT-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Estimated cost**: $5-20/month depending on usage

---

## Next Steps

1. ✅ Set up monitoring (Railway has built-in logs)
2. ✅ Add error tracking (Sentry)
3. ✅ Set up database if needed (Railway PostgreSQL addon)
4. ✅ Configure custom domains
5. ✅ Set up CI/CD for automatic deployments

---

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Railway API | `https://your-api.up.railway.app` | FastAPI server |
| Railway Bot | Runs in background | Telegram bot |
| Vercel/Netlify | `https://your-app.vercel.app` | React frontend |

---

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Telegram Bot API: https://core.telegram.org/bots/api
