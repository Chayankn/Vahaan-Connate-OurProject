import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { sampleCopilotMessages, CopilotMessage } from "@/data/sampleData";
import { Bot, Send, Sparkles, X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AICopilot({ isOpen, onClose }: AICopilotProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>(sampleCopilotMessages);
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your current test setup, I recommend starting with a calibration run at 3000 RPM to establish baseline measurements.",
        "I've analyzed your recent data. The motor efficiency peaks at around 5200 RPM. Consider focusing your sweep tests in the 4800-5600 RPM range.",
        "Your propeller's pitch-to-diameter ratio suggests optimal performance at 70% throttle. Would you like me to generate a parameter sweep for validation?",
        "I notice some vibration anomalies in the last test run. This could indicate propeller imbalance. Shall I suggest calibration steps?",
      ];

      const assistantMessage: CopilotMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <Card
      variant="glassStrong"
      className={cn(
        "fixed z-50 flex flex-col transition-all duration-300 animate-slide-in-right",
        isExpanded
          ? "inset-4 md:inset-8"
          : "bottom-4 right-4 w-96 h-[500px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Copilot</h3>
            <p className="text-xs text-muted-foreground">Powered by ML</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === 'user' && "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                message.role === 'assistant'
                  ? "bg-primary/20"
                  : "bg-secondary"
              )}
            >
              {message.role === 'assistant' ? (
                <Sparkles className="w-4 h-4 text-primary" />
              ) : (
                <span className="text-xs font-medium">You</span>
              )}
            </div>
            <div
              className={cn(
                "rounded-xl px-4 py-2.5 max-w-[85%]",
                message.role === 'assistant'
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto custom-scrollbar">
        {["Plan test", "Analyze data", "Suggest params", "Explain result"].map((action) => (
          <Button
            key={action}
            variant="outline"
            size="sm"
            className="shrink-0 text-xs"
            onClick={() => setInput(action)}
          >
            {action}
          </Button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Ask anything about your test..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
