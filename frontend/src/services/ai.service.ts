// frontend/src/services/ai.service.ts
// Thin client for the Veenero AI chat endpoint.
// The AI API key is NEVER in this file — it lives in backend/.env only.

import { API_BASE_URL } from '@/config/api';

const AI_ENDPOINT = `${API_BASE_URL}/api/ai/chat`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface ChatAction {
  label: string;
  type: 'navigate';
  target: string;
}

export interface AiChatResult {
  message: string;
  actions: ChatAction[];
}

export async function sendAiMessage(
  message: string,
  conversation: ChatMessage[]
): Promise<AiChatResult> {
  // Strip timestamps before sending (backend doesn't need them)
  const historyForApi = conversation.map(({ role, content }) => ({ role, content }));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  // If running locally but AI_ENDPOINT points to a remote server (e.g. Render without the AI route),
  // candidateEndpoints will try the configured endpoint first, then http://localhost:4000
  const isLocalClient = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const candidateEndpoints = [AI_ENDPOINT];
  if (isLocalClient && !AI_ENDPOINT.includes('localhost:4000')) {
    candidateEndpoints.push('http://localhost:4000/api/ai/chat');
  }

  let lastError: any = null;

  for (const endpoint of candidateEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ message, conversation: historyForApi }),
      });

      if (res.status === 404 && endpoint !== candidateEndpoints[candidateEndpoints.length - 1]) {
        // Remote server does not have the route — fallback to local
        continue;
      }

      clearTimeout(timeout);

      const json = await res.json().catch(() => ({}));

      if (res.status === 429) {
        throw Object.assign(new Error('RATE_LIMIT'), { code: 'RATE_LIMIT' });
      }

      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || 'Request failed');
      }

      return {
        message: json.data?.message || "I couldn't process that. Please try again.",
        actions: json.data?.actions || [],
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        clearTimeout(timeout);
        throw Object.assign(new Error('Request timed out. Please try again.'), { code: 'TIMEOUT' });
      }
      if (err.code === 'RATE_LIMIT') {
        clearTimeout(timeout);
        throw err;
      }
      lastError = err;
      // If there are more endpoints to try, continue
      if (endpoint !== candidateEndpoints[candidateEndpoints.length - 1]) {
        continue;
      }
    }
  }

  clearTimeout(timeout);
  throw lastError || new Error('Unable to connect to the AI assistant');
}
