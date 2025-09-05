
import React, { useEffect, useState } from 'react';
import CosmicNebula from './CosmicNebula';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    // Simulated loading process
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Add a small delay before hiding loading screen for smoother transition
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => {
              onLoadComplete();
            }, 800); // Added delay for the exit animation to play
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-800 ease-in-out ${isComplete ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Use the exact same CosmicNebula component as in the main app */}
      <CosmicNebula />
      
      {/* Content container with animation */}
      <div className={`z-10 flex flex-col items-center justify-center px-4 transition-transform duration-500 ease-out ${isComplete ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Center the title */}
        <div className="flex flex-col items-center justify-center mx-auto text-center">
          <h1 className="text-7xl md:text-8xl mb-6 font-orbitron title-cosmos animate-cosmic-pulse">COSMOS</h1>
          
          <div className="flex justify-center mb-4 space-x-2">
            {['mind', 'power', 'reality', 'soul', 'space', 'time'].map((stone, index) => (
              <div 
                key={stone} 
                className={`${index === 4 ? 'animate-pulse' : ''} infinity-stone`} 
                style={{ 
                  backgroundColor: stone === 'space' ? 'var(--tw-colors-celestial-space)' : `var(--tw-colors-celestial-${stone})`,
                  animationDelay: `${Math.random() * 2}s`,
                  width: stone === 'space' ? '20px' : '15px',
                  height: stone === 'space' ? '20px' : '15px'
                }}
              />
            ))}
          </div>
          
          <p className="text-xl mb-8 text-white font-exo">Exploring Cosmic Horizons... Loading...</p>
        </div>
        
        {/* Progress bar container with neon effect - cyan themed */}
        <div className="w-full max-w-md mx-auto bg-cosmos-cosmic-dark/30 rounded-full h-3 mb-4 overflow-hidden loading-bar-container neon-border">
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out loading-bar-progress"
            style={{ 
              width: `${loadingProgress}%`,
              background: 'linear-gradient(90deg, #1E82F7, #33C3F0, #40E0D0)'
            }}
          />
        </div>
        
        <p className="text-white text-sm font-exo text-center max-w-md mx-auto">{Math.round(loadingProgress)}%</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
