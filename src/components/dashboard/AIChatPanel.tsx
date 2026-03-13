import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vigibot-chat`;

const AIChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Vigilance Agent online. I'm ready to assist with crime analysis, threat assessment, and investigation support. What do you need?" },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > newMessages.length) {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      toast({ title: "Vigilance Error", description: e.message, variant: "destructive" });
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Error connecting to AI service. Please try again." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="glass-panel rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
        <Bot className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-xs uppercase tracking-wider">Vigilance AI</h2>
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
              <div className={`rounded-md px-3 py-2 text-xs max-w-[85%] leading-relaxed ${
                msg.role === "user" ? "bg-primary/20 text-foreground" : "bg-secondary/50"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none [&>*]:m-0 [&>*]:text-xs [&>ul]:pl-4 [&>ol]:pl-4 [&>p]:leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3 h-3" />
                </div>
              )}
            </motion.div>
          ))}
          {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-primary" />
              </div>
              <div className="bg-secondary/50 rounded-md px-3 py-2">
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask Vigilance..."
            disabled={isStreaming}
            className="flex-1 bg-secondary/50 border border-border rounded-md px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isStreaming}
            className="bg-primary/20 hover:bg-primary/30 text-primary rounded-md px-3 transition-colors disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {["Show high risk alerts", "Analyze crime patterns", "Summarize threats"].map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              disabled={isStreaming}
              className="text-[10px] px-2 py-1 rounded bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
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
