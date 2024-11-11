const express = require('express');
const bodyParser = require('body-parser');
const adoptadoresRoutes = require('./routes/adoptadores');
const mascotaRoutes = require('./routes/mascota')
const rescatistaRoutes = require('./routes/rescatista')
const postRoutes = require ('./routes/post')
const solicitudRoutes = require('./routes/solicitudes')
const donacionesRoutes = require('./routes/donaciones')
const userRoutes = require('../src/routes/users')
const path = require('path');

const app = express();
const cors = require('cors');
const port = 3000;

// Middleware para analizar los cuerpos de las solicitudes
app.use(bodyParser.json());
app.use('/storage', express.static('src/storage'));
app.use(cors()); 


// Usar las rutas de los items
app.use('/adoptadores', adoptadoresRoutes);
app.use('/mascotas',  mascotaRoutes);
app.use('/rescatista', rescatistaRoutes)
app.use('/donaciones', donacionesRoutes)
app.use('/posts', postRoutes)
app.use('/solicitudes', solicitudRoutes)
app.use('/usuarios', userRoutes)


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express en ejecución en http://localhost:${port}`);
});
