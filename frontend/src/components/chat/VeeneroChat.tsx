// frontend/src/components/chat/VeeneroChat.tsx
// Root floating chat assistant. Lazy-loaded — zero impact on initial bundle.

import React, { useState, useCallback } from 'react';
import { ChatBubble } from './ChatBubble';
import { ChatWindow } from './ChatWindow';
import { useChat } from '@/hooks/useChat';

export const VeeneroChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, isRateLimited, sendMessage, clearChat, messagesEndRef } = useChat();

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <ChatWindow
        isOpen={isOpen}
        onClose={handleClose}
        messages={messages}
        isLoading={isLoading}
        isRateLimited={isRateLimited}
        onSend={sendMessage}
        onClear={clearChat}
        messagesEndRef={messagesEndRef}
      />
      <ChatBubble isOpen={isOpen} onClick={handleToggle} />
    </>
  );
};

export default VeeneroChat;
