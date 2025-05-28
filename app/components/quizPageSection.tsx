"use client";
import React, { use, useState, useEffect } from "react";
import QuizCard from "./quizCard";
import { div } from "framer-motion/client";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import LeaderBoard from "./leaderBoard";
import { useContext } from "react";
import { playerContext } from "../context/playerContext";
import { setCookie } from "cookies-next";
import ShareButton from "./ShareButton";
type quizeType = {
  question: string;
  comment: string;
  test_answer: number;
  answers: string[];
};

export default function QuizPageSection({ Quizes, levelNumber, levelTitle, player }: any) {

  // Slice to get only the first 10 questions for the current level
  // Make initialization robust in case Quizes is not an array
  const questionsForCurrentLevel = Array.isArray(Quizes) ? Quizes.slice(0, 10) : [];
  const len = questionsForCurrentLevel.length; // Actual number of questions for this set (max 10)

  const router = useRouter()
  const [score, setScore] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState(0); // This will be index within questionsForCurrentLevel
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [ansCorrect, setAnsCorrect] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [retried, setRetried] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timedOut, setTimedOut] = useState(false);
  
  // Ensure quizer uses the sliced array
  var quizer: quizeType | undefined = questionsForCurrentLevel[questionNumber];

  useEffect(() => {
    if (answerChecked || timedOut) {
      return; // stop timer if answer is checked or time is out
    }

    if (timeLeft === 0) {
      setTimedOut(true);
      handleScore(); // auto-submit when time is out
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, answerChecked, questionNumber, timedOut]);

  const setDefault = () => {
    setSelectedAnswer(-1);
    setAnswerChecked(false);
    setAnsCorrect(false);
    setUsedHint(false);
    setRetried(false);
    setTimeLeft(30);
    // setLowTime(false); // Removed lowTime state
    setTimedOut(false);
  };

  const handleNextLevel = async () => {
    if( !player.Playerpoint ) { 
      setCookie("tempScore", score)
      router.push("/")
    } else { 
      const nextLevel = Number(levelNumber) + 1
      const finalScore = score + player?.Playerpoint
      const playerId = player?.Player_ID
      const newlevel = Math.max(player.Level_Id, nextLevel)
     
      try {
        const response = await fetch("/api/updateScore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playerId, finalScore, newlevel }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("User updated in successfully!", data);
        
         
          router.push(`/quiz/${newlevel}`)
          console.log(data.newlevel)
  
  
  
        } else {
          const errorData = await response.json();
          console.error("Login failed:", errorData.message);
  
  
        }
      } catch (error) {
        console.error("An error occurred during login:", error);
  
  
      }
    }
    
  }

 

  const handleScore = () => {
    setAnswerChecked(true);

    // Ensure quizer is defined before accessing its properties
    if (quizer && selectedAnswer == quizer.test_answer) {
      if (retried) {
        setScore(score + 10);
      } else {
        setScore(score + 30);
      }
    }
   
  };
  const handleShareScore = () => {
    console.log(score,player, levelTitle )
  }

  const handleNextQuestion = () => {
    // Check against the length of the current 10-question set
    if (questionNumber < len -1) { // Adjusted condition to allow finishing on the last question
      setQuestionNumber(questionNumber + 1);
      setDefault();
    } else {
      // If it's the last question of the 10-question set, mark as complete for this set
      // The UI will then show the "Lesson Complete" screen
      // To trigger this, we can set questionNumber to len, which will satisfy `questionNumber < len` as false
      setQuestionNumber(len); 
      setDefault(); // Reset for safety, though lesson complete screen takes over
    }
  };

  const handleRetry =() => { 
    setScore(0)
    setQuestionNumber(0)
    // router.push("/quiz/"+ levelNumber) // This might need to re-fetch or re-slice if we are within a sub-level logic not implemented yet
    // For now, just resetting current 10-question set
    setDefault(); 
    console.log("retried current 10-question set");
  }

  // Check if all questions in the current 10-question set are done
  return questionNumber < len ? (
    <div className="md:py-16 pt-8 pb-28">
      {/* New Header Section - 2 Columns */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-start mb-24 gap-6"> {/* mb-20 (80px) to mb-24 (96px) */}
        {/* Left Column: "Level X : Question Y" */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold flex items-center space-x-2 rtl:space-x-reverse"> {/* Added rtl:space-x-reverse for RTL support if needed */}
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
              Level {levelNumber}
            </span>
            <span className="text-gray-700">
              : Question {questionNumber + 1}
            </span>
          </h2>
        </div>

        {/* Right Column: Timer and "Time's up!" message */}
        <div className="md:col-span-1 flex flex-col items-start md:items-end w-full md:pr-16">
          <div 
            className={`text-xl font-semibold p-4 rounded-lg shadow-lg w-full md:w-auto md:min-w-[170px] text-center transition-colors duration-300
              ${timedOut 
                ? 'bg-red-500 text-white font-bold' 
                : timeLeft <= 5 
                  ? 'bg-red-200 text-red-700 animate-pulse font-bold' 
                  : timeLeft <= 10 
                    ? 'bg-orange-100 text-orange-700 animate-pulse' 
                    : 'bg-yellow-50 text-yellow-700' // Default timer background
              }`}
          >
            Time Left: {timeLeft}s
          </div>
          {timedOut && (
            <p className="text-red-600 font-bold text-xl mt-2 w-full md:w-auto text-center md:text-right">Time's up!</p>
          )}
        </div>
      </div>

      <div className="container mt-0">
        <div className=" flex  justify-start md:gap-20  ">
          {/* Using a simpler condition based on quizer's existence, assuming quizer is correctly typed as potentially undefined */}
          {quizer ? ( 
            <div className="flex-1">
              <QuizCard
                Question={quizer.question} // Safe if quizer is confirmed by the condition
                CorrectAns={quizer.test_answer} // Safe
                Answers={quizer.answers}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={setSelectedAnswer}
                checked={answerChecked || timedOut}
                setAnsCorrect={setAnsCorrect}
                disabled={timedOut} // Disable interaction if timed out
              />

              {/* buton section */}
              <div className=" ">
                <div className="mt-10 ">
                  {answerChecked || timedOut ? (
                    <div className="w-full ">
                      {!ansCorrect && !timedOut ? ( // Show retry/display only if not correct and not timed out
                        <div>
                          <div className="flex gap-10">
                            <button
                              className="quizPbtn"
                              onClick={() => {
                                setSelectedAnswer(-1);
                                setAnswerChecked(false);
                                setRetried(true);
                                // Reset timer for retry
                                setTimeLeft(30);
                                setTimedOut(false);
                              }}
                              disabled={usedHint || timedOut}
                            >
                              Retry
                            </button>
                            <button
                              className="quizSbtn"
                              onClick={() => {
                                // Ensure quizer exists before accessing its properties
                                if (quizer) {
                                  setSelectedAnswer(quizer.test_answer);
                                }
                                setUsedHint(true);
                                setAnswerChecked(true); // Mark as checked when displaying answer
                              }}
                              disabled={timedOut}
                            >
                              Display Answer
                            </button>
                          </div>
                          <p className="mt-6 text-sm absolute leading-relaxed"> {/* Added leading-relaxed */}
                            You can use Display Answer to force move to next
                            question without any point
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end">
                          <button
                            className="quizPbtn" 
                            onClick={() => handleNextQuestion()}
                          >
                            {questionNumber < len - 1
                              ? "Next Question"
                              : "Finish Quiz"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      className="quizPbtn"
                      onClick={() => handleScore()}
                      disabled={selectedAnswer === -1 || timedOut} 
                    >
                      Check Answer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Optional: Render a loading state or null if quizer is not available
            // This branch is new due to the more robust check
            <div>Loading question...</div> 
          )}
          <div className=" hidden md:block flex-1/2 w-100">
            {answerChecked || timedOut ? (
              <div className="w-full ">
                {!ansCorrect ? (
                  <Image
                    src={timedOut ? "/mascot/sadMascot.svg" : "/mascot/sadMascot.svg"} // could use a different mascot for timeout
                    className="motion-preset-slide-left-md motion-preset-fade w-full" // Added w-full
                    alt="Guhuza Mascot"
                    height={100}
                    width={200}
                    style={{ height: 'auto' }} 
                  />
                ) : (
                  <Image
                    src="/mascot/proudMascot.svg"
                    className="motion-preset-slide-left-md motion-preset-fade w-full" // Added w-full
                    alt="Guhuza Mascot"
                    height={100}
                    width={200}
                    style={{ height: 'auto' }} 
                  />
                )}
              </div>
            ) : (
              <Image
                className="motion-preset-slide-up-md motion-preset-fade w-full" // Added w-full
                src="/mascot/greetingMascot.svg"
                alt="Guhuza Mascot"
                height={100}
                width={200}
                style={{ height: 'auto' }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
 
    <div className="md:py-16 py-8">
      <div className="container">
        <div className="flex  flex-col items-center">
          <h1 className="title text-center">Lesson Complete !</h1>
          <div className="flex flex-wrap-reverse justify-center gap-8 items-center">
          <div className="flex  flex-col gap-8 mt-6 justify-center">
            <div className="bg-yellow-50 rounded border-2 border-yellow-300 gap-4 flex flex-col items-center px-6 py-4">
             
              <p className="mt-4 text-xl"> ⭐PTS GAINED</p>
              <h1 className="text-6xl font-bold">{score}</h1>
            </div>
            <div className="bg-blue-50 rounded border-2 border-blue-100   flex flex-col gap-4 items-center px-6 py-4">
            
              <p className="mt-4 text-xl"> 🏆TOTAL SCORE</p>
              <h1 className="text-6xl font-bold">{player?.Playerpoint ? player?.Playerpoint +  score: score}</h1>
            </div>
          </div>
          <Image src={"/mascot/proudMascot.svg"} className="mt-8" width={250} alt="Guhuza Bird" height={30} />

          </div>
          



         
          <button className="quizPbtn mt-20" onClick={handleNextLevel}>Save Score</button>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8">
            <button className="quizSbtn flex items-center gap-2" onClick={handleRetry}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Retry Same Lesson
            </button>
            <ShareButton/>
          </div>

        </div>
       
      </div>
    </div>
  );
}
