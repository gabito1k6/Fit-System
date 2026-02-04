import { useEffect, useState } from "react";
import { sociosService } from "../services/socios.service";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function Estadisticas() {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const data = await sociosService.obtenerEstadisticas();
      setDatos(data);
    } catch (error) {
      console.error("Error cargando estadísticas");
    }
  };

  if (!datos)
    return (
      <div className="container mt-5 text-center">Cargando gráficos... 📊</div>
    );

  // --- PREPARAR DATOS PARA EL GRÁFICO MENSUAL ---
  // Ordenamos los meses (claves del objeto)
  const meses = Object.keys(datos.mensuales).sort(); // ['2024-01', '2024-02'...]

  const dataMensual = {
    labels: meses,
    datasets: [
      {
        label: "Efectivo 💵",
        data: meses.map((m) => datos.mensuales[m].Efectivo || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Transferencia 💸",
        data: meses.map((m) => datos.mensuales[m].Transferencia || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Tarjeta 💳",
        data: meses.map((m) => datos.mensuales[m].Tarjeta || 0),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const opciones = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Pagos por Mes y Método" },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary fw-bold mb-4">
        📈 Estadísticas del Gimnasio
      </h2>

      <div className="row">
        {/* Gráfico Principal */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow border-0 p-3">
            <Bar options={opciones} data={dataMensual} />
          </div>
        </div>

        {/* Tarjetas de Resumen Anual (Total 2026, etc) */}
        <div className="col-lg-4">
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white fw-bold">
              Resumen Anual
            </div>
            <div className="card-body">
              {Object.keys(datos.anuales)
                .sort()
                .reverse()
                .map((anio) => (
                  <div key={anio} className="mb-4">
                    <h5 className="border-bottom pb-2">Año {anio}</h5>
                    <div className="d-flex justify-content-between mb-1">
                      <span>💵 Efectivo:</span>
                      <strong>{datos.anuales[anio].Efectivo || 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>💸 Transferencia:</span>
                      <strong>{datos.anuales[anio].Transferencia || 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>💳 Tarjeta:</span>
                      <strong>{datos.anuales[anio].Tarjeta || 0}</strong>
                    </div>
                    <div className="alert alert-info mt-2 py-1 text-center fw-bold">
                      Total Pagos: {datos.anuales[anio].Total}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estadisticas;
