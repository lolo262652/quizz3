import React from "react";

function Loader({ pendingQuestionsCount }) {
  return (
    <div>
      {pendingQuestionsCount
        ? `Génération de ${pendingQuestionsCount} question${pendingQuestionsCount > 1 ? 's' : ''}...`
        : 'Chargement...'}
    </div>
  );
}

export default Loader;
