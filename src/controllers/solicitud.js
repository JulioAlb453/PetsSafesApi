const mysql = require("mysql2");
//Cargar las variables de entorno
require("dotenv").config();
// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
db.connect((err) => {
  if (err) {
    throw err;
  }
});

exports.getAllSolicitud = (req, res) => {
  db.query("SELECT * FROM solicitud", (err, result) => {
    if (err) {
      return res.status(500).json("Error al obtener los elementos");
    }
    return res.json(result);
  });
};

// Agregar un nuevo elemento
exports.addSolicitud = (req, res) => {
  let now = new Date();
  const newSolicitud = {
    idAdoptador: req.body.idAdoptador,
    idMascota: req.body.idMascota,
    fechaSolicitud: now,
    fechaAdopcion: req.body.fechaAdopcion,
    localizacion: req.body.localizacion,
    estatus: req.body.estatus,
    motivoAdopcion: req.body.motivoAdopcion,
    aprobadoPor: req.body.aprobadoPor,
    tipoHogar: req.body.tipoHogar,
    experienciaMascotas: req.body.experienciaMascotas,
    personasEnHogar: req.body.personasEnHogar,
    niñosEnHogar: req.body.niñosEnHogar,
    trabajoDesdeCasa: req.body.trabajoDesdeCasa,
    tiempoDisponible: req.body.tiempoDisponible,
    fechaRevision: now
  };
  
  db.query("INSERT INTO solicitud SET ?", newSolicitud, (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json("Error al agregar un nuevo elemento");
    }
    return res.status(201).json("Nuevo elemento agregado correctamente");
  });
};

exports.getSolicitudPorAdoptador = (req, res) => {
  const idAdoptador = req.params.id
  db.query("SELECT * FROM solicitud WHERE idAdoptador = ? ",[idAdoptador], (err, result) => {
    if (err) {
      return res.status(500).json("Error al obtener los elementos");
    }
    return res.json(result);
  });
};
exports.aceptarSolicitud = (req, res) => {
  const solicitudId = req.params.id;
  db.query(
    "UPDATE solicitud SET estatus = 'Aprobada' WHERE id = ?",
    [solicitudId],
    (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json("Error al actualizar la peticion");
      }
      return res.json("Peticion aceptada correctamente");
    }
  );
};
exports.rechazarSolicitud = (req, res) => {
  const solicitudId = req.params.id;
  db.query(
    "UPDATE solicitud SET estatus = 'Rechazada' WHERE id = ?",
    [solicitudId],
    (err, result) => {
      if (err) {
        return res.status(500).json("Error al actualizar la peticion");
      }
      return res.json("Peticion rechazada correctamente");
    }
  );
};

// Actualizar un elemento existente
exports.updateSolicitud = (req, res) => {
  const solicitudId = req.params.id;
  const updatedSolicitud = req.body;
  db.query(
    "UPDATE solicitud SET ? WHERE id = ?",
    [updatedSolicitud, solicitudId],
    (err, result) => {
      if (err) {
        return res.status(500).json("Error al actualizar el elemento");
      }
      return res.json("Elemento actualizado correctamente");
    }
  );
};

// Eliminar un elemento
exports.deleteSolicitud = (req, res) => {
  const solicitudId = req.params.id;
  db.query("DELETE FROM solicitud WHERE id = ?", solicitudId, (err, result) => {
    if (err) {
      return res.status(500).json("Error al eliminar el elemento");
    }
    return res.json("Elemento eliminado correctamente");
  });
};
