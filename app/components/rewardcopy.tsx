"use client";
import React, { useState, useRef, useContext} from "react";
import Image from "next/image";
import { playerContext } from "../context/playerContext";
import { Resend } from 'resend';
import { useRouter } from "next/navigation";


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

type TypeRewardCopy =  { 
  player : PlayerType | null
}

function RewardCopy({player}: TypeRewardCopy) {
  const router = useRouter();
  const reward = player?.milestone; 
  const playerId = player?.id;
  
  
  
  const currentMilestoneId = player?.milestone?.id ?? player?.milestoneId ?? 1; 
  
  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    
    
    const nextMilestoneTargetId = currentMilestoneId + 1; 
    
    const response = await fetch("/api/reward", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify({ playerId, nextMilestoneId: nextMilestoneTargetId }), 
    });
  
    if (response.ok) { 
      const data = await response.json();
      if (reward?.link) { 
        window.open(String(reward.link), "_blank");
      }
      console.log("User's milestone updated, next milestone might be:", data.nextMilestone); 
      router.push("/profile"); 
      router.refresh(); 
    } else {
      const errorData = await response.json();
      console.error("Failed to update milestone:", errorData.message || "Unknown error");
      alert(`Error: ${errorData.message || "Could not process reward."}`);
    }
  };

  if (!player || !reward) {
    return (
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Reward Information</h2>
        <p className="text-gray-600">Could not load reward details at this time, or no specific reward is currently active.</p>
      </div>
    );
  }

  return (
    
    <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white shadow-2xl rounded-xl p-8 md:p-12 max-w-2xl mx-auto text-center transform hover:scale-105 transition-transform duration-300">
      <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">{reward.title}</h1>
      <p className="text-lg mb-6 opacity-90 leading-relaxed">
        {reward.description}
      </p>
      <p className="text-2xl font-semibold mb-8 bg-white/20 backdrop-blur-sm p-4 rounded-lg shadow-inner">
        {reward.rewardMessage}
      </p>
      <div className="my-8">
        {/* Purple to Pink gradient for "Claim Reward" button, large style */}
        <button
          type="button"
          onClick={handleSubmit}
          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <span className="relative px-10 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            {reward.buttonCTA || "Claim Reward"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default RewardCopy;
