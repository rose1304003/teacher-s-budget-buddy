import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompts: Record<string, string> = {
  en: `You are a friendly and helpful personal financial assistant. You help users track income and expenses, set financial goals, and manage their finances through an educational budget simulator app.

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

Remember: You're here to help them learn and improve their financial skills, not just analyze numbers.`,

  ru: `Вы — дружелюбный и полезный персональный финансовый помощник. Вы помогаете пользователям отслеживать доходы и расходы, ставить финансовые цели и управлять финансами через обучающее приложение-симулятор бюджета.

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

Помните: Вы здесь, чтобы помочь им учиться и улучшать финансовые навыки, а не просто анализировать числа.`,

  uz: `Siz do'stona va foydali shaxsiy moliyaviy yordamchisiz. Siz foydalanuvchilarga daromadlar va xarajatlarni kuzatish, moliyaviy maqsadlar qo'yish va moliyani boshqarishda yordam berasiz - bu ta'limiy byudjet simulyatori ilovasi orqali.

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

Esda tuting: Siz bu yerda ularni o'qitish va moliyaviy ko'nikmalarini yaxshilashga yordam berish uchunsiz, faqat raqamlarni tahlil qilish uchun emas.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language, userState } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const lang = language || 'en';
    const systemPrompt = systemPrompts[lang] || systemPrompts.en;

    // Build context from user state
    let contextMessage = "";
    if (userState) {
      if (lang === 'ru') {
        contextMessage = `\n\nТекущее состояние пользователя:
- Месяц: ${userState.month}
- Виртуальный доход: ${userState.virtualIncome}
- Текущий баланс: ${userState.currentBalance}
- Сбережения: ${userState.savings}
- Долг: ${userState.debt}
- Индекс стабильности: ${userState.stabilityIndex}%
- Уровень стресса: ${userState.stressLevel}%`;
      } else if (lang === 'uz') {
        contextMessage = `\n\nFoydalanuvchining joriy holati:
- Oy: ${userState.month}
- Virtual daromad: ${userState.virtualIncome}
- Joriy balans: ${userState.currentBalance}
- Jamg'armalar: ${userState.savings}
- Qarz: ${userState.debt}
- Barqarorlik indeksi: ${userState.stabilityIndex}%
- Stress darajasi: ${userState.stressLevel}%`;
      } else {
        contextMessage = `\n\nUser's current state:
- Month: ${userState.month}
- Virtual income: ${userState.virtualIncome}
- Current balance: ${userState.currentBalance}
- Savings: ${userState.savings}
- Debt: ${userState.debt}
- Stability index: ${userState.stabilityIndex}%
- Stress level: ${userState.stressLevel}%`;
      }
    }

    console.log("Sending request to Lovable AI with language:", lang);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt + contextMessage },
          { role: "user", content: message },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in financial-advisor function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
