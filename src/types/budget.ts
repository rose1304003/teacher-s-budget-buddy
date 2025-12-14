export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  allocated: number;
  recommended: { min: number; max: number };
  color: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  impact: number;
  category: string;
  options: ScenarioOption[];
}

export interface ScenarioOption {
  id: string;
  label: string;
  description: string;
  impact: {
    balance: number;
    savings: number;
    debt: number;
    stability: number;
    stress: number;
  };
}

export interface MonthlyResult {
  month: string;
  remainingBalance: number;
  totalSavings: number;
  totalDebt: number;
  stabilityIndex: number;
  stressLevel: number;
}

export interface BudgetRestrictions {
  dailyLimit?: number;
  dailySpent: number;
  monthlyCap?: number;
  monthlySpent: number;
  categoryLimits?: Record<string, number>; // categoryId -> limit
  categorySpent?: Record<string, number>; // categoryId -> spent
  warnAtPercent: number; // Default 80
}

export interface FinancialProfile {
  monthlyIncome: number;
  existingSavings: number;
  totalDebt: number;
  recurringExpenses: Array<{
    id: string;
    name: string;
    amount: number;
    category: string;
  }>;
}

export interface UserState {
  virtualIncome: number;
  currentBalance: number;
  savings: number;
  debt: number;
  stabilityIndex: number;
  stressLevel: number;
  month: number;
  categories: BudgetCategory[];
  restrictions?: BudgetRestrictions;
  financialProfile?: FinancialProfile;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
