import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  User,
  Sparkles,
  Loader2,
  Trash2,
  Dumbbell,
  Utensils,
  Target,
  RotateCcw,
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const INITIAL_MESSAGE = {
  sender: 'bot',
  text: "Hey! I'm TITAN AI 💪 Your personal fitness assistant. Ask me about workouts, nutrition, muscle gain, fat loss, or recovery!",
  time: new Date().toISOString(),
};

const SUGGESTIONS = [
  { label: 'Build muscle', icon: Dumbbell },
  { label: 'Healthy diet', icon: Utensils },
  { label: 'Fat loss plan', icon: Target },
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const addMessage = (sender, text) => ({
    sender,
    text,
    time: new Date().toISOString(),
  });

  const handleSendMessage = async (e, suggestedText) => {
    e?.preventDefault();

    const userMessage = (suggestedText ?? input).trim();

    if (!userMessage || loading) return;

    setInput('');
    setError('');

    const userEntry = addMessage('user', userMessage);

    // Capture recent history before adding the current message.
    const history = [...messages, userEntry]
      .filter((msg) => msg.sender === 'user' || msg.sender === 'bot')
      .slice(-13)
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

    setMessages((prev) => [...prev, userEntry]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The backend should use history if it supports conversations.
        body: JSON.stringify({
          message: userMessage,
          history,
        }),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Server error (${response.status}). Please try again.`
        );
      }

      const reply =
        typeof data.reply === 'string' && data.reply.trim()
          ? data.reply.trim()
          : typeof data.message === 'string' && data.message.trim()
            ? data.message.trim()
            : '';

      if (!reply) {
        throw new Error(
          'TITAN AI returned an empty response. Please try again.'
        );
      }

      setMessages((prev) => [...prev, addMessage('bot', reply)]);
    } catch (err) {
      if (err.name === 'AbortError') return;

      setError(
        err.message ||
          'Unable to reach TITAN AI. Please check your connection and try again.'
      );
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (loading) return;

    setMessages([
      {
        ...INITIAL_MESSAGE,
        time: new Date().toISOString(),
      },
    ]);
    setError('');
    setInput('');
    inputRef.current?.focus();
  };

  const formatTime = (time) => {
    try {
      return new Date(time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 font-sans">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open TITAN AI assistant"
          className="group flex items-center gap-3 rounded-full border border-amber-300/40 bg-slate-950 p-2 pr-5 text-white shadow-2xl shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-slate-950 transition-transform group-hover:rotate-6">
            <Sparkles className="h-6 w-6" />
          </span>

          <span className="text-left">
            <span className="block text-sm font-extrabold tracking-wide">
              TITAN AI
            </span>
            <span className="block text-[11px] text-slate-400">
              Your fitness companion
            </span>
          </span>

          <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
        </button>
      )}

      {isOpen && (
        <section
          role="dialog"
          aria-label="TITAN AI fitness assistant"
          className="flex h-[min(650px,80dvh)] w-[calc(100vw-2.5rem)] max-w-[410px] flex-col overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-400">
                <Bot className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-extrabold text-white">
                  TITAN AI Assistant
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Fitness support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                disabled={loading}
                title="Clear conversation"
                aria-label="Clear conversation"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-amber-400 disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div
            className="flex-1 space-y-4 overflow-y-auto bg-slate-950 p-4"
            aria-live="polite"
            aria-relevant="additions"
          >
            <div className="mb-5 rounded-2xl border border-amber-400/10 bg-gradient-to-br from-amber-400/10 to-transparent p-3">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sparkles className="h-4 w-4" />
                YOUR FITNESS PARTNER
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Get workout ideas, nutrition tips, and practical fitness
                guidance tailored to your goals.
              </p>
            </div>

            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={`${msg.time}-${index}`}
                  className={`flex items-start gap-2.5 ${
                    isUser ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      isUser
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    {isUser ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  <div
                    className={`flex max-w-[82%] flex-col ${
                      isUser ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`whitespace-pre-wrap break-words rounded-2xl px-3.5 py-3 text-xs leading-relaxed ${
                        isUser
                          ? 'rounded-tr-sm bg-amber-400 font-medium text-slate-950'
                          : 'rounded-tl-sm border border-slate-800 bg-slate-900 text-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <span className="mt-1 px-1 text-[9px] text-slate-600">
                      {formatTime(msg.time)}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                  <Bot className="h-4 w-4" />
                </div>

                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-800 bg-slate-900 px-4 py-3">
                  <span className="text-xs text-slate-400">
                    TITAN AI is thinking
                  </span>
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                </div>
              </div>
            )}

            {error && (
              <div className="ml-10 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                <p className="text-xs leading-relaxed text-red-300">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => handleSendMessage(null, messages.filter((m) => m.sender === 'user').at(-1)?.text)}
                  disabled={loading || !messages.some((m) => m.sender === 'user')}
                  className="mt-2 flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 disabled:opacity-40"
                >
                  <RotateCcw className="h-3 w-3" />
                  Try again
                </button>
              </div>
            )}

            {/* Suggested prompts appear before the conversation begins */}
            {messages.length === 1 && !loading && (
              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Try asking
                </p>

                {SUGGESTIONS.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSendMessage(null, label)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-left text-xs font-medium text-slate-300 transition hover:border-amber-400/40 hover:bg-slate-900 hover:text-amber-300"
                  >
                    <Icon className="h-4 w-4 text-amber-400" />
                    {label}
                    <Send className="ml-auto h-3.5 w-3.5 opacity-50" />
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-slate-800 bg-slate-900 p-3"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 p-1.5 transition focus-within:border-amber-400/70">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about workouts or nutrition..."
                maxLength={2000}
                aria-label="Message TITAN AI"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-xs text-white outline-none placeholder:text-slate-600"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>

            <p className="mt-2 text-center text-[9px] text-slate-600">
              Fitness guidance only · Not a substitute for medical advice
            </p>
          </form>
        </section>
      )}
    </div>
  );
}