
import {getAllSeducM, getInfop_capacitados_por_departamentos_y_municipiosM, getInfop_capacitados_por_modos_de_formacionM, getInfop_capacitados_por_programasM, getInfop_capacitados_por_regionalM, getInfop_capacitados_por_sector_economicoM, getInfop_regionesM, getSeducM, getSeduc_2014_2025M, getSeduc_centros_educativosM, getSeduc_matriculagradoedadM, getSeduc_nivelesacademicosdepartamentoM, getSeduc_niños_con_discapacidadM, getSeduc_servicios_basicosM, getServicios_docentesM, getSseduc_repitenciagradoedad } from "../models/reportes.models.js";


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
