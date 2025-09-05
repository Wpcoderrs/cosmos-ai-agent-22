
import { useState, useCallback } from 'react';

interface UseWebhookNotificationReturn {
  isNotificationVisible: boolean;
  notificationMessage: string;
  showNotification: (message?: string) => void;
  hideNotification: () => void;
}

export const useWebhookNotification = (): UseWebhookNotificationReturn => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("I feel... stronger now.");

  const showNotification = useCallback((message?: string) => {
    if (message) {
      setNotificationMessage(message);
    } else {
      setNotificationMessage("I feel... stronger now.");
    }
    setIsNotificationVisible(true);
  }, []);

  const hideNotification = useCallback(() => {
    setIsNotificationVisible(false);
  }, []);

  return {
    isNotificationVisible,
    notificationMessage,
    showNotification,
    hideNotification
  };
};
