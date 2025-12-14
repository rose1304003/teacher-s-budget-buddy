import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, XCircle, Info } from 'lucide-react';
import { BudgetRestrictions } from '@/types/budget';
import { useLanguage } from '@/i18n/LanguageContext';

interface BudgetAlertsProps {
  restrictions: BudgetRestrictions;
}

export function BudgetAlerts({ restrictions }: BudgetAlertsProps) {
  const { t } = useLanguage();
  const alerts: JSX.Element[] = [];

  // Daily limit alerts
  if (restrictions.dailyLimit) {
    const dailyPercent = (restrictions.dailySpent / restrictions.dailyLimit) * 100;
    const warnPercent = restrictions.warnAtPercent || 80;

    if (dailyPercent >= 100) {
      alerts.push(
        <Alert key="daily-blocked" variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>{t.restrictions.limitReached}</AlertTitle>
          <AlertDescription>
            Daily spending limit exceeded. Spending is blocked.
          </AlertDescription>
        </Alert>
      );
    } else if (dailyPercent >= warnPercent) {
      alerts.push(
        <Alert key="daily-warning" variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            You've used {dailyPercent.toFixed(0)}% of your daily spending limit
          </AlertDescription>
        </Alert>
      );
    }
  }

  // Monthly cap alerts
  if (restrictions.monthlyCap) {
    const monthlyPercent = (restrictions.monthlySpent / restrictions.monthlyCap) * 100;
    const warnPercent = restrictions.warnAtPercent || 80;

    if (monthlyPercent >= 100) {
      alerts.push(
        <Alert key="monthly-blocked" variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>{t.restrictions.limitReached}</AlertTitle>
          <AlertDescription>
            Monthly budget cap exceeded. Spending is blocked.
          </AlertDescription>
        </Alert>
      );
    } else if (monthlyPercent >= warnPercent) {
      alerts.push(
        <Alert key="monthly-warning" variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            You've used {monthlyPercent.toFixed(0)}% of your monthly budget cap
          </AlertDescription>
        </Alert>
      );
    }
  }

  // Category limit alerts
  if (restrictions.categoryLimits) {
    Object.entries(restrictions.categoryLimits).forEach(([categoryId, limit]) => {
      const categorySpent = restrictions.categorySpent?.[categoryId] || 0;
      const categoryPercent = (categorySpent / limit) * 100;
      const warnPercent = restrictions.warnAtPercent || 80;

      if (categoryPercent >= 100) {
        alerts.push(
          <Alert key={`category-${categoryId}-blocked`} variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>{t.restrictions.limitReached}</AlertTitle>
            <AlertDescription>
              {categoryId} category limit exceeded. Spending is blocked.
            </AlertDescription>
          </Alert>
        );
      } else if (categoryPercent >= warnPercent) {
        alerts.push(
          <Alert key={`category-${categoryId}-warning`} variant="warning">
            <Info className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              You've used {categoryPercent.toFixed(0)}% of your {categoryId} category limit
            </AlertDescription>
          </Alert>
        );
      }
    });
  }

  if (alerts.length === 0) {
    return null;
  }

  return <div className="space-y-3">{alerts}</div>;
}
