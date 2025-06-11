"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ProgressBarType = {
  percentage: number;
};

const ProgressBar = ({ percentage }: ProgressBarType) => {
  return (
    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-300">
      <div
        className="bg-blue-600 text-xs  font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
        style={{ width: `${percentage}%` }}
      >
        {Math.floor(percentage)}%
      </div>
    </div>
  );
};




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
  email?: string | null; 
  image?: string | null; 
  totalScore: number; 
  loginStreak: number; 
  lastLogin: Date;
  quizLevelId: number | null; 
  quizLevel?: { 
    id: number;
    number: number; 
    title?: string;
    
  } | null;
  milestoneId: number | null;
  milestone: MilestoneType | null; 
  
};

type ProfileHeroSectionProps = { 
  player: PlayerType; 
  playerRank: number;
};

function ProfileHerosection({player, playerRank}: ProfileHeroSectionProps) {
  
  const avatarImage = player?.image || "/Images/avatars/profile.png";

  
  
  
  
  
  
  
  
  

  const router = useRouter();
  const handleClaimReward = () => {
    
    router.push(player?.milestone?.link || "/reward");
  };

  
  const displayLevelNumber = player?.quizLevel?.number ?? player?.quizLevelId ?? 1; 
  const currentQuizLevelForCalc = player?.quizLevel?.number ?? player?.quizLevelId ?? 0; 

  const nextMilestoneUnlockingLevel = player?.milestone?.unlockingQuizLevel ?? Infinity;
  
  const levelsToNextMilestone = Math.max(0, nextMilestoneUnlockingLevel - currentQuizLevelForCalc); 
  const progressPercentage = nextMilestoneUnlockingLevel === Infinity || nextMilestoneUnlockingLevel === 0 
    ? (currentQuizLevelForCalc > 0 ? 100 : 0) 
    : Math.min(100, (currentQuizLevelForCalc / nextMilestoneUnlockingLevel) * 100);


  return (
    
    <div className="container mx-auto max-w-6xl p-6 bg-white rounded-xl shadow-xl h-full border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:scale-105">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <Image
          src={avatarImage}
          alt={player?.name ?? "Player avatar"}
          width={80} 
          height={80}
          className="rounded-full border-2 border-blue-500 object-cover" 
          priority 
        />
        <h1 className="text-4xl font-bold text-gray-800 text-center md:text-left">
          Welcome back, {player?.name ?? "Player"}!
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Stats and Streak - Added mx-auto to center this block if it's narrower than flex-1 space */}
        <div className="flex-1 lg:max-w-md mx-auto"> 
          <div className="bg-white rounded-xl shadow-lg p-6"> {/* This is the inner card for stats/streak */}
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <p className="text-gray-500 text-base font-medium mb-1">Ranking</p>
                <p className="text-5xl font-bold text-blue-600">{playerRank}</p>
              </div>
              <div>
                <p className="text-gray-500 text-base font-medium mb-1">Points</p>
                <p className="text-5xl font-bold text-blue-600">{player?.totalScore}</p>
              </div>
              <div>
                <p className="text-gray-500 text-base font-medium mb-1">Level</p>
                <p className="text-5xl font-bold text-blue-600">{displayLevelNumber}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-center gap-4 bg-blue-50 p-4 rounded-lg"> {/* Added gap-4 for spacing */}
                {/* Streak Display */}
                <div className="flex items-center">
                  <Image
                    src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif"
                    alt="Streak fire"
                  width={48} 
                  height={48}
                  className="mr-3" 
                  unoptimized 
                  />
                  <p className="text-gray-700 text-2xl font-semibold ml-2"> {/* Added ml-2 for spacing from fire icon */}
                    {player?.loginStreak} Day{player?.loginStreak === 1 ? "" : "s"} Streak!
                  </p>
                </div>

                {/* Rank Badge Display */}
                {playerRank === 1 && (
                  <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/512.gif" alt="Gold Trophy" title="Rank 1" width={36} height={36} unoptimized={true} />
                )}
                {playerRank === 2 && (
                  <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f948/512.gif" alt="Silver Medal" title="Rank 2" width={36} height={36} unoptimized={true} />
                )}
                {playerRank === 3 && (
                  <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f949/512.gif" alt="Bronze Medal" title="Rank 3" width={36} height={36} unoptimized={true} />
                )}
                {playerRank === 4 && (
                  <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f38a/512.gif" alt="Confetti Ball" title="Rank 4" width={36} height={36} unoptimized={true} />
                )}
                {playerRank === 5 && (
                  <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="Party Popper" title="Rank 5" width={36} height={36} unoptimized={true} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Milestone/Gift Section */}
        {player?.milestone && (
          <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <Image
                src="/ProfileGraphics/Gift.svg"
                alt="Milestone Gift"
                width={120}
                height={160}
                className="drop-shadow-md"
              />
            </div>
            <div className="flex-grow text-center md:text-left">
              <p className="text-lg text-gray-600 mb-1">
                Only <span className="font-bold text-blue-600">{levelsToNextMilestone}</span> more level{levelsToNextMilestone === 1 ? "" : "s"} to go!
              </p>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">{player.milestone.title}</h3>
              <ProgressBar percentage={progressPercentage} />
              <button
                className={`mt-5 w-full md:w-auto px-8 py-3 font-semibold rounded-lg text-white transition-all duration-300 ease-in-out
                  ${currentQuizLevelForCalc >= nextMilestoneUnlockingLevel
                    ? "bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg"
                    : "bg-gray-400 cursor-not-allowed"
                  }`}
                disabled={currentQuizLevelForCalc < nextMilestoneUnlockingLevel}
                onClick={handleClaimReward}
              >
                {player.milestone.buttonCTA || "Claim Reward"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileHerosection;
