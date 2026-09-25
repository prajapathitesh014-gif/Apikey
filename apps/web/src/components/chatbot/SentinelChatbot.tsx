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
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Code2,
  Flame,
  Zap,
  Activity,
  Server,
  ArrowRight,
  Mic,
  MicOff,
  Radio
} from "lucide-react";
import { toast } from "sonner";
import { BrandIcon } from "@/components/ui/BrandLogo";

interface FollowUpPrompt {
  label: string;
  query: string;
}

interface QuickLink {
  label: string;
  href: string;
}

interface CodeSnippet {
  language: string;
  code: string;
  description: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  codeSnippet?: CodeSnippet;
  followUps?: FollowUpPrompt[];
  quickLinks?: QuickLink[];
  timestamp: string;
  feedback?: "up" | "down";
}

const CATEGORIES = [
  { id: "all", label: "🌟 All Topics" },
  { id: "scan", label: "🚀 Scanning" },
  { id: "vuln", label: "🛡️ OWASP Flaws" },
  { id: "code", label: "🛠️ Fixes" },
  { id: "sandbox", label: "🧪 Sandbox" },
  { id: "tour", label: "🗺️ Platform Tour" }
];

const PRESET_QUESTIONS = [
  { category: "scan", text: "How to run an AST API scan?", icon: Zap },
  { category: "vuln", text: "Explain BOLA / IDOR vulnerability", icon: ShieldAlert },
  { category: "vuln", text: "What is Mass Assignment flaw?", icon: Flame },
  { category: "code", text: "How to fix Rate Limiting issues?", icon: Code2 },
  { category: "sandbox", text: "Where is the demo sandbox?", icon: Server },
  { category: "tour", text: "Give me a tour of all pages", icon: HelpCircle },
  { category: "scan", text: "How to export security reports?", icon: Activity },
];

export function SentinelChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: `👋 **Welcome to SecureMind AST Copilot!** 

I am your interactive AI security assistant. You can type or click the **Mic 🎙️** to speak your questions about API security, **BOLA/IDOR**, sandbox tests, or code remediation!`,
      followUps: [
        { label: "🚀 How to run an API scan?", query: "How to run an API scan?" },
        { label: "🛡️ What is BOLA/IDOR?", query: "Explain BOLA vulnerability" },
        { label: "🧪 Where is the demo sandbox?", query: "Where is the demo sandbox?" },
        { label: "🗺️ Tour of all pages", query: "Give me a tour of all pages" }
      ],
      quickLinks: [
        { label: "🚀 Launch Scan", href: "/scan/new" },
        { label: "📊 Go to Dashboard", href: "/dashboard" },
        { label: "🛡️ View Findings", href: "/dashboard/findings" }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(transcript);
            handleSendMessage(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
          toast.error("Voice input error or permission denied.");
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Voice recognition not supported in this browser. Please use Chrome/Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info("🎙️ Listening... Speak your question now!");
      } catch (e) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  // Play subtle synth audio blip
  const playBeep = (freq = 600, type: OscillatorType = "sine", duration = 0.08) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Keyboard shortcut Ctrl+K / Cmd+K to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    playBeep(480, "triangle", 0.06);

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

      playBeep(720, "sine", 0.1);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I couldn't find specific information for that query. Please select one of the suggested topics below.",
        codeSnippet: data.codeSnippet,
        followUps: data.followUps || [],
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

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (messageId: string, type: "up" | "down") => {
    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, feedback: type } : m))
    );
    toast.success(type === "up" ? "Thanks for your feedback! 👍" : "Feedback noted. We're improving! 🛠️");
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: "🧹 Chat cleared! What would you like to explore next?",
        followUps: [
          { label: "🚀 How to run an API scan?", query: "How to run an API scan?" },
          { label: "🛡️ What is BOLA/IDOR?", query: "Explain BOLA vulnerability" },
          { label: "🧪 Where is the demo sandbox?", query: "Where is the demo sandbox?" }
        ],
        quickLinks: [
          { label: "🚀 Start New Scan", href: "/scan/new" },
          { label: "📊 Go to Dashboard", href: "/dashboard" }
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const filteredQuestions = activeCategory === "all"
    ? PRESET_QUESTIONS
    : PRESET_QUESTIONS.filter(q => q.category === activeCategory);

  const formatContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-orange-300 font-semibold">$1</strong>');
      formattedLine = formattedLine.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/60 text-orange-300 font-mono text-[11px] sm:text-xs border border-orange-500/20">$1</code>');
      formattedLine = formattedLine.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-orange-400 hover:text-orange-200 underline underline-offset-2 font-medium">$1</a>');

      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-orange-200 font-bold text-xs sm:text-sm mt-2.5 mb-1 flex items-center gap-1.5" dangerouslySetInnerHTML={{ __html: formattedLine.substring(4) }} />
        );
      }
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-3.5 list-disc text-slate-300 my-0.5 leading-relaxed text-[12px] sm:text-xs" dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} />
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="ml-2 my-0.5 text-slate-300 flex items-start gap-1 leading-relaxed text-[12px] sm:text-xs" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-slate-200 leading-relaxed my-0.5 text-[12px] sm:text-xs" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div 
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1c0d06]/95 border border-orange-500/30 text-xs text-orange-200 backdrop-blur-md shadow-2xl shadow-black/80 hover:border-orange-400 hover:scale-105 transition-all group"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span className="font-semibold">Ask Copilot</span>
            <kbd className="px-1.5 py-0.2 rounded bg-orange-950/80 text-[10px] font-mono text-orange-400 border border-orange-500/30">
              Ctrl+K
            </kbd>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Security Assistant"
            className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 text-white shadow-2xl shadow-orange-950/80 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-orange-300/40"
          >
            <BrandIcon size="sm" withGlow={false} />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border-2 border-[#120703]"></span>
            </span>
          </button>
        </div>
      )}

      {/* Advanced Chatbot Drawer / Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-[#120703]/98 border border-orange-500/30 rounded-3xl shadow-2xl shadow-black/90 backdrop-blur-2xl overflow-hidden ${
            isExpanded
              ? "inset-3 md:inset-8 w-auto h-auto max-w-5xl mx-auto"
              : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[460px] h-[640px] max-h-[90vh]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-950/90 via-[#1a0c06] to-[#120703] border-b border-orange-500/20 shrink-0">
            <div className="flex items-center gap-2.5">
              <BrandIcon size="sm" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white font-sans">SecureMind Copilot</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    AST ENGINE v2.0
                  </span>
                </div>
                <p className="text-[10px] text-orange-300/70 font-mono">Autonomous API Vulnerability Guide</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Mute audio" : "Enable sound"}
                className="p-1.5 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>
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
                title="Close (Esc)"
                className="p-1.5 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Topic Categorization Tabs */}
          <div className="px-3 py-2 bg-black/50 border-b border-orange-500/10 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-orange-600 text-white shadow-sm shadow-orange-950 font-semibold"
                    : "bg-orange-950/30 text-orange-300/80 hover:bg-orange-500/20 hover:text-orange-200 border border-orange-500/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Preset Question Cards */}
          <div className="px-3 py-2 bg-[#170a04]/90 border-b border-orange-500/15 overflow-x-auto flex gap-2 scrollbar-none shrink-0">
            {filteredQuestions.map((q, i) => {
              const Icon = q.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q.text)}
                  disabled={loading}
                  className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium bg-gradient-to-r from-orange-950/60 to-amber-950/40 hover:from-orange-600/30 hover:to-amber-500/30 border border-orange-500/25 text-orange-200 hover:text-white transition-all active:scale-95 disabled:opacity-50 group"
                >
                  <Icon className="w-3 h-3 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span>{q.text}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 space-y-2.5 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-none shadow-md shadow-orange-950/50"
                      : "bg-[#1a0d07]/90 border border-orange-500/20 text-slate-200 rounded-bl-none shadow-xl shadow-black/50"
                  }`}
                >
                  {/* Text Content */}
                  <div>{formatContent(msg.content)}</div>

                  {/* Code Snippet Block if present */}
                  {msg.codeSnippet && (
                    <div className="rounded-xl overflow-hidden border border-orange-500/30 bg-black/80 my-2">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-orange-950/60 border-b border-orange-500/20 text-[11px] font-mono text-orange-300">
                        <span className="flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-orange-400" />
                          <span>{msg.codeSnippet.description}</span>
                        </span>
                        <button
                          onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/20 hover:bg-orange-500/40 text-orange-200 hover:text-white transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 text-[11px] font-mono text-orange-200/90 overflow-x-auto leading-relaxed">
                        <code>{msg.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Dynamic Follow-up Question Chips */}
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="pt-2 border-t border-orange-500/15 space-y-1.5">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-orange-400/80 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Suggested Next Questions:</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUps.map((f, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(f.query)}
                            disabled={loading}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-orange-500/15 hover:bg-orange-500/30 border border-orange-500/25 text-orange-200 hover:text-white transition-all active:scale-95 group text-left"
                          >
                            <span>{f.label}</span>
                            <ArrowRight className="w-2.5 h-2.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Navigation Links */}
                  {msg.quickLinks && msg.quickLinks.length > 0 && (
                    <div className="pt-2 border-t border-orange-500/15 flex flex-wrap gap-1.5">
                      {msg.quickLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-orange-600/30 to-amber-600/30 hover:from-orange-500/40 hover:to-amber-500/40 border border-orange-500/40 text-orange-100 hover:text-white transition-all shadow-sm group"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="w-3 h-3 text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Footer & Feedback */}
                  <div className="flex items-center justify-between text-[10px] text-orange-300/50 font-mono pt-1">
                    <span>{msg.timestamp}</span>
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleFeedback(msg.id, "up")}
                          className={`p-1 rounded hover:bg-orange-500/20 transition-colors ${
                            msg.feedback === "up" ? "text-emerald-400" : "hover:text-slate-200"
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, "down")}
                          className={`p-1 rounded hover:bg-orange-500/20 transition-colors ${
                            msg.feedback === "down" ? "text-rose-400" : "hover:text-slate-200"
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-[#1a0d07] border border-orange-500/20 rounded-2xl p-3 rounded-bl-none flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse [animation-delay:0.4s]"></span>
                  <span className="text-[11px] font-mono text-orange-400/80 ml-1.5">Analyzing AST knowledge...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Listening Bar Indicator */}
          {isListening && (
            <div className="px-4 py-2 bg-gradient-to-r from-red-950/80 via-orange-950/80 to-amber-950/80 border-t border-red-500/40 flex items-center justify-between text-xs font-mono text-red-200 shrink-0 animate-pulse">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400 animate-ping" />
                <span className="font-bold">Listening to your voice... Speak your security question</span>
              </div>
              <button
                onClick={toggleVoiceInput}
                className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold"
              >
                Stop
              </button>
            </div>
          )}

          {/* Quick Shortcuts Bar */}
          <div className="px-3 py-1.5 bg-black/60 border-t border-orange-500/10 flex items-center justify-between text-[11px] text-orange-400/70 font-mono shrink-0">
            <span className="hidden sm:inline">⚡ Press Enter or Click Mic to talk</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Copilot Ready
            </span>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0d0401] border-t border-orange-500/20 flex items-center gap-2 shrink-0"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening to your microphone..." : "Ask about scans, BOLA, fixes, sandbox, or pages..."}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-black/70 border border-orange-500/30 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30 transition-all font-sans"
              />
            </div>

            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? "Stop listening" : "Speak with AI Copilot"}
              className={`p-2.5 rounded-2xl border transition-all duration-300 shrink-0 ${
                isListening
                  ? "bg-red-600 border-red-400 text-white animate-bounce shadow-lg shadow-red-500/50"
                  : "bg-orange-950/60 border-orange-500/30 text-orange-300 hover:bg-orange-500/20 hover:text-white"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-950/60 active:scale-95 shrink-0 border border-orange-300/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
