import { pool } from "../db.js";


/*
  ######################################################################
  ############################### TABLAS ###############################
  ######################################################################
*/

/*_________________________________________________ SEDUC ________________________________________________-*/

export const getSeducM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
                "Periodo", "Departamento", "Municipio", "Aldea", "Administracion", "PeriodoEscolar", "Zona", "CodigoCentro", "CentroEducativo", 
                "MatriculaIncialMujeres", "MatriculaInicialHombres", "MatriculaInicialTotal", 
                "DesercionMujeres", "DesercionHombres", "DesercionTotal",
                "CancelacionMujeres","CancelacionHombres", "CancelacionTotal", 
                "MatriculaFinalMujeres", "MatriculaFinalHombres", "MatriculaFinalTotal", 
                "RepitenciaMujeres", "RepitenciaHombres", "RepitenciaTotal", 
                "AprobadosMujer",  "AprobadosHombres", "AprobadosTotal", 
                "ReprobadasMujeres", "ReprobadosHombres",  "ReprobadosTotal"
             FROM seduc;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};



export const getSeduc_2014_2025M = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
                "Año", "Departamento", 
                "PrebasicaBruta", "PrebasicaNeta", "BasicaBruta", "BasicaNeta", "MediaBruta", "MediaNeta", 
                "GradoObligatorioPrebasica", "GOP5años", 
                "ICicloBruta", "ICicloNeta", "IICicloBruta", "IICicloNeta", "IIICicloGruta", "IIICicloNeta", 
                "ICicloEdadOportuna", "IICicloEdadOportuna", "IIICicloEdadOportuna", "MediaEdadOportuna", 
                "IGrado", "2doGrado", "3erGrado", "4toGrado", "5toGrado", "6toGrado", "7voGrado", "8ToGrado", "9noGrado", "10moGrado", "11moGrado", "12voGrado", 
                "IGradoEdadOportuna", "2doGradoEdadOportuna", "3erGradoEdadOportuna", "4toGradoEdadOportuna", "5toGradoEdadOportuna", "6toGradoEdadOportuna", 
                "7voGradoEdadOportuna", "8ToGradoEdadOportuna", "9noGradoEdadOportuna", "10moGradoEdadOportuna", "11moGradoEdadOportuna", "12GradoEdadOportuna", 
                "EdadPrebasica", "EdadBásica", "EdadMedia", "EdadICiclo", "EdadIICiclo", "EdadIIICiclo",
                "Edad5años", "Edad6años", "Edad7años", "Edad8años", "Edad9años", "Edad10años", "Edad11años", "Edad12años", "Edad13años", "Edad14años", "Edad15años", "Edad16años", "Edad17años", 
                "MatriculaBruta", "MatriculaNeta", "EdadMatriculatotal", 
                "TasadeMatriculaBruta", "TasadeMatriculaNeta", "TasadecoberturaBrutaPrebasica", "TasadecoberturaNetaPrebasica ", "TasaCoberturaBrutaBasica", " TasadecoberturaNetaBasica", "TasadecoberturaBrutaMedia", "TasadecoberturaNetaMedia", 
                "TBA3PB", "TNA3PB", "TNA1Grado", "TBMICiclo", "TBMIICiclo", "TBMIIICiclo", "TNMICiclo", "TNMIICiclo", "TNMIIICiclo", 
                "TBM1Grado", "TBM2Grdo ", "TBM3Grado", "TBM4Grado", "TBM5Grado", "TBM6Grado", "TBM7", "TBM8Grado", "TBM9Grado", "TBM10Grado", "TBM11Grado", "TBM12Grado", "TNM1Grado", "TNM2Grado", 
                "TNM3Grado", "TNM4Grado", "TNM5Grado", "TNM6Grado", "TNM7Grado", "TNM8Grado", "TNM9Grado", "TNM10Grado", "TNM11Grado", "TNM12Grado"
             FROM seduc_2014_2025;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getSeduc_centros_educativosM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
               periodo, departamento, 
               prebasica, basica, media, total_por_nivel, 
               urbana, rural, total_zona, 
               gubernamental, no_gubernamental, total_administracion
            FROM seduc_centros_educativos;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getSeduc_matriculagradoedadM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
                "Periodo", "Grado", "<3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", ">18"
             FROM seduc_matriculagradoedad;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getSeduc_nivelesacademicosdepartamentoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
                "Periodo", "Departamento", 
                "MatriculaMujerPrebasica", "MatriculaHombrePrebasica", "MatrciulaTotalPrebasica" as MatriculaTotalPrebasica, 
                "MatriculaMujerBasica", "MatriculaHombreBasica", "MatriculaTotalBasica", 
                "MatriculaMujerMedia", "MatriculaHombreMedia", "MatriculaTotalMedia", 
                "MatriculaTotalGeneral", 
                "DesercionMujerPrebasica", "DesercionHombrePrebasica", "DesercionTotalPrebasica", 
                "DesercionMujerBasica", "DesercionHombreBasica", "DesercionTotalBasica", 
                "DesercionMujerMedia", "DesercionHombreMedia", "DesercionTotalMedia", 
                "DesercionTotalGeneral", 
                "CancelacionMujerPrebasica", "CancelacionHombrePrebasica", "CancelacionTotalPrebasica", 
                "CancelacionMujerBasica", "CancelacionHombreBasica", "CancelacionTotalBasica", 
                "CancelacionMujerMedia", "CancelacionHombreMedia", "CancelacionTotalMedia", 
                "CancelacionTotalGeneral", 
                "MatriculaFinalMujerPrebasica", "MatriculaFinalHombrePrebasica", "MatriculaFinalTotalPrebasica", 
                "MatriculaFinalMujerBasica", "MatriculaFinalHombreBasica", "MatriculaFinalTotalBasica", 
                "MatriculaFinalMujerMedia", "MatriculaFinalHombreMedia", "MatriculaFinalTotalMedia", 
                "MatriculaFinalTotalGeneral", 
                "ReprobadosMujerPrebasica", "ReprobadosHombrePrebasica", "ReprobadosTotalPrebasica", 
                "ReprobadosMujerBasica", "ReprobadosHombreBasica", "ReprobadosTotalBasica", 
                "ReprobadosMujerMedia", "ReprobadosHombreMedia", "ReprobadosTotalMedia", 
                "ReprobadosTotalGeneral", 
                "AprobadosMujerPrebasica", "AprobadosHombrePrebasica", "AprobadosTotalPrebasica", 
                "AprobadosMujerBasica", "AprobadosHombreBasica", "AprobadosTotalBasica", 
                "AprobadosMujerMedia", "AprobadosHombreMedia", "AprobadosTotalMedia", 
                "AprobadosTotalGeneral", 
                "RepitenciasMujerPrebasica", "RepitenciasHombrePrebasica", "RepitenciasTotalPrebasica", 
                "RepitenciasMujerBasica", "RepitenciasHombreBasica", "RepitenciasTotalBasica",
                "RepitenciasMujerMedia", "RepitenciasHombreMedia", "RepitenciasTotalMedia", 
                "RepitenciasTotalGeneral"
             FROM seduc_nivelesacademicosdepartamento;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getSeduc_niños_con_discapacidadM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
                periodo, departamento, municipio, aldea, zona, 
                codigosace, nombrecentro, administracion, grado, cicloeducativo, niveleducativo, 
                tipodiscapacidad, 
                niñascondiscapacidad, niñoscondiscapacidad, totaldiscapacidad
             FROM seduc_niños_con_discapacidad;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getSseduc_repitenciagradoedad = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
                "Periodo", "Grado", 
                "<3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", ">18"
             FROM seduc_repitenciagradoedad;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};



export const getSeduc_servicios_basicosM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
                "Periodo", "Fecha", "Departamento", "Plantel", 
                "CodigoSACE", "Nombre", "Electricidad", "AbastecimientoAgua", "EvacuacionAguas", "Zona"
             FROM seduc_servicios_basicos;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};



export const getServicios_docentesM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
                "AÑOESCOLAR", "DEPARTAMENTO", "MUNICIPIO", 
                "CODIGOCENTRO", "NOMBRECENTRO", "NIVELEDUCATIVO", "ADMINSTRACION", "TIPODECENTRO", 
                "DOCENTESMUJER", "DOCENTESHOMBRE", "TOTALDOCENTES"
             FROM servicios_docentes;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};




export const getAllSeducM = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Llamada al procedimiento
    await client.query(`
      CALL sp_get_all_seduc(
        'c1','c2','c3','c4','c5','c6','c7','c8','c9'
      )
    `);

    // Leer y cerrar cursores
    const seduc = await client.query("FETCH ALL FROM c1"); await client.query("CLOSE c1");
    const seduc2014 = await client.query("FETCH ALL FROM c2"); await client.query("CLOSE c2");
    const centros = await client.query("FETCH ALL FROM c3"); await client.query("CLOSE c3");
    const matricula = await client.query("FETCH ALL FROM c4"); await client.query("CLOSE c4");
    const niveles = await client.query("FETCH ALL FROM c5"); await client.query("CLOSE c5");
    const discapacidad = await client.query("FETCH ALL FROM c6"); await client.query("CLOSE c6");
    const repitencia = await client.query("FETCH ALL FROM c7"); await client.query("CLOSE c7");
    const servicios = await client.query("FETCH ALL FROM c8"); await client.query("CLOSE c8");
    const docentes = await client.query("FETCH ALL FROM c9"); await client.query("CLOSE c9");

    await client.query("COMMIT");

    // Armar respuesta
    return {
      seduc: {
        resumen: seduc.rows,
        indicadores: seduc2014.rows,
      },
      centros: centros.rows,
      matricula: {
        gradoEdad: matricula.rows,
        nivelesDepartamento: niveles.rows,
      },
      inclusion: {
        discapacidad: discapacidad.rows,
        repitencia: repitencia.rows,
      },
      infraestructura: {
        serviciosBasicos: servicios.rows,
        docentes: docentes.rows,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en getAllSeducM:", error);
    throw error;
  } finally {
    client.release();
  }
};




/*_________________________________________________ INFOP ________________________________________________-*/

// Consulta para infop por departamentos y municipios
export const getInfop_capacitados_por_departamentos_y_municipiosM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              anio, departamento, municipio, 
              horas_impartidas, cursos_finalizados, 
              matriculados_hombre, matriculados_mujer, matriculados_total, 
              aprobados_hombre, aprobados_mujer, aprobados_total, 
              desertores_hombre, desertores_mujer, desertores_total, 
              reprobados_hombre, reprobados_mujer, reprobados_total
             FROM infop_capacitados_por_departamentos_y_municipios;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Consulta para infop por modos de formación
export const getInfop_capacitados_por_modos_de_formacionM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              anio, regionales, 
              modos_de_formacion, horas_accion_formativa, accion_formativa_inicio, accion_formativa_final, 
              matriculados_hombre, matriculados_mujer, matriculados_total, 
              aprobados_hombre, aprobados_mujer, aprobados_total, 
              desertores_hombre, desertores_mujer, desertores_total, 
              reprobados_hombre, reprobados_mujer, reprobados_total
             FROM infop_capacitados_por_modos_de_formacion;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


// Consulta para infop por programas
export const getInfop_capacitados_por_programasM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              anio, "Programa", 
              horas_accion_formativa, accion_formativa_inicio, accion_formativa_final, 
              matriculados_hombre, matriculados_mujer, matriculados_total, 
              aprobados_hombre, aprobados_mujer, aprobados_total, 
              desertores_hombre, desertores_mujer, desertores_total
             FROM infop_capacitados_por_programas;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


// Consulta para infop por regional
export const getInfop_capacitados_por_regionalM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              anio, nombre, 
              horas_accion_formativa, accion_formativa_inicio, accion_formativa_final, 
              matriculados_hombre, matriculados_mujer, matriculados_total, 
              aprobados_hombre, aprobados_mujer, aprobados_total, 
              desertores_hombre, desertores_mujer, desertores_total, 
              reprobados_hombre, reprobados_mujer, reprobados_total
             FROM infop_capacitados_por_regional;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


// Consulta para infop por sector economico
export const getInfop_capacitados_por_sector_economicoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              anio, regionales, sector, 
              horas_accion_formativa, accion_formativa_inicio, accion_formativa_final, 
              matriculados_hombre, matriculados_mujer, matriculados_total, 
              aprobados_hombre, aprobados_mujer, aprobados_total, 
              desertores_hombre, desertores_mujer, desertores_total, 
              reprobados_hombre, reprobados_mujer, reprobados_total
             FROM infop_capacitados_por_sector_economico;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


// Consulta para regiones de infop
export const getInfop_regionesM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "REGION", "DEPARTAMENTO"
             FROM infop_regiones;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};



/*_________________________________________________ DES _________________________________________________*/
// Consulta para DES matrícula por grado académico
export const getDES_matricula_por_grado_academicoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              año, gradoacademico, publico, privado, total
             FROM des_matricula_por_grado_academico;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Consulta para DES matrícula por institución
export const getDES_matricula_por_institucionM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              año, ies, administracion, femenino, masculino, total
             FROM des_matricula_por_institucion;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


// Consulta para DES matrícula por sexo
export const getDES_matricula_por_sexoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              año, gradoacademico, femenino, masculino, total
             FROM des_matricula_por_sexo;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};





/*_________________________________________________ SIIE _________________________________________________*/


// Consulta para SIIE matrícula por departamento
export const getSIIE_matricula_por_departamentoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              año, departamento, matriculaseduc, matriculainfop, matriculaconeanfo, matriculatotal, matriculadesunah
             FROM siie_matricula_por_departamento;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


// Consulta para SIIE matrícula por institución
export const getSIIE_matricula_por_institucionM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              año, seduc, infop, coneanfo, des, matriculatotal
             FROM siie_matricula_por_institucion;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


// Consulta para SIIE matrícula por sexo
export const getSIIE_matricula_por_sexoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              año, 
              mujerseduc, hombreseduc, 
              mujerinfop, hombreinfop, 
              mujerconeanfo, hombreconeanfo, 
              totalmujeres, totalhombres
             FROM siie_matricula_por_sexo;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};





/*
  ######################################################################
  ############################### VISTAS ###############################
  ######################################################################
*/

/*_________________________________________________ INFOP _________________________________________________*/

// Consulta para vista de tasas de matriculas de infop
export const getinfop_tasasmatriculasM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Año", departamento, municipio, 
              matriculados_hombre, aprobados_hombre, tasa_aprobados_hombres, 
              matriculados_mujer, aprobados_mujer, tasa_aprobados_mujeres, 
              matriculados_total, aprobados_total, tasa_aprobados_total, 
              reprobados_hombre, tasa_reprobados_hombres, reprobados_mujer, tasa_reprobados_mujeres, reprobados_total, 
              tasa_reprobados_total, desertores_hombre, tasa_desertores_hombres, desertores_mujer, tasa_desertores_mujeres, desertores_total, tasa_desertores_total
             FROM infop_tasasmatriculas;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


// Consulta para vista de tasas de matriculas de infop por modos de formación
export const getinfop_tasasmatriculasmodosformacionM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Año", regionales, modos_de_formacion, 
              matriculados_hombre, aprobados_hombre, tasa_aprobados_hombres,
              matriculados_mujer, aprobados_mujer, tasa_aprobados_mujeres, 
              matriculados_total, aprobados_total, tasa_aprobados_total, 
              reprobados_hombre, tasa_reprobados_hombres, reprobados_mujer, 
              tasa_reprobados_mujeres, reprobados_total, tasa_reprobados_total, 
              desertores_hombre, tasa_desertores_hombres, desertores_mujer, tasa_desertores_mujeres, 
              desertores_total, tasa_desertores_total
             FROM infop_tasasmatriculasmodosformacion;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


// Consulta para vista de tasas de matriculas de infop por programas
export const getinfop_tasasmatriculasprogramasM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Año", "Programa", 
              matriculados_hombre, aprobados_hombre, tasa_aprobados_hombres, aprobados_total, tasa_aprobados_total,
              matriculados_mujer, aprobados_mujer, tasa_aprobados_mujeres, matriculados_total,  
              desertores_hombre, tasa_desertores_hombres, desertores_mujer, tasa_desertores_mujeres, desertores_total, tasa_desertores_total
             FROM infop_tasasmatriculasprogramas;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Consulta para vista de tasas de matriculas de infop por regionales
export const getinfop_tasasmatriculasregionalesM = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        "Año", nombre, 
        matriculados_hombre, aprobados_hombre, tasa_aprobados_hombres, matriculados_mujer, aprobados_mujer, tasa_aprobados_mujeres, 
        matriculados_total, aprobados_total, tasa_aprobados_total, reprobados_hombre, tasa_reprobados_hombres, reprobados_mujer, 
        tasa_reprobados_mujeres, reprobados_total, tasa_reprobados_total, desertores_hombre, tasa_desertores_hombres, desertores_mujer, 
        tasa_desertores_mujeres, desertores_total, tasa_desertores_total
      FROM infop_tasasmatriculasregionales;`);
    return rows;
  } catch (error) {
    throw error;
  }
};


// Consulta para vista de tasas de matriculas de infop por sector economico
export const getinfop_tasasmatriculassectoreconomicoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Año", regionales, sector, 
              matriculados_hombre, aprobados_hombre, tasa_aprobados_hombres, matriculados_mujer, aprobados_mujer, tasa_aprobados_mujeres, matriculados_total, 
              aprobados_total, tasa_aprobados_total, reprobados_hombre, tasa_reprobados_hombres, reprobados_mujer, tasa_reprobados_mujeres, reprobados_total, 
              tasa_reprobados_total, desertores_hombre, tasa_desertores_hombres, desertores_mujer, tasa_desertores_mujeres, desertores_total, tasa_desertores_total
             FROM infop_tasasmatriculassectoreconomico;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


/*_________________________________________________ SEDUC _________________________________________________*/


export const getseduc_accesoprimergradoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Periodo", "Edad", matricula, repitencia, poblacion, "TA1B"
             FROM seduc_accesoprimergrado;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getseduc_cancelacionpivotgradoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Periodo", "PB1", "PB2", "PB3", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"
             FROM seduc_cancelacionpivotgrado;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getseduc_coberturabrutaniveleseducativosM = async () => {
  try {
    const { rows } = await pool.query(`
            SELECT 
              "Año", nivel, matricula, poblacion, tcb
            FROM seduc_coberturabrutaniveleseducativos;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getseduc_coberturanetaniveleseducativosM = async () => {
  try {
    const { rows } = await pool.query(`
            SELECT "Año", nivel, matricula, poblacion, tcn
            FROM seduc_coberturanetaniveleseducativos;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getseduc_desercionpivotgradoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Periodo", "PB1", "PB2", "PB3", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"
             FROM seduc_desercionpivotgrado;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getseduc_escolarizcionporedadesM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Periodo", "Edad", matricula, poblacion, "TEE"
             FROM seduc_escolarizcionporedades;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};



export const getseduc_matriculabrutagradoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Periodo", 
              "MatriculaPrebasica3", 
              "MatriculaGrado1", "MatriculaGrado2", "MatriculaGrado3", "MatriculaGrado4", 
              "MatriculaGrado5", "MatriculaGrado6", "MatriculaGrado7", "MatriculaGrado8", "MatriculaGrado9", 
              "MatriculaGrado10", "MatriculaGrado11", "MatriculaGrado12"
             FROM seduc_matriculabrutagrado;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};



export const getseduc_matriculanetagradoM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Periodo", "MatriculaPrebasica3", "MatriculaGrado1", "MatriculaGrado2", "MatriculaGrado3", "MatriculaGrado4", 
              "MatriculaGrado5", "MatriculaGrado6", "MatriculaGrado7", "MatriculaGrado8", "MatriculaGrado9", "MatriculaGrado10", 
              "MatriculaGrado11", "MatriculaGrado12"
             FROM seduc_matriculanetagrado;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getseduc_tasabrutaacceso3prebasicaM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Año", "Matrícula", "Población", "TBA"
             FROM seduc_tasabrutaacceso3prebasica;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getseduc_tasabrutaaccesoprimergradobasicaM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Año", "Matrícula", "Población", "TBA1GB"
             FROM seduc_tasabrutaaccesoprimergradobasica;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getseduc_tasabrutaciclosM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Periodo", "MatriculaICiclo", "EdadOportunaICiclo", "TBCI", "MatriculaIICiclo", 
              "EdadOportunaIICiclo", "TBCII", "MatriculaIIICiclo", "EdadOportunaIIICiclo", "TBCIII"
             FROM seduc_tasabrutaciclos;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getseduc_tasabrutamatriculagradosM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Periodo", "MatriculaPrebasica3", "EdadOportunaPrebasica3", "TBMPB3", "MatriculaGrado1", 
              "EdadOportunaGrado1", "TBMG1", "MatriculaGrado2", "EdadOportunaGrado2", "TBMG2", "MatriculaGrado3", 
              "EdadOportunaGrado3", "TBMG3", "MatriculaGrado4", "EdadOportunaGrado4", "TBMG4", "MatriculaGrado5", 
              "EdadOportunaGrado5", "TBMG5", "MatriculaGrado6", "EdadOportunaGrado6", "TBMG6", "MatriculaGrado7", 
              "EdadOportunaGrado7", "TBMG7", "MatriculaGrado8", "EdadOportunaGrado8", "TBMG8", "MatriculaGrado9", 
              "EdadOportunaGrado9", "TBMG9", "MatriculaGrado10", "EdadOportunaGrado10", "TBMG10", "MatriculaGrado11", 
              "EdadOportunaGrado11", "TBMG11", "MatriculaGrado12", "EdadOportunaGrado12", "TBMG12"
             FROM seduc_tasabrutamatriculagrados;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getseduc_tasanetaacceso3prebasicaM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Año", "Matrícula", "Población", "TBA"
             FROM seduc_tasanetaacceso3prebasica;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getseduc_tasanetaaccesoprimergradobasicaM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Año", "Matrícula", "Población", "TBA1GB"
             FROM seduc_tasanetaaccesoprimergradobasica;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};




export const getseduc_tasanetaciclosM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Periodo", "MatriculaICiclo", "EdadOportunaICiclo", "TNCI", "MatriculaIICiclo", 
              "EdadOportunaIICiclo", "TNCII", "MatriculaIIICiclo", "EdadOportunaIIICiclo", "TNCIII"
             FROM seduc_tasanetaciclos;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};




export const getseduc_tasanetamatriculagradosM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Periodo", "MatriculaPrebasica3", "EdadOportunaPrebasica3", "TBMPB3", "MatriculaGrado1", 
              "EdadOportunaGrado1", "TBMG1", "MatriculaGrado2", "EdadOportunaGrado2", "TBMG2", "MatriculaGrado3", 
              "EdadOportunaGrado3", "TBMG3", "MatriculaGrado4", "EdadOportunaGrado4", "TBMG4", "MatriculaGrado5", 
              "EdadOportunaGrado5", "TBMG5", "MatriculaGrado6", "EdadOportunaGrado6", "TBMG6", "MatriculaGrado7", 
              "EdadOportunaGrado7", "TBMG7", "MatriculaGrado8", "EdadOportunaGrado8", "TBMG8", "MatriculaGrado9", 
              "EdadOportunaGrado9", "TBMG9", "MatriculaGrado10", "EdadOportunaGrado10", "TBMG10", "MatriculaGrado11", 
              "EdadOportunaGrado11", "TBMG11", "MatriculaGrado12", "EdadOportunaGrado12", "TBMG12"
             FROM seduc_tasanetamatriculagrados;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};



export const getseduc_variacioninteranualprebasicagradoobligatorioM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
              "Año", "MatriculaActual", "MatriCulaAnterior", "VIMAOPB"
             FROM seduc_variacioninteranualprebasicagradoobligatorio;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};
