"use client";

import { useState, useRef, useEffect } from "react";

interface pin {
  _id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description?: string;
  privacy?: string;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

interface AIChatModalProps {
  pins: pin[];
  onClose: () => void;
}

export default function AIChatModal({ pins, onClose }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! Ask me about your pins. Try: 'Show restaurants' or 'Find public pins'" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("category") || q.includes("restaurant") || q.includes("hotel") || q.includes("park")) {
      const categories = [...new Set(pins.map((p) => p.category))];
      const matching = pins.filter((p) =>
        categories.some((cat) =>
          q.includes(cat.toLowerCase()) || q.includes(p.category.toLowerCase())
        )
      );
      if (matching.length > 0) {
        return `Found ${matching.length} ${q.includes("category") ? "pins in that category" : "matching pins"}: ${matching.map((p) => p.name).join(", ")}`;
      }
    }

    if (q.includes("public")) {
      const publicPins = pins.filter((p) => p.privacy !== "private");
      return `You have ${publicPins.length} public pins: ${publicPins.map((p) => p.name).join(", ")}`;
    }

    if (q.includes("private")) {
      const privatePins = pins.filter((p) => p.privacy === "private");
      return `You have ${privatePins.length} private pins: ${privatePins.map((p) => p.name).join(", ")}`;
    }

    if (q.includes("pin") || q.includes("find")) {
      const matches = pins.filter((p) =>
        p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
      if (matches.length > 0) {
        return `Found ${matches.length} pins: ${matches.map((p) => `${p.name} (${p.category})`).join(", ")}`;
      }
    }

    if (q.includes("how many") || q.includes("total")) {
      return `You have a total of ${pins.length} pins across ${[...new Set(pins.map((p) => p.category))].length} categories.`;
    }

    if (q.includes("categor")) {
      const categories = [...new Set(pins.map((p) => p.category))];
      return `Your categories: ${categories.join(", ")}`;
    }

    return "I can help you search your pins! Try asking about categories, pin names, or privacy settings.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const response = generateResponse(input);
      const aiMessage: Message = { role: "ai", text: response };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[40000] flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 text-white rounded-2xl w-full max-w-md h-[600px] shadow-2xl flex flex-col">
        <div className="border-b border-white/20 p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">Ask AI About Your Pins</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-gray-200"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-400">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t border-white/20 p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your pins..."
            className="flex-1 bg-zinc-800 px-3 py-2 rounded-lg text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
