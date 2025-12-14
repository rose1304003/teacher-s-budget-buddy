import { useState, useCallback } from 'react';
import { BudgetCategory, UserState, Scenario, ScenarioOption, MonthlyResult, FinancialProfile, BudgetRestrictions } from '@/types/budget';

const initialCategories: BudgetCategory[] = [
  { id: 'food', name: 'Food & Groceries', icon: '🍎', allocated: 0, recommended: { min: 15, max: 25 }, color: 'hsl(142 76% 36%)' },
  { id: 'utilities', name: 'Utilities', icon: '💡', allocated: 0, recommended: { min: 5, max: 10 }, color: 'hsl(38 92% 50%)' },
  { id: 'transport', name: 'Transportation', icon: '🚌', allocated: 0, recommended: { min: 5, max: 15 }, color: 'hsl(217 91% 60%)' },
  { id: 'housing', name: 'Housing / Rent', icon: '🏠', allocated: 0, recommended: { min: 25, max: 35 }, color: 'hsl(280 67% 55%)' },
  { id: 'loans', name: 'Loans & Debts', icon: '💳', allocated: 0, recommended: { min: 0, max: 20 }, color: 'hsl(0 84% 60%)' },
  { id: 'education', name: 'Education', icon: '📚', allocated: 0, recommended: { min: 5, max: 10 }, color: 'hsl(172 66% 50%)' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', allocated: 0, recommended: { min: 3, max: 8 }, color: 'hsl(340 82% 52%)' },
  { id: 'savings', name: 'Savings', icon: '💰', allocated: 0, recommended: { min: 10, max: 20 }, color: 'hsl(158 64% 52%)' },
];

const scenarios: Scenario[] = [
  {
    id: 'medical-emergency',
    title: 'Unexpected Medical Expense',
    description: 'You need to cover an urgent dental procedure that costs 15% of your monthly income.',
    impact: -15,
    category: 'healthcare',
    options: [
      {
        id: 'use-savings',
        label: 'Use Savings',
        description: 'Dip into your emergency fund',
        impact: { balance: 0, savings: -15, debt: 0, stability: -5, stress: 5 }
      },
      {
        id: 'reduce-expenses',
        label: 'Cut Other Expenses',
        description: 'Reduce spending on non-essentials this month',
        impact: { balance: -15, savings: 0, debt: 0, stability: 0, stress: 10 }
      },
      {
        id: 'take-loan',
        label: 'Take a Small Loan',
        description: 'Borrow the amount and pay it back over time',
        impact: { balance: 0, savings: 0, debt: 15, stability: -10, stress: 15 }
      }
    ]
  },
  {
    id: 'price-increase',
    title: 'Utility Price Increase',
    description: 'Your electricity and gas bills have increased by 20% due to seasonal changes.',
    impact: -5,
    category: 'utilities',
    options: [
      {
        id: 'absorb',
        label: 'Absorb the Cost',
        description: 'Pay the higher bills from your budget',
        impact: { balance: -5, savings: 0, debt: 0, stability: -2, stress: 5 }
      },
      {
        id: 'reduce-usage',
        label: 'Reduce Usage',
        description: 'Cut down on electricity and heating',
        impact: { balance: -2, savings: 0, debt: 0, stability: 0, stress: 8 }
      },
      {
        id: 'reallocate',
        label: 'Reallocate Budget',
        description: 'Move funds from entertainment to utilities',
        impact: { balance: 0, savings: 0, debt: 0, stability: 2, stress: 3 }
      }
    ]
  },
  {
    id: 'bonus-income',
    title: 'Unexpected Bonus',
    description: 'You received a performance bonus equal to 10% of your monthly salary!',
    impact: 10,
    category: 'income',
    options: [
      {
        id: 'save-all',
        label: 'Save Everything',
        description: 'Put the entire bonus into savings',
        impact: { balance: 0, savings: 10, debt: 0, stability: 10, stress: -5 }
      },
      {
        id: 'pay-debt',
        label: 'Pay Off Debt',
        description: 'Use it to reduce your outstanding loans',
        impact: { balance: 0, savings: 0, debt: -10, stability: 8, stress: -8 }
      },
      {
        id: 'split',
        label: 'Split 50/50',
        description: 'Half to savings, half for a treat',
        impact: { balance: 5, savings: 5, debt: 0, stability: 5, stress: -10 }
      }
    ]
  }
];

export function useBudgetSimulator() {
  const [state, setState] = useState<UserState>({
    virtualIncome: 500000, // Virtual currency units
    currentBalance: 500000,
    savings: 50000,
    debt: 0,
    stabilityIndex: 75,
    stressLevel: 20,
    month: 1,
    categories: initialCategories,
  });

  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [monthlyResults, setMonthlyResults] = useState<MonthlyResult[]>([]);

  const setFinancialProfile = useCallback((profile: FinancialProfile) => {
    setState((prev) => ({
      ...prev,
      virtualIncome: profile.monthlyIncome,
      currentBalance: profile.monthlyIncome,
      savings: profile.existingSavings,
      debt: profile.totalDebt,
      financialProfile: profile,
    }));
  }, []);

  const setBudgetRestrictions = useCallback((restrictions: BudgetRestrictions) => {
    setState((prev) => ({
      ...prev,
      restrictions: {
        ...restrictions,
        dailySpent: 0,
        monthlySpent: 0,
        categorySpent: {},
      },
    }));
  }, []);

  const checkBudgetRestrictions = useCallback((amount: number, categoryId?: string): { allowed: boolean; reason?: string } => {
    const restrictions = state.restrictions;
    if (!restrictions) return { allowed: true };

    // Check monthly cap
    if (restrictions.monthlyCap && restrictions.monthlySpent + amount > restrictions.monthlyCap) {
      return { allowed: false, reason: 'monthlyCap' };
    }

    // Check daily limit
    if (restrictions.dailyLimit && restrictions.dailySpent + amount > restrictions.dailyLimit) {
      return { allowed: false, reason: 'dailyLimit' };
    }

    // Check category limit
    if (categoryId && restrictions.categoryLimits?.[categoryId]) {
      const categorySpent = restrictions.categorySpent?.[categoryId] || 0;
      if (categorySpent + amount > restrictions.categoryLimits[categoryId]) {
        return { allowed: false, reason: 'categoryLimit' };
      }
    }

    return { allowed: true };
  }, [state.restrictions]);

  const recordSpending = useCallback((amount: number, categoryId?: string) => {
    setState((prev) => {
      if (!prev.restrictions) return prev;

      const newRestrictions = { ...prev.restrictions };
      newRestrictions.monthlySpent = (newRestrictions.monthlySpent || 0) + amount;
      newRestrictions.dailySpent = (newRestrictions.dailySpent || 0) + amount;

      if (categoryId) {
        newRestrictions.categorySpent = {
          ...newRestrictions.categorySpent,
          [categoryId]: (newRestrictions.categorySpent?.[categoryId] || 0) + amount,
        };
      }

      return {
        ...prev,
        restrictions: newRestrictions,
      };
    });
  }, []);

  const resetDailySpending = useCallback(() => {
    setState((prev) => {
      if (!prev.restrictions) return prev;
      return {
        ...prev,
        restrictions: {
          ...prev.restrictions,
          dailySpent: 0,
        },
      };
    });
  }, []);

  const updateCategory = useCallback((categoryId: string, value: number) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, allocated: value } : cat
      ),
    }));
  }, []);

  const getTotalAllocated = useCallback(() => {
    return state.categories.reduce((sum, cat) => sum + cat.allocated, 0);
  }, [state.categories]);

  const getRemainingBudget = useCallback(() => {
    return 100 - getTotalAllocated();
  }, [getTotalAllocated]);

  const triggerRandomScenario = useCallback(() => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    setCurrentScenario(randomScenario);
  }, []);

  const handleScenarioChoice = useCallback((option: ScenarioOption) => {
    setState(prev => {
      const incomeMultiplier = prev.virtualIncome / 100;
      return {
        ...prev,
        currentBalance: prev.currentBalance + (option.impact.balance * incomeMultiplier),
        savings: prev.savings + (option.impact.savings * incomeMultiplier),
        debt: prev.debt + (option.impact.debt * incomeMultiplier),
        stabilityIndex: Math.max(0, Math.min(100, prev.stabilityIndex + option.impact.stability)),
        stressLevel: Math.max(0, Math.min(100, prev.stressLevel + option.impact.stress)),
      };
    });
    setCurrentScenario(null);
  }, []);

  const endMonth = useCallback(() => {
    const result: MonthlyResult = {
      month: `Month ${state.month}`,
      remainingBalance: state.currentBalance,
      totalSavings: state.savings,
      totalDebt: state.debt,
      stabilityIndex: state.stabilityIndex,
      stressLevel: state.stressLevel,
    };
    
    setMonthlyResults(prev => [...prev, result]);
    
    setState(prev => ({
      ...prev,
      month: prev.month + 1,
      currentBalance: prev.virtualIncome,
      categories: initialCategories,
    }));
  }, [state]);

  const resetSimulation = useCallback(() => {
    setState({
      virtualIncome: 500000,
      currentBalance: 500000,
      savings: 50000,
      debt: 0,
      stabilityIndex: 75,
      stressLevel: 20,
      month: 1,
      categories: initialCategories,
    });
    setMonthlyResults([]);
    setCurrentScenario(null);
  }, []);

  return {
    state,
    currentScenario,
    monthlyResults,
    updateCategory,
    getTotalAllocated,
    getRemainingBudget,
    triggerRandomScenario,
    handleScenarioChoice,
    endMonth,
    resetSimulation,
    setFinancialProfile,
    setBudgetRestrictions,
    checkBudgetRestrictions,
    recordSpending,
    resetDailySpending,
  };
}
