const express = require('express');
const router = express.Router();
const rescatistaController = require('../controllers/rescatista');

// Rutas para los endpoints CRUD
router.get('/obtenerRescatista/', rescatistaController.getAllRescatista);
router.get('/obtenerRescatistasByID/:id', rescatistaController.getRescatistaById);
router.post('/', rescatistaController.addRescatista);
router.put('/:id', rescatistaController.updateRescatista);
router.delete('/:id', rescatistaController.deleteRescatista);

module.exports = router;



