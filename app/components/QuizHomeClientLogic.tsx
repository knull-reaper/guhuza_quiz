"use client";

import React, { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import QuizPageClientWrapper from './QuizPageClientWrapper';
import QuizHero from './quizHero';
import WhyplaySection from '../quiz/whyplaySection'; // Assuming this path is correct

const LOCAL_STORAGE_KEY = 'guhuzaQuizRulesShown';

interface QuizHomeClientLogicProps {
  playerTotalScore: number;
  startLevelNumber: number;
  // Add any other props needed by QuizHero or WhyplaySection if they are dynamic
}

const QuizHomeClientLogic: React.FC<QuizHomeClientLogicProps> = ({
  playerTotalScore,
  startLevelNumber,
}) => {
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const router = useRouter();

  const handleStartQuizClick = () => {
    const rulesShown = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (playerTotalScore === 0 && !rulesShown) {
      setShowRulesPopup(true);
      // Navigation will happen via handleClosePopupAndNavigate
    } else {
      router.push(`/quiz/${startLevelNumber}`);
    }
  };

  const handleClosePopupAndNavigate = () => {
    setShowRulesPopup(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    router.push(`/quiz/${startLevelNumber}`);
  };

  return (
    <QuizPageClientWrapper
      showRulesPopup={showRulesPopup}
      onCloseRulesPopup={handleClosePopupAndNavigate}
    >
      <div className="min-h-screen bg-gray-50"> {/* Consistent page background from original page.tsx */}
        <QuizHero 
          startLevelNumber={startLevelNumber} 
          onStartQuiz={handleStartQuizClick} // New prop for QuizHero
        />
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <WhyplaySection />
          </div>
        </section>
        {/* Any other sections that were part of the original page.tsx structure */}
      </div>
    </QuizPageClientWrapper>
  );
};

export default QuizHomeClientLogic;
