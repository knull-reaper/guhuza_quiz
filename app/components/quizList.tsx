import React from "react";
import QuizLevelCard from "./quizLevelCard";



type QuizLevelType = {
  id: number;
  title: string;
  number: number;
  unlockScoreRequired: number; 
  
};

interface QuizListProps {
  allLevels: QuizLevelType[];
  cutEnding?: boolean; 
  playerTotalScore: number; 
}

async function QuizList({ allLevels, cutEnding = true, playerTotalScore }: QuizListProps) {
  
  const sortedLevels = [...allLevels].sort((a, b) => a.number - b.number);
  
  let levelsToDisplay: QuizLevelType[] = [];

  if (cutEnding) {
    let highestUnlockedLevel: QuizLevelType | undefined = undefined;
    
    for (let i = sortedLevels.length - 1; i >= 0; i--) {
      if (playerTotalScore >= sortedLevels[i].unlockScoreRequired) {
        highestUnlockedLevel = sortedLevels[i];
        break; 
      }
    }

    if (highestUnlockedLevel) {
      levelsToDisplay = [highestUnlockedLevel];
    } else {
      
      if (sortedLevels.length > 0) {
        levelsToDisplay = [sortedLevels[0]];
      } else {
        levelsToDisplay = []; 
      }
    }
  } else {
    
    levelsToDisplay = sortedLevels;
  }

  
  let playerMaxUnlockedLevelNum = 0;
  for (const l of sortedLevels) {
      if (playerTotalScore >= l.unlockScoreRequired) {
          playerMaxUnlockedLevelNum = Math.max(playerMaxUnlockedLevelNum, l.number);
      }
  }

  if (levelsToDisplay.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>No quiz levels are currently available.</p>
        <p className="text-sm mt-1">Please check back later or contact support if you believe this is an error.</p>
      </div>
    );
  }

  
  
  
  const listContainerClasses = cutEnding 
    ? "flex justify-center" 
    : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8";

  return (
    <div className={listContainerClasses}>
      {levelsToDisplay.map((level: QuizLevelType) => {
        const isLocked = playerTotalScore < level.unlockScoreRequired;
        
        
        return (
          <QuizLevelCard
            key={level.id}
            levelNumber={level.number}
            levelLink={isLocked ? undefined : `/quiz/${level.number}`} 
            levelName={level.title}
            currentLevel={playerMaxUnlockedLevelNum} 
            isLocked={isLocked}
            unlockScoreRequired={level.unlockScoreRequired}
            playerScore={playerTotalScore}
          />
        );
      })}

      {/* {!cutEnding && levelsToDisplay.length > 0 && (
        <div className="py-20 w-full flex">
          <ScrollToTopButton /> 
        </div>
      )} */}
    </div>
  );
}

export default QuizList;
