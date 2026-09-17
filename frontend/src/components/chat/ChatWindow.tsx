// frontend/src/components/chat/ChatWindow.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { DisplayMessage } from '@/hooks/useChat';

interface SuggestedPrompt {
  label: string;
  category: string;
  text: string;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { category: 'Solution', label: '💧 Aqua Saver & 3D Module', text: 'How does Aqua Saver work and what does it monitor?' },
  { category: 'Automation', label: '⚙️ Pumping Automation', text: 'Tell me about Water Pumping Automation and motor scheduling.' },
  { category: 'Detection', label: '🔍 Leak Identification', text: 'How does Veenero detect pipeline, tap, and tank leaks?' },
  { category: 'Company', label: '🏢 About & Mission', text: 'What is Veenero and what is your water conservation approach?' },
  { category: 'Contact', label: '✉️ Speak with an Expert', text: 'How can I contact Veenero or request a demo?' },
];

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: DisplayMessage[];
  isLoading: boolean;
  isRateLimited: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  isLoading,
  isRateLimited,
  onSend,
  onClear,
  messagesEndRef,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus close button when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const showSuggestions = messages.length === 0 && !isLoading;

  return (
    <div
      id="veenero-chat-window"
      ref={windowRef}
      role="dialog"
      aria-modal="false"
      aria-label="Veenero Guide"
      aria-hidden={!isOpen}
      className={`
        fixed z-[9998] transition-all duration-300 ease-out
        ${isOpen
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }
        bottom-24 right-6
        w-[calc(100vw-2rem)] sm:w-[410px] max-w-[430px]
        max-h-[calc(100dvh-7.5rem)] sm:max-h-[620px]
        h-[580px]
        flex flex-col
        rounded-3xl overflow-hidden
        border border-teal-500/20 dark:border-teal-400/15
        shadow-[0_24px_64px_-12px_rgba(13,148,136,0.22),0_12px_28px_-6px_rgba(15,23,42,0.18)]
      `}
      style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* ── Premium Oceanic Concierge Header ─────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-3.5 flex-shrink-0 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(185 75% 22%) 0%, hsl(195 65% 28%) 50%, hsl(205 70% 18%) 100%)',
          borderBottom: '1px solid rgba(94, 234, 212, 0.2)',
        }}
      >
        {/* Soft background ambient light */}
        <div className="absolute top-0 left-1/4 w-32 h-16 bg-teal-400/15 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          {/* Water intelligence icon orb */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center relative shadow-inner"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 100%)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
            aria-hidden="true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.5C12 2.5 5.5 10 5.5 14.5C5.5 18.09 8.41 21 12 21C15.59 21 18.5 18.09 18.5 14.5C18.5 10 12 2.5 12 2.5Z"
                fill="url(#headerDropGradient)"
              />
              <path d="M9 14.5C9 16.16 10.34 17.5 12 17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="headerDropGradient" x1="12" y1="2.5" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor="#99f6e4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Subtle live indicator */}
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-teal-950 chat-pulse-dot"
              aria-hidden="true"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2
                className="text-white font-semibold text-[15px] tracking-tight leading-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Veenero Guide
              </h2>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-teal-400/20 text-teal-200 border border-teal-400/25">
                Water Advisor
              </span>
            </div>
            <p
              className="text-teal-100/70 text-[11px] font-normal leading-none mt-1 flex items-center gap-1.5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Online · Verified Site Guide
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 relative z-10">
          {/* Restart / clear conversation */}
          {messages.length > 0 && (
            <button
              onClick={onClear}
              aria-label="Restart conversation"
              title="Restart conversation"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-teal-100/70 hover:text-white hover:bg-white/10 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </button>
          )}

          {/* Close button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close guide"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-teal-100/70 hover:text-white hover:bg-white/10 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Messages Stream ─────────────────────────────────────────────────── */}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
        onClose={onClose}
        onSuggestionClick={onSend}
      />

      {/* ── Quick Discovery Chips (shown when conversation is active) ───────── */}
      {!showSuggestions && messages.length > 0 && messages.length < 4 && (
        <div
          className="flex-shrink-0 px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-teal-900/20 bg-slate-50/70 dark:bg-slate-900/50"
          aria-label="Quick follow-ups"
        >
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex-shrink-0 mr-1">
            Quick:
          </span>
          {SUGGESTED_PROMPTS.slice(0, 3).map((prompt) => (
            <button
              key={prompt.text}
              onClick={() => onSend(prompt.text)}
              disabled={isLoading || isRateLimited}
              className="flex-shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full border border-teal-500/20 text-teal-700 dark:text-teal-300 bg-white/80 dark:bg-slate-800 hover:bg-teal-50 hover:border-teal-400/40 transition-all duration-150 focus:outline-none disabled:opacity-50"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Input Box ────────────────────────────────────────────────────────── */}
      <ChatInput
        onSend={onSend}
        isLoading={isLoading}
        isRateLimited={isRateLimited}
      />
    </div>
  );
};

export default ChatWindow;
