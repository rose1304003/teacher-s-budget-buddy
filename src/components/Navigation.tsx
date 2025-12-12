import { Home, PieChart, Zap, BarChart3, Bot } from 'lucide-react';

type TabId = 'dashboard' | 'budget' | 'scenarios' | 'results' | 'advisor';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  { id: 'dashboard' as TabId, icon: Home, label: 'Home' },
  { id: 'budget' as TabId, icon: PieChart, label: 'Budget' },
  { id: 'scenarios' as TabId, icon: Zap, label: 'Scenarios' },
  { id: 'results' as TabId, icon: BarChart3, label: 'Results' },
  { id: 'advisor' as TabId, icon: Bot, label: 'AI' },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/50 px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
