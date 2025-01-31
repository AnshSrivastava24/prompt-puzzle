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
  model: string;
  description: string;
  messages: Message[];
}

const Index = () => {
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      model: selectedModel,
      description: "Start a new conversation...",
      messages: [],
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChat.id);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
    toast({
      title: "Chat deleted",
      description: "The chat has been permanently deleted.",
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
    };

    // Update chat title and description based on first message
    const updatedChats = chats.map((chat) => {
      if (chat.id === currentChatId) {
        const updatedMessages = [...chat.messages, newMessage];
        return {
          ...chat,
          title: updatedMessages.length === 1 ? content.slice(0, 30) + "..." : chat.title,
          description: updatedMessages.length === 1 ? content : chat.description,
          messages: updatedMessages,
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setIsLoading(true);

    try {
      // Replace this with your local model API call
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          model: selectedModel
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from model');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isBot: true,
      };

      setChats(chats => chats.map((chat) =>
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
        onDeleteChat={handleDeleteChat}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
      
      <main className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col">
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
              </div>
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