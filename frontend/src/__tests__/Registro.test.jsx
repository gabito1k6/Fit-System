import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // Simula el tecleo del usuario
import { BrowserRouter } from "react-router-dom";
import Registro from "../pages/Registro";
import { describe, it, expect, vi } from "vitest";

// 1. MOCK (Simulacro): Engañamos al test para que NO llame al Backend real
// Así no ensuciamos la base de datos cada vez que testeamos.
vi.mock("../services/socios.service", () => ({
  sociosService: {
    crear: vi.fn(), // Una función falsa que no hace nada
  },
}));

describe("Formulario de Registro", () => {
  it("Debería mostrar error si el teléfono tiene letras", async () => {
    // Configuramos el "usuario robot"
    const user = userEvent.setup();

    // Renderizamos la página (necesita BrowserRouter por el useNavigate)
    render(
      <BrowserRouter>
        <Registro />
      </BrowserRouter>,
    );

    // 2. BUSCAR ELEMENTOS
    // Buscamos por el texto de la etiqueta <label>
    const inputNombre = screen.getByLabelText(/Nombre Completo/i);
    const inputTel = screen.getByLabelText(/WhatsApp/i);
    const inputFecha = screen.getByLabelText(/Fecha de Pago/i);
    const botonGuardar = screen.getByRole("button", {
      name: /Registrar Cobro/i,
    });

    // 3. ACTUAR (Simular usuario)
    // El usuario llena bien el nombre
    await user.type(inputNombre, "Pepe Testing");

    // El usuario se equivoca y pone letras en el teléfono
    await user.type(inputTel, "NoTengoCelular");

    // Llena la fecha
    await user.type(inputFecha, "2024-02-01");

    // Hace clic en guardar
    await user.click(botonGuardar);

    // 4. ASEVERAR (Verificar el resultado)
    // Esperamos que aparezca el mensaje de error que definimos en el componente
    // Usamos findByText porque el mensaje aparece asincrónicamente (después de validar)
    const mensajeError = await screen.findByText(/Solo ingresá números/i);

    expect(mensajeError).toBeInTheDocument();
  });

  it("No debería mostrar error si el teléfono son solo números", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Registro />
      </BrowserRouter>,
    );

    const inputTel = screen.getByLabelText(/WhatsApp/i);
    const botonGuardar = screen.getByRole("button", {
      name: /Registrar Cobro/i,
    });

    // Escribimos un número válido
    await user.type(inputTel, "351123456");
    await user.click(botonGuardar);

    // Verificamos que el mensaje de error NO exista
    // queryByText devuelve null si no lo encuentra (en vez de tirar error)
    const mensajeError = screen.queryByText(/Solo ingresá números/i);
    expect(mensajeError).not.toBeInTheDocument();
  });
});
