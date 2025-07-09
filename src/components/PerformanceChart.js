import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function PerformanceChart({ data, theme }) {
  const chartData = useMemo(() => {
    const agrupadoPorMes = {};

    data.forEach((item) => {
     const mes = `${item.Mês}/${item.Ano}`;
      const score = parseFloat(item.Score);
      const finalizados = parseInt(item.Finalizados, 10);

      if (!agrupadoPorMes[mes]) {
        agrupadoPorMes[mes] = { scoreTotal: 0, finalizadosTotal: 0, count: 0 };
      }

      if (!isNaN(score)) {
        agrupadoPorMes[mes].scoreTotal += score;
      }

      if (!isNaN(finalizados)) {
        agrupadoPorMes[mes].finalizadosTotal += finalizados;
      }

      agrupadoPorMes[mes].count += 1;
    });

    const labels = Object.keys(agrupadoPorMes).sort((a, b) => {
      // Ordenar os meses no formato "01/2023", "02/2023", etc.
      const [ma, ya] = a.split("/").map(Number);
      const [mb, yb] = b.split("/").map(Number);
      return ya !== yb ? ya - yb : ma - mb;
    });

    const scorePorMes = labels.map((mes) => {
      const dados = agrupadoPorMes[mes];
      return dados.count ? dados.scoreTotal / dados.count : 0;
    });

    const finalizadosPorMes = labels.map((mes) => {
      return agrupadoPorMes[mes].finalizadosTotal;
    });

    return {
      labels,
      datasets: [
        {
          label: "Score Médio",
          data: scorePorMes,
          borderColor: "#3e95cd",
          backgroundColor: "#3e95cd88",
          tension: 0.3,
          yAxisID: "y",
        },
        {
          label: "Finalizados",
          data: finalizadosPorMes,
          borderColor: "#ff6384",
          backgroundColor: "#ff638488",
          tension: 0.3,
          yAxisID: "y1",
        },
      ],
    };
  }, [data]);

    const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        labels: {
          color: theme.text,
        },
      },
      tooltip: {
  callbacks: {
    label: function (ctx) {
      const isFinalizados = ctx.dataset.label === "Finalizados";
      const valor = ctx.parsed.y;
      return `${ctx.dataset.label}: ${isFinalizados ? valor : valor.toFixed(2)}`;
    },
  },
},

    },
    scales: {
  x: {
    ticks: { color: theme.text },
  },
  y: {
    type: "linear",
    position: "left",
    min: 0,
    max: 5, // se quiser que o Score fique sempre entre 0 e 5
    ticks: {
      stepSize: 0.25, // deixa os pontos mais próximos
      color: theme.text,
    },
    title: {
      display: true,
      text: "Score",
      color: theme.text,
    },
  },
  y1: {
    type: "linear",
    position: "right",
    grid: { drawOnChartArea: false },
    min: 0,
    max: 500, // ajuste conforme a média de "Finalizados" que você tem
    ticks: {
      stepSize: 50,
      color: theme.text,
    },
    title: {
      display: true,
      text: "Finalizados",
      color: theme.text,
    },
  },
}

  };
  return (
  <div
    style={{
      marginTop: 40,
      backgroundColor: theme.tableBackground || theme.background,
      padding: 24,
      borderRadius: 10,
    }}
  >

      <h3 style={{ color: theme.text }}>📈 Evolução mensal do colaborador</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}
