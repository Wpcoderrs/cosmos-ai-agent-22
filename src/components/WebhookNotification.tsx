
import React, { useEffect, useState } from 'react';

interface WebhookNotificationProps {
  isVisible: boolean;
  message?: string;
  onClose: () => void;
}

const WebhookNotification: React.FC<WebhookNotificationProps> = ({ 
  isVisible, 
  message = "I feel... stronger now.", 
  onClose 
}) => {
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    let fadeOutTimeout: NodeJS.Timeout;
    
    if (isVisible) {
      setOpacity(1);
      
      // Fade out after 2 seconds
      fadeOutTimeout = setTimeout(() => {
        setOpacity(0);
        
        // Allow transition to complete before calling onClose
        setTimeout(() => {
          onClose();
        }, 500); // 500ms for transition
      }, 2000);
    }
    
    return () => {
      if (fadeOutTimeout) clearTimeout(fadeOutTimeout);
    };
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out"
      style={{ opacity }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="relative z-10 font-orbitron text-thanos-stone-power text-xl md:text-2xl px-8 py-4 rounded text-center">
        {message}
      </div>
    </div>
  );
};

export default WebhookNotification;
