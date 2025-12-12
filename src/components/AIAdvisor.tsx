import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserState, AIMessage } from '@/types/budget';
import { Bot, Send, Sparkles, Lightbulb, TrendingUp, Shield } from 'lucide-react';

interface AIAdvisorProps {
  state: UserState;
}

const quickPrompts = [
  { icon: Lightbulb, label: 'Tips for saving', prompt: 'What are some tips for saving more money?' },
  { icon: TrendingUp, label: 'Improve stability', prompt: 'How can I improve my financial stability?' },
  { icon: Shield, label: 'Reduce stress', prompt: 'How do I reduce financial stress?' },
];

const mockResponses: Record<string, string> = {
  'What are some tips for saving more money?': 
    "Great question! Here are my top tips for building savings:\n\n1. **Pay yourself first** - Set aside savings before spending on anything else\n2. **Use the 50/30/20 rule** - 50% needs, 30% wants, 20% savings\n3. **Automate your savings** - Set up automatic transfers on payday\n4. **Track every expense** - Awareness is the first step to change\n5. **Cut one unnecessary expense** - Start small and build momentum",
  'How can I improve my financial stability?':
    "Your stability score reflects your overall financial health. Here's how to improve it:\n\n1. **Build an emergency fund** - Aim for 3-6 months of expenses\n2. **Pay down high-interest debt** - This frees up more money for savings\n3. **Diversify your allocations** - Don't put all eggs in one basket\n4. **Stay within recommended ranges** - Follow the budget guidelines\n5. **Plan for unexpected expenses** - Life always has surprises!",
  'How do I reduce financial stress?':
    "Financial stress is common, but manageable! Try these strategies:\n\n1. **Create a realistic budget** - One you can actually stick to\n2. **Focus on what you can control** - Small steps lead to big changes\n3. **Build a safety net** - Even small savings help peace of mind\n4. **Celebrate small wins** - Every good decision counts!\n5. **Learn from mistakes** - This simulation is for practice, after all",
};

export function AIAdvisor({ state }: AIAdvisorProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI Financial Advisor. 👋\n\nI see you're in Month ${state.month} with a stability index of ${state.stabilityIndex}%. I'm here to help you make smart financial decisions and learn good money habits.\n\nHow can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = mockResponses[content] || 
      `Based on your current situation (Month ${state.month}, ${state.stabilityIndex}% stability), here's my advice:\n\nKeep focusing on balanced allocations and building your savings. Remember, this is a learning simulation - every decision helps you practice real-world financial skills!\n\nWould you like specific tips on any category?`;

    const aiMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="animate-fade-in mb-4">
        <h1 className="text-2xl font-display font-bold gradient-text">AI Advisor</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your personal financial coach
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">AI Advisor</span>
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'glass-card rounded-tl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(prompt.prompt)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-sm whitespace-nowrap transition-colors"
          >
            <prompt.icon className="w-4 h-4 text-primary" />
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask me anything about budgeting..."
          className="flex-1 bg-secondary/50 border-border/50"
        />
        <Button
          variant="gradient"
          size="icon"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center mt-3">
        <Sparkles className="w-3 h-3 inline mr-1" />
        AI advice is for educational purposes only
      </p>
    </div>
  );
}
