
import { useState, useEffect } from 'react';

// Simple hook to store settings in localStorage during development
export const useDevSettings = (fallbackUserId = "00000000-0000-0000-0000-000000000000") => {
  const [settings, setSettings] = useState<{
    fileProcessingWebhook: string;
    chatRagWebhook: string;
    youtubeWebhook: string;
    newsWebhook: string;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const storageKey = `dev_settings_${fallbackUserId}`;
  
  // Load settings from localStorage
  useEffect(() => {
    try {
      setIsLoading(true);
      const savedSettings = localStorage.getItem(storageKey);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Error loading development settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);
  
  // Save settings to localStorage
  const saveSettings = (newSettings: { 
    fileProcessingWebhook: string; 
    chatRagWebhook: string;
    youtubeWebhook: string;
    newsWebhook: string;
  }) => {
    try {
      setIsLoading(true);
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
      setSettings(newSettings);
      return { success: true, error: null };
    } catch (error) {
      console.error("Error saving development settings:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    settings,
    saveSettings,
    isLoading
  };
};
