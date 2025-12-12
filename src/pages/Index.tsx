import { useState } from 'react';
import { useBudgetSimulator } from '@/hooks/useBudgetSimulator';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Dashboard } from '@/components/Dashboard';
import { BudgetAllocation } from '@/components/BudgetAllocation';
import { ScenarioSimulation } from '@/components/ScenarioSimulation';
import { MonthlyResults } from '@/components/MonthlyResults';
import { AIAdvisor } from '@/components/AIAdvisor';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type TabId = 'dashboard' | 'budget' | 'scenarios' | 'results' | 'advisor';

function BudgetSimulatorApp() {
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
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/8 via-transparent to-transparent opacity-60" />
      </div>

      {/* Header with Language Selector */}
      <header className="relative z-20 flex justify-end p-4">
        <LanguageSelector />
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-24 max-w-lg mx-auto">
        {renderContent()}
      </main>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'hsl(220 25% 10%)',
            border: '1px solid hsl(220 20% 20%)',
            color: 'hsl(210 40% 98%)',
          },
        }}
      />
    </div>
  );
}

const Index = () => {
  return (
    <LanguageProvider>
      <BudgetSimulatorApp />
    </LanguageProvider>
  );
};

export default Index;
