# Quick Deployment Checklist

Follow these steps in order for a successful deployment.

## 🚀 Quick Start (10 minutes)

### 1. Deploy Backend to Railway (5 min)

1. **Sign up**: https://railway.app → Sign in with GitHub
2. **New Project** → Deploy from GitHub repo
3. **Add Service** → GitHub Repo → Select your repo
4. **Configure API Service**:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
5. **Add Variables**:
   ```
   OPENAI_API_KEY=sk-your-key-here
   FRONTEND_URL=https://placeholder.vercel.app
   ```
6. **Generate Domain** → Copy API URL: `https://xxx.up.railway.app`
7. **Add Bot Service** (same repo, same root):
   - Start Command: `python bot.py`
8. **Add Bot Variables**:
   ```
   BOT_TOKEN=your-bot-token
   MINI_APP_URL=https://placeholder.vercel.app
   API_URL=https://xxx.up.railway.app
   ```

✅ Backend deployed! API URL: `https://xxx.up.railway.app`

---

### 2. Deploy Frontend to Vercel (3 min)

1. **Sign up**: https://vercel.com → Sign in with GitHub
2. **New Project** → Import repository
3. **Configure**:
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://xxx.up.railway.app
   ```
5. **Deploy**

✅ Frontend deployed! URL: `https://xxx.vercel.app`

---

### 3. Update URLs (2 min)

1. **Railway API Service** → Variables:
   ```
   FRONTEND_URL=https://xxx.vercel.app
   ```
   → Redeploy

2. **Railway Bot Service** → Variables:
   ```
   MINI_APP_URL=https://xxx.vercel.app
   ```
   → Redeploy

3. **Telegram BotFather**:
   - `/mybots` → Your bot → Menu Button
   - Set URL: `https://xxx.vercel.app`

✅ Everything connected!

---

## 🧪 Test It

1. Open `https://xxx.vercel.app` in browser → Should load
2. Open Telegram → Your bot → `/start` → Click button → Mini App opens
3. Try AI advisor → Should work!

---

## ❌ Common Issues

| Problem | Solution |
|---------|----------|
| API 500 error | Check Railway logs, verify `OPENAI_API_KEY` |
| CORS error | Update `FRONTEND_URL` in Railway API |
| Bot not responding | Check Railway Bot logs, verify `BOT_TOKEN` |
| Mini App won't load | Use HTTPS URL, configure in BotFather |

---

## 📝 Environment Variables Cheat Sheet

### Railway API Service
```env
OPENAI_API_KEY=sk-...
FRONTEND_URL=https://your-app.vercel.app
```

### Railway Bot Service
```env
BOT_TOKEN=123456:ABC-...
MINI_APP_URL=https://your-app.vercel.app
API_URL=https://your-api.up.railway.app
```

### Vercel Frontend
```env
VITE_API_URL=https://your-api.up.railway.app
```

---

## 🎯 Next Steps

- [ ] Test all features
- [ ] Set up custom domain
- [ ] Add error tracking
- [ ] Monitor usage/costs

For detailed guide, see `DEPLOYMENT_GUIDE.md`
