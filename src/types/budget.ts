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

export interface UserState {
  virtualIncome: number;
  currentBalance: number;
  savings: number;
  debt: number;
  stabilityIndex: number;
  stressLevel: number;
  month: number;
  categories: BudgetCategory[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
