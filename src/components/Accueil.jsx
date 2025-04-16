import React from "react";

function Accueil({ onModeSelect }) {
  return (
    <div>
      <h2>Bienvenue sur Quiz Duel</h2>
      <button onClick={() => onModeSelect("solo")}>Mode Solo</button>
      <button onClick={() => onModeSelect("duel")}>Mode Duel</button>
    </div>
  );
}

export default Accueil;
