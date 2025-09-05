
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle } from 'lucide-react';
import ChatInterface from './ChatInterface';

const MobileChatButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Sheet>
        <SheetTrigger asChild>
          <button 
            className="w-14 h-14 rounded-full bg-cosmos-purple flex items-center justify-center shadow-lg hover:bg-cosmos-purple-light transition-colors"
            aria-label="Open chat"
          >
            <MessageCircle className="w-7 h-7 text-white" />
            <span className="animate-pulse absolute -top-1 -right-1 w-3 h-3 bg-cosmos-gold rounded-full"></span>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="p-0 h-[95dvh] w-full sm:max-w-full">
          <div className="h-full w-full flex flex-col overflow-hidden bg-cosmos-cosmic">
            <div className="p-3 flex-1 overflow-hidden">
              <ChatInterface className="h-full" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileChatButton;
