# 🏋️‍♂️ Fit-System: Sistema de Gestión de Gimnasios

**Fit-System** es una plataforma web integral diseñada para la administración eficiente de gimnasios. Permite gestionar socios, controlar vencimientos, registrar pagos históricos, visualizar estadísticas de ingresos y enviar notificaciones automáticas vía WhatsApp. Todo el sistema está contenerizado con Docker para un despliegue inmediato.

---

## 🚀 Tecnologías

El proyecto utiliza un stack moderno, rápido y escalable:

### Frontend

- **React + Vite:** Interfaz de usuario de alto rendimiento.
- **Bootstrap 5:** Diseño responsivo, modales y alertas estéticas.
- **Chart.js + React-Chartjs-2:** Visualización de datos y gráficos estadísticos.
- **Axios:** Comunicación eficiente con la API.
- **React Router:** Navegación fluida (SPA).

### Backend

- **Node.js + Express:** API RESTful escalable.
- **SQLite:** Base de datos SQL ligera y portátil.
- **Sequelize ORM:** Modelado de datos (Socios, Pagos) y relaciones.

### Infraestructura

- **Docker & Docker Compose:** Entorno de desarrollo unificado (Front + Back + DB + Auth).
- **Keycloak:** (Infraestructura base) Servidor de identidad y acceso.

---

## ✨ Funcionalidades Principales

### 1. Gestión Integral de Socios (CRUD)

- **Alta y Modificación:** Registro completo con validación de datos.
- **Buscador en Tiempo Real:** Filtrado instantáneo por nombre.
- **Ordenamiento Dinámico:** Clasificación por Vencimiento (para urgencias) o Alfabéticamente.
- **Ficha Técnica:** Modal con detalles completos del socio.

### 2. Panel de Estadísticas y Finanzas 📊

- **Gráficos Interactivos:** Visualización de ingresos mensuales agrupados por método de pago (Efectivo, Transferencia, Tarjeta).
- **Resumen Anual:** Reporte detallado de la cantidad de operaciones por año.
- **Historial de Pagos:** El sistema registra cada transacción en una tabla histórica para no perder datos al renovar cuotas.

### 3. Control de Pagos y Vencimientos 📅

- **Cálculo Automático:** Al registrar un pago, el sistema proyecta el vencimiento a 30 días automáticamente.
- **Alertas Visuales:**
  - 🔴 **Por Vencer:** Aviso visual si faltan 3 días o menos.
  - 🟢 **Al día:** Indicador de cuota vigente.
- **Renovación Express:** Botón "Un Clic" para renovar el mes, actualizando el vencimiento y guardando el registro en el historial financiero.

### 4. Notificaciones Inteligentes (WhatsApp) 📱

- **Smart Link (Argentina):** Algoritmo que detecta y corrige números de teléfono (agrega prefijo `549` si falta) para asegurar la entrega del mensaje.
- **Mensajes Personalizados:** Redacción automática con el nombre del socio y la fecha exacta de vencimiento.

### 5. Papelera de Reciclaje (Baja Lógica) ♻️

- **Seguridad de Datos:** Los socios nunca se eliminan físicamente; se desactivan.
- **Modo Papelera:** Interruptor para visualizar ex-socios.
- **Restauración:** Funcionalidad para reactivar socios dados de baja con un solo clic.

---

## 🛠️ Instalación y Puesta en Marcha

Requisitos: Tener instalado **Docker Desktop**.

1.  **Clonar el repositorio:**

    ```bash
    git clone <url-de-tu-repo>
    cd Fit-System
    ```

2.  **Iniciar el sistema:**

    ```bash
    docker-compose up --build
    ```

    _(La primera vez puede demorar mientras descarga las imágenes)._

3.  **Acceder a la aplicación:**
    - 🖥️ **Panel Principal:** [http://localhost:5173](http://localhost:5173)
    - 📈 **Estadísticas:** [http://localhost:5173/estadisticas](http://localhost:5173/estadisticas)
    - ⚙️ **Backend API:** [http://localhost:3000](http://localhost:3000)

---

## 📂 Estructura del Proyecto

```text
Fit-System/
├── backend/                # Servidor API
│   ├── src/
│   │   ├── controllers/    # Lógica (Renovar, Stats, CRUD)
│   │   ├── models/         # Modelos DB (Socio, Pago)
│   │   ├── routes/         # Rutas Express
│   │   └── db.js           # Configuración SQLite
│   ├── database.sqlite     # Archivo de Base de Datos
│   └── server.js           # Entry point
│
├── frontend/               # Cliente React
│   ├── src/
│   │   ├── components/     # Navbar
│   │   ├── pages/          # Dashboard, Registro, Estadisticas
│   │   ├── services/       # Conexión API
│   │   └── ...
│   └── vite.config.js
│
├── docker-compose.yml      # Orquestación de servicios
└── README.md               # Documentación
```
