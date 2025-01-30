import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
  isLoading?: boolean;
}

const ChatMessage = ({ content, isBot, isLoading }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "py-8 px-6",
        isBot ? "bg-sidebar/50" : "bg-transparent"
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            isBot ? "bg-blue-500" : "bg-orange-500"
          )}
        >
          {isBot ? "AI" : "U"}
        </div>
        <div className="flex-1">
          {isLoading ? (
            <div className="text-gray-400">
              Thinking<span className="animate-thinking-dots" />
            </div>
          ) : (
            <p className="text-gray-200 leading-relaxed">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;