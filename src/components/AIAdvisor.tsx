import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserState, AIMessage } from '@/types/budget';
import { Bot, Send, Sparkles, Lightbulb, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface AIAdvisorProps {
  state: UserState;
}

export function AIAdvisor({ state }: AIAdvisorProps) {
  const { t, language } = useLanguage();
  
  const quickPrompts = [
    { icon: Lightbulb, label: t.ai.savingTips },
    { icon: TrendingUp, label: t.ai.improveStability },
    { icon: Shield, label: t.ai.reduceStress },
  ];

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: t.ai.greeting,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getMockResponse = (content: string): string => {
    const responses: Record<string, Record<string, string>> = {
      en: {
        saving: "Great question! Here are my top tips for building savings:\n\n1. **Pay yourself first** - Set aside savings before spending\n2. **Use the 50/30/20 rule** - 50% needs, 30% wants, 20% savings\n3. **Automate your savings** - Set up automatic transfers\n4. **Track every expense** - Awareness is the first step\n5. **Cut one unnecessary expense** - Start small and build momentum",
        stability: "Your stability score reflects your financial health. Here's how to improve it:\n\n1. **Build an emergency fund** - Aim for 3-6 months of expenses\n2. **Pay down high-interest debt** - Free up more money for savings\n3. **Diversify allocations** - Don't put all eggs in one basket\n4. **Stay within recommended ranges** - Follow budget guidelines\n5. **Plan for unexpected expenses** - Life always has surprises!",
        stress: "Financial stress is common but manageable! Try these strategies:\n\n1. **Create a realistic budget** - One you can actually stick to\n2. **Focus on what you can control** - Small steps lead to big changes\n3. **Build a safety net** - Even small savings help peace of mind\n4. **Celebrate small wins** - Every good decision counts!\n5. **Learn from mistakes** - This simulation is for practice",
      },
      ru: {
        saving: "Отличный вопрос! Вот мои главные советы по накоплению:\n\n1. **Платите сначала себе** - Откладывайте до трат\n2. **Правило 50/30/20** - 50% нужды, 30% желания, 20% сбережения\n3. **Автоматизируйте сбережения** - Настройте автоматические переводы\n4. **Отслеживайте расходы** - Осознание — первый шаг\n5. **Сократите одну лишнюю трату** - Начните с малого",
        stability: "Индекс стабильности отражает финансовое здоровье. Как его улучшить:\n\n1. **Создайте резервный фонд** - На 3-6 месяцев расходов\n2. **Погасите высокопроцентные долги** - Освободите деньги\n3. **Диверсифицируйте** - Не кладите все яйца в одну корзину\n4. **Следуйте рекомендациям** - Придерживайтесь бюджета\n5. **Планируйте непредвиденные расходы** - Жизнь полна сюрпризов!",
        stress: "Финансовый стресс распространён, но управляем! Попробуйте:\n\n1. **Создайте реалистичный бюджет** - Которого можете придерживаться\n2. **Сосредоточьтесь на контролируемом** - Маленькие шаги ведут к большим переменам\n3. **Создайте подушку безопасности** - Даже небольшие сбережения дают спокойствие\n4. **Отмечайте маленькие победы** - Каждое хорошее решение важно!\n5. **Учитесь на ошибках** - Эта симуляция для практики",
      },
      uz: {
        saving: "Ajoyib savol! Jamg'arish bo'yicha maslahatlarim:\n\n1. **Avval o'zingizga to'lang** - Xarajatlardan oldin jamg'aring\n2. **50/30/20 qoidasi** - 50% zaruriyat, 30% xohish, 20% jamg'arma\n3. **Jamg'arishni avtomatlashtiring** - Avtomatik o'tkazmalar o'rnating\n4. **Har bir xarajatni kuzating** - Xabardorlik birinchi qadam\n5. **Bir keraksiz xarajatni qisqartiring** - Kichikdan boshlang",
        stability: "Barqarorlik indeksi moliyaviy salomatligingizni aks ettiradi. Uni qanday yaxshilash:\n\n1. **Favqulodda fond yarating** - 3-6 oylik xarajatlar uchun\n2. **Yuqori foizli qarzlarni to'lang** - Ko'proq pul bo'shatadi\n3. **Diversifikatsiya qiling** - Barcha tuxumlarni bir savatga qo'ymang\n4. **Tavsiyalarga amal qiling** - Byudjet ko'rsatmalariga rioya qiling\n5. **Kutilmagan xarajatlarni rejalashtiring** - Hayot doim ajablantirar!",
        stress: "Moliyaviy stress keng tarqalgan, lekin boshqarsa bo'ladi! Quyidagilarni sinab ko'ring:\n\n1. **Haqiqiy byudjet yarating** - Amal qila olasiz\n2. **Nazorat qila oladigan narsalarga e'tibor bering** - Kichik qadamlar katta o'zgarishlarga olib keladi\n3. **Xavfsizlik tarmog'ini yarating** - Kichik jamg'armalar ham tinchlik beradi\n4. **Kichik g'alabalarni nishonlang** - Har bir yaxshi qaror muhim!\n5. **Xatolardan o'rganing** - Bu simulyatsiya mashq uchun",
      },
    };

    const langResponses = responses[language] || responses.en;
    
    if (content.toLowerCase().includes('sav') || content.toLowerCase().includes('экономи') || content.toLowerCase().includes('tejash')) {
      return langResponses.saving;
    }
    if (content.toLowerCase().includes('stabil') || content.toLowerCase().includes('стабиль') || content.toLowerCase().includes('barqaror')) {
      return langResponses.stability;
    }
    if (content.toLowerCase().includes('stress') || content.toLowerCase().includes('стресс')) {
      return langResponses.stress;
    }

    return language === 'ru' 
      ? `На основе вашей текущей ситуации (Месяц ${state.month}, ${state.stabilityIndex}% стабильности), мой совет:\n\nПродолжайте фокусироваться на сбалансированном распределении и накоплениях. Помните, это обучающая симуляция - каждое решение помогает практиковать реальные финансовые навыки!`
      : language === 'uz'
      ? `Joriy vaziyatingizga asoslanib (${state.month}-oy, ${state.stabilityIndex}% barqarorlik), mening maslahatim:\n\nMuvozanatli taqsimot va jamg'armalarga e'tibor berishda davom eting. Esda tuting, bu ta'limiy simulyatsiya - har bir qaror haqiqiy moliyaviy ko'nikmalarni mashq qilishga yordam beradi!`
      : `Based on your current situation (Month ${state.month}, ${state.stabilityIndex}% stability), here's my advice:\n\nKeep focusing on balanced allocations and building your savings. Remember, this is a learning simulation - every decision helps you practice real-world financial skills!`;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = getMockResponse(content);

    const aiMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="animate-fade-in mb-4">
        <h1 className="text-2xl font-display font-bold gradient-text">{t.ai.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.ai.subtitle}</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{t.ai.title}</span>
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-md'
                    : 'glass-card rounded-tl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-card rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-muted-foreground">{t.ai.thinking}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(prompt.label)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/30 text-sm whitespace-nowrap transition-all hover:scale-[1.02]"
          >
            <prompt.icon className="w-4 h-4 text-primary" />
            <span className="text-foreground">{prompt.label}</span>
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder={t.ai.placeholder}
          className="flex-1 bg-secondary/50 border-border/30 focus:border-primary/50"
        />
        <Button
          variant="gradient"
          size="icon"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3" />
        {t.ai.disclaimer}
      </p>
    </div>
  );
}
