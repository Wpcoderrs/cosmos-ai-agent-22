
import React, { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

const CosmicNebula: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle settings
    const particleCount = 200;
    const galaxyParticles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
    }[] = [];
    
    // Dust cloud settings
    const dustCloudCount = 4;
    const dustClouds: {
      x: number;
      y: number;
      size: number;
      opacity: number;
      color: string;
    }[] = [];
    
    // Create stars
    for (let i = 0; i < particleCount; i++) {
      // Deep blues and teal colors
      const colors = [
        'rgba(30, 130, 247, alpha)', // Blue
        'rgba(55, 165, 135, alpha)', // Teal
        'rgba(24, 74, 96, alpha)',   // Deep blue-teal
        'rgba(64, 124, 188, alpha)', // Light blue 
        'rgba(10, 42, 66, alpha)'    // Dark blue
      ];
      
      galaxyParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.2
      });
    }
    
    // Create dust clouds with subtle blue tints
    for (let i = 0; i < dustCloudCount; i++) {
      const cloudColors = [
        'rgba(12, 37, 56, alpha)',  // Dark blue
        'rgba(18, 58, 86, alpha)',  // Medium blue
        'rgba(23, 78, 105, alpha)', // Blue-teal
        'rgba(31, 95, 124, alpha)'  // Light blue
      ];
      
      dustClouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 350 + 200,
        opacity: Math.random() * 0.08 + 0.02,
        color: cloudColors[Math.floor(Math.random() * cloudColors.length)]
      });
    }
    
    // Animation function
    const animate = () => {
      // Deep space background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a1a29');    // Dark blue at top
      gradient.addColorStop(0.5, '#0d1f35');  // Slightly lighter in middle
      gradient.addColorStop(1, '#091425');    // Dark blue at bottom
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Render dust clouds first (behind stars)
      dustClouds.forEach(cloud => {
        // Shift position slightly to give subtle movement
        cloud.x += Math.sin(Date.now() * 0.0001) * 0.2;
        cloud.y += Math.cos(Date.now() * 0.0001) * 0.1;
        
        // Wrap around edges
        if (cloud.x > canvas.width + cloud.size) cloud.x = -cloud.size;
        if (cloud.x < -cloud.size) cloud.x = canvas.width + cloud.size;
        if (cloud.y > canvas.height + cloud.size) cloud.y = -cloud.size;
        if (cloud.y < -cloud.size) cloud.y = canvas.height + cloud.size;
        
        const grd = ctx.createRadialGradient(
          cloud.x, cloud.y, 0,
          cloud.x, cloud.y, cloud.size
        );
        
        grd.addColorStop(0, cloud.color.replace('alpha', cloud.opacity.toString()));
        grd.addColorStop(1, 'rgba(9, 20, 37, 0)');
        
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Render stars/particles
      galaxyParticles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        // Draw the particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('alpha', particle.opacity.toString());
        ctx.fill();
        
        // Add subtle glow to larger stars
        if (particle.size > 1.3) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace('alpha', (particle.opacity * 0.2).toString());
          ctx.fill();
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className="cosmic-nebula-container">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
      />
      {/* Subtle decorative elements */}
      <div className="nebula-overlay absolute inset-0 pointer-events-none z-0">
        <div className="absolute" style={{ top: '18%', left: '8%', opacity: 0.4 }}>
          <Star size={12} className="text-celestial-space opacity-40" />
        </div>
        <div className="absolute" style={{ top: '75%', left: '92%', opacity: 0.3 }}>
          <Star size={16} className="text-celestial-space opacity-30" />
        </div>
        <div className="absolute" style={{ top: '35%', left: '86%', opacity: 0.2 }}>
          <Star size={10} className="text-celestial-time opacity-20" />
        </div>
      </div>
    </div>
  );
};

export default CosmicNebula;
