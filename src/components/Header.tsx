
import React from 'react';
import SettingsModal from './SettingsModal';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const Header = () => {
  const { session } = useSupabaseAuth();

  return (
    <header className="container py-4 px-4 md:px-6 z-20 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl md:text-2xl font-medium tracking-wider text-[#3a9edc]">COSMOS</h1>
          <span className="text-xs bg-[#1e375f]/70 text-[#8fbad5] rounded-md px-2 py-1">BETA</span>
        </div>
        <div className="flex items-center space-x-4">
          {session && <SettingsModal />}
        </div>
      </div>
    </header>
  );
};

export default Header;
