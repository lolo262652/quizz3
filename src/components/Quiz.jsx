import React, { useState, useEffect } from "react";

function Quiz({ questions, currentQuestion, onAnswer, joueurs, mode, timer, timeLeft, setTimer }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const q = questions[currentQuestion];
  const joueurIdx = mode === "duel" ? currentQuestion % 2 : 0;
  const joueurNom = joueurs[joueurIdx]?.nom || `Joueur ${joueurIdx + 1}`;

  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setIsCorrect(null);
    setTimer && setTimer(true);
    // Reset timer
    // eslint-disable-next-line
  }, [currentQuestion]);

  function handleSelect(idx) {
    setSelected(idx);
    // Validation immédiate
    setTimeout(() => {
      handleValidate(idx);
    }, 100); // petit délai pour l'effet visuel
  }

  function handleValidate(forcedIdx) {
    const answerIdx = forcedIdx !== undefined ? forcedIdx : selected;
    if (answerIdx === null) return;
    setShowResult(true);
    setIsCorrect(answerIdx === q.answer);
    setTimer && setTimer(false);
    setTimeout(() => {
      setShowResult(false);
      setSelected(null);
      setIsCorrect(null);
      onAnswer(answerIdx);
    }, 1200);
  }

  // Gestion du timer
  useEffect(() => {
    if (timer && timeLeft === 0 && !showResult) {
      setShowResult(true);
      setIsCorrect(false);
      setTimeout(() => {
        setShowResult(false);
        setSelected(null);
        setIsCorrect(null);
        onAnswer(-1);
      }, 1200);
    }
    // eslint-disable-next-line
  }, [timeLeft, timer]);

  // Déterminer si on doit tourner l'écran (mode duel, joueur 2)
  const rotate = mode === "duel" && joueurIdx === 1;
  return (
    <div className={`quiz${rotate ? " rotate180" : ""}`}>
      <h2>{mode === "duel" ? `${joueurNom} à vous de jouer !` : "Quiz Solo"}</h2>
      <div className="question-card">
        <div className="compteur">Question {currentQuestion + 1} / {questions.length}</div>
        <div className="theme">Thème : {q.theme}</div>
        <div className="question">{q.question}</div>
        <div className="choices">
          {q.choices.map((rep, idx) => (
            <button
              key={idx}
              className={
                selected === idx
                  ? "selected"
                  : showResult && q.answer === idx
                  ? "bonne-reponse"
                  : showResult && selected === idx && selected !== q.answer
                  ? "mauvaise-reponse"
                  : ""
              }
              onClick={() => handleSelect(idx)}
              disabled={showResult}
            >
              {rep}
            </button>
          ))}
        </div>
        {typeof timeLeft === "number" && (
          <div className="timer">Temps restant : {timeLeft}s</div>
        )}
        <div className="actions">
          <button onClick={handleValidate} disabled={selected === null || showResult}>
            Valider
          </button>
        </div>
        {showResult && (
          <div className={isCorrect ? "result-correct" : "result-wrong"}>
            {selected === q.answer
              ? "Bonne réponse !"
              : selected === -1
              ? "Temps écoulé !"
              : `Mauvaise réponse. La bonne réponse était : ${q.choices[q.answer]}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
