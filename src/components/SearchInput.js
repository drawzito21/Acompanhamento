import React, { useState, useRef } from "react";
import { styles } from "../styles";

export default function SearchInput({
  value,
  onChange,
  suggestions = [],
  onSelect
}) {
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const debounceRef = useRef();

  const nomesFiltrados = suggestions.filter((nome) =>
    nome.toLowerCase().includes(value.toLowerCase())
  );

  const handleChange = (e) => {
  clearTimeout(debounceRef.current);
  const novoValor = e.target.value;

  debounceRef.current = setTimeout(() => {
    onChange(novoValor);
    setMostrarSugestoes(true);
  }, 200);
};





  return (
    <div style={{ position: "relative", width: "240px" }}>
      <input
        type="text"
        placeholder="Buscar colaborador (V4)"
        value={value}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setMostrarSugestoes(false), 150)}
        style={styles.input}
      />

      {mostrarSugestoes && nomesFiltrados.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            listStyle: "none",
            padding: 0,
            margin: "4px 0 0",
            zIndex: 10,
            maxHeight: "200px",
            overflowY: "auto"
          }}
        >
          {nomesFiltrados.map((nome, idx) => {
            const start = nome.toLowerCase().indexOf(value.toLowerCase());
            const end = start + value.length;
            const prefix = nome.slice(0, start);
            const match = nome.slice(start, end);
            const suffix = nome.slice(end);

            return (
              <li
                key={idx}
                onMouseDown={() => {
                  onSelect(nome);
                  setMostrarSugestoes(false);
                }}
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer"
                }}
              >
                {prefix}
                <span style={{ fontWeight: "bold", color: "#2b5dab" }}>
                  {match}
                </span>
                {suffix}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
// componente desativado temporariamente

