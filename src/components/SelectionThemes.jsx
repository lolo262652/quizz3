import React, { useState } from "react";

function SelectionThemes({ themes, onSelect, joueur }) {
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");

  function handleToggle(theme) {
    if (selected.includes(theme)) {
      setSelected(selected.filter(t => t !== theme));
    } else {
      setSelected([...selected, theme]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (selected.length < 2) {
      setError("Veuillez sélectionner au moins 2 thèmes.");
      return;
    }
    setError("");
    onSelect(selected);
  }

  return (
    <form className="themes-select" onSubmit={handleSubmit}>
      <h2>Choix des thèmes {joueur !== undefined ? `- Joueur ${joueur + 1}` : ""}</h2>
      <div className="themes-list">
        {themes.map(theme => (
          <label key={theme} className={selected.includes(theme) ? "selected" : ""}>
            <input
              type="checkbox"
              checked={selected.includes(theme)}
              onChange={() => handleToggle(theme)}
            />
            {theme}
          </label>
        ))}
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit">Valider</button>
    </form>
  );
}

export default SelectionThemes;
