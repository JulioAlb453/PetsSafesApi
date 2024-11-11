const express = require("express");
const router = express.Router();
const mascotaController = require("../controllers/mascota");

// Rutas para los endpoints CRUD
router.get("/obtenerMascotas/", mascotaController.getAllMascotas);
router.get("/obtenerMascotasByID/:id", mascotaController.getMascotaById);
router.get("/obtenerMascotaPorRescatista/:id", mascotaController.getAllMascotasPorRescatistaId)


router.post("/", mascotaController.addMascota);
router.put("/:id", mascotaController.updateMascota);
router.delete("/:id", mascotaController.deleteMascota);

module.exports = router;
