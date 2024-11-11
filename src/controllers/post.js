
const mysql = require('mysql2');
//Cargar las variables de entorno
require('dotenv').config();
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

exports.getAllPost = (req, res) => {
    db.query('SELECT * FROM post', (err, result) => {
      if (err) {
        return res.status(500).json('Error al obtener los elementos');

      }
      return res.json(result);
    });
  };
  
  // Agregar un nuevo elemento
  exports.addPost = (req, res) => {
    const newPost = req.body;
    db.query('INSERT INTO post SET ?', newPost, (err, result) => {
      if (err) {
        return res.status(500).json('Error al agregar un nuevo elemento');
      }
       return res.status(201).json('Nuevo elemento agregado correctamente');
    });
  };
  
  // Actualizar un elemento existente
  exports.updateRescatista = (req, res) => {
    const postId = req.params.id;
    const updatedPost = req.body;
    db.query('UPDATE post SET ? WHERE id = ?', [updatedPost, postId], (err, result) => {
      if (err) {
        return res.status(500).json('Error al actualizar el elemento');
      
      }
      return res.json('Elemento actualizado correctamente');
    });
  };
  
  // Eliminar un elemento
  exports.deleteRescatista = (req, res) => {
    const postId = req.params.id;
    db.query('DELETE FROM post WHERE id = ?', postId, (err, result) => {
      if (err) {
        return res.status(500).json('Error al eliminar el elemento');
       
      }
      return res.json('Elemento eliminado correctamente');
    });
  };
  