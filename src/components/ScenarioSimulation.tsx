import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Scenario, ScenarioOption } from '@/types/budget';
import { AlertTriangle, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

interface ScenarioSimulationProps {
  scenario: Scenario | null;
  onChoice: (option: ScenarioOption) => void;
  onTriggerScenario: () => void;
}

function ImpactBadge({ value, label }: { value: number; label: string }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span className={`text-xs font-semibold ${
        isNeutral ? 'text-muted-foreground' : isPositive ? 'text-success' : 'text-destructive'
      }`}>
        {isNeutral ? '0' : isPositive ? `+${value}` : value}%
      </span>
    </div>
  );
}

export function ScenarioSimulation({
  scenario,
  onChoice,
  onTriggerScenario,
}: ScenarioSimulationProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleConfirmChoice = () => {
    if (!scenario || !selectedOption) return;
    const option = scenario.options.find(o => o.id === selectedOption);
    if (option) {
      onChoice(option);
      setSelectedOption(null);
    }
  };

  if (!scenario) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-display font-bold gradient-text">Life Scenarios</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Practice handling real-life financial situations
          </p>
        </div>

        <div className="glass-card-elevated p-8 text-center animate-slide-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-float">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl mt-6 text-foreground">
            Ready for a Challenge?
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
            Life is unpredictable. Practice making smart financial decisions when unexpected events happen.
          </p>
          <Button
            variant="gradient"
            size="lg"
            className="mt-6"
            onClick={onTriggerScenario}
          >
            Start Scenario
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="font-display font-semibold text-sm mb-3">What to Expect</h3>
          <ul className="space-y-2">
            {[
              'Medical emergencies',
              'Utility price changes',
              'Unexpected income',
              'Family expenses',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const isNegativeImpact = scenario.impact < 0;

  return (
    <div className="space-y-6 pb-24">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-display font-bold gradient-text">Life Scenario</h1>
        <p className="text-muted-foreground text-sm mt-1">Make your decision wisely</p>
      </div>

      {/* Scenario Card */}
      <div className="glass-card-elevated p-5 animate-slide-up">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isNegativeImpact ? 'bg-warning/20' : 'bg-success/20'
          }`}>
            {isNegativeImpact ? (
              <AlertTriangle className="w-6 h-6 text-warning" />
            ) : (
              <TrendingUp className="w-6 h-6 text-success" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-lg text-foreground">
              {scenario.title}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {scenario.description}
            </p>
            <div className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
              isNegativeImpact ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
            }`}>
              Impact: {scenario.impact > 0 ? '+' : ''}{scenario.impact}% of income
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-sm text-foreground">Choose Your Response</h3>
        {scenario.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`scenario-card w-full text-left animate-slide-up ${
              selectedOption === option.id 
                ? 'border-primary shadow-glow' 
                : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{option.label}</h4>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedOption === option.id 
                  ? 'border-primary bg-primary' 
                  : 'border-muted-foreground'
              }`}>
                {selectedOption === option.id && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </div>
            
            {/* Impact Preview */}
            <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-3">
              <ImpactBadge value={option.impact.balance} label="Balance" />
              <ImpactBadge value={option.impact.savings} label="Savings" />
              <ImpactBadge value={option.impact.debt} label="Debt" />
              <ImpactBadge value={option.impact.stability} label="Stability" />
            </div>
          </button>
        ))}
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          variant={selectedOption ? 'gradient' : 'secondary'}
          size="xl"
          className="w-full"
          onClick={handleConfirmChoice}
          disabled={!selectedOption}
        >
          {selectedOption ? 'Confirm Decision' : 'Select an Option'}
        </Button>
      </div>
    </div>
  );
}
