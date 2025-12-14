import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Save, Wallet, PiggyBank, CreditCard, Calendar, Settings } from 'lucide-react';
import { FinancialProfile as FinancialProfileType } from '@/types/budget';
import { useLanguage } from '@/i18n/LanguageContext';

interface FinancialProfileProps {
  onComplete: (profile: FinancialProfileType) => void;
  initialProfile?: FinancialProfileType;
  onEditRestrictions?: () => void;
}

export function FinancialProfile({ onComplete, initialProfile, onEditRestrictions }: FinancialProfileProps) {
  const { t } = useLanguage();
  const [income, setIncome] = useState(initialProfile?.monthlyIncome || '');
  const [savings, setSavings] = useState(initialProfile?.existingSavings || '');
  const [debt, setDebt] = useState(initialProfile?.totalDebt || '');
  const [recurringExpenses, setRecurringExpenses] = useState(
    initialProfile?.recurringExpenses || []
  );

  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: 'utilities' });

  const categories = [
    { id: 'utilities', name: t.categories.utilities },
    { id: 'housing', name: t.categories.housing },
    { id: 'transport', name: t.categories.transport },
    { id: 'food', name: t.categories.food },
    { id: 'education', name: t.categories.education },
    { id: 'healthcare', name: t.categories.healthcare },
    { id: 'loans', name: t.categories.loans },
  ];

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount && parseFloat(newExpense.amount) > 0) {
      setRecurringExpenses([
        ...recurringExpenses,
        {
          id: Date.now().toString(),
          name: newExpense.name,
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
        },
      ]);
      setNewExpense({ name: '', amount: '', category: 'utilities' });
    }
  };

  const handleRemoveExpense = (id: string) => {
    setRecurringExpenses(recurringExpenses.filter((exp) => exp.id !== id));
  };

  const handleSubmit = () => {
    const profile: FinancialProfileType = {
      monthlyIncome: parseFloat(income) || 0,
      existingSavings: parseFloat(savings) || 0,
      totalDebt: parseFloat(debt) || 0,
      recurringExpenses,
    };
    onComplete(profile);
  };

  const isValid = income && parseFloat(income) > 0;

  return (
    <div className="space-y-6 pb-28">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-display font-bold gradient-text">
          {t.financialProfile?.title || 'Financial Profile'}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {initialProfile 
            ? (t.financialProfile?.editSubtitle || 'Update your financial information')
            : (t.financialProfile?.subtitle || 'Set up your financial information to get started')
          }
        </p>
      </div>

      {/* Income */}
      <Card className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <Label htmlFor="income" className="text-sm font-medium">
              {t.financialProfile?.monthlyIncome || 'Monthly Income'}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t.financialProfile?.incomeDesc || 'Your total monthly income'}
            </p>
          </div>
        </div>
        <Input
          id="income"
          type="number"
          placeholder="0"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="text-lg font-display"
        />
      </Card>

      {/* Savings */}
      <Card className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-success" />
          </div>
          <div>
            <Label htmlFor="savings" className="text-sm font-medium">
              {t.financialProfile?.existingSavings || 'Existing Savings'}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t.financialProfile?.savingsDesc || 'Current savings balance'}
            </p>
          </div>
        </div>
        <Input
          id="savings"
          type="number"
          placeholder="0"
          value={savings}
          onChange={(e) => setSavings(e.target.value)}
          className="text-lg font-display"
        />
      </Card>

      {/* Debt */}
      <Card className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <Label htmlFor="debt" className="text-sm font-medium">
              {t.financialProfile?.totalDebt || 'Total Debt'}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t.financialProfile?.debtDesc || 'Outstanding loans and debts'}
            </p>
          </div>
        </div>
        <Input
          id="debt"
          type="number"
          placeholder="0"
          value={debt}
          onChange={(e) => setDebt(e.target.value)}
          className="text-lg font-display"
        />
      </Card>

      {/* Recurring Expenses */}
      <Card className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div>
            <Label className="text-sm font-medium">
              {t.financialProfile?.recurringExpenses || 'Recurring Expenses'}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t.financialProfile?.recurringDesc || 'Monthly fixed expenses (rent, subscriptions, etc.)'}
            </p>
          </div>
        </div>

        {/* Existing Expenses */}
        {recurringExpenses.length > 0 && (
          <div className="space-y-2 mb-4">
            {recurringExpenses.map((expense) => {
              const categoryName = categories.find((c) => c.id === expense.category)?.name || expense.category;
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{expense.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {categoryName} • {t.common.currency} {expense.amount.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExpense(expense.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add New Expense */}
        <div className="space-y-3">
          <Input
            placeholder={t.financialProfile?.expenseNamePlaceholder || 'Expense name'}
            value={newExpense.name}
            onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="flex-1 h-10 px-3 rounded-md bg-input border border-border text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder={t.financialProfile?.amountPlaceholder || 'Amount'}
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-32"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddExpense}
              disabled={!newExpense.name || !newExpense.amount}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 p-4 z-40">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent" />
        <div className="relative max-w-lg mx-auto space-y-3">
          <Button
            variant={isValid ? 'gradient' : 'secondary'}
            size="xl"
            className="w-full"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            <Save className="w-5 h-5 mr-2" />
            {initialProfile 
              ? (t.financialProfile?.updateProfile || 'Update Profile')
              : (t.financialProfile?.saveProfile || 'Save Profile')
            }
          </Button>
          {initialProfile && onEditRestrictions && (
            <Button
              variant="outline"
              size="xl"
              className="w-full"
              onClick={onEditRestrictions}
            >
              <Settings className="w-5 h-5 mr-2" />
              {t.financialProfile?.editRestrictions || 'Edit Budget Restrictions'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
