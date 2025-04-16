import React from "react";

function Resultats({ joueurs, scores, reponses, questions, onReplay }) {
  const maxScore = Math.max(...scores);
  const gagnants = scores.reduce((arr, sc, idx) => (sc === maxScore ? [...arr, idx] : arr), []);

  return (
    <div className="resultats">
      <h2>Résultats du Quiz</h2>
      <div className="scores">
        {joueurs.map((j, idx) => (
          <div key={idx} className={gagnants.includes(idx) ? "gagnant" : ""}>
            <span className="badge">{j.nom}</span> : <b>{scores[idx]}</b> point{scores[idx] > 1 ? "s" : ""}
            {gagnants.includes(idx) && (
              <span className="badge badge-winner">🏆 Gagnant</span>
            )}
          </div>
        ))}
        {gagnants.length > 1 && <div className="egalite">Égalité !</div>}
      </div>
      <div className="details">
        {joueurs.map((j, idx) => (
          <div key={idx} className="reponses-joueur">
            <h3>Réponses de {j.nom}</h3>
            <ul>
              {reponses[idx].map((r, i) => (
  <li key={i} className={r.correct ? "bonne" : "mauvaise"}>
    {r.question} <br/>
    Votre réponse : {r.selected === -1 ? <i>Temps écoulé</i> : questions[i].choices[r.selected]} {r.correct ? "✅" : "❌"}
    {!r.correct && (
      <> (Bonne réponse : {questions[i].choices[questions[i].answer]})</>
    )}<br/>
    <span className="score-detail">
      Points obtenus : <b>{r.points}</b> {r.correct && <>(1 + {r.timeLeft} secondes restantes)</>}
    </span>
  </li>
))}
            </ul>
          </div>
        ))}
      </div>
      <button onClick={onReplay}>Rejouer</button>
    </div>
  );
}

export default Resultats;
