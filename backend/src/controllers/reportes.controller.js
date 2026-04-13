
import { getAllSeducM, getConeanfoM, getInfop_capacitados_por_centroM, getInfop_capacitados_por_departamentos_y_municipiosM, getInfop_capacitados_por_modos_de_formacionM, getInfop_capacitados_por_programasM, getInfop_capacitados_por_regionalM, getInfop_capacitados_por_sector_economicoM, getInfop_capacitados_por_unidades_y_cursosM, getInfop_regionesM, getSIIE_matricula_por_departamentoM, getSIIE_matricula_por_institucionM, getSIIE_matricula_por_sexoM, getSeducM, getSeduc_2014_2025M, getSeduc_centros_educativosM, getSeduc_matriculagradoedadM, getSeduc_nivelesacademicosdepartamentoM, getSeduc_niños_con_discapacidadM, getSeduc_servicios_basicosM, getServicios_docentesM, getSseduc_repitenciagradoedad, getVistaResumenCONEANFOM, getVistaResumenDESM, getVistaResumenDESgraduadosM, getVistaResumenDESmatriculaCamposM, getVistaResumenDESmatriculaM, getVistaResumenDESmatriculaModCINEIngresoM, getVistaResumenINFOPM,  getVistaResumenInfopUnidadesCursosM,  getVistaResumenSEDUCM, getVistaResumenSeducCentrosEducativosM, getVistaResumenSeducNiñosConDiscapacidadM, getVistaResumenSeducPuestodeTrabajoM, getVistaResumenSeducServiciosBasicosM, getconeanfo_atencionesM, getconeanfo_atenciones_año_sexoM, getconeanfo_atenciones_discapacidadM, getconeanfo_atenciones_etniaM, getconeanfo_atenciones_proyecto_sexoM, getconeanfo_atenciones_prticipantes_proceso_educativoM, getconeanfo_participantesM, getdes_4_10_estudiantes_internacionales_ciclo_completoM, getdes_4_1_estudiantes_primer_titulo_esM, getdes_4_2_estudiantes_primer_titulo_es_10mil_habitantesM, getdes_4_3_persona_que_ingresan_esM, getdes_4_4_nuevos_ingresos_iniciar_programaM, getdes_4_5_graduadosM, getdes_4_6_tasa_bruta_matriculaM, getdes_4_7_tasa_neta_matriculaM, getdes_estudiantes_educacion_superiorM, getdes_total_estudiantes_brutaM, getdes_total_estudiantes_netaM, getinfop_tasasmatriculasM, getinfop_tasasmatriculasmodosformacionM, getinfop_tasasmatriculasprogramasM, getinfop_tasasmatriculasregionalesM, getinfop_tasasmatriculassectoreconomicoM, getseduc_accesoprimergradoM, getseduc_cancelacionpivotgradoM, getseduc_cobertura_neta_bruta_niveleseducativosM, getseduc_coberturabrutaniveleseducativosM, getseduc_coberturanetaniveleseducativosM, getseduc_desercionpivotgradoM, getseduc_escolarizcionporedadesM, getseduc_matriculabrutagradoM, getseduc_matriculanetagradoM, getseduc_tasa_neta_bruta_acceso3prebasicaM, getseduc_tasa_neta_bruta_accesoprimergradobasicaM, getseduc_tasa_neta_bruta_ciclosM, getseduc_tasa_neta_bruta_matriculagradosM, getseduc_tasabrutaacceso3prebasicaM, getseduc_tasabrutaaccesoprimergradobasicaM, getseduc_tasabrutaciclosM, getseduc_tasabrutamatriculagradosM, getseduc_tasanetaacceso3prebasicaM, getseduc_tasanetaaccesoprimergradobasicaM, getseduc_tasanetaciclosM, getseduc_tasanetamatriculagradosM, getseduc_variacioninteranualprebasicagradoobligatorioM, getsiiedes_matriculadepartamentossexoM } from "../models/reportes.models.js";

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
// Controlador para mostrar la matricula por departamento de SIIE
export const getSIIE_matricula_por_departamentoC = async (req, res) => {
  try {
    const siie = await getSIIE_matricula_por_departamentoM();
    res.json(siie);
  } catch (error) {
    console.error("Error al obtener la matricula por departamento de SIIE:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para mostrar la matricula por institucion de SIIE
export const getSIIE_matricula_por_institucionC = async (req, res) => {
  try {
    const siie = await getSIIE_matricula_por_institucionM();
    res.json(siie);
  } catch (error) {
    console.error("Error al obtener la matricula por institución de SIIE:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para mostrar la matricula por sexo de SIIE
export const getSIIE_matricula_por_sexoC = async (req, res) => {
  try {
    const siie = await getSIIE_matricula_por_sexoM();
    res.json(siie);
  } catch (error) {
    console.error("Error al obtener la matricula por sexo de SIIE:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



/*
  ######################################################################
  ############################### VISTAS ###############################
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


//============================================================================================================
export const getVistaResumenGeneralC = async (req, res) => {
  try {
    //console.log("Entro en controlador");

    const seduc = await getVistaResumenSEDUCM();
    const infop = await getVistaResumenINFOPM();
    const coneanfo = await getVistaResumenCONEANFOM();
    const des = await getVistaResumenDESM();

    // ========================
    // Helper para crear mapas
    // ========================
    const crearMapa = (data, campoPeriodo = "periodo") => {
      const map = new Map();

      data.forEach(d => {
        const key = `${String(d[campoPeriodo]).trim()}-${d.departamento.trim()}`;
        map.set(key, d);
      });

      return map;
    };

    const infopMap = crearMapa(infop);
    const coneanfoMap = crearMapa(coneanfo);
    const desMap = crearMapa(des, "anio");

    // =====================
    // Unión final
    // =====================
    const resultado = seduc.map(s => {
      //const key = `${String(s.periodo).trim()}-${s.departamento.trim()}`;
      const key = `${String(s.periodo).trim()}-${s.departamento.trim()}-${s.municipio.trim()}-${s.administracion.trim()}`;
    

      const infopData = infopMap.get(key) || {};
      const coneanfoData = coneanfoMap.get(key) || {};
      const desData = desMap.get(key) || {};

      return {
        ...s,

        // SEDUC 
        MatriculaIncialMujeresSEDUC: Number(s.MatriculaIncialMujeresSEDUC) || 0,
        MatriculaInicialHombresSEDUC: Number(s.MatriculaInicialHombresSEDUC) || 0,
        MatriculaInicialTotalSEDUC: Number(s.MatriculaInicialTotalSEDUC) || 0,

        DesercionMujeresSEDUC: Number(s.DesercionMujeresSEDUC) || 0,
        DesercionHombresSEDUC: Number(s.DesercionHombresSEDUC) || 0,
        DesercionTotalSEDUC: Number(s.DesercionTotalSEDUC) || 0,

        CancelacionMujeresSEDUC: Number(s.CancelacionMujeresSEDUC) || 0,
        CancelacionHombresSEDUC: Number(s.CancelacionHombresSEDUC) || 0,
        CancelacionTotalSEDUC: Number(s.CancelacionTotalSEDUC) || 0,

        MatriculaFinalMujeresSEDUC: Number(s.MatriculaFinalMujeresSEDUC) || 0,
        MatriculaFinalHombresSEDUC: Number(s.MatriculaFinalHombresSEDUC) || 0,
        MatriculaFinalTotalSEDUC: Number(s.MatriculaFinalTotalSEDUC) || 0,

        RepitenciaMujeresSEDUC: Number(s.RepitenciaMujeresSEDUC) || 0,
        RepitenciaHombresSEDUC: Number(s.RepitenciaHombresSEDUC) || 0,
        RepitenciaTotalSEDUC: Number(s.RepitenciaTotalSEDUC) || 0,

        ReprobadasMujeresSEDUC: Number(s.ReprobadasMujeresSEDUC) || 0,
        ReprobadosHombresSEDUC: Number(s.ReprobadosHombresSEDUC) || 0,
        ReprobadosTotalSEDUC: Number(s.ReprobadosTotalSEDUC) || 0,

        AprobadosMujerSEDUC: Number(s.AprobadosMujerSEDUC) || 0,
        AprobadosHombresSEDUC: Number(s.AprobadosHombresSEDUC) || 0,
        AprobadosTotalSEDUC: Number(s.AprobadosTotalSEDUC) || 0,

        // INFOP
        MatriculaIncialMujeresINFOP: Number(infopData.MatriculaIncialMujeresINFOP) || 0,
        MatriculaInicialHombresINFOP: Number(infopData.MatriculaInicialHombresINFOP) || 0,
        MatriculaInicialTotalINFOP: Number(infopData.MatriculaInicialTotalINFOP) || 0,
        DesercionMujeresINFOP: Number(infopData.DesercionMujeresINFOP) || 0,
        DesercionHombresINFOP: Number(infopData.DesercionHombresINFOP) || 0,
        DesercionTotalINFOP: Number(infopData.DesercionTotalINFOP) || 0,
        ReprobadasMujeresINFOP: Number(infopData.ReprobadasMujeresINFOP) || 0,
        ReprobadosHombresINFOP: Number(infopData.ReprobadosHombresINFOP) || 0,
        ReprobadosTotalINFOP: Number(infopData.ReprobadosTotalINFOP) || 0,
        AprobadosMujerINFOP: Number(infopData.AprobadosMujerINFOP) || 0,
        AprobadosHombresINFOP: Number(infopData.AprobadosHombresINFOP) || 0,
        AprobadosTotalINFOP: Number(infopData.AprobadosTotalINFOP) || 0,

        // CONEANFO
        AtencionesMujeresCONEANFO: Number(coneanfoData.AtencionesMujeresCONEANFO) || 0,
        AtencionesInicialHombresCONEANFO: Number(coneanfoData.AtencionesInicialHombresCONEANFO) || 0,
        AtencionesInicialTotalCONEANFO: Number(coneanfoData.AtencionesInicialTotalCONEANFO) || 0,
        ParticipantesMujeresCONEANFO: Number(coneanfoData.ParticipantesMujeresCONEANFO) || 0,
        ParticipantesInicialHombresCONEANFO: Number(coneanfoData.ParticipantesInicialHombresCONEANFO) || 0,
        ParticipantesInicialTotalCONEANFO: Number(coneanfoData.ParticipantesInicialTotalCONEANFO) || 0,

        // DES
        MatriculaDES: Number(desData.matriculades) || 0
      };
    });

    return res.status(200).json({
      ok: true,
      data: resultado
    });

  } catch (error) {
    console.error("Error en getVistaResumenGeneral:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al obtener vista resumen",
      error: error.message
    });
  }
};


//====================================================================================================
//============================================= SEDUC ================================================
//====================================================================================================

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

// PUESTOS DE TRABAJO O DOCENTES
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


// CENTROS EDUCATIVOS
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


// SERVICIOS BASICOS
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


// PERSONAS CON DISCAPACIDAD
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



/* export const getVistaResumenSEDUCTODOC = async (req, res) => {
  try {
    console.log("Entro en controlador");

    const seduc = await getVistaResumenSEDUCM();
    const puestotrabajo = await getVistaResumenSeducPuestodeTrabajoM();
    const centros = await getVistaResumenSeducCentrosEducativosM();
    const discapacidad = await getVistaResumenSeducNiñosConDiscapacidadM();

    // =====================
    // MAPA PUESTOS (nivel completo)
    // =====================
    const puestoMap = new Map();

    puestotrabajo.forEach(p => {
      const key = `${p.periodo}-${p.departamento}-${p.municipio}-${p.administracion}`;
      puestoMap.set(key, p);
    });

    // =====================
    // MAPA CENTROS (solo periodo + depto)
    // =====================
    const centrosMap = new Map();

    centros.forEach(c => {
      const key = `${c.periodo}-${c.departamento}`;
      centrosMap.set(key, c);
    });

    // =====================
    // MAPA DISCAPACIDAD (AGREGADO)
    // =====================
    const discapacidadMap = new Map();

    discapacidad.forEach(d => {
      const key = `${d.periodo}-${d.departamento}-${d.municipio}-${d.administracion}`;

      if (!discapacidadMap.has(key)) {
        discapacidadMap.set(key, {
          Niñas: 0,
          Niños: 0,
          Total: 0
        });
      }

      const actual = discapacidadMap.get(key);

      actual.Niñas += Number(d.NiñasConDiscapacidad) || 0;
      actual.Niños += Number(d.NiñosConDiscapacidad) || 0;
      actual.Total += Number(d.TotalConDiscapacidad) || 0;
    });

    // =====================
    // UNIÓN FINAL
    // =====================
    const resultado = seduc.map(s => {

      const keyFull = `${s.periodo}-${s.departamento}-${s.municipio}-${s.administracion}`;
      const keyDepto = `${s.periodo}-${s.departamento}`;

      const puesto = puestoMap.get(keyFull) || {};
      const centro = centrosMap.get(keyDepto) || {};
      const disc = discapacidadMap.get(keyFull) || {};

      return {
        ...s,

        // =====================
        // SEDUC
        // =====================
        MatriculaIncialMujeresSEDUC: Number(s.MatriculaIncialMujeresSEDUC) || 0,
        MatriculaInicialHombresSEDUC: Number(s.MatriculaInicialHombresSEDUC) || 0,
        MatriculaInicialTotalSEDUC: Number(s.MatriculaInicialTotalSEDUC) || 0,

        DesercionMujeresSEDUC: Number(s.DesercionMujeresSEDUC) || 0,
        DesercionHombresSEDUC: Number(s.DesercionHombresSEDUC) || 0,
        DesercionTotalSEDUC: Number(s.DesercionTotalSEDUC) || 0,

        CancelacionMujeresSEDUC: Number(s.CancelacionMujeresSEDUC) || 0,
        CancelacionHombresSEDUC: Number(s.CancelacionHombresSEDUC) || 0,
        CancelacionTotalSEDUC: Number(s.CancelacionTotalSEDUC) || 0,

        MatriculaFinalMujeresSEDUC: Number(s.MatriculaFinalMujeresSEDUC) || 0,
        MatriculaFinalHombresSEDUC: Number(s.MatriculaFinalHombresSEDUC) || 0,
        MatriculaFinalTotalSEDUC: Number(s.MatriculaFinalTotalSEDUC) || 0,

        RepitenciaMujeresSEDUC: Number(s.RepitenciaMujeresSEDUC) || 0,
        RepitenciaHombresSEDUC: Number(s.RepitenciaHombresSEDUC) || 0,
        RepitenciaTotalSEDUC: Number(s.RepitenciaTotalSEDUC) || 0,

        ReprobadasMujeresSEDUC: Number(s.ReprobadasMujeresSEDUC) || 0,
        ReprobadosHombresSEDUC: Number(s.ReprobadosHombresSEDUC) || 0,
        ReprobadosTotalSEDUC: Number(s.ReprobadosTotalSEDUC) || 0,

        AprobadosMujerSEDUC: Number(s.AprobadosMujerSEDUC) || 0,
        AprobadosHombresSEDUC: Number(s.AprobadosHombresSEDUC) || 0,
        AprobadosTotalSEDUC: Number(s.AprobadosTotalSEDUC) || 0,

        // =====================
        // PUESTOS
        // =====================
        DocentesMujeres: Number(puesto.DocentesMujer) || 0,
        DocentesHombres: Number(puesto.DocentesHombre) || 0,
        TotalDocentes: Number(puesto.TotalDocentes) || 0,

        // =====================
        // CENTROS
        // =====================
        TotalPrebasica: Number(centro.TotalPrebasica) || 0,
        TotalBasica: Number(centro.totalBasica) || 0,
        TotalMedia: Number(centro.TotalMedia) || 0,

        TotalZonaUrbana: Number(centro.TotalZonaUrbana) || 0,
        TotalZonaRural: Number(centro.TotalZonaRural) || 0,

        TotalAdminGubernamental: Number(centro.TotalAdiministracionGubernamental) || 0,
        TotalAdminNoGubernamental: Number(centro.TotalAdiministracionNoGubernamental) || 0,

        // =====================
        // DISCAPACIDAD (ya agregada)
        // =====================
        NiñasConDiscapacidad: disc.Niñas || 0,
        NiñosConDiscapacidad: disc.Niños || 0,
        TotalConDiscapacidad: disc.Total || 0,
      };
    });

    return res.status(200).json({
      ok: true,
      data: resultado
    });

  } catch (error) {
    console.error("Error en getVistaResumenGeneral:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al obtener vista resumen",
      error: error.message
    });
  }
}; */





//====================================================================================================
//============================================= INFOP ================================================
//====================================================================================================
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


export const getVistaResumenINFOPUnidadesCursosC = async (req, res) => {
  try {
    const data = await getVistaResumenInfopUnidadesCursosM;

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



//====================================================================================================
//============================================= CONEANFO =============================================
//====================================================================================================
export const getVistaResumenCONEANFOC = async (req, res) => {
  try {
    const data = await getVistaResumenCONEANFOM;

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



//====================================================================================================
//============================================= DES =============================================
//====================================================================================================
export const getVistaResumenDESmatriculaC = async (req, res) => {
  try {
    const data = await getVistaResumenDESmatriculaM ;

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

export const getVistaResumenDESmatriculaModCINEIngresoC = async (req, res) => {
  try {
    const data = await getVistaResumenDESmatriculaModCINEIngresoM ;

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

export const getVistaResumenDESmatriculaCamposC = async (req, res) => {
  try {
    const data = await getVistaResumenDESmatriculaCamposM ;

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



export const getVistaResumenDESgraduadosC = async (req, res) => {
  try {
    const data = await getVistaResumenDESgraduadosM ;

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