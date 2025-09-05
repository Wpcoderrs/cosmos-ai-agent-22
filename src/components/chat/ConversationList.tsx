
import React from 'react';
import { PlusCircle, MessageCircle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  title: string;
  lastUpdated: Date;
  chatTypeId: string | null;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string;
  onNewConversation: () => void;
  onSwitchConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  className?: string;
  selectedTypeId: string | null;
  onClose?: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onNewConversation,
  onSwitchConversation,
  onDeleteConversation,
  className,
  selectedTypeId,
  onClose
}) => {
  // Sort conversations by last updated (newest first)
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const conversationDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (conversationDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex justify-between items-center mb-2 p-2">
        <h3 className="font-bold text-[#33C3F0] font-orbitron">Conversations</h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>
      
      <Button 
        variant="outline" 
        onClick={onNewConversation} 
        className="mb-4 bg-[#102a43]/70 hover:bg-[#102a43] border-[#33C3F0]/50 hover:border-[#33C3F0] text-white flex gap-2"
      >
        <PlusCircle size={16} />
        New Conversation
      </Button>
      
      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
        {sortedConversations.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No conversations yet
          </div>
        ) : (
          sortedConversations.map(conversation => (
            <div 
              key={conversation.id} 
              className={cn(
                'p-2 rounded-md cursor-pointer group flex justify-between items-center',
                conversation.id === activeConversationId 
                  ? 'bg-[#33C3F0]/20 border border-[#33C3F0]/60' 
                  : 'hover:bg-[#102a43] border border-transparent'
              )}
              onClick={() => onSwitchConversation(conversation.id)}
            >
              <div className="flex items-center gap-2 flex-1 overflow-hidden">
                <MessageCircle size={16} className="text-[#33C3F0]/80 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{conversation.title}</div>
                  <div className="text-xs text-gray-400">{formatDate(conversation.lastUpdated)}</div>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conversation.id);
                }}
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#1e375f]/50 rounded",
                  conversation.id === activeConversationId && "opacity-100"
                )}
                aria-label="Delete conversation"
              >
                <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
