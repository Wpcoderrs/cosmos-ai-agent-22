
import React from 'react';
import { cn } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, messagesEndRef, className }) => {
  return (
    <div className={cn("overflow-y-auto pr-2 space-y-3 font-exo mb-3", className)}>
      {messages.map((message) => (
        <div 
          key={message.id}
          className={cn(
            "flex",
            message.sender === 'user' ? "justify-end" : "justify-start",
            "animate-slide-up"
          )}
        >
          <MessageBubble 
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
          />
        </div>
      ))}
      {isLoading && <LoadingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
