import React, { useState, useEffect } from "react";

function DataTable({ rows, theme, getMedal, darkMode }) {
  const columnWidth = "15%";
  const [notasDetalhadas, setNotasDetalhadas] = useState(null);
  const [popupEstilo, setPopupEstilo] = useState({
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0.95)"
  });

  // Conversor de mês para número
  const mesParaNumero = {
    Janeiro: 0,
    Fevereiro: 1,
    Março: 2,
    Abril: 3,
    Maio: 4,
    Junho: 5,
    Julho: 6,
    Agosto: 7,
    Setembro: 8,
    Outubro: 9,
    Novembro: 10,
    Dezembro: 11
  };

  // Ordenação dos dados por data
  const rowsOrdenados = [...rows].sort((a, b) => {
    const dataA = new Date(a.Ano, mesParaNumero[a.Mês] || 0);
    const dataB = new Date(b.Ano, mesParaNumero[b.Mês] || 0);
    return dataA - dataB;
  });

  const cellStyle = {
    padding: "8px",
    borderBottom: `1px solid ${theme.tableBorder || "#ccc"}`,
    textAlign: "center",
    width: columnWidth,
    backgroundColor: theme.rowBackground || theme.background,
    color: theme.rowText || theme.text
  };

  const headerStyle = {
    padding: "8px",
    borderBottom: `1px solid ${theme.tableBorder || "#ccc"}`,
    textAlign: "center",
    backgroundColor: theme.tableHeader || "#f5f5f5",
    color: theme.headerText || theme.text,
    fontWeight: "bold",
    width: columnWidth,
    whiteSpace: "nowrap"
  };

  useEffect(() => {
    if (notasDetalhadas) {
      setTimeout(() => {
        setPopupEstilo({
          opacity: 1,
          transform: "translate(-50%, -50%) scale(1)"
        });
      }, 10);
    } else {
      setPopupEstilo({
        opacity: 0,
        transform: "translate(-50%, -50%) scale(0.95)"
      });
    }
  }, [notasDetalhadas]);

  return (
    <>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: theme.tableBackground,
          color: theme.text
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Nome</th>
            <th style={headerStyle}>Setor</th>
            <th style={headerStyle}>Mês/Ano</th>
            <th style={headerStyle}>Assumidos</th>
            <th style={headerStyle}>Finalizados</th>
            <th style={headerStyle}>Score</th>
          </tr>
        </thead>

        <tbody>
          {rowsOrdenados.map((item, idx) => (
            <tr key={idx}>
              <td style={{ ...cellStyle, textAlign: "left" }}>
                {item.Nome || "–"}
              </td>
              <td style={cellStyle}>{item.Setor || "–"}</td>
              <td style={cellStyle}>
                {item.Mês && item.Ano ? `${item.Mês} de ${item.Ano}` : "–"}
              </td>
              <td style={cellStyle}>{item.Assumidos || 0}</td>
              <td style={cellStyle}>{item.Finalizados || 0}</td>
              <td
                style={{
                  ...cellStyle,
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
                onClick={() =>
                  setNotasDetalhadas({
                    nome: item.Nome,
                    mes: item.Mês,
                    ano: item.Ano,
                    notas1: item.Notas1 || 0,
                    notas2: item.Notas2 || 0,
                    notas3: item.Notas3 || 0
                  })
                }
              >
                {getMedal?.(item.Nome)}{" "}
                {isNaN(item.Score) ? "–" : item.Score.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {notasDetalhadas && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            ...popupEstilo,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            backgroundColor: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#000",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
            zIndex: 999,
            maxWidth: "300px",
            transform: popupEstilo.transform,
            opacity: popupEstilo.opacity,
            textAlign: "center"
          }}
        >
          <h3 style={{ marginBottom: "12px" }}>
            📝 Notas de {notasDetalhadas.nome}
            <br />
            ({notasDetalhadas.mes} de {notasDetalhadas.ano})
          </h3>
          <p>🔴 Nota 1: {notasDetalhadas.notas1}</p>
          <p>🟠 Nota 2: {notasDetalhadas.notas2}</p>
          <p>🟡 Nota 3: {notasDetalhadas.notas3}</p>

          <button
            onClick={() => setNotasDetalhadas(null)}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Fechar
          </button>
        </div>
      )}
    </>
  );
}

export default DataTable;
