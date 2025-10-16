import {Router} from "express";
import {getPermisosC, getPermisosIdRolC, postRolconPermisosC, putRolconPermisosC } from "../controllers/ms_rolesypermisos.controller.js";

const router=Router();

router.get('/permisos', getPermisosC)
router.get('/permiso/:id', getPermisosIdRolC)
router.post('/permisos', postRolconPermisosC)
router.put('/permisos', putRolconPermisosC)

export default router;
