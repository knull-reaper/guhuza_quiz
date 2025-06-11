"use client";

import React, { ReactNode } from 'react';
import GameRulesPopup from './GameRulesPopup';

interface QuizPageClientWrapperProps {
  children: ReactNode;
  showRulesPopup: boolean;
  onCloseRulesPopup: () => void;
}

const QuizPageClientWrapper: React.FC<QuizPageClientWrapperProps> = ({ 
  children, 
  showRulesPopup, 
  onCloseRulesPopup 
}) => {
  return (
    <>
      {showRulesPopup && <GameRulesPopup onClose={onCloseRulesPopup} />}
      {children}
    </>
  );
};

export default QuizPageClientWrapper;
