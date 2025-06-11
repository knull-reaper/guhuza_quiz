import React from "react";
// import Pbtn from "../components/buttons/primarybtn"; // Not directly used by QuizHomePage after refactor
// import Image from "next/image"; // Not directly used by QuizHomePage after refactor
// import WhyplaySection from "./whyplaySection"; // Moved to QuizHomeClientLogic
// import QuizLevelSections from "../components/quizLevelSections"; // Not used
// import LeaderBoard from "../components/leaderBoard"; // Not used
// import ProfileHerosection from "../components/profileHerosection"; // Not used
// import ShareButton from "../components/buttons/sharebtn"; // Moved to QuizHero
// import QuizHero from "../components/quizHero"; // Moved to QuizHomeClientLogic
import fetchPlayers from "@/utils/fPlayers"; // Still needed for initial data fetch
import { auth } from "@/auth";
// import LogoutButton from "../components/buttons/logoutBtn"; // Not used
// import LoginButton from "../components/buttons/loginBtn"; // Not used
import fetchUser from "@/utils/fUser";
// import { cookies } from "next/headers"; // Not directly used
import { redirect } from 'next/navigation'; 
import fetchLevels from "@/utils/fLevels"; 
// import QuizPageClientWrapper from "../components/QuizPageClientWrapper"; // Removed
import QuizHomeClientLogic from "../components/QuizHomeClientLogic"; // Added

async function QuizHomePage() {
  // const players = (await fetchPlayers()) || []; // players seems unused, can be removed if not needed by other logic
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
      // This logic determines the highest level unlocked
      for (let i = sortedLevels.length - 1; i >= 0; i--) {
        if (playerTotalScore >= sortedLevels[i].unlockScoreRequired) {
          startLevelNumber = sortedLevels[i].number;
          break; 
        }
      }
      // If no level is unlocked by score, but levels exist, default to the first level's number
      // This also handles if playerTotalScore is 0 and they should start at level 1 (or the first defined level)
      if (startLevelNumber === 1 && sortedLevels.length > 0 && playerTotalScore < sortedLevels[0].unlockScoreRequired) {
         // If their score doesn't meet the first level's requirement, they should still see the first level as their starting point.
         // Or, if sortedLevels[0].number is not 1, use that.
        startLevelNumber = sortedLevels[0].number;
      }
    } else { // Should not happen if player is guaranteed by redirect, but as a fallback
      if (sortedLevels.length > 0) {
        startLevelNumber = sortedLevels[0].number;
      }
    }
    
    return (
      <QuizHomeClientLogic 
        playerTotalScore={playerTotalScore}
        startLevelNumber={startLevelNumber}
      />
    );
  }

  // Guest user or user not logged in
  const guestPlayerTotalScore = 0; 
  let guestStartLevelNumber = 1;
  if (sortedLevels.length > 0) {
    guestStartLevelNumber = sortedLevels[0].number; 
  }
  return (
    <QuizHomeClientLogic
      playerTotalScore={guestPlayerTotalScore}
      startLevelNumber={guestStartLevelNumber}
    />
  );
}

export default QuizHomePage;
