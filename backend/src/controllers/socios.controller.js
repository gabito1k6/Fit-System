const { Socio } = require('../db');

// 1. Obtener socios (Permite filtrar por Activos o Inactivos)
exports.obtenerSocios = async (req, res) => {
    try {
        // Si mandan ?inactivos=true en la URL, mostramos los dados de baja
        const mostrarInactivos = req.query.inactivos === 'true';

        const socios = await Socio.findAll({
            where: { activo: !mostrarInactivos }, // True por defecto, False si pedimos inactivos
            order: [['fechaVencimiento', 'ASC']]
        });
        res.json(socios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearSocio = async (req, res) => {
    try {
        const { nombre, telefono, fechaPago, metodoPago } = req.body;
        const fechaP = new Date(fechaPago);
        const fechaVenc = new Date(fechaP);
        fechaVenc.setMonth(fechaVenc.getMonth() + 1);

        const nuevoSocio = await Socio.create({
            nombre, telefono, fechaPago, metodoPago,
            fechaVencimiento: fechaVenc.toISOString().split('T')[0],
            activo: true
        });
        res.json(nuevoSocio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarSocio = async (req, res) => {
    try {
        const { id } = req.params;
        await Socio.update(req.body, { where: { id } });
        res.json({ message: 'Actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bajaLogica = async (req, res) => {
    try {
        const { id } = req.params;
        await Socio.update({ activo: false }, { where: { id } });
        res.json({ message: 'Dado de baja' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- NUEVAS FUNCIONES ---

// 2. Reactivar (Deshacer baja)
exports.reactivarSocio = async (req, res) => {
    try {
        const { id } = req.params;
        await Socio.update({ activo: true }, { where: { id } });
        res.json({ message: 'Socio reactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Renovar Cuota (Cobra y suma 1 mes)
exports.renovarCuota = async (req, res) => {
    try {
        const { id } = req.params;
        const { fechaPago, metodoPago } = req.body; // Recibimos la nueva fecha de pago

        // Calculamos nuevo vencimiento
        const fechaP = new Date(fechaPago);
        const nuevaFechaVenc = new Date(fechaP);
        nuevaFechaVenc.setMonth(nuevaFechaVenc.getMonth() + 1);

        await Socio.update({
            fechaPago: fechaPago,
            metodoPago: metodoPago,
            fechaVencimiento: nuevaFechaVenc.toISOString().split('T')[0]
        }, { where: { id } });

        res.json({ message: 'Cuota renovada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};