"""
FastAPI Backend for Budget Simulator
Provides AI Financial Advisor API endpoint
"""
import os
import logging
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
# Optional: Use Google Gemini instead of OpenAI
USE_GEMINI = os.getenv('USE_GEMINI', 'false').lower() == 'true'
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

if not OPENAI_API_KEY and not (USE_GEMINI and GEMINI_API_KEY):
    logger.warning("No AI API key set - AI features will not work. Set OPENAI_API_KEY or (USE_GEMINI=true and GEMINI_API_KEY)")

# Initialize FastAPI app
app = FastAPI(title="Budget Simulator API", version="1.0.0")

# CORS configuration
FRONTEND_URL = os.getenv('FRONTEND_URL', '*')
ALLOWED_ORIGINS = [FRONTEND_URL] if FRONTEND_URL != '*' else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# System prompts for Financial AI Assistant
SYSTEM_PROMPTS = {
    'en': """You are a friendly and helpful personal financial assistant. You help users track income and expenses, set financial goals, and manage their finances through an educational budget simulator app.

Your personality:
- Friendly, warm, and approachable - like a trusted friend
- Patient and encouraging, never judgmental
- Clear and simple in your explanations
- Proactive in offering helpful suggestions

Your capabilities:
- Help users understand where their money goes
- Track and analyze income and expenses
- Set and work towards financial goals
- Provide budgeting tips and strategies
- Explain financial concepts in simple terms
- Offer personalized advice based on their situation

Important context:
- This is an educational simulator - all amounts are virtual
- The user is practicing financial management skills
- Focus on teaching good financial habits
- Be supportive and educational

When users ask questions or need help:
- Give clear, actionable advice
- Use their current financial data to personalize responses
- Suggest practical steps they can take
- Keep responses conversational and friendly (2-4 paragraphs)
- Ask follow-up questions to better understand their needs

Remember: You're here to help them learn and improve their financial skills, not just analyze numbers.""",

    'ru': """Вы — дружелюбный и полезный персональный финансовый помощник. Вы помогаете пользователям отслеживать доходы и расходы, ставить финансовые цели и управлять финансами через обучающее приложение-симулятор бюджета.

Ваша личность:
- Дружелюбный, тёплый и доступный — как надёжный друг
- Терпеливый и ободряющий, никогда не осуждающий
- Ясный и простой в объяснениях
- Проактивный в предложении полезных советов

Ваши возможности:
- Помогать пользователям понимать, куда уходят их деньги
- Отслеживать и анализировать доходы и расходы
- Ставить и работать над финансовыми целями
- Предоставлять советы по бюджетированию
- Объяснять финансовые концепции простым языком
- Давать персональные советы на основе их ситуации

Важно:
- Это образовательный симулятор — все суммы виртуальные
- Пользователь практикует навыки управления финансами
- Сосредоточьтесь на обучении хорошим финансовым привычкам
- Будьте поддерживающим и образовательным

Когда пользователи задают вопросы или нуждаются в помощи:
- Давайте чёткие, практичные советы
- Используйте их текущие финансовые данные для персонализации
- Предлагайте конкретные шаги
- Держите ответы разговорными и дружелюбными (2-4 абзаца)
- Задавайте уточняющие вопросы для лучшего понимания

Помните: Вы здесь, чтобы помочь им учиться и улучшать финансовые навыки, а не просто анализировать числа.""",

    'uz': """Siz do'stona va foydali shaxsiy moliyaviy yordamchisiz. Siz foydalanuvchilarga daromadlar va xarajatlarni kuzatish, moliyaviy maqsadlar qo'yish va moliyani boshqarishda yordam berasiz - bu ta'limiy byudjet simulyatori ilovasi orqali.

Sizning shaxsingiz:
- Do'stona, iliq va qulay - ishonchli do'st kabi
- Sabrli va rag'batlantiruvchi, hech qachon tanqid qilmaydigan
- Tushuntirishlarda aniq va oddiy
- Foydali takliflarni taklif qilishda faol

Sizning qobiliyatlaringiz:
- Foydalanuvchilarga pulingiz qayerga ketayotganini tushunishda yordam berish
- Daromadlar va xarajatlarni kuzatish va tahlil qilish
- Moliyaviy maqsadlar qo'yish va ularga erishish
- Byudjetlash bo'yicha maslahatlar va strategiyalar berish
- Moliyaviy tushunchalarni oddiy tilda tushuntirish
- Ularning vaziyatiga asoslangan shaxsiy maslahatlar taklif qilish

Muhim kontekst:
- Bu ta'limiy simulyator - barcha summalar virtual
- Foydalanuvchi moliyaviy boshqaruv ko'nikmalarini mashq qilmoqda
- Yaxshi moliyaviy odatlarni o'rgatishga e'tibor qarating
- Qo'llab-quvvatlovchi va o'rgatuvchi bo'ling

Foydalanuvchilar savol berganida yoki yordamga muhtoj bo'lganda:
- Aniq, amaliy maslahatlar bering
- Javoblarni shaxsiylashtirish uchun ularning joriy moliyaviy ma'lumotlaridan foydalaning
- Ular amalga oshirishi mumkin bo'lgan amaliy qadamlar taklif qiling
- Javoblarni suhbatdosh va do'stona saqlang (2-4 paragraf)
- Ehtiyojlarini yaxshiroq tushunish uchun kuzatuvchi savollar bering

Esda tuting: Siz bu yerda ularni o'qitish va moliyaviy ko'nikmalarini yaxshilashga yordam berish uchunsiz, faqat raqamlarni tahlil qilish uchun emas."""
}


# Pydantic models
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
    language: str = 'en'
    userState: Optional[UserState] = None


def build_context_message(user_state: Optional[UserState], language: str) -> str:
    """Build context message from user state"""
    if not user_state:
        return ""
    
    if language == 'ru':
        return f"""

Текущее состояние пользователя:
- Месяц: {user_state.month}
- Виртуальный доход: {user_state.virtualIncome}
- Текущий баланс: {user_state.currentBalance}
- Сбережения: {user_state.savings}
- Долг: {user_state.debt}
- Индекс стабильности: {user_state.stabilityIndex}%
- Уровень стресса: {user_state.stressLevel}%"""
    elif language == 'uz':
        return f"""

Foydalanuvchining joriy holati:
- Oy: {user_state.month}
- Virtual daromad: {user_state.virtualIncome}
- Joriy balans: {user_state.currentBalance}
- Jamg'armalar: {user_state.savings}
- Qarz: {user_state.debt}
- Barqarorlik indeksi: {user_state.stabilityIndex}%
- Stress darajasi: {user_state.stressLevel}%"""
    else:
        return f"""

User's current state:
- Month: {user_state.month}
- Virtual income: {user_state.virtualIncome}
- Current balance: {user_state.currentBalance}
- Savings: {user_state.savings}
- Debt: {user_state.debt}
- Stability index: {user_state.stabilityIndex}%
- Stress level: {user_state.stressLevel}%"""


async def stream_ai_response(request: ChatRequest):
    """Stream AI response from OpenAI or Google Gemini"""
    if not OPENAI_API_KEY and not (USE_GEMINI and GEMINI_API_KEY):
        raise HTTPException(status_code=500, detail="AI service not configured. Set OPENAI_API_KEY or GEMINI_API_KEY")
    
    lang = request.language or 'en'
    system_prompt = SYSTEM_PROMPTS.get(lang, SYSTEM_PROMPTS['en'])
    context_message = build_context_message(request.userState, lang)
    
    # Prepare messages for AI
    messages = [
        {"role": "system", "content": system_prompt + context_message},
        {"role": "user", "content": request.message}
    ]
    
    # Choose AI service
    if USE_GEMINI and GEMINI_API_KEY:
        # Use Google Gemini
        api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent"
        api_key = GEMINI_API_KEY
        # Transform messages to Gemini format
        gemini_messages = []
        for msg in messages:
            if msg["role"] == "system":
                # Gemini doesn't have system role, prepend to first user message
                continue
            gemini_messages.append({"role": msg["role"], "parts": [{"text": msg["content"]}]})
        
        # Add system prompt to first message
        if messages[0]["role"] == "system":
            gemini_messages[0]["parts"][0]["text"] = messages[0]["content"] + "\n\n" + gemini_messages[0]["parts"][0]["text"]
        
        payload = {
            "contents": gemini_messages,
            "generationConfig": {
                "temperature": 0.7,
            }
        }
        headers = {
            "Content-Type": "application/json",
        }
        request_url = f"{api_url}?key={api_key}"
        
        # Gemini streaming is different, need to handle SSE conversion
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(request_url, headers=headers, json=payload)
                if not response.is_success:
                    error_text = await response.aread()
                    logger.error(f"Gemini API error: {response.status_code} - {error_text}")
                    raise HTTPException(status_code=response.status_code, detail=f"Gemini API error: {response.status_code}")
                
                # Convert Gemini response to OpenAI SSE format
                data = response.json()
                async def generate():
                    for candidate in data.get("candidates", []):
                        for part in candidate.get("content", {}).get("parts", []):
                            text = part.get("text", "")
                            if text:
                                # Stream character by character for smooth effect
                                for char in text:
                                    chunk = {
                                        "choices": [{
                                            "delta": {"content": char}
                                        }]
                                    }
                                    yield f"data: {json.dumps(chunk)}\n\n"
                    yield "data: [DONE]\n\n"
                
                return StreamingResponse(
                    generate(),
                    media_type="text/event-stream",
                    headers={
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                    }
                )
            except Exception as e:
                logger.error(f"Error calling Gemini API: {e}")
                raise HTTPException(status_code=500, detail=str(e))
    else:
        # Use OpenAI
        if not OPENAI_API_KEY:
            raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
        
        api_url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "gpt-4o-mini",  # Cost-effective model, can change to gpt-4, gpt-3.5-turbo, etc.
            "messages": messages,
            "stream": True,
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                async with client.stream(
                    "POST",
                    api_url,
                    headers=headers,
                    json=payload,
                ) as response:
                    if response.status_code == 429:
                        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")
                    if response.status_code == 401:
                        raise HTTPException(status_code=401, detail="Invalid API key. Please check your OPENAI_API_KEY.")
                    if not response.is_success:
                        error_text = await response.aread()
                        logger.error(f"OpenAI API error: {response.status_code} - {error_text}")
                        raise HTTPException(status_code=response.status_code, detail=f"OpenAI API error: {response.status_code}")
                
                async def generate():
                    async for chunk in response.aiter_bytes():
                        yield chunk
                
                return StreamingResponse(
                    generate(),
                    media_type="text/event-stream",
                    headers={
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                    }
                )
                except httpx.TimeoutException:
                    raise HTTPException(status_code=504, detail="AI service timeout")
                except Exception as e:
                    logger.error(f"Error streaming AI response: {e}")
                    raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/financial-advisor")
async def financial_advisor(request: ChatRequest):
    """
    Financial Advisor AI endpoint
    Returns streaming response from Financial AI Assistant
    """
    logger.info(f"Received chat request in language: {request.language}")
    return await stream_ai_response(request)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "ai_configured": bool(OPENAI_API_KEY or (USE_GEMINI and GEMINI_API_KEY))}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Budget Simulator API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "financial_advisor": "/api/financial-advisor"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
