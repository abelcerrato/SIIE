import 'dotenv/config';  // Carga las variables de entorno

export const DB_USER= process.env.DB_USER
export const DB_HOST= process.env.DB_HOST
export const DB_PASSWORD= process.env.DB_PASSWORD
export const DB_DATABASE=process.env.DB_DATABASE
export const DB_PORT=process.env.DB_PORT

export const PORT= process.env.PORT || 3000;


export const DB_USER2= process.env.DB2_USER
export const DB_HOST2= process.env.DB2_HOST
export const DB_PASSWORD2= process.env.DB2_PASSWORD
export const DB_DATABASE2=process.env.DB2_DATABASE
export const DB_PORT2=process.env.DB2_PORT

//export const PORT2= process.env.PORT2 || 3001;
