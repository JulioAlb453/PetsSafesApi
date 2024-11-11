const mysql = require("mysql2");
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

// Obtener todas las donaciones
exports.getAllDonaciones = (req, res) => {
  db.query("SELECT * FROM donacion", (err, result) => {
    if (err) {
      res.status(500).json("Error al obtener las donaciones");
    }
    return res.json(result);
  });
};

// Obtener donaciones por ID de rescatista
exports.getDonacionesPorMascotaId = (req, res) => {
  const idRescatista = req.params.id;
  db.query(
    "SELECT * FROM mascota WHERE idRescatista = ?",
    [idRescatista],
    (err, result) => {
      if (err) {
        return res.status(500).json("Error al obtener las donaciones");
      }
      const mascotas = result;

      // Crear un array de promesas para obtener donaciones de cada mascota
      const donacionPromises = mascotas.map((mascota) => {
        return new Promise((resolve, reject) => {
          db.query(
            "SELECT d.fechaDonacion, la.nombre, d.monto FROM donacion AS d INNER JOIN login_adoptadores AS la ON d.idAdoptador = la.id WHERE idMascota = ?",
            [mascota.id],
            (err, donaciones) => {
              if (err) {
                reject(err);
              } else {
                mascota.donaciones = donaciones; // Asignar las donaciones a la mascota
                resolve();
              }
            }
          );
        });
      });
      // Crear un array de promesas para obtener solicitudes de cada mascota
      const solicitudesPromises = mascotas.map((mascota) => {
        return new Promise((resolve, reject) => {
          db.query(
            "SELECT s.id, la.nombre AS solicitante, la.AMaterno, la.APaterno,m.nombre AS mascota, s.estatus, s.fechaSolicitud FROM solicitud AS s INNER JOIN login_adoptadores AS la ON s.idAdoptador = la.id INNER JOIN mascota  AS m ON s.idMascota= m.id  WHERE idMascota = ?",
            [mascota.id],
            (err, solicitudes) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                mascota.solicitudes = solicitudes; // Asignar las donaciones a la mascota
                resolve();
              }
            }
          );
        });
      });

      // Esperar a que todas las promesas de donación se resuelvan
      Promise.all([...donacionPromises, ...solicitudesPromises])
        .then(() => {
          res.json(mascotas);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json("Error al obtener las donaciones");
        });
    }
  );
};


// Agregar una nueva donación
exports.addDonacion = (req, res) => {
  var idMascota = req.body.idMascota;
  db.query("SELECT * from mascota WHERE id = ?", idMascota, (err, result) => {
    if (err) {
      console.error("Error al agregar una nueva donación:", err);
      return res.status(500).json("Error al agregar una nueva donación");
    }
    let now = new Date();
    const newDonacion = {
      idRescatista: result[0].idRescatista,
      idAdoptador: req.body.idAdoptador,
      idMascota: req.body.idMascota,
      monto: req.body.monto,
      fechaDonacion: now,
      mensaje: req.body.mensaje
    };
    console.log(result)
    const donacionPromises = result.map((mascota) => {
      return new Promise((resolve, reject) => {
        db.query("INSERT INTO donacion SET ?", newDonacion, (err, result2) => {
          if (err) {
            console.error("Error al agregar una nueva donación:", err);
            reject(err);
          }else{
            resolve();
          }
        });
      });
    });

    // Esperar a que todas las promesas de donación se resuelvan
    Promise.all(donacionPromises)
      .then(() => {
        res.json("Donacion exitosa");
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json("Error al obtener las donaciones");
      });
  });

  // db.query("INSERT INTO donacion SET ?", newDonacion, (err, result) => {
  //   if (err) {
  //     console.error("Error al agregar una nueva donación:", err);
  //     return res.status(500).json("Error al agregar una nueva donación");
  //   }
  //   return res.status(201).json("Nueva donación agregada correctamente");
  // });
};

// Actualizar una donación existente
exports.updateDonacion = (req, res) => {
  const donacionId = req.params.id;
  const updatedDonacion = req.body;
  db.query(
    "UPDATE donacion SET ? WHERE id = ?",
    [updatedDonacion, donacionId],
    (err, result) => {
      if (err) {
        return res.status(500).json("Error al actualizar la donación");
      }
      return res.json("Donación actualizada correctamente");
    }
  );
};

// Eliminar una donación
exports.deleteDonacion = (req, res) => {
  const donacionId = req.params.id;
  db.query("DELETE FROM donacion WHERE id = ?", donacionId, (err, result) => {
    if (err) {
      return res.status(500).json("Error al eliminar la donación");
    }
    return res.json("Donación eliminada correctamente");
  });
};
