# 🏋️‍♂️ Fit-System: Sistema de Gestión de Gimnasios

**Fit-System** es una plataforma web profesional para la administración de gimnasios. Combina gestión de socios, control financiero, estadísticas avanzadas y seguridad corporativa, todo empaquetado en contenedores Docker para un despliegue instantáneo.

---

## 🚀 Tecnologías

El proyecto utiliza un stack moderno y escalable:

### Frontend

- **React + Vite:** Interfaz ultra-rápida.
- **Bootstrap 5:** Diseño responsivo y componentes UI.
- **Chart.js:** Gráficos estadísticos interactivos.
- **Keycloak JS:** Cliente de seguridad para autenticación.
- **Axios & React Router:** Comunicación API y navegación.

### Backend

- **Node.js + Express:** Servidor API RESTful.
- **Sequelize ORM:** Gestión de base de datos SQL y relaciones (Socios <-> Pagos).
- **SQLite:** Persistencia de datos ligera y eficiente.

### Infraestructura & Seguridad

- **Docker & Docker Compose:** Entorno unificado.
- **Keycloak:** Servidor de identidad (IAM) para protección de rutas y gestión de sesiones.

---

## ✨ Funcionalidades Principales

### 1. Seguridad Corporativa (Auth) 🔐

- **Acceso Restringido:** Nadie puede ver el sistema sin iniciar sesión.
- **Integración IAM:** Redirección automática al servidor de autenticación (Keycloak).
- **Gestión de Sesiones:** Login y Logout seguros desde la aplicación.

### 2. Panel de Estadísticas Avanzadas 📈

- **Filtro Temporal:** Selector de años para navegar por el historial financiero (viajar al pasado para ver rendimientos anteriores).
- **Gráficos Interactivos:** Visualización de ingresos mensuales desglosados por método de pago (Efectivo, Transferencia, Tarjeta).
- **Resumen Anual:** Panel lateral con totales históricos y contadores de operaciones.
- **Historial Persistente:** Tabla dedicada de `Pagos` que guarda cada transacción independientemente del estado del socio.

### 3. Gestión de Socios y Cobros 💰

- **Renovación Express:** Funcionalidad para registrar pagos y extender vencimientos con un solo clic.
- **Cálculo Automático:** El sistema proyecta vencimientos a 30 días.
- **Alertas de Vencimiento:**
  - 🔴 **Crítico:** Aviso visual si faltan 3 días o menos.
  - 🟢 **Al día:** Estado vigente.

### 4. Notificaciones Inteligentes (WhatsApp) 📱

- **Smart Link Argentina:** Algoritmo que detecta números locales, limpia caracteres y agrega prefijos internacionales (`549`) automáticamente.
- **Mensajes Pre-redactados:** Envía recordatorios personalizados con nombre y fecha exacta de vencimiento.

### 5. Auditoría y Papelera ♻️

- **Soft Delete:** Baja lógica de socios (no se borran datos, se archivan).
- **Restauración:** Capacidad de reactivar ex-socios manteniendo su historial.

---

## 🛠️ Instalación y Credenciales

Requisitos: **Docker Desktop**.

1.  **Clonar el repositorio:**

    ```bash
    git clone <url-de-tu-repo>
    cd Fit-System
    ```

2.  **Iniciar el sistema:**

    ```bash
    docker-compose up --build
    ```

3.  **Acceso al Sistema:**
    Abrí tu navegador en: [http://localhost:5173](http://localhost:5173)

### 🔑 Credenciales por Defecto

| Portal             | URL              | Usuario   | Contraseña |
| :----------------- | :--------------- | :-------- | :--------- |
| **App Gimnasio**   | `localhost:5173` | **dueno** | `1234`     |
| **Panel Keycloak** | `localhost:8080` | **admin** | `admin`    |

---

## 📂 Estructura del Proyecto

```text
Fit-System/
├── backend/                # API & Base de Datos
│   ├── src/
│   │   ├── controllers/    # Lógica de Negocio (Stats, Renovaciones)
│   │   ├── models/         # Modelos (Socio, Pago)
│   │   ├── routes/         # Endpoints
│   │   └── db.js           # Configuración Sequelize
│   └── database.sqlite     # Archivo DB (Ignorado en git)
│
├── frontend/               # SPA React
│   ├── src/
│   │   ├── pages/          # Dashboard, Estadisticas, Registro
│   │   ├── services/       # Conexión API
│   │   └── keycloak.js     # Configuración de Seguridad
│   └── Dockerfile
│
├── docker-compose.yml      # Orquestador
└── README.md               # Documentación
```
