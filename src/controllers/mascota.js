const mysql = require('mysql2');
const multer = require('multer');
require('dotenv').config();
const path = require('path');


// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'D:/IS/4to semestre/BD/1er Cuatri/API/src/storage/imgs'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect((err) => {
  if (err) {
    throw err;
  }
});

exports.getAllMascotas = (req, res) => {
  db.query('SELECT * FROM mascota', (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).json('Error al obtener los elementos');
  
    }
    res.json(result);
  });
};
exports.getAllMascotasPorRescatistaId = (req, res) => {
  const idRescatista = req.params.id
  db.query("SELECT * FROM mascota WHERE idRescatista = ? ",[idRescatista], (err, result) => {

    if (err) {
      res.status(500).json('Error al obtener los elementos');
      console.log(err)
    }
    console.log(result)
    res.json(result);
  });
};

exports.getMascotaById = (req, res) => {
  const mascotaId = req.params.id;
  db.query('SELECT * FROM mascota WHERE id = ?', [mascotaId], (err, result) => {
    if (err) {
      return res.status(500).json('Error al obtener los elementos');
    }
    return res.json(result[0]);
  });
};

exports.addMascota = (req, res) => {
  upload.single('imagen')(req, res, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).json('Error al subir la imagen');
    }

    const newMascota = req.body;
    if (req.file) {
      newMascota.imagen = path.join('storage', 'imgs', req.file.filename);
    }

    db.query('INSERT INTO mascota SET ?', newMascota, (err, result) => {
      if (err) {
        console.error('Error al agregar un nuevo elemento:', err);
        return res.status(500).json('Error al agregar un nuevo elemento');
      }
      return res.status(201).json("Nuevo elemento agregado correctamente");
    });
  });
};

// Actualizar un elemento existente
exports.updateMascota = (req, res) => {
  const mascotaId = req.params.id;
  const updatedMascota = req.body;
  db.query('UPDATE mascota SET ? WHERE id = ?', [updatedMascota, mascotaId], (err, result) => {
    if (err) {
      return res.status(500).json('Error al actualizar el elemento');
    }
    return res.json('Elemento actualizado correctamente');
  });
};

// Eliminar un elemento
exports.deleteMascota = (req, res) => {
  const mascotaId = req.params.id;
  db.query('DELETE FROM mascota WHERE id = ?', mascotaId, (err, result) => {
    if (err) {
      return res.status(500).json('Error al eliminar el elemento');
    }
    return res.json('Elemento eliminado correctamente');
  });
  module.exports = router;
};

