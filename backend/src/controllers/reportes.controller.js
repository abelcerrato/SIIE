
import { getAllSeducM, getConeanfoM, getInfop_capacitados_por_centroM, getInfop_capacitados_por_departamentos_y_municipiosM, getInfop_capacitados_por_modos_de_formacionM, getInfop_capacitados_por_programasM, getInfop_capacitados_por_regionalM, getInfop_capacitados_por_sector_economicoM, getInfop_capacitados_por_unidades_y_cursosM, getInfop_regionesM,  getSeducM, getSeduc_2014_2025M, getSeduc_centros_educativosM, getSeduc_matriculagradoedadM, getSeduc_nivelesacademicosdepartamentoM, getSeduc_niños_con_discapacidadM, getSeduc_servicios_basicosM, getServicios_docentesM, getSseduc_repitenciagradoedad, getVistaResumenCONEANFOCompetenciayEmprendimientoM, getVistaResumenCONEANFODesarrolloSostenibleM, getVistaResumenCONEANFOEParticipantesEducacionInfantilM, getVistaResumenCONEANFOEducacionInfantilM, getVistaResumenCONEANFOFormacionEducadoresM, getVistaResumenCONEANFOM, getVistaResumenCONEANFOParticipantesDesarrolloSostenibleM, getVistaResumenCONEANFOParticipantesFormacionEducadoresM, getVistaResumenCONEANFOatencionesproyectoM, getVistaResumenCONEANFOparticipantesCompetenciasEmprendimientoM, getVistaResumenCONEANFOparticipantesproyectoM, getVistaResumenDESM, getVistaResumenDESdocentesM, getVistaResumenDESgraduadosM, getVistaResumenDESmatriculaCamposM, getVistaResumenDESmatriculaM, getVistaResumenDESmatriculaModCINEIngresoM, getVistaResumenINFOPM,  getVistaResumenInfopUCHoras_FinalizadosM,  getVistaResumenInfopUnidadesCursosM,  getVistaResumenSEDUCM, getVistaResumenSeducCentrosEducativosM, getVistaResumenSeducNiñosConDiscapacidadM, getVistaResumenSeducPuestodeTrabajoM, getVistaResumenSeducServiciosBasicosM, getVistaTasasSEDUCM, getconeanfo_atencionesM, getconeanfo_atenciones_año_sexoM, getconeanfo_atenciones_discapacidadM, getconeanfo_atenciones_etniaM, getconeanfo_atenciones_proyecto_sexoM, getconeanfo_atenciones_prticipantes_proceso_educativoM, getconeanfo_participantesM, getdes_4_10_estudiantes_internacionales_ciclo_completoM, getdes_4_1_estudiantes_primer_titulo_esM, getdes_4_2_estudiantes_primer_titulo_es_10mil_habitantesM, getdes_4_3_persona_que_ingresan_esM, getdes_4_4_nuevos_ingresos_iniciar_programaM, getdes_4_5_graduadosM, getdes_4_6_tasa_bruta_matriculaM, getdes_4_7_tasa_neta_matriculaM, getdes_estudiantes_educacion_superiorM, getdes_total_estudiantes_brutaM, getdes_total_estudiantes_netaM, getinfop_tasasmatriculasM, getinfop_tasasmatriculasmodosformacionM, getinfop_tasasmatriculasprogramasM, getinfop_tasasmatriculasregionalesM, getinfop_tasasmatriculassectoreconomicoM, getseduc_accesoprimergradoM, getseduc_cancelacionpivotgradoM, getseduc_cobertura_neta_bruta_niveleseducativosM, getseduc_coberturabrutaniveleseducativosM, getseduc_coberturanetaniveleseducativosM, getseduc_desercionpivotgradoM, getseduc_escolarizcionporedadesM, getseduc_matriculabrutagradoM, getseduc_matriculanetagradoM, getseduc_tasa_neta_bruta_acceso3prebasicaM, getseduc_tasa_neta_bruta_accesoprimergradobasicaM, getseduc_tasa_neta_bruta_ciclosM, getseduc_tasa_neta_bruta_matriculagradosM, getseduc_tasaaprobacionnivelM, getseduc_tasabrutaacceso3prebasicaM, getseduc_tasabrutaaccesoprimergradobasicaM, getseduc_tasabrutaciclosM, getseduc_tasabrutamatriculagradosM, getseduc_tasadesercionnivelM, getseduc_tasamatriculabrutaM, getseduc_tasamatriculanetaM, getseduc_tasamatriculanetabrutaM, getseduc_tasanetaacceso3prebasicaM, getseduc_tasanetaaccesoprimergradobasicaM, getseduc_tasanetaciclosM, getseduc_tasanetamatriculagradosM, getseduc_tasapromovidosnivelM, getseduc_tasarepitencianivelM, getseduc_tasasupervivencianivelM, getseduc_variacioninteranualprebasicagradoobligatorioM, getsiiedes_matriculadepartamentossexoM } from "../models/reportes.models.js";

/* CONEANFO */

// Controlador para obtener seduc
export const getConeanfoC = async (req, res) => {
  try {
    const coneanfo = await getConeanfoM();
    res.json(coneanfo);
  } catch (error) {
    console.error("Error al obtener coneanfo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


/* SEDUC */

// Controlador para obtener seduc
export const getSeducC = async (req, res) => {
  try {
    const seduc = await getSeducM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para obtener seduc 2014-2025
export const getSeduc1425C = async (req, res) => {
  try {
    const seduc14_25 = await getSeduc_2014_2025M();
    res.json(seduc14_25);
  } catch (error) {
    console.error("Error al obtener seduc 2014-2025:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para centros educativos
export const getSeducCentrosC = async (req, res) => {
  try {
    const centros = await getSeduc_centros_educativosM();
    res.json(centros);
  } catch (error) {
    console.error("Error al obtener centros educativos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para matrícula grado-edad
export const getSeducMatriculaEdadC = async (req, res) => {
  try {
    const matriculasGEdad = await getSeduc_matriculagradoedadM();
    res.json(matriculasGEdad);
  } catch (error) {
    console.error("Error al obtener matrícula grado-edad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para niveles académicos
export const getSeducNivelesC = async (req, res) => {
  try {
    const niveles = await getSeduc_nivelesacademicosdepartamentoM();
    res.json(niveles);
  } catch (error) {
    console.error("Error al obtener niveles académicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para niños con discapacidad
export const getSeducDiscapacidadC = async (req, res) => {
  try {
    const discapacidad = await getSeduc_niños_con_discapacidadM();
    res.json(discapacidad);
  } catch (error) {
    console.error("Error al obtener niños con discapacidad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para repitencia grado-edad
export const getSeducRepitenciaC = async (req, res) => {
  try {
    const repitencia = await getSseduc_repitenciagradoedad();
    res.json(repitencia);
  } catch (error) {
    console.error("Error al obtener repitencia grado-edad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para servicios básicos
export const getSeducServiciosC = async (req, res) => {
  try {
    const servicios = await getSeduc_servicios_basicosM();
    res.json(servicios);
  } catch (error) {
    console.error("Error al obtener servicios básicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para docentes
export const getSeducDocentesC = async (req, res) => {
  try {
    const docentes = await getServicios_docentesM();
    res.json(docentes);
  } catch (error) {
    console.error("Error al obtener docentes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



export const getAllSeducC = async (req, res) => {
  try {
    const data = await getAllSeducM();
    return res.json(data);
  } catch (error) {
    console.error("Error en getAllSeducC:", error);
    return res.status(500).json({
      error: "Ocurrió un error al obtener los datos de SEDUC",
    });
  }
};




/* INFOP */

// Controlador para infop por departamentos y municipios
export const getInfop_capacitados_por_departamentos_y_municipiosC = async (req, res) => {
  try {
    const infop = await getInfop_capacitados_por_departamentos_y_municipiosM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener capacitados_por_departamentos_y_municipios de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Controlador para infop por modos de formación
export const getInfop_capacitados_por_modos_de_formacionC = async (req, res) => {
  try {
    const infop = await getInfop_capacitados_por_modos_de_formacionM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener capacitados_por_modos_de_formacion de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para infop por programas
export const getInfop_capacitados_por_programasC = async (req, res) => {
  try {
    const infop = await getInfop_capacitados_por_programasM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener capacitados_por_programas de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Controlador para infop por regional
export const getInfop_capacitados_por_regionalC = async (req, res) => {
  try {
    const infop = await getInfop_capacitados_por_regionalM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener capacitados_por_regional de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para infop por sector económico
export const getInfop_capacitados_por_sector_economicoC = async (req, res) => {
  try {
    const infop = await getInfop_capacitados_por_sector_economicoM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener capacitados_por_sector_economico de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para mostrar las regiones de infop
export const getInfop_regionesC = async (req, res) => {
  try {
    const infop = await getInfop_regionesM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener las regiones de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Controlador para mostrar las unidades y cursos de infop
export const getInfop_capacitados_por_unidades_y_cursosInfop_regionesC = async (req, res) => {
  try {
    const infop = await getInfop_capacitados_por_unidades_y_cursosM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener las unidades y cursos de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Controlador para mostrar las unidades y cursos de infop
export const getInfop_capacitados_por_centroC = async (req, res) => {
  try {
    const infop = await getInfop_capacitados_por_centroM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener los centros de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


/* SIIE */



/*
  ######################################################################
  ###################### VISTAS  DE INDICADORES ########################
  ######################################################################
*/

/* INFOP */

// Controlador para la tasa de matriculas de infop
export const getinfop_tasasmatriculasC = async (req, res) => {
  try {
    const infop = await getinfop_tasasmatriculasM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener la tasa de matricula de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para la tasa de matriculas por modos de formación de infop
export const getinfop_tasasmatriculasmodosformacionC = async (req, res) => {
  try {
    const infop = await getinfop_tasasmatriculasmodosformacionM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener la tasa por modos de formación de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para la tasa de matriculas por programas de infop
export const getinfop_tasasmatriculasprogramasC = async (req, res) => {
  try {
    const infop = await getinfop_tasasmatriculasprogramasM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener la tasa por programas de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para la tasa de matriculas por regionales de infop
export const getinfop_tasasmatriculasregionalesC = async (req, res) => {
  try {
    const infop = await getinfop_tasasmatriculasregionalesM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener la tasa por regionales de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para la tasa de matriculas por sector económico de infop
export const getinfop_tasasmatriculassectoreconomicoC = async (req, res) => {
  try {
    const infop = await getinfop_tasasmatriculassectoreconomicoM();
    res.json(infop);
  } catch (error) {
    console.error("Error al obtener la tasa por sector económico de infop:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


/* SEDUC */

export const getseduc_accesoprimergradoC = async (req, res) => {
  try {
    const seduc = await getseduc_accesoprimergradoM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getseduc_cancelacionpivotgradoC = async (req, res) => {
  try {
    const seduc = await getseduc_cancelacionpivotgradoM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_coberturanetaniveleseducativosC = async (req, res) => {
  try {
    const seduc = await getseduc_coberturanetaniveleseducativosM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_coberturabrutaniveleseducativosC = async (req, res) => {
  try {
    const seduc = await getseduc_coberturabrutaniveleseducativosM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_cobertura_neta_brutaiveleseducativosC = async (req, res) => {
  try {
    const tasa = await getseduc_cobertura_neta_bruta_niveleseducativosM();
    res.json(tasa);
  } catch (error) {
    console.error("Error al obtener las tasas neta y bruta de cobertura SEDUC:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



export const getseduc_desercionpivotgradoC = async (req, res) => {
  try {
    const seduc = await getseduc_desercionpivotgradoM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_escolarizcionporedadesC = async (req, res) => {
  try {
    const seduc = await getseduc_escolarizcionporedadesM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getseduc_matriculanetagradoC = async (req, res) => {
  try {
    const seduc = await getseduc_matriculanetagradoM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getseduc_matriculabrutagradoC = async (req, res) => {
  try {
    const seduc = await getseduc_matriculabrutagradoM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getseduc_matricula_neta_bruta_gradoC = async (req, res) => {
  try {
    const tasa = await getseduc_matriculanetagradoM();

    res.json(tasa);
  } catch (error) {
    console.error("Error al obtener la tasa de matricula SEDUC:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_tasanetaacceso3prebasicaC = async (req, res) => {
  try {
    const seduc = await getseduc_tasanetaacceso3prebasicaM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getseduc_tasabrutaacceso3prebasicaC = async (req, res) => {
  try {
    const seduc = await getseduc_tasabrutaacceso3prebasicaM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_tasa_neta_bruta_acceso3prebasicaC = async (req, res) => {
  try {
    const tasa = await getseduc_tasa_neta_bruta_acceso3prebasicaM();
    res.json(tasa);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_tasanetaaccesoprimergradobasicaC = async (req, res) => {
  try {
    const seduc = await getseduc_tasanetaaccesoprimergradobasicaM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_tasabrutaaccesoprimergradobasicaC = async (req, res) => {
  try {
    const seduc = await getseduc_tasabrutaaccesoprimergradobasicaM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_tasa_neta_bruta_accesoprimergradobasicaC = async (req, res) => {
  try {
    const tasa = await getseduc_tasa_neta_bruta_accesoprimergradobasicaM();
    res.json(tasa);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



export const getseduc_tasanetaciclosC = async (req, res) => {
  try {
    const seduc = await getseduc_tasanetaciclosM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_tasabrutaciclosC = async (req, res) => {
  try {
    const seduc = await getseduc_tasabrutaciclosM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_tasa_neta_bruta_ciclosC = async (req, res) => {
  try {
    const tasa = await getseduc_tasa_neta_bruta_ciclosM();
    res.json(tasa);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



export const getseduc_tasanetamatriculagradosC = async (req, res) => {
  try {
    const seduc = await getseduc_tasanetamatriculagradosM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getseduc_tasabrutamatriculagradosC = async (req, res) => {
  try {
    const seduc = await getseduc_tasabrutamatriculagradosM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getseduc_tasa_neta_bruta_matriculagradosC = async (req, res) => {
  try {
    const tasa = await getseduc_tasa_neta_bruta_matriculagradosM();

    res.json(tasa);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getseduc_variacioninteranualprebasicagradoobligatorioC = async (req, res) => {
  try {
    const seduc = await getseduc_variacioninteranualprebasicagradoobligatorioM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//seduc_tasarepitencianivel
export const getseduc_tasarepitencianivelC = async (req, res) => {
  try {
    const seduc = await getseduc_tasarepitencianivelM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de repitencias de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//seduc_tasadesercionnivel
export const getseduc_tasadesercionnivelC = async (req, res) => {
  try {
    const seduc = await getseduc_tasadesercionnivelM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de deserción de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//seduc_tasapromovidosnivel
export const getseduc_tasapromovidosnivelC = async (req, res) => {
  try {
    const seduc = await getseduc_tasapromovidosnivelM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de promovidos por nivel de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//seduc_tasaaprobacionnivel
export const getseduc_tasaaprobacionnivelC = async (req, res) => {
  try {
    const seduc = await getseduc_tasaaprobacionnivelM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de aprobados por nivel de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


//seduc_tasasupervivencianivel
export const getseduc_tasasupervivencianivelC = async (req, res) => {
  try {
    const seduc = await getseduc_tasasupervivencianivelM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de supervivencia por nivel de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


//seduc_tasamatriculaneta
export const getseduc_tasamatriculanetaC = async (req, res) => {
  try {
    const seduc = await getseduc_tasamatriculanetaM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de matricula neta por grado de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//seduc_tasamatriculabruta
export const getseduc_tasamatriculabrutaC = async (req, res) => {
  try {
    const seduc = await getseduc_tasamatriculabrutaM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de matricula bruta por grado de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


//seduc_tasamatriculanetabruta
export const getseduc_tasamatriculanetabrutaC = async (req, res) => {
  try {
    const seduc = await getseduc_tasamatriculanetabrutaM();
    res.json(seduc);
  } catch (error) {
    console.error("Error al obtener la tasa de matricula bruta por grado de seduc:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


/* CONEANFO */

export const getconeanfo_atencionesC = async (req, res) => {
  try {
    const coneanfo = await getconeanfo_atencionesM();
    res.json(coneanfo);
  } catch (error) {
    console.error("Error al obtener el reporte de coneanfo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getconeanfo_participantesC = async (req, res) => {
  try {
    const coneanfo = await getconeanfo_participantesM();
    res.json(coneanfo);
  } catch (error) {
    console.error("Error al obtener el reporte de coneanfo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getconeanfo_atenciones_prticipantes_proceso_educativosC = async (req, res) => {
  try {
    const coneanfo = await getconeanfo_atenciones_prticipantes_proceso_educativoM();
    res.json(coneanfo);
  } catch (error) {
    console.error("Error al obtener el reporte de coneanfo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getconeanfo_atenciones_proyecto_sexoC = async (req, res) => {
  try {
    const coneanfo = await getconeanfo_atenciones_proyecto_sexoM();
    res.json(coneanfo);
  } catch (error) {
    console.error("Error al obtener el reporte de coneanfo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getconeanfo_atenciones_año_sexoC = async (req, res) => {
  try {
    const coneanfo = await getconeanfo_atenciones_año_sexoM();
    res.json(coneanfo);
  } catch (error) {
    console.error("Error al obtener el reporte de coneanfo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getgetconeanfo_atenciones_discapacidadC = async (req, res) => {
  try {
    const coneanfo = await getconeanfo_atenciones_discapacidadM();
    res.json(coneanfo);
  } catch (error) {
    console.error("Error al obtener el reporte de coneanfo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getgetconeanfo_atenciones_etniaC = async (req, res) => {
  try {
    const coneanfo = await getconeanfo_atenciones_etniaM();
    res.json(coneanfo);
  } catch (error) {
    console.error("Error al obtener el reporte de coneanfo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



/* DES-UNAH */
export const getdes_4_1_estudiantes_primer_titulo_esC = async (req, res) => {
  try {
    const des = await getdes_4_1_estudiantes_primer_titulo_esM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de estudiantes de primer título de la DES:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getdes_4_2_estudiantes_primer_titulo_es_10mil_habitantesC = async (req, res) => {
  try {
    const des = await getdes_4_2_estudiantes_primer_titulo_es_10mil_habitantesM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de estudiantes de primer título de la DES por cada diezmil habitantes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getdes_4_3_persona_que_ingresan_esC = async (req, res) => {
  try {
    const des = await getdes_4_3_persona_que_ingresan_esM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de las personas que ingresan a la educación superior:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



export const getdes_4_4_nuevos_ingresos_iniciar_programaC = async (req, res) => {
  try {
    const des = await getdes_4_4_nuevos_ingresos_iniciar_programaM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de nuevos ingresos a iniciar un programa:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getdes_4_5_graduadosC = async (req, res) => {
  try {
    const des = await getdes_4_5_graduadosM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de los graduados de la DES:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getdes_4_6_tasa_bruta_matriculaC = async (req, res) => {
  try {
    const des = await getdes_4_6_tasa_bruta_matriculaM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de tasa bruta de matrícula DES:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getdes_4_7_tasa_neta_matriculaC = async (req, res) => {
  try {
    const des = await getdes_4_7_tasa_neta_matriculaM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de tasa neta de matrícula DES:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getdes_4_10_estudiantes_internacionales_ciclo_completoC = async (req, res) => {
  try {
    const des = await getdes_4_10_estudiantes_internacionales_ciclo_completoM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de estudiantes internacionales en ciclo completo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getdes_estudiantes_educacion_superiorC = async (req, res) => {
  try {
    const des = await getdes_estudiantes_educacion_superiorM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de estudiantes de educación superior:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getdes_total_estudiantes_brutaC = async (req, res) => {
  try {
    const des = await getdes_total_estudiantes_brutaM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de total de estudiantes bruta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getdes_total_estudiantes_netaC = async (req, res) => {
  try {
    const des = await getdes_total_estudiantes_netaM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de total de estudiantes neta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getsiiedes_matriculadepartamentossexoC = async (req, res) => {
  try {
    const des = await getsiiedes_matriculadepartamentossexoM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener el reporte de matricula por departamentos y sexo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



//============================================================================================================================================================================================
//                                                                                      VISTAS RESUMEN
//============================================================================================================================================================================================

// VISTA DE TASAS DE SEDUC
export const getVistaTasasSEDUCC = async (req, res) => {
  try {
    const data = await getVistaTasasSEDUCM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//============================================= SUDUC ================================================
// RESUMEN SEDUC
export const getVistaResumenSEDUCC = async (req, res) => {
  try {
    const data = await getVistaResumenSEDUCM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//SEDUC PUESTOS DE TRABAJO O DOCENTES
export const getVistaResumenSEDUCPuestoDeTrabajoC = async (req, res) => {
  try {
    const data = await getVistaResumenSeducPuestodeTrabajoM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};


//SEDUC CENTROS EDUCATIVOS
export const getVistaResumenSEDUCCentrosEducativosC = async (req, res) => {
  try {
    const data = await getVistaResumenSeducCentrosEducativosM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};


//SEDUC SERVICIOS BASICOS
export const getVistaResumenSEDUCServiciosBasicosC = async (req, res) => {
  try {
    const data = await getVistaResumenSeducServiciosBasicosM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};


//SEDUC PERSONAS CON DISCAPACIDAD
export const getVistaResumenSEDUCPersonasDiscapacidadC = async (req, res) => {
  try {
    const data = await getVistaResumenSeducNiñosConDiscapacidadM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};




//============================================= INFOP ================================================
//INFOP CAPACITADOS POR DEPARTAMENTOS Y MUNICIPIOS
export const getVistaResumenINFOPdeptosmunicipiosC = async (req, res) => {
  try {
    const data = await getVistaResumenINFOPM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//INFOP CAPACITADOS POR UNIDADES Y CURSOS
export const getVistaResumenINFOPUnidadesCursosC = async (req, res) => {
  try {
    const data = await getVistaResumenInfopUnidadesCursosM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};


//INFOP CAPACITADOS POR UNIDADES Y CURSOS, HORAS, FINALIZADOS
export const getVistaResumenINFOPUCHorasFinalizadosC = async (req, res) => {
  try {
    const data = await getVistaResumenInfopUCHoras_FinalizadosM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};


//============================================ CONEANFO ===========================================

//CONEANFO ATENCIONES Y PARTICIPANCIONES GENERALES
export const getVistaResumenCONEANFOC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFOM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//======================================== CONEANFO ATENCIONES =======================================
//CONEANFO ATENCIONES POR PROYECTO
export const getVistaResumenCONEANFOatencionesproyectoC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFOatencionesproyectoM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//CONEANFO ATENCIONES POR COMPETENCIAS LABORALES Y EMPRENDIMIENTO
export const getVistaResumenCONEANFOCompetenciayEmprendimientoC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFOCompetenciayEmprendimientoM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//CONEANFO ATENCIONES POR DESARROLLO SOSTENIBLE
export const getVistaResumenCONEANFODesarrolloSostenibleC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFODesarrolloSostenibleM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//CONEANFO ATENCIONES POR FORMACIÓN DE EDUCADORES
export const getVistaResumenCONEANFOFormacionEducadoresC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFOFormacionEducadoresM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//CONEANFO ATENCIONES POR EDUCACIÓN INFANTIL TEMPRANA
export const getVistaResumenCONEANFOEducacionInfantilC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFOEducacionInfantilM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//======================================== CONEANFO PARTICIPANTES =======================================
//CONEANFO PARTICIPANTES POR PROYECTO
export const getVistaResumenCONEANFOparticipantesproyectoC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFOparticipantesproyectoM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//CONEANFO PARTICIPANTES POR COMPETENCIAS LABORALES Y EMPRENDIMIENTO
export const getVistaResumenCONEANFOparticipantesCompetenciasEmprendimientoC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFOparticipantesCompetenciasEmprendimientoM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//CONEANFO PARTICIPANTES POR DESARROLLO SOSTENIBLE
export const getVistaResumenCONEANFOParticipantesDesarrolloSostenibleC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFOParticipantesDesarrolloSostenibleM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//CONEANFO PARTICIPANTES POR FORMACIÓN DE EDUCADORES
export const getVistaResumenCONEANFOParticipantesFormacionEducadoresC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFOParticipantesFormacionEducadoresM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

//CONEANFO PARTICIPANTES POR EDUCACIÓN INFANTIL TEMPRANA
export const getVistaResumenCONEANFOEParticipantesEducacionInfantilC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFOEParticipantesEducacionInfantilM();
    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};


//============================================= DES =============================================
// DES MATRICULAS
export const getVistaResumenDESmatriculaC = async (req, res) => {
  try {
    const data = await getVistaResumenDESmatriculaM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

// DES MATRICULA POR MODALIDAD, CINE Y TIPO DE INGRESO
export const getVistaResumenDESmatriculaModCINEIngresoC = async (req, res) => {
  try {
    const data = await getVistaResumenDESmatriculaModCINEIngresoM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

// DES MATRICULA POR CAMPO DE ESTUDIO
export const getVistaResumenDESmatriculaCamposC = async (req, res) => {
  try {
    const data = await getVistaResumenDESmatriculaCamposM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

// DES GRADUADOS 
export const getVistaResumenDESgraduadosC = async (req, res) => {
  try {
    const data = await getVistaResumenDESgraduadosM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};

// DES DOCENTES
export const getVistaResumenDESdocentesC = async (req, res) => {
  try {
    const data = await getVistaResumenDESdocentesM();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener datos",
      error: error.message
    });
  }
};