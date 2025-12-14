import { Button } from '@/components/ui/button';
import { MonthlyResult, UserState } from '@/types/budget';
import { Trophy, TrendingUp, TrendingDown, RotateCcw, ChevronRight, Sparkles, Award } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface MonthlyResultsProps {
  state: UserState;
  results: MonthlyResult[];
  onEndMonth: () => void;
  onReset: () => void;
}

function formatCurrency(value: number, currency: string): string {
  return `${currency} ${new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;
}

function ResultCard({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  color,
  delay = 0 
}: { 
  label: string; 
  value: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
  delay?: number;
}) {
  return (
    <div 
      className="glass-card p-4 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-display font-bold text-lg text-foreground tabular-nums">{value}</p>
          </div>
        </div>
        {trend && trend !== 'neutral' && (
          <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-success/10' : 'bg-destructive/10'}`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreDisplay({ value, label, maxValue = 100 }: { value: number; label: string; maxValue?: number }) {
  const percentage = (value / maxValue) * 100;
  const getGrade = () => {
    if (percentage >= 80) return { grade: 'A', color: 'hsl(152 76% 40%)', bg: 'hsl(152 76% 40% / 0.1)' };
    if (percentage >= 60) return { grade: 'B', color: 'hsl(165 80% 45%)', bg: 'hsl(165 80% 45% / 0.1)' };
    if (percentage >= 40) return { grade: 'C', color: 'hsl(45 100% 55%)', bg: 'hsl(45 100% 55% / 0.1)' };
    return { grade: 'D', color: 'hsl(0 72% 51%)', bg: 'hsl(0 72% 51% / 0.1)' };
  };
  const { grade, color, bg } = getGrade();

  return (
    <div className="text-center">
      <div 
        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto border"
        style={{ backgroundColor: bg, borderColor: `${color}30` }}
      >
        <span className="font-display font-bold text-3xl" style={{ color }}>{grade}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-3">{label}</p>
      <p className="font-bold text-sm text-foreground tabular-nums">{value}%</p>
    </div>
  );
}

export function MonthlyResults({ state, results, onEndMonth, onReset }: MonthlyResultsProps) {
  const { t } = useLanguage();
  const currency = t.common.currency;
  const currentResult = results[results.length - 1];
  const showSummary = results.length > 0;

  return (
    <div className="space-y-5 pb-28">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-display font-bold gradient-text">{t.results.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {showSummary ? currentResult?.month : `${t.common.month} ${state.month}`} • {t.results.subtitle}
        </p>
      </div>

      {!showSummary ? (
        <>
          {/* Current Status */}
          <div className="glass-card-elevated p-8 text-center animate-slide-up">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow animate-float">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="font-display font-bold text-xl mt-6 text-foreground">
              {t.common.month} {state.month} {t.results.monthActive}
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
              {t.results.subtitle}
            </p>
          </div>

          {/* Score Preview */}
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-display font-semibold text-sm mb-5 text-center">{t.results.finalScores}</h3>
            <div className="flex justify-around">
              <ScoreDisplay value={state.stabilityIndex} label={t.results.stability} />
              <ScoreDisplay value={100 - state.stressLevel} label={t.results.wellness} />
            </div>
          </div>

          <Button
            variant="gradient"
            size="xl"
            className="w-full animate-slide-up"
            style={{ animationDelay: '200ms' }}
            onClick={onEndMonth}
          >
            {t.results.completeMonth} {state.month}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <>
          {/* Achievement Banner */}
          <div className="glass-card-elevated p-8 text-center relative overflow-hidden animate-slide-up">
            <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
            <div className="relative">
              <div className="relative inline-block">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
                  <Award className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-warning flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-warning-foreground" />
                </div>
              </div>
              <h2 className="font-display font-bold text-xl mt-6 text-foreground">
                {currentResult.month} {t.results.monthComplete}
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                {t.results.greatJob}
              </p>
            </div>
          </div>

          {/* Final Scores */}
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-display font-semibold text-sm mb-5 text-center">{t.results.finalScores}</h3>
            <div className="flex justify-around">
              <ScoreDisplay value={currentResult.stabilityIndex} label={t.results.stability} />
              <ScoreDisplay value={100 - currentResult.stressLevel} label={t.results.wellness} />
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <ResultCard
              icon={TrendingUp}
              label={t.results.remainingBalance}
              value={formatCurrency(currentResult.remainingBalance, currency)}
              trend="neutral"
              color="hsl(165 80% 45%)"
              delay={200}
            />
            <ResultCard
              icon={TrendingUp}
              label={t.dashboard.totalSavings}
              value={formatCurrency(currentResult.totalSavings, currency)}
              trend={currentResult.totalSavings > 0 ? 'up' : 'neutral'}
              color="hsl(152 76% 40%)"
              delay={300}
            />
            <ResultCard
              icon={TrendingDown}
              label={t.dashboard.totalDebt}
              value={formatCurrency(currentResult.totalDebt, currency)}
              trend={currentResult.totalDebt > 0 ? 'down' : 'neutral'}
              color="hsl(0 72% 51%)"
              delay={400}
            />
          </div>

          {/* History */}
          {results.length > 1 && (
            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '500ms' }}>
              <h3 className="font-display font-semibold text-sm mb-3">{t.results.previousMonths}</h3>
              <div className="space-y-2">
                {results.slice(0, -1).reverse().map((result, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
                    <span className="text-sm text-muted-foreground">{result.month}</span>
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      {t.results.stability}: {result.stabilityIndex}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="fixed bottom-20 left-0 right-0 p-4 z-40">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent" />
            <div className="relative max-w-lg mx-auto space-y-2">
              <Button
                variant="gradient"
                size="xl"
                className="w-full"
                onClick={onEndMonth}
              >
                {t.results.startMonth} {state.month}
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={onReset}
              >
                <RotateCcw className="w-4 h-4" />
                {t.results.resetSimulation}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
