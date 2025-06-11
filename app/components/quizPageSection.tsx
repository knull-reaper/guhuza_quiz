"use client";
import React, { useState, useEffect } from "react";
import QuizCard from "./quizCard";

import Image from "next/image";
import { useRouter } from "next/navigation"; 
import ShareButton from "./ShareButton";

type quizeType = { 
  question: string;
  comment: string;
  test_answer: number;
  answers: string[];
};

type PlayerDataType = {
  id: number;
  name: string | null;
  totalScore: number;
  quizLevelId: number | null;
};

interface QuizPageSectionProps {
  Quizes: quizeType[];
  levelNumber: string; 
  levelTitle: string;
  player: PlayerDataType | null; 
}

export default function QuizPageSection({ Quizes, levelNumber, levelTitle, player }: QuizPageSectionProps) {
  const questionsForCurrentLevel = Array.isArray(Quizes) ? Quizes.slice(0, 10) : [];
  const len = questionsForCurrentLevel.length;

  const router = useRouter();
  const [score, setScore] = useState<number>(0); 
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [ansCorrect, setAnsCorrect] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [retried, setRetried] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timedOut, setTimedOut] = useState(false);
  
  var quizer: quizeType | undefined = questionsForCurrentLevel[questionNumber];

  useEffect(() => {
    if (answerChecked || timedOut || questionNumber >= len) { 
      return; 
    }
    if (timeLeft === 0) {
      setTimedOut(true);
      handleScore(); 
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, answerChecked, questionNumber, timedOut, len]);

  const setDefault = () => {
    setSelectedAnswer(-1);
    setAnswerChecked(false);
    setAnsCorrect(false);
    setUsedHint(false);
    setRetried(false);
    setTimeLeft(30);
    setTimedOut(false);
  };

  const handleNextLevel = async () => {
    if (!player || player.id === undefined || player.id === null) { 
      console.error("Save Score: Player data is missing or invalid (no ID). Cannot save score.");
      alert("Error: Could not identify user. Please ensure you are logged in.");
      router.push('/api/auth/signin'); 
      return;
    }

    const newTotalScore = (player.totalScore ?? 0) + score; 
    const completedQuizId = Number(levelNumber); 
    const currentAttemptScore = score; 

    try {
      const response = await fetch("/api/updateScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          finalScore: newTotalScore, 
          newlevel: completedQuizId,  
          attemptScore: currentAttemptScore 
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Score updated successfully!", data);
        
        const nextQuizIdToShow = completedQuizId + 1; 
        router.push(`/quiz/${nextQuizIdToShow}`);
        router.refresh(); 
      } else {
        const errorData = await response.json();
        console.error("Failed to update score:", errorData.message);
        alert(`Error saving score: ${errorData.message || 'An unknown error occurred.'}`);
      }
    } catch (error) {
      console.error("An error occurred while saving score:", error);
      alert("An unexpected error occurred while saving your score. Please try again.");
    }
  };

  const handleScore = () => {
    setAnswerChecked(true);
    if (quizer && selectedAnswer == quizer.test_answer) {
      setAnsCorrect(true); 
      if (retried) {
        setScore(score + 10);
      } else {
        setScore(score + 30);
      }
    } else {
      setAnsCorrect(false); 
    }
  };

  const handleShareScore = () => {
    console.log(score, player, levelTitle);
  };

  const handleNextQuestion = () => {
    if (questionNumber < len - 1) {
      setQuestionNumber(questionNumber + 1);
      setDefault();
    } else {
      setQuestionNumber(len); 
      setDefault(); 
    }
  };

  const handleRetry = () => { 
    setScore(0);
    setQuestionNumber(0);
    setDefault(); 
    console.log("Retrying current lesson set");
  };

  if (!player) {
    return (
      <div className="text-center py-10">
        <p>Loading user data or user not logged in...</p>
      </div>
    );
  }

  return questionNumber < len ? (
    <div className="w-full max-w-4xl mx-auto py-8 md:py-12 px-4"> {/* Added max-width and centered */}
      {/* Header: Level Info & Timer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center mb-10 sm:mb-16 gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center space-x-3">
            <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
              Level {levelNumber}
            </span>
            <span className="text-gray-700">: {levelTitle}</span>
          </h2>
          <p className="text-gray-600 mt-1">Question {questionNumber + 1} of {len}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <div className="relative">
            <div 
              className={`text-2xl sm:text-3xl font-bold p-4 sm:p-5 rounded-xl shadow-xl w-full sm:w-auto sm:min-w-[120px] text-center transition-all duration-300 ease-in-out transform group
                ${timedOut 
                  ? 'bg-red-700 text-white scale-105' 
                  : timeLeft <= 5 
                    ? 'bg-red-600 text-white animate-pulse scale-110' 
                    : timeLeft <= 10 
                      ? 'bg-yellow-500 text-white animate-pulse' 
                      : 'bg-green-600 text-white' 
                }`}
            >
              <span className="block font-mono tracking-wider">{String(timeLeft).padStart(2, '0')}</span>
              <span className="block text-xs font-medium opacity-80 group-hover:opacity-100">SECONDS</span>
            </div>
            {/* Optional: Add a subtle ticking or border animation based on timeLeft */}
          </div>
          {timedOut && (
            <p className="text-red-700 font-bold text-lg mt-2 w-full sm:w-auto text-center sm:text-right animate-bounce">Time's Up!</p>
          )}
        </div>
      </div>

      {/* Main Quiz Area: QuizCard & Mascot */}
      <div className="flex flex-col md:flex-row justify-between md:gap-8 lg:gap-12">
        <div className="flex-grow md:w-2/3"> {/* Quiz Card takes more space */}
          {quizer ? ( 
            <>
              <QuizCard
                Question={quizer.question}
                CorrectAns={quizer.test_answer}
                Answers={quizer.answers}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={setSelectedAnswer}
                checked={answerChecked || timedOut}
                setAnsCorrect={setAnsCorrect}
                disabled={timedOut}
              />
              {/* Action Buttons Area */}
              <div className="mt-8">
                {answerChecked || timedOut ? (
                  <div className="w-full">
                    {!ansCorrect && !timedOut ? (
                      <div className="relative"> {/* Added relative for hint positioning */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Cyan to Blue for "Retry Question" */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAnswer(-1); setAnswerChecked(false); setRetried(true); setTimeLeft(30); setTimedOut(false);
                            }}
                            disabled={usedHint || timedOut}
                            className="flex-1 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <span className="relative w-full px-4 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                              Retry Question
                            </span>
                          </button>
                          {/* Cyan to Blue for "Show Answer" */}
                          <button
                            type="button"
                            onClick={() => {
                              if (quizer) setSelectedAnswer(quizer.test_answer);
                              setUsedHint(true); setAnswerChecked(true);
                            }}
                            disabled={timedOut}
                            className="flex-1 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <span className="relative w-full px-4 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                              Show Answer
                            </span>
                          </button>
                        </div>
                        <p className="mt-3 text-xs text-gray-500"> {/* Removed absolute, simpler text hint */}
                          Using "Show Answer" will not award points for this question.
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        {/* Green to Blue for "Next Question" / "Finish Quiz" */}
                        <button
                          type="button"
                          onClick={() => handleNextQuestion()}
                          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <span className="relative px-6 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            {questionNumber < len - 1 ? "Next Question" : "Finish Quiz"}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-end">
                    {/* Green to Blue for "Check Answer" */}
                    <button
                      type="button"
                      onClick={() => handleScore()}
                      disabled={selectedAnswer === -1 || timedOut}
                      className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span className="relative px-6 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                        Check Answer
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">Loading question...</div> 
          )}
        </div>
        {/* Mascot Area */}
        <div className="hidden md:flex md:w-1/3 flex-col items-center justify-center mt-8 md:mt-0">
          {answerChecked || timedOut ? (
            <Image
              key={!ansCorrect || timedOut ? 'feedbackMascot' : 'greetingMascot'} 
              src={!ansCorrect || timedOut ? "/mascot/sadMascot.svg" : "/mascot/proudMascot.svg"}
              className="w-48 h-auto transition-all duration-500 ease-in-out transform scale-100 opacity-100"
              alt="Guhuza Mascot Feedback"
              width={192} 
              height={192} 
              
              
              
              
            />
          ) : (
            <Image
              key="greetingMascot"
              className="w-48 h-auto transition-all duration-500 ease-in-out transform scale-100 opacity-100" 
              src="/mascot/greetingMascot.svg"
              alt="Guhuza Mascot Greeting"
              width={192}
              height={192}
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    
    <div className="w-full max-w-2xl mx-auto py-12 md:py-16 px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">Lesson Complete!</h1>
      <Image src={"/mascot/proudMascot.svg"} className="mx-auto mb-8 w-48 sm:w-64 h-auto" width={250} alt="Guhuza Bird - Proud" height={250} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-6 shadow-lg">
          <p className="text-xl font-semibold text-yellow-700 mb-2">⭐ Points Gained</p>
          <h2 className="text-5xl sm:text-6xl font-bold text-yellow-600">{score}</h2>
        </div>
        <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
          <p className="text-xl font-semibold text-blue-700 mb-2">🏆 Total Score</p>
          <h2 className="text-5xl sm:text-6xl font-bold text-blue-600">{(player?.totalScore ?? 0) + score}</h2>
        </div>
      </div>
      
      {/* Green to Blue for "Save Score & Continue" */}
      <button
        type="button"
        onClick={handleNextLevel}
        className="w-full sm:w-auto relative inline-flex items-center justify-center p-0.5 mb-6 overflow-hidden text-lg font-semibold text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="relative w-full sm:w-auto px-8 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Save Score & Continue
        </span>
      </button>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* Cyan to Blue for "Retry Same Lesson" */}
        <button
          type="button"
          onClick={handleRetry}
          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="relative flex items-center justify-center gap-2 px-6 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Retry Same Lesson
          </span>
        </button>
        <ShareButton score={score} levelTitle={levelTitle} />
      </div>
    </div>
  );
}
