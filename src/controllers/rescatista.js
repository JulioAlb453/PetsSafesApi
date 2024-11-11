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


exports.getAllRescatista = (req, res) => {
    db.query('SELECT * FROM rescatistas', (err, result) => {
      if (err) {
        return res.status(500).json('Error al obtener los elementos');
        
      }
      return res.json(result);
    });
  };
  exports.getRescatistaById = (req, res) => {
    const rescatistaId = req.params.id;
    db.query('SELECT * FROM login_rescatistas where id = ?', [rescatistaId],(err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json('Error al obtener los elementos');
      }
      return res.json(result[0]);
    });
  };


  // Agregar un nuevo elemento
  exports.addRescatista = (req, res) => {
    const newRescatista = req.body;
    db.query('INSERT INTO rescatistas SET ?', newRescatista, (err, result) => {
      if (err) {
        console.log("Error: ",err)
        return res.status(500).json('error al agregar un nuevo elemento');
      }
      return res.status(201).json('nuevo elemento agregado correctamente');
    }); 
  };
  
  // Actualizar un elemento existente
  exports.updateRescatista = (req, res) => {
    const rescatistaId = req.params.id;
    const updatedRescatista = req.body;
    db.query('UPDATE login_rescatistas SET ? WHERE id = ?', [updatedRescatista, rescatistaId], (err, result) => {
      if (err) {
        return res.status(500).json('Error al actualizar el elemento');
      }
      return res.json('Elemento actualizado correctamente');
    });
  };
  
  // Eliminar un elemento
  exports.deleteRescatista = (req, res) => {
    const rescatistaId = req.params.id;
    db.query('DELETE FROM login_rescatistas WHERE id = ?', rescatistaId, (err, result) => {
      if (err) {
        return  res.status(500).json('Error al eliminar el elemento');
      }
      return res.json('Elemento eliminado correctamente');
    });
  };
  