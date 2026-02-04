const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false
});

// --- MODELO SOCIO ---
const Socio = sequelize.define('Socio', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING, allowNull: false },
    fechaPago: { type: DataTypes.DATEONLY, allowNull: false },
    fechaVencimiento: { type: DataTypes.DATEONLY, allowNull: false },
    metodoPago: { type: DataTypes.STRING, defaultValue: 'Efectivo' },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// --- MODELO PAGO (HISTORIAL) ---
const Pago = sequelize.define('Pago', {
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    metodoPago: { type: DataTypes.STRING, allowNull: false },
    // Podríamos agregar 'monto' acá en el futuro
});

// Relaciones: Un Socio tiene muchos Pagos
Socio.hasMany(Pago);
Pago.belongsTo(Socio);

sequelize.sync()
    .then(() => console.log("Base de datos sincronizada (Socios y Pagos)"))
    .catch(err => console.error("Error DB:", err));

module.exports = { sequelize, Socio, Pago };