const express = require('express');
const router = express.Router(); // <--- ESTA LÍNEA FALTABA O ESTABA DESPUÉS
const sociosController = require('../controllers/socios.controller');

// --- RUTAS ---

// 1. Estadísticas (IMPORTANTE: Esta ruta tiene que ir ANTES de /:id)
// Si la ponés abajo, el sistema va a pensar que "estadisticas" es el ID de un socio
router.get('/estadisticas', sociosController.obtenerEstadisticas);

// 2. Rutas Generales
router.get('/', sociosController.obtenerSocios);
router.post('/', sociosController.crearSocio);

// 3. Rutas Específicas (con ID)
router.put('/:id', sociosController.actualizarSocio);
router.delete('/:id', sociosController.bajaLogica);
router.put('/:id/reactivar', sociosController.reactivarSocio);
router.post('/:id/renovar', sociosController.renovarCuota);

module.exports = router;