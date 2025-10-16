import { getIdModulosM } from "../models/ms_modulos.models.js";
import { getPermisosIdRolM, getPermisosM, postRolyPermisosM, putRolesyPermisosM } from "../models/ms_rolesypermisos.models.js";
import { getRolIdM, postRolesM, putRolesM } from "../models/ms_roles.models.js";
import { postRolesC } from "./ms_roles.controller.js";

export const getPermisosC = async (req, res) => {
  try {
    const permisos = await getPermisosM();
    res.json(permisos)
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


//permisos que tiene el rol
export const getPermisosIdRolC = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener el nombre del rol (aunque no tenga permisos)
    const rol = await getRolIdM(id);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    if (rol.estado === false) {
      return res.status(404).json({ message: "Rol Inactivo" });
    }

    const permisos = await getPermisosIdRolM(id);

    if (permisos.length === 0) {
      console.log(`El rol '${rol.rol}' no tiene permisos asignados`);
      return res.status(401).json({ message: `El usuario no tiene permisos asignados` });
    }


    res.json(permisos);
  } catch (error) {
    console.error('Error al obtener el rol:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


// Controlador para crear un rol con sus permisos
export const postRolconPermisosC = async (req, res) => {
  const { rol, estado, descripcion, creadopor, permisos } = req.body;
  console.log(req.body);

  try {
    // Insertar rol en la tabla ms_roles
    const roles = await postRolesM(rol, estado, descripcion, creadopor);
    const idrol = roles[0].id; // Obtener el ID del rol insertado
    console.log("idrol: ", idrol);

    // Traer todos los módulos
    const modulos = await getIdModulosM(); // ya devuelve rows

    // Guardar resultados de permisos
    const resultados = [];

    for (const modulo of modulos) {
      const idmodulo = modulo.id;

      // Obtener permisos del body, si no existen por default en 0
      const {
        consultar = 0,
        insertar = 0,
        actualizar = 0,
      } = permisos[idmodulo] || {};

      // Insertar en ms_permisos
      const resultado = await postRolyPermisosM(
        idrol,
        idmodulo,
        consultar,
        insertar,
        actualizar,
        creadopor
      );

      resultados.push(resultado);
    }

    // Devuelve todo junto
    res.status(201).json({
      message: "Rol y permisos creados correctamente",
      idrol,
      permisos: resultados,
    });

  } catch (error) {
    console.error("Error en el controlador al crear rol y permisos:", error);
    res.status(500).json({ error: "Error al crear el rol y asignar permisos" });
  }
};



export const putRolconPermisosC = async (req, res) => {
  const { rol, estado, descripcion, modificadopor, permisos, idrol } = req.body;
  console.log(req.body);

  try {

    // Insertar rol en la tabla ms_roles
    const roles = await putRolesM(rol, estado, descripcion, modificadopor, idrol);
    const idrolactualizado = roles[0].id; // Obtener el ID del rol insertado
    console.log("idrol: ", idrolactualizado);

    // Traer todos los módulos
    const modulos = await getIdModulosM(); // ya devuelve rows

    // Guardar resultados de permisos
    const resultados = [];

    for (const modulo of modulos) {
      const idmodulo = modulo.id;

      // Obtener permisos del body, si no existen por default en 0
      const { consultar = 0, insertar = 0, actualizar = 0 } = permisos[idmodulo] || {};

      // Insertar en ms_permisos
      const resultado = await putRolesyPermisosM( idmodulo, consultar, insertar, actualizar, modificadopor, idrol );
      resultados.push(resultado);
    }


    // Devuelve todo junto
    res.status(201).json({
      message: "Rol y permisos actualizados correctamente",
      idrol,
      permisos: resultados,
    });
  } catch (error) {
    console.error('Error en el controlador putPerfilPermisos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};






