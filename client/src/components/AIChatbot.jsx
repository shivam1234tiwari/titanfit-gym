
import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  X,
  Trash2,
  LoaderCircle,
  User,
  Sparkles,
  MessageCircle,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://titanfit-gym.onrender.com"
).replace(/\/$/, "");

const INITIAL_MESSAGE = {
  sender: "bot",
  text: "Hey! 👋 I'm your TitanFit AI fitness assistant. Ask me about workouts, nutrition, recovery, or your fitness goals.",
  timestamp: new Date().toISOString(),
};

const SUGGESTIONS = [
  "Create a workout plan",
  "Suggest a healthy diet",
  "How can I build muscle?",
  "Tips for weight loss",
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const getToken = () => {
    // Match the key used by your TitanFit login flow.
    return localStorage.getItem("titanfit_token");
  };

  const sendMessage = async (messageText, previousMessages = messages) => {
    const text = messageText.trim();

    if (!text || loading) return;

    const token = getToken();

    if (!token) {
      setError("Your login session is missing. Please log in again.");
      return;
    }

    setError("");
    setInput("");

    const userMessage = {
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    // Only send earlier conversation messages as history.
    const history = previousMessages
      .filter((message) => message.text && message.text.trim())
      .map((message) => ({
        role: message.sender === "user" ? "user" : "assistant",
        content: message.text,
      }));

    // Remove the initial greeting from the AI conversation history.
    const chatHistory = history.filter(
      (message, index) =>
        !(index === 0 && message.role === "assistant")
    );

    setMessages((current) => [...current, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
        }),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          data.message ||
            "Your session is invalid or expired. Please log in again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `AI request failed (${response.status}).`
        );
      }

      const reply = data.reply || data.message;

      if (!data.success || typeof reply !== "string" || !reply.trim()) {
        throw new Error("The AI returned an empty response. Please retry.");
      }

      setMessages((current) => [
        ...current,
        {
          sender: "bot",
          text: reply.trim(),
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("TitanFit AI chatbot error:", err);

      setError(
        err.message ||
          "Unable to connect to the AI assistant. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleClearChat = () => {
    if (loading) return;

    setMessages([
      {
        ...INITIAL_MESSAGE,
        timestamp: new Date().toISOString(),
      },
    ]);
    setError("");
    setInput("");
  };

  const handleRetry = () => {
    if (loading || messages.length < 2) return;

    const lastUserIndex = messages
      .map((message) => message.sender)
      .lastIndexOf("user");

    if (lastUserIndex === -1) return;

    const lastUserMessage = messages[lastUserIndex];

    // Remove the failed user message before resending it.
    const previousMessages = messages.slice(0, lastUserIndex);

    setMessages(previousMessages);
    sendMessage(lastUserMessage.text, previousMessages);
  };

  return (
    <>
      {/* Floating chatbot button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open TitanFit AI assistant"
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-lime-400 text-black shadow-xl transition hover:scale-105 hover:bg-lime-300"
        >
          <MessageCircle size={29} />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            AI
          </span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <section
          aria-label="TitanFit AI chatbot"
          className="fixed bottom-4 right-4 z-50 flex h-[min(680px,85vh)] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 text-white shadow-2xl"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-black">
                <Bot size={25} />
              </div>

              <div>
                <h2 className="font-bold">TitanFit AI</h2>
                <p className="flex items-center gap-1 text-xs text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Fitness assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                disabled={loading}
                title="Clear chat"
                aria-label="Clear chat"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white disabled:opacity-40"
              >
                <Trash2 size={18} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
              >
                <X size={21} />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message, index) => {
              const isUser = message.sender === "user";

              return (
                <div
                  key={`${message.timestamp}-${index}`}
                  className={`flex items-start gap-2 ${
                    isUser ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isUser
                        ? "bg-gray-700 text-white"
                        : "bg-lime-400 text-black"
                    }`}
                  >
                    {isUser ? <User size={17} /> : <Bot size={18} />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl px-3 py-2.5 ${
                      isUser
                        ? "rounded-tr-sm bg-lime-400 text-black"
                        : "rounded-tl-sm bg-gray-800 text-gray-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                      {message.text}
                    </p>

                    <p
                      className={`mt-1 text-[10px] ${
                        isUser ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-black">
                  <Bot size={18} />
                </div>

                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-gray-800 px-4 py-3 text-sm text-gray-300">
                  <LoaderCircle size={16} className="animate-spin" />
                  TitanFit AI is thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts */}
          {messages.length === 1 && !loading && (
            <div className="px-4 pb-3">
              <p className="mb-2 flex items-center gap-1 text-xs text-gray-400">
                <Sparkles size={13} />
                Try asking
              </p>

              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-full border border-gray-700 px-3 py-2 text-xs text-gray-200 transition hover:border-lime-400 hover:text-lime-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error and retry */}
          {error && (
            <div
              role="alert"
              className="mx-4 mb-3 rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-200"
            >
              <p>{error}</p>

              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={loading || !messages.some(
                    (message) => message.sender === "user"
                  )}
                  className="flex items-center gap-1 font-semibold underline disabled:opacity-40"
                >
                  <RefreshCw size={14} />
                  Retry last message
                </button>

                {(error.toLowerCase().includes("log in") ||
                  error.toLowerCase().includes("session") ||
                  error.toLowerCase().includes("token")) && (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/login";
                    }}
                    className="font-semibold underline"
                  >
                    Go to login
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-800 bg-gray-900 p-3"
          >
            <div className="flex items-end gap-2 rounded-xl border border-gray-700 bg-gray-950 p-2 focus-within:border-lime-400">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    handleSubmit(event);
                  }
                }}
                placeholder="Ask about fitness, workouts, diet..."
                aria-label="Your message"
                rows={1}
                maxLength={2000}
                disabled={loading}
                className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-gray-500 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lime-400 text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <LoaderCircle size={19} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-gray-500">
              AI-generated fitness guidance. Use your own judgment and consult
              a qualified professional when needed.
            </p>
          </form>
        </section>
      )}
    </>
  );
}
