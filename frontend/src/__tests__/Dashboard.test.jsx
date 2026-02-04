import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { sociosService } from "../services/socios.service";

// 1. Mock del Servicio: Simulamos que el Backend nos devuelve 1 socio
vi.mock("../services/socios.service");

describe("Dashboard y WhatsApp", () => {
  // Datos de prueba falsos
  const socioFalso = [
    {
      id: 1,
      nombre: "Socio Test",
      telefono: "5493511112222",
      fechaVencimiento: "2024-03-01",
    },
  ];

  // Antes de cada test, limpiamos los mocks
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Debería cargar y mostrar los socios en la tabla", async () => {
    // Configuramos el servicio para que devuelva nuestros datos falsos
    sociosService.obtenerTodos.mockResolvedValue(socioFalso);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    // Esperamos a que aparezca el nombre del socio (waitFor es clave para cosas asíncronas)
    const nombreSocio = await waitFor(() => screen.getByText("Socio Test"));
    const fecha = screen.getByText("2024-03-01");

    expect(nombreSocio).toBeInTheDocument();
    expect(fecha).toBeInTheDocument();
  });

  it("Debería generar el enlace de WhatsApp correcto al hacer clic", async () => {
    const user = userEvent.setup();
    sociosService.obtenerTodos.mockResolvedValue(socioFalso);

    // 2. Espía (Spy) sobre window.open
    // Como los tests no tienen navegador real, "espiamos" la función que abre pestañas
    const abrirPestaña = vi.spyOn(window, "open").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    // Esperamos a que cargue el botón
    const botonWhatsApp = await waitFor(() =>
      screen.getByRole("button", { name: /Enviar WhatsApp/i }),
    );

    // Simulamos el clic
    await user.click(botonWhatsApp);

    // 3. Verificamos la URL exacta
    // El mensaje esperado codificado
    const mensajeEsperado = encodeURIComponent(
      "Hola Socio Test, te recordamos que tu cuota vence el 2024-03-01.",
    );
    const urlEsperada = `https://wa.me/5493511112222?text=${mensajeEsperado}`;

    // La aserción final: "¿Se llamó a window.open con esta URL?"
    expect(abrirPestaña).toHaveBeenCalledWith(urlEsperada, "_blank");
  });
});
