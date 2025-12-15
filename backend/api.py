"""
FastAPI Backend for Budget Simulator + Telegram Bot
- Telegram webhook endpoint: /telegram/webhook
- AI Financial Advisor endpoint: /api/financial-advisor (streaming)
- Tri-language (en/ru/uz) auto-detect for bot replies
"""

import os
import re
import json
import logging
from typing import Optional, Dict, Any, AsyncIterator

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel

# Google Gemini imports (optional)
try:
    from google import genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# -------------------------------------------------------------------
# Load env + logging
# -------------------------------------------------------------------
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("budget-buddy-api")

# -------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
USE_GEMINI = os.getenv("USE_GEMINI", "false").lower() == "true"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

if not TELEGRAM_BOT_TOKEN:
    logger.warning("TELEGRAM_BOT_TOKEN is not set. Telegram bot will not work.")

if not OPENAI_API_KEY and not (USE_GEMINI and GEMINI_API_KEY):
    logger.warning(
        "No AI API key set - AI features will not work. "
        "Set OPENAI_API_KEY or (USE_GEMINI=true and GEMINI_API_KEY)"
    )

# -------------------------------------------------------------------
# FastAPI app
# -------------------------------------------------------------------
app = FastAPI(title="Budget Buddy API", version="1.1.0")

allowed_origins = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# Language detection + translations (EN/RU/UZ-Latin)
# -------------------------------------------------------------------
CYRILLIC_RE = re.compile(r"[\u0400-\u04FF]")  # ru/cyrillic

UZ_LATIN_HINTS = ["o'", "g'", "sh", "ch", "yo", "ya", "yu", "q", "x", "o‘", "g‘"]
EN_HINTS = ["the", "and", "spent", "income", "salary", "coffee", "taxi", "rent"]


def detect_lang(text: str) -> str:
    t = (text or "").strip()
    if not t:
        return "en"
    if CYRILLIC_RE.search(t):
        return "ru"
    low = t.lower()
    if any(h in low for h in UZ_LATIN_HINTS):
        return "uz"
    if any(h in low.split() for h in EN_HINTS):
        return "en"
    return "uz"


MESSAGES = {
    "start": {
        "en": "👋 Hi! I’m your Budget Buddy.\n\nSend an expense like: <b>Coffee 50000</b>\nOr income like: <b>Salary 5000000</b>\n\nYou can also open the Mini App from the menu button.",
        "ru": "👋 Привет! Я ваш Budget Buddy.\n\nОтправьте расход: <b>Кофе 50000</b>\nИли доход: <b>Зарплата 5000000</b>\n\nМини-приложение откроется через кнопку меню.",
        "uz": "👋 Salom! Men sizning Budget Buddy yordamchingiz.\n\nXarajat: <b>Kofe 50000</b>\nDaromad: <b>Maosh 5000000</b>\n\nMini ilovani menyu tugmasidan oching.",
    },
    "help": {
        "en": "Try:\n• <b>Coffee 50000</b>\n• <b>Taxi 30000</b>\n• <b>Salary 5000000</b>\n\n(Next step: we’ll save these into database.)",
        "ru": "Попробуйте:\n• <b>Кофе 50000</b>\n• <b>Такси 30000</b>\n• <b>Зарплата 5000000</b>\n\n(Следующий шаг: будем сохранять в базу.)",
        "uz": "Sinab ko‘ring:\n• <b>Kofe 50000</b>\n• <b>Taksi 30000</b>\n• <b>Maosh 5000000</b>\n\n(Keyingi qadam: bazaga saqlaymiz.)",
    },
    "no_token": {
        "en": "⚠️ Bot token is not configured on the server.",
        "ru": "⚠️ Токен бота не настроен на сервере.",
        "uz": "⚠️ Serverda bot token sozlanmagan.",
    },
    "ok": {"en": "✅ OK", "ru": "✅ ОК", "uz": "✅ OK"},
    "next_step": {
        "en": "(Next step: we’ll save these into database.)",
        "ru": "(Следующий шаг: будем сохранять в базу.)",
        "uz": "(Keyingi qadam: bazaga saqlaymiz.)",
    },
    "try_title": {"en": "Try:", "ru": "Попробуйте:", "uz": "Sinab ko‘ring:"},
}


def t(key: str, lang: str) -> str:
    return MESSAGES.get(key, {}).get(lang) or MESSAGES.get(key, {}).get("en") or ""


# -------------------------------------------------------------------
# Telegram helpers
# -------------------------------------------------------------------
TELEGRAM_API = "https://api.telegram.org"


async def tg_send_message(chat_id: int, text: str, parse_mode: str = "HTML") -> None:
    if not TELEGRAM_BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN missing; cannot send Telegram messages.")
        return

    url = f"{TELEGRAM_API}/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": parse_mode}

    async with httpx.AsyncClient(timeout=20.0) as client:
        r = await client.post(url, json=payload)
        if not r.is_success:
            logger.error(f"Telegram sendMessage failed: {r.status_code} {r.text}")


# -------------------------------------------------------------------
# AI Assistant prompts
# -------------------------------------------------------------------
SYSTEM_PROMPTS = {
    "en": """You are a friendly and helpful personal financial assistant. You help users track income and expenses, set financial goals, and manage their finances through an educational budget simulator app.

Your personality:
- Friendly, warm, approachable
- Patient and encouraging
- Clear and simple
- Proactive

Important context:
- This is an educational simulator - all amounts are virtual
- Teach good financial habits
- Keep responses conversational (2-4 paragraphs)
""",
    "ru": """Вы — дружелюбный и полезный персональный финансовый помощник. Вы помогаете пользователям отслеживать доходы и расходы, ставить финансовые цели и управлять финансами через обучающее приложение-симулятор бюджета.

Важно:
- Это образовательный симулятор — суммы виртуальные
- Обучайте хорошим финансовым привычкам
- Ответ 2–4 абзаца, дружелюбно
""",
    "uz": """Siz do'stona va foydali shaxsiy moliyaviy yordamchisiz. Siz foydalanuvchilarga daromad va xarajatlarni kuzatish, maqsad qo‘yish va moliyani boshqarishda yordam berasiz (ta’limiy byudjet simulyatori).

Muhim:
- Bu ta’limiy simulyator — summalar virtual
- Yaxshi moliyaviy odatlarni o‘rgating
- Javob 2–4 paragraf, do‘stona uslubda
""",
}


class UserState(BaseModel):
    month: int
    virtualIncome: float
    currentBalance: float
    savings: float
    debt: float
    stabilityIndex: float
    stressLevel: float


class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    userState: Optional[UserState] = None


def build_context_message(user_state: Optional[UserState], language: str) -> str:
    if not user_state:
        return ""

    if language == "ru":
        return f"""

Текущее состояние:
- Месяц: {user_state.month}
- Виртуальный доход: {user_state.virtualIncome}
- Баланс: {user_state.currentBalance}
- Сбережения: {user_state.savings}
- Долг: {user_state.debt}
- Стабильность: {user_state.stabilityIndex}%
- Стресс: {user_state.stressLevel}%"""
    if language == "uz":
        return f"""

Joriy holat:
- Oy: {user_state.month}
- Virtual daromad: {user_state.virtualIncome}
- Balans: {user_state.currentBalance}
- Jamg'arma: {user_state.savings}
- Qarz: {user_state.debt}
- Barqarorlik: {user_state.stabilityIndex}%
- Stress: {user_state.stressLevel}%"""

    return f"""

User state:
- Month: {user_state.month}
- Virtual income: {user_state.virtualIncome}
- Balance: {user_state.currentBalance}
- Savings: {user_state.savings}
- Debt: {user_state.debt}
- Stability: {user_state.stabilityIndex}%
- Stress: {user_state.stressLevel}%"""


async def stream_openai(messages: list[dict]) -> AsyncIterator[bytes]:
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")

    api_url = "https://api.openai.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": messages, "stream": True}

    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream("POST", api_url, headers=headers, json=payload) as resp:
            if resp.status_code == 429:
                raise HTTPException(status_code=429, detail="Rate limit exceeded. Try later.")
            if resp.status_code == 401:
                raise HTTPException(status_code=401, detail="Invalid OPENAI_API_KEY.")
            if not resp.is_success:
                body = await resp.aread()
                logger.error(f"OpenAI error: {resp.status_code} {body}")
                raise HTTPException(status_code=resp.status_code, detail="OpenAI API error")

            # OpenAI streaming is already SSE-like ("data: ...\n\n"), so we pass it through.
            async for chunk in resp.aiter_bytes():
                yield chunk


async def stream_gemini(messages: list[dict]) -> AsyncIterator[str]:
    if not (USE_GEMINI and GEMINI_API_KEY):
        raise HTTPException(status_code=500, detail="Gemini not configured")
    if not GEMINI_AVAILABLE:
        raise HTTPException(status_code=500, detail="google-genai not installed (pip install google-genai)")

    client = genai.Client(api_key=GEMINI_API_KEY)

    system_prompt = messages[0]["content"] if messages and messages[0]["role"] == "system" else ""
    user_message = messages[-1]["content"] if messages else ""
    content = f"{system_prompt}\n\n{user_message}".strip()

    stream = await client.aio.models.generate_content_stream(
        model="gemini-2.5-flash",
        contents=content,
        config={"temperature": 0.7},
    )

    async for chunk in stream:
        if getattr(chunk, "text", None):
            chunk_data = {"choices": [{"delta": {"content": chunk.text}}]}
            yield f"data: {json.dumps(chunk_data)}\n\n"

    yield "data: [DONE]\n\n"


async def stream_ai_response(req: ChatRequest) -> StreamingResponse:
    lang = (req.language or "en").lower()
    if lang not in ("en", "ru", "uz"):
        lang = "en"

    system_prompt = SYSTEM_PROMPTS.get(lang, SYSTEM_PROMPTS["en"])
    context = build_context_message(req.userState, lang)

    messages = [
        {"role": "system", "content": system_prompt + context},
        {"role": "user", "content": req.message},
    ]

    if USE_GEMINI and GEMINI_API_KEY:
        async def gen():
            async for sse in stream_gemini(messages):
                yield sse
        return StreamingResponse(
            gen(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
        )

    return StreamingResponse(
        stream_openai(messages),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


# -------------------------------------------------------------------
# API endpoints
# -------------------------------------------------------------------
@app.post("/api/financial-advisor")
async def financial_advisor(req: ChatRequest):
    logger.info(f"AI request lang={req.language}")
    return await stream_ai_response(req)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "telegram_configured": bool(TELEGRAM_BOT_TOKEN),
        "ai_configured": bool(OPENAI_API_KEY or (USE_GEMINI and GEMINI_API_KEY)),
    }


@app.get("/")
async def root():
    return {
        "message": "Budget Buddy API",
        "version": "1.1.0",
        "endpoints": {
            "health": "/health",
            "financial_advisor": "/api/financial-advisor",
            "telegram_webhook": "/telegram/webhook",
        },
    }


# -------------------------------------------------------------------
# Parsing user entries (Telegram bot)
# -------------------------------------------------------------------
def parse_entries(text: str):
    """
    Extract pairs like:
      Kofe 25000
      Kofe: 25000
      Kofe - 25000
    Works with multi-line text too.
    """
    if not text:
        return []

    # remove commands at the beginning: /progress, /start, /help, etc.
    cleaned = re.sub(r"^/\w+\s*", "", text.strip())

    items = []
    for line in cleaned.splitlines():
        line = line.strip()
        if not line:
            continue

        # name + optional ":" or "-" + amount
        m = re.match(r"(.+?)\s*[:\-]?\s+(\d[\d\s]*)$", line)
        if not m:
            continue

        name = m.group(1).strip()
        amount = int(m.group(2).replace(" ", ""))  # "15 000 000" -> 15000000
        items.append((name, amount))

    return items


@app.post("/telegram/webhook")
async def telegram_webhook(payload: Dict[str, Any]):
    if not TELEGRAM_BOT_TOKEN:
        return JSONResponse({"ok": False, "error": "TELEGRAM_BOT_TOKEN missing"}, status_code=500)

    try:
        message = payload.get("message") or payload.get("edited_message")
        if not message:
            return {"ok": True}

        chat_id = message["chat"]["id"]
        text = message.get("text") or ""
        lang = detect_lang(text)
        low = text.strip().lower()

        logger.info(f"Telegram msg chat_id={chat_id} text={text!r} lang={lang}")

        # Commands
        if low in ("/start", "start"):
            await tg_send_message(chat_id, t("start", lang))
            return {"ok": True}

        if low.startswith("/help"):
            await tg_send_message(chat_id, t("help", lang))
            return {"ok": True}

        # Parse what user entered (works for /progress too)
        entries = parse_entries(text)

        if entries:
            lines = "\n".join([f"• <b>{name} {amount}</b>" for name, amount in entries])

            reply = (
                f"{t('try_title', lang)}\n"
                f"{lines}\n\n"
                f"{t('next_step', lang)}"
            )

            await tg_send_message(chat_id, reply)
            return {"ok": True}

        # If nothing matched, show help
        await tg_send_message(chat_id, t("help", lang))
        return {"ok": True}

    except Exception as e:
        logger.exception(f"telegram_webhook error: {e}")
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8080")))
