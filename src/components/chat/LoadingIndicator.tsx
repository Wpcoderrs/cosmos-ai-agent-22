
import React from 'react';
import { Star } from 'lucide-react';

const LoadingIndicator: React.FC = () => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex justify-start animate-slide-up">
      <div className="message-system">
        <div className="flex justify-between items-start mb-1">
          <span className="font-medium text-xs text-[#3a9edc]">Cosmos</span>
          <span className="text-xs text-gray-400 ml-2">
            {formatTime(new Date())}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="cosmic-loading-indicator">
            <div className="flex space-x-2 items-center">
              <Star 
                size={14} 
                className="text-[#3a9edc] opacity-70"
              />
              <span className="loading-pulse bg-[#1e82f7]"></span>
              <span className="loading-pulse bg-[#37a587]" style={{ animationDelay: '0.2s' }}></span>
              <span className="loading-pulse bg-[#5ab5e6]" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
