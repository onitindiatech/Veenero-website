// frontend/src/components/chat/ChatBubble.tsx
import React, { useState } from 'react';

interface ChatBubbleProps {
  isOpen: boolean;
  onClick: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ isOpen, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2.5 select-none">
      {/* Humanized Concierge Greeting Pill */}
      {!isOpen && (
        <div
          onClick={onClick}
          className={`cursor-pointer transition-all duration-300 transform ${
            showTooltip ? 'opacity-100 translate-y-0 scale-100' : 'opacity-90 hover:opacity-100 translate-y-0'
          }`}
        >
          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg border border-teal-400/30 backdrop-blur-md bg-slate-900/90 text-white text-xs font-medium tracking-wide hover:border-teal-300/60 hover:shadow-teal-500/20 transition-all duration-200 group"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-slate-200 group-hover:text-white transition-colors">
              Ask Veenero Guide
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-teal-400 group-hover:translate-x-0.5 transition-transform"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      )}

      {/* Ripple water caustics aura when closed */}
      {!isOpen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="chat-ripple-ring" />
          <div className="chat-ripple-ring chat-ripple-ring--delay" />
        </div>
      )}

      {/* Main interactive water-intelligence orb */}
      <button
        id="veenero-chat-bubble"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={isOpen ? 'Close Veenero Guide' : 'Open Veenero Guide'}
        aria-expanded={isOpen}
        aria-controls="veenero-chat-window"
        className="group relative w-14 h-14 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 transition-all duration-300 ease-out hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, hsl(185 70% 25%) 0%, hsl(195 65% 32%) 50%, hsl(205 75% 20%) 100%)',
          boxShadow: '0 8px 32px rgba(13, 148, 136, 0.45), 0 0 0 1px rgba(94, 234, 212, 0.35) inset',
        }}
      >
        {/* Soft internal gradient shine */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/10 to-teal-200/25 pointer-events-none" />

        {isOpen ? (
          // Elegant close X
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white group-hover:rotate-90 transition-transform duration-300"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // Modern fluid droplet with sparkling intelligence star
          <div className="relative flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            >
              {/* Organic water droplet */}
              <path
                d="M12 2.5C12 2.5 5.5 10 5.5 14.5C5.5 18.09 8.41 21 12 21C15.59 21 18.5 18.09 18.5 14.5C18.5 10 12 2.5 12 2.5Z"
                fill="url(#dropletGradient)"
                stroke="rgba(255, 255, 255, 0.85)"
                strokeWidth="1.2"
              />
              {/* Inner fluid curve */}
              <path
                d="M9 14.5C9 16.16 10.34 17.5 12 17.5"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.9"
              />
              {/* Small intelligence sparkle */}
              <circle cx="15.5" cy="11.5" r="1.2" fill="white" />
              <defs>
                <linearGradient id="dropletGradient" x1="12" y1="2.5" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="1" stopColor="rgba(153,246,228,0.85)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* Live active indicator badge */}
        {!isOpen && (
          <span
            className="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 bg-emerald-400 chat-pulse-dot"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
};

export default ChatBubble;
