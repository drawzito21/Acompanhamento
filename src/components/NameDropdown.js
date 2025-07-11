import React from "react";
import { styles } from "../styles";

export default function NameDropdown({ names, selected, onChange, label }) {
  return (
    <div>
      {label && (
        <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
          {label}
        </label>
      )}
      <select value={selected} onChange={onChange} style={styles.dropdown}>
        <option value="">-- {label || "Selecione"} --</option>
        {names.map((name, idx) => (
          <option key={idx} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

