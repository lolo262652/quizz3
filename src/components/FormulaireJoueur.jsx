import React, { useState } from "react";

function FormulaireJoueur({ joueur, onSubmit }) {
  const [nom, setNom] = useState("");
  const [sexe, setSexe] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!nom || !sexe || !age) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (isNaN(age) || age < 5 || age > 120) {
      setError("Âge invalide.");
      return;
    }
    setError("");
    onSubmit({ nom, sexe, age: Number(age) });
  }

  return (
    <form className="form-joueur" onSubmit={handleSubmit}>
      <h2>Joueur {joueur + 1}</h2>
      <label>
        Nom :
        <input type="text" value={nom} onChange={e => setNom(e.target.value)} required />
      </label>
      <label>
        Sexe :
        <select value={sexe} onChange={e => setSexe(e.target.value)} required>
          <option value="">-- Choisir --</option>
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
          <option value="Autre">Autre</option>
        </select>
      </label>
      <label>
        Âge :
        <input type="number" min="5" max="120" value={age} onChange={e => setAge(e.target.value)} required />
      </label>
      {error && <div className="error">{error}</div>}
      <button type="submit">Valider</button>
    </form>
  );
}

export default FormulaireJoueur;
