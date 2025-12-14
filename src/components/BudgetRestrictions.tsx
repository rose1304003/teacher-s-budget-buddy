import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Save, DollarSign, Calendar, AlertTriangle, TrendingUp, ArrowLeft } from 'lucide-react';
import { BudgetRestrictions } from '@/types/budget';
import { useLanguage } from '@/i18n/LanguageContext';
import { BudgetCategory } from '@/types/budget';

interface BudgetRestrictionsProps {
  onComplete: (restrictions: BudgetRestrictions) => void;
  initialRestrictions?: BudgetRestrictions;
  categories: BudgetCategory[];
  monthlyIncome: number;
  onBackToProfile?: () => void;
}

export function BudgetRestrictions({
  onComplete,
  initialRestrictions,
  categories,
  monthlyIncome,
  onBackToProfile,
}: BudgetRestrictionsProps) {
  const { t } = useLanguage();

  const [dailyLimitEnabled, setDailyLimitEnabled] = useState(
    initialRestrictions?.dailyLimit !== undefined
  );
  const [dailyLimit, setDailyLimit] = useState(
    initialRestrictions?.dailyLimit?.toString() || ''
  );

  const [monthlyCapEnabled, setMonthlyCapEnabled] = useState(
    initialRestrictions?.monthlyCap !== undefined
  );
  const [monthlyCap, setMonthlyCap] = useState(
    initialRestrictions?.monthlyCap?.toString() || monthlyIncome.toString()
  );

  const [categoryLimitsEnabled, setCategoryLimitsEnabled] = useState(
    !!initialRestrictions?.categoryLimits
  );
  const [categoryLimits, setCategoryLimits] = useState<Record<string, string>>(
    initialRestrictions?.categoryLimits
      ? Object.fromEntries(
          Object.entries(initialRestrictions.categoryLimits).map(([k, v]) => [k, v.toString()])
        )
      : {}
  );

  const [warnAtPercent, setWarnAtPercent] = useState(
    initialRestrictions?.warnAtPercent?.toString() || '80'
  );

  const handleSubmit = () => {
    const restrictions: BudgetRestrictions = {
      dailySpent: 0,
      monthlySpent: 0,
      categorySpent: {},
      warnAtPercent: parseFloat(warnAtPercent) || 80,
    };

    if (dailyLimitEnabled && dailyLimit) {
      restrictions.dailyLimit = parseFloat(dailyLimit);
    }

    if (monthlyCapEnabled && monthlyCap) {
      restrictions.monthlyCap = parseFloat(monthlyCap);
    }

    if (categoryLimitsEnabled) {
      restrictions.categoryLimits = {};
      Object.entries(categoryLimits).forEach(([categoryId, limit]) => {
        if (limit) {
          restrictions.categoryLimits![categoryId] = parseFloat(limit);
        }
      });
    }

    onComplete(restrictions);
  };

  const categoryNames: Record<string, string> = {
    food: t.categories.food,
    utilities: t.categories.utilities,
    transport: t.categories.transport,
    housing: t.categories.housing,
    loans: t.categories.loans,
    education: t.categories.education,
    healthcare: t.categories.healthcare,
    savings: t.categories.savings,
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          {onBackToProfile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackToProfile}
              className="w-10 h-10 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold gradient-text">{t.restrictions.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t.restrictions.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Daily Limit */}
      <Card className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-sm font-medium">{t.restrictions.dailyLimit}</Label>
              <p className="text-xs text-muted-foreground">{t.restrictions.dailyLimitDesc}</p>
            </div>
          </div>
          <Switch checked={dailyLimitEnabled} onCheckedChange={setDailyLimitEnabled} />
        </div>
        {dailyLimitEnabled && (
          <Input
            type="number"
            placeholder="0"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            className="text-lg font-display"
          />
        )}
      </Card>

      {/* Monthly Cap */}
      <Card className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <Label className="text-sm font-medium">{t.restrictions.monthlyCap}</Label>
              <p className="text-xs text-muted-foreground">{t.restrictions.monthlyCapDesc}</p>
            </div>
          </div>
          <Switch checked={monthlyCapEnabled} onCheckedChange={setMonthlyCapEnabled} />
        </div>
        {monthlyCapEnabled && (
          <Input
            type="number"
            placeholder={monthlyIncome.toString()}
            value={monthlyCap}
            onChange={(e) => setMonthlyCap(e.target.value)}
            className="text-lg font-display"
          />
        )}
      </Card>

      {/* Category Limits */}
      <Card className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <Label className="text-sm font-medium">{t.restrictions.categoryLimits}</Label>
              <p className="text-xs text-muted-foreground">{t.restrictions.categoryLimitsDesc}</p>
            </div>
          </div>
          <Switch checked={categoryLimitsEnabled} onCheckedChange={setCategoryLimitsEnabled} />
        </div>
        {categoryLimitsEnabled && (
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{
                    backgroundColor: `${category.color}15`,
                    border: `1px solid ${category.color}30`,
                  }}
                >
                  {category.icon}
                </div>
                <Label className="flex-1 text-sm">{categoryNames[category.id] || category.name}</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={categoryLimits[category.id] || ''}
                  onChange={(e) =>
                    setCategoryLimits({ ...categoryLimits, [category.id]: e.target.value })
                  }
                  className="w-32 text-sm"
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Warning Threshold */}
      <Card className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-accent" />
          </div>
          <div>
            <Label htmlFor="warnPercent" className="text-sm font-medium">
              {t.restrictions.warnAtPercent}
            </Label>
            <p className="text-xs text-muted-foreground">{t.restrictions.warnAtPercentDesc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            id="warnPercent"
            type="number"
            min="0"
            max="100"
            value={warnAtPercent}
            onChange={(e) => setWarnAtPercent(e.target.value)}
            className="text-lg font-display w-24"
          />
          <span className="text-muted-foreground">%</span>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 z-40">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent" />
        <div className="relative max-w-lg mx-auto">
          <Button variant="gradient" size="xl" className="w-full" onClick={handleSubmit}>
            <Save className="w-5 h-5 mr-2" />
            {t.restrictions.saveSettings}
          </Button>
        </div>
      </div>
    </div>
  );
}
