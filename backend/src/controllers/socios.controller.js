// 1. ASEGURATE DE QUE LA PRIMERA LÍNEA IMPORTE 'Pago'
const { Socio, Pago } = require('../db');
const { Op } = require('sequelize');

exports.obtenerSocios = async (req, res) => {
    try {
        const mostrarInactivos = req.query.inactivos === 'true';
        const socios = await Socio.findAll({
            where: { activo: !mostrarInactivos },
            // --- ESTO ES LO NUEVO: Traemos los pagos ---
            include: [{
                model: Pago,
                separate: true,             // Para poder ordenarlos
                order: [['fecha', 'DESC']]  // El más nuevo arriba
            }],
            // ------------------------------------------
            order: [['fechaVencimiento', 'ASC']]
        });
        res.json(socios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// ... El resto de las funciones (crearSocio, renovar, etc.) dejalas IGUAL que en tu backup.
exports.actualizarSocio = async (req, res) => {
    /* ... TU CÓDIGO ACTUAL ... */
    try {
        const { id } = req.params;
        await Socio.update(req.body, { where: { id } });
        res.json({ message: 'Actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bajaLogica = async (req, res) => {
    /* ... TU CÓDIGO ACTUAL ... */
    try {
        const { id } = req.params;
        await Socio.update({ activo: false }, { where: { id } });
        res.json({ message: 'Dado de baja' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.reactivarSocio = async (req, res) => {
    /* ... TU CÓDIGO ACTUAL ... */
    try {
        const { id } = req.params;
        await Socio.update({ activo: true }, { where: { id } });
        res.json({ message: 'Socio reactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- MODIFICACIONES IMPORTANTES ---

// 1. Crear Socio + Registro en Historial
exports.crearSocio = async (req, res) => {
    try {
        const { nombre, telefono, fechaPago, metodoPago } = req.body;

        // Calcular vencimiento
        const fechaP = new Date(fechaPago);
        const fechaVenc = new Date(fechaP);
        fechaVenc.setMonth(fechaVenc.getMonth() + 1);

        // Crear Socio
        const nuevoSocio = await Socio.create({
            nombre, telefono, fechaPago, metodoPago,
            fechaVencimiento: fechaVenc.toISOString().split('T')[0],
            activo: true
        });

        // GUARDAR EN HISTORIAL
        await Pago.create({
            fecha: fechaPago,
            metodoPago: metodoPago,
            SocioId: nuevoSocio.id
        });

        res.json(nuevoSocio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Renovar + Registro en Historial
exports.renovarCuota = async (req, res) => {
    try {
        const { id } = req.params;
        const { fechaPago, metodoPago } = req.body;

        const fechaP = new Date(fechaPago);
        const nuevaFechaVenc = new Date(fechaP);
        nuevaFechaVenc.setMonth(nuevaFechaVenc.getMonth() + 1);

        // Actualizar Socio
        await Socio.update({
            fechaPago: fechaPago,
            metodoPago: metodoPago,
            fechaVencimiento: nuevaFechaVenc.toISOString().split('T')[0]
        }, { where: { id } });

        // GUARDAR EN HISTORIAL
        await Pago.create({
            fecha: fechaPago,
            metodoPago: metodoPago,
            SocioId: id
        });

        res.json({ message: 'Cuota renovada y registrada en historial' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. NUEVA: Obtener Estadísticas
exports.obtenerEstadisticas = async (req, res) => {
    try {
        // Traemos TODOS los pagos históricos
        const pagos = await Pago.findAll();

        // Procesamos los datos en Javascript (más fácil que hacer SQL complejo en SQLite)
        const estadisticas = {
            mensuales: {}, // Estructura: { '2024-02': { Efectivo: 5, Tarjeta: 2 }, ... }
            anuales: {}    // Estructura: { '2024': { Efectivo: 50, ... } }
        };

        pagos.forEach(pago => {
            const fecha = pago.fecha; // YYYY-MM-DD
            const mes = fecha.substring(0, 7); // YYYY-MM
            const anio = fecha.substring(0, 4); // YYYY
            const metodo = pago.metodoPago;

            // Agrupar por Mes
            if (!estadisticas.mensuales[mes]) estadisticas.mensuales[mes] = { Total: 0, Efectivo: 0, Transferencia: 0, Tarjeta: 0 };
            estadisticas.mensuales[mes][metodo] = (estadisticas.mensuales[mes][metodo] || 0) + 1;
            estadisticas.mensuales[mes].Total += 1;

            // Agrupar por Año
            if (!estadisticas.anuales[anio]) estadisticas.anuales[anio] = { Total: 0, Efectivo: 0, Transferencia: 0, Tarjeta: 0 };
            estadisticas.anuales[anio][metodo] = (estadisticas.anuales[anio][metodo] || 0) + 1;
            estadisticas.anuales[anio].Total += 1;
        });

        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};