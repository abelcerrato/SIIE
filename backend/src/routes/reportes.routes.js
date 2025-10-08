import { Router } from "express";
import {
    getSeducC,
    getSeduc1425C,
    getSeducCentrosC,
    getSeducMatriculaEdadC,
    getSeducNivelesC,
    getSeducDiscapacidadC,
    getSeducRepitenciaC,
    getSeducServiciosC,
    getSeducDocentesC,
    getAllSeducC,
    getInfop_capacitados_por_departamentos_y_municipiosC,
    getInfop_capacitados_por_modos_de_formacionC,
    getInfop_capacitados_por_programasC,
    getInfop_capacitados_por_regionalC,
    getInfop_capacitados_por_sector_economicoC,
    getInfop_regionesC,
    getDES_matricula_por_grado_academicoC,
    getDES_matricula_por_institucionC,
    getDES_matricula_por_sexoC,
    getSIIE_matricula_por_departamentoC,
    getSIIE_matricula_por_institucionC,
    getSIIE_matricula_por_sexoC,
    getinfop_tasasmatriculasC,
    getinfop_tasasmatriculasmodosformacionC,
    getinfop_tasasmatriculasprogramasC,
    getinfop_tasasmatriculasregionalesC,
    getinfop_tasasmatriculassectoreconomicoC
} from "../controllers/reportes.controller.js";

const router = Router();

/*
  ######################################################################
  ############################### TABLAS ###############################
  ######################################################################
*/

/* SEDUC */
router.get("/seduc", getSeducC); //no trae los datos
router.get("/seduc1425", getSeduc1425C);
router.get("/centros", getSeducCentrosC);
router.get("/matricula-edad", getSeducMatriculaEdadC);
router.get("/niveles", getSeducNivelesC);
router.get("/discapacidad", getSeducDiscapacidadC);
router.get("/repitencia", getSeducRepitenciaC);
router.get("/servicios", getSeducServiciosC);
router.get("/docentes", getSeducDocentesC);


//router.get("/seduc", getAllSeducC);



/* INFOP */
router.get("/infopcapacitadospordepartamentos", getInfop_capacitados_por_departamentos_y_municipiosC);
router.get("/infopcapacitadospormodos", getInfop_capacitados_por_modos_de_formacionC);
router.get("/infopcapacitadosporprogramas", getInfop_capacitados_por_programasC);
router.get("/infopcapacitadosporegional", getInfop_capacitados_por_regionalC);
router.get("/infopcapacitadosporsectoreconomico", getInfop_capacitados_por_sector_economicoC);
router.get("/infopregiones", getInfop_regionesC);


/* DES */
router.get("/desmatriculaporgradoacademico", getDES_matricula_por_grado_academicoC);
router.get("/desmatriculaporinstitucion", getDES_matricula_por_institucionC);
router.get("/desmatriculaporsexo", getDES_matricula_por_sexoC);


/* SIIE */
router.get("/siiematriculapordepartamento", getSIIE_matricula_por_departamentoC);
router.get("/siiematriculaporinstitucion", getSIIE_matricula_por_institucionC);
router.get("/siiematriculaporsexo", getSIIE_matricula_por_sexoC);



/*
  ######################################################################
  ############################### TASAS ###############################
  ######################################################################
*/

/* INFOP */
router.get("/infoptasasmatriculas", getinfop_tasasmatriculasC);
router.get("/infoptasasmatriculasmodosformacion", getinfop_tasasmatriculasmodosformacionC);
router.get("/infoptasasmatriculasprogramas", getinfop_tasasmatriculasprogramasC);
router.get("/infoptasasmatriculasprogramas", getinfop_tasasmatriculasregionalesC);
router.get("/infoptasasmatriculassectoreconomico", getinfop_tasasmatriculassectoreconomicoC);





export default router;
