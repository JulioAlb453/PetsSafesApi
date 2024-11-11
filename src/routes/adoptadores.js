const express = require('express');
const router = express.Router();
const adoptadoresController = require('../controllers/adoptadores');

// Rutas para los endpoints CRUD
router.get('/obtenerAdoptadores/', adoptadoresController.getAllAdoptadores);
router.get('/obtenerAdoptadoresById/:id', adoptadoresController.getAdoptadoresById);
router.post('/', adoptadoresController.addAdoptador);
router.put('/:id', adoptadoresController.updateAdoptador);
router.delete('/:idAdoptador', adoptadoresController.deleteAdoptador);

module.exports = router;


