import { useLanguage } from '@/i18n/LanguageContext';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard, Activity, Sparkles } from 'lucide-react';
import { UserState } from '@/types/budget';

interface DashboardProps {
  state: UserState;
}

function formatCurrency(value: number, currency: string): string {
  return `${currency} ${new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color,
  delay = 0 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  trend?: 'up' | 'down' | 'neutral';
  color: string;
  delay?: number;
}) {
  return (
    <div 
      className="stat-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between relative z-10">
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && trend !== 'neutral' && (
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          </div>
        )}
      </div>
      <div className="mt-4 relative z-10">
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        <p className="text-foreground text-xl font-display font-bold mt-1 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function StabilityMeter({ value, label }: { value: number; label: string }) {
  const getColor = () => {
    if (value >= 70) return 'hsl(152 76% 40%)';
    if (value >= 40) return 'hsl(45 100% 55%)';
    return 'hsl(0 72% 51%)';
  };

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 progress-ring">
          <circle
            cx="56"
            cy="56"
            r="42"
            fill="none"
            stroke="hsl(220 20% 14%)"
            strokeWidth="6"
          />
          <circle
            cx="56"
            cy="56"
            r="42"
            fill="none"
            stroke={getColor()}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${getColor()}50)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-display font-bold" style={{ color: getColor() }}>
            {value}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">%</span>
        </div>
      </div>
      <p className="text-muted-foreground text-xs mt-3 font-medium">{label}</p>
    </div>
  );
}

export function Dashboard({ state }: DashboardProps) {
  const { t } = useLanguage();
  const currency = t.common.currency;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-display font-bold gradient-text">{t.dashboard.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t.common.month} {state.month} • {t.dashboard.subtitle}
        </p>
      </div>

      {/* Income Card */}
      <div className="income-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              {t.dashboard.monthlyIncome}
            </p>
            <p className="text-3xl font-display font-bold text-foreground mt-2 tracking-tight">
              {formatCurrency(state.virtualIncome, currency)}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow animate-float">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.dashboard.availableBalance}</span>
            <span className="font-bold text-primary">{formatCurrency(state.currentBalance, currency)}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={PiggyBank}
          label={t.dashboard.totalSavings}
          value={formatCurrency(state.savings, currency)}
          trend={state.savings > 0 ? 'up' : 'neutral'}
          color="hsl(152 76% 40%)"
          delay={200}
        />
        <StatCard
          icon={CreditCard}
          label={t.dashboard.totalDebt}
          value={formatCurrency(state.debt, currency)}
          trend={state.debt > 0 ? 'down' : 'neutral'}
          color="hsl(0 72% 51%)"
          delay={300}
        />
      </div>

      {/* Stability & Stress Meters */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-display font-semibold">{t.dashboard.financialHealth}</h3>
        </div>
        <div className="flex justify-around">
          <StabilityMeter value={state.stabilityIndex} label={t.dashboard.stabilityIndex} />
          <StabilityMeter value={100 - state.stressLevel} label={t.dashboard.stressResistance} />
        </div>
      </div>

      {/* Educational Notice */}
      <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: '500ms' }}>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary">{t.dashboard.educationalNote}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {t.dashboard.educationalDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
