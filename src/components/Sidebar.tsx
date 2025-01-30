import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Menu, Plus, MessageSquare } from "lucide-react";

interface SavedChat {
  id: string;
  title: string;
}

interface SidebarProps {
  savedChats: SavedChat[];
  onChatSelect: (id: string) => void;
  onNewChat: () => void;
}

const Sidebar = ({ savedChats, onChatSelect, onNewChat }: SidebarProps) => {
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
      
      <ScrollArea className="h-[calc(100vh-5rem)] px-2">
        <div className="space-y-2 p-2">
          {savedChats.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className={`w-full justify-start ${isCollapsed ? "px-2" : "px-4"}`}
              onClick={() => onChatSelect(chat.id)}
            >
              {isCollapsed ? (
                <MessageSquare className="h-5 w-5" />
              ) : (
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="h-4 w-4" />
                  <span className="truncate">{chat.title}</span>
                </div>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;