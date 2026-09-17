// frontend/src/hooks/useChat.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { sendAiMessage, ChatMessage, ChatAction } from '@/services/ai.service';

export interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  actions?: ChatAction[];
  timestamp: number;
}

interface UseChatReturn {
  messages: DisplayMessage[];
  isLoading: boolean;
  error: string | null;
  isRateLimited: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

let messageIdCounter = 0;
const genId = () => `msg-${++messageIdCounter}-${Date.now()}`;

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Build conversation history (only user/assistant messages, no error messages)
  const getHistory = useCallback((msgs: DisplayMessage[]): ChatMessage[] => {
    return msgs
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || isRateLimited) return;

    setError(null);

    const userMsg: DisplayMessage = {
      id: genId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages(prev => {
      const next = [...prev, userMsg];
      return next;
    });
    setIsLoading(true);

    try {
      // Get current history BEFORE adding user message (it's already in state above)
      // Pass conversation history for context
      const history = getHistory(messages); // messages before this user msg
      const result = await sendAiMessage(trimmed, history);

      const assistantMsg: DisplayMessage = {
        id: genId(),
        role: 'assistant',
        content: result.message,
        actions: result.actions,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      if (err.code === 'RATE_LIMIT') {
        setIsRateLimited(true);
        setTimeout(() => setIsRateLimited(false), 60_000);
        const rateLimitMsg: DisplayMessage = {
          id: genId(),
          role: 'error',
          content: "You've sent too many messages. Please wait a moment before trying again.",
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, rateLimitMsg]);
      } else {
        const errorMsg: DisplayMessage = {
          id: genId(),
          role: 'error',
          content: "I'm having trouble connecting right now. Please try again or use the button below.",
          actions: [{ label: 'Get in Touch', type: 'navigate', target: '/contact' }],
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, errorMsg]);
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isRateLimited, messages, getHistory]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsRateLimited(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    isRateLimited,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
}
