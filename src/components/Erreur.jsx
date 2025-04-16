import React from "react";

function Erreur({ message, onRetry }) {
  return (
    <div>
      <p>Erreur : {message}</p>
      <button onClick={onRetry}>Recommencer</button>
    </div>
  );
}

export default Erreur;
