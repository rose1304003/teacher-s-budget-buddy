import { useState } from 'react';
import { useBudgetSimulator } from '@/hooks/useBudgetSimulator';
import { Dashboard } from '@/components/Dashboard';
import { BudgetAllocation } from '@/components/BudgetAllocation';
import { ScenarioSimulation } from '@/components/ScenarioSimulation';
import { MonthlyResults } from '@/components/MonthlyResults';
import { AIAdvisor } from '@/components/AIAdvisor';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type TabId = 'dashboard' | 'budget' | 'scenarios' | 'results' | 'advisor';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const {
    state,
    currentScenario,
    monthlyResults,
    updateCategory,
    getTotalAllocated,
    getRemainingBudget,
    triggerRandomScenario,
    handleScenarioChoice,
    endMonth,
    resetSimulation,
  } = useBudgetSimulator();

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  const handleBudgetComplete = () => {
    toast.success('Budget allocated! Ready for scenarios.');
    setActiveTab('scenarios');
  };

  const handleScenarioComplete = () => {
    toast.success('Great decision! Check your results.');
    setActiveTab('results');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={state} />;
      case 'budget':
        return (
          <BudgetAllocation
            state={state}
            onUpdateCategory={updateCategory}
            getTotalAllocated={getTotalAllocated}
            getRemainingBudget={getRemainingBudget}
            onComplete={handleBudgetComplete}
          />
        );
      case 'scenarios':
        return (
          <ScenarioSimulation
            scenario={currentScenario}
            onChoice={(option) => {
              handleScenarioChoice(option);
              handleScenarioComplete();
            }}
            onTriggerScenario={triggerRandomScenario}
          />
        );
      case 'results':
        return (
          <MonthlyResults
            state={state}
            results={monthlyResults}
            onEndMonth={endMonth}
            onReset={() => {
              resetSimulation();
              toast.info('Simulation reset. Starting fresh!');
              setActiveTab('dashboard');
            }}
          />
        );
      case 'advisor':
        return <AIAdvisor state={state} />;
      default:
        return <Dashboard state={state} />;
    }
  };

  return (
    <div className="min-h-screen bg-background tg-viewport">
      {/* Background Glow Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 pt-6 pb-24 max-w-lg mx-auto">
        {renderContent()}
      </main>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
