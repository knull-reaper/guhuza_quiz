"use client";

import useSWR from "swr";
import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react"; 

interface LeaderboardUser {
  id: number; 
  name: string | null;
  totalScore: number;
  image: string | null;
  rank: number;
  quizLevelNumber?: number; 
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch leaderboard");
  }
  return res.json();
};

const LeaderboardPage = () => {
  const { data: session } = useSession(); 
  const loggedInUserId = session?.user?.id ? parseInt(session.user.id, 10) : null;

  const { data: leaderboardData, error, isLoading } = useSWR<LeaderboardUser[]>("/api/leaderboard", fetcher, {
    refreshInterval: 10000, 
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
        <h2 className="text-2xl font-semibold mb-4">Error loading leaderboard</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-500">The leaderboard is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-gradient-to-br from-slate-900 to-gray-800">
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 mb-12 drop-shadow-md">Hall of Fame</h1>
      
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden border border-gray-700">
        {/* Optional Header Row */}
        <div className="px-6 py-4 bg-gray-700/50 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider hidden sm:flex">
          <div className="w-16 text-center">Rank</div>
          <div className="flex-1 pl-4">Player</div>
          <div className="w-24 text-right">Badges</div> {/* Changed "Score" to "Badges" */}
        </div>

        <ul role="list" className="divide-y divide-gray-600/30">
          {leaderboardData.map((user: LeaderboardUser, index: number) => {
            let liClasses = "p-5 sm:p-6 hover:bg-gray-700/20 transition-colors duration-150";
            const isCurrentUser = loggedInUserId === user.id;

            if (isCurrentUser) {
              liClasses += " bg-sky-500/40 border-l-4 border-sky-400 ring-2 ring-sky-300/70 relative"; 
            } else if (user.rank === 1) {
              liClasses += " bg-yellow-400/30 border-l-4 border-yellow-500";
            } else if (user.rank === 2) {
              liClasses += " bg-gray-400/30 border-l-4 border-gray-500";
            } else if (user.rank === 3) {
              liClasses += " bg-orange-400/30 border-l-4 border-orange-500";
            } else {
              liClasses += " bg-gray-800/10";
            }

            return (
              <li key={user.id} className={liClasses}>
                {isCurrentUser && (
                  <div className="absolute top-2 right-2 text-xs bg-sky-500 text-white py-0.5 px-2 rounded-full shadow">
                    You
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <span className={`text-2xl font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-md ${
                      user.rank === 1 ? 'bg-yellow-500 text-white ring-2 ring-yellow-300' :
                      user.rank === 2 ? 'bg-gray-500 text-white ring-2 ring-gray-300' :
                      user.rank === 3 ? 'bg-orange-600 text-white ring-2 ring-orange-400' : 'bg-gray-600 text-gray-100'
                  }`}>
                    {user.rank}
                  </span>
                  
                  <div className="flex-shrink-0">
                    <Image
                      className="h-14 w-14 rounded-full object-cover shadow-lg border-2 border-gray-500/50"
                      src={user.image || "/Images/avatars/profile.png"} 
                      alt={user.name || "User avatar"}
                      width={56}
                      height={56}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xl font-semibold text-slate-800 truncate">{user.name || "Anonymous Player"}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-md text-yellow-500 font-medium truncate">{user.totalScore.toLocaleString()} XP</p>
                      {user.quizLevelNumber && (
                        <p className="text-xs text-slate-600">(Level {user.quizLevelNumber})</p>
                      )}
                    </div>
                  </div>
                  <div className="hidden sm:flex sm:items-center sm:justify-center w-10 h-10"> {/* Adjusted for consistent sizing and centering */}
                    {user.rank === 1 && (
                      <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/512.gif" alt="Gold Trophy" width={32} height={32} unoptimized={true} />
                    )}
                    {user.rank === 2 && (
                      <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f948/512.gif" alt="Silver Medal" width={32} height={32} unoptimized={true} />
                    )}
                    {user.rank === 3 && (
                      <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f949/512.gif" alt="Bronze Medal" width={32} height={32} unoptimized={true} />
                    )}
                    {user.rank === 4 && (
                      <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f38a/512.gif" alt="Confetti Ball" width={32} height={32} unoptimized={true} />
                    )}
                    {user.rank === 5 && (
                      <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="Party Popper" width={32} height={32} unoptimized={true} />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="text-center text-sm text-gray-400 mt-10">
        Leaderboard updates in real-time. Keep an eye on your rank!
      </p>
    </div>
  );
};

export default LeaderboardPage;
