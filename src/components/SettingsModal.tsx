
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings as SettingsIcon } from 'lucide-react';
import Settings from './Settings';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const SettingsModal = () => {
  const { session } = useSupabaseAuth();
  
  // Don't render anything if user is not logged in
  if (!session) return null;
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-full bg-opacity-20 bg-thanos-cosmic-light hover:bg-thanos-purple-light transition-colors animate-hover-scale"
          aria-label="Settings"
        >
          <SettingsIcon className="h-5 w-5 text-thanos-gold" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md border-thanos-purple bg-[#102a43]/90 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#33C3F0] title-section font-space-grotesk">SETTINGS</SheetTitle>
          <SheetDescription className="text-gray-300 font-inter text-sm">
            Configure webhooks and communication channels for optimal workflow
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Settings />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsModal;
