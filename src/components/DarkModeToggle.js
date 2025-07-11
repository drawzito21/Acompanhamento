import React from "react";

export default function DarkModeToggle({ darkMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        float: "right",
        marginBottom: 20,
        padding: "6px 12px",
        fontSize: 14,
        border: "1px solid #ccc",
        borderRadius: 4,
        backgroundColor: darkMode ? "#333" : "#eee",
        color: darkMode ? "#f0f0f0" : "#333",
        cursor: "pointer",
      }}
    >
      {darkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
    </button>
  );
}
