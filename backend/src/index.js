import express from "express";
import {PORT} from './config.js'
import userRoutes from './routes/ms_usuarios.routes.js'
import rolesRoutes from './routes/ms_roles.routes.js'
import modulosRoutes from "./routes/ms_modulos.routes.js"
import rolesypermisosRoutes from "./routes/ms_rolesypermisos.routes.js"

import reportesRoutes from "./routes/reportes.routes.js"


import cors from "cors"

import 'dotenv/config'; 


const app = express()
app.use(cors());



app.use(express.json())
app.use(userRoutes)
app.use(rolesRoutes)
app.use(modulosRoutes)
app.use(rolesypermisosRoutes)

app.use(reportesRoutes)


console.log("DB_USER:", process.env.DB_USER); // Prueba si se está cargando correctamente
console.log("DB_USER2:", process.env.DB2_USER); // Prueba si se está cargando correctamente

app.listen(PORT, () => {
  console.log(`Servidor 1 corriendo en el puerto ${PORT}`);
});



