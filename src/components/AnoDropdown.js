import React from "react";

function AnoDropdown({ anos, selectedAno, setSelectedAno }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor="ano-select" style={{ marginRight: "8px", fontWeight: "bold" }}>
        📅 Ano:
      </label>
      <select
        id="ano-select"
        value={selectedAno}
        onChange={(e) => setSelectedAno(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          minWidth: "120px"
        }}
      >
        <option value="">Todos os anos</option>
        {anos.map((ano) => (
          <option key={ano} value={ano}>{ano}</option>
        ))}
      </select>
    </div>
  );
}

export default AnoDropdown;

