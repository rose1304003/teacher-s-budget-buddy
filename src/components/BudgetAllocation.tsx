import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { BudgetCategory, UserState } from '@/types/budget';

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
}: {
  category: BudgetCategory;
  onUpdate: (value: number) => void;
  totalAllocated: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isWithinRange = category.allocated >= category.recommended.min && 
                        category.allocated <= category.recommended.max;
  const isOverBudget = totalAllocated > 100;

  return (
    <div className="glass-card p-4 transition-all duration-300">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ backgroundColor: `${category.color}20` }}
          >
            {category.icon}
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{category.name}</p>
            <p className="text-xs text-muted-foreground">
              Recommended: {category.recommended.min}% - {category.recommended.max}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className="text-lg font-display font-bold"
            style={{ color: isWithinRange ? category.color : 'hsl(var(--warning))' }}
          >
            {category.allocated}%
          </span>
          {isWithinRange ? (
            <CheckCircle2 className="w-4 h-4 text-success" />
          ) : (
            <Info className="w-4 h-4 text-warning" />
          )}
        </div>
      </div>
      
      <div className={`mt-4 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-100'}`}>
        <Slider
          value={[category.allocated]}
          onValueChange={([value]) => onUpdate(value)}
          max={100}
          step={1}
          className="w-full"
          style={{
            '--slider-track-color': 'hsl(var(--secondary))',
            '--slider-range-color': category.color,
            '--slider-thumb-color': category.color,
          } as React.CSSProperties}
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
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
  const totalAllocated = getTotalAllocated();
  const remaining = getRemainingBudget();
  const isComplete = totalAllocated === 100;
  const isOverBudget = totalAllocated > 100;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-display font-bold gradient-text">Allocate Budget</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Distribute your income across categories
        </p>
      </div>

      {/* Progress Bar */}
      <div className="glass-card-elevated p-4 animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Budget Allocation</span>
          <span className={`text-sm font-bold ${isOverBudget ? 'text-destructive' : isComplete ? 'text-success' : 'text-primary'}`}>
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
          <div className="flex items-center gap-2 mt-3 text-destructive text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>You've allocated {totalAllocated - 100}% more than your income!</span>
          </div>
        )}
        {isComplete && !isOverBudget && (
          <div className="flex items-center gap-2 mt-3 text-success text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Perfect! Your budget is fully allocated.</span>
          </div>
        )}
        {!isComplete && !isOverBudget && (
          <div className="flex items-center gap-2 mt-3 text-muted-foreground text-xs">
            <Info className="w-4 h-4" />
            <span>{remaining}% remaining to allocate</span>
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
              onUpdate={(value) => onUpdateCategory(category.id, value)}
              totalAllocated={totalAllocated}
            />
          </div>
        ))}
      </div>

      {/* Complete Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          variant={isComplete && !isOverBudget ? 'gradient' : 'secondary'}
          size="xl"
          className="w-full"
          onClick={onComplete}
          disabled={!isComplete || isOverBudget}
        >
          {isComplete && !isOverBudget ? 'Continue to Simulation' : `Allocate ${remaining}% More`}
        </Button>
      </div>
    </div>
  );
}
