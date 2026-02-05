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
      const aniosDisponibles = Object.keys(data.anuales).sort().reverse();
      if (
        aniosDisponibles.length > 0 &&
        !aniosDisponibles.includes(new Date().getFullYear().toString())
      ) {
        setAnioSeleccionado(aniosDisponibles[0]);
      }
    } catch (error) {
      console.error("Error stats");
    }
  };

  if (!datos)
    return <div className="container mt-5 text-center">Cargando 💸...</div>;

  const aniosDisponibles = Object.keys(datos.anuales).sort().reverse();
  const mesesTodos = Object.keys(datos.mensuales).sort();
  const mesesFiltrados = mesesTodos.filter((mes) =>
    mes.startsWith(anioSeleccionado),
  );

  const dataMensual = {
    labels: mesesFiltrados,
    datasets: [
      {
        label: "Efectivo ($)",
        data: mesesFiltrados.map((m) => datos.mensuales[m].Efectivo || 0),
        backgroundColor: "#4bc0c0",
      },
      {
        label: "Transferencia ($)",
        data: mesesFiltrados.map((m) => datos.mensuales[m].Transferencia || 0),
        backgroundColor: "#36a2eb",
      },
      {
        label: "Tarjeta ($)",
        data: mesesFiltrados.map((m) => datos.mensuales[m].Tarjeta || 0),
        backgroundColor: "#ff6384",
      },
    ],
  };

  const opciones = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Ingresos Mensuales ($) - Año ${anioSeleccionado}`,
      },
    },
    scales: { x: { stacked: true }, y: { stacked: true } },
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold mb-0">📈 Finanzas y Recaudación</h2>
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold">Año:</label>
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
            {aniosDisponibles.length === 0 && (
              <option value={new Date().getFullYear()}>
                {new Date().getFullYear()}
              </option>
            )}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card shadow border-0 p-3">
            {mesesFiltrados.length > 0 ? (
              <Bar options={opciones} data={dataMensual} />
            ) : (
              <div className="text-center py-5 text-muted">
                Sin ingresos en {anioSeleccionado} 💸
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow border-0">
            <div className="card-header bg-success text-white fw-bold">
              Resumen Anual ($)
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
                    <h5 className="mb-0 text-success fw-bold">{anio}</h5>
                    {anio !== anioSeleccionado && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => setAnioSeleccionado(anio)}
                      >
                        Ver 📊
                      </button>
                    )}
                  </div>
                  <div className="d-flex justify-content-between mb-1 small">
                    <span>💵 Efectivo:</span>{" "}
                    <strong>${datos.anuales[anio].Efectivo || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1 small">
                    <span>💸 Transferencia:</span>{" "}
                    <strong>${datos.anuales[anio].Transferencia || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1 small">
                    <span>💳 Tarjeta:</span>{" "}
                    <strong>${datos.anuales[anio].Tarjeta || 0}</strong>
                  </div>
                  <div className="alert alert-success mt-2 py-2 text-center fw-bold">
                    Total: ${datos.anuales[anio].Total}
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
