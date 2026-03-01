import { useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const mockResponses: Record<string, string> = {
  default: "I'm VigiBot Agent. I can analyze crime patterns, summarize threats, and help with investigations. Try asking about recent alerts or threat analysis.",
};

const AIChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "VigiBot Agent online. I'm ready to assist with crime analysis, threat assessment, and investigation support. What do you need?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const lower = input.toLowerCase();
      let response = mockResponses.default;
      if (lower.includes("high risk") || lower.includes("critical")) {
        response = "📊 **High Risk Analysis:**\n\n• ALT-001: Drug Trafficking in Paharganj — CRITICAL risk. Active surveillance recommended.\n• ALT-002: Extortion in Karol Bagh — HIGH risk. Threatening messages targeting local business.\n• ALT-003: Kidnapping threat near Green Park — HIGH risk. Planned abduction intercepted.\n\nRecommendation: Deploy rapid response teams to Paharganj and Green Park immediately.";
      } else if (lower.includes("pattern") || lower.includes("trend")) {
        response = "📈 **Crime Pattern Analysis (Last 24h):**\n\n• Drug-related activity concentrated in North Delhi corridors\n• Extortion cases showing 40% increase in commercial zones\n• Financial fraud targeting elderly residents via phone scams\n• Peak threat hours: 04:00 - 08:00 IST\n\nNotable: Cross-reference suggests organized network operating across Paharganj-Karol Bagh axis.";
      } else if (lower.includes("summarize") || lower.includes("summary")) {
        response = "📋 **Threat Summary:**\n\n5 active alerts tracked across Delhi NCR. 3 require immediate action.\n\nTop priority: Drug trafficking operation in Paharganj (ALT-001). Intel suggests delivery scheduled for tonight.\n\nSecond priority: Kidnapping plot targeting businessman near Green Park metro (ALT-003).\n\nAll assigned stations have been notified.";
      }
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="glass-panel rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
        <Bot className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-xs uppercase tracking-wider">VigiBot Agent</h2>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3 h-3 text-primary" />
                </div>
              )}
              <div className={`rounded-md px-3 py-2 text-xs max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                msg.role === "user" ? "bg-primary/20 text-foreground" : "bg-secondary/50"
              }`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3 h-3" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-primary" />
              </div>
              <div className="bg-secondary/50 rounded-md px-3 py-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Ask VigiBot..."
            className="flex-1 bg-secondary/50 border border-border rounded-md px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            className="bg-primary/20 hover:bg-primary/30 text-primary rounded-md px-3 transition-colors"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {["Show high risk alerts", "Analyze crime patterns", "Summarize threats"].map(q => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              className="text-[10px] px-2 py-1 rounded bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
