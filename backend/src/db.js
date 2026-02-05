const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false
});

const Socio = sequelize.define('Socio', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING, allowNull: false },
    fechaPago: { type: DataTypes.DATEONLY, allowNull: false },
    fechaVencimiento: { type: DataTypes.DATEONLY, allowNull: false },
    metodoPago: { type: DataTypes.STRING, defaultValue: 'Efectivo' },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const Pago = sequelize.define('Pago', {
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    metodoPago: { type: DataTypes.STRING, allowNull: false },
    // --- NUEVO CAMPO ---
    monto: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
    // -------------------
});

Socio.hasMany(Pago);
Pago.belongsTo(Socio);

sequelize.sync({ force: false }) // Cambiar a true si da error de columna, pero perderás datos
    .then(() => console.log("Base de datos sincronizada"))
    .catch(err => console.error("Error DB:", err));

module.exports = { sequelize, Socio, Pago };