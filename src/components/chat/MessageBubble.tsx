
import React from 'react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

const MessageBubble: React.FC<MessageProps> = ({ content, sender, timestamp }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={cn(
        sender === 'user' ? "message-user" : "message-system",
        "py-2 px-3 max-w-[85%]" // Added max-width constraint
      )}
    >
      <div className="flex justify-between items-start mb-0.5">
        <span className="font-bold text-xs text-cosmos-gold">
          {sender === 'user' ? 'You' : 'Cosmos'}
        </span>
        <span className="text-xs text-gray-400 ml-2">
          {formatTime(timestamp)}
        </span>
      </div>
      {sender === 'system' ? (
        <div className="text-sm markdown-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm">{content}</p>
      )}
    </div>
  );
};

export default MessageBubble;
