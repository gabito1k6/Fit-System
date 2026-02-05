import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import keycloak from "./keycloak";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Inicializamos Keycloak
keycloak
  .init({
    onLoad: "login-required", // 🔒 ESTO ES EL CANDADO: Obliga a loguearse
    checkLoginIframe: false, // Evita problemas de cookies en desarrollo
  })
  .then((authenticated) => {
    if (authenticated) {
      // Si el usuario puso bien la clave, cargamos la App
      root.render(
        // Quitamos StrictMode momentáneamente para evitar doble render en auth
        <App />,
      );
    } else {
      // Si algo falló (raro con login-required), recargamos
      window.location.reload();
    }
  })
  .catch((error) => {
    console.error("Authentication Failed", error);
    root.render(
      <div className="container mt-5 text-center text-danger">
        <h1>⚠️ Error de Conexión</h1>
        <p>No pudimos conectar con el Servidor de Seguridad (Keycloak).</p>
        <p>Asegurate de que Docker esté corriendo en el puerto 8080.</p>
      </div>,
    );
  });
