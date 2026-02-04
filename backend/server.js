const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/db'); // Importamos la conexión a la DB

// IMPORTANTE: Importamos el archivo de RUTAS, no el controlador
const sociosRoutes = require('./src/routes/socios.routes');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- RUTAS ---
// Acá le decimos: "Todo lo que empiece con /api/socios, manejalo con el archivo de rutas"
app.use('/api/socios', sociosRoutes);

// Iniciar servidor y sincronizar base de datos
app.listen(PORT, async () => {
    console.log(`Servidor corriendo limpio en http://localhost:${PORT}`);

    try {
        // force: false asegura que NO borre los datos cada vez que reinicias
        // alter: true intenta actualizar la tabla si agregaste columnas nuevas (como metodoPago)
        await sequelize.sync({ alter: true });
        console.log("Base de datos sincronizada");
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
    }
});