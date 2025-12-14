import { Home, PieChart, Zap, BarChart3, Bot } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

type TabId = 'dashboard' | 'budget' | 'scenarios' | 'results' | 'advisor';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'dashboard' as TabId, icon: Home, label: t.nav.home },
    { id: 'budget' as TabId, icon: PieChart, label: t.nav.budget },
    { id: 'scenarios' as TabId, icon: Zap, label: t.nav.scenarios },
    { id: 'results' as TabId, icon: BarChart3, label: t.nav.results },
    { id: 'advisor' as TabId, icon: Bot, label: t.nav.ai },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-card/95 backdrop-blur-xl border-t border-border/30" />
      <div className="relative flex justify-around items-center max-w-lg mx-auto px-2 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <tab.icon 
                className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? 'text-primary scale-110' : 'text-muted-foreground'
                }`} 
              />
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
