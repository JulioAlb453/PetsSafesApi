const express = require('express');
const router = express.Router();
const donacionesController = require('../controllers/donaciones');

// Rutas para donaciones
router.get('/donaciones', donacionesController.getAllDonaciones);
router.get('/donacionesPorMascota/:id', donacionesController.getDonacionesPorMascotaId);
router.post('/', donacionesController.addDonacion);
router.put('/donaciones/:id', donacionesController.updateDonacion);
router.delete('/donaciones/:id', donacionesController.deleteDonacion);

module.exports = router;
