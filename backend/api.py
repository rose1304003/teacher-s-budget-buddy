import os
import re
import json
import logging
from typing import Optional, Dict, Any, AsyncIterator, List

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

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("budget-buddy-api")

# -------------------------
# Config
# -------------------------
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
USE_GEMINI = os.getenv("USE_GEMINI", "false").lower() == "true"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # SERVER ONLY

if not TELEGRAM_BOT_TOKEN:
    logger.warning("TELEGRAM_BOT_TOKEN is not set. Telegram bot will not work.")
if not OPENAI_API_KEY and not (USE_GEMINI and GEMINI_API_KEY):
    logger.warning("No AI API key set - AI features will not work.")
if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    logger.warning("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. DB endpoints will not work.")

app = FastAPI(title="Budget Buddy API", version="1.2.0")

allowed_origins = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Language detection
# -------------------------
CYRILLIC_RE = re.compile(r"[\u0400-\u04FF]")
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
        "en": "👋 Hi! I’m your Budget Buddy.\n\nSend: <b>Coffee 50000</b>\nOr: <b>Salary 5000000</b>\n\nOpen the Mini App from the menu button.",
        "ru": "👋 Привет! Я ваш Budget Buddy.\n\nОтправьте: <b>Кофе 50000</b>\nИли: <b>Зарплата 5000000</b>\n\nМини-приложение откроется через кнопку меню.",
        "uz": "👋 Salom! Men Budget Buddy.\n\nYuboring: <b>Kofe 50000</b>\nYoki: <b>Maosh 5000000</b>\n\nMini ilovani menyudan oching.",
    },
    "help": {
        "en": "Try:\n• <b>Coffee 50000</b>\n• <b>Taxi 30000</b>\n• <b>Salary 5000000</b>",
        "ru": "Попробуйте:\n• <b>Кофе 50000</b>\n• <b>Такси 30000</b>\n• <b>Зарплата 5000000</b>",
        "uz": "Sinab ko‘ring:\n• <b>Kofe 50000</b>\n• <b>Taksi 30000</b>\n• <b>Maosh 5000000</b>",
    },
    "try_title": {"en": "Try:", "ru": "Попробуйте:", "uz": "Sinab ko‘ring:"},
    "next_step": {
        "en": "(Next step: we’ll save these into database.)",
        "ru": "(Следующий шаг: будем сохранять в базу.)",
        "uz": "(Keyingi qadam: bazaga saqlaymiz.)",
    },
}
def t(key: str, lang: str) -> str:
    return MESSAGES.get(key, {}).get(lang) or MESSAGES.get(key, {}).get("en") or ""

# -------------------------
# Telegram
# -------------------------
TELEGRAM_API = "https://api.telegram.org"

async def tg_send_message(chat_id: int, text: str, parse_mode: str = "HTML") -> None:
    if not TELEGRAM_BOT_TOKEN:
        return
    url = f"{TELEGRAM_API}/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": parse_mode}
    async with httpx.AsyncClient(timeout=20.0) as client:
        r = await client.post(url, json=payload)
        if not r.is_success:
            logger.error(f"Telegram sendMessage failed: {r.status_code} {r.text}")

def parse_entries(text: str):
    if not text:
        return []
    cleaned = re.sub(r"^/\w+\s*", "", text.strip())
    items = []
    for line in cleaned.splitlines():
        line = line.strip()
        if not line:
            continue
        m = re.match(r"(.+?)\s*[:\-]?\s+(\d[\d\s]*)$", line)
        if not m:
            continue
        name = m.group(1).strip()
        amount = int(m.group(2).replace(" ", ""))
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

        if low in ("/start", "start"):
            await tg_send_message(chat_id, t("start", lang))
            return {"ok": True}

        if low.startswith("/help"):
            await tg_send_message(chat_id, t("help", lang))
            return {"ok": True}

        entries = parse_entries(text)
        if entries:
            lines = "\n".join([f"• <b>{name} {amount}</b>" for name, amount in entries])
            reply = f"{t('try_title', lang)}\n{lines}\n\n{t('next_step', lang)}"
            await tg_send_message(chat_id, reply)
            return {"ok": True}

        await tg_send_message(chat_id, t("help", lang))
        return {"ok": True}

    except Exception as e:
        logger.exception(f"telegram_webhook error: {e}")
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)

# -------------------------
# AI (keep your old streaming logic if you want)
# -------------------------
SYSTEM_PROMPTS = {
    "en": "You are a friendly personal financial assistant. Keep answers short and practical.",
    "ru": "Вы дружелюбный финансовый помощник. Коротко и практично.",
    "uz": "Siz do‘stona moliyaviy yordamchisiz. Qisqa va amaliy.",
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
            async for chunk in resp.aiter_bytes():
                yield chunk

async def stream_gemini(messages: list[dict]) -> AsyncIterator[str]:
    if not (USE_GEMINI and GEMINI_API_KEY):
        raise HTTPException(status_code=500, detail="Gemini not configured")
    if not GEMINI_AVAILABLE:
        raise HTTPException(status_code=500, detail="google-genai not installed")

    client = genai.Client(api_key=GEMINI_API_KEY)
    content = f"{messages[0]['content']}\n\n{messages[-1]['content']}".strip()

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

@app.post("/api/financial-advisor")
async def financial_advisor(req: ChatRequest):
    lang = (req.language or "en").lower()
    if lang not in ("en", "ru", "uz"):
        lang = "en"
    messages = [
        {"role": "system", "content": SYSTEM_PROMPTS[lang]},
        {"role": "user", "content": req.message},
    ]
    if USE_GEMINI and GEMINI_API_KEY:
        async def gen():
            async for sse in stream_gemini(messages):
                yield sse
        return StreamingResponse(gen(), media_type="text/event-stream")
    return StreamingResponse(stream_openai(messages), media_type="text/event-stream")

# -------------------------
# Supabase REST helper (server-side)
# -------------------------
def _sb_headers():
    return {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

async def sb_select(table: str, params: dict):
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(500, "Supabase not configured")
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.get(url, headers=_sb_headers(), params=params)
        if not r.is_success:
            raise HTTPException(r.status_code, r.text)
        return r.json()

async def sb_insert(table: str, rows: list[dict]):
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(500, "Supabase not configured")
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(url, headers=_sb_headers(), json=rows)
        if not r.is_success:
            raise HTTPException(r.status_code, r.text)
        return r.json()

async def sb_patch(table: str, match: dict, patch: dict):
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(500, "Supabase not configured")
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    params = {**{k: f"eq.{v}" for k, v in match.items()}}
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.patch(url, headers=_sb_headers(), params=params, json=patch)
        if not r.is_success:
            raise HTTPException(r.status_code, r.text)
        return r.json()

# -------------------------
# Categories + Allocations API
# NOTE: user_id is passed from frontend (Supabase auth uid)
# -------------------------
class CategoryIn(BaseModel):
    user_id: str
    name: str
    type: str  # expense/income
    icon: Optional[str] = None
    color: Optional[str] = None
    is_default: bool = False
    is_active: bool = True

class CategoryPatch(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    is_active: Optional[bool] = None

DEFAULT_EXPENSE_CATEGORIES = [
    ("Food & Groceries", "🍎"),
    ("Utilities", "💡"),
    ("Transportation", "🚌"),
    ("Housing / Rent", "🏠"),
    ("Loans & Debts", "💳"),
    ("Education", "📚"),
    ("Healthcare", "🏥"),
    ("Coffee & Snacks", "☕"),
    ("Subscriptions & Services", "📦"),
    ("Shopping", "🛍️"),
    ("Other", "🔸"),
]

@app.get("/api/categories")
async def get_categories(user_id: str, type: Optional[str] = None):
    params = {"select": "*", "user_id": f"eq.{user_id}", "order": "created_at.asc"}
    if type:
        params["type"] = f"eq.{type}"
    return await sb_select("categories", params)

@app.post("/api/categories")
async def create_category(cat: CategoryIn):
    if cat.type not in ("expense", "income"):
        raise HTTPException(400, "type must be expense or income")
    return await sb_insert("categories", [cat.model_dump()])

@app.patch("/api/categories/{category_id}")
async def patch_category(category_id: str, body: CategoryPatch, user_id: str):
    patch = {k: v for k, v in body.model_dump().items() if v is not None}
    if not patch:
        return []
    return await sb_patch("categories", {"id": category_id, "user_id": user_id}, patch)

@app.post("/api/categories/seed-defaults")
async def seed_defaults(user_id: str):
    # check if already seeded
    existing = await sb_select("categories", {"select": "id", "user_id": f"eq.{user_id}", "limit": "1"})
    if existing:
        return {"ok": True, "seeded": False, "message": "already has categories"}

    rows = []
    for name, icon in DEFAULT_EXPENSE_CATEGORIES:
        rows.append({
            "user_id": user_id,
            "name": name,
            "type": "expense",
            "icon": icon,
            "is_default": True,
            "is_active": True,
        })
    inserted = await sb_insert("categories", rows)
    return {"ok": True, "seeded": True, "count": len(inserted)}

class AllocationUpsert(BaseModel):
    user_id: str
    month: str  # YYYY-MM
    category_id: str
    percent: float

@app.get("/api/allocations")
async def get_allocations(user_id: str, month: str):
    return await sb_select(
        "budget_allocations",
        {"select": "*", "user_id": f"eq.{user_id}", "month": f"eq.{month}"}
    )

@app.post("/api/allocations")
async def upsert_allocation(body: AllocationUpsert):
    # Upsert using PostgREST header Prefer + resolution=merge-duplicates
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(500, "Supabase not configured")

    url = f"{SUPABASE_URL}/rest/v1/budget_allocations"
    headers = _sb_headers()
    headers["Prefer"] = "resolution=merge-duplicates,return=representation"

    row = body.model_dump()
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(url, headers=headers, json=[row])
        if not r.is_success:
            raise HTTPException(r.status_code, r.text)
        return r.json()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Budget Buddy API", "version": "1.2.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8080")))
