// backend/src/db.js
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Configuración de SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'), // Guarda el archivo en la carpeta raíz 'backend'
    logging: false
});

// Definición del Modelo Socio
const Socio = sequelize.define('Socio', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaPago: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaVencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    // --- NUEVOS CAMPOS ---
    metodoPago: {
        type: DataTypes.STRING,
        defaultValue: 'Efectivo'
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true // IMPORTANTE: Por defecto el socio está activo
    }
});

// Sincronizar (Crea la tabla si no existe)
sequelize.sync()
    .then(() => console.log("Base de datos sincronizada"))
    .catch(err => console.error("Error al sincronizar DB:", err));

module.exports = { sequelize, Socio };