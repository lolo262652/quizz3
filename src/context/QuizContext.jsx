import React, { createContext, useState } from "react";

export const QuizContext = createContext();

export function QuizProvider({ children }) {
  // État global du quiz (joueurs, scores, flow, etc.)
  const [state, setState] = useState({});

  return (
    <QuizContext.Provider value={{ state, setState }}>
      {children}
    </QuizContext.Provider>
  );
}
