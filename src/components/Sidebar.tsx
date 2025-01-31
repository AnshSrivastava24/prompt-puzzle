import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Menu, Plus, MessageSquare, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SavedChat {
  id: string;
  title: string;
  model: string;
  description: string;
}

interface SidebarProps {
  savedChats: SavedChat[];
  onChatSelect: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const Sidebar = ({ 
  savedChats, 
  onChatSelect, 
  onNewChat, 
  onDeleteChat,
  selectedModel,
  onModelChange 
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-sidebar h-screen transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          <Menu className="h-5 w-5 text-gray-400" />
        </Button>
        {!isCollapsed && (
          <Button variant="ghost" onClick={onNewChat} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Chat
          </Button>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-4 border-b border-gray-700">
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jarvis">Jarvis</SelectItem>
              <SelectItem value="llama3.1">Llama 3.1</SelectItem>
              <SelectItem value="deepseek-r1">DeepSeek R1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <ScrollArea className="h-[calc(100vh-8rem)] px-2">
        <div className="space-y-2 p-2">
          {savedChats.map((chat) => (
            <div key={chat.id} className="group relative">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isCollapsed ? "px-2" : "px-4"}`}
                onClick={() => onChatSelect(chat.id)}
              >
                {isCollapsed ? (
                  <MessageSquare className="h-5 w-5" />
                ) : (
                  <div className="flex flex-col items-start gap-1 w-full">
                    <div className="flex items-center gap-2 w-full">
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </div>
                    <div className="text-xs text-gray-400 w-full truncate">
                      {chat.description}
                    </div>
                    <div className="text-xs italic text-gray-500">
                      Model: {chat.model}
                    </div>
                  </div>
                )}
              </Button>
              {!isCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onDeleteChat(chat.id)}
                >
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
