import React from "react";
import Pbtn from "./buttons/primarybtn";



type QuizLevelCardTypes = {
  levelName: string;
  levelLink?: string; 
  levelNumber: number;
  currentLevel: number; 
  isLocked: boolean;
  unlockScoreRequired: number;
  playerScore: number;
};

function QuizLevelCard({
  levelName,
  levelLink,
  levelNumber,
  currentLevel, 
  isLocked,
  unlockScoreRequired,
  playerScore, 
}: QuizLevelCardTypes) {
  
  
  
  const themeForButton = (levelNumber === currentLevel && !isLocked) ? "light" : "dark";

  
  const baseCardWrapperClasses = "levelContainer rounded-2xl shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 mt-0"; 
  const animationClasses = `intersect:motion-preset-slide-up-lg motion-delay-${1000 - levelNumber * 100} intersect-once`;

  let cardDynamicStyles = "";
  let titleColor = ""; 
  let descriptionColor = "";
  let levelNumberStyles = ""; 
  let levelNumberTextColor = "text-white"; 

  if (isLocked) {
    
    cardDynamicStyles = "bg-gray-700 bg-opacity-50 border border-gray-600 cursor-not-allowed backdrop-blur-sm";
    titleColor = "text-gray-400";
    descriptionColor = "text-gray-500";
    levelNumberStyles = "bg-gray-500";
    levelNumberTextColor = "text-gray-300";
  } else {
    
    cardDynamicStyles = "bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 backdrop-blur-md dark:bg-slate-700 dark:bg-opacity-20 dark:border-slate-600"; 
    titleColor = "text-slate-700 dark:text-slate-100 font-semibold"; 
    descriptionColor = "text-slate-500 dark:text-slate-300"; 
    levelNumberStyles = "bg-pink-500"; 
  }

  return (
    <div className={`${baseCardWrapperClasses} ${cardDynamicStyles} ${animationClasses} p-6 flex flex-col justify-between`}>
      <div> {/* Content wrapper */}
        <div className="flex items-start mb-4"> {/* Changed to items-start for better alignment with multi-line title */}
          <div className={`flex items-center justify-center ${levelNumberStyles} ${levelNumberTextColor} w-12 h-12 rounded-full font-bold text-xl shadow-lg flex-shrink-0`}> {/* Increased size and shadow */}
            {levelNumber}
          </div>
          <div className="ml-4">
            <h3 className={`text-2xl font-bold ${titleColor} ${isLocked ? '[text-shadow:_1px_1px_1px_rgb(0_0_0_/_30%)]' : '[text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]'}`}>{levelName}</h3> {/* Increased title size & added text shadow */}
            <p className={`text-sm ${descriptionColor} ${isLocked ? '[text-shadow:_1px_1px_1px_rgb(0_0_0_/_30%)]' : '[text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]'}`}>Number of Questions: 10</p> {/* Added text shadow */}
          </div>
        </div>
        
        {isLocked && (
          <div className={`flex items-center text-sm font-semibold mb-4 p-3 rounded-lg bg-red-700 bg-opacity-50 text-red-100 border border-red-500 backdrop-blur-sm [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]`}> {/* Adjusted locked message style & added text shadow */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
            </svg>
            Locked! Requires {unlockScoreRequired} points. (Your score: {playerScore})
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 flex justify-end"> {/* Button aligned to bottom-right */}
        {isLocked ? (
          <button
            className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed"
            disabled
          >
            Locked
          </button>
        ) : (
          <Pbtn
            toDestination={levelLink!} 
            theme={themeForButton}
            message="Start Quiz"
          />
        )}
      </div>
    </div>
  );
}

export default QuizLevelCard;
