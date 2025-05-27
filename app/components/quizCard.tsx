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
  disabled?: boolean; // Added disabled prop
};

export default function QuizCard({
  Question,
  Answers,
  CorrectAns,
  selectedAnswer,
  setSelectedAnswer,
  checked,
  setAnsCorrect,
  disabled, // Added disabled to props destructuring
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

      return "selectedQBtn "; //just the selection
    }
    return "";
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
                `quizButton px-6 py-3 rounded-lg  transition-transform transform active:translate-y-1 text-gray-900  text-lg w-full text-left motion-preset-slide-up-md motion-preset-fade leading-normal`
                // Added leading-normal to answer text
              } 
              
              onClick={() => handleOptionSelected(key)}
              disabled={checked || disabled} // Use the disabled prop
            >
              {answer}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
