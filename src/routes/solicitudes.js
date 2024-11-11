const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitud');

// Rutas para los endpoints CRUD
router.get('/', solicitudController.getAllSolicitud);
router.get('/solicitudPorAdoptador/:id',solicitudController.getSolicitudPorAdoptador);
router.post('/', solicitudController.addSolicitud);
router.post('/rechazar/:id', solicitudController.rechazarSolicitud);
router.post('/aprobar/:id', solicitudController.aceptarSolicitud);
router.put('/:id', solicitudController.updateSolicitud);
router.delete('/:id', solicitudController.deleteSolicitud);

module.exports = router;



