export type Language = 'en' | 'ru' | 'uz';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    budget: string;
    scenarios: string;
    results: string;
    ai: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    monthlyIncome: string;
    availableBalance: string;
    totalSavings: string;
    totalDebt: string;
    financialHealth: string;
    stabilityIndex: string;
    stressResistance: string;
    educationalNote: string;
    educationalDesc: string;
  };
  // Budget
  budget: {
    title: string;
    subtitle: string;
    allocation: string;
    recommended: string;
    remaining: string;
    overBudget: string;
    perfect: string;
    continue: string;
    allocateMore: string;
  };
  // Scenarios
  scenarios: {
    title: string;
    subtitle: string;
    readyTitle: string;
    readyDesc: string;
    startScenario: string;
    whatToExpect: string;
    medicalEmergency: string;
    utilityChanges: string;
    unexpectedIncome: string;
    familyExpenses: string;
    chooseResponse: string;
    confirmDecision: string;
    selectOption: string;
    impact: string;
  };
  // Results
  results: {
    title: string;
    subtitle: string;
    monthActive: string;
    completeMonth: string;
    monthComplete: string;
    greatJob: string;
    finalScores: string;
    stability: string;
    wellness: string;
    remainingBalance: string;
    previousMonths: string;
    startMonth: string;
    resetSimulation: string;
  };
  // AI Advisor
  ai: {
    title: string;
    subtitle: string;
    greeting: string;
    savingTips: string;
    improveStability: string;
    reduceStress: string;
    placeholder: string;
    disclaimer: string;
    thinking: string;
  };
  // Categories
  categories: {
    food: string;
    utilities: string;
    transport: string;
    housing: string;
    loans: string;
    education: string;
    healthcare: string;
    savings: string;
  };
  // Common
  common: {
    month: string;
    virtualSimulation: string;
    balance: string;
    savings: string;
    debt: string;
    currency: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      budget: 'Budget',
      scenarios: 'Scenarios',
      results: 'Results',
      ai: 'AI',
    },
    dashboard: {
      title: 'Budget Dashboard',
      subtitle: 'Virtual Simulation',
      monthlyIncome: 'Monthly Virtual Income',
      availableBalance: 'Available Balance',
      totalSavings: 'Total Savings',
      totalDebt: 'Total Debt',
      financialHealth: 'Financial Health',
      stabilityIndex: 'Stability Index',
      stressResistance: 'Stress Resistance',
      educationalNote: 'Educational Simulation',
      educationalDesc: 'All amounts shown are virtual. This simulator helps you practice financial decision-making without real money.',
    },
    budget: {
      title: 'Allocate Budget',
      subtitle: 'Distribute your income across categories',
      allocation: 'Budget Allocation',
      recommended: 'Recommended',
      remaining: 'remaining to allocate',
      overBudget: "You've allocated more than your income!",
      perfect: 'Perfect! Your budget is fully allocated.',
      continue: 'Continue to Simulation',
      allocateMore: 'Allocate More',
    },
    scenarios: {
      title: 'Life Scenarios',
      subtitle: 'Practice handling real-life financial situations',
      readyTitle: 'Ready for a Challenge?',
      readyDesc: 'Life is unpredictable. Practice making smart financial decisions when unexpected events happen.',
      startScenario: 'Start Scenario',
      whatToExpect: 'What to Expect',
      medicalEmergency: 'Medical emergencies',
      utilityChanges: 'Utility price changes',
      unexpectedIncome: 'Unexpected income',
      familyExpenses: 'Family expenses',
      chooseResponse: 'Choose Your Response',
      confirmDecision: 'Confirm Decision',
      selectOption: 'Select an Option',
      impact: 'Impact',
    },
    results: {
      title: 'Monthly Summary',
      subtitle: 'Review your financial progress',
      monthActive: 'Month Active',
      completeMonth: 'Complete Month',
      monthComplete: 'Month Complete!',
      greatJob: 'Great job practicing financial decisions',
      finalScores: 'Final Scores',
      stability: 'Stability',
      wellness: 'Wellness',
      remainingBalance: 'Remaining Balance',
      previousMonths: 'Previous Months',
      startMonth: 'Start Month',
      resetSimulation: 'Reset Simulation',
    },
    ai: {
      title: 'AI Advisor',
      subtitle: 'Your personal financial coach',
      greeting: "Hello! I'm your AI Financial Advisor. I'm here to help you make smart financial decisions and learn good money habits. How can I help you today?",
      savingTips: 'Tips for saving',
      improveStability: 'Improve stability',
      reduceStress: 'Reduce stress',
      placeholder: 'Ask me anything about budgeting...',
      disclaimer: 'AI advice is for educational purposes only',
      thinking: 'Thinking...',
    },
    categories: {
      food: 'Food & Groceries',
      utilities: 'Utilities',
      transport: 'Transportation',
      housing: 'Housing / Rent',
      loans: 'Loans & Debts',
      education: 'Education',
      healthcare: 'Healthcare',
      savings: 'Savings',
    },
    common: {
      month: 'Month',
      virtualSimulation: 'Virtual Simulation',
      balance: 'Balance',
      savings: 'Savings',
      debt: 'Debt',
      currency: '₸',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      budget: 'Бюджет',
      scenarios: 'Сценарии',
      results: 'Итоги',
      ai: 'ИИ',
    },
    dashboard: {
      title: 'Панель бюджета',
      subtitle: 'Виртуальная симуляция',
      monthlyIncome: 'Ежемесячный виртуальный доход',
      availableBalance: 'Доступный баланс',
      totalSavings: 'Общие сбережения',
      totalDebt: 'Общий долг',
      financialHealth: 'Финансовое здоровье',
      stabilityIndex: 'Индекс стабильности',
      stressResistance: 'Устойчивость к стрессу',
      educationalNote: 'Образовательная симуляция',
      educationalDesc: 'Все суммы виртуальные. Этот симулятор помогает практиковать принятие финансовых решений без реальных денег.',
    },
    budget: {
      title: 'Распределение бюджета',
      subtitle: 'Распределите доход по категориям',
      allocation: 'Распределение бюджета',
      recommended: 'Рекомендуемо',
      remaining: 'осталось распределить',
      overBudget: 'Вы распределили больше своего дохода!',
      perfect: 'Отлично! Бюджет полностью распределён.',
      continue: 'Продолжить симуляцию',
      allocateMore: 'Распределить ещё',
    },
    scenarios: {
      title: 'Жизненные сценарии',
      subtitle: 'Практикуйте решение реальных финансовых ситуаций',
      readyTitle: 'Готовы к испытанию?',
      readyDesc: 'Жизнь непредсказуема. Практикуйте принятие умных финансовых решений при неожиданных событиях.',
      startScenario: 'Начать сценарий',
      whatToExpect: 'Чего ожидать',
      medicalEmergency: 'Медицинские расходы',
      utilityChanges: 'Изменение тарифов',
      unexpectedIncome: 'Неожиданный доход',
      familyExpenses: 'Семейные расходы',
      chooseResponse: 'Выберите решение',
      confirmDecision: 'Подтвердить решение',
      selectOption: 'Выберите вариант',
      impact: 'Влияние',
    },
    results: {
      title: 'Месячный итог',
      subtitle: 'Обзор финансового прогресса',
      monthActive: 'Месяц активен',
      completeMonth: 'Завершить месяц',
      monthComplete: 'Месяц завершён!',
      greatJob: 'Отличная практика финансовых решений',
      finalScores: 'Финальные оценки',
      stability: 'Стабильность',
      wellness: 'Благополучие',
      remainingBalance: 'Остаток баланса',
      previousMonths: 'Предыдущие месяцы',
      startMonth: 'Начать месяц',
      resetSimulation: 'Сбросить симуляцию',
    },
    ai: {
      title: 'ИИ Консультант',
      subtitle: 'Ваш персональный финансовый коуч',
      greeting: 'Здравствуйте! Я ваш ИИ-консультант по финансам. Я помогу вам принимать умные финансовые решения и формировать хорошие денежные привычки. Чем могу помочь?',
      savingTips: 'Советы по экономии',
      improveStability: 'Улучшить стабильность',
      reduceStress: 'Снизить стресс',
      placeholder: 'Спросите меня о бюджете...',
      disclaimer: 'Советы ИИ носят образовательный характер',
      thinking: 'Думаю...',
    },
    categories: {
      food: 'Продукты питания',
      utilities: 'Коммунальные услуги',
      transport: 'Транспорт',
      housing: 'Жильё / Аренда',
      loans: 'Кредиты и долги',
      education: 'Образование',
      healthcare: 'Здоровье',
      savings: 'Сбережения',
    },
    common: {
      month: 'Месяц',
      virtualSimulation: 'Виртуальная симуляция',
      balance: 'Баланс',
      savings: 'Сбережения',
      debt: 'Долг',
      currency: '₸',
    },
  },
  uz: {
    nav: {
      home: 'Bosh sahifa',
      budget: 'Byudjet',
      scenarios: 'Stsenariylar',
      results: 'Natijalar',
      ai: 'SI',
    },
    dashboard: {
      title: 'Byudjet paneli',
      subtitle: 'Virtual simulyatsiya',
      monthlyIncome: 'Oylik virtual daromad',
      availableBalance: 'Mavjud balans',
      totalSavings: 'Jami jamg\'armalar',
      totalDebt: 'Jami qarz',
      financialHealth: 'Moliyaviy salomatlik',
      stabilityIndex: 'Barqarorlik indeksi',
      stressResistance: 'Stressga chidamlilik',
      educationalNote: 'Ta\'limiy simulyatsiya',
      educationalDesc: 'Barcha summalar virtual. Bu simulyator haqiqiy pullarisiz moliyaviy qaror qabul qilishni mashq qilishga yordam beradi.',
    },
    budget: {
      title: 'Byudjetni taqsimlash',
      subtitle: 'Daromadingizni kategoriyalarga taqsimlang',
      allocation: 'Byudjet taqsimoti',
      recommended: 'Tavsiya etilgan',
      remaining: 'taqsimlash uchun qoldi',
      overBudget: 'Siz daromadingizdan ko\'proq taqsimladingiz!',
      perfect: 'Ajoyib! Byudjet to\'liq taqsimlandi.',
      continue: 'Simulyatsiyaga davom etish',
      allocateMore: 'Ko\'proq taqsimlash',
    },
    scenarios: {
      title: 'Hayotiy stsenariylar',
      subtitle: 'Haqiqiy moliyaviy vaziyatlarni hal qilishni mashq qiling',
      readyTitle: 'Sinovga tayyormisiz?',
      readyDesc: 'Hayot oldindan aytib bo\'lmaydi. Kutilmagan hodisalar sodir bo\'lganda aqlli moliyaviy qarorlar qabul qilishni mashq qiling.',
      startScenario: 'Stsenariyni boshlash',
      whatToExpect: 'Nimani kutish kerak',
      medicalEmergency: 'Tibbiy favqulodda holatlar',
      utilityChanges: 'Kommunal narxlarning o\'zgarishi',
      unexpectedIncome: 'Kutilmagan daromad',
      familyExpenses: 'Oilaviy xarajatlar',
      chooseResponse: 'Javobingizni tanlang',
      confirmDecision: 'Qarorni tasdiqlash',
      selectOption: 'Variantni tanlang',
      impact: 'Ta\'sir',
    },
    results: {
      title: 'Oylik xulosa',
      subtitle: 'Moliyaviy taraqqiyotingizni ko\'rib chiqing',
      monthActive: 'Oy faol',
      completeMonth: 'Oyni yakunlash',
      monthComplete: 'Oy yakunlandi!',
      greatJob: 'Moliyaviy qarorlarni mashq qilishda ajoyib ish',
      finalScores: 'Yakuniy ballar',
      stability: 'Barqarorlik',
      wellness: 'Farovonlik',
      remainingBalance: 'Qolgan balans',
      previousMonths: 'Oldingi oylar',
      startMonth: 'Oyni boshlash',
      resetSimulation: 'Simulyatsiyani qayta boshlash',
    },
    ai: {
      title: 'SI Maslahatchi',
      subtitle: 'Shaxsiy moliyaviy murabbiyingiz',
      greeting: 'Salom! Men sizning SI moliyaviy maslahatchimanman. Sizga aqlli moliyaviy qarorlar qabul qilishda va yaxshi pul odatlarini shakllantirishda yordam beraman. Bugun sizga qanday yordam bera olaman?',
      savingTips: 'Tejash maslahatlari',
      improveStability: 'Barqarorlikni yaxshilash',
      reduceStress: 'Stressni kamaytirish',
      placeholder: 'Byudjet haqida so\'rang...',
      disclaimer: 'SI maslahatlari faqat ta\'lim maqsadida',
      thinking: 'O\'ylayapman...',
    },
    categories: {
      food: 'Oziq-ovqat',
      utilities: 'Kommunal xizmatlar',
      transport: 'Transport',
      housing: 'Uy-joy / Ijara',
      loans: 'Kreditlar va qarzlar',
      education: 'Ta\'lim',
      healthcare: 'Sog\'liqni saqlash',
      savings: 'Jamg\'armalar',
    },
    common: {
      month: 'Oy',
      virtualSimulation: 'Virtual simulyatsiya',
      balance: 'Balans',
      savings: 'Jamg\'armalar',
      debt: 'Qarz',
      currency: 'so\'m',
    },
  },
};
