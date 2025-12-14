import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserState } from '@/types/budget';
import { Bot, Send, Sparkles, Lightbulb, TrendingUp, Shield, Loader2, Trash2, Wallet } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAIChat } from '@/hooks/useAIChat';

interface AIAdvisorProps {
  state: UserState;
}

export function AIAdvisor({ state }: AIAdvisorProps) {
  const { t, language } = useLanguage();
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat(state, language);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const quickPrompts = [
    { icon: Lightbulb, label: t.ai.savingTips, prompt: t.ai.savingTips },
    { icon: TrendingUp, label: t.ai.improveStability, prompt: t.ai.improveStability },
    { icon: Shield, label: t.ai.reduceStress, prompt: t.ai.reduceStress },
    { icon: Wallet, label: t.ai.trackExpenses || 'Track expenses', prompt: language === 'ru' ? 'Помоги отследить мои расходы' : language === 'uz' ? 'Xarajatlarimni kuzatishda yordam bering' : 'Help me track my expenses' },
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send greeting message on first load
  useEffect(() => {
    if (messages.length === 0) {
      // Don't send greeting automatically - let user start conversation
      // The greeting will be shown in the UI instead
    }
  }, []);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="animate-fade-in mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-text">{t.ai.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t.ai.subtitle}</p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[85%]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{t.ai.title}</span>
              </div>
              <div className="glass-card rounded-2xl rounded-tl-md px-4 py-3">
                <p className="text-sm whitespace-pre-line leading-relaxed">
                  {t.ai.greeting}
                </p>
              </div>
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{t.ai.title}</span>
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-md'
                    : 'glass-card rounded-tl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-card rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs text-muted-foreground">{t.ai.thinking}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => {
              if (!isLoading) {
                sendMessage(prompt.prompt || prompt.label);
              }
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/30 text-sm whitespace-nowrap transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <prompt.icon className="w-4 h-4 text-primary" />
            <span className="text-foreground">{prompt.label}</span>
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t.ai.placeholder}
          disabled={isLoading}
          className="flex-1 bg-secondary/50 border-border/30 focus:border-primary/50"
        />
        <Button
          variant="gradient"
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3" />
        {t.ai.disclaimer}
      </p>
    </div>
  );
}
