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
    settings: string;
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
      trackExpenses: string;
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
  // Financial Profile
  financialProfile: {
    title: string;
    subtitle: string;
    editSubtitle: string;
    monthlyIncome: string;
    incomeDesc: string;
    existingSavings: string;
    savingsDesc: string;
    totalDebt: string;
    debtDesc: string;
    recurringExpenses: string;
    recurringDesc: string;
    expenseNamePlaceholder: string;
    amountPlaceholder: string;
    saveProfile: string;
    updateProfile: string;
    editRestrictions: string;
  };
  // Budget Restrictions
  restrictions: {
    title: string;
    subtitle: string;
    dailyLimit: string;
    dailyLimitDesc: string;
    monthlyCap: string;
    monthlyCapDesc: string;
    categoryLimits: string;
    categoryLimitsDesc: string;
    warnAtPercent: string;
    warnAtPercentDesc: string;
    saveSettings: string;
    limitReached: string;
    limitWarning: string;
    spendingBlocked: string;
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
      settings: 'Settings',
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
      title: 'Financial Assistant',
      subtitle: 'Track expenses, set goals, get advice',
      greeting: "Hello! I'm your personal financial assistant. I'll help you track income and expenses, set goals, and manage your finances. How can I help you today?",
      savingTips: 'Tips for saving',
      improveStability: 'Improve stability',
      reduceStress: 'Reduce stress',
      trackExpenses: 'Track expenses',
      placeholder: 'Ask anything about your finances...',
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
    financialProfile: {
      title: 'Financial Profile',
      subtitle: 'Set up your financial information to get started',
      editSubtitle: 'Update your financial information',
      monthlyIncome: 'Monthly Income',
      incomeDesc: 'Your total monthly income',
      existingSavings: 'Existing Savings',
      savingsDesc: 'Current savings balance',
      totalDebt: 'Total Debt',
      debtDesc: 'Outstanding loans and debts',
      recurringExpenses: 'Recurring Expenses',
      recurringDesc: 'Monthly fixed expenses (rent, subscriptions, etc.)',
      expenseNamePlaceholder: 'Expense name',
      amountPlaceholder: 'Amount',
      saveProfile: 'Save Profile',
      updateProfile: 'Update Profile',
      editRestrictions: 'Edit Budget Restrictions',
    },
    restrictions: {
      title: 'Budget Restrictions',
      subtitle: 'Set spending limits and alerts',
      dailyLimit: 'Daily Spending Limit',
      dailyLimitDesc: 'Maximum amount you can spend per day',
      monthlyCap: 'Monthly Budget Cap',
      monthlyCapDesc: 'Total spending limit for the month (blocks when exceeded)',
      categoryLimits: 'Category Limits',
      categoryLimitsDesc: 'Set maximum spending per category',
      warnAtPercent: 'Warning Threshold',
      warnAtPercentDesc: 'Get notified at this percentage of your limit',
      saveSettings: 'Save Settings',
      limitReached: 'Limit Reached',
      limitWarning: 'Warning: You\'ve used {percent}% of your {type} limit',
      spendingBlocked: 'Spending blocked: {type} limit exceeded',
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
      settings: 'Настройки',
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
      title: 'Финансовый Помощник',
      subtitle: 'Отслеживайте расходы, ставьте цели, получайте советы',
      greeting: 'Здравствуйте! Я ваш персональный финансовый помощник. Я помогу вам отслеживать доходы и расходы, ставить цели и управлять финансами. Чем могу помочь?',
      savingTips: 'Советы по экономии',
      improveStability: 'Улучшить стабильность',
      reduceStress: 'Снизить стресс',
      trackExpenses: 'Отследить расходы',
      placeholder: 'Спросите о ваших финансах...',
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
    financialProfile: {
      title: 'Финансовый профиль',
      subtitle: 'Настройте финансовую информацию для начала',
      editSubtitle: 'Обновите вашу финансовую информацию',
      monthlyIncome: 'Месячный доход',
      incomeDesc: 'Ваш общий месячный доход',
      existingSavings: 'Существующие сбережения',
      savingsDesc: 'Текущий баланс сбережений',
      totalDebt: 'Общий долг',
      debtDesc: 'Непогашенные кредиты и долги',
      recurringExpenses: 'Регулярные расходы',
      recurringDesc: 'Ежемесячные фиксированные расходы (аренда, подписки и т.д.)',
      expenseNamePlaceholder: 'Название расхода',
      amountPlaceholder: 'Сумма',
      saveProfile: 'Сохранить профиль',
      updateProfile: 'Обновить профиль',
      editRestrictions: 'Редактировать ограничения бюджета',
    },
    restrictions: {
      title: 'Ограничения бюджета',
      subtitle: 'Установите лимиты расходов и уведомления',
      dailyLimit: 'Дневной лимит расходов',
      dailyLimitDesc: 'Максимальная сумма расходов в день',
      monthlyCap: 'Месячный лимит бюджета',
      monthlyCapDesc: 'Общий лимит расходов на месяц (блокирует при превышении)',
      categoryLimits: 'Лимиты по категориям',
      categoryLimitsDesc: 'Установите максимальные расходы по категориям',
      warnAtPercent: 'Порог предупреждения',
      warnAtPercentDesc: 'Получайте уведомления при достижении этого процента лимита',
      saveSettings: 'Сохранить настройки',
      limitReached: 'Лимит достигнут',
      limitWarning: 'Предупреждение: Вы использовали {percent}% вашего лимита {type}',
      spendingBlocked: 'Расходы заблокированы: превышен лимит {type}',
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
      settings: 'Sozlamalar',
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
      title: 'Moliyaviy Yordamchi',
      subtitle: 'Xarajatlarni kuzating, maqsadlar qo\'ying, maslahatlar oling',
      greeting: 'Salom! Men sizning shaxsiy moliyaviy yordamchingizman. Men sizga daromadlar va xarajatlarni kuzatish, maqsadlar qo\'yish va moliyani boshqarishda yordam beraman. Bugun sizga qanday yordam bera olaman?',
      savingTips: 'Tejash maslahatlari',
      improveStability: 'Barqarorlikni yaxshilash',
      reduceStress: 'Stressni kamaytirish',
      trackExpenses: 'Xarajatlarni kuzatish',
      placeholder: 'Moliyangiz haqida so\'rang...',
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
    financialProfile: {
      title: 'Moliyaviy profil',
      subtitle: 'Boshlash uchun moliyaviy ma\'lumotlaringizni sozlang',
      editSubtitle: 'Moliyaviy ma\'lumotlaringizni yangilang',
      monthlyIncome: 'Oylik daromad',
      incomeDesc: 'Sizning umumiy oylik daromadingiz',
      existingSavings: 'Mavjud jamg\'armalar',
      savingsDesc: 'Joriy jamg\'arma balansi',
      totalDebt: 'Jami qarz',
      debtDesc: 'To\'lanmagan kreditlar va qarzlar',
      recurringExpenses: 'Doimiy xarajatlar',
      recurringDesc: 'Oylik belgilangan xarajatlar (ijara, obunalar va boshqalar)',
      expenseNamePlaceholder: 'Xarajat nomi',
      amountPlaceholder: 'Summa',
      saveProfile: 'Profilni saqlash',
      updateProfile: 'Profilni yangilash',
      editRestrictions: 'Byudjet cheklovlarini tahrirlash',
    },
    restrictions: {
      title: 'Byudjet cheklovlari',
      subtitle: 'Xarajat limitlari va bildirishnomalarni o\'rnating',
      dailyLimit: 'Kunlik xarajat limiti',
      dailyLimitDesc: 'Kuniga maksimal xarajat miqdori',
      monthlyCap: 'Oylik byudjet limiti',
      monthlyCapDesc: 'Oy uchun umumiy xarajat limiti (ortib ketganda bloklaydi)',
      categoryLimits: 'Kategoriya bo\'yicha limitlar',
      categoryLimitsDesc: 'Kategoriyalar bo\'yicha maksimal xarajatlarni o\'rnating',
      warnAtPercent: 'Ogohlantirish chegarasi',
      warnAtPercentDesc: 'Limitning ushbu foiziga yetganda bildirishnoma oling',
      saveSettings: 'Sozlamalarni saqlash',
      limitReached: 'Limitga yetildi',
      limitWarning: 'Ogohlantirish: Siz {type} limitining {percent}% dan foydalandingiz',
      spendingBlocked: 'Xarajatlar bloklandi: {type} limiti oshib ketdi',
    },
  },
};
