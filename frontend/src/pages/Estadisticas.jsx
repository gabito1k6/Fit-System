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
  // Estado para guardar el año que el usuario quiere ver (por defecto el actual)
  const [anioSeleccionado, setAnioSeleccionado] = useState(
    new Date().getFullYear().toString(),
  );

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const data = await sociosService.obtenerEstadisticas();
      setDatos(data);

      // Si el año actual no tiene datos aun, seleccionamos el ultimo año disponible
      const aniosDisponibles = Object.keys(data.anuales).sort().reverse();
      if (
        aniosDisponibles.length > 0 &&
        !aniosDisponibles.includes(new Date().getFullYear().toString())
      ) {
        setAnioSeleccionado(aniosDisponibles[0]);
      }
    } catch (error) {
      console.error("Error cargando estadísticas");
    }
  };

  if (!datos)
    return (
      <div className="container mt-5 text-center">Cargando gráficos... 📊</div>
    );

  // --- FILTRADO INTELIGENTE ---
  // 1. Obtenemos todos los años que existen en la base de datos
  const aniosDisponibles = Object.keys(datos.anuales).sort().reverse();

  // 2. Filtramos los meses para mostrar SOLO los del año seleccionado
  const mesesTodos = Object.keys(datos.mensuales).sort(); // ['2025-12', '2026-01', ...]
  const mesesFiltrados = mesesTodos.filter((mes) =>
    mes.startsWith(anioSeleccionado),
  );

  const dataMensual = {
    labels: mesesFiltrados, // Solo mostramos meses del año elegido
    datasets: [
      {
        label: "Efectivo 💵",
        data: mesesFiltrados.map((m) => datos.mensuales[m].Efectivo || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Transferencia 💸",
        data: mesesFiltrados.map((m) => datos.mensuales[m].Transferencia || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Tarjeta 💳",
        data: mesesFiltrados.map((m) => datos.mensuales[m].Tarjeta || 0),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const opciones = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Pagos Mensuales - Año ${anioSeleccionado}`,
      },
    },
    scales: { x: { stacked: true }, y: { stacked: true } },
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold mb-0">📈 Estadísticas</h2>

        {/* SELECTOR DE AÑO */}
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold">Ver Año:</label>
          <select
            className="form-select w-auto fw-bold border-primary"
            value={anioSeleccionado}
            onChange={(e) => setAnioSeleccionado(e.target.value)}
          >
            {aniosDisponibles.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
            {/* Por si la DB está vacía, mostramos el año actual */}
            {aniosDisponibles.length === 0 && (
              <option value={new Date().getFullYear()}>
                {new Date().getFullYear()}
              </option>
            )}
          </select>
        </div>
      </div>

      <div className="row">
        {/* Gráfico Principal (Filtrado) */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow border-0 p-3">
            {mesesFiltrados.length > 0 ? (
              <Bar options={opciones} data={dataMensual} />
            ) : (
              <div className="text-center py-5 text-muted">
                No hay pagos registrados en {anioSeleccionado} 💤
              </div>
            )}
          </div>
        </div>

        {/* Resumen Anual (Panel Lateral) */}
        <div className="col-lg-4">
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white fw-bold">
              Historial Anual
            </div>
            <div
              className="card-body"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {aniosDisponibles.map((anio) => (
                <div
                  key={anio}
                  className={`mb-4 p-2 rounded ${anio === anioSeleccionado ? "bg-light border" : ""}`}
                >
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                    <h5 className="mb-0 text-primary fw-bold">Año {anio}</h5>
                    {anio !== anioSeleccionado && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setAnioSeleccionado(anio)}
                      >
                        Ver 📊
                      </button>
                    )}
                  </div>

                  <div className="d-flex justify-content-between mb-1 small">
                    <span>💵 Efectivo:</span>{" "}
                    <strong>{datos.anuales[anio].Efectivo || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1 small">
                    <span>💸 Transferencia:</span>{" "}
                    <strong>{datos.anuales[anio].Transferencia || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1 small">
                    <span>💳 Tarjeta:</span>{" "}
                    <strong>{datos.anuales[anio].Tarjeta || 0}</strong>
                  </div>
                  <div className="alert alert-info mt-2 py-1 text-center fw-bold small">
                    Total: {datos.anuales[anio].Total} Pagos
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
