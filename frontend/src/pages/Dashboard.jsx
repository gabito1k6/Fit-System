import { useEffect, useState } from "react";
import { sociosService } from "../services/socios.service";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

function Dashboard() {
  const [socios, setSocios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [orden, setOrden] = useState("vencimiento");
  const [paginaActual, setPaginaActual] = useState(1);
  const [verInactivos, setVerInactivos] = useState(false);

  // Estados para modales
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);
  const [socioARenovar, setSocioARenovar] = useState(null);

  // --- ESTADOS NUEVOS PARA EDICIÓN ---
  const [editando, setEditando] = useState(false);
  const [datosEdicion, setDatosEdicion] = useState({
    nombre: "",
    telefono: "",
  });
  // -----------------------------------

  const { register, handleSubmit, reset } = useForm();
  const ELEMENTOS_POR_PAGINA = 5;

  useEffect(() => {
    cargarSocios();
  }, [verInactivos]);

  const cargarSocios = async () => {
    try {
      const data = await sociosService.obtenerTodos(verInactivos);
      setSocios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Dar de baja?")) {
      await sociosService.eliminar(id);
      cargarSocios();
    }
  };
  const handleReactivar = async (id) => {
    if (window.confirm("¿Reactivar?")) {
      await sociosService.reactivar(id);
      cargarSocios();
    }
  };

  const onRenovarSubmit = async (data) => {
    if (!socioARenovar) return;
    try {
      await sociosService.renovar(socioARenovar.id, data);
      alert(
        `✅ Registrado pago de $${data.monto} para ${socioARenovar.nombre}`,
      );
      setSocioARenovar(null);
      cargarSocios();
    } catch (error) {
      alert("Error al renovar");
    }
  };

  // --- FUNCIÓN PARA GUARDAR LA EDICIÓN ---
  const guardarEdicion = async () => {
    try {
      await sociosService.actualizar(socioSeleccionado.id, datosEdicion);
      alert("✅ Datos actualizados");
      setEditando(false);

      // Actualizamos la vista localmente para no recargar todo
      setSocioSeleccionado({ ...socioSeleccionado, ...datosEdicion });
      cargarSocios();
    } catch (error) {
      alert("❌ Error al actualizar");
    }
  };
  // ---------------------------------------

  const abrirFicha = (socio) => {
    setSocioSeleccionado(socio);
    setEditando(false); // Reseteamos el modo edición
    setDatosEdicion({ nombre: socio.nombre, telefono: socio.telefono }); // Cargamos datos actuales
  };

  const abrirRenovacion = (socio) => {
    setSocioARenovar(socio);
    reset({
      fechaPago: new Date().toISOString().split("T")[0],
      metodoPago: "Efectivo",
      monto: 15000,
    });
  };

  const formatearFecha = (f) => (f ? f.split("-").reverse().join("/") : "-");

  const sociosFiltrados = socios.filter((s) =>
    s.nombre.toLowerCase().includes(filtro.toLowerCase()),
  );
  const sociosOrdenados = [...sociosFiltrados].sort((a, b) =>
    orden === "vencimiento"
      ? new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento)
      : a.nombre.localeCompare(b.nombre),
  );
  const sociosPaginados = sociosOrdenados.slice(
    (paginaActual - 1) * ELEMENTOS_POR_PAGINA,
    paginaActual * ELEMENTOS_POR_PAGINA,
  );
  const totalPaginas = Math.ceil(sociosOrdenados.length / ELEMENTOS_POR_PAGINA);

  const enviarWhatsApp = (socio) => {
    let tel = socio.telefono.replace(/[^0-9]/g, "");
    if (tel.length === 10) tel = `549${tel}`;
    window.open(
      `https://wa.me/${tel}?text=${encodeURIComponent(`Hola ${socio.nombre}, Queríamos recordarte que tu cuota vence el ${formatearFecha(socio.fechaVencimiento)}`)}`,
      "_blank",
    );
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="text-primary fw-bold mb-0">
          {verInactivos ? "🗑️ Papelera" : "🏋️ Panel de Control"}
        </h2>
        <div className="d-flex gap-2 align-items-center">
          <div className="form-check form-switch me-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={verInactivos}
              onChange={(e) => setVerInactivos(e.target.checked)}
            />
            <label className="form-check-label fw-bold text-muted">
              {verInactivos ? "Volver" : "Ver Bajas"}
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
        <div className="mb-3 d-flex gap-2">
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

      {/* Tabla */}
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
                  const diasRest = Math.ceil(
                    (new Date(socio.fechaVencimiento) - new Date()) / 86400000,
                  );
                  const esUrgente = diasRest <= 3;
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
                          <span className="badge bg-secondary">Baja</span>
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
                            >
                              ♻️ Restaurar
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => abrirRenovacion(socio)}
                              >
                                💲 Renovar
                              </button>
                              {/* CAMBIO: Llamamos a abrirFicha en lugar de setSocioSeleccionado directo */}
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => abrirFicha(socio)}
                              >
                                👁️
                              </button>
                              {esUrgente && (
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => enviarWhatsApp(socio)}
                                >
                                  📱
                                </button>
                              )}
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleEliminar(socio.id)}
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
                    Sin resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <nav className="mt-4 d-flex justify-content-center">
          <ul className="pagination shadow-sm">
            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPaginaActual((p) => p - 1)}
              >
                Ant
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                {paginaActual} / {totalPaginas}
              </span>
            </li>
            <li
              className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPaginaActual((p) => p + 1)}
              >
                Sig
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* --- MODAL FICHA (AHORA CON EDICIÓN) --- */}
      {socioSeleccionado && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div
                className={`modal-header text-white ${editando ? "bg-warning" : "bg-secondary"}`}
              >
                <h5 className="modal-title">
                  {editando
                    ? "✏️ Editando Socio"
                    : `Ficha de ${socioSeleccionado.nombre}`}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSocioSeleccionado(null)}
                ></button>
              </div>

              <div className="modal-body">
                {/* SI ESTAMOS EDITANDO: Mostramos Inputs */}
                {editando ? (
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Nombre Completo:
                    </label>
                    <input
                      type="text"
                      className="form-control mb-3"
                      value={datosEdicion.nombre}
                      onChange={(e) =>
                        setDatosEdicion({
                          ...datosEdicion,
                          nombre: e.target.value,
                        })
                      }
                    />
                    <label className="form-label fw-bold">Teléfono:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={datosEdicion.telefono}
                      onChange={(e) =>
                        setDatosEdicion({
                          ...datosEdicion,
                          telefono: e.target.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  /* SI NO ESTAMOS EDITANDO: Mostramos Texto Normal */
                  <>
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
                  </>
                )}

                <hr className="my-3" />
                <h6 className="fw-bold text-dark">📜 Historial de Pagos</h6>
                {socioSeleccionado.Pagos &&
                socioSeleccionado.Pagos.length > 0 ? (
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <table className="table table-sm table-striped small mb-0">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th>Fecha</th>
                          <th>Método</th>
                          <th className="text-end">Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {socioSeleccionado.Pagos.map((pago, index) => (
                          <tr key={index}>
                            <td>{formatearFecha(pago.fecha)}</td>
                            <td>{pago.metodoPago}</td>
                            <td className="text-end text-success fw-bold">
                              ${pago.monto || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="alert alert-light text-center small">
                    Sin historial.
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {editando ? (
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditando(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-success fw-bold"
                      onClick={guardarEdicion}
                    >
                      💾 Guardar Cambios
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => setEditando(true)}
                    >
                      ✏️ Editar Datos
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSocioSeleccionado(null)}
                    >
                      Cerrar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RENOVAR */}
      {socioARenovar && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  💲 Renovar: {socioARenovar.nombre}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSocioARenovar(null)}
                ></button>
              </div>
              <form onSubmit={handleSubmit(onRenovarSubmit)}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Fecha de Pago:</label>
                    <input
                      type="date"
                      className="form-control"
                      {...register("fechaPago", { required: true })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Monto ($):</label>
                    <input
                      type="number"
                      className="form-control form-control-lg fw-bold text-primary"
                      placeholder="Ej: 15000"
                      {...register("monto", { required: true, min: 0 })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Método:</label>
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
                    Confirmar
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
