
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical 
} from 'lucide-react';
import { ChatSession } from '@/hooks/useChatHistory';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ChatSidebar = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewChat,
  onDeleteSession,
  isCollapsed,
  onToggleCollapse
}: ChatSidebarProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(sessionId);
    await onDeleteSession(sessionId);
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={`${
      isCollapsed ? 'w-12' : 'w-80'
    } bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-white font-medium text-lg">Chat History</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-white/80 hover:bg-white/10"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        
        {!isCollapsed && (
          <Button
            onClick={onNewChat}
            className="w-full mt-3 bg-calm-purple hover:bg-calm-purple/90 text-white"
          >
            <Plus size={16} className="mr-2" />
            New Chat
          </Button>
        )}
      </div>

      {/* Sessions List */}
      {!isCollapsed && (
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {sessions.length === 0 ? (
              <div className="p-4 text-center text-white/60">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative rounded-lg cursor-pointer transition-colors ${
                    currentSessionId === session.id
                      ? 'bg-calm-purple/20 border border-calm-purple/30'
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => onSessionSelect(session.id)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm font-medium truncate">
                          {session.title}
                        </h3>
                        <p className="text-white/60 text-xs mt-1">
                          {formatDate(session.updated_at)}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 text-white/60 hover:text-white hover:bg-white/10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-md">
                          <DropdownMenuItem
                            onClick={(e) => handleDelete(session.id, e)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={deletingId === session.id}
                          >
                            <Trash2 size={14} className="mr-2" />
                            {deletingId === session.id ? 'Deleting...' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}

      {/* Collapsed New Chat Button */}
      {isCollapsed && (
        <div className="p-2">
          <Button
            onClick={onNewChat}
            variant="ghost"
            size="icon"
            className="w-full text-white/80 hover:bg-white/10"
          >
            <Plus size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};
