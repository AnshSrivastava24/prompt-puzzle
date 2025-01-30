import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

const Index = () => {
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChat.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
    };

    // Add user message
    setChats(chats.map((chat) =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ));

    // Show loading state
    setIsLoading(true);

    try {
      // Simulate AI response - Replace with actual model integration
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a simulated response. Replace this with actual model integration.",
        isBot: true,
      };

      setChats(chats.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, newMessage, botMessage] }
          : chat
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the model",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-chatbg text-gray-100">
      <Sidebar
        savedChats={chats}
        onChatSelect={setCurrentChatId}
        onNewChat={handleNewChat}
      />
      
      <main className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <ScrollArea className="flex-1">
              {currentChat.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  isBot={message.isBot}
                />
              ))}
              {isLoading && (
                <ChatMessage
                  content=""
                  isBot={true}
                  isLoading={true}
                />
              )}
            </ScrollArea>
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Welcome to AI Chat</h1>
              <p className="text-gray-400 mb-8">Start a new chat or select an existing one</p>
              <Button onClick={handleNewChat}>Start New Chat</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;