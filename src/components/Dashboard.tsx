import { TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard, Activity } from 'lucide-react';
import { UserState } from '@/types/budget';

interface DashboardProps {
  state: UserState;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
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
      <div className="flex items-start justify-between">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && trend !== 'neutral' && (
          <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        <p className="text-foreground text-xl font-display font-semibold mt-1">{value}</p>
      </div>
    </div>
  );
}

function StabilityMeter({ value, label }: { value: number; label: string }) {
  const getColor = () => {
    if (value >= 70) return 'hsl(142 76% 36%)';
    if (value >= 40) return 'hsl(38 92% 50%)';
    return 'hsl(0 84% 60%)';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 progress-ring">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="8"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-display font-bold" style={{ color: getColor() }}>
            {value}
          </span>
        </div>
      </div>
      <p className="text-muted-foreground text-xs mt-2">{label}</p>
    </div>
  );
}

export function Dashboard({ state }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-display font-bold gradient-text">Budget Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Month {state.month} • Virtual Simulation</p>
      </div>

      {/* Income Card */}
      <div className="glass-card-elevated p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Monthly Virtual Income</p>
            <p className="text-3xl font-display font-bold text-foreground mt-1">
              ₸ {formatCurrency(state.virtualIncome)}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Wallet className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Available Balance</span>
            <span className="font-semibold text-primary">₸ {formatCurrency(state.currentBalance)}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={PiggyBank}
          label="Total Savings"
          value={`₸ ${formatCurrency(state.savings)}`}
          trend={state.savings > 0 ? 'up' : 'neutral'}
          color="hsl(158 64% 52%)"
          delay={200}
        />
        <StatCard
          icon={CreditCard}
          label="Total Debt"
          value={`₸ ${formatCurrency(state.debt)}`}
          trend={state.debt > 0 ? 'down' : 'neutral'}
          color="hsl(0 84% 60%)"
          delay={300}
        />
      </div>

      {/* Stability & Stress Meters */}
      <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-sm">Financial Health</h3>
        </div>
        <div className="flex justify-around">
          <StabilityMeter value={state.stabilityIndex} label="Stability Index" />
          <StabilityMeter value={100 - state.stressLevel} label="Stress Resistance" />
        </div>
      </div>

      {/* Educational Notice */}
      <div className="glass-card p-4 border-l-4 border-primary animate-fade-in" style={{ animationDelay: '500ms' }}>
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-semibold">ℹ️ Educational Simulation</span>
          <br />
          All amounts shown are virtual. This simulator helps you practice financial decision-making without real money.
        </p>
      </div>
    </div>
  );
}
