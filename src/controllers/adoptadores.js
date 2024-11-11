const mysql = require('mysql2');
const jwt = require("jsonwebtoken");

//Cargar las variables de entorno
require('dotenv').config();
// Configuración de la conexión a la base de datos MySQL
const JWT_SECRET = process.env.JWT_SECRET;
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conexión a la base de datos MySQL establecida');
});

// Obtener todos los elementos
exports.getAllAdoptadores = (req, res) => {
  db.query('SELECT * FROM adoptadores', (err, result) => {
    if (err) {
      return res.status(500).json('Error al obtener los elementos');
 
    }
    return res.json(result);
  });
};
exports.getAdoptadoresById = (req, res) => {
  const adoptadorId = req.params.id;
  db.query('SELECT * FROM adoptadores where id = ?', [adoptadorId],(err, result) => {
    if (err) {
      return res.status(500).json('Error al obtener los elementos');
    }
    return res.json(result[0]);
  });
};

// Agregar un nuevo elemento
exports.addAdoptador = (req, res) => {
  
  const newAdoptador = req.body; 
  db.query('INSERT INTO adoptadores SET ?', newAdoptador, (err, result) => {
    if (err) {
      console.error('Error al agregar un nuevo elemento:', err);
      return res.status(500).json('Error al agregar un nuevo elemento');
    }
    return res.status(201).json('Nuevo elemento agregado correctamente');
  });
};

// Actualizar un elemento existente
exports.updateAdoptador = (req, res) => {
  const adoptadorId = req.params.id;
  const updatedAdoptador = req.body;
  db.query('UPDATE adoptadores SET ? WHERE id = ?', [updatedAdoptador, adoptadorId], (err, result) => {
    if (err) {
      return res.status(500).json('Error al actualizar el elemento');

    }
    return res.json('Elemento actualizado correctamente');
  });
};

// Eliminar un elemento
exports.deleteAdoptador = (req, res) => {
  const adoptadorId = req.params.id;
  db.query('DELETE FROM adoptadores WHERE id = ?', adoptadorId, (err, result) => {
    if (err) {
      return res.status(500).json('Error al eliminar el elemento');
   
    }
    return res.json('Elemento eliminado correctamente');
  });
};
