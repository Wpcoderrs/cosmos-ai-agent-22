
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useChatWebhook } from '@/hooks/useChatWebhook';
import { useChatTypes } from '@/hooks/useChatTypes';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import ConversationList from './chat/ConversationList';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const { 
    messages,
    conversations,
    activeConversationId, 
    isLoading, 
    sendMessageToWebhook, 
    addUserMessage,
    createNewConversation,
    switchConversation,
    deleteConversation
  } = useChatWebhook();
  
  const { 
    chatTypes, 
    selectedTypeId, 
    setSelectedTypeId, 
    isLoading: typesLoading, 
    getSelectedType 
  } = useChatTypes();
  
  const [showConversations, setShowConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    addUserMessage(message);
    console.log("Sending message with selectedTypeId:", selectedTypeId);
    await sendMessageToWebhook(message, selectedTypeId);
  };

  const handleChatTypeClick = (typeId: string) => {
    setSelectedTypeId(typeId);
    // Scroll to chat input when switching chat types
    setTimeout(() => {
      const chatInput = document.querySelector('.chat-input-container');
      chatInput?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleNewConversation = () => {
    createNewConversation(selectedTypeId);
    setShowConversations(false);
  };

  const selectedType = getSelectedType();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-orbitron text-[#33C3F0] title-section mb-1">AI ASSISTANT</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1"
            onClick={handleNewConversation}
          >
            <PlusCircle size={14} />
            New Chat
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setShowConversations(true)}
              >
                History
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-4 bg-cosmos-cosmic">
              <ConversationList
                conversations={conversations}
                activeConversationId={activeConversationId}
                onNewConversation={handleNewConversation}
                onSwitchConversation={(id) => {
                  switchConversation(id);
                  setShowConversations(false);
                }}
                onDeleteConversation={deleteConversation}
                selectedTypeId={selectedTypeId}
                onClose={() => setShowConversations(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <p className="text-xs text-gray-300 font-exo mb-2 text-center">Get intelligent answers to your questions</p>
      
      {/* Chat Type Buttons Row with enhanced visual feedback */}
      <div className="relative z-10 mb-2 w-full max-w-md mx-auto">
        <div className="flex flex-wrap justify-center gap-1.5">
          {chatTypes.length === 0 ? (
            <div className="chat-type-empty text-gray-400 py-2 text-sm">
              No chat types found.
            </div>
          ) : (
            chatTypes.map((type) => (
              <Button
                key={type.id}
                onClick={() => handleChatTypeClick(type.id)}
                className={cn(
                  "chat-type-button relative text-xs py-1 px-2.5",
                  selectedTypeId === type.id ? "chat-type-button-active" : ""
                )}
                variant="outline"
                aria-pressed={selectedTypeId === type.id}
              >
                <MessageCircle className={cn(
                  "mr-1 h-3 w-3", 
                  selectedTypeId === type.id ? "text-[#33C3F0] animate-pulse" : "text-[#33C3F0]/70"
                )} />
                <span>{type.name}</span>
                {type.is_default && (
                  <span className="chat-type-default-indicator" title="Default chat type" />
                )}
              </Button>
            ))
          )}
        </div>
        {selectedType && (
          <div className="text-xs text-center mt-1 text-[#33C3F0]/80">
            Active: <span className="font-medium">{selectedType.name}</span>
          </div>
        )}
      </div>
      
      <MessageList 
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
        className="flex-1"
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInterface;
