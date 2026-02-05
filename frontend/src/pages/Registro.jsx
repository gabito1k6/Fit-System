import { useForm } from "react-hook-form";
import { sociosService } from "../services/socios.service";
import { useNavigate } from "react-router-dom";

function Registro() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await sociosService.crear(data);
      alert("✅ Socio registrado con éxito");
      navigate("/");
    } catch (error) {
      alert("❌ Error al registrar socio");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white fw-bold text-center py-3">
              📝 Nuevo Socio
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("nombre", { required: true })}
                  />
                  {errors.nombre && (
                    <span className="text-danger small">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Ej: 351..."
                    {...register("telefono", { required: true })}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Fecha de Pago</label>
                    <input
                      type="date"
                      className="form-control"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      {...register("fechaPago", { required: true })}
                    />
                  </div>

                  {/* --- CAMPO MONTO NUEVO --- */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">
                      Monto Inicial ($)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="15000"
                      {...register("monto", { required: true })}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Método de Pago</label>
                  <select className="form-select" {...register("metodoPago")}>
                    <option value="Efectivo">💵 Efectivo</option>
                    <option value="Transferencia">💸 Transferencia</option>
                    <option value="Tarjeta">💳 Tarjeta</option>
                  </select>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg fw-bold"
                  >
                    Guardar Socio
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/")}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
