const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const { use } = require("../routes/adoptadores");
const JWT_SECRET = process.env.JWT_SECRET;
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
exports.getUserLoged = (req, res) => {
  let userId = null;
  try {
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        res.status(403).json("Token no valido");
      }
      userId = user.userId;
    });
    db.query(
      `SELECT *  From  login_adoptadores where id = ?`,
      userId,
      (err, result) => {
        if (err) {
          console.error("Error en la consulta SQL:", err);
          res.status(500).send("Error al encontrar el usuario");
        }
        result = result[0];
        res.status(200).json(result);
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerUser = (req, res) => {
  const {
    nombreUsuario,
    contrasena,
    tipoUsuario,
    nombre,
    AMaterno,
    APaterno,
    edad,
    correoElectronico,
    numTelefono,
    localizacion,
    tipoRescatista,
  } = req.body;

  // Determinar la tabla en función del tipo de usuario
  const tableName =
    tipoUsuario === "adoptador" ? "login_adoptadores" : "login_rescatistas";

  // Hash de la contraseña
  bcrypt.hash(contrasena, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send("Error al codificar la contraseña");

    // Crear el objeto del usuario con los campos comunes
    const newUser = {
      nombreUsuario,
      contrasena: hashedPassword,
      nombre,
      AMaterno,
      APaterno,
      edad,
      correoElectronico,
      numTelefono,
    };

    // Agregar los campos adicionales solo si el usuario es rescatista
    if (tipoUsuario === "rescatista") {
      newUser.localizacion = localizacion;
      newUser.tipoRescatista = tipoRescatista;
      
    }
    // Insertar el nuevo usuario en la tabla correspondiente
    db.query(`INSERT INTO ${tableName} SET ?`, newUser, (err, result) => {
      if (err) {
        console.error("Error en la consulta SQL:", err);
        return res.status(500).json("Error al registrar el usuario");
      }
      res.status(201).json(`${tipoUsuario} registrado correctamente`);
    });
  });
};

exports.loginUser = (req, res) => {
  const { nombreUsuario, contrasena, tipoUsuario } = req.body;
  const tableName =
    tipoUsuario === "adoptador" ? "login_adoptadores" : "login_rescatistas";

  db.query(
    `SELECT * FROM ${tableName} WHERE nombreUsuario = ?`,
    [nombreUsuario],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(400).json("Usuario no encontrado");
      }

      const user = result[0];
      bcrypt.compare(contrasena, user.contrasena, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).json("Contraseña incorrecta");
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json({
          message: "Inicio de sesión exitoso",
          token: token,
        });
      });
    }
  );
};

exports.getAllUser = (req, res) => {
  db.query("SELECT * FROM usuarios", (err, result) => {
    if (err) {
      return res.status(500).json("Error al obtener los elementos");
    }
    return res.json(result);
  });
};

exports.getUserData = (req, res) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json("Token no válido");
    }

    const userId = user.userId;
    db.query(
      "SELECT * FROM login_adoptadores WHERE id = ?",
      [userId],
      (err, result) => {
        if (err) {
          console.error("Error en la consulta SQL:", err);
          return res.status(500).send("Error al encontrar el usuario");
        }

        if (result.length > 0) {
          return res.status(200).json(result[0]);
        }

        db.query(
          "SELECT * FROM login_rescatistas WHERE id = ?",
          [userId],
          (err, result) => {
            if (err) {
              console.error("Error en la consulta SQL:", err);
              return res.status(500).send("Error al encontrar el usuario");
            }

            if (result.length > 0) {
              return res.status(200).json(result[0]);
            }

            return res.status(404).json("Usuario no encontrado");
          }
        );
      }
    );
  });
};
