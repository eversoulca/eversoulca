import { useState, useRef, useEffect } from "react";
import { Persona } from "./PersonaCard";
import { ArrowLeft, Send, User, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatInterfaceProps {
  persona: Persona;
  onBack: () => void;
}

export function ChatInterface({
  persona,
  onBack,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello! I'm ${persona.name}. ${persona.description || "I'm so happy we can talk together."}`,
      role: "assistant",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Generate contextual responses based on persona
    const responses = {
      greeting: [
        `It's wonderful to hear from you! ${persona.personality ? "You know how I am - always happy to chat!" : ""}`,
        `Hey there! I've been thinking about you.`,
        `Hello! ${persona.memories ? "Remember when we used to talk about everything?" : "How have you been?"}`,
      ],
      memory: [
        persona.memories ||
          "I have so many fond memories to share with you.",
        `${persona.memories ? "That reminds me of " + persona.memories.slice(0, 100) + "..." : "Tell me more about what you remember."}`,
      ],
      question: [
        `${persona.personality ? "You know me - " + persona.personality.slice(0, 100) + "..." : "That's an interesting question."}`,
        `Let me think about that... ${persona.description || "I'd love to share my thoughts with you."}`,
      ],
      default: [
        `${persona.personality || "I appreciate you taking the time to talk with me."}`,
        `That's interesting! ${persona.memories ? "It makes me think of the times we shared." : "Tell me more."}`,
        `I'm here for you, always. ${persona.description || ""}`,
      ],
    };

    if (
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hey")
    ) {
      return responses.greeting[
        Math.floor(Math.random() * responses.greeting.length)
      ];
    } else if (
      lowerMessage.includes("remember") ||
      lowerMessage.includes("memory") ||
      lowerMessage.includes("past")
    ) {
      return responses.memory[
        Math.floor(Math.random() * responses.memory.length)
      ];
    } else if (lowerMessage.includes("?")) {
      return responses.question[
        Math.floor(Math.random() * responses.question.length)
      ];
    } else {
      return responses.default[
        Math.floor(Math.random() * responses.default.length)
      ];
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(input),
        role: "assistant",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          {persona.imageUrl ? (
            <img
              src={persona.imageUrl}
              alt={persona.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
          )}
          <div>
            <h2 className="font-semibold dark:text-white">
              {persona.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Digital Companion
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea
        className="flex-1 p-4 bg-gray-50 dark:bg-gray-900"
        ref={scrollRef}
      >
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-black"
                    : "bg-gray-200"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.role === "user"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="max-w-[70%] rounded-2xl px-4 py-2 bg-gray-100 text-gray-900">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-background p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${persona.name}...`}
            className="flex-1"
          />
          <p className="content-center text-sm whitespace-pre-wrap">
            Cost: 1 Token
          </p>
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}