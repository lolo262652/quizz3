// Génère des questions aléatoires côté front sans backend ni OpenAI
export function genererQuestionsLocal(themesChoisis, nbQuestions = 10) {
  // Questions types par thème (à enrichir si besoin)
  const baseQuestions = {
    "Histoire": [
      {
        question: "Qui était le premier président de la République française ?",
        correct_answer: "Louis-Napoléon Bonaparte",
        incorrect_answers: ["Charles de Gaulle", "Napoléon Ier", "Jacques Chirac"]
      },
      {
        question: "En quelle année la Révolution française a-t-elle commencé ?",
        correct_answer: "1789",
        incorrect_answers: ["1792", "1776", "1815"]
      }
    ],
    "Sciences": [
      {
        question: "Quelle est la formule chimique de l’eau ?",
        correct_answer: "H2O",
        incorrect_answers: ["CO2", "O2", "NaCl"]
      },
      {
        question: "Quel est l’organe principal de la respiration ?",
        correct_answer: "Le poumon",
        incorrect_answers: ["Le cœur", "Le foie", "Le rein"]
      }
    ],
    "Sport": [
      {
        question: "Combien de joueurs dans une équipe de football ?",
        correct_answer: "11",
        incorrect_answers: ["7", "9", "15"]
      },
      {
        question: "Quel pays a remporté la Coupe du Monde 2018 ?",
        correct_answer: "France",
        incorrect_answers: ["Brésil", "Allemagne", "Argentine"]
      }
    ],
    "Géographie": [
      {
        question: "Quelle est la capitale du Canada ?",
        correct_answer: "Ottawa",
        incorrect_answers: ["Toronto", "Vancouver", "Montréal"]
      },
      {
        question: "Quel est le plus long fleuve du monde ?",
        correct_answer: "Le Nil",
        incorrect_answers: ["L’Amazone", "Le Mississippi", "Le Yangtsé"]
      }
    ],
    "Culture Générale": [
      {
        question: "Combien y a-t-il de continents sur Terre ?",
        correct_answer: "7",
        incorrect_answers: ["5", "6", "8"]
      },
      {
        question: "Quel est le plus grand océan du monde ?",
        correct_answer: "Océan Pacifique",
        incorrect_answers: ["Océan Atlantique", "Océan Indien", "Océan Arctique"]
      }
    ],
    "Cinéma": [
      {
        question: "Qui a réalisé le film ‘Inception’ ?",
        correct_answer: "Christopher Nolan",
        incorrect_answers: ["Steven Spielberg", "James Cameron", "Quentin Tarantino"]
      },
      {
        question: "Quel film a remporté l’Oscar du meilleur film en 2020 ?",
        correct_answer: "Parasite",
        incorrect_answers: ["1917", "Joker", "Once Upon a Time in Hollywood"]
      }
    ],
    "Musique": [
      {
        question: "Quel groupe a chanté ‘Bohemian Rhapsody’ ?",
        correct_answer: "Queen",
        incorrect_answers: ["The Beatles", "Pink Floyd", "Led Zeppelin"]
      },
      {
        question: "Qui est l’auteur de la chanson ‘Imagine’ ?",
        correct_answer: "John Lennon",
        incorrect_answers: ["Paul McCartney", "Elton John", "David Bowie"]
      }
    ],
    "Technologie": [
      {
        question: "Qui a fondé Microsoft ?",
        correct_answer: "Bill Gates",
        incorrect_answers: ["Steve Jobs", "Elon Musk", "Mark Zuckerberg"]
      },
      {
        question: "Quel langage de programmation est utilisé pour le web côté client ?",
        correct_answer: "JavaScript",
        incorrect_answers: ["Python", "C++", "Java"]
      }
    ]
  };

  // Mélange utilitaire
  function shuffle(arr) {
    return arr.map(v => [v, Math.random()]).sort((a, b) => a[1] - b[1]).map(v => v[0]);
  }

  // Récupère des questions selon les thèmes sélectionnés
  let pool = [];
  themesChoisis.forEach(theme => {
    if (baseQuestions[theme]) pool = pool.concat(baseQuestions[theme]);
  });
  if (pool.length === 0) pool = Object.values(baseQuestions).flat();

  const selected = shuffle(pool).slice(0, nbQuestions);
  return selected.map((q, i) => {
    const choices = shuffle([q.correct_answer, ...q.incorrect_answers]);
    return {
      id: i,
      theme: themesChoisis[i % themesChoisis.length] || "Général",
      question: q.question,
      choices,
      answer: choices.findIndex(c => c === q.correct_answer)
    };
  });
}
