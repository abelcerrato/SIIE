import { pool } from "../db.js";
import bcrypt from "bcrypt"; // Para cifrar contraseñas
import jwt from "jsonwebtoken";

import {
  getUserM,
  getUserIdM,
  postUserM,
  updateUserM,
  getUsuarioIdM,
  verificarUsuarioM,
  updateContraseñaM,
  resetContraseñaM,
} from "../models/ms_usuarios.models.js";

export const getUserC = async (req, res) => {
  try {
    const users = await getUserM();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getUsuarioIdC = async (req, res) => {
  try {
    const { usuario } = req.params;
    const users = await getUsuarioIdM(usuario);

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getUserIdC = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await getUserIdM(id);

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const verificarUsuarioC = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;
    console.log(req.body);

    if (!usuario || !contraseña) {
      console.log("Faltan datos en la solicitud");
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    const user = await verificarUsuarioM(usuario);

    if (!user) {
      console.log("Usuario o contraseña incorrectos");
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, user.contraseña);
    if (!contraseñaValida) {
      console.log("Usuario o contraseña incorrectos");
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    return res.json({
      message: `Usuario autenticado. Su usuario es: ${user.nombre}`,
      user: user,
    });
  } catch (error) {
    console.error("Error al verificar usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const postUserC = async (req, res) => {
  try {
    const { usuario, nombre, correo, idrol, contraseña, estado, creadopor } = req.body;

    const users = await postUserM(
      usuario,
      nombre,
      correo,
      idrol,
      contraseña,
      estado,
      creadopor
    );
    //res.json(users)
    res.json({ message: "Usuario Agregado Exitosamente", user: users });
  } catch (error) {
    console.error("Error al insertar el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateUserC = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, nombre, correo, idrol, estado, modificadopor } =
      req.body;
    console.log(req.body);
    const users = await updateUserM(
      usuario,
      nombre,
      correo,
      idrol,
      estado,
      modificadopor,
      id
    );
    res.json({ message: "Usuario Actualizado Exitosamente", user: users });
  } catch (error) {
    console.error("Error al actualizar el usuario: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



export const updateContraseñaC = async (req, res) => {
  try {
    console.log("Entro a la función de actualizar contraseña");

    const { usuario } = req.params;
    const { nuevaContraseña } = req.body;

    const users = await updateContraseñaM(nuevaContraseña, usuario);

    res.status(200).json({
      message: "Contraseña del Usuario Actualizada Exitosamente",
      user: users,
    });
  } catch (error) {
    console.error("Error al actualizar la contraseña del usuario: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};




export const resetContraseñaUserC = async (req, res) => {
  try {
    const { usuario } = req.params;

    const users = await getUsuarioIdM(usuario);

    const usuarioActualizado = await resetContraseñaM(usuario);

    res.json({
      message: "Contraseña reseteada con éxito. ",
      user: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error al resetear la contraseña del usuario: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};




// Controlador para el login
export const loginC = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    const user = await verificarUsuarioM(usuario);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }


    // Verificar si el usuario no tiene rol asignado
    if (user.idrol === null) {
      return res
        .status(401)
        .json({ message: "El usuario no tiene un rol asignado" });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, user.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Verificar si la contraseña es temporal (por ejemplo, "12345678")
    const contraseñaTemporal = await bcrypt.compare("12345678", user.contraseña);
    const requiereCambio = user.estado === "Inactivo";

    if (requiereCambio && contraseñaTemporal) {
      return res.status(403).json({
        message: "Debe cambiar su contraseña",
        user: {
          id: user.id,
          usuario: user.usuario,
          idrol: user.idrol,
          estado: user.estado,
        },
      });
    }

    console.log("Usuario autenticado:", user);
    // Responder incluyendo si ya había sesión activa
    return res.json({
      message: "Inicio de sesión exitoso.",
      user: {
        id: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        correo: user.correo,
        idrol: user.idrol,
        estado: user.estado,
      }
    });

  } catch (error) {
    console.error("Error en login: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
