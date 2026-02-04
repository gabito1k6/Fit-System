const express = require('express');
const router = express.Router();
const sociosController = require('../controllers/socios.controller');

router.get('/', sociosController.obtenerSocios);
router.post('/', sociosController.crearSocio);
router.put('/:id', sociosController.actualizarSocio);
router.delete('/:id', sociosController.bajaLogica);

// Nuevas Rutas
router.put('/:id/reactivar', sociosController.reactivarSocio); // Para volver a dar de alta
router.post('/:id/renovar', sociosController.renovarCuota);    // Para renovar el mes

module.exports = router;