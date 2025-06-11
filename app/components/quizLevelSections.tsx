
import React, { Suspense, useContext, useEffect } from "react";
import QuizLevelCard from "./quizLevelCard";
import fetchLevels from "@/utils/fLevels";
import { playerContext } from "../context/playerContext";
import QuizList from "./quizList";
import Link from "next/link";




type quizLevelSectionsType = {
  currentLevel: number;
};


type LevelDataType = {
  id: number;
  title: string;
  number: number;
  unlockScoreRequired: number;
  
};

type typeDisplayLevel = {
  playerTotalScore :number 
} 

async function QuizLevelSections({playerTotalScore} :typeDisplayLevel ) { 
  
  const levels: LevelDataType[] = (await fetchLevels()) || [];
  

 
  return (
    
    <div className="p-4 rounded-xl max-w-2xl mx-auto"> 
      {/* The title "Your Quiz Journey" is now handled in app/profile/page.tsx */}
      {/* Removed redundant inner container mx-auto as parent div now has max-w-2xl mx-auto */}
      <Suspense fallback={<div className="text-center py-10">Loading Quiz Levels...</div>}>
        <QuizList
            cutEnding={true} 
            allLevels={levels}
            playerTotalScore={playerTotalScore}
          />
        </Suspense>

        {/* Ensure this button is appropriately spaced if QuizList renders minimal content */}
        <div className="mt-6 text-center"> 
          {/* Purple to Blue for "View All Quizzes" */}
          <Link href={"/allquiz"} legacyBehavior>
            <a className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent font-semibold">
                View All Quizzes
              </span>
            </a>
          </Link>
        </div>
      {/* Closing div for the content that was previously inside "container mx-auto" */}
    </div> 
  );
}

export default QuizLevelSections;
