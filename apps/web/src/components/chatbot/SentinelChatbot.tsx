"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  ArrowUpRight, 
  ShieldAlert, 
  Layers, 
  HelpCircle,
  MessageSquare,
  ChevronRight,
  Terminal
} from "lucide-react";

interface QuickLink {
  label: string;
  href: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  quickLinks?: QuickLink[];
  timestamp: string;
}

const STARTER_PROMPTS = [
  { icon: Sparkles, text: "How to run an API scan?" },
  { icon: ShieldAlert, text: "What is BOLA / IDOR flaw?" },
  { icon: Layers, text: "Where is the Demo Sandbox?" },
  { icon: HelpCircle, text: "Give me a tour of all pages" },
];

export function SentinelChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: `👋 **Welcome to SentinelAPI!** I'm your AI Security Copilot. 

Ask me anything about how to scan your APIs, find vulnerabilities like **BOLA/IDOR**, test the **Demo Sandbox**, or navigate around the platform!`,
      quickLinks: [
        { label: "🚀 Start New Scan", href: "/scan/new" },
        { label: "📊 Go to Dashboard", href: "/dashboard" },
        { label: "🛡️ View Findings", href: "/dashboard/findings" }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I'm sorry, I couldn't process that. Please try again.",
        quickLinks: data.quickLinks || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: "assistant",
          content: "⚠️ **Connection issue.** Could not reach the chatbot service. Please try again shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: "🧹 Chat cleared! How can I assist you with SentinelAPI today?",
        quickLinks: [
          { label: "🚀 Start New Scan", href: "/scan/new" },
          { label: "📊 Go to Dashboard", href: "/dashboard" }
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const formatContent = (text: string) => {
    // Process markdown-like lines, bolding, and code
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Bold handling
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-orange-300 font-semibold">$1</strong>');
      // Inline code
      formattedLine = formattedLine.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/50 text-orange-400 font-mono text-xs border border-orange-500/20">$1</code>');
      // Markdown link [text](url)
      formattedLine = formattedLine.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-orange-400 hover:text-orange-300 underline underline-offset-2">$1</a>');

      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} />
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="ml-3 my-1 text-slate-300 flex items-start gap-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-slate-200 leading-relaxed my-1" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e0e07]/90 border border-orange-500/30 text-xs text-orange-300 backdrop-blur-md shadow-lg shadow-black/60 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Need help? Ask AI Copilot</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 text-white shadow-xl shadow-orange-950/60 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-orange-400/40"
          >
            <Bot className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border-2 border-[#120703]"></span>
            </span>
          </button>
        </div>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-[#140a06]/95 border border-orange-500/30 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden ${
            isExpanded
              ? "inset-4 md:inset-10 w-auto h-auto max-w-4xl mx-auto"
              : "bottom-6 right-6 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-orange-950/80 via-[#1c0d06] to-[#140a06] border-b border-orange-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-orange-100 font-sans">Sentinel AI Copilot</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ONLINE</span>
                </div>
                <p className="text-[11px] text-orange-400/70">Interactive Website Guide & AST Scanner</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-1.5 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="p-1.5 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Banner */}
          <div className="px-3 py-2 bg-black/40 border-b border-orange-500/10 overflow-x-auto flex gap-1.5 scrollbar-none">
            {STARTER_PROMPTS.map((prompt, i) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt.text)}
                  disabled={loading}
                  className="whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-orange-950/40 hover:bg-orange-500/20 border border-orange-500/20 text-orange-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-orange-400" />
                  <span>{prompt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-orange-600/30 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-none shadow-md shadow-orange-950/40"
                      : "bg-[#1f110a]/90 border border-orange-500/20 text-slate-200 rounded-bl-none shadow-lg shadow-black/40"
                  }`}
                >
                  <div className="text-xs sm:text-[13px]">
                    {formatContent(msg.content)}
                  </div>

                  {/* Quick Action Navigation Buttons */}
                  {msg.quickLinks && msg.quickLinks.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-orange-500/20 flex flex-wrap gap-1.5">
                      {msg.quickLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-200 hover:text-white transition-all shadow-sm group"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="w-3 h-3 text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-right mt-1.5 opacity-50 font-mono">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-lg bg-orange-600/30 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-[#1f110a] border border-orange-500/20 rounded-2xl p-3 rounded-bl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#110703] border-t border-orange-500/20 flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about SentinelAPI or security..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-black/60 border border-orange-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/50 transition-all font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-orange-950/60 active:scale-95 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
