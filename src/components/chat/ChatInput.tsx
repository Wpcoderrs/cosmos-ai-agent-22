
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    onSendMessage(inputValue);
    setInputValue('');
  };

  const isSendReady = inputValue.trim().length > 0 && !isLoading;

  return (
    <div className="mt-auto chat-input-container">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="chat-input font-inter"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={cn(
            "send-btn py-2.5",
            isSendReady && "send-btn-ready",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Send message"
          disabled={isLoading}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
