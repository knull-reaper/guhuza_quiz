'use client';

import React, { useEffect, useState } from 'react';

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

// for the api response when progress is not found
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
        const response = await fetch('/api/users/me/progress'); // Fetches for the authenticated user
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch progress: ${response.statusText}`);
        }
        const responseData: UserProgressData | ProgressNotFoundResponse = await response.json();
        
        // Check if it's the ProgressNotFoundResponse structure
        if (responseData && 'progress' in responseData && responseData.progress === null && 'message' in responseData) {
            // This means progress was not found.
            setProgress(null);
            // You could use responseData.message if you want to display it, e.g., setError(responseData.message);
        } else if (responseData && 'id' in responseData) { // Check if it's UserProgressData
            setProgress(responseData as UserProgressData);
        } else {
            // Unexpected response structure
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
      <div className="text-center py-10 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">No Progress Yet!</h3>
        <p className="text-gray-600">It looks like you haven't made any progress in the quizzes yet. Start playing to see your progress here!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 max-w-2xl mx-auto">
      {progress.player && (
        <h3 className="text-xl font-semibold text-gray-700 mb-1">
          Progress for: {progress.player.Player_name}
        </h3>
      )}
      <div className="mb-4">
        <p className="text-lg text-gray-600">
          <strong>Level Reached:</strong> 
          <span className="text-blue-600 font-semibold ml-2">{progress.levelReached}</span>
        </p>
      </div>
      
      <div className="mb-6">
        <p className="text-lg text-gray-600 mb-1">
          <strong>Overall Completion:</strong>
          <span className="text-blue-600 font-semibold ml-2">{progress.percentComplete.toFixed(1)}%</span>
        </p>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-center text-white text-sm font-medium"
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

      <div className="text-sm text-gray-500 border-t pt-4 mt-6">
        <p><strong>Last Played:</strong> {new Date(progress.lastPlayedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      
      {/* Future: Display a list of all levels and their status if applicable */}
    </div>
  );
};

export default ProgressDisplay;
