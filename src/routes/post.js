const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');

// Rutas para los endpoints CRUD
router.get('/obtenerPost/', postController.getAllPost);
router.post('/', postController.addPost);
router.put('/:id', postController.updateRescatista);
router.delete('/:id', postController.deleteRescatista);

module.exports = router;



