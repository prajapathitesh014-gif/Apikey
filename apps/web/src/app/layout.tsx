import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SentinelChatbot } from "@/components/chatbot/SentinelChatbot";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "SecureMind AST • SentinelAPI — API Security Copilot",
  description: "Deterministic AST Security Scanner + AI Reasoning Layer for OpenAPI and Sandboxes",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" }
    ],
    apple: "/favicon.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#0e0704] text-slate-100 font-sans antialiased selection:bg-orange-500/30 selection:text-orange-200 relative overflow-x-hidden">
        {/* Luxury Warm Cyber Network Ambient Background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen scale-105"
            style={{ backgroundImage: "url('/warm-cyber-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#140a06]/85 via-[#0e0704]/90 to-[#080402]" />
          <div className="absolute -top-[10%] left-[20%] w-[600px] h-[600px] rounded-full bg-orange-600/15 blur-[160px] animate-pulse" />
          <div className="absolute top-[35%] -right-[5%] w-[550px] h-[550px] rounded-full bg-amber-600/10 blur-[150px]" />
        </div>

        <div className="relative z-10">
          {children}
        </div>
        
        {/* Interactive AI Chatbot Copilot */}
        <SentinelChatbot />

        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  );
}

