"use client";

import React from "react";
import useCountdown from "@/app/hooks/useCountdown"; 

interface CountdownProps {
  initialTime: number; 
  onComplete: () => void;
  size?: number; 
  strokeWidth?: number; 
  className?: string;
}

const Countdown: React.FC<CountdownProps> = ({
  initialTime,
  onComplete,
  size = 80,
  strokeWidth = 8,
  className = "",
}) => {
  const { remainingTime, isRunning, reset } = useCountdown({
    initialTime,
    onComplete,
    autoStart: true,
  });

  React.useEffect(() => {
    
    reset(initialTime);
  }, [initialTime, reset]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (remainingTime / initialTime) * circumference;

  
  let progressColorClass = "text-green-500"; 
  if (remainingTime <= initialTime * 0.25) { 
    progressColorClass = "text-red-500";
  } else if (remainingTime <= initialTime * 0.5) { 
    progressColorClass = "text-yellow-500";
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Time remaining: ${remainingTime} seconds`}
    >
      <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-300"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`transition-all duration-300 ease-linear ${progressColorClass}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ filter: `drop-shadow(0 0 3px currentColor)` }}
        />
      </svg>
      <span
        className={`text-2xl font-bold tabular-nums ${progressColorClass}`}
        aria-hidden="true" 
      >
        {remainingTime}
      </span>
      <span className="sr-only">
        {remainingTime} {remainingTime === 1 ? "second" : "seconds"} remaining
      </span>
    </div>
  );
};

export default Countdown;
