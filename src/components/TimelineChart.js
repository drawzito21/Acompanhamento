import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Tooltip,
  Legend
);


function TimelineChart({ data, theme }) {
  const ordemMeses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];

  const dadosOrdenados = ordemMeses
    .map((mes) => data.find((d) => d.MesValor === mes))
    .filter((d) => d && !isNaN(d.Score));

  const labels = dadosOrdenados.map((d) => d.Mês);
  const scores = dadosOrdenados.map((d) => d.Score);
  const finalizados = dadosOrdenados.map((d) =>
    parseInt(d.Finalizados || "0", 10)
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Score Mensal",
        data: scores,
        borderColor: "#4caf50",
        backgroundColor: "#a5d6a7",
        fill: false,
        tension: 0.2,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: "y"
      },
      {
        label: "Finalizados",
        data: finalizados,
        type: "bar",
        backgroundColor: "#42a5f5",
        yAxisID: "y1"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: theme.text }
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            context.dataset.label + ": " + context.formattedValue
        },
        bodyFont: { size: 16 },
        titleFont: { size: 17 }
      }
    },
    scales: {
      x: {
        ticks: { color: theme.text },
        grid: { color: theme.gridColor || "#ccc" }
      },
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        ticks: { color: theme.text },
        grid: { color: theme.gridColor || "#ccc" },
        title: { display: true, text: "Score", color: theme.text }
      },
      y1: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        ticks: { color: theme.text },
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Finalizados", color: theme.text }
      }
    }
  };

  return (
<div
  style={{
    marginTop: "32px",
    maxWidth: "900px", // era 700px
    margin: "32px auto"
  }}
>

      <h3 style={{ color: theme.text, marginBottom: "12px", textAlign: "center" }}>
        🕰️ Evolução mensal: Score × Finalizados
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default TimelineChart;

