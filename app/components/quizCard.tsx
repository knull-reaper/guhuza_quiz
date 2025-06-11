"use client";
import { animateSequence } from "framer-motion/dom/mini";
import { useState } from "react";

type quizCardType = {
  Question: string;
  CorrectAns: number;
  Answers: string[];
  selectedAnswer: number;
  setSelectedAnswer: any;
  checked: boolean;
  setAnsCorrect: any;
  disabled?: boolean; 
};

export default function QuizCard({
  Question,
  Answers,
  CorrectAns,
  selectedAnswer,
  setSelectedAnswer,
  checked,
  setAnsCorrect,
  disabled, 
}: quizCardType) {
  const handleOptionSelected = (key: number) => {
    setSelectedAnswer(key);
    console.log(key);
  };

  const setButtonStyle = (key: number): string => {
    if (key == selectedAnswer) {
      if (checked) {
        if (selectedAnswer == CorrectAns) {
          setAnsCorrect(true);
          return "cQuizButton after:content-['✅'] after:absolute md:after:right-10"; //correct answer
        }
        return "FquizButton after:content-['❌'] after:absolute md:after:right-10"; //incorrect selection
      }
      
      return "selectedQBtn border-indigo-500 ring-2 ring-indigo-300 scale-105 "; 
    }
    
    return "border-gray-300 "; 
  };
  return (
    <div className=" m-0 p-0">
      <h3 className="text-3xl font-semibold text-gray-800 motion-delay-150  motion-preset-slide-up mb-6 leading-normal"> 
        {/* Changed leading-tight to leading-normal for question, mb-6 for space below */}
        {Question}
      </h3>
      <div className="grid gap-8 pt-6 w-full"> {/* Changed pt-9 to pt-6 */}
        {Answers.map((answer: string, key: number) => (
          <div key={key} className="w-full group relative"> {/* Added key={key} */}
            <button
              className={
                
                
                
                setButtonStyle(key) + 
                `quizButton px-6 py-4 rounded-xl border-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 ease-in-out transform active:translate-y-px text-gray-800 hover:text-indigo-600 text-lg w-full text-left leading-relaxed shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed motion-preset-slide-up-md motion-preset-fade`
              } 
              
              onClick={() => handleOptionSelected(key)}
              disabled={checked || disabled} 
            >
              {answer}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
