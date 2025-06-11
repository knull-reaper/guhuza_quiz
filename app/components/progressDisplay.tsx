'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; 
import Image from 'next/image'; 

interface UserProgressData {
  id: string;
  levelReached: number;
  percentComplete: number;
  lastPlayedAt: string;
  playerId: number;
  player?: {
    Player_name: string;
    Player_ID: number;
  };
}


interface ProgressNotFoundResponse {
  message: string;
  progress: null;
}

const ProgressDisplay = () => {
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/users/me/progress'); 
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch progress: ${response.statusText}`);
        }
        const responseData: UserProgressData | ProgressNotFoundResponse = await response.json();
        
        
        if (responseData && 'progress' in responseData && responseData.progress === null && 'message' in responseData) {
            
            setProgress(null);
            
        } else if (responseData && 'id' in responseData) { 
            setProgress(responseData as UserProgressData);
        } else {
            
            throw new Error("Invalid data structure received from API.");
        }

      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading progress...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!progress) {
    return (
      <div className="text-center py-10 bg-white shadow-xl rounded-xl p-8 max-w-lg mx-auto flex flex-col items-center"> {/* Matched shadow and rounding, added flex for centering */}
        <span className="text-5xl mb-4" role="img" aria-label="Game controller icon">🎮</span> {/* Game controller icon */}
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Progress Yet!</h3>
        <p className="text-gray-600 mb-6">It looks like you haven't made any progress in the quizzes yet. Start playing to see your progress here!</p>
        <Link href="/allquiz" legacyBehavior>
          <a className="mt-2 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Explore Quizzes
          </a>
        </Link>
      </div>
    );
  }

  
  
  
  return (
    <div className="flex flex-col flex-grow h-full"> 
      {progress.player && (
        
        
        
        <h3 className="text-2xl font-bold text-indigo-700 mb-4 text-center sm:text-left"> {/* Reduced mb if shown */}
          Progress for: <span className="text-indigo-500">{progress.player.Player_name}</span>
        </h3>
      )}
      
      {/* This div will distribute its children (the three main blocks) */}
      <div className="flex flex-col flex-grow justify-around"> {/* Use justify-around to space out children */}
        {/* Block 1: Level Reached */}
        <div className="flex items-center gap-3">
          <Image
            src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31f/512.gif" 
            alt="Glowing star icon"
            width={48} 
            height={48}
            unoptimized={true} 
          />
          <div>
            <p className="text-base font-medium text-gray-500 mb-1">Level Reached</p> {/* Increased label size */}
            <p className="text-5xl font-bold text-indigo-600">{progress.levelReached}</p> {/* Increased number size */}
          </div>
        </div>
        
        {/* Block 2: Overall Completion */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <p className="text-base font-medium text-gray-500">Overall Completion</p> {/* Increased label size */}
            <p className="text-2xl font-bold text-indigo-600">{progress.percentComplete.toFixed(1)}%</p> {/* Increased percentage size */}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-10 overflow-hidden shadow-inner border border-gray-300"> {/* Increased progress bar height to h-10 (40px) */}
            <div 
              className="progress-bar-filled bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 ease-out flex items-center justify-center text-white text-sm sm:text-base font-bold" 
              style={{ width: `${progress.percentComplete}%` }}
              role="progressbar"
              aria-valuenow={progress.percentComplete}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Game progress: ${progress.percentComplete.toFixed(1)}%`}
            >
              {progress.percentComplete.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Block 3: Last Played */}
        {/* pt-4 for spacing from border-t. Text size increased. */}
        <div className="text-base text-gray-600 border-t border-gray-200 pt-4 flex items-center gap-2"> 
          <span className="text-2xl text-gray-500" role="img" aria-label="Clock icon">🕒</span> {/* Increased icon size */}
          <p><strong>Last Played:</strong> {new Date(progress.lastPlayedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
      
      {/* Future: Display a list of all levels and their status if applicable */}
    </div>
  );
};

export default ProgressDisplay;
