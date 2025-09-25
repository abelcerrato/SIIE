import {Router} from "express";
import {pool} from '../db.js'
import {  getUserC, getUserIdC, getUsuarioIdC, loginC, postUserC, resetContraseñaUserC, updateContraseñaC, updateUserC, verificarUsuarioC} from "../controllers/ms_usuarios.controllers.js";

const router=Router();


router.get('/usuarios', getUserC)//Mostrar un listado de usuarios

router.get('/usuario/:id', getUserIdC) // Mostrar un usuario por id

router.get('/usuarioNombre/:usuario', getUsuarioIdC) //Mostrar un usuario por nombre de usuario

router.post('/verificarUsuario', verificarUsuarioC) //Verificar si el usuario existe

router.post('/usuario', postUserC) //Crear usuario

router.put('/usuario/:id', updateUserC) //Actualizar usuario

router.post('/iniciosesion', loginC) // Inicio de sesion



router.put('/resetearContra/:usuario', resetContraseñaUserC); //Reseteo de contraseña para cuando un usario quiera actualizar su contraseña
router.put('/cambioContra/:usuario', updateContraseñaC); //Actualizacion de contraseña



export default router;
