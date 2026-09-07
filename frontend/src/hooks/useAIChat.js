import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { executeAgentAction } from '@/components/ai/agentActions';

/**
 * Custom hook encapsulating AI chat logic.
 *
 * Manages conversation state, communicates with the backend AI endpoint,
 * and executes validated navigation and registration actions.
 */

const API_URL = '/api/ai/chat';

// In development, proxy to the backend server
function getApiUrl() {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api/ai/chat';
  }
  return API_URL;
}

let messageIdCounter = 0;
function createMessage(role, content, registration = null) {
  return {
    id: `msg-${++messageIdCounter}-${Date.now()}`,
    role,
    content,
    registration,
    timestamp: Date.now(),
  };
}

export function useAIChat() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | thinking | executing | success | error
  const navigate = useNavigate();
  const abortRef = useRef(null);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || '').trim();
      if (!trimmed || status === 'thinking' || status === 'executing') return;

      // Add user message
      const userMsg = createMessage('user', trimmed);
      setMessages((prev) => [...prev, userMsg]);
      setStatus('thinking');

      try {
        // Cancel any in-flight request
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const response = await fetch(getApiUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed }),
          signal: controller.signal,
        });

        const data = await response.json();

        // Extract registration data if present
        const registrationData =
          data.action?.type === 'register' ? data.action.data : null;

        // Add assistant reply
        const assistantMsg = createMessage(
          'assistant',
          data.reply || "I couldn't process that request.",
          registrationData
        );
        setMessages((prev) => [...prev, assistantMsg]);

        // Execute action if present
        if (data.action) {
          setStatus('executing');

          const result = await executeAgentAction(data.action, navigate);

          if (result.success) {
            setStatus('success');
          } else {
            setStatus('success');
          }
        } else {
          setStatus('success');
        }

        // Reset to idle after a brief period
        setTimeout(() => setStatus('idle'), 2000);
      } catch (err) {
        if (err.name === 'AbortError') {
          setStatus('idle');
          return;
        }

        console.error('AI chat error:', err);

        const errorMsg = createMessage(
          'assistant',
          'GDGC AI is temporarily unavailable. Please use the navigation menu.'
        );
        setMessages((prev) => [...prev, errorMsg]);
        setStatus('error');

        setTimeout(() => setStatus('idle'), 3000);
      }
    },
    [navigate, status]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStatus('idle');
  }, []);

  return { messages, status, sendMessage, clearMessages };
}
