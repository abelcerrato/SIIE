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
    getinfop_tasasmatriculasC,
    getinfop_tasasmatriculasmodosformacionC,
    getinfop_tasasmatriculasprogramasC,
    getinfop_tasasmatriculasregionalesC,
    getinfop_tasasmatriculassectoreconomicoC,
    getseduc_accesoprimergradoC,
    getseduc_coberturabrutaniveleseducativosC,
    getseduc_cancelacionpivotgradoC,
    getseduc_coberturanetaniveleseducativosC,
    getseduc_desercionpivotgradoC,
    getseduc_escolarizcionporedadesC,
    getseduc_matriculabrutagradoC,
    getseduc_matriculanetagradoC,
    getseduc_tasabrutaacceso3prebasicaC,
    getseduc_tasabrutaaccesoprimergradobasicaC,
    getseduc_tasabrutaciclosC,
    getseduc_tasabrutamatriculagradosC,
    getseduc_tasanetaacceso3prebasicaC,
    getseduc_tasanetaaccesoprimergradobasicaC,
    getseduc_tasanetaciclosC,
    getseduc_tasanetamatriculagradosC,
    getseduc_variacioninteranualprebasicagradoobligatorioC,
    getseduc_matricula_neta_bruta_gradoC,
    getseduc_tasa_neta_bruta_acceso3prebasicaC,
    getseduc_tasa_neta_bruta_accesoprimergradobasicaC,
    getseduc_tasa_neta_bruta_ciclosC,
    getseduc_tasa_neta_bruta_matriculagradosC,
    getseduc_cobertura_neta_brutaiveleseducativosC,
    getConeanfoC,
    getconeanfo_atenciones_proyecto_sexoC,
    getconeanfo_atenciones_año_sexoC,
    getgetconeanfo_atenciones_discapacidadC,
    getgetconeanfo_atenciones_etniaC,
    getconeanfo_atencionesC,
    getconeanfo_participantesC,
    getconeanfo_atenciones_prticipantes_proceso_educativosC,
    getInfop_capacitados_por_unidades_y_cursosInfop_regionesC,
    getInfop_capacitados_por_centroC,
    getdes_4_1_estudiantes_primer_titulo_esC,
    getdes_4_2_estudiantes_primer_titulo_es_10mil_habitantesC,
    getdes_4_3_persona_que_ingresan_esC,
    getdes_4_4_nuevos_ingresos_iniciar_programaC,
    getdes_4_5_graduadosC,
    getdes_4_6_tasa_bruta_matriculaC,
    getdes_4_7_tasa_neta_matriculaC,
    getdes_4_10_estudiantes_internacionales_ciclo_completoC,
    getdes_estudiantes_educacion_superiorC,
    getdes_total_estudiantes_brutaC,
    getdes_total_estudiantes_netaC,
    getsiiedes_matriculadepartamentossexoC,
    getVistaResumenSEDUCC,
    getVistaResumenSEDUCPuestoDeTrabajoC,
    getVistaResumenSEDUCCentrosEducativosC,
    getVistaResumenSEDUCPersonasDiscapacidadC,
    getVistaResumenSEDUCServiciosBasicosC,
    getVistaResumenINFOPdeptosmunicipiosC,
    getVistaResumenINFOPUnidadesCursosC,
    getVistaResumenCONEANFOC,
    getVistaResumenDESmatriculaC,
    getVistaResumenDESgraduadosC,
    getVistaResumenDESmatriculaModCINEIngresoC,
    getVistaResumenDESmatriculaCamposC,
    getVistaResumenCONEANFOatencionesproyectoC,
    getVistaResumenCONEANFOCompetenciayEmprendimientoC,
    getVistaResumenCONEANFODesarrolloSostenibleC,
    getVistaResumenCONEANFOFormacionEducadoresC,
    getVistaResumenCONEANFOEducacionInfantilC,
    getVistaResumenCONEANFOparticipantesproyectoC,
    getVistaResumenCONEANFOParticipantesDesarrolloSostenibleC,
    getVistaResumenCONEANFOEParticipantesEducacionInfantilC,
    getVistaResumenCONEANFOParticipantesFormacionEducadoresC,
    getVistaResumenDESdocentesC,
    getVistaTasasSEDUCC,
    getseduc_tasarepitencianivelC,
    getseduc_tasadesercionnivelC,
    getseduc_tasapromovidosnivelC,
    getseduc_tasaaprobacionnivelC,
    getseduc_tasasupervivencianivelC,
    getseduc_tasamatriculanetaC,
    getseduc_tasamatriculabrutaC,
    getseduc_tasamatriculanetabrutaC,
    getVistaResumenINFOPUCHorasFinalizadosC,
    getVistaResumenCONEANFOparticipantesCompetenciasEmprendimientoC,
    
} from "../controllers/reportes.controller.js";

const router = Router();


/*
  ######################################################################
  ############################## SE USAN ###############################
  ######################################################################
*/

/* SEDUC */
router.get("/seduc1425", getSeduc1425C);  //SI SE USA
router.get("/niveles", getSeducNivelesC);  //SI SE USA


/* INFOP */
router.get("/infopcapacitadospordepartamentos", getInfop_capacitados_por_departamentos_y_municipiosC); //SI SE USA
router.get("/infopcapacitadospormodos", getInfop_capacitados_por_modos_de_formacionC); //SI SE USA
router.get("/infopcapacitadosporprogramas", getInfop_capacitados_por_programasC);    //SI SE USA
router.get("/infopcapacitadosporegional", getInfop_capacitados_por_regionalC);   //SI SE USA
router.get("/infopcapacitadosporsectoreconomico", getInfop_capacitados_por_sector_economicoC);   //SI SE USA
router.get("/infopcentros", getInfop_capacitados_por_centroC);   //SI SE USA
router.get("/infoptasasmatriculas", getinfop_tasasmatriculasC); //SI SE USA
router.get("/infoptasasmatriculasmodosformacion", getinfop_tasasmatriculasmodosformacionC);   //SI SE USA
router.get("/infoptasasmatriculasprogramas", getinfop_tasasmatriculasprogramasC);   //SI SE USA
router.get("/infoptasasmatriculasregionales", getinfop_tasasmatriculasregionalesC);  //SI SE USA
router.get("/infoptasasmatriculassectoreconomico", getinfop_tasasmatriculassectoreconomicoC);    //SI SE USA
router.get("/vistaresumeninfopdepartamentosmunicipios", getVistaResumenINFOPdeptosmunicipiosC ) //INFOP CAPACITADOS POR DEPARTAMENTOS Y MUNICIPIOS  //SI SE USA
router.get("/vistaresumeninfopunidadescursos", getVistaResumenINFOPUnidadesCursosC) //INFOP UNIDADES Y CURSOS   //SI SE USA
router.get("/vistaresumeninfopUChorasfinalizados", getVistaResumenINFOPUCHorasFinalizadosC) //INFOP UNIDADES Y CURSOS FILTRO POR HORAS Y FINALIZADOS   //SI SE USA



/* SEDUC */
router.get("/seducaccesoprimergrado", getseduc_accesoprimergradoC); //SI SE USA
router.get("/seduccoberturanetaniveleseducativos", getseduc_coberturanetaniveleseducativosC);  //SI SE USA
router.get("/seducescolarizcionporedades", getseduc_escolarizcionporedadesC);  //SI SE USA
router.get("/seductasanetabrutaciclos",  getseduc_tasa_neta_bruta_ciclosC); //Tasa neta y bruta ciclos  //SI SE USA
router.get("/seducvariacioninteranualprebasicagradoobligatorio",  getseduc_variacioninteranualprebasicagradoobligatorioC);  //SI SE USA
router.get("/vistaresumenseduc", getVistaResumenSEDUCC) //SEDUC   //SI SE USA
router.get("/vistaresumenseducpuestodetrabajo", getVistaResumenSEDUCPuestoDeTrabajoC) // PUESTOS DE TRABAJO O DOCENTES //SI SE USA
router.get("/vistaresumenseduccentroseducativos", getVistaResumenSEDUCCentrosEducativosC) // CENTROS EDUCATIVOS    //SI SE USA
router.get("/vistaresumenseducserviciosbasicos", getVistaResumenSEDUCServiciosBasicosC) // SERVICIOS BASICOS DE CENTROS EDUCATIVOS  //SI SE USA
router.get("/vistaresumenseducpersonascondiscapacidad", getVistaResumenSEDUCPersonasDiscapacidadC)// PERSONAS CON DISCAPACIDAD    //SI SE USA

router.get("/seductasarepitencianivel",  getseduc_tasarepitencianivelC); //seduc_tasarepitencianivel  //SI SE USA
router.get("/seductasadesercionnivel",  getseduc_tasadesercionnivelC); //seduc_tasadesercionnivel      //SI SE USA
router.get("/seductasapromovidosnivel",  getseduc_tasapromovidosnivelC); //seduc_tasapromovidosnivel    //SI SE USA
router.get("/seductasaaprobacionnivel", getseduc_tasaaprobacionnivelC ); //seduc_tasaaprobacionnivel     //SI SE USA
router.get("/seductasasupervivencianivel", getseduc_tasasupervivencianivelC ); //seduc_tasasupervivencianivel       //SI SE USA
router.get("/seductasamatriculanetabruta", getseduc_tasamatriculanetabrutaC ); //seduc_tasamatriculanetabruta (unión de las dos vistas)  //SI SE USA

router.get("/seductasanetabrutaacceso3prebasica",  getseduc_tasa_neta_bruta_acceso3prebasicaC); //Tasa neta y bruta acceso 3 prebasica  //SI SE USA
router.get("/seductasanetabrutaaccesoprimergradobasica",  getseduc_tasa_neta_bruta_accesoprimergradobasicaC); //Tasa neta y bruta acceso primer grado basica  //SI SE USA




/* DES */
router.get("/desestudiantesprimertitulo", getdes_4_1_estudiantes_primer_titulo_esC); //SI SE USA
router.get("/desestudiantesprimertitulox10milhabitantes", getdes_4_2_estudiantes_primer_titulo_es_10mil_habitantesC);//SI SE USA
router.get("/despersonasqueingresan", getdes_4_3_persona_que_ingresan_esC); //SI SE USA
router.get("/desnuevosingresosiniciarprograma", getdes_4_4_nuevos_ingresos_iniciar_programaC); //SI SE USA
router.get("/desgraduados", getdes_4_5_graduadosC);  //SI SE USA
router.get("/destasabrutamatricula", getdes_4_6_tasa_bruta_matriculaC );  //SI SE USA
router.get("/destasanetamatricula", getdes_4_7_tasa_neta_matriculaC );   //SI SE USA 
router.get("/desestudiantesinternacionales", getdes_4_10_estudiantes_internacionales_ciclo_completoC); //SI SE USA
router.get("/vistaresumendesmatriculadepartamento", getVistaResumenDESmatriculaC) //DES MATRICULA POR DEPARTAMENTO //SI SE USA
router.get("/vistaresumendesmatriculaModCineIngreso", getVistaResumenDESmatriculaModCINEIngresoC) //DES MATRICULA POR MODALIDAD, CLASIFICACION CINE Y TIPO INGRESO  //SI SE USA
router.get("/vistaresumendesmatriculaCampos", getVistaResumenDESmatriculaCamposC) //DES MATRICULA POR CAMPO AMPLIO, DETALLADO Y ESPECÍFICO  //SI SE USA


// =====================
//       CONEANFO
// =====================
// Atenciones
router.get("/vistaresumenconeanfoatencionesproyecto", getVistaResumenCONEANFOatencionesproyectoC) //CONEANFO ATENCIONES POR PROYECTO   //SI SE USA
router.get("/vistaresumenconeanfocompetenciayemprendimiento", getVistaResumenCONEANFOCompetenciayEmprendimientoC) //CONEANFO ATENCIONES COMPETENCIAS LABORALES Y EMPRENDIMIENTO   //SI SE USA
router.get("/vistaresumenconeanfodesarrollosostenible", getVistaResumenCONEANFODesarrolloSostenibleC) //CONEANFO ATENCIONES EN EDUCACION AL DESARROLLO SOSTENIBLE   //SI SE USA
router.get("/vistaresumenconeanfoformacioneducadores", getVistaResumenCONEANFOFormacionEducadoresC) //CONEANFO ATENCIONES EN FORMACIÓN DE EDUCADORES  //SI SE USA
router.get("/vistaresumenconeanfoeducacioninfantil", getVistaResumenCONEANFOEducacionInfantilC) //CONEANFO ATENCIONES EN EDUCACIÓN INFANTIL TEMPRANA   //SI SE USA


//Participaciones
router.get("/vistaresumenconeanfoparticipantescompetenciasemprendimiento", getVistaResumenCONEANFOparticipantesCompetenciasEmprendimientoC) //CONEANFO PARTICIPANTES COMPETENCIAS LABORALES Y EMPRENDIMIENTO   //SI SE USA
router.get("/vistaresumenconeanfoparticipantesdesarrollosostenible", getVistaResumenCONEANFOParticipantesDesarrolloSostenibleC) //CONEANFO PARTICIPANTES EN EDUCACION AL DESARROLLO SOSTENIBLE   //SI SE USA
router.get("/vistaresumenconeanfoparticipantesformacioneducadores", getVistaResumenCONEANFOParticipantesFormacionEducadoresC) //CONEANFO PARTICIPANTES EN FORMACIÓN DE EDUCADORES //SI SE USA
router.get("/vistaresumenconeanfoparticipanteseducacioninfantil", getVistaResumenCONEANFOEParticipantesEducacionInfantilC) //CONEANFO PARTICIPANTES EN EDUCACIÓN INFANTIL TEMPRANA  //SI SE USA


/*
  ######################################################################
  ############################# NO SE USAN #############################
  ######################################################################
*/

/* CONEANFO */
router.get("/coneanfo", getConeanfoC); 
router.get("/coneanfoatenciones", getconeanfo_atencionesC);
router.get("/coneanfoparticipantes", getconeanfo_participantesC);
router.get("/coneanfoprocesoeducativo", getconeanfo_atenciones_prticipantes_proceso_educativosC);
router.get("/coneanfoatencionesproyectosexo", getconeanfo_atenciones_proyecto_sexoC); //no se usa
router.get("/coneanfoatencionesaniosexo", getconeanfo_atenciones_año_sexoC) // no se usa
router.get("/coneanfoatencionesdiscapacidad", getgetconeanfo_atenciones_discapacidadC); //no se usa
router.get("/coneanfoatencionesetnia", getgetconeanfo_atenciones_etniaC); //no se usa
router.get("/vistaresumenconeanfo", getVistaResumenCONEANFOC) //CONEANFO RESUMEN ATENCIONES Y PARTICIPACIONES
router.get("/vistaresumenconeanfoparticipantesproyecto", getVistaResumenCONEANFOparticipantesproyectoC) //CONEANFO PARTICIPANTES POR PROYECTO


/* SEDUC */
router.get("/seduc", getSeducC); //no trae los datos
router.get("/centros", getSeducCentrosC);
router.get("/matricula-edad", getSeducMatriculaEdadC);
router.get("/discapacidad", getSeducDiscapacidadC);
router.get("/repitencia", getSeducRepitenciaC);
router.get("/servicios", getSeducServiciosC);
router.get("/docentes", getSeducDocentesC);
router.get("/seduccoberturabrutaniveleseducativos", getseduc_coberturabrutaniveleseducativosC);


/* INFOP */
router.get("/infopregiones", getInfop_regionesC);
router.get("/infopunidadesycursos", getInfop_capacitados_por_unidades_y_cursosInfop_regionesC);

/* SEDUC */
router.get("/seduccancelacionpivotgrado", getseduc_cancelacionpivotgradoC);
router.get("/seduccoberturanetabrutaniveleseducativos", getseduc_cobertura_neta_brutaiveleseducativosC); //NETA Y BRUTA NIVELES
router.get("/seducdesercionpivotgrado", getseduc_desercionpivotgradoC);
router.get("/seducmatriculabrutagrado", getseduc_matriculabrutagradoC);
router.get("/seducmatriculanetagrado", getseduc_matriculanetagradoC);
router.get("/seducmatriculanetabrutagrado", getseduc_matricula_neta_bruta_gradoC); //Matricula neta y bruta por grado, esta no es tasa
router.get("/seductasabrutaacceso3prebasica", getseduc_tasabrutaacceso3prebasicaC);
router.get("/seductasanetaacceso3prebasica",  getseduc_tasanetaacceso3prebasicaC);
router.get("/seductasanetaaccesoprimergradobasica",  getseduc_tasanetaaccesoprimergradobasicaC);
router.get("/seductasabrutaaccesoprimergradobasica", getseduc_tasabrutaaccesoprimergradobasicaC );
router.get("/seductasanetaciclos", getseduc_tasanetaciclosC );
router.get("/seductasabrutaciclos",  getseduc_tasabrutaciclosC);
router.get("/seductasanetamatriculagrados",  getseduc_tasanetamatriculagradosC);
router.get("/seductasabrutamatriculagrados",  getseduc_tasabrutamatriculagradosC);
router.get("/seducmatriculanetabrutamatriculagrados", getseduc_tasa_neta_bruta_matriculagradosC); //Matricula neta y bruta por grado
router.get("/seductasamatriculaneta", getseduc_tasamatriculanetaC ); //seduc_tasamatriculaneta
router.get("/seductasamatriculabruta", getseduc_tasamatriculabrutaC ); //seduc_tasamatriculabruta
router.get("/vistatasasseduc", getVistaTasasSEDUCC) // VISTA DE TASAS DE SEDUC


/* DES */
router.get("/desestudianteseducacionsuperior", getdes_estudiantes_educacion_superiorC);
router.get("/destotalestudiantesbruta", getdes_total_estudiantes_brutaC);
router.get("/destotalestudiantesneta", getdes_total_estudiantes_netaC);
router.get("/desmatriculadepartamentossexo", getsiiedes_matriculadepartamentossexoC);
router.get("/vistaresumendesgraduadosdepartamento", getVistaResumenDESgraduadosC) //GRADUADOS POR DEPARTAMENTO
router.get("/vistaresumendesdocentesdepartamento", getVistaResumenDESdocentesC) //DOCENTES POR DEPARTAMENTO


export default router;