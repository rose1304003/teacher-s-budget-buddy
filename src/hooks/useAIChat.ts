import { useState, useCallback } from 'react';
import { UserState } from '@/types/budget';
import { Language } from '@/i18n/translations';

// Support both Supabase Edge Function and Python API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const API_URL = import.meta.env.VITE_API_URL;
const CHAT_URL = API_URL 
  ? `${API_URL}/api/financial-advisor`
  : SUPABASE_URL
  ? `${SUPABASE_URL}/functions/v1/financial-advisor`
  : '/api/financial-advisor'; // Fallback

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useAIChat(userState: UserState, language: Language) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = "";
    
    const upsertAssistant = (nextChunk: string) => {
      assistantContent += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: assistantContent,
          timestamp: new Date()
        }];
      });
    };

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      // Only add Supabase auth header if using Supabase
      if (SUPABASE_URL && !API_URL) {
        headers.Authorization = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;
      }
      
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: content,
          language,
          userState: {
            month: userState.month,
            virtualIncome: userState.virtualIncome,
            currentBalance: userState.currentBalance,
            savings: userState.savings,
            debt: userState.debt,
            stabilityIndex: userState.stabilityIndex,
            stressLevel: userState.stressLevel,
          },
        }),
      });

      if (!resp.ok || !resp.body) {
        const errorData = await resp.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Request failed with status ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const contentChunk = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (contentChunk) upsertAssistant(contentChunk);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const contentChunk = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (contentChunk) upsertAssistant(contentChunk);
          } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get response";
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: language === 'ru' 
            ? `Извините, произошла ошибка: ${errorMessage}. Пожалуйста, попробуйте снова.`
            : language === 'uz'
            ? `Kechirasiz, xatolik yuz berdi: ${errorMessage}. Iltimos, qayta urinib ko'ring.`
            : `Sorry, an error occurred: ${errorMessage}. Please try again.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [userState, language, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}
