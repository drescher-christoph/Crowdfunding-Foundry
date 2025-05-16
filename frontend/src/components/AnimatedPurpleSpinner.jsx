import React, { useState, useEffect } from "react";

const AnimatedPurpleSpinner = () => {
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScale(prev => prev === 1 ? 0.95 : 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div 
        className="relative w-16 h-16 transition-transform duration-500"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Hintergrund Kreis mit Puls-Effekt */}
        <div className="absolute w-full h-full rounded-full border-4 border-purple-100 animate-pulse"></div>
        
        {/* Haupt-Spinner mit Gradient */}
        <div className="absolute w-full h-full rounded-full border-4 border-transparent animate-spin duration-1000"
          style={{
            borderImage: "linear-gradient(to right, #8b5cf6, #d8b4fe, #8b5cf6) 1",
            animation: "spin 1s linear infinite, pulse 2s ease-in-out infinite"
          }}
        ></div>
        
        {/* Glühender innerer Kreis */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50"></div>
      </div>
    </div>
  );
};

export default AnimatedPurpleSpinner;