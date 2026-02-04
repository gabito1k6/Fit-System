import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🏋️‍♂️ GymSystem
        </Link>

        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-outline-light btn-sm">
            📊 Panel
          </Link>
          <Link
            to="/registro"
            className="btn btn-light btn-sm text-primary fw-bold"
          >
            ➕ Nuevo Socio
          </Link>
          <Link to="/estadisticas" className="btn btn-outline-light btn-sm">
            📈 Estadísticas
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
