import { pool } from "../db.js";

export const getPermisosM = async () => {
  try {
    const { rows } = await pool.query(`
                SELECT 
                    mr.id AS idrol,
                    mr.descripcion,
                    mr.rol,
                    muc.nombre AS creadopor,
                    mr.estado,
                    json_agg(json_build_object(
                        'idmodulo', mm.id,
                        'modulo', mm.modulo,
                        'consultar', p.consultar,
                        'insertar', p.insertar,
                        'actualizar', p.actualizar
                    )) AS permisos
                FROM ms_roles_y_permisos p
                LEFT JOIN ms_roles mr ON p.idrol = mr.id
                LEFT JOIN ms_modulos mm ON p.idmodulo = mm.id
                LEFT JOIN ms_usuarios muc ON p.creadopor = muc.id
                GROUP BY mr.id, mr.rol, mr.estado, muc.nombre;
                `);
    return rows;
  } catch (error) {
    throw error;
  }
};

//Trae los permisos que se le han dado al rol
export const getPermisosIdRolM = async (id) => {
  console.log("Rol enviado:", id);
  try {
    const { rows } = await pool.query(
      `
        select
            p.id, p.idrol, mr.rol, p.idmodulo, mm.modulo, mr.estado, mr.descripcion,
            p.consultar, p.insertar, p.actualizar, 
            muc.nombre as creadopor, p.fechacreacion, mum.nombre as modificadopor, p.fechamodificacion 
        FROM ms_roles_y_permisos p
            left join ms_roles mr on p.idrol =mr.id 
            left join ms_modulos mm on p.idmodulo = mm.id 
            left join ms_usuarios muc on p.creadopor = muc.id 
            left join ms_usuarios mum on p.modificadopor = mum.id 
        where 
            p.idrol=$1 `,
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener los permisos que tiene el Rol:", error);
    throw error;
  }
};


export const postRolyPermisosM = async (
  idrol,
  idmodulo,
  consultar,
  insertar,
  actualizar,
  creadopor
) => {
  // console.log(req.body);
  try {
    await pool.query("BEGIN");

    // Insertar datos en la tabla "ms_roles_y_permisos"
    const permisos = await pool.query(`
                INSERT INTO ms_roles_y_permisos (idrol, idmodulo, consultar, insertar, actualizar, creadopor, fechacreacion, modificadopor, fechamodificacion)
                VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, null, null) RETURNING id;`, [idrol, idmodulo, consultar, insertar, actualizar, creadopor]);

    await pool.query("COMMIT");
    return { message: "Rol y permisos creados correctamente", idrol, permisos: permisos.rows[0] };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al insertar el Rol y sus permisos:", error);
    throw error;
  }
};



export const putRolesyPermisosM = async (
  idmodulo,
  consultar,
  insertar,
  actualizar,
  modificadopor,
  idrol
) => {
  try {
    await pool.query("BEGIN");

    // QUERY QUE ACTUALIZA LOS DATOS EN LA TABLA "Permisos"
    const permisos =await pool.query(`
            INSERT INTO ms_roles_y_permisos
            (idmodulo, consultar, insertar, actualizar, modificadopor, fechamodificacion, idrol)
            VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)
            ON CONFLICT (idmodulo, idrol)
            DO UPDATE SET  
                consultar = EXCLUDED.consultar,
                insertar = EXCLUDED.insertar,
                actualizar = EXCLUDED.actualizar,
                modificadopor = EXCLUDED.modificadopor,
                fechamodificacion = CURRENT_TIMESTAMP
            RETURNING *`, [idmodulo, consultar, insertar, actualizar, modificadopor, idrol]);

    
    await pool.query("COMMIT");
    return {
      message: "Rol y permisos actualizados correctamente", idrol, permisos: permisos.rows[0],
    };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al actualizar el Rol y sus permisos:", error);
    throw error;
  }
};
