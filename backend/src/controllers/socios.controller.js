const { Socio, Pago } = require('../db');
const { Op } = require('sequelize');

exports.obtenerSocios = async (req, res) => {
    try {
        const mostrarInactivos = req.query.inactivos === 'true';
        const socios = await Socio.findAll({
            where: { activo: !mostrarInactivos },
            include: [{
                model: Pago,
                separate: true,
                order: [['fecha', 'DESC']]
            }],
            order: [['fechaVencimiento', 'ASC']]
        });
        res.json(socios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearSocio = async (req, res) => {
    try {
        // Recibimos 'monto' del frontend
        const { nombre, telefono, fechaPago, metodoPago, monto } = req.body;

        const fechaP = new Date(fechaPago);
        const fechaVenc = new Date(fechaP);
        fechaVenc.setMonth(fechaVenc.getMonth() + 1);

        const nuevoSocio = await Socio.create({
            nombre, telefono, fechaPago, metodoPago,
            fechaVencimiento: fechaVenc.toISOString().split('T')[0],
            activo: true
        });

        // Guardamos el pago con su monto
        await Pago.create({
            fecha: fechaPago,
            metodoPago: metodoPago,
            monto: parseFloat(monto) || 0, // Aseguramos que sea número
            SocioId: nuevoSocio.id
        });

        res.json(nuevoSocio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.renovarCuota = async (req, res) => {
    try {
        const { id } = req.params;
        // Recibimos 'monto' en la renovación también
        const { fechaPago, metodoPago, monto } = req.body;

        const fechaP = new Date(fechaPago);
        const nuevaFechaVenc = new Date(fechaP);
        nuevaFechaVenc.setMonth(nuevaFechaVenc.getMonth() + 1);

        await Socio.update({
            fechaPago: fechaPago,
            metodoPago: metodoPago,
            fechaVencimiento: nuevaFechaVenc.toISOString().split('T')[0]
        }, { where: { id } });

        // Guardamos el historial con monto
        await Pago.create({
            fecha: fechaPago,
            metodoPago: metodoPago,
            monto: parseFloat(monto) || 0,
            SocioId: id
        });

        res.json({ message: 'Renovado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- ESTADÍSTICAS RECARGADAS (AHORA CUENTAN PLATA) ---
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const pagos = await Pago.findAll();
        const estadisticas = { mensuales: {}, anuales: {} };

        pagos.forEach(pago => {
            const fecha = pago.fecha;
            const mes = fecha.substring(0, 7); // "2026-02"
            const anio = fecha.substring(0, 4); // "2026"
            const metodo = pago.metodoPago;
            const monto = pago.monto || 0;

            // Inicializar Mes
            if (!estadisticas.mensuales[mes]) estadisticas.mensuales[mes] = { Total: 0, Efectivo: 0, Transferencia: 0, Tarjeta: 0 };

            // SUMAR PLATA (Antes era +1, ahora es +monto)
            estadisticas.mensuales[mes][metodo] += monto;
            estadisticas.mensuales[mes].Total += monto;

            // Inicializar Año
            if (!estadisticas.anuales[anio]) estadisticas.anuales[anio] = { Total: 0, Efectivo: 0, Transferencia: 0, Tarjeta: 0 };

            // SUMAR PLATA AL AÑO
            estadisticas.anuales[anio][metodo] += monto;
            estadisticas.anuales[anio].Total += monto;
        });

        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Dejar las otras funciones (actualizar, bajas, etc) IGUAL que antes ---
exports.actualizarSocio = async (req, res) => { /* ... código viejo ... */ };
exports.bajaLogica = async (req, res) => {
    const { id } = req.params;
    await Socio.update({ activo: false }, { where: { id } });
    res.json({ message: 'Baja' });
};
exports.reactivarSocio = async (req, res) => {
    const { id } = req.params;
    await Socio.update({ activo: true }, { where: { id } });
    res.json({ message: 'Alta' });
};