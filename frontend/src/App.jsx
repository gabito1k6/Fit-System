// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // 1. Importamos el componente
import Dashboard from "./pages/Dashboard";
import Registro from "./pages/Registro";
import Login from "./pages/Login"; // Asumo que ya tenés o vas a tener el Login

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="App" style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
