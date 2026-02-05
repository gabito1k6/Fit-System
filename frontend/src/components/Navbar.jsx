import { Link } from "react-router-dom";
import keycloak from "../keycloak"; // Importamos la config para usar el logout

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🏋️‍♂️ GymSystem
        </Link>

        <div className="d-flex gap-2 align-items-center">
          <Link to="/" className="btn btn-outline-light btn-sm">
            📊 Panel
          </Link>
          <Link to="/estadisticas" className="btn btn-outline-light btn-sm">
            📈 Estadísticas
          </Link>
          <Link
            to="/registro"
            className="btn btn-light btn-sm text-primary fw-bold"
          >
            ➕ Nuevo
          </Link>

          {/* BOTÓN DE LOGOUT */}
          <button
            className="btn btn-danger btn-sm ms-2"
            onClick={() => keycloak.logout()}
            title="Cerrar Sesión"
          >
            🚪 Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
