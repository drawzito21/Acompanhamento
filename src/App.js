import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import jsPDF from "jspdf";

import {
  DarkModeToggle,
  DataTable,
  PerformanceChart
} from "./components";

import Registro from "./pages/Registro";
import Home from "./pages/Home";
import TimelineChart from "./components/TimelineChart";
import { styles } from "./styles";
import { lightTheme, darkTheme } from "./theme";

function App() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedSetor, setSelectedSetor] = useState("");
  const [selectedAno, setSelectedAno] = useState("");
  const [selectedMes, setSelectedMes] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [filtrosLimpos, setFiltrosLimpos] = useState(false);

  const theme = darkMode ? darkTheme : lightTheme;

  // Carrega os dados do CSV ao iniciar
  useEffect(() => {
    fetch("/dados_v4.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const results = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim(),
          transform: (v) => v.trim()
        });

        const dadosFormatados = results.data.map((item) => {
          const mesLimpo = item.Mês?.trim().toLowerCase() || "";
          const scoreLimpo = item.Score
            ? parseFloat(String(item.Score).replace(",", "."))
            : 0;
          const anoLimpo = item.Ano?.toString().trim() || "";

          return {
            Nome: item.Nome,
            Setor: item.Setor,
            Mês: mesLimpo,
            MesValor: mesLimpo,
            Assumidos: item.Assumidos,
            Finalizados: item.Finalizados,
            Score: scoreLimpo,
            Ano: anoLimpo,
            Notas1: parseInt(item.Notas1 || "0", 10),
            Notas2: parseInt(item.Notas2 || "0", 10),
            Notas3: parseInt(item.Notas3 || "0", 10)
          };
        });

        setData(dadosFormatados);
      });
  }, []);

  const ordemMeses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];

  const uniqueNames = useMemo(() => {
    const names = new Set();
    data.forEach((item) => {
      const matchSetor = selectedSetor ? item.Setor === selectedSetor : true;
      if (item.Nome && matchSetor) names.add(item.Nome);
    });
    return Array.from(names).sort();
  }, [data, selectedSetor]);

  const uniqueSetores = useMemo(() => {
    const setores = new Set();
    data.forEach((item) => item.Setor && setores.add(item.Setor));
    return Array.from(setores).sort();
  }, [data]);

  const uniqueAnos = useMemo(() => {
    const anos = new Set();
    data.forEach((item) => {
      if (item.Ano) anos.add(item.Ano.toString().trim());
    });
    return Array.from(anos).sort().reverse();
  }, [data]);

const normalizar = (texto) =>
  texto?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const uniqueMeses = useMemo(() => {
  const mesesSet = new Set();
  data.forEach((item) => {
    if (item.MesValor) mesesSet.add(normalizar(item.MesValor));
  });
  const mesesArray = Array.from(mesesSet);
  return ordemMeses.filter((mes) => mesesArray.includes(normalizar(mes)));
}, [data]);

const displayData = useMemo(() => {
  const dadosFiltrados = data.filter((d) => {
    const matchName = selectedName
      ? normalizar(d.Nome) === normalizar(selectedName)
      : true;

    const matchSetor = selectedSetor
      ? normalizar(d.Setor) === normalizar(selectedSetor)
      : true;

    const matchAno = selectedAno
      ? d.Ano?.toString().trim() === selectedAno
      : true;

    const matchMes = selectedMes
      ? normalizar(d.MesValor) === normalizar(selectedMes)
      : true;

    return matchName && matchSetor && matchAno && matchMes;
  });

  const meses = {
    janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
    julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
  };

  return dadosFiltrados.sort((a, b) => {
    const dataA = new Date(a.Ano, meses[normalizar(a.MesValor)] || 0);
    const dataB = new Date(b.Ano, meses[normalizar(b.MesValor)] || 0);
    return dataA - dataB;
  });
}, [selectedName, selectedSetor, selectedAno, selectedMes, data]);
 
  const timelineData = useMemo(() => {
    if (!selectedName) return [];
    return data.filter(
      (d) => d.Nome === selectedName && d.Ano && d.MesValor && !isNaN(d.Score)
    );
  }, [selectedName, data]);

  const getMedal = (nome) => {
    const emComparacaoSetorMes = selectedSetor && selectedMes && !selectedName;
    const top3 = [...displayData]
      .filter((d) => !isNaN(d.Score))
      .sort((a, b) => b.Score - a.Score)
      .slice(0, 3);

    if (!emComparacaoSetorMes || !nome) return null;
    if (top3[0]?.Nome === nome) return "🥇";
    if (top3[1]?.Nome === nome) return "🥈";
    if (top3[2]?.Nome === nome) return "🥉";
    return null;
  };

  const handleExportCsv = () => {
    const headers = [
      "Nome", "Setor", "Mês", "Ano", "Score", "Assumidos",
      "Finalizados", "Notas1", "Notas2", "Notas3"
    ];

    const csvContent = [
      headers.join(";"),
      ...displayData.map((row) => {
        return [
          `"${row.Nome || ""}"`,
          `"${row.Setor || ""}"`,
          `"${row.MesValor || ""}"`,
          `"${row.Ano || ""}"`,
          `"${isNaN(row.Score) ? "" : row.Score.toFixed(2)}"`,
          `"${row.Assumidos || 0}"`,
          `"${row.Finalizados || 0}"`,
          `"${row.Notas1 || 0}"`,
          `"${row.Notas2 || 0}"`,
          `"${row.Notas3 || 0}"`
        ].join(";");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resultados_filtrados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");

    y += 10;

    doc.setFontSize(18);
doc.setFont("helvetica", "bold");
doc.text("Relatório de Resultados Filtrados", 20, y);
y += 12;

displayData.forEach((item) => {
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  doc.text(` Nome: ${item.Nome}`, 25, y); y += 6;
  doc.text(` Mês/Ano: ${item.MesValor}/${item.Ano}`, 25, y); y += 6;
  doc.text(` Score: ${item.Score}`, 25, y); y += 6;
  doc.text(` Assumidos: ${item.Assumidos}`, 25, y); y += 6;
  doc.text(` Finalizados: ${item.Finalizados}`, 25, y); y += 6;
  doc.text(` Notas: ${item.Notas1}, ${item.Notas2}, ${item.Notas3}`, 25, y); y += 6;

  doc.setDrawColor(180);
  doc.line(20, y, 180, y); // separador
  y += 10;

  if (y >= 270) {
    doc.addPage();
    y = 20;
  }
});

doc.setFontSize(10);
doc.setTextColor(150);
doc.text("Gerado por colaborador-resultados-app", 20, 285);

    doc.save("resultados_filtrados.pdf");
  };

  const limparFiltros = () => {
    setSelectedName("");
    setSelectedSetor("");
    setSelectedAno("");
    setSelectedMes("");
    setFiltrosLimpos(true);
    setTimeout(() => setFiltrosLimpos(false), 3000);
  };

  const filtrosAtivos = selectedName || selectedSetor || selectedAno || selectedMes;

  const homeProps = {
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
  };

  return (
  <div
    style={{
      ...styles.container,
      backgroundColor: theme.background,
      color: theme.text,
      minHeight: "100vh",
      padding: "32px"
    }}
  >
      {/* Alternância de tema claro/escuro */}
    <DarkModeToggle
      darkMode={darkMode}
      onToggle={() => setDarkMode(!darkMode)}
    />

    {/* Rotas principais do app */}
    <Routes>
      <Route path="/" element={<Home {...homeProps} />} />
      <Route path="/registrar/:id" element={<Registro />} />
    </Routes>

    {/* Exibição dos dados filtrados */}
    {filtrosAtivos && displayData.length > 0 && (
      <div
        style={{
          backgroundColor: theme.tableBackground || theme.background,
          color: theme.text,
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          padding: "32px",
          marginTop: "32px"
        }}
      >
        <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>
          📊 Resultados filtrados
        </h3>

        {/* Botões de ação */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "16px",
            flexWrap: "wrap"
          }}
        >
          <button
            onClick={handleExportCsv}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2196f3",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            📤 Exportar CSV
          </button>

          <button
            onClick={handleExportPdf}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            🗎 Exportar PDF
          </button>

          <button
            onClick={limparFiltros}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            🧹 Limpar Filtros
          </button>
        </div>

        {/* Tabela com dados filtrados */}
        <div style={{ overflowX: "auto", width: "100%" }}>
<DataTable
  rows={displayData}
  theme={theme}
  getMedal={getMedal}
  darkMode={darkMode} // 👈 aqui!
/>

        </div>

        {/* Gráfico de desempenho do colaborador */}
        {selectedName && timelineData.length > 0 && (
          <div
            style={{
              marginTop: "32px",
              backgroundColor: theme.tableBackground,
              padding: "24px",
              borderRadius: "10px"
            }}
          >
            <TimelineChart data={timelineData} theme={theme} />
          </div>
        )}
      </div>
    )}

    {/* Rodapé */}
    <footer style={styles.footer}>
      Desenvolvido por <strong>André Tavares</strong> 😎
    </footer>
     </div>
  );
} // fim da função App

export default App; // fora da função, no nível do módulo


