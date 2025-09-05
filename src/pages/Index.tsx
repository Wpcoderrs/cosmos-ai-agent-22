
import React, { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import Header from '../components/Header';
import FileUpload from '../components/FileUpload';
import ChatInterface from '../components/ChatInterface';
import MobileChatButton from '../components/MobileChatButton';
import CosmicNebula from '../components/CosmicNebula';
import LoginBox from '../components/LoginBox';
import WebhookNotification from '../components/WebhookNotification';
import { useIsMobile } from '../hooks/use-mobile';
import { useWebhookNotification } from '../hooks/useWebhookNotification';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const { session, loading: authLoading } = useSupabaseAuth();
  const isMobile = useIsMobile();
  const { 
    isNotificationVisible, 
    notificationMessage, 
    showNotification, 
    hideNotification 
  } = useWebhookNotification();
  
  // Handle loading screen completion
  const handleLoadComplete = () => {
    setIsLoading(false);
    // Small delay before showing content for smoother transition
    setTimeout(() => {
      setContentVisible(true);
    }, 100);
  };

  // Listen for webhook events
  useEffect(() => {
    const handleWebhookEvent = (event: CustomEvent) => {
      showNotification();
    };

    document.addEventListener(
      'webhook:triggered', 
      handleWebhookEvent as EventListener
    );

    return () => {
      document.removeEventListener(
        'webhook:triggered', 
        handleWebhookEvent as EventListener
      );
    };
  }, [showNotification]);

  return (
    <div className="min-h-screen cosmic-bg flex flex-col">
      {/* Loading screen */}
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      
      {/* Immersive cosmic background */}
      <CosmicNebula />
      
      {/* Webhook notification */}
      <WebhookNotification 
        isVisible={isNotificationVisible}
        message={notificationMessage}
        onClose={hideNotification}
      />
      
      {/* Main content with fade-in animation */}
      <div className={`flex-1 flex flex-col transition-opacity duration-500 ease-in ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <Header />
        
        <main className="flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-6 container relative z-10">
          {session ? (
            <>
              {/* File upload area - always visible when logged in */}
              <div className={`w-full ${!isMobile ? 'md:w-1/2' : ''} bg-cosmos-cosmic bg-opacity-50 rounded-lg neon-border overflow-hidden flex flex-col ${isMobile ? 'h-auto' : 'h-[calc(100vh-11rem)]'} backdrop-blur-sm`}>
                <div className="p-6 h-[600px] overflow-hidden">
                  <FileUpload />
                </div>
              </div>

              {/* Cosmic divider for desktop view */}
              {!isMobile && <div className="hidden md:flex cosmic-divider"></div>}

              {/* Only show the chat panel on non-mobile devices */}
              {!isMobile && (
                <div className="w-full md:w-1/2 bg-cosmos-cosmic bg-opacity-50 rounded-lg neon-border overflow-hidden flex flex-col h-[calc(100vh-11rem)] backdrop-blur-sm">
                  <div className="p-6 flex-1 overflow-y-auto">
                    <ChatInterface />
                  </div>
                </div>
              )}
            </>
          ) : (
            // Show login box when not authenticated
            <LoginBox />
          )}
        </main>
        
        {/* Show the mobile chat button only on mobile devices and when logged in */}
        {isMobile && session && <MobileChatButton />}
      </div>
    </div>
  );
};

export default Index;
