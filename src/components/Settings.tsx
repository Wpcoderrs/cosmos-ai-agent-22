
import React from 'react';
import SettingsForm from './settings/SettingsForm';
import SettingsHeader from './settings/SettingsHeader';

interface SettingsProps {
  className?: string;
}

const Settings: React.FC<SettingsProps> = ({ className }) => {
  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-cosmos-cosmic rounded-lg p-4 border border-[#33C3F0]/40 backdrop-blur-sm shadow-lg">
        <SettingsHeader />
        <SettingsForm />
      </div>
    </div>
  );
};

export default Settings;
