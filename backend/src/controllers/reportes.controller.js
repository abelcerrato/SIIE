
import { getAllSeducM, getConeanfoM, getDES_matricula_por_grado_academicoM, getDES_matricula_por_institucionM, getDES_matricula_por_sexoM, getInfop_capacitados_por_departamentos_y_municipiosM, getInfop_capacitados_por_modos_de_formacionM, getInfop_capacitados_por_programasM, getInfop_capacitados_por_regionalM, getInfop_capacitados_por_sector_economicoM, getInfop_regionesM, getSIIE_matricula_por_departamentoM, getSIIE_matricula_por_institucionM, getSIIE_matricula_por_sexoM, getSeducM, getSeduc_2014_2025M, getSeduc_centros_educativosM, getSeduc_matriculagradoedadM, getSeduc_nivelesacademicosdepartamentoM, getSeduc_niños_con_discapacidadM, getSeduc_servicios_basicosM, getServicios_docentesM, getSseduc_repitenciagradoedad, getconeanfo_reportesM, getinfop_tasasmatriculasM, getinfop_tasasmatriculasmodosformacionM, getinfop_tasasmatriculasprogramasM, getinfop_tasasmatriculasregionalesM, getinfop_tasasmatriculassectoreconomicoM, getseduc_accesoprimergradoM, getseduc_cancelacionpivotgradoM, getseduc_cobertura_neta_bruta_niveleseducativosM, getseduc_coberturabrutaniveleseducativosM, getseduc_coberturanetaniveleseducativosM, getseduc_desercionpivotgradoM, getseduc_escolarizcionporedadesM, getseduc_matriculabrutagradoM, getseduc_matriculanetagradoM, getseduc_tasa_neta_bruta_acceso3prebasicaM, getseduc_tasa_neta_bruta_accesoprimergradobasicaM, getseduc_tasa_neta_bruta_ciclosM, getseduc_tasa_neta_bruta_matriculagradosM, getseduc_tasabrutaacceso3prebasicaM, getseduc_tasabrutaaccesoprimergradobasicaM, getseduc_tasabrutaciclosM, getseduc_tasabrutamatriculagradosM, getseduc_tasanetaacceso3prebasicaM, getseduc_tasanetaaccesoprimergradobasicaM, getseduc_tasanetaciclosM, getseduc_tasanetamatriculagradosM, getseduc_variacioninteranualprebasicagradoobligatorioM } from "../models/reportes.models.js";

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


/* DES */
// Controlador para mostrar la matricula por grado academico de DES
export const getDES_matricula_por_grado_academicoC = async (req, res) => {
  try {
    const des = await getDES_matricula_por_grado_academicoM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener la matricula por grado academico de DES:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para mostrar la matricula por institucion de DES
export const getDES_matricula_por_institucionC = async (req, res) => {
  try {
    const des = await getDES_matricula_por_institucionM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener la matricula por institucion de DES:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Controlador para mostrar la matricula por sexo de DES
export const getDES_matricula_por_sexoC = async (req, res) => {
  try {
    const des = await getDES_matricula_por_sexoM();
    res.json(des);
  } catch (error) {
    console.error("Error al obtener la matricula por sexo de DES:", error);
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
export const getconeanfo_reportesC = async (req, res) => {
  try {
    const coneanfo = await getconeanfo_reportesM();
    res.json(coneanfo);
  } catch (error) {
    console.error("Error al obtener el reporte de coneanfo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};