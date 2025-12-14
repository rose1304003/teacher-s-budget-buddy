"""
Telegram Bot for Budget Simulator
Handles bot commands and Mini App integration
"""
import os
import logging
import random
from typing import Optional
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, MenuButtonWebApp, WebAppInfo
from telegram.ext import Application, CommandHandler, MessageHandler, ContextTypes, filters
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Configuration
BOT_TOKEN = os.getenv('BOT_TOKEN')
MINI_APP_URL = os.getenv('MINI_APP_URL', 'https://your-deployed-app.com')
API_URL = os.getenv('API_URL', 'http://localhost:8000')

# Financial tips database
FINANCIAL_TIPS = [
    "💡 Always save 10-20% of your income",
    "📊 Track every expense to understand your spending",
    "🎯 Set clear financial goals",
    "⚡ Build an emergency fund for unexpected expenses",
    "📈 Pay off high-interest debt first",
    "🛒 Distinguish between needs and wants",
    "📅 Review your budget monthly",
    "🎓 Learn about investments for long-term growth",
    "💰 Start investing early - time is your best friend",
    "📉 Avoid impulse purchases - wait 24 hours before buying",
    "🏦 Compare prices before making big purchases",
    "💼 Create a separate savings account for emergencies",
]


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /start command"""
    user = update.effective_user
    chat_id = update.effective_chat.id
    
    welcome_message = (
        f"👋 Hi {user.first_name}! I'm your personal financial assistant.\n\n"
        "I help you track income and expenses, set goals, and manage your finances. "
        "Want to understand where your money goes? Just send me a photo, voice, or text — "
        "I'll log everything and help you analyze it.\n\n"
        "Let's get started!"
    )
    
    keyboard = [
        [InlineKeyboardButton(
            "🚀 Open Budget Simulator",
            web_app=WebAppInfo(url=MINI_APP_URL)
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        welcome_message,
        reply_markup=reply_markup
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /help command"""
    chat_id = update.effective_chat.id
    
    help_text = (
        "📚 *Budget Simulator Help*\n\n"
        "*Commands:*\n"
        "/start - Start the budget simulator\n"
        "/help - Show this help message\n"
        "/progress - View your progress\n"
        "/tips - Get financial tips\n\n"
        "*What is this?*\n"
        "This is an educational tool to practice financial management. "
        "All amounts are virtual - no real money involved!\n\n"
        "Click the menu button or use the button below to open the simulator."
    )
    
    keyboard = [
        [InlineKeyboardButton(
            "🚀 Open Simulator",
            web_app=WebAppInfo(url=MINI_APP_URL)
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        help_text,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


async def tips_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /tips command - Send random financial tip"""
    chat_id = update.effective_chat.id
    random_tip = random.choice(FINANCIAL_TIPS)
    
    tip_message = (
        f"💡 *Financial Tip of the Day*\n\n"
        f"{random_tip}\n\n"
        f"Want to practice? Open the simulator!"
    )
    
    keyboard = [
        [InlineKeyboardButton(
            "🚀 Open Simulator",
            web_app=WebAppInfo(url=MINI_APP_URL)
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        tip_message,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


async def progress_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /progress command - Link to progress view"""
    chat_id = update.effective_chat.id
    
    progress_message = (
        "📊 *Your Progress*\n\n"
        "View your financial progress and monthly summaries in the simulator.\n\n"
        "Click the button below to open the Results section!"
    )
    
    keyboard = [
        [InlineKeyboardButton(
            "📊 View Progress",
            web_app=WebAppInfo(url=f"{MINI_APP_URL}#results")
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        progress_message,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle data sent from Mini App"""
    chat_id = update.effective_chat.id
    web_app_data = update.message.web_app_data
    
    if web_app_data:
        try:
            import json
            data = json.loads(web_app_data.data)
            logger.info(f"Received data from Mini App: {data}")
            
            # Handle different action types
            if data.get('action') == 'month_completed':
                month = data.get('month', 1)
                stability = data.get('stabilityIndex', 0)
                
                response_message = (
                    f"🎉 Great job completing Month {month}!\n\n"
                    f"Your stability score: {stability}%\n"
                    f"Keep up the good work! 💪"
                )
                
                keyboard = [
                    [InlineKeyboardButton(
                        "📊 Continue",
                        web_app=WebAppInfo(url=MINI_APP_URL)
                    )]
                ]
                reply_markup = InlineKeyboardMarkup(keyboard)
                
                await update.message.reply_text(
                    response_message,
                    reply_markup=reply_markup
                )
            else:
                await update.message.reply_text(
                    "✅ Data received from Mini App! Thank you for using the simulator."
                )
        except json.JSONDecodeError:
            logger.error("Failed to parse web app data")
            await update.message.reply_text(
                "❌ Sorry, I couldn't process that data. Please try again."
            )


async def handle_voice_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle voice messages (placeholder for future voice processing)"""
    chat_id = update.effective_chat.id
    
    # In the future, you can integrate speech-to-text here
    # For now, just acknowledge the voice message
    await update.message.reply_text(
        "🎤 I received your voice message! Voice processing is coming soon. "
        "For now, please use text messages or open the Mini App."
    )


async def handle_text_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle general text messages - redirect to Mini App or provide guidance"""
    chat_id = update.effective_chat.id
    text = update.message.text
    
    # If user sends a message that's not a command, guide them to the Mini App
    if text and not text.startswith('/'):
        response = (
            "💬 I see your message! For detailed financial assistance and tracking, "
            "please open the Mini App where you can:\n\n"
            "• Track your expenses\n"
            "• Get personalized advice from AI assistant\n"
            "• Manage your budget\n"
            "• View your progress\n\n"
            "Click the button below to open the simulator!"
        )
        
        keyboard = [
            [InlineKeyboardButton(
                "🚀 Open Budget Simulator",
                web_app=WebAppInfo(url=MINI_APP_URL)
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            response,
            reply_markup=reply_markup
        )


async def post_init(application: Application) -> None:
    """Set up menu button after bot initialization"""
    await application.bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text="Open Simulator",
            web_app=WebAppInfo(url=MINI_APP_URL)
        )
    )


def main() -> None:
    """Start the bot"""
    if not BOT_TOKEN:
        raise ValueError("BOT_TOKEN environment variable is not set!")
    
    # Create application
    application = Application.builder().token(BOT_TOKEN).post_init(post_init).build()
    
    # Register handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("tips", tips_command))
    application.add_handler(CommandHandler("progress", progress_command))
    
    # Handle web app data (when Mini App sends data back)
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
    
    # Handle voice messages
    application.add_handler(MessageHandler(filters.VOICE, handle_voice_message))
    
    # Handle text messages (fallback)
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text_message))
    
    # Start the bot
    logger.info("Bot is starting...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
