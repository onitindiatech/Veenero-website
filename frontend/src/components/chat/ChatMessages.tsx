// frontend/src/components/chat/ChatMessages.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DisplayMessage } from '@/hooks/useChat';

interface ChatMessagesProps {
  messages: DisplayMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
  onSuggestionClick?: (text: string) => void;
}

const formatTime = (ts: number): string => {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ─── Typing Indicator with Fluid Water Animation ──────────────────────────────
const TypingIndicator: React.FC = () => (
  <div className="flex items-end gap-2.5 mb-4 animate-fade-in">
    {/* Concierge Avatar */}
    <div
      className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm"
      style={{
        background: 'linear-gradient(135deg, hsl(185 70% 25%) 0%, hsl(195 65% 32%) 100%)',
        border: '1px solid rgba(94, 234, 212, 0.4)',
      }}
      aria-hidden="true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 2.5C12 2.5 5.5 10 5.5 14.5C5.5 18.09 8.41 21 12 21C15.59 21 18.5 18.09 18.5 14.5C18.5 10 12 2.5 12 2.5Z" fill="#ffffff" />
      </svg>
    </div>

    <div
      className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 border border-teal-500/15 shadow-sm"
      role="status"
      aria-label="Veenero Guide is preparing an answer"
    >
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">
        Searching water insights
      </span>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-2.5 rounded-full chat-typing-drop"
            style={{
              background: `hsl(185 70% ${28 + i * 10}%)`,
              animationDelay: `${i * 0.18}s`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  </div>
);

// ─── Welcome / Empty State Screen ─────────────────────────────────────────────
interface WelcomeHeroProps {
  onSelect: (text: string) => void;
}

const WELCOME_TOPICS = [
  {
    icon: '💧',
    title: 'Aqua Saver Device',
    desc: 'Water conservation hardware & 3D module',
    prompt: 'What is Aqua Saver and how does it work?',
  },
  {
    icon: '⚙️',
    title: 'Pumping Automation',
    desc: 'Motor scheduling & tank protection',
    prompt: 'Tell me about Water Pumping Automation.',
  },
  {
    icon: '🔍',
    title: 'Leak Identification',
    desc: 'Pipeline, tap, seepage & tank monitoring',
    prompt: 'How does Veenero identify and report leaks?',
  },
  {
    icon: '🌱',
    title: 'Approach & Mission',
    desc: 'Conservation roadmap & sustainability',
    prompt: 'What is Veenero and your water approach?',
  },
  {
    icon: '📞',
    title: 'Speak with an Expert',
    desc: 'Contact details, pilots & consultations',
    prompt: 'How can I contact Veenero or request a demo?',
  },
];

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onSelect }) => (
  <div className="flex flex-col py-3 px-1">
    {/* Welcome Card */}
    <div className="relative rounded-2xl p-4 mb-4 overflow-hidden bg-gradient-to-br from-teal-900/10 via-cyan-900/5 to-transparent border border-teal-500/20">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2.5C12 2.5 5.5 10 5.5 14.5C5.5 18.09 8.41 21 12 21C15.59 21 18.5 18.09 18.5 14.5C18.5 10 12 2.5 12 2.5Z" fill="white" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
            Welcome to Veenero
          </h3>
          <p className="text-[11px] text-teal-700 dark:text-teal-300 font-medium">
            Sustainable Water Intelligence
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        I’m here to help you explore our water conservation technologies, understand our hardware solutions, or guide you directly to our engineering team.
      </p>
    </div>

    {/* Topic Cards */}
    <div className="space-y-1.5">
      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 px-1 mb-2">
        Explore Popular Topics
      </p>
      {WELCOME_TOPICS.map((topic, i) => (
        <button
          key={i}
          onClick={() => onSelect(topic.prompt)}
          className="w-full text-left p-2.5 rounded-xl border border-slate-200/80 dark:border-teal-950 bg-white/90 dark:bg-slate-900/70 hover:bg-teal-50/70 dark:hover:bg-teal-950/40 hover:border-teal-400/40 hover:shadow-sm transition-all duration-150 flex items-center gap-3 group"
        >
          <span className="text-base flex-shrink-0 w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center group-hover:scale-110 transition-transform">
            {topic.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors truncate">
              {topic.title}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {topic.desc}
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all flex-shrink-0"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      ))}
    </div>
  </div>
);

// ─── Individual Message Bubble ────────────────────────────────────────────────
interface MessageBubbleProps {
  msg: DisplayMessage;
  onClose: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ msg, onClose }) => {
  const navigate = useNavigate();

  const isUser = msg.role === 'user';
  const isError = msg.role === 'error';

  const handleAction = (target: string) => {
    onClose();
    navigate(target);
  };

  return (
    <div
      className={`flex items-end gap-2.5 mb-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar — only for guide / error */}
      {!isUser && (
        <div
          className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm"
          style={{
            background: isError
              ? 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(24 95% 45%) 100%)'
              : 'linear-gradient(135deg, hsl(185 70% 25%) 0%, hsl(195 65% 32%) 100%)',
            border: isError
              ? '1px solid rgba(245, 158, 11, 0.4)'
              : '1px solid rgba(94, 234, 212, 0.35)',
          }}
          aria-hidden="true"
        >
          {isError ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.5C12 2.5 5.5 10 5.5 14.5C5.5 18.09 8.41 21 12 21C15.59 21 18.5 18.09 18.5 14.5C18.5 10 12 2.5 12 2.5Z" fill="#ffffff" />
            </svg>
          )}
        </div>
      )}

      <div className={`flex flex-col gap-1.5 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`px-4 py-3 text-sm leading-relaxed rounded-2xl shadow-sm ${
            isUser
              ? 'rounded-br-sm text-white'
              : isError
              ? 'rounded-bl-sm bg-amber-50/90 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 border border-amber-300/40'
              : 'rounded-bl-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-teal-900/40'
          }`}
          style={{
            fontFamily: 'Inter, sans-serif',
            ...(isUser
              ? {
                  background: 'linear-gradient(135deg, hsl(185 75% 26%) 0%, hsl(195 70% 32%) 100%)',
                }
              : {}),
          }}
          aria-live={!isUser ? 'polite' : undefined}
        >
          {msg.content}
        </div>

        {/* Navigation Action Buttons (chips) */}
        {msg.actions && msg.actions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {msg.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleAction(action.target)}
                className="group inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-50/80 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 hover:bg-teal-100/90 dark:hover:bg-teal-900/60 hover:border-teal-400 hover:shadow-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span>{action.label}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-0.5 transition-transform text-teal-600 dark:text-teal-400"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1 select-none" aria-hidden="true">
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  );
};

// ─── Main Messages Container ──────────────────────────────────────────────────
export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  messagesEndRef,
  onClose,
  onSuggestionClick,
}) => {
  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 space-y-0 scroll-smooth"
      role="log"
      aria-label="Conversation with Veenero Guide"
      aria-live="polite"
      style={{
        background: 'linear-gradient(180deg, hsl(200 25% 98%) 0%, hsl(195 30% 96%) 100%)',
        minHeight: 0,
      }}
    >
      {messages.length === 0 && !isLoading && onSuggestionClick && (
        <WelcomeHero onSelect={onSuggestionClick} />
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} onClose={onClose} />
      ))}

      {isLoading && <TypingIndicator />}

      <div ref={messagesEndRef} aria-hidden="true" />
    </div>
  );
};

export default ChatMessages;
