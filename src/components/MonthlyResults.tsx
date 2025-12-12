import { Button } from '@/components/ui/button';
import { MonthlyResult, UserState } from '@/types/budget';
import { Trophy, TrendingUp, TrendingDown, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';

interface MonthlyResultsProps {
  state: UserState;
  results: MonthlyResult[];
  onEndMonth: () => void;
  onReset: () => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
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
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-display font-bold text-lg text-foreground">{value}</p>
          </div>
        </div>
        {trend && trend !== 'neutral' && (
          <div className={trend === 'up' ? 'text-success' : 'text-destructive'}>
            {trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreDisplay({ value, label, maxValue = 100 }: { value: number; label: string; maxValue?: number }) {
  const percentage = (value / maxValue) * 100;
  const getGrade = () => {
    if (percentage >= 80) return { grade: 'A', color: 'hsl(142 76% 36%)' };
    if (percentage >= 60) return { grade: 'B', color: 'hsl(158 64% 52%)' };
    if (percentage >= 40) return { grade: 'C', color: 'hsl(38 92% 50%)' };
    return { grade: 'D', color: 'hsl(0 84% 60%)' };
  };
  const { grade, color } = getGrade();

  return (
    <div className="text-center">
      <div 
        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
        style={{ backgroundColor: `${color}20` }}
      >
        <span className="font-display font-bold text-3xl" style={{ color }}>{grade}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{label}</p>
      <p className="font-semibold text-sm text-foreground">{value}%</p>
    </div>
  );
}

export function MonthlyResults({ state, results, onEndMonth, onReset }: MonthlyResultsProps) {
  const currentResult = results[results.length - 1];
  const showSummary = results.length > 0;

  return (
    <div className="space-y-6 pb-24">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-display font-bold gradient-text">Monthly Summary</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {showSummary ? `Review of ${currentResult?.month}` : `Month ${state.month} in progress`}
        </p>
      </div>

      {!showSummary ? (
        <>
          {/* Current Status */}
          <div className="glass-card-elevated p-6 text-center animate-slide-up">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="font-display font-bold text-xl mt-4 text-foreground">
              Month {state.month} Active
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Complete budget allocation and scenarios to end the month
            </p>
          </div>

          {/* Score Preview */}
          <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-display font-semibold text-sm mb-4 text-center">Current Scores</h3>
            <div className="flex justify-around">
              <ScoreDisplay value={state.stabilityIndex} label="Stability" />
              <ScoreDisplay value={100 - state.stressLevel} label="Wellness" />
            </div>
          </div>

          <Button
            variant="gradient"
            size="xl"
            className="w-full animate-slide-up"
            style={{ animationDelay: '200ms' }}
            onClick={onEndMonth}
          >
            Complete Month {state.month}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <>
          {/* Achievement Banner */}
          <div className="glass-card-elevated p-6 text-center relative overflow-hidden animate-slide-up">
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            <div className="relative">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display font-bold text-xl mt-4 text-foreground">
                {currentResult.month} Complete!
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Great job practicing financial decisions
              </p>
            </div>
          </div>

          {/* Final Scores */}
          <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-display font-semibold text-sm mb-4 text-center">Final Scores</h3>
            <div className="flex justify-around">
              <ScoreDisplay value={currentResult.stabilityIndex} label="Stability" />
              <ScoreDisplay value={100 - currentResult.stressLevel} label="Wellness" />
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <ResultCard
              icon={TrendingUp}
              label="Remaining Balance"
              value={`₸ ${formatCurrency(currentResult.remainingBalance)}`}
              trend="neutral"
              color="hsl(172 66% 50%)"
              delay={200}
            />
            <ResultCard
              icon={TrendingUp}
              label="Total Savings"
              value={`₸ ${formatCurrency(currentResult.totalSavings)}`}
              trend={currentResult.totalSavings > 0 ? 'up' : 'neutral'}
              color="hsl(158 64% 52%)"
              delay={300}
            />
            <ResultCard
              icon={TrendingDown}
              label="Total Debt"
              value={`₸ ${formatCurrency(currentResult.totalDebt)}`}
              trend={currentResult.totalDebt > 0 ? 'down' : 'neutral'}
              color="hsl(0 84% 60%)"
              delay={400}
            />
          </div>

          {/* History */}
          {results.length > 1 && (
            <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '500ms' }}>
              <h3 className="font-display font-semibold text-sm mb-3">Previous Months</h3>
              <div className="space-y-2">
                {results.slice(0, -1).reverse().map((result, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{result.month}</span>
                    <span className="text-sm font-semibold text-foreground">
                      Stability: {result.stabilityIndex}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="gradient"
              size="xl"
              className="w-full"
              onClick={onEndMonth}
            >
              Start Month {state.month}
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={onReset}
            >
              <RotateCcw className="w-4 h-4" />
              Reset Simulation
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
