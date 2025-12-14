# Telegram Bot & Mini App Setup Guide

This guide will help you set up your Telegram bot and integrate this Mini App.

## Prerequisites

1. A Telegram account
2. A server/hosting for your Mini App (Vercel, Netlify, or any static hosting)
3. Node.js installed (for local development)

## Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Start a chat with BotFather and send `/newbot`
3. Follow the instructions:
   - Choose a name for your bot (e.g., "Budget Simulator Bot")
   - Choose a username (must end with `bot`, e.g., `budget_simulator_bot`)
4. Save the **Bot Token** that BotFather gives you (you'll need it later)

## Step 2: Create Mini App Menu Button

1. In BotFather, send `/newapp` command
2. Select your bot from the list
3. Fill in the required information:
   - **Title**: "Budget Simulator" (or your preferred name)
   - **Short name**: Must be unique (e.g., `budget-sim`)
   - **Description**: Brief description of your app
   - **Photo**: Upload an icon (512x512px recommended)
   - **Web App URL**: Your deployed Mini App URL (e.g., `https://your-domain.com`)

Alternatively, you can set it manually:

1. Send `/mybots` to BotFather
2. Select your bot
3. Choose "Bot Settings" → "Menu Button"
4. Choose "Configure Menu Button"
5. Set:
   - **Text**: "Open Simulator" (or your preferred text)
   - **URL**: Your deployed Mini App URL

## Step 3: Build and Deploy Your Mini App

### Local Development

```bash
# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev
# or
bun dev
```

### Production Build

```bash
# Build for production
npm run build
# or
bun run build
```

This creates a `dist` folder with your built app.

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Copy the deployment URL

### Deploy to Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run `netlify deploy --prod --dir=dist`
3. Follow the prompts
4. Copy the deployment URL

### Other Hosting Options

You can deploy the `dist` folder to:
- GitHub Pages
- Cloudflare Pages
- Any static hosting service
- Your own server (nginx, Apache, etc.)

## Step 4: Configure Your Bot Commands (Optional)

You can set up bot commands for better UX:

1. Send `/setcommands` to BotFather
2. Select your bot
3. Send the following commands (one per line):

```
start - Start the budget simulator
help - Get help and instructions
progress - View your progress
tips - Get financial tips
```

## Step 5: Testing

1. Open your bot in Telegram
2. Click the menu button (or send `/start`)
3. The Mini App should open in Telegram's webview
4. Test all features to ensure everything works

## Step 6: Bot Features Implementation

Your Telegram bot should handle these commands:

### `/start` Command

```javascript
// Example bot response (Node.js with node-telegram-bot-api)
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    `👋 Hi! I'm your Budget Simulator Bot.\n\n` +
    `Click the button below to start managing your virtual budget!`,
    {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🚀 Open Budget Simulator',
            web_app: { url: 'https://your-deployed-app-url.com' }
          }
        ]]
      }
    }
  );
});
```

### Other Commands

- `/help` - Show help information
- `/progress` - Link to progress view in Mini App
- `/tips` - Send financial tips

## Step 7: Web App URL Configuration

Make sure your deployed Mini App URL:
1. ✅ Is accessible via HTTPS (required by Telegram)
2. ✅ Has proper CORS headers (if needed)
3. ✅ Responds to requests from Telegram's domains

## Environment Variables

If you need backend API endpoints, create a `.env` file:

```env
VITE_API_URL=https://your-api-url.com
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
```

**Note**: Never expose sensitive tokens in client-side code. Use environment variables only for non-sensitive configuration.

## Telegram WebApp API Usage

The app automatically detects if it's running in Telegram and initializes the WebApp SDK. You can access Telegram features through the `useTelegram` hook:

```typescript
import { useTelegram } from '@/integrations/telegram/useTelegram';

function MyComponent() {
  const { user, webApp, isTelegram, sendData, close, hapticFeedback } = useTelegram();
  
  // User info (only available in Telegram)
  console.log(user?.first_name);
  
  // Send data back to bot
  sendData(JSON.stringify({ action: 'completed' }));
  
  // Close the Mini App
  close();
  
  // Haptic feedback
  hapticFeedback('impact', 'medium');
}
```

## Security Considerations

1. **Validate Init Data**: Always validate `initData` on your backend
2. **HTTPS Only**: Telegram requires HTTPS for Mini Apps
3. **Origin Check**: Verify requests come from Telegram domains
4. **User Data**: Never trust client-side data alone

## Backend Integration (Optional)

If you need to store user data, you'll need a backend:

1. **Validate Telegram init data** on your backend
2. **Store user progress** in a database
3. **Implement API endpoints** for data sync
4. **Use Telegram Bot API** to send notifications

Example init data validation (Node.js):

```javascript
const crypto = require('crypto');

function validateTelegramInitData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');
  
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return calculatedHash === hash;
}
```

## Troubleshooting

### Mini App doesn't open
- ✅ Check that your URL uses HTTPS
- ✅ Verify the URL is accessible
- ✅ Check bot menu button configuration

### Styles look wrong
- ✅ Ensure viewport meta tag is set correctly
- ✅ Check CSS variables for Telegram theme

### Telegram SDK not available
- ✅ Make sure the script is loaded in `index.html`
- ✅ Check browser console for errors

### User data not available
- ✅ User data is only available when opened from Telegram
- ✅ Check `initDataUnsafe` in development

## Resources

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram WebApp SDK Reference](https://core.telegram.org/bots/webapps#initializing-mini-apps)

## Support

For issues specific to this app, check the main README.md file.
