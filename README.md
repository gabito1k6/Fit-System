# 🏋️‍♂️ Fit-System: Sistema de Gestión de Gimnasios

**Fit-System** es una aplicación web integral diseñada para simplificar la administración de gimnasios pequeños y medianos. Permite gestionar socios, controlar vencimientos de cuotas, registrar pagos y enviar notificaciones automáticas vía WhatsApp, todo contenedorizado con Docker para un despliegue rápido y sencillo.

---

## 🚀 Tecnologías

El proyecto utiliza un stack moderno y ligero:

### Frontend

- **React + Vite:** Para una interfaz rápida y reactiva.
- **Bootstrap 5:** Diseño responsivo y componentes estéticos (Modales, Tablas, Alertas).
- **Axios:** Comunicación con el Backend.
- **React Router:** Navegación SPA (Single Page Application).

### Backend

- **Node.js + Express:** API RESTful robusta.
- **SQLite:** Base de datos ligera y portátil (sin configuraciones complejas).
- **Sequelize ORM:** Manejo de modelos y consultas SQL de alto nivel.

### Infraestructura

- **Docker & Docker Compose:** Orquestación completa del entorno (Front + Back + Base de Datos + Auth).
- **Keycloak:** (Infraestructura preparada) Servidor de identidad y acceso.

---

## ✨ Funcionalidades Principales

### 1. Gestión de Socios (CRUD Avanzado)

- **Alta de Socios:** Registro con validaciones automáticas.
- **Buscador Inteligente:** Filtrado en tiempo real por nombre.
- **Ordenamiento:** Clasificación por fecha de vencimiento (para ver urgencias) o alfabéticamente.
- **Ficha Técnica:** Visualización detallada de datos y estado del socio en ventana modal.

### 2. Control de Pagos y Vencimientos 📅

- **Cálculo Automático:** Al registrar un pago, el sistema calcula el vencimiento a 30 días.
- **Alertas Visuales:**
  - 🔴 **Por Vencer:** Etiqueta roja si faltan 3 días o menos (o si ya venció).
  - 🟢 **Al día:** Etiqueta verde si la cuota está vigente.
- **Renovación Rápida:** Funcionalidad "Un Clic" para renovar cuotas, permitiendo cambiar la fecha de pago y el medio de cobro (Efectivo, Transferencia, Tarjeta).

### 3. Notificaciones Vía WhatsApp 📱

- **Smart Link (Argentina):** El sistema detecta y corrige automáticamente los números de teléfono, agregando el prefijo internacional `549` si falta, asegurando que el enlace funcione siempre.
- **Mensajes Personalizados:** Genera un mensaje pre-redactado con el nombre del socio y la fecha exacta de vencimiento.

### 4. Papelera de Reciclaje (Baja Lógica) ♻️

- **Soft Delete:** Los socios nunca se borran físicamente de la base de datos, solo se marcan como inactivos.
- **Gestión de Bajas:** Interruptor para visualizar la "Papelera" de socios eliminados.
- **Restauración:** Botón para reactivar socios dados de baja accidentalmente o que regresan al gimnasio.

---

## 🛠️ Instalación y Ejecución

Al estar dockerizado, no necesitas instalar Node.js ni bases de datos localmente. Solo necesitas **Docker Desktop**.

1.  **Clonar el repositorio:**

    ```bash
    git clone <url-de-tu-repo>
    cd Fit-System
    ```

2.  **Iniciar el sistema:**

    ```bash
    docker-compose up --build
    ```

    _(La primera vez puede tardar unos minutos en descargar las imágenes y dependencias)._

3.  **Acceder a la aplicación:**
    - 🖥️ **Frontend (Panel):** [http://localhost:5173](http://localhost:5173)
    - ⚙️ **Backend (API):** [http://localhost:3000](http://localhost:3000)
    - 🔐 **Keycloak (Auth):** [http://localhost:8080](http://localhost:8080)

---

## 📂 Estructura del Proyecto

```text
Fit-System/
├── backend/                # Servidor API
│   ├── src/
│   │   ├── controllers/    # Lógica (Renovar, CRUD, WhatsApp logic)
│   │   ├── models/         # Modelo de DB (Sequelize)
│   │   ├── routes/         # Rutas Express
│   │   └── db.js           # Conexión SQLite
│   ├── server.js           # Entry point
│   ├── database.sqlite     # Archivo de Base de Datos
│   └── Dockerfile
│
├── frontend/               # Cliente React
│   ├── src/
│   │   ├── components/     # Navbar, UI elements
│   │   ├── pages/          # Dashboard.jsx, Registro.jsx
│   │   ├── services/       # Api Calls (Axios)
│   │   └── ...
│   ├── Dockerfile
│   └── vite.config.js
│
├── docker-compose.yml      # Configuración de servicios
└── README.md               # Documentación
```
