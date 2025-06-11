"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { calculateSpeedBonus, calculateStreakBonus } from "@/app/utils/scoring"; 


interface QuizQuestion {
  id: string | number; 
  text: string;
  options: { id: string | number; text: string }[];
  correctOptionId: string | number;
  points: number; 
  timeLimitSeconds?: number; 
}

interface AnswerDetail {
  questionId: string | number;
  selectedOptionId: string | number;
  isCorrect: boolean;
  timeTakenSeconds: number;
  scoreAwarded: number; 
  basePoints: number;
  speedBonus: number;
  streakBonusApplied: number; 
}

interface QuizEngineState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  currentScore: number;
  currentStreak: number; 
  answers: AnswerDetail[];
  quizState: "idle" | "loading" | "ongoing" | "completed";
  timeLeftForQuestion: number; 
  isQuestionActive: boolean; 
  startQuiz: (questions: QuizQuestion[]) => void;
  submitAnswer: (selectedOptionId: string | number, timeTakenSeconds: number) => void;
  nextQuestion: () => void; 
  completeQuiz: () => void; 
  resetQuiz: () => void;
  getCurrentQuestion: () => QuizQuestion | null;
}

const QuizEngineContext = createContext<QuizEngineState | undefined>(undefined);

export const useQuizEngine = (): QuizEngineState => {
  const context = useContext(QuizEngineContext);
  if (!context) {
    throw new Error("useQuizEngine must be used within a QuizEngineProvider");
  }
  return context;
};

interface QuizEngineProviderProps {
  children: ReactNode;
  defaultQuestionTimeLimit?: number; 
}

const MAX_QUESTION_TIME = 15; 

export const QuizEngineProvider: React.FC<QuizEngineProviderProps> = ({
  children,
  defaultQuestionTimeLimit = MAX_QUESTION_TIME,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerDetail[]>([]);
  const [quizState, setQuizState] = useState<QuizEngineState["quizState"]>("idle");
  const [timeLeftForQuestion, setTimeLeftForQuestion] = useState<number>(defaultQuestionTimeLimit);
  const [isQuestionActive, setIsQuestionActive] = useState<boolean>(false);

  const getCurrentQuestion = useCallback((): QuizQuestion | null => {
    if (quizState === "ongoing" && questions[currentQuestionIndex]) {
      return questions[currentQuestionIndex];
    }
    return null;
  }, [questions, currentQuestionIndex, quizState]);
  
  
  
  

  const completeQuiz = useCallback(() => {
    setQuizState("completed");
    setIsQuestionActive(false);
    
    
  }, []); 

  const nextQuestion = useCallback(() => {
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < questions.length) {
      setCurrentQuestionIndex(nextIdx);
      setTimeLeftForQuestion(questions[nextIdx]?.timeLimitSeconds ?? defaultQuestionTimeLimit);
      setIsQuestionActive(true);
    } else {
      completeQuiz(); 
    }
  }, [questions, currentQuestionIndex, defaultQuestionTimeLimit, completeQuiz]);

  const submitAnswer = useCallback((selectedOptionId: string | number, timeTakenSeconds: number) => {
    if (quizState !== "ongoing" || !isQuestionActive) return;

    const question = getCurrentQuestion();
    if (!question) return;

    setIsQuestionActive(false); 

    const isCorrect = question.correctOptionId === selectedOptionId;
    const basePoints = isCorrect ? question.points : 0;
    
    const questionSpecificTimeLimit = question.timeLimitSeconds ?? defaultQuestionTimeLimit;
    const speedBonus = isCorrect ? calculateSpeedBonus(timeTakenSeconds, questionSpecificTimeLimit) : 0;
    
    const streakBonusApplied = isCorrect ? calculateStreakBonus(currentStreak) : 0;

    const scoreAwarded = basePoints + speedBonus + streakBonusApplied;

    setAnswers(prevAnswers => [...prevAnswers, {
      questionId: question.id,
      selectedOptionId,
      isCorrect,
      timeTakenSeconds,
      scoreAwarded,
      basePoints,
      speedBonus,
      streakBonusApplied,
    }]);

    setCurrentScore(prevScore => prevScore + scoreAwarded);

    if (isCorrect) {
      setCurrentStreak(prevStreak => prevStreak + 1);
    } else {
      setCurrentStreak(0);
    }

    if (currentQuestionIndex < questions.length - 1) {
       nextQuestion(); 
    } else {
      completeQuiz(); 
    }
  }, [
    quizState, 
    isQuestionActive, 
    getCurrentQuestion, 
    questions, 
    currentQuestionIndex, 
    currentStreak, 
    defaultQuestionTimeLimit, 
    nextQuestion, 
    completeQuiz  
  ]);

  
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (quizState === "ongoing" && isQuestionActive && timeLeftForQuestion > 0) {
      timerId = setInterval(() => {
        setTimeLeftForQuestion((prevTime) => prevTime - 1);
      }, 1000);
    } else if (quizState === "ongoing" && isQuestionActive && timeLeftForQuestion === 0) {
      const currentQ = getCurrentQuestion();
      if (currentQ) {
        submitAnswer("", defaultQuestionTimeLimit); 
      }
    }
    return () => clearInterval(timerId);
  }, [quizState, isQuestionActive, timeLeftForQuestion, getCurrentQuestion, submitAnswer, defaultQuestionTimeLimit]);


  const startQuiz = useCallback((qs: QuizQuestion[]) => {
    setQuestions(qs);
    setCurrentQuestionIndex(0);
    setCurrentScore(0);
    setCurrentStreak(0);
    setAnswers([]);
    setQuizState("ongoing");
    setTimeLeftForQuestion(qs[0]?.timeLimitSeconds ?? defaultQuestionTimeLimit);
    setIsQuestionActive(true);
  }, [defaultQuestionTimeLimit]);

  const resetQuiz = useCallback(() => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentScore(0);
    setCurrentStreak(0);
    setAnswers([]);
    setQuizState("idle");
    setTimeLeftForQuestion(defaultQuestionTimeLimit);
    setIsQuestionActive(false);
  }, [defaultQuestionTimeLimit]);
  
  const contextValue: QuizEngineState = {
    questions,
    currentQuestionIndex,
    currentScore,
    currentStreak,
    answers,
    quizState,
    timeLeftForQuestion,
    isQuestionActive,
    startQuiz,
    submitAnswer,
    nextQuestion,
    completeQuiz,
    resetQuiz,
    getCurrentQuestion,
  };

  return (
    <QuizEngineContext.Provider value={contextValue}>
      {children}
    </QuizEngineContext.Provider>
  );
};
