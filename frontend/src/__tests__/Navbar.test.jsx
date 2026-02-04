import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import { describe, it, expect } from "vitest";

describe("Componente Navbar", () => {
  it("Debería mostrar el título de la marca", () => {
    // 1. RENDERIZAR: Cargamos el componente en memoria
    // Usamos BrowserRouter porque el Navbar tiene <Link> adentro
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    // 2. BUSCAR: Buscamos el texto en la pantalla virtual
    const titulo = screen.getByText(/GymSystem/i);

    // 3. ASEVERAR (Assert): Confirmamos que esté ahí
    expect(titulo).toBeInTheDocument();
  });

  it("Debería tener un botón para ir al Panel", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    // Buscamos un enlace que diga "Panel"
    const botonPanel = screen.getByRole("link", { name: /Panel/i });
    expect(botonPanel).toBeInTheDocument();
  });
});
