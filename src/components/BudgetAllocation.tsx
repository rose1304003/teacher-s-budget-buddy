import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Info, ChevronDown } from 'lucide-react';
import { BudgetCategory, UserState } from '@/types/budget';
import { useLanguage } from '@/i18n/LanguageContext';

interface BudgetAllocationProps {
  state: UserState;
  onUpdateCategory: (categoryId: string, value: number) => void;
  getTotalAllocated: () => number;
  getRemainingBudget: () => number;
  onComplete: () => void;
}

function CategoryCard({
  category,
  onUpdate,
  totalAllocated,
  categoryName,
}: {
  category: BudgetCategory;
  onUpdate: (value: number) => void;
  totalAllocated: number;
  categoryName: string;
}) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const isWithinRange = category.allocated >= category.recommended.min && 
                        category.allocated <= category.recommended.max;

  return (
    <div className="glass-card p-4 transition-all duration-300">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-transform hover:scale-110"
            style={{ backgroundColor: `${category.color}15`, border: `1px solid ${category.color}30` }}
          >
            {category.icon}
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{categoryName}</p>
            <p className="text-xs text-muted-foreground">
              {t.budget.recommended}: {category.recommended.min}% - {category.recommended.max}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className="text-lg font-display font-bold tabular-nums"
            style={{ color: isWithinRange ? category.color : 'hsl(45 100% 55%)' }}
          >
            {category.allocated}%
          </span>
          {isWithinRange ? (
            <CheckCircle2 className="w-4 h-4 text-success" />
          ) : (
            <Info className="w-4 h-4 text-warning" />
          )}
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <Slider
            value={[category.allocated]}
            onValueChange={([value]) => onUpdate(value)}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function BudgetAllocation({
  state,
  onUpdateCategory,
  getTotalAllocated,
  getRemainingBudget,
  onComplete,
}: BudgetAllocationProps) {
  const { t } = useLanguage();
  const totalAllocated = getTotalAllocated();
  const remaining = getRemainingBudget();
  const isComplete = totalAllocated === 100;
  const isOverBudget = totalAllocated > 100;

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
    <div className="space-y-5 pb-28">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-display font-bold gradient-text">{t.budget.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.budget.subtitle}</p>
      </div>

      {/* Progress Bar */}
      <div className="glass-card-elevated p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">{t.budget.allocation}</span>
          <span className={`text-sm font-bold tabular-nums ${
            isOverBudget ? 'text-destructive' : isComplete ? 'text-success' : 'text-primary'
          }`}>
            {totalAllocated}% / 100%
          </span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget ? 'bg-destructive' : isComplete ? 'bg-gradient-success' : 'bg-gradient-primary'
            }`}
            style={{ width: `${Math.min(totalAllocated, 100)}%` }}
          />
        </div>
        {isOverBudget && (
          <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-destructive/10 text-destructive text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{t.budget.overBudget}</span>
          </div>
        )}
        {isComplete && !isOverBudget && (
          <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-success/10 text-success text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{t.budget.perfect}</span>
          </div>
        )}
        {!isComplete && !isOverBudget && (
          <div className="flex items-center gap-2 mt-3 text-muted-foreground text-xs">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{remaining}% {t.budget.remaining}</span>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {state.categories.map((category, index) => (
          <div 
            key={category.id} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CategoryCard
              category={category}
              categoryName={categoryNames[category.id] || category.name}
              onUpdate={(value) => onUpdateCategory(category.id, value)}
              totalAllocated={totalAllocated}
            />
          </div>
        ))}
      </div>

      {/* Complete Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 z-40">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent" />
        <div className="relative max-w-lg mx-auto">
          <Button
            variant={isComplete && !isOverBudget ? 'gradient' : 'secondary'}
            size="xl"
            className="w-full"
            onClick={onComplete}
            disabled={!isComplete || isOverBudget}
          >
            {isComplete && !isOverBudget ? t.budget.continue : `${t.budget.allocateMore} ${remaining}%`}
          </Button>
        </div>
      </div>
    </div>
  );
}
