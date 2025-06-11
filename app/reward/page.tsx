import RewardCopy from "../components/rewardcopy";
import React from 'react'
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";


type MilestoneType = { 
  id: number;
  title: string;
  description: string;
  unlockingQuizLevel: number; 
  rewardMessage: string;
  link: string; 
  buttonCTA: string;
  
};

type PlayerType = { 
  id: number;
  name: string | null;
  totalScore: number; 
  loginStreak: number; 
  lastLogin: Date;
  quizLevelId: number | null; 
  milestoneId: number | null;
  milestone: MilestoneType | null; 
  
};


async function Reward() {
  const session = await auth();
  if (session && session.user) { 
    const user = session.user;
    
    
    let userIdNumber: number | undefined = undefined;
    if (user.id) {
      userIdNumber = parseInt(user.id, 10);
      if (isNaN(userIdNumber)) {
        console.error("RewardPage: Failed to parse user ID from session:", user.id);
        userIdNumber = undefined; 
      }
    }

    const playerName = user.name ?? "Anonymous";
    const playerEmail = user.email ?? "noemailavailable";

    
    const player: PlayerType | null = userIdNumber !== undefined 
      ? await fetchUser(userIdNumber, playerName, playerEmail) 
      : null;

    if (!player) {
      
      
      
      return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-700 mb-4">Error</h1>
            <p className="text-gray-600">Could not load player data to display rewards.</p>
            {/* Optionally, add a link to go back or to profile */}
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
            {player.milestone ? `🎉 ${player.milestone.title} Unlocked! 🎉` : "Your Rewards"}
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            {player.milestone ? player.milestone.description : "Check out your latest achievements and rewards."}
          </p>
          <RewardCopy player={player} />
        </div>
      </div>
    );
  }
  
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">Access Denied</h1>
        <p className="text-gray-600">Please log in to view your rewards.</p>
        {/* Add a Link to login page if available */}
      </div>
    </div>
  );
}

export default Reward;
