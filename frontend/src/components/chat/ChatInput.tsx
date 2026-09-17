// frontend/src/components/chat/ChatInput.tsx
import React, { useRef, useEffect, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  isRateLimited: boolean;
  disabled?: boolean;
}

const MAX_LENGTH = 1000;

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  isRateLimited,
  disabled,
}) => {
  const [value, setValueState] = React.useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea smoothly
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 110)}px`;
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || isRateLimited || disabled) return;
    onSend(trimmed);
    setValueState('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOverLimit = value.length > MAX_LENGTH;
  const canSend = value.trim().length > 0 && !isLoading && !isRateLimited && !disabled && !isOverLimit;

  const placeholder = isRateLimited
    ? 'Please wait a moment before sending...'
    : isLoading
    ? 'Veenero Guide is responding...'
    : 'Ask about our water solutions, tech, or impact...';

  return (
    <div
      className="border-t border-slate-200/80 dark:border-teal-900/30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-3 select-none"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div
        className={`flex items-end gap-2 rounded-2xl border transition-all duration-200 px-3 py-1.5 ${
          isOverLimit
            ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20'
            : 'border-slate-200 dark:border-teal-800/40 bg-slate-50/70 dark:bg-slate-950/50 focus-within:border-teal-500/60 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-[0_0_0_3px_rgba(20,184,166,0.12)]'
        }`}
      >
        <textarea
          ref={textareaRef}
          id="veenero-chat-input"
          value={value}
          onChange={(e) => setValueState(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading || isRateLimited || disabled}
          rows={1}
          maxLength={MAX_LENGTH + 50}
          aria-label="Message Veenero Guide"
          className="flex-1 resize-none bg-transparent py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none min-h-[38px] max-h-[110px] leading-relaxed disabled:opacity-60"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send inquiry"
          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
            canSend
              ? 'bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-md hover:scale-105 active:scale-95 shadow-teal-500/25'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
          }`}
        >
          {isLoading ? (
            <svg
              className="w-4 h-4 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={canSend ? 'translate-x-0.5 -translate-y-0.5' : ''}
              aria-hidden="true"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between px-1 pt-2">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
          Veenero Water Intelligence
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          Enter to send · Shift+Enter for new line
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
