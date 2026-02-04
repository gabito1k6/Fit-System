import { useForm } from "react-hook-form";
import { sociosService } from "../services/socios.service";
import { useNavigate } from "react-router-dom";

function Registro() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await sociosService.crear(data);
      alert("✅ Pago registrado correctamente");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-body">
          <h3 className="card-title text-center mb-4 text-primary fw-bold">
            <i className="bi bi-person-plus-fill me-2"></i>Registrar Nuevo Pago
          </h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Nombre */}
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label fw-semibold">
                Nombre Completo:
              </label>
              <input
                id="nombre"
                type="text"
                className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                placeholder="Ej: Juan Pérez"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                })}
              />
              {errors.nombre && (
                <div className="invalid-feedback">{errors.nombre.message}</div>
              )}
            </div>

            {/* Teléfono */}
            <div className="mb-3">
              <label htmlFor="telefono" className="form-label fw-semibold">
                WhatsApp:
              </label>
              <input
                id="telefono"
                type="tel"
                className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                placeholder="Ej: 3511234567"
                {...register("telefono", {
                  required: "Requerido para recordatorios",
                  pattern: { value: /^[0-9]+$/, message: "Solo números" },
                })}
              />
              <div className="form-text text-muted">
                Ingresá el número con característica (sin 0 ni 15).
              </div>
              {errors.telefono && (
                <div className="invalid-feedback">
                  {errors.telefono.message}
                </div>
              )}
            </div>

            {/* NUEVO: Método de Pago */}
            <div className="mb-3">
              <label htmlFor="metodoPago" className="form-label fw-semibold">
                Método de Pago:
              </label>
              <select
                id="metodoPago"
                className="form-select"
                {...register("metodoPago")}
              >
                <option value="Efectivo">💵 Efectivo</option>
                <option value="Transferencia">💸 Transferencia</option>
                <option value="Tarjeta">💳 Tarjeta Débito/Crédito</option>
              </select>
            </div>

            {/* Fecha */}
            <div className="mb-4">
              <label htmlFor="fechaPago" className="form-label fw-semibold">
                Fecha de Pago:
              </label>
              <input
                id="fechaPago"
                type="date"
                className={`form-control ${errors.fechaPago ? "is-invalid" : ""}`}
                {...register("fechaPago", {
                  required: "La fecha es obligatoria",
                })}
              />
              {errors.fechaPago && (
                <div className="invalid-feedback">
                  {errors.fechaPago.message}
                </div>
              )}
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Registrar Cobro 💾"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registro;
