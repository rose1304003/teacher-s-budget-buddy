# Telegram Bot Example Code

This file contains example code for creating a Telegram bot that opens your Mini App.

## Prerequisites

- Node.js installed
- Your bot token from BotFather
- Your deployed Mini App URL

## Installation

```bash
npm install node-telegram-bot-api
# or
npm install telegraf
```

## Example 1: Using node-telegram-bot-api

```javascript
const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot token
const token = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Your Mini App URL
const MINI_APP_URL = 'https://your-deployed-app.com';

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    `👋 Hi ${msg.from.first_name}! I'm your Budget Simulator Bot.\n\n` +
    `I help teachers learn financial management through interactive scenarios.\n\n` +
    `Click the button below to start!`,
    {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🚀 Open Budget Simulator',
            web_app: { url: MINI_APP_URL }
          }
        ]]
      }
    }
  );
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId,
    `📚 *Budget Simulator Help*\n\n` +
    `*Commands:*\n` +
    `/start - Start the budget simulator\n` +
    `/help - Show this help message\n` +
    `/progress - View your progress\n` +
    `/tips - Get financial tips\n\n` +
    `*What is this?*\n` +
    `This is an educational tool to practice financial management. ` +
    `All amounts are virtual - no real money involved!\n\n` +
    `Click the menu button or use the button below to open the simulator.`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🚀 Open Simulator', web_app: { url: MINI_APP_URL } }
        ]]
      }
    }
  );
});

// Handle /tips command
bot.onText(/\/tips/, (msg) => {
  const chatId = msg.chat.id;
  
  const tips = [
    "💡 Always save 10-20% of your income",
    "📊 Track every expense to understand your spending",
    "🎯 Set clear financial goals",
    "⚡ Build an emergency fund for unexpected expenses",
    "📈 Pay off high-interest debt first",
    "🛒 Distinguish between needs and wants",
    "📅 Review your budget monthly",
    "🎓 Learn about investments for long-term growth"
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  bot.sendMessage(chatId, 
    `💡 *Financial Tip of the Day*\n\n${randomTip}\n\n` +
    `Want to practice? Open the simulator!`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🚀 Open Simulator', web_app: { url: MINI_APP_URL } }
        ]]
      }
    }
  );
});

// Handle messages from Mini App (if data is sent)
bot.on('message', (msg) => {
  if (msg.web_app_data) {
    const chatId = msg.chat.id;
    const data = JSON.parse(msg.web_app_data.data);
    
    // Handle data from Mini App
    console.log('Received from Mini App:', data);
    
    // Example: Handle completion event
    if (data.action === 'month_completed') {
      bot.sendMessage(chatId,
        `🎉 Great job completing Month ${data.month}!\n\n` +
        `Your stability score: ${data.stabilityIndex}%\n` +
        `Keep up the good work! 💪`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '📊 Continue', web_app: { url: MINI_APP_URL } }
            ]]
          }
        }
      );
    }
  }
});

console.log('Bot is running...');
```

## Example 2: Using Telegraf (Modern Framework)

```javascript
const { Telegraf } = require('telegraf');

const bot = new Telegraf('YOUR_BOT_TOKEN');
const MINI_APP_URL = 'https://your-deployed-app.com';

// Start command
bot.start((ctx) => {
  ctx.reply(
    `👋 Hi ${ctx.from.first_name}! Welcome to Budget Simulator.\n\n` +
    `Learn financial management through interactive scenarios!`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: '🚀 Open Simulator', web_app: { url: MINI_APP_URL } }
        ]]
      }
    }
  );
});

// Help command
bot.help((ctx) => {
  ctx.reply(
    `📚 *Available Commands:*\n\n` +
    `/start - Start the simulator\n` +
    `/help - Show help\n` +
    `/tips - Get financial tips\n\n` +
    `Click the menu button to open the Mini App!`,
    { parse_mode: 'Markdown' }
  );
});

// Tips command
bot.command('tips', (ctx) => {
  const tips = [
    "💡 Save 10-20% of your income",
    "📊 Track all expenses",
    "🎯 Set financial goals"
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  ctx.reply(
    `💡 *Tip:* ${randomTip}\n\nOpen simulator to practice!`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🚀 Open Simulator', web_app: { url: MINI_APP_URL } }
        ]]
      }
    }
  );
});

// Handle web app data
bot.on('web_app_data', (ctx) => {
  const data = JSON.parse(ctx.webAppData.data);
  console.log('Data from Mini App:', data);
  
  // Handle the data as needed
  ctx.reply('✅ Data received from Mini App!');
});

bot.launch();
console.log('Bot is running...');
```

## Setting Up Menu Button

After creating your bot, set up the menu button using BotFather:

1. Send `/mybots` to BotFather
2. Select your bot
3. Choose "Bot Settings" → "Menu Button"
4. Choose "Configure Menu Button"
5. Set:
   - **Text**: "Open Simulator"
   - **URL**: Your Mini App URL

Alternatively, you can set it programmatically:

```javascript
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('YOUR_BOT_TOKEN');

bot.setChatMenuButton({
  menu_button: {
    type: 'web_app',
    text: 'Open Simulator',
    web_app: {
      url: 'https://your-deployed-app.com'
    }
  }
});
```

## Handling Data from Mini App

In your Mini App, you can send data back to the bot using:

```typescript
import { useTelegram } from '@/integrations/telegram/useTelegram';

function MyComponent() {
  const { sendData } = useTelegram();
  
  const handleComplete = () => {
    sendData(JSON.stringify({
      action: 'month_completed',
      month: 1,
      stabilityIndex: 85,
      savings: 50000
    }));
  };
  
  return <button onClick={handleComplete}>Complete Month</button>;
}
```

## Environment Setup

Create a `.env` file:

```env
BOT_TOKEN=your_bot_token_here
MINI_APP_URL=https://your-deployed-app.com
PORT=3000
```

Load it in your bot code:

```javascript
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const MINI_APP_URL = process.env.MINI_APP_URL;
```

## Deploying Your Bot

### Option 1: Local Development (Polling)

```javascript
// Simple polling for development
const bot = new TelegramBot(token, { polling: true });
```

### Option 2: Webhook (Production)

```javascript
// Set webhook
bot.setWebHook('https://your-server.com/webhook');

// Handle updates
app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
```

## Testing

1. Start your bot
2. Open Telegram and find your bot
3. Send `/start`
4. Click the button or menu button
5. Your Mini App should open in Telegram's webview

## Next Steps

1. Set up your bot using one of the examples above
2. Deploy your Mini App (see TELEGRAM_SETUP.md)
3. Configure the menu button
4. Test the integration
5. Add more commands as needed
