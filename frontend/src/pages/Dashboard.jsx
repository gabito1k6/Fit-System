import { useEffect, useState } from "react";
import { sociosService } from "../services/socios.service";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

function Dashboard() {
  const [socios, setSocios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [orden, setOrden] = useState("vencimiento");
  const [paginaActual, setPaginaActual] = useState(1);

  // Estados nuevos
  const [verInactivos, setVerInactivos] = useState(false);
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);
  const [socioARenovar, setSocioARenovar] = useState(null);

  // Formulario para la renovación
  const { register, handleSubmit, reset } = useForm();

  const ELEMENTOS_POR_PAGINA = 5;

  useEffect(() => {
    cargarSocios();
  }, [verInactivos]);

  const cargarSocios = async () => {
    try {
      const data = await sociosService.obtenerTodos(verInactivos); // Asegurate que en el service se llame obtenerTodos o obtenerSocios
      setSocios(data);
    } catch (error) {
      console.error("Error cargando socios:", error);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Dar de baja a este socio?")) {
      await sociosService.eliminar(id);
      cargarSocios();
    }
  };

  const handleReactivar = async (id) => {
    if (window.confirm("¿Volver a dar de alta a este socio?")) {
      await sociosService.reactivar(id);
      cargarSocios();
    }
  };

  const onRenovarSubmit = async (data) => {
    if (!socioARenovar) return;
    try {
      await sociosService.renovar(socioARenovar.id, data);
      alert(`✅ Cuota renovada para ${socioARenovar.nombre}`);
      setSocioARenovar(null);
      cargarSocios();
    } catch (error) {
      alert("Error al renovar");
    }
  };

  const abrirRenovacion = (socio) => {
    setSocioARenovar(socio);
    reset({
      fechaPago: new Date().toISOString().split("T")[0],
      metodoPago: "Efectivo",
    });
  };

  const formatearFecha = (fechaIso) => {
    if (!fechaIso) return "-";
    const [anio, mes, dia] = fechaIso.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  // Filtros y Orden
  const sociosFiltrados = socios.filter((s) =>
    s.nombre.toLowerCase().includes(filtro.toLowerCase()),
  );

  const sociosOrdenados = [...sociosFiltrados].sort((a, b) => {
    if (orden === "vencimiento") {
      return new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento);
    } else {
      return a.nombre.localeCompare(b.nombre);
    }
  });

  // Paginación
  const indiceUltimo = paginaActual * ELEMENTOS_POR_PAGINA;
  const indicePrimero = indiceUltimo - ELEMENTOS_POR_PAGINA;
  const sociosPaginados = sociosOrdenados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(sociosOrdenados.length / ELEMENTOS_POR_PAGINA);

  const enviarWhatsApp = (socio) => {
    let tel = socio.telefono.replace(/[^0-9]/g, "");
    if (tel.length === 10) tel = `549${tel}`;
    const fechaArg = formatearFecha(socio.fechaVencimiento);
    const url = `https://wa.me/${tel}?text=${encodeURIComponent(`Hola ${socio.nombre}, te recordamos que tu cuota vence el ${fechaArg}`)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="text-primary fw-bold mb-0">
          {verInactivos ? "🗑️ Papelera de Socios" : "🏋️ Panel de Control"}
        </h2>

        <div className="d-flex gap-2 align-items-center">
          <div className="form-check form-switch me-3">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              checked={verInactivos}
              onChange={(e) => setVerInactivos(e.target.checked)}
            />
            <label
              className="form-check-label fw-bold text-muted"
              htmlFor="flexSwitchCheckDefault"
            >
              {verInactivos ? "Volver a Activos" : "Ver Bajas"}
            </label>
          </div>

          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar..."
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPaginaActual(1);
            }}
          />
          {!verInactivos && (
            <Link to="/registro" className="btn btn-success text-nowrap">
              + Nuevo
            </Link>
          )}
        </div>
      </div>

      {!verInactivos && (
        <div className="mb-3 d-flex gap-2 align-items-center">
          <small className="fw-bold text-muted">Ordenar:</small>
          <button
            className={`btn btn-sm ${orden === "vencimiento" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setOrden("vencimiento")}
          >
            📅 Vencimiento
          </button>
          <button
            className={`btn btn-sm ${orden === "nombre" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setOrden("nombre")}
          >
            🅰️ Nombre
          </button>
        </div>
      )}

      {/* TABLA */}
      <div
        className={`card shadow border-0 overflow-hidden ${verInactivos ? "border-danger" : ""}`}
      >
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className={verInactivos ? "table-danger" : "table-light"}>
              <tr>
                <th className="ps-4">Socio</th>
                <th>Estado</th>
                <th className="text-end pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sociosPaginados.length > 0 ? (
                sociosPaginados.map((socio) => {
                  const diff = new Date(socio.fechaVencimiento) - new Date();
                  const diasRestantes = Math.ceil(diff / (1000 * 60 * 60 * 24));
                  const esUrgente = diasRestantes <= 3;

                  return (
                    <tr
                      key={socio.id}
                      style={{ opacity: verInactivos ? 0.7 : 1 }}
                    >
                      <td className="ps-4">
                        <div className="fw-bold text-dark">{socio.nombre}</div>
                        <div className="small text-muted">{socio.telefono}</div>
                      </td>
                      <td>
                        {verInactivos ? (
                          <span className="badge bg-secondary">
                            Dado de Baja
                          </span>
                        ) : (
                          <>
                            <div className="small text-muted">
                              Pagó: {formatearFecha(socio.fechaPago)}
                            </div>
                            <div
                              className={`fw-bold ${esUrgente ? "text-danger" : "text-dark"}`}
                            >
                              Vence: {formatearFecha(socio.fechaVencimiento)}
                            </div>
                            {esUrgente ? (
                              <span className="badge bg-danger mt-1">
                                ⏳ Por Vencer
                              </span>
                            ) : (
                              <span className="badge bg-success mt-1">
                                ✅ Al día
                              </span>
                            )}
                          </>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group">
                          {verInactivos ? (
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => handleReactivar(socio.id)}
                              title="Reactivar Socio"
                            >
                              ♻️ Restaurar
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => abrirRenovacion(socio)}
                                title="Renovar Cuota"
                              >
                                💲 Renovar
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setSocioSeleccionado(socio)}
                                title="Ver Ficha"
                              >
                                👁️
                              </button>
                              {esUrgente && (
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => enviarWhatsApp(socio)}
                                  title="Enviar WhatsApp"
                                >
                                  📱
                                </button>
                              )}
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleEliminar(socio.id)}
                                title="Dar de baja"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-5 text-muted">
                    No hay socios en esta lista.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPaginas > 1 && (
        <nav className="mt-4 d-flex justify-content-center">
          <ul className="pagination shadow-sm">
            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPaginaActual((p) => p - 1)}
              >
                Anterior
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                {paginaActual} de {totalPaginas}
              </span>
            </li>
            <li
              className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPaginaActual((p) => p + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* --- MODAL FICHA (CON HISTORIAL AGREGADO) --- */}
      {socioSeleccionado && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-secondary text-white">
                <h5 className="modal-title">
                  Ficha de {socioSeleccionado.nombre}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSocioSeleccionado(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>📞 Teléfono:</strong> {socioSeleccionado.telefono}
                </p>
                <p>
                  <strong>💳 Último Pago:</strong>{" "}
                  {formatearFecha(socioSeleccionado.fechaPago)} (
                  {socioSeleccionado.metodoPago})
                </p>
                <p className="text-danger fw-bold">
                  <strong>🚨 Vence:</strong>{" "}
                  {formatearFecha(socioSeleccionado.fechaVencimiento)}
                </p>

                <hr className="my-3" />

                {/* --- SECCIÓN NUEVA: HISTORIAL DE PAGOS --- */}
                <h6 className="fw-bold text-dark">📜 Historial de Pagos</h6>
                {socioSeleccionado.Pagos &&
                socioSeleccionado.Pagos.length > 0 ? (
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <table className="table table-sm table-striped small mb-0">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th>Fecha</th>
                          <th>Método</th>
                        </tr>
                      </thead>
                      <tbody>
                        {socioSeleccionado.Pagos.map((pago, index) => (
                          <tr key={index}>
                            <td>{formatearFecha(pago.fecha)}</td>
                            <td>{pago.metodoPago}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="alert alert-light text-center small text-muted border">
                    No hay historial disponible.
                  </div>
                )}
                {/* ----------------------------------------- */}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSocioSeleccionado(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL RENOVAR CUOTA --- */}
      {socioARenovar && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  💲 Renovar Cuota: {socioARenovar.nombre}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSocioARenovar(null)}
                ></button>
              </div>
              <form onSubmit={handleSubmit(onRenovarSubmit)}>
                <div className="modal-body">
                  <div className="alert alert-info small">
                    Esto actualizará la fecha de pago y extenderá el vencimiento
                    1 mes.
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Fecha de Pago:</label>
                    <input
                      type="date"
                      className="form-control"
                      {...register("fechaPago", { required: true })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Método de Pago:
                    </label>
                    <select className="form-select" {...register("metodoPago")}>
                      <option value="Efectivo">💵 Efectivo</option>
                      <option value="Transferencia">💸 Transferencia</option>
                      <option value="Tarjeta">💳 Tarjeta</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSocioARenovar(null)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Confirmar Renovación
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
