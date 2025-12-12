import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Scenario, ScenarioOption } from '@/types/budget';
import { AlertTriangle, TrendingUp, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface ScenarioSimulationProps {
  scenario: Scenario | null;
  onChoice: (option: ScenarioOption) => void;
  onTriggerScenario: () => void;
}

function ImpactBadge({ value, label }: { value: number; label: string }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/50">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className={`text-xs font-bold tabular-nums ${
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
  const { t } = useLanguage();
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
          <h1 className="text-2xl font-display font-bold gradient-text">{t.scenarios.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t.scenarios.subtitle}</p>
        </div>

        <div className="glass-card-elevated p-8 text-center animate-slide-up">
          <div className="relative inline-block">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow animate-float">
              <Zap className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-warning flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-warning-foreground" />
            </div>
          </div>
          <h2 className="font-display font-bold text-xl mt-6 text-foreground">
            {t.scenarios.readyTitle}
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto leading-relaxed">
            {t.scenarios.readyDesc}
          </p>
          <Button
            variant="gradient"
            size="lg"
            className="mt-6"
            onClick={onTriggerScenario}
          >
            {t.scenarios.startScenario}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="font-display font-semibold text-sm mb-4">{t.scenarios.whatToExpect}</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '🏥', text: t.scenarios.medicalEmergency },
              { icon: '💡', text: t.scenarios.utilityChanges },
              { icon: '💰', text: t.scenarios.unexpectedIncome },
              { icon: '👨‍👩‍👧', text: t.scenarios.familyExpenses },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 text-sm">
                <span>{item.icon}</span>
                <span className="text-xs text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isNegativeImpact = scenario.impact < 0;

  return (
    <div className="space-y-5 pb-28">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-display font-bold gradient-text">{t.scenarios.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.scenarios.subtitle}</p>
      </div>

      {/* Scenario Card */}
      <div className="glass-card-elevated p-6 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            isNegativeImpact ? 'bg-warning/15 border border-warning/30' : 'bg-success/15 border border-success/30'
          }`}>
            {isNegativeImpact ? (
              <AlertTriangle className="w-7 h-7 text-warning" />
            ) : (
              <TrendingUp className="w-7 h-7 text-success" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-lg text-foreground">
              {scenario.title}
            </h2>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              {scenario.description}
            </p>
            <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold ${
              isNegativeImpact ? 'bg-warning/15 text-warning border border-warning/30' : 'bg-success/15 text-success border border-success/30'
            }`}>
              {t.scenarios.impact}: {scenario.impact > 0 ? '+' : ''}{scenario.impact}%
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-sm text-foreground">{t.scenarios.chooseResponse}</h3>
        {scenario.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`scenario-card w-full text-left animate-slide-up ${
              selectedOption === option.id ? 'selected' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{option.label}</h4>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedOption === option.id 
                  ? 'border-primary bg-primary' 
                  : 'border-muted-foreground/50'
              }`}>
                {selectedOption === option.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                )}
              </div>
            </div>
            
            {/* Impact Preview */}
            <div className="mt-4 pt-4 border-t border-border/30 flex flex-wrap gap-2">
              <ImpactBadge value={option.impact.balance} label={t.common.balance} />
              <ImpactBadge value={option.impact.savings} label={t.common.savings} />
              <ImpactBadge value={option.impact.debt} label={t.common.debt} />
            </div>
          </button>
        ))}
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 z-40">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent" />
        <div className="relative max-w-lg mx-auto">
          <Button
            variant={selectedOption ? 'gradient' : 'secondary'}
            size="xl"
            className="w-full"
            onClick={handleConfirmChoice}
            disabled={!selectedOption}
          >
            {selectedOption ? t.scenarios.confirmDecision : t.scenarios.selectOption}
          </Button>
        </div>
      </div>
    </div>
  );
}
