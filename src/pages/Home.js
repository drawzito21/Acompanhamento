import React from "react";
import { NameDropdown } from "../components";

export default function Home({
  data,
  selectedName,
  setSelectedName,
  selectedSetor,
  setSelectedSetor,
  selectedAno,
  setSelectedAno,
  selectedMes,
  setSelectedMes,
  uniqueNames,
  uniqueSetores,
  uniqueAnos,
  uniqueMeses
}) {
  return (
    <div style={{ paddingBottom: "24px" }}>
      <h3 style={{ marginBottom: "12px" }}>Filtros Avançados</h3>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          marginBottom: "24px",
          alignItems: "flex-start"
        }}
      >
        <div style={{ flex: "1 1 240px" }}>
          <NameDropdown
            names={uniqueNames}
            selected={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            label="Selecione o colaborador"
          />
        </div>

        <div style={{ flex: "1 1 240px" }}>
          <NameDropdown
            names={uniqueSetores}
            selected={selectedSetor}
            onChange={(e) => setSelectedSetor(e.target.value)}
            label="Selecione o setor"
          />
        </div>

        <div style={{ flex: "1 1 240px" }}>
          <NameDropdown
            names={uniqueAnos}
            selected={selectedAno}
            onChange={(e) => setSelectedAno(e.target.value)}
            label="Selecione o ano"
          />
        </div>

        <div style={{ flex: "1 1 240px" }}>
          <NameDropdown
            names={uniqueMeses}
            selected={selectedMes}
            onChange={(e) => setSelectedMes(e.target.value)}
            label="Selecione o mês"
          />
        </div>
      </div>
    </div>
  );
}

