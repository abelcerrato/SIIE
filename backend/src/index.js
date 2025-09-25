import express from "express";
import {PORT} from './config.js'
import userRoutes from './routes/ms_usuarios.routes.js'
import rolesRoutes from './routes/ms_roles.routes.js'


import cors from "cors"

import 'dotenv/config'; 


const app = express()
app.use(cors());



app.use(express.json())
app.use(userRoutes)
app.use(rolesRoutes)


console.log("DB_USER:", process.env.DB_USER); // Prueba si se está cargando correctamente

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

