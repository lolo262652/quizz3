import React, { useState } from "react";

function PasswordScreen({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (input === "lolo") {
      onUnlock();
    } else {
      setError("Mot de passe incorrect");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #161b33 0%, #1ec8e7 100%)"
    }}>
      <h1 style={{
        fontFamily: "'Press Start 2P', 'Segoe UI', Arial, sans-serif",
        color: "#fff",
        textShadow: "0 0 8px #1ec8e7, 0 0 16px #4f8cff",
        marginBottom: "2em"
      }}>Accès protégé</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5em" }}>
        <input
          type="password"
          placeholder="Mot de passe"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{
            padding: "1em 2em",
            borderRadius: 12,
            border: "2px solid #4f8cff",
            fontSize: "1.2em",
            fontFamily: "'Press Start 2P', 'Segoe UI', Arial, sans-serif",
            outline: "none"
          }}
        />
        <button type="submit" style={{
          background: "linear-gradient(90deg, #1ec8e7 0%, #4f8cff 100%)",
          color: "#fff",
          border: "2px solid #fff3",
          borderRadius: 12,
          padding: "0.9em 2em",
          fontSize: "1.1em",
          fontWeight: 700,
          boxShadow: "0 0 8px #1ec8e7cc, 0 2px 12px #4f8cff55",
          textShadow: "0 1px 2px #000a",
          letterSpacing: "0.05em",
          cursor: "pointer"
        }}>Entrer</button>
        {error && <div style={{ color: "#ff6464", fontWeight: 700 }}>{error}</div>}
      </form>
    </div>
  );
}

export default PasswordScreen;
