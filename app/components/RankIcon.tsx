"use client";

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface RankIconProps {
  lottiePath: string;
  altText: string;
  width?: number;
  height?: number;
}

const RankIcon = ({ lottiePath, altText, width = 32, height = 32 }: RankIconProps) => {
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lottiePath) {
      setError(null); 
      fetch(lottiePath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch Lottie animation: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => setAnimationData(data))
        .catch(err => {
          console.error("Error fetching or parsing Lottie animation:", lottiePath, err);
          setError(err.message);
          setAnimationData(null); 
        });
    }
  }, [lottiePath]);

  if (error) {
    
    return <span className="mr-2" title={`${altText} (Error: ${error})`} style={{ width, height, display: 'inline-block' }}>⚠️</span>;
  }
  
  if (!animationData) {
    
    return <div style={{ width, height }} className="mr-2 animate-pulse bg-gray-200 rounded"></div>;
  }

  return (
    <div title={altText} className="mr-2"> {/* Wrapper for accessibility and consistent margin */}
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width, height }}
        
        
      />
    </div>
  );
};

export default RankIcon;
