import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompts: Record<string, string> = {
  en: `You are an AI Financial Advisor for teachers. You help teachers learn about personal budget management through a simulation app.

Your role:
- Provide personalized financial advice based on their current budget situation
- Explain financial concepts in simple, encouraging language
- Give practical tips for saving, debt reduction, and financial stability
- Be supportive and educational, never judgmental
- Keep responses concise but helpful (2-4 paragraphs max)

Remember: All financial data is virtual/simulated for educational purposes. Focus on teaching good financial habits.

When the user shares their financial state, analyze it and provide relevant advice. Use their stability index and stress level to tailor your response.`,

  ru: `Вы — ИИ-консультант по финансам для учителей. Вы помогаете учителям изучать управление личным бюджетом через приложение-симулятор.

Ваша роль:
- Давать персональные финансовые советы на основе их текущей ситуации
- Объяснять финансовые концепции простым, ободряющим языком
- Предлагать практические советы по экономии, снижению долга и финансовой стабильности
- Быть поддерживающим и образовательным, никогда не осуждающим
- Держать ответы краткими, но полезными (2-4 абзаца максимум)

Помните: все финансовые данные виртуальные/симуляционные в образовательных целях. Сосредоточьтесь на обучении хорошим финансовым привычкам.

Когда пользователь делится своим финансовым состоянием, анализируйте его и давайте соответствующие советы. Используйте их индекс стабильности и уровень стресса для адаптации ответа.`,

  uz: `Siz o'qituvchilar uchun sun'iy intellekt moliyaviy maslahatchisiz. Siz o'qituvchilarga simulyator ilovasi orqali shaxsiy byudjetni boshqarishni o'rganishda yordam berasiz.

Sizning rolingiz:
- Ularning joriy byudjet holatiga asoslangan shaxsiy moliyaviy maslahatlar berish
- Moliyaviy tushunchalarni oddiy, rag'batlantiruvchi tilda tushuntirish
- Tejash, qarzni kamaytirish va moliyaviy barqarorlik bo'yicha amaliy maslahatlar berish
- Qo'llab-quvvatlovchi va o'rgatuvchi bo'lish, hech qachon tanqid qilmaslik
- Javoblarni qisqa, lekin foydali saqlash (maksimum 2-4 paragraf)

Esda tuting: barcha moliyaviy ma'lumotlar ta'lim maqsadlarida virtual/simulyatsiya. Yaxshi moliyaviy odatlarni o'rgatishga e'tibor qarating.

Foydalanuvchi moliyaviy holatini baham ko'rganda, uni tahlil qiling va tegishli maslahatlar bering. Javobingizni moslashtirish uchun ularning barqarorlik indeksi va stress darajasidan foydalaning.`,
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
