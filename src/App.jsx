import React, { useState, useEffect, useContext } from "react";
import { QuizProvider, QuizContext } from "./context/QuizContext";
import Accueil from "./components/Accueil";
import FormulaireJoueur from "./components/FormulaireJoueur";
import SelectionThemes from "./components/SelectionThemes";
import Quiz from "./components/Quiz";
import Resultats from "./components/Resultats";
import Erreur from "./components/Erreur";
import Loader from "./components/Loader";
import { THEMES } from "./data/themes";
import { genererQuestionsLocal } from "./utils/genererQuestionsLocal";

function AppFlow() {
  const [pendingQuestionsCount, setPendingQuestionsCount] = useState(null);
  const { state, setState } = useContext(QuizContext);
  const [step, setStep] = useState("accueil");
  const [mode, setMode] = useState(null); // "solo" ou "duel"
  const [joueurs, setJoueurs] = useState([]); // [{ nom, sexe, age }]
  const [currentJoueur, setCurrentJoueur] = useState(0);
  const [themes, setThemes] = useState([]); // [[...], [...]]
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [reponses, setReponses] = useState([[], []]);
  const [timer, setTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Gestion de la rotation globale
  let rotate = false;
  if (mode === "duel") {
    if (["formulaire", "themes"].includes(step)) {
      rotate = currentJoueur === 1;
    } else if (step === "quiz") {
      rotate = currentQuestion % 2 === 1;
    }
  }
  useEffect(() => {
    if (rotate) {
      document.body.classList.add("rotate180");
    } else {
      document.body.classList.remove("rotate180");
    }
    return () => {
      document.body.classList.remove("rotate180");
    };
  }, [rotate]);

  // Gestion du timer (optionnel)
  useEffect(() => {
    if (timer && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer && timeLeft === 0) {
      handleTimeout();
    }
  }, [timer, timeLeft]);

  // Génération locale des questions sans backend
  async function genererQuestionsOpenAI(themesChoisis) {
    const nbQuestions = mode === "duel" ? 20 : 10; // 10 questions par joueur
    setPendingQuestionsCount(nbQuestions);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ themes: themesChoisis, nbQuestions })
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la génération des questions");
      }
      const data = await response.json();
      // Parsing automatique de la réponse GPT
      // On attend un format : chaque question sur plusieurs lignes, séparée par \n ou \n\n
      // Exemple attendu :
      // 1. Question ?\nA. ...\nB. ...\nC. ...\nD. ...\nRéponse : ...
      const questionsArray = [];
      const blocks = data.questions.split(/\n\n|\n(?=\d+\.)/).filter(Boolean);
      for (const block of blocks) {
        const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length < 6) continue;
        let question = "";
        if (/^\[.*\]/.test(lines[0]) && lines.length > 1) {
          question = lines[1];
        } else {
          question = lines[0].replace(/^\d+\.\s*/, "");
        }
        if (!question || question.trim() === "" || /^[A-D][\.:\)]/i.test(question)) {
          question = "(question manquante dans le texte généré)";
        }
        // Prend les 4 lignes après la question comme choix (sans lettre devant)
        let choicesIdx = 1;
        if (/^\[.*\]/.test(lines[0]) && lines.length > 5) {
          // [Thème] sur la première ligne, question sur la suivante
          choicesIdx = 2;
        }
        // Nettoie chaque choix : retire la virgule finale et le ']' final
        const cleanChoice = c => c.replace(/[\],]+$/, '').trim();
        const choices = lines.slice(choicesIdx, choicesIdx + 4).map(cleanChoice);
        const answerLine = lines.find(l => l.toLowerCase().startsWith("réponse"));
        let answerText = answerLine ? answerLine.split(":")[1].trim() : "";
        // Nettoie la réponse extraite
        answerText = answerText.replace(/[\],]+$/, '').trim();
        if (!answerLine || !answerText) {
          console.warn('Bloc question sans bonne réponse détecté:', block);
        } else {
          console.warn('Réponse extraite:', answerText, 'depuis', answerLine);
        }
        // Compare la réponse extraite avec les choix (tolérance et inclusion)
        const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
        let answer = choices.findIndex(choice =>
          normalize(choice).includes(normalize(answerText))
        );
        questionsArray.push({ question, choices, answer });
      }
      return questionsArray;
    } catch (e) {
      setError("Erreur lors de la génération des questions via GPT-4");
      setStep('erreur');
      return [];
    } finally {
      setPendingQuestionsCount(null);
      setLoading(false);
    }
  }

  // Gestion des étapes
  function handleModeSelect(selectedMode) {
    setMode(selectedMode);
    setJoueurs([]);
    setCurrentJoueur(0);
    setStep("formulaire");
  }

  function handleJoueurSubmit(joueur) {
    const newJoueurs = [...joueurs, joueur];
    setJoueurs(newJoueurs);
    if (mode === "duel" && newJoueurs.length < 2) {
      setCurrentJoueur(1);
    } else {
      setStep("themes");
      setCurrentJoueur(0);
    }
  }

  async function handleThemesSelect(themesSelectionnes) {
    const newThemes = [...themes, themesSelectionnes];
    setThemes(newThemes);
    // Générer les questions dès la sélection des thèmes de chaque joueur en mode duel
    let allThemes;
    if (mode === "duel") {
      allThemes = newThemes[newThemes.length - 1]; // thèmes du joueur courant
    } else {
      allThemes = newThemes[0];
    }
    const qs = await genererQuestionsOpenAI(allThemes);
    if (qs.length > 0) {
      setQuestions(qs);
      setCurrentQuestion(0);
      setStep("quiz");
    }
  }

  function handleAnswer(selected) {
    const q = questions[currentQuestion];
    const joueurIdx = mode === "duel" ? currentQuestion % 2 : 0;
    const bonneReponse = q.answer;
    const isCorrect = selected === bonneReponse;
    // Calcul du score : 1 + temps restant si bonne réponse, sinon 0
    const points = isCorrect ? 1 + timeLeft : 0;
    const newScores = [...scores];
    newScores[joueurIdx] += points;
    setScores(newScores);
    const newReponses = reponses.map(arr => [...arr]);
    newReponses[joueurIdx].push({
      question: q.question,
      selected,
      correct: isCorrect,
      bonneReponse,
      points, // on stocke le score de la question
      timeLeft
    });
    setReponses(newReponses);
    // Question suivante ou résultats
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(10);
    } else {
      setStep("resultats");
    }
  }

  function handleTimeout() {
    // Si le timer atteint 0, on considère la réponse comme fausse
    handleAnswer(-1);
    setTimeLeft(10);
  }

  function handleRetry() {
    setError(null);
    setStep("accueil");
    setMode(null);
    setJoueurs([]);
    setThemes([]);
    setQuestions([]);
    setScores([0, 0]);
    setReponses([[], []]);
    setCurrentQuestion(0);
  }

  function handleReplay() {
    setStep("accueil");
    setMode(null);
    setJoueurs([]);
    setThemes([]);
    setQuestions([]);
    setScores([0, 0]);
    setReponses([[], []]);
    setCurrentQuestion(0);
  }

  // Les hooks sont tous appelés AVANT tout return conditionnel !
  if (loading) return <Loader pendingQuestionsCount={pendingQuestionsCount} />;
  if (step === "erreur")
    return <Erreur message={error} onRetry={handleRetry} />;

  return (
    <div className="App">
      {step === "accueil" && <Accueil onModeSelect={handleModeSelect} />}
      {step === "formulaire" && (
        <FormulaireJoueur joueur={currentJoueur} onSubmit={handleJoueurSubmit} />
      )}
      {step === "themes" && (
        <SelectionThemes
          themes={THEMES}
          onSelect={handleThemesSelect}
          joueur={mode === "duel" ? currentJoueur : undefined}
        />
      )}
      {step === "quiz" && (
        <Quiz
          questions={questions}
          currentQuestion={currentQuestion}
          onAnswer={handleAnswer}
          joueurs={joueurs}
          mode={mode}
          timer={timer}
          timeLeft={timeLeft}
          setTimer={setTimer}
        />
      )}
      {step === "resultats" && (
        <Resultats
          joueurs={joueurs}
          scores={scores}
          reponses={reponses}
          questions={questions}
          onReplay={handleReplay}
        />
      )}
      {/* loading et error déjà gérés par les returns ci-dessus */}
    </div>
  );
}

import PasswordScreen from "./components/PasswordScreen";

function App() {
  const [unlocked, setUnlocked] = React.useState(false);
  return (
    unlocked ? (
      <QuizProvider>
        <AppFlow />
      </QuizProvider>
    ) : (
      <PasswordScreen onUnlock={() => setUnlocked(true)} />
    )
  );
}

export default App;
