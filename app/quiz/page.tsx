import React from "react";
import Pbtn from "../components/buttons/primarybtn";
import Image from "next/image";
import WhyplaySection from "./whyplaySection";
import QuizLevelSections from "../components/quizLevelSections";
import LeaderBoard from "../components/leaderBoard";
import ProfileHerosection from "../components/profileHerosection";
import ShareButton from "../components/buttons/sharebtn";
import QuizHero from "../components/quizHero";
import fetchPlayers from "@/utils/fPlayers";
import { auth } from "@/auth";
import LogoutButton from "../components/buttons/logoutBtn";
import LoginButton from "../components/buttons/loginBtn";
import fetchUser from "@/utils/fUser";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'; 
import fetchLevels from "@/utils/fLevels"; 

async function QuizHomePage() {
  const players = (await fetchPlayers()) || []; 
  const session = await auth();
  const allLevels = (await fetchLevels()) || []; 
  const sortedLevels = [...allLevels].sort((a, b) => a.number - b.number);

  if (session && session.user) { 
    const user = session.user;
    const name = user?.name ?? "Anonymous";

    const userIdString = user?.id;
    let userIdNumber: number | undefined = undefined;

    if (userIdString) {
      userIdNumber = parseInt(userIdString, 10);
      if (isNaN(userIdNumber)) {
        console.error("QuizHomePage: Failed to parse user ID from session:", userIdString);
        userIdNumber = undefined;
      }
    }

    let player = null;
    if (userIdNumber !== undefined) {
      player = await fetchUser(
        userIdNumber,
        name,
        user?.email || ""
      );
    }

    
    
    
    if (!player || !player.name || player.name === "Anonymous") {
      
      
      
      redirect('/profile/update-username');
    }

    const playerTotalScore = player?.totalScore ?? 0; 

    let startLevelNumber = 1; 
    if (player) {
      for (let i = sortedLevels.length - 1; i >= 0; i--) {
        if (playerTotalScore >= sortedLevels[i].unlockScoreRequired) {
          startLevelNumber = sortedLevels[i].number;
          break; 
        }
      }
      
      if (startLevelNumber === 1 && sortedLevels.length > 0 && playerTotalScore < sortedLevels[0].unlockScoreRequired) {
        startLevelNumber = sortedLevels[0].number;
      }
    } else {
      
      if (sortedLevels.length > 0) {
        startLevelNumber = sortedLevels[0].number;
      }
    }

    
    return (
      <div className="min-h-screen bg-gray-50"> {/* Consistent page background */}
        <QuizHero startLevelNumber={startLevelNumber} />
        
        <section className="py-12 sm:py-16 bg-white"> {/* Whyplay section with its own background */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <WhyplaySection />
          </div>
        </section>
        
        {/* Quiz Levels section REMOVED */}
        {/* Leaderboard section REMOVED */}
      </div>
    );
  }

  
  const playerTotalScore = 0; 
  let startLevelNumber = 1;
  if (sortedLevels.length > 0) {
    startLevelNumber = sortedLevels[0].number; 
  }
  return (
    <div className="min-h-screen bg-gray-50"> {/* Consistent page background */}
      <QuizHero startLevelNumber={startLevelNumber} />
      
      <section className="py-12 sm:py-16 bg-white"> {/* Whyplay section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <WhyplaySection />
        </div>
      </section>
      
      {/* Quiz Levels section REMOVED */}
      {/* Leaderboard section REMOVED */}
    </div>
  );
}

export default QuizHomePage;
