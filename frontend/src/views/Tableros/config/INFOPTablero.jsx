// components/BaseTableroInfop.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Tooltip,
  Stack,
  useMediaQuery,
  useTheme,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";
import {
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import {
  Info,
  Timeline,
  Category,
  Business,
  School,
  AccountTree,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import DataExplorationRoundedIcon from "@mui/icons-material/DataExplorationRounded";
import PercentIcon from "@mui/icons-material/Percent";
import MapaDinamico from "./MapaDinamico.jsx";
import color from "../../../components/color.js";
import MapIcon from "@mui/icons-material/Map";
import {
  StyledCard,
  StyledCardContent,
  AnimatedCounter,
  ScrollReveal,
  FiltrosActivos,
  FiltroSelect,
  EmptyState,
  normalizar,
  ChartSkeleton,
} from "../../../components/shared/index.js";


// ==================== CONFIGURACIÓN DE MÉTRICAS ====================
const METRICAS_INFOP = {
  matriculaInicial: "Matrícula Inicial",
  aprobados: "Aprobados",
  reprobados: "Reprobados",
  desercion: "Deserción",
  accionesFormativas: "Horas de Acciones Formativas",
  horas: "Horas",
};

// ==================== DIMENSIONES DE ANÁLISIS ====================
const DIMENSIONES_ANALISIS = {
  departamento: {
    label: "Departamento",
    icon: <MapIcon />,
    requiereMapa: true,
    campoFiltro: "departamento",
    campoMunicipio: "municipio",
  },
  region: {
    label: "Región",
    icon: <PublicOutlinedIcon />,
    requiereMapa: true,
    campoFiltro: "region",
  },
  modoFormacion: {
    label: "Modo de Formación",
    icon: <Category />,
    requiereMapa: true,
    campoFiltro: "modoFormacion",
  },
  sectorEconomico: {
    label: "Sector Económico",
    icon: <Business />,
    requiereMapa: true,
    campoFiltro: "sectorEconomico",
  },
  programa: {
    label: "Programa",
    icon: <AccountTree />,
    requiereMapa: false,
    campoFiltro: "programa",
  },
  centroFormacion: {
    label: "Centro de Formación",
    icon: <School />,
    requiereMapa: true,
    campoFiltro: "centroFormacion",
    tieneGraficoEdad: true,
  },
  unidadCurso: {
    label: "Unidad y Curso",
    icon: <School />,
    requiereMapa: true,
    campoFiltro: "unidadCurso",
    tieneGraficoEdad: true,
  },
};

// ==================== CONFIGURACIÓN DE MÉTRICAS POR DIMENSIÓN ====================
const METRICAS_POR_DIMENSION = {
  departamento: [
    "matriculaInicial",
    "aprobados",
    "reprobados",
    "desercion",
  ],
  sectorEconomico: [
    "matriculaInicial",
    "aprobados",
    "reprobados",
    "desercion",
  ],
  centroFormacion: ["matriculaInicial", "aprobados", "reprobados", "desercion"],
  unidadCurso: [
    "matriculaInicial",
    "aprobados",
    "reprobados",
    "desercion",
    "horas",
  ],
  modoFormacion: [
    "matriculaInicial",
    "aprobados",
    "reprobados",
    "desercion",
    "accionesFormativas",
  ],
  region: [
    "matriculaInicial",
    "aprobados",
    "reprobados",
    "desercion",
    "accionesFormativas",
  ],
  programa: [
    "matriculaInicial",
    "aprobados",
    "desercion",
    "accionesFormativas",
  ],
};

const METRICAS_POR_DIMENSION_TASA = {
  departamento: [
    "matriculaInicial",
    "aprobados",
    "reprobados",
    "desercion",
  ],
  sectorEconomico: [
    "aprobados",
    "reprobados",
    "desercion",
  ],
  modoFormacion: [
    "aprobados",
    "reprobados",
    "desercion",
  ],
  region: [
    "aprobados",
    "reprobados",
    "desercion",
  ],
  programa: [
    "aprobados",
    "desercion",
  ],
  // centroFormacion y unidadCurso no tienen modo Tasa
  centroFormacion: [],
  unidadCurso: [],
};
// ==================== DIMENSIONES QUE MUESTRAN TABLA ====================
const DIMENSIONES_CON_TABLA = [
  "modoFormacion",
  "programa",
  "centroFormacion",
  "unidadCurso",
];

// ==================== DIMENSIONES QUE SOPORTAN MODO TASA ====================
const DIMENSIONES_CON_TASA = ["departamento", "region", "modoFormacion", "sectorEconomico", "programa"];

// ==================== DIMENSIONES QUE MUESTRAN TABLA A LA PAR DEL MAPA ====================
const DIMENSIONES_TABLA_LATERAL = ["modoFormacion", "centroFormacion", "unidadCurso"];

// ==================== DIMENSIONES QUE MUESTRAN GRÁFICO DE EDAD ====================
const DIMENSIONES_CON_GRAFICO_EDAD = ["centroFormacion", "unidadCurso"];

// ==================== DIMENSIONES QUE MUESTRAN GRÁFICOS DE GÉNERO ====================
const DIMENSIONES_CON_GRAFICO_GENERO = ["centroFormacion", "unidadCurso", "modoFormacion", "programa", "departamento", "region", "sectorEconomico"];

// ==================== CONFIGURACIÓN DE GRÁFICOS POR MÉTRICA ====================
const CONFIG_GRAFICOS_POR_METRICA = {
  matriculaInicial: {
    mostrarMapaPorDimension: true,
    mostrarGenero: true,
    mostrarPeriodo: true,
  },
  desercion: {
    mostrarMapaPorDimension: true,
    mostrarGenero: true,
    mostrarPeriodo: true,
  },
  reprobados: {
    mostrarMapaPorDimension: true,
    mostrarGenero: true,
    mostrarPeriodo: true,
  },
  aprobados: {
    mostrarMapaPorDimension: true,
    mostrarGenero: true,
    mostrarPeriodo: true,
  },
  accionesFormativas: {
    mostrarMapaPorDimension: true,
    mostrarGenero: false,
    mostrarPeriodo: true,
  },
  horas: {
    mostrarMapaPorDimension: true,
    mostrarGenero: false,
    mostrarPeriodo: true,
  },
};
const DIMENSIONES_CON_GRAFICO_ACCIONES = ["region", "modoFormacion", "programa",];
// ==================== DIMENSIONES QUE MUESTRAN GRÁFICO DE LÍNEAS MÚLTIPLES ====================
const DIMENSIONES_CON_GRAFICO_LINEAS = ["region", "modoFormacion", "sectorEconomico", "programa"];
// ==================== URLS DE LAS APIS ====================
const API_URLS = {
  departamento: `${process.env.REACT_APP_API_URL}/infopcapacitadospordepartamentos`,
  modoFormacion: `${process.env.REACT_APP_API_URL}/infopcapacitadospormodos`,
  programa: `${process.env.REACT_APP_API_URL}/infopcapacitadosporprogramas`,
  sectorEconomico: `${process.env.REACT_APP_API_URL}/infopcapacitadosporsectoreconomico`,
  unidadCurso: `${process.env.REACT_APP_API_URL}/vistaresumeninfopunidadescursos`,
  unidadCursoHoras: `${process.env.REACT_APP_API_URL}/vistaresumeninfopUChorasfinalizados`,
  centroFormacion: `${process.env.REACT_APP_API_URL}/infopcentros`,
  region: `${process.env.REACT_APP_API_URL}/infopcapacitadosporegional`,

  // APIs de tasas
  tasaDepartamento: `${process.env.REACT_APP_API_URL}/infoptasasmatriculas`,
  tasaRegion: `${process.env.REACT_APP_API_URL}/infoptasasmatriculasregionales`,
  tasaModoFormacion: `${process.env.REACT_APP_API_URL}/infoptasasmatriculasmodosformacion`,
  tasaPrograma: `${process.env.REACT_APP_API_URL}/infoptasasmatriculasprogramas`,
  tasaSectorEconomico: `${process.env.REACT_APP_API_URL}/infoptasasmatriculassectoreconomico`,
};

// ==================== RANGOS DE EDAD DISPONIBLES ====================
const RANGOS_EDAD_DISPONIBLES = [
  "Todos",
  "MENOS DE 15",
  "DE 15 A 19 AÑOS",
  "DE 20 A 24 AÑOS",
  "DE 25 A 29 AÑOS",
  "DE 30 A 34 AÑOS",
  "DE 35 A 39 AÑOS",
  "DE 40 A 44 AÑOS",
  "DE 45 A 49 AÑOS",
  "DE 50 A 54 AÑOS",
  "DE 55 A 59 AÑOS",
  "DE 60 A 64 AÑOS",
  "DE 65 Y MÁS AÑOS",
  "60 Y MAS",
];


// ==================== FUNCIÓN PARA OBTENER VALOR DE MÉTRICA ====================
const getMetricValue = (row, metric, forMap = false) => {
  // Para el mapa en unidadCurso con métrica "horas", usar "finalizados"
  if (forMap && row.finalizados !== undefined && metric === "horas") {
    return row.finalizados || 0;
  }

  let value = 0;
  switch (metric) {
    case "matriculaInicial":
      value = row.matriculados_total || row.matriculaInicial || 0;
      break;
    case "aprobados":
      value = row.aprobados_total || row.aprobados || 0;
      break;
    case "reprobados":
      value = row.reprobados_total || row.reprobados || 0;
      break;
    case "desercion":
      value = row.desertores_total || row.desercion || 0;
      break;
    case "accionesFormativas":
      value = row.horas_accion_formativa || 0;
      break;
    case "horas":
      value = row.horas || row.horas_impartidas || row.horas_accion_formativa || 0;
      break;
    default:
      value = 0;
  }

  // Los valores de tasa ya vienen como decimales (0.9750)
  return value;
};
// ==================== FUNCIÓN PARA NORMALIZAR DATOS ====================
const normalizarDatos = (datos, dimension, metric, isTasa = false) => {
  if (!datos || !Array.isArray(datos)) return [];

  return datos.map((item) => {
    const objetoNormalizado = {
      anio: item.anio || item.año || item.Año || item.Periodo || item.periodo,
    };

    if (isTasa && DIMENSIONES_CON_TASA.includes(dimension)) {
      // Para datos de tasa, usar los campos "tasa_" según la métrica seleccionada
      switch (dimension) {
        case "departamento":
          objetoNormalizado.departamento = item.departamento || item.Departamento;
          objetoNormalizado.municipio = item.municipio || item.Municipio || "Todos";

          objetoNormalizado.tasa_aprobados = parseFloat(item.tasa_aprobados_total) || 0;
          objetoNormalizado.tasa_reprobados = parseFloat(item.tasa_reprobados_total) || 0;
          objetoNormalizado.tasa_desercion = parseFloat(item.tasa_desertores_total) || 0;
          objetoNormalizado.tasa_matriculaInicial = parseFloat(item.tasa_aprobados_total) || 0;

          objetoNormalizado.tasa_aprobados_hombre = parseFloat(item.tasa_aprobados_hombres) || 0;
          objetoNormalizado.tasa_aprobados_mujer = parseFloat(item.tasa_aprobados_mujeres) || 0;
          objetoNormalizado.tasa_desercion_hombre = parseFloat(item.tasa_desertores_hombres) || 0;
          objetoNormalizado.tasa_desercion_mujer = parseFloat(item.tasa_desertores_mujeres) || 0;
          objetoNormalizado.tasa_reprobados_hombre = parseFloat(item.tasa_reprobados_hombres) || 0;
          objetoNormalizado.tasa_reprobados_mujer = parseFloat(item.tasa_reprobados_mujeres) || 0;

          objetoNormalizado.matriculados_total = objetoNormalizado.tasa_matriculaInicial;
          objetoNormalizado.aprobados_total = objetoNormalizado.tasa_aprobados;
          objetoNormalizado.reprobados_total = objetoNormalizado.tasa_reprobados;
          objetoNormalizado.desertores_total = objetoNormalizado.tasa_desercion;
          objetoNormalizado.aprobados_hombre = objetoNormalizado.tasa_aprobados_hombre;
          objetoNormalizado.aprobados_mujer = objetoNormalizado.tasa_aprobados_mujer;
          objetoNormalizado.desertores_hombre = objetoNormalizado.tasa_desercion_hombre;
          objetoNormalizado.desertores_mujer = objetoNormalizado.tasa_desercion_mujer;
          objetoNormalizado.reprobados_hombre = objetoNormalizado.tasa_reprobados_hombre;
          objetoNormalizado.reprobados_mujer = objetoNormalizado.tasa_reprobados_mujer;
          break;

        case "region":
          objetoNormalizado.region = item.nombre || item.region;
          objetoNormalizado.tasa_aprobados = parseFloat(item.tasa_aprobados_total) || 0;
          objetoNormalizado.tasa_reprobados = parseFloat(item.tasa_reprobados_total) || 0;
          objetoNormalizado.tasa_desercion = parseFloat(item.tasa_desertores_total) || 0;
          objetoNormalizado.tasa_matriculaInicial = parseFloat(item.tasa_aprobados_total) || 0;

          objetoNormalizado.tasa_aprobados_hombre = parseFloat(item.tasa_aprobados_hombres) || 0;
          objetoNormalizado.tasa_aprobados_mujer = parseFloat(item.tasa_aprobados_mujeres) || 0;
          objetoNormalizado.tasa_desercion_hombre = parseFloat(item.tasa_desertores_hombres) || 0;
          objetoNormalizado.tasa_desercion_mujer = parseFloat(item.tasa_desertores_mujeres) || 0;
          objetoNormalizado.tasa_reprobados_hombre = parseFloat(item.tasa_reprobados_hombres) || 0;
          objetoNormalizado.tasa_reprobados_mujer = parseFloat(item.tasa_reprobados_mujeres) || 0;

          objetoNormalizado.matriculados_total = objetoNormalizado.tasa_matriculaInicial;
          objetoNormalizado.aprobados_total = objetoNormalizado.tasa_aprobados;
          objetoNormalizado.reprobados_total = objetoNormalizado.tasa_reprobados;
          objetoNormalizado.desertores_total = objetoNormalizado.tasa_desercion;
          objetoNormalizado.aprobados_hombre = objetoNormalizado.tasa_aprobados_hombre;
          objetoNormalizado.aprobados_mujer = objetoNormalizado.tasa_aprobados_mujer;
          objetoNormalizado.desertores_hombre = objetoNormalizado.tasa_desercion_hombre;
          objetoNormalizado.desertores_mujer = objetoNormalizado.tasa_desercion_mujer;
          objetoNormalizado.reprobados_hombre = objetoNormalizado.tasa_reprobados_hombre;
          objetoNormalizado.reprobados_mujer = objetoNormalizado.tasa_reprobados_mujer;
          break;

        case "modoFormacion":
          objetoNormalizado.modoFormacion = item.modos_de_formacion || item.modoFormacion;
          objetoNormalizado.region = item.regionales || item.region;

          objetoNormalizado.tasa_aprobados = parseFloat(item.tasa_aprobados_total) || 0;
          objetoNormalizado.tasa_reprobados = parseFloat(item.tasa_reprobados_total) || 0;
          objetoNormalizado.tasa_desercion = parseFloat(item.tasa_desertores_total) || 0;
          objetoNormalizado.tasa_matriculaInicial = parseFloat(item.tasa_aprobados_total) || 0;

          objetoNormalizado.tasa_aprobados_hombre = parseFloat(item.tasa_aprobados_hombres) || 0;
          objetoNormalizado.tasa_aprobados_mujer = parseFloat(item.tasa_aprobados_mujeres) || 0;
          objetoNormalizado.tasa_desercion_hombre = parseFloat(item.tasa_desertores_hombres) || 0;
          objetoNormalizado.tasa_desercion_mujer = parseFloat(item.tasa_desertores_mujeres) || 0;
          objetoNormalizado.tasa_reprobados_hombre = parseFloat(item.tasa_reprobados_hombres) || 0;
          objetoNormalizado.tasa_reprobados_mujer = parseFloat(item.tasa_reprobados_mujeres) || 0;

          objetoNormalizado.matriculados_total = objetoNormalizado.tasa_matriculaInicial;
          objetoNormalizado.aprobados_total = objetoNormalizado.tasa_aprobados;
          objetoNormalizado.reprobados_total = objetoNormalizado.tasa_reprobados;
          objetoNormalizado.desertores_total = objetoNormalizado.tasa_desercion;
          objetoNormalizado.aprobados_hombre = objetoNormalizado.tasa_aprobados_hombre;
          objetoNormalizado.aprobados_mujer = objetoNormalizado.tasa_aprobados_mujer;
          objetoNormalizado.desertores_hombre = objetoNormalizado.tasa_desercion_hombre;
          objetoNormalizado.desertores_mujer = objetoNormalizado.tasa_desercion_mujer;
          objetoNormalizado.reprobados_hombre = objetoNormalizado.tasa_reprobados_hombre;
          objetoNormalizado.reprobados_mujer = objetoNormalizado.tasa_reprobados_mujer;
          break;

        case "programa":
          objetoNormalizado.programa = item.Programa || item.programa;

          objetoNormalizado.tasa_aprobados = parseFloat(item.tasa_aprobados_total) || 0;
          objetoNormalizado.tasa_desercion = parseFloat(item.tasa_desertores_total) || 0;
          objetoNormalizado.tasa_matriculaInicial = parseFloat(item.tasa_aprobados_total) || 0;

          objetoNormalizado.tasa_aprobados_hombre = parseFloat(item.tasa_aprobados_hombres) || 0;
          objetoNormalizado.tasa_aprobados_mujer = parseFloat(item.tasa_aprobados_mujeres) || 0;
          objetoNormalizado.tasa_desercion_hombre = parseFloat(item.tasa_desertores_hombres) || 0;
          objetoNormalizado.tasa_desercion_mujer = parseFloat(item.tasa_desertores_mujeres) || 0;

          objetoNormalizado.matriculados_total = objetoNormalizado.tasa_matriculaInicial;
          objetoNormalizado.aprobados_total = objetoNormalizado.tasa_aprobados;
          objetoNormalizado.desertores_total = objetoNormalizado.tasa_desercion;
          objetoNormalizado.aprobados_hombre = objetoNormalizado.tasa_aprobados_hombre;
          objetoNormalizado.aprobados_mujer = objetoNormalizado.tasa_aprobados_mujer;
          objetoNormalizado.desertores_hombre = objetoNormalizado.tasa_desercion_hombre;
          objetoNormalizado.desertores_mujer = objetoNormalizado.tasa_desercion_mujer;
          break;

        case "sectorEconomico":
          objetoNormalizado.sectorEconomico = item.sector || item.sectorEconomico;
          objetoNormalizado.region = item.regionales || item.region;

          objetoNormalizado.tasa_aprobados = parseFloat(item.tasa_aprobados_total) || 0;
          objetoNormalizado.tasa_reprobados = parseFloat(item.tasa_reprobados_total) || 0;
          objetoNormalizado.tasa_desercion = parseFloat(item.tasa_desertores_total) || 0;
          objetoNormalizado.tasa_matriculaInicial = parseFloat(item.tasa_aprobados_total) || 0;

          objetoNormalizado.tasa_aprobados_hombre = parseFloat(item.tasa_aprobados_hombres) || 0;
          objetoNormalizado.tasa_aprobados_mujer = parseFloat(item.tasa_aprobados_mujeres) || 0;
          objetoNormalizado.tasa_desercion_hombre = parseFloat(item.tasa_desertores_hombres) || 0;
          objetoNormalizado.tasa_desercion_mujer = parseFloat(item.tasa_desertores_mujeres) || 0;
          objetoNormalizado.tasa_reprobados_hombre = parseFloat(item.tasa_reprobados_hombres) || 0;
          objetoNormalizado.tasa_reprobados_mujer = parseFloat(item.tasa_reprobados_mujeres) || 0;

          objetoNormalizado.matriculados_total = objetoNormalizado.tasa_matriculaInicial;
          objetoNormalizado.aprobados_total = objetoNormalizado.tasa_aprobados;
          objetoNormalizado.reprobados_total = objetoNormalizado.tasa_reprobados;
          objetoNormalizado.desertores_total = objetoNormalizado.tasa_desercion;
          objetoNormalizado.aprobados_hombre = objetoNormalizado.tasa_aprobados_hombre;
          objetoNormalizado.aprobados_mujer = objetoNormalizado.tasa_aprobados_mujer;
          objetoNormalizado.desertores_hombre = objetoNormalizado.tasa_desercion_hombre;
          objetoNormalizado.desertores_mujer = objetoNormalizado.tasa_desercion_mujer;
          objetoNormalizado.reprobados_hombre = objetoNormalizado.tasa_reprobados_hombre;
          objetoNormalizado.reprobados_mujer = objetoNormalizado.tasa_reprobados_mujer;
          break;
      }
      return objetoNormalizado;
    }

    switch (dimension) {
      case "departamento":
        objetoNormalizado.departamento = item.departamento || item.Departamento;
        objetoNormalizado.municipio = item.municipio || item.Municipio || "Todos";
        objetoNormalizado.horas_impartidas = item.horas_impartidas || 0;
        objetoNormalizado.matriculados_total = item.matriculados_total || item.matriculaInicial || 0;
        objetoNormalizado.matriculados_hombre = item.matriculados_hombre || 0;
        objetoNormalizado.matriculados_mujer = item.matriculados_mujer || 0;
        objetoNormalizado.aprobados_total = item.aprobados_total || item.aprobados || 0;
        objetoNormalizado.aprobados_hombre = item.aprobados_hombre || 0;
        objetoNormalizado.aprobados_mujer = item.aprobados_mujer || 0;
        objetoNormalizado.desertores_total = item.desertores_total || item.desercion || 0;
        objetoNormalizado.desertores_hombre = item.desertores_hombre || 0;
        objetoNormalizado.desertores_mujer = item.desertores_mujer || 0;
        objetoNormalizado.reprobados_total = item.reprobados_total || item.reprobados || 0;
        objetoNormalizado.reprobados_hombre = item.reprobados_hombre || 0;
        objetoNormalizado.reprobados_mujer = item.reprobados_mujer || 0;
        break;

      case "region":
        objetoNormalizado.region = item.nombre || item.region;
        objetoNormalizado.horas_accion_formativa = item.horas_accion_formativa || 0;
        objetoNormalizado.accion_formativa_inicio = item.accion_formativa_inicio || 0;
        objetoNormalizado.accion_formativa_final = item.accion_formativa_final || 0;
        objetoNormalizado.matriculados_total = item.matriculados_total || 0;
        objetoNormalizado.matriculados_hombre = item.matriculados_hombre || 0;
        objetoNormalizado.matriculados_mujer = item.matriculados_mujer || 0;
        objetoNormalizado.aprobados_total = item.aprobados_total || 0;
        objetoNormalizado.aprobados_hombre = item.aprobados_hombre || 0;
        objetoNormalizado.aprobados_mujer = item.aprobados_mujer || 0;
        objetoNormalizado.desertores_total = item.desertores_total || 0;
        objetoNormalizado.desertores_hombre = item.desertores_hombre || 0;
        objetoNormalizado.desertores_mujer = item.desertores_mujer || 0;
        objetoNormalizado.reprobados_total = item.reprobados_total || 0;
        objetoNormalizado.reprobados_hombre = item.reprobados_hombre || 0;
        objetoNormalizado.reprobados_mujer = item.reprobados_mujer || 0;
        break;

      case "modoFormacion":
        objetoNormalizado.modoFormacion = item.modos_de_formacion || item.modoFormacion;
        objetoNormalizado.region = item.regionales || item.region;
        objetoNormalizado.horas_accion_formativa = item.horas_accion_formativa || 0;
        objetoNormalizado.accion_formativa_inicio = item.accion_formativa_inicio || 0;
        objetoNormalizado.accion_formativa_final = item.accion_formativa_final || 0;
        objetoNormalizado.matriculados_total = item.matriculados_total || item.matriculaInicial || 0;
        objetoNormalizado.matriculados_hombre = item.matriculados_hombre || 0;
        objetoNormalizado.matriculados_mujer = item.matriculados_mujer || 0;
        objetoNormalizado.aprobados_total = item.aprobados_total || item.aprobados || 0;
        objetoNormalizado.aprobados_hombre = item.aprobados_hombre || 0;
        objetoNormalizado.aprobados_mujer = item.aprobados_mujer || 0;
        objetoNormalizado.desertores_total = item.desertores_total || item.desercion || 0;
        objetoNormalizado.desertores_hombre = item.desertores_hombre || 0;
        objetoNormalizado.desertores_mujer = item.desertores_mujer || 0;
        break;

      case "programa":
        objetoNormalizado.programa = item.Programa || item.programa;
        objetoNormalizado.horas_accion_formativa = item.horas_accion_formativa || 0;
        objetoNormalizado.accion_formativa_inicio = item.accion_formativa_inicio || 0;
        objetoNormalizado.accion_formativa_final = item.accion_formativa_final || 0;
        objetoNormalizado.matriculados_total = item.matriculados_total || item.matriculaInicial || 0;
        objetoNormalizado.matriculados_hombre = item.matriculados_hombre || 0;
        objetoNormalizado.matriculados_mujer = item.matriculados_mujer || 0;
        objetoNormalizado.aprobados_total = item.aprobados_total || item.aprobados || 0;
        objetoNormalizado.aprobados_hombre = item.aprobados_hombre || 0;
        objetoNormalizado.aprobados_mujer = item.aprobados_mujer || 0;
        objetoNormalizado.desertores_total = item.desertores_total || item.desercion || 0;
        objetoNormalizado.desertores_hombre = item.desertores_hombre || 0;
        objetoNormalizado.desertores_mujer = item.desertores_mujer || 0;
        break;

      case "sectorEconomico":
        objetoNormalizado.sectorEconomico = item.sector || item.sectorEconomico;
        objetoNormalizado.region = item.regionales || item.region;
        objetoNormalizado.horas_accion_formativa = item.horas_accion_formativa || 0;
        objetoNormalizado.accion_formativa_inicio = item.accion_formativa_inicio || 0;
        objetoNormalizado.matriculados_total = item.matriculados_total || item.matriculaInicial || 0;
        objetoNormalizado.matriculados_hombre = item.matriculados_hombre || 0;
        objetoNormalizado.matriculados_mujer = item.matriculados_mujer || 0;
        objetoNormalizado.aprobados_total = item.aprobados_total || item.aprobados || 0;
        objetoNormalizado.aprobados_hombre = item.aprobados_hombre || 0;
        objetoNormalizado.aprobados_mujer = item.aprobados_mujer || 0;
        objetoNormalizado.desertores_total = item.desertores_total || item.desercion || 0;
        objetoNormalizado.desertores_hombre = item.desertores_hombre || 0;
        objetoNormalizado.desertores_mujer = item.desertores_mujer || 0;
        break;

      case "unidadCurso":
        objetoNormalizado.unidad = item.unidad || item.Unidad;
        objetoNormalizado.curso = item.curso || item.Curso;
        objetoNormalizado.region = item.region || item.Region;
        objetoNormalizado.rangoedad = item.rangoedad || item.RangoEdad;
        objetoNormalizado.anio = item.periodo || item.anio;

        if (metric === "horas") {
          objetoNormalizado.horas = item.horas || 0;
          objetoNormalizado.finalizados = item.finalizados || 0;
          objetoNormalizado.horas_impartidas = item.horas || 0;
          objetoNormalizado.horas_accion_formativa = item.horas || 0;
          objetoNormalizado.matriculados_total = item.finalizados || 0;
        } else {
          objetoNormalizado.matriculados_total = parseInt(item.MatriculaInicialTotal) || 0;
          objetoNormalizado.matriculados_hombre = parseInt(item.MatriculaInicialHombres) || 0;
          objetoNormalizado.matriculados_mujer = parseInt(item.MatriculaIncialMujeres) || 0;
          objetoNormalizado.desertores_total = parseInt(item.DesercionTotal) || 0;
          objetoNormalizado.desertores_hombre = parseInt(item.DesercionHombres) || 0;
          objetoNormalizado.desertores_mujer = parseInt(item.DesercionMujeres) || 0;
          objetoNormalizado.reprobados_total = parseInt(item.ReprobadosTotal) || 0;
          objetoNormalizado.reprobados_hombre = parseInt(item.ReprobadosHombres) || 0;
          objetoNormalizado.reprobados_mujer = parseInt(item.ReprobadasMujeres) || 0;
          objetoNormalizado.aprobados_total = parseInt(item.AprobadosTotal) || 0;
          objetoNormalizado.aprobados_hombre = parseInt(item.AprobadosHombres) || 0;
          objetoNormalizado.aprobados_mujer = parseInt(item.AprobadosMujer) || 0;
        }
        break;

      case "centroFormacion":
        objetoNormalizado.centroFormacion = item.centro || item.centroFormacion;
        objetoNormalizado.region = item.regional || item.region;
        objetoNormalizado.rangoedad = item.rango_edad || item.rangoedad;
        objetoNormalizado.anio = item.año || item.anio;
        objetoNormalizado.matriculados_total = item.matriculados_total || 0;
        objetoNormalizado.matriculados_hombre = item.matriculados_hombre || 0;
        objetoNormalizado.matriculados_mujer = item.matriculados_mujer || 0;
        objetoNormalizado.aprobados_total = item.aprobados_total || 0;
        objetoNormalizado.aprobados_hombre = item.aprobados_hombre || 0;
        objetoNormalizado.aprobados_mujer = item.aprobados_mujer || 0;
        objetoNormalizado.desertores_total = item.desertores_total || 0;
        objetoNormalizado.desertores_hombre = item.desertores_hombre || 0;
        objetoNormalizado.desertores_mujer = item.desertores_mujer || 0;
        objetoNormalizado.reprobados_total = item.reprobados_total || 0;
        objetoNormalizado.reprobados_hombre = item.reprobados_hombre || 0;
        objetoNormalizado.reprobados_mujer = item.reprobados_mujer || 0;
        break;

      default:
        objetoNormalizado.departamento = item.departamento || item.Departamento;
    }

    return objetoNormalizado;
  });
};

// ==================== FUNCIÓN PARA CARGAR DATOS ====================
const cargarDatosPorDimension = async (dimension, metric, isTasa) => {
  let url;

  // Si está en modo tasa y la dimensión lo soporta
  if (isTasa && DIMENSIONES_CON_TASA.includes(dimension)) {
    // Verificar si la métrica es válida en modo tasa
    const metricasTasa = METRICAS_POR_DIMENSION_TASA[dimension] || [];
    if (!metricasTasa.includes(metric)) {
      console.warn(`Métrica ${metric} no disponible en modo Tasa para ${dimension}`);
      return [];
    }

    switch (dimension) {
      case "departamento":
        url = API_URLS.tasaDepartamento;
        break;
      case "region":
        url = API_URLS.tasaRegion;
        break;
      case "modoFormacion":
        url = API_URLS.tasaModoFormacion;
        break;
      case "programa":
        url = API_URLS.tasaPrograma;
        break;
      case "sectorEconomico":
        url = API_URLS.tasaSectorEconomico;
        break;
      default:
        url = API_URLS[dimension];
    }
  } else {
    url = API_URLS[dimension];
  }

  // Si es unidadCurso y la métrica es "horas", usar la API de horas
  if (dimension === "unidadCurso" && metric === "horas" && !isTasa) {
    url = API_URLS.unidadCursoHoras;
  }

  if (!url) {
    console.error(`No URL found for dimension: ${dimension}`);
    return [];
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    const datosArray = Array.isArray(data) ? data : data.data || [];
    console.log(`Datos crudos para ${dimension} (metric: ${metric}, tasa: ${isTasa}):`, datosArray.length);
    const normalizados = normalizarDatos(datosArray, dimension, metric, isTasa);
    console.log(`Datos normalizados para ${dimension}:`, normalizados.length);
    return normalizados;
  } catch (error) {
    console.error(`Error cargando datos para ${dimension}:`, error);
    return [];
  }
};

// ==================== BASE TABLERO INFOP ====================
const BaseTableroInfop = ({ titulo }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [hiddenLines, setHiddenLines] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [datosMapa, setDatosMapa] = useState({});
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });
  const [orderDirection, setOrderDirection] = useState("desc");

  const [selectedMetric, setSelectedMetric] = useState("matriculaInicial");
  const [selectedDimension, setSelectedDimension] = useState("departamento");

  const [isTasaMode, setIsTasaMode] = useState(false);
  const [filtros, setFiltros] = useState({
    anio: "Todos",
    genero: "Todos",
    departamento: "Todos",
    municipio: "Todos",
    region: "Todos",
    modoFormacion: "Todos",
    sectorEconomico: "Todos",
    unidadCurso: "Todos",
    programa: "Todos",
    centroFormacion: "Todos",
    curso: "Todos",
    rangoEdad: "Todos",
  });

  const configGraficos = useMemo(() => {
    return (
      CONFIG_GRAFICOS_POR_METRICA[selectedMetric] ||
      CONFIG_GRAFICOS_POR_METRICA.matriculaInicial
    );
  }, [selectedMetric]);

  const METRICAS_LIST_COMPLETA = useMemo(() => {
    return Object.entries(METRICAS_INFOP).map(([id, label]) => ({ id, label }));
  }, []);

  const METRICAS_LIST = useMemo(() => {
    let metricasDisponiblesIds;

    if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
      // Usar métricas de tasa
      metricasDisponiblesIds = METRICAS_POR_DIMENSION_TASA[selectedDimension] ||
        METRICAS_POR_DIMENSION_TASA.departamento;
    } else {
      // Usar métricas normales
      metricasDisponiblesIds = METRICAS_POR_DIMENSION[selectedDimension] ||
        METRICAS_POR_DIMENSION.departamento;
    }

    return METRICAS_LIST_COMPLETA.filter((metric) =>
      metricasDisponiblesIds.includes(metric.id),
    );
  }, [selectedDimension, METRICAS_LIST_COMPLETA, isTasaMode]);

  useEffect(() => {
    let metricasDisponiblesIds;

    if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
      metricasDisponiblesIds = METRICAS_POR_DIMENSION_TASA[selectedDimension] ||
        METRICAS_POR_DIMENSION_TASA.departamento;
    } else {
      metricasDisponiblesIds = METRICAS_POR_DIMENSION[selectedDimension] ||
        METRICAS_POR_DIMENSION.departamento;
    }

    if (!metricasDisponiblesIds.includes(selectedMetric)) {
      setSelectedMetric(metricasDisponiblesIds[0] || "aprobados");
    }
  }, [selectedDimension, isTasaMode]);

  const DIMENSIONES_LIST = useMemo(() => {
    return Object.entries(DIMENSIONES_ANALISIS).map(([id, config]) => ({
      id,
      label: config.label,
      icon: config.icon,
    }));
  }, []);

  // ==================== CARGAR DATOS ====================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const datos = await cargarDatosPorDimension(selectedDimension, selectedMetric, isTasaMode);
      console.log(`Datos cargados para ${selectedDimension} (tasa: ${isTasaMode}):`, datos.length);
      setData(datos);
      setFiltros({
        anio: "Todos",
        genero: "Todos",
        departamento: "Todos",
        municipio: "Todos",
        region: "Todos",
        modoFormacion: "Todos",
        sectorEconomico: "Todos",
        unidadCurso: "Todos",
        programa: "Todos",
        centroFormacion: "Todos",
        curso: "Todos",
        rangoEdad: "Todos",
      });
      setLoading(false);
    };
    loadData();
  }, [selectedDimension, selectedMetric, isTasaMode]);

  // ==================== OBTENER OPCIONES PARA FILTROS ====================
  const añosDisponibles = useMemo(() => {
    const añosSet = new Set();
    data.forEach((item) => {
      if (item.anio) añosSet.add(String(item.anio));
    });
    return ["Todos", ...Array.from(añosSet).sort((a, b) => b - a)];
  }, [data]);

  const deptosDisponibles = useMemo(() => {
    const deptosSet = new Set();
    data.forEach((item) => {
      if (item.departamento) deptosSet.add(item.departamento);
    });
    return ["Todos", ...Array.from(deptosSet).sort()];
  }, [data]);

  const municipiosDisponibles = useMemo(() => {
    if (filtros.departamento === "Todos") return ["Todos"];
    const municipiosSet = new Set();
    data.forEach((item) => {
      if (
        item.departamento &&
        normalizar(item.departamento) === normalizar(filtros.departamento)
      ) {
        if (item.municipio && item.municipio !== "Todos") {
          municipiosSet.add(item.municipio);
        }
      }
    });
    return ["Todos", ...Array.from(municipiosSet).sort()];
  }, [data, filtros.departamento]);

  const regionesDisponibles = useMemo(() => {
    const regionesSet = new Set();
    data.forEach((item) => {
      if (item.region) regionesSet.add(item.region);
    });
    return ["Todos", ...Array.from(regionesSet).sort()];
  }, [data]);

  const modosFormacionDisponibles = useMemo(() => {
    const modosSet = new Set();
    data.forEach((item) => {
      if (item.modoFormacion) modosSet.add(item.modoFormacion);
    });
    return ["Todos", ...Array.from(modosSet).sort()];
  }, [data]);

  const sectoresDisponibles = useMemo(() => {
    const sectoresSet = new Set();
    data.forEach((item) => {
      if (item.sectorEconomico) sectoresSet.add(item.sectorEconomico);
    });
    return ["Todos", ...Array.from(sectoresSet).sort()];
  }, [data]);

  const programasDisponibles = useMemo(() => {
    const programasSet = new Set();
    data.forEach((item) => {
      if (item.programa) programasSet.add(item.programa);
    });
    return ["Todos", ...Array.from(programasSet).sort()];
  }, [data]);

  const centrosDisponibles = useMemo(() => {
    const centrosSet = new Set();
    data.forEach((item) => {
      if (item.centroFormacion) centrosSet.add(item.centroFormacion);
    });
    return ["Todos", ...Array.from(centrosSet).sort()];
  }, [data]);

  const unidadesDisponibles = useMemo(() => {
    const unidadesSet = new Set();
    data.forEach((item) => {
      if (item.unidad && item.unidad !== "Todos" && item.unidad !== "TODOS") {
        unidadesSet.add(item.unidad);
      }
    });
    return ["Todos", ...Array.from(unidadesSet).sort()];
  }, [data]);

  const cursosDisponibles = useMemo(() => {
    if (filtros.unidadCurso === "Todos") return ["Todos"];
    const cursosSet = new Set();
    data.forEach((item) => {
      if (
        item.unidad &&
        normalizar(item.unidad) === normalizar(filtros.unidadCurso)
      ) {
        if (item.curso && item.curso !== "Todos" && item.curso !== "TODOS") {
          cursosSet.add(item.curso);
        }
      }
    });
    return ["Todos", ...Array.from(cursosSet).sort()];
  }, [data, filtros.unidadCurso]);

  // Obtener rangos de edad disponibles de los datos
  const rangosEdadDisponibles = useMemo(() => {
    if (!DIMENSIONES_CON_GRAFICO_EDAD.includes(selectedDimension)) return ["Todos"];

    const rangosSet = new Set();
    data.forEach((item) => {
      if (item.rangoedad && item.rangoedad !== "Todos" && item.rangoedad !== "TODOS" && item.rangoedad !== "undefined") {
        rangosSet.add(item.rangoedad);
      }
    });

    const rangosExistentes = Array.from(rangosSet).filter(rango =>
      RANGOS_EDAD_DISPONIBLES.includes(rango) || rango !== "Todos"
    );

    const ordenRangos = [...RANGOS_EDAD_DISPONIBLES];
    rangosExistentes.sort((a, b) => {
      const indexA = ordenRangos.indexOf(a);
      const indexB = ordenRangos.indexOf(b);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return ["Todos", ...rangosExistentes];
  }, [data, selectedDimension]);

  // ==================== CONFIGURACIÓN DE FILTROS SEGÚN DIMENSIÓN ====================
  const filtersConfig = useMemo(() => {
    const filtrosBase = [
      { key: "anio", label: "Año", options: añosDisponibles },
    ];

    switch (selectedDimension) {
      case "departamento":
        filtrosBase.push(
          {
            key: "genero",
            label: "Género",
            options: ["Todos", "Femenino", "Masculino"],
          },
          {
            key: "departamento",
            label: "Departamento",
            options: deptosDisponibles,
          }
        );
        if (filtros.departamento !== "Todos") {
          filtrosBase.push({
            key: "municipio",
            label: "Municipio",
            options: municipiosDisponibles,
          });
        }
        break;

      case "region":
        filtrosBase.push(
          {
            key: "genero",
            label: "Género",
            options: ["Todos", "Femenino", "Masculino"],
          },
          { key: "region", label: "Región", options: regionesDisponibles }
        );
        break;

      case "modoFormacion":
        filtrosBase.push(
          { key: "region", label: "Región", options: regionesDisponibles },
          {
            key: "modoFormacion",
            label: "Modo de Formación",
            options: modosFormacionDisponibles,
          }
        );
        break;

      case "sectorEconomico":
        filtrosBase.push(
          {
            key: "genero",
            label: "Género",
            options: ["Todos", "Femenino", "Masculino"],
          },
          { key: "region", label: "Región", options: regionesDisponibles },
          {
            key: "sectorEconomico",
            label: "Sector Económico",
            options: sectoresDisponibles,
          }
        );
        break;

      case "programa":
        filtrosBase.push({
          key: "programa",
          label: "Programa",
          options: programasDisponibles,
        });
        break;

      case "unidadCurso":
        filtrosBase.push(
          { key: "region", label: "Región", options: regionesDisponibles },
          {
            key: "unidadCurso",
            label: "Unidad",
            options: unidadesDisponibles,
          }
        );
        if (filtros.unidadCurso !== "Todos") {
          filtrosBase.push({
            key: "curso",
            label: "Curso",
            options: cursosDisponibles,
          });
        }
        if (rangosEdadDisponibles.length > 1) {
          filtrosBase.push({
            key: "rangoEdad",
            label: "Rango de Edad",
            options: rangosEdadDisponibles,
          });
        }
        break;

      case "centroFormacion":
        filtrosBase.push(
          {
            key: "genero",
            label: "Género",
            options: ["Todos", "Femenino", "Masculino"],
          },
          { key: "region", label: "Región", options: regionesDisponibles },
          {
            key: "centroFormacion",
            label: "Centro de Formación",
            options: centrosDisponibles,
          }
        );
        if (rangosEdadDisponibles.length > 1) {
          filtrosBase.push({
            key: "rangoEdad",
            label: "Rango de Edad",
            options: rangosEdadDisponibles,
          });
        }
        break;

      default:
        filtrosBase.push({
          key: "genero",
          label: "Género",
          options: ["Todos", "Femenino", "Masculino"],
        });
    }

    return filtrosBase;
  }, [
    selectedDimension,
    añosDisponibles,
    deptosDisponibles,
    municipiosDisponibles,
    regionesDisponibles,
    modosFormacionDisponibles,
    sectoresDisponibles,
    programasDisponibles,
    centrosDisponibles,
    unidadesDisponibles,
    cursosDisponibles,
    rangosEdadDisponibles,
    filtros.departamento,
    filtros.unidadCurso,
  ]);

  // ==================== DATOS PARA GRÁFICO DE EDAD ====================
  const datosEdad = useMemo(() => {
    if (!DIMENSIONES_CON_GRAFICO_EDAD.includes(selectedDimension)) return [];

    const agrupado = new Map();

    filteredData.forEach((item) => {
      const rangoEdad = item.rangoedad;
      if (rangoEdad && rangoEdad !== "Todos" && rangoEdad !== "TODOS" && rangoEdad !== "undefined") {
        const valor = getMetricValue(item, selectedMetric);
        if (valor > 0) {
          if (!agrupado.has(rangoEdad)) {
            agrupado.set(rangoEdad, 0);
          }
          agrupado.set(rangoEdad, agrupado.get(rangoEdad) + valor);
        }
      }
    });

    const ordenRangos = [
      "MENOS DE 15",
      "DE 15 A 19 AÑOS",
      "DE 20 A 24 AÑOS",
      "DE 25 A 29 AÑOS",
      "DE 30 A 34 AÑOS",
      "DE 35 A 39 AÑOS",
      "DE 40 A 44 AÑOS",
      "DE 45 A 49 AÑOS",
      "DE 50 A 54 AÑOS",
      "DE 55 A 59 AÑOS",
      "DE 60 A 64 AÑOS",
      "DE 65 Y MÁS AÑOS",
      "60 Y MAS",
    ];

    const resultado = Array.from(agrupado.entries()).map(([rango, valor]) => ({
      rango,
      valor,
    }));

    resultado.sort((a, b) => {
      const indexA = ordenRangos.indexOf(a.rango);
      const indexB = ordenRangos.indexOf(b.rango);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return resultado;
  }, [filteredData, selectedMetric, selectedDimension]);

  // ==================== MEDIR DIMENSIONES DEL MAPA ====================
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("map-container");
      if (container) {
        const containerWidth = container.clientWidth;
        let height;
        if (isMobile) {
          height = containerWidth * 0.5;
        } else if (isTablet) {
          height = 500;
        } else {
          height = 600;
        }
        setDimensions({
          width: containerWidth,
          height: Math.max(height, 400),
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isMobile, isTablet]);

  // ==================== FILTRAR DATOS ====================

  useEffect(() => {
    if (!data.length) {
      setFilteredData([]);
      setDatosMapa({});
      return;
    }

    let filtrado = data.filter((d) => {
      const cumpleAnio =
        filtros.anio === "Todos" || String(d.anio) === String(filtros.anio);

      let cumpleGenero = true;
      if (filtros.genero !== "Todos") {
        if (filtros.genero === "Femenino") {
          cumpleGenero = d.genero === "Femenino" || d.genero === "Mujer";
        } else if (filtros.genero === "Masculino") {
          cumpleGenero = d.genero === "Masculino" || d.genero === "Hombre";
        }
      }

      const cumpleDepartamento =
        filtros.departamento === "Todos" ||
        normalizar(d.departamento) === normalizar(filtros.departamento);

      const cumpleMunicipio =
        filtros.municipio === "Todos" ||
        normalizar(d.municipio) === normalizar(filtros.municipio);

      const cumpleRegion =
        filtros.region === "Todos" ||
        normalizar(d.region) === normalizar(filtros.region);

      const cumpleModoFormacion =
        filtros.modoFormacion === "Todos" ||
        normalizar(d.modoFormacion) === normalizar(filtros.modoFormacion);

      const cumpleSectorEconomico =
        filtros.sectorEconomico === "Todos" ||
        normalizar(d.sectorEconomico) === normalizar(filtros.sectorEconomico);

      const cumplePrograma =
        filtros.programa === "Todos" ||
        normalizar(d.programa) === normalizar(filtros.programa);

      const cumpleCentroFormacion =
        filtros.centroFormacion === "Todos" ||
        normalizar(d.centroFormacion) === normalizar(filtros.centroFormacion);

      const cumpleUnidad =
        filtros.unidadCurso === "Todos" ||
        normalizar(d.unidad) === normalizar(filtros.unidadCurso);

      const cumpleCurso =
        filtros.curso === "Todos" ||
        normalizar(d.curso) === normalizar(filtros.curso);

      const cumpleRangoEdad =
        filtros.rangoEdad === "Todos" ||
        normalizar(d.rangoedad) === normalizar(filtros.rangoEdad);

      return (
        cumpleAnio &&
        cumpleGenero &&
        cumpleDepartamento &&
        cumpleMunicipio &&
        cumpleRegion &&
        cumpleModoFormacion &&
        cumpleSectorEconomico &&
        cumplePrograma &&
        cumpleCentroFormacion &&
        cumpleUnidad &&
        cumpleCurso &&
        cumpleRangoEdad
      );
    });

    console.log(`Datos filtrados para ${selectedDimension}:`, filtrado.length);
    setFilteredData(filtrado);

    // Datos para el mapa
    if (DIMENSIONES_ANALISIS[selectedDimension]?.requiereMapa) {
      const datosMapaGlobal = {};

      filtrado.forEach((row) => {
        let clave;
        let nombreMostrar;

        if (selectedDimension === "departamento") {
          if (filtros.municipio !== "Todos") {
            clave = row.municipio;
            nombreMostrar = row.municipio;
          } else if (filtros.departamento !== "Todos") {
            clave = row.municipio;
            nombreMostrar = row.municipio;
          } else {
            clave = row.departamento;
            nombreMostrar = row.departamento;
          }
        } else if (selectedDimension === "region") {
          clave = row.region;
          nombreMostrar = row.region;
        } else if (selectedDimension === "modoFormacion") {
          clave = row.region;
          nombreMostrar = row.region;
        } else if (selectedDimension === "unidadCurso") {
          clave = row.region;
          nombreMostrar = row.region;
        } else if (selectedDimension === "centroFormacion") {
          clave = row.region;
          nombreMostrar = row.region;
        } else if (selectedDimension === "sectorEconomico") {
          clave = row.region;
          nombreMostrar = row.region;
        } else {
          clave = row[selectedDimension];
          nombreMostrar = row[selectedDimension];
        }

        if (
          clave &&
          clave !== "Todos" &&
          clave !== "TODOS" &&
          clave !== "undefined" &&
          clave !== null
        ) {
          const claveNormalizada = normalizar(clave);
          const valor = getMetricValue(row, selectedMetric, true);

          if (valor > 0) {
            if (!datosMapaGlobal[claveNormalizada]) {
              datosMapaGlobal[claveNormalizada] = {
                valor: 0,
                nombre: nombreMostrar || clave,
                count: 0, // Contador para promediar en modo Tasa
              };
            }
            // En modo Tasa, acumulamos para luego promediar
            if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
              datosMapaGlobal[claveNormalizada].valor += valor;
              datosMapaGlobal[claveNormalizada].count++;
            } else {
              datosMapaGlobal[claveNormalizada].valor += valor;
            }
          }
        }
      });

      // Si es modo Tasa, promediamos los valores
      if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
        Object.keys(datosMapaGlobal).forEach((key) => {
          const item = datosMapaGlobal[key];
          if (item.count > 0) {
            item.valor = item.valor / item.count;
            item.valorFormateado = `${(item.valor * 100).toFixed(2)}%`;
          }
          delete item.count; // Limpiamos el contador
        });
      }

      console.log(`Datos para mapa (${selectedDimension}):`, Object.keys(datosMapaGlobal).length);
      setDatosMapa(datosMapaGlobal);
    }
  }, [data, filtros, selectedMetric, selectedDimension, isTasaMode]);

  // ==================== DATOS PARA LA TABLA ====================
  const mostrarTabla = DIMENSIONES_CON_TABLA.includes(selectedDimension);
  const tablaLateral = DIMENSIONES_TABLA_LATERAL.includes(selectedDimension);
  const mostrarGraficoEdad = DIMENSIONES_CON_GRAFICO_EDAD.includes(selectedDimension) && datosEdad.length > 0;
  const mostrarGraficosLateral = ["departamento", "region", "sectorEconomico"].includes(selectedDimension);

  const datosTabla = useMemo(() => {
    if (!mostrarTabla || !filteredData.length) return [];

    const agrupado = new Map();
    let resultado = [];

    // Determinar si estamos en modo Tasa y necesitamos promediar
    const necesitaPromedio = isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension);

    if (selectedDimension === "unidadCurso") {
      const esMetricaHoras = selectedMetric === "horas";

      filteredData.forEach((row) => {
        const unidad = row.unidad;
        const curso = row.curso;
        if (unidad && unidad !== "Todos" && unidad !== "TODOS") {
          const clave = `${unidad}|${curso}`;
          if (!agrupado.has(clave)) {
            if (esMetricaHoras) {
              agrupado.set(clave, {
                unidad,
                curso: curso || "Todos",
                horas: 0,
                finalizados: 0,
              });
            } else {
              agrupado.set(clave, {
                unidad,
                curso: curso || "Todos",
                total: 0,
                count: necesitaPromedio ? 0 : undefined,
              });
            }
          }
          const item = agrupado.get(clave);
          if (esMetricaHoras) {
            item.horas += row.horas || 0;
            item.finalizados += row.finalizados || 0;
          } else {
            const valor = getMetricValue(row, selectedMetric);
            if (necesitaPromedio) {
              item.total += valor;
              item.count++;
            } else {
              item.total += valor;
            }
          }
        }
      });

      if (necesitaPromedio && selectedMetric !== "horas") {
        resultado = Array.from(agrupado.values()).map(item => ({
          ...item,
          total: item.count > 0 ? item.total / item.count : 0
        }));
      } else {
        resultado = Array.from(agrupado.values());
      }
    } else if (selectedDimension === "centroFormacion") {
      filteredData.forEach((row) => {
        const centro = row.centroFormacion;
        if (centro && centro !== "Todos" && centro !== "TODOS") {
          const valor = getMetricValue(row, selectedMetric);
          if (!agrupado.has(centro)) {
            agrupado.set(centro, { total: 0, count: necesitaPromedio ? 0 : undefined });
          }
          const item = agrupado.get(centro);
          if (necesitaPromedio) {
            item.total += valor;
            item.count++;
          } else {
            item.total += valor;
          }
        }
      });

      if (necesitaPromedio) {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total, count }]) => ({
          nombre,
          valor: count > 0 ? total / count : 0,
        }));
      } else {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total }]) => ({
          nombre,
          valor: total,
        }));
      }
    } else if (selectedDimension === "modoFormacion") {
      filteredData.forEach((row) => {
        const modo = row.modoFormacion;
        if (modo && modo !== "Todos" && modo !== "TODOS") {
          const valor = getMetricValue(row, selectedMetric);
          if (!agrupado.has(modo)) {
            agrupado.set(modo, { total: 0, count: necesitaPromedio ? 0 : undefined });
          }
          const item = agrupado.get(modo);
          if (necesitaPromedio) {
            item.total += valor;
            item.count++;
          } else {
            item.total += valor;
          }
        }
      });

      if (necesitaPromedio) {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total, count }]) => ({
          nombre,
          valor: count > 0 ? total / count : 0,
        }));
      } else {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total }]) => ({
          nombre,
          valor: total,
        }));
      }
    } else if (selectedDimension === "programa") {
      filteredData.forEach((row) => {
        const programa = row.programa;
        if (programa && programa !== "Todos" && programa !== "TODOS") {
          const valor = getMetricValue(row, selectedMetric);
          if (!agrupado.has(programa)) {
            agrupado.set(programa, { total: 0, count: necesitaPromedio ? 0 : undefined });
          }
          const item = agrupado.get(programa);
          if (necesitaPromedio) {
            item.total += valor;
            item.count++;
          } else {
            item.total += valor;
          }
        }
      });

      if (necesitaPromedio) {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total, count }]) => ({
          nombre,
          valor: count > 0 ? total / count : 0,
        }));
      } else {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total }]) => ({
          nombre,
          valor: total,
        }));
      }
    } else if (selectedDimension === "sectorEconomico") {
      filteredData.forEach((row) => {
        const sector = row.sectorEconomico;
        if (sector && sector !== "Todos" && sector !== "TODOS") {
          const valor = getMetricValue(row, selectedMetric);
          if (!agrupado.has(sector)) {
            agrupado.set(sector, { total: 0, count: necesitaPromedio ? 0 : undefined });
          }
          const item = agrupado.get(sector);
          if (necesitaPromedio) {
            item.total += valor;
            item.count++;
          } else {
            item.total += valor;
          }
        }
      });

      if (necesitaPromedio) {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total, count }]) => ({
          nombre,
          valor: count > 0 ? total / count : 0,
        }));
      } else {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total }]) => ({
          nombre,
          valor: total,
        }));
      }
    } else if (selectedDimension === "departamento") {
      filteredData.forEach((row) => {
        const depto = row.departamento;
        if (depto && depto !== "Todos" && depto !== "TODOS") {
          const valor = getMetricValue(row, selectedMetric);
          if (!agrupado.has(depto)) {
            agrupado.set(depto, { total: 0, count: necesitaPromedio ? 0 : undefined });
          }
          const item = agrupado.get(depto);
          if (necesitaPromedio) {
            item.total += valor;
            item.count++;
          } else {
            item.total += valor;
          }
        }
      });

      if (necesitaPromedio) {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total, count }]) => ({
          nombre,
          valor: count > 0 ? total / count : 0,
        }));
      } else {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total }]) => ({
          nombre,
          valor: total,
        }));
      }
    } else if (selectedDimension === "region") {
      filteredData.forEach((row) => {
        const region = row.region;
        if (region && region !== "Todos" && region !== "TODOS") {
          const valor = getMetricValue(row, selectedMetric);
          if (!agrupado.has(region)) {
            agrupado.set(region, { total: 0, count: necesitaPromedio ? 0 : undefined });
          }
          const item = agrupado.get(region);
          if (necesitaPromedio) {
            item.total += valor;
            item.count++;
          } else {
            item.total += valor;
          }
        }
      });

      if (necesitaPromedio) {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total, count }]) => ({
          nombre,
          valor: count > 0 ? total / count : 0,
        }));
      } else {
        resultado = Array.from(agrupado.entries()).map(([nombre, { total }]) => ({
          nombre,
          valor: total,
        }));
      }
    }

    // Ordenar según orderDirection
    resultado.sort((a, b) => {
      const valA = a.valor || a.total || 0;
      const valB = b.valor || b.total || 0;
      if (orderDirection === "asc") {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });

    return resultado;
  }, [
    filteredData,
    selectedMetric,
    selectedDimension,
    orderDirection,
    mostrarTabla,
    isTasaMode,
  ]);

  const handleSort = () => {
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
  };

  // ==================== CALCULAR TOTAL GENERAL ====================
  const totalGeneral = useMemo(() => {
    if (!filteredData.length) return 0;

    // En modo Tasa, promediamos los valores en lugar de sumarlos
    if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
      let total = 0;
      let count = 0;
      filteredData.forEach((row) => {
        const valor = getMetricValue(row, selectedMetric);
        if (typeof valor === "number") {
          total += valor;
          count++;
        }
      });
      // Retornar el promedio
      return count > 0 ? total / count : 0;
    }

    // Modo normal: sumamos
    let total = 0;
    filteredData.forEach((row) => {
      const valor = getMetricValue(row, selectedMetric);
      if (typeof valor === "number" && valor > 0) {
        total += valor;
      }
    });
    return total;
  }, [filteredData, selectedMetric, isTasaMode, selectedDimension]);

  const datosAccionesFormativas = useMemo(() => {
    if (!DIMENSIONES_CON_GRAFICO_ACCIONES.includes(selectedDimension)) return [];
    if (selectedMetric !== "accionesFormativas") return [];

    let totalInicio = 0;
    let totalFinal = 0;

    filteredData.forEach((item) => {
      totalInicio += item.accion_formativa_inicio || 0;
      totalFinal += item.accion_formativa_final || 0;
    });

    return [
      {
        name: "Acciones Formativas",
        inicio: totalInicio,
        final: totalFinal,
      },
    ];
  }, [filteredData, selectedDimension, selectedMetric]);

  const mostrarGraficoAcciones = DIMENSIONES_CON_GRAFICO_ACCIONES.includes(selectedDimension) &&
    selectedMetric === "accionesFormativas" &&
    datosAccionesFormativas.length > 0;

  // ==================== DATOS PARA GRÁFICOS ====================
  const datosGenero = useMemo(() => {
    let femenino = 0;
    let masculino = 0;
    let count = 0;

    filteredData.forEach((item) => {
      if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
        // En modo Tasa, usar los campos de tasa
        if (selectedMetric === "matriculaInicial" || selectedMetric === "aprobados") {
          masculino += item.tasa_aprobados_hombre || item.aprobados_hombre || 0;
          femenino += item.tasa_aprobados_mujer || item.aprobados_mujer || 0;
        } else if (selectedMetric === "desercion") {
          masculino += item.tasa_desercion_hombre || item.desertores_hombre || 0;
          femenino += item.tasa_desercion_mujer || item.desertores_mujer || 0;
        } else if (selectedMetric === "reprobados") {
          masculino += item.tasa_reprobados_hombre || item.reprobados_hombre || 0;
          femenino += item.tasa_reprobados_mujer || item.reprobados_mujer || 0;
        }
      } else {
        // Modo normal
        if (selectedMetric === "matriculaInicial") {
          masculino += item.matriculados_hombre || 0;
          femenino += item.matriculados_mujer || 0;
        } else if (selectedMetric === "aprobados") {
          masculino += item.aprobados_hombre || 0;
          femenino += item.aprobados_mujer || 0;
        } else if (selectedMetric === "desercion") {
          masculino += item.desertores_hombre || 0;
          femenino += item.desertores_mujer || 0;
        } else if (selectedMetric === "reprobados") {
          masculino += item.reprobados_hombre || 0;
          femenino += item.reprobados_mujer || 0;
        }
      }
      count++;
    });

    console.log("datosGenero - isTasaMode:", isTasaMode);
    console.log("datosGenero - femenino:", femenino, "masculino:", masculino, "count:", count);

    if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension) && count > 0) {
      const femeninoPromedio = femenino / count;
      const masculinoPromedio = masculino / count;
      return [
        { name: "Femenino", value: femeninoPromedio },
        { name: "Masculino", value: masculinoPromedio },
      ];
    }

    return [
      { name: "Femenino", value: femenino },
      { name: "Masculino", value: masculino },
    ];
  }, [filteredData, selectedMetric, isTasaMode, selectedDimension]);

  const datosLineaPeriodo = useMemo(() => {
    const mapa = new Map();
    filteredData.forEach((item) => {
      const periodo = item.anio;
      if (!periodo) return;
      const valor = getMetricValue(item, selectedMetric);
      if (!mapa.has(periodo)) {
        mapa.set(periodo, { periodo, total: 0, count: 0 });
      }
      const entry = mapa.get(periodo);

      if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
        // En modo Tasa, acumulamos para promediar
        entry.total += valor;
        entry.count++;
      } else {
        entry.total += valor;
      }
    });

    // Convertir a array y promediar si es modo Tasa
    const resultado = Array.from(mapa.values()).map(entry => {
      if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension) && entry.count > 0) {
        return { periodo: entry.periodo, total: entry.total / entry.count };
      }
      return { periodo: entry.periodo, total: entry.total };
    });

    return resultado.sort((a, b) => a.periodo - b.periodo);
  }, [filteredData, selectedMetric, isTasaMode, selectedDimension]);

  // ==================== HANDLERS ====================
  const handleFilterChange = useCallback((key, value) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
    if (key === "departamento") {
      setFiltros((prev) => ({ ...prev, municipio: "Todos" }));
    }
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setFiltros((prev) => ({ ...prev, [key]: "Todos" }));
    if (key === "departamento") {
      setFiltros((prev) => ({ ...prev, municipio: "Todos" }));
    }
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFiltros({
      anio: "Todos",
      genero: "Todos",
      departamento: "Todos",
      municipio: "Todos",
      region: "Todos",
      modoFormacion: "Todos",
      sectorEconomico: "Todos",
      unidadCurso: "Todos",
      programa: "Todos",
      centroFormacion: "Todos",
      curso: "Todos",
      rangoEdad: "Todos",
    });
  }, []);

  const handleDimensionChange = useCallback((dimension) => {
    setSelectedDimension(dimension);
  }, []);

  const hasData = useMemo(() => {
    if (loading) return true;
    return filteredData.length > 0;
  }, [filteredData, loading]);

  const hasGenderData = useMemo(() => {
    if (!datosGenero.length) return false;
    if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
      // En modo Tasa, verificar si los valores promedio son > 0
      return datosGenero.some((item) => item.value > 0);
    }
    return datosGenero.some((item) => item.value > 0);
  }, [datosGenero, isTasaMode, selectedDimension]);
  const mostrarGraficoPeriodo =
    configGraficos.mostrarPeriodo &&
    hasData &&
    datosLineaPeriodo.length > 0 &&
    !DIMENSIONES_CON_GRAFICO_EDAD.includes(selectedDimension);

  const requiereMapa = DIMENSIONES_ANALISIS[selectedDimension]?.requiereMapa || false;

  const mostrarGenero = useMemo(() => {
    console.log("mostrarGenero - isTasaMode:", isTasaMode);
    console.log("mostrarGenero - hasGenderData:", hasGenderData);
    console.log("mostrarGenero - selectedDimension:", selectedDimension);

    // En modo Tasa, siempre mostrar el gráfico si hay datos de género
    if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
      const show = hasGenderData && DIMENSIONES_CON_GRAFICO_GENERO.includes(selectedDimension);
      console.log("mostrarGenero (Tasa):", show);
      return show;
    }
    // En modo normal, respetar la configuración
    const show = configGraficos.mostrarGenero && hasGenderData && DIMENSIONES_CON_GRAFICO_GENERO.includes(selectedDimension);
    console.log("mostrarGenero (Normal):", show);
    return show;
  }, [configGraficos.mostrarGenero, hasGenderData, selectedDimension, isTasaMode]);

  const nombreDimension = DIMENSIONES_ANALISIS[selectedDimension]?.label || selectedDimension;

  // ==================== DATOS PARA GRÁFICO DE LÍNEAS MÚLTIPLES ====================

  const datosLineasMultiples = useMemo(() => {
    if (!DIMENSIONES_CON_GRAFICO_LINEAS.includes(selectedDimension)) return [];

    // Agrupar por año
    const mapaPorAnio = new Map();

    filteredData.forEach((item) => {
      const anio = item.anio;
      if (!anio || anio === "Todos" || anio === "TODOS") return;

      if (!mapaPorAnio.has(anio)) {
        mapaPorAnio.set(anio, {
          año: anio,
          mujer: 0,
          hombre: 0,
          total: 0,
          countMujer: 0,
          countHombre: 0,
          countTotal: 0,
        });
      }

      const entry = mapaPorAnio.get(anio);

      // Obtener valores de género según la métrica seleccionada
      let valorMujer = 0;
      let valorHombre = 0;
      let valorTotal = 0;

      if (selectedMetric === "matriculaInicial") {
        valorMujer = item.matriculados_mujer || 0;
        valorHombre = item.matriculados_hombre || 0;
        valorTotal = item.matriculados_total || 0;
      } else if (selectedMetric === "aprobados") {
        valorMujer = item.aprobados_mujer || 0;
        valorHombre = item.aprobados_hombre || 0;
        valorTotal = item.aprobados_total || 0;
      } else if (selectedMetric === "reprobados") {
        valorMujer = item.reprobados_mujer || 0;
        valorHombre = item.reprobados_hombre || 0;
        valorTotal = item.reprobados_total || 0;
      } else if (selectedMetric === "desercion") {
        valorMujer = item.desertores_mujer || 0;
        valorHombre = item.desertores_hombre || 0;
        valorTotal = item.desertores_total || 0;
      }

      if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
        // En modo Tasa, acumular para promediar
        if (valorMujer > 0) {
          entry.mujer += valorMujer;
          entry.countMujer++;
        }
        if (valorHombre > 0) {
          entry.hombre += valorHombre;
          entry.countHombre++;
        }
        if (valorTotal > 0) {
          entry.total += valorTotal;
          entry.countTotal++;
        }
      } else {
        // Modo normal: sumar directamente
        entry.mujer += valorMujer;
        entry.hombre += valorHombre;
        entry.total += valorTotal;
      }
    });

    // Convertir a array y promediar si es modo Tasa
    const resultado = Array.from(mapaPorAnio.values()).map(entry => {
      if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
        return {
          año: entry.año,
          mujer: entry.countMujer > 0 ? entry.mujer / entry.countMujer : 0,
          hombre: entry.countHombre > 0 ? entry.hombre / entry.countHombre : 0,
          total: entry.countTotal > 0 ? entry.total / entry.countTotal : 0,
        };
      }
      return {
        año: entry.año,
        mujer: entry.mujer,
        hombre: entry.hombre,
        total: entry.total,
      };
    });

    // Ordenar por año
    resultado.sort((a, b) => a.año - b.año);

    return resultado;
  }, [filteredData, selectedDimension, selectedMetric, isTasaMode]);

 

  // Skeleton para la tabla
  const TablaSkeleton = () => (
    <TableContainer component={Paper}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: color.primary, color: color.white }}>
              <Skeleton variant="text" width={100} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
            </TableCell>
            <TableCell align="right" sx={{ backgroundColor: color.primary, color: color.white }}>
              <Skeleton variant="text" width={80} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton variant="text" width="80%" />
              </TableCell>
              <TableCell align="right">
                <Skeleton variant="text" width={110} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Componente de Tabla reutilizable
  const TablaComponente = () => {
    const esUnidadCursoHoras = selectedDimension === "unidadCurso" && selectedMetric === "horas";

    const formatValue = (value) => {
      if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
        return `${(value * 100).toFixed(2)}%`;
      }
      return value?.toLocaleString() || 0;
    };

    return (
      <StyledCard sx={{ height: "100%" }}>
        <StyledCardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
              Datos por {nombreDimension}
            </Typography>
            <Tooltip title={`Listado de ${nombreDimension}`}>
              <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
            </Tooltip>
          </Stack>

          {loading ? (
            <TablaSkeleton />
          ) : !hasData ? (
            <EmptyState onClearFilters={handleClearAllFilters} />
          ) : (
            <TableContainer component={Paper} sx={{ maxHeight: 710 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {esUnidadCursoHoras ? (
                      <>
                        <TableCell sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white, position: "sticky", top: 0, zIndex: 10 }}>
                          Unidad
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white, position: "sticky", top: 0, zIndex: 10 }}>
                          Curso
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white, position: "sticky", top: 0, zIndex: 10 }}>
                          Horas
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white, position: "sticky", top: 0, zIndex: 10 }}>
                          Finalizados
                        </TableCell>
                      </>
                    ) : selectedDimension === "unidadCurso" ? (
                      <>
                        <TableCell sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white, position: "sticky", top: 0, zIndex: 10 }}>
                          Unidad
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white, position: "sticky", top: 0, zIndex: 10 }}>
                          Curso
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white, position: "sticky", top: 0, zIndex: 10 }}>
                          <TableSortLabel
                            active={true}
                            direction={orderDirection}
                            onClick={handleSort}
                            sx={{ color: `${color.white} !important`, "&.Mui-active": { color: `${color.white} !important` }, "& .MuiTableSortLabel-icon": { color: `${color.white} !important` } }}
                          >
                            {isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)
                              ? `${METRICAS_LIST.find((m) => m.id === selectedMetric)?.label || selectedMetric} (%)`
                              : METRICAS_LIST.find((m) => m.id === selectedMetric)?.label || selectedMetric}
                          </TableSortLabel>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white, position: "sticky", top: 0, zIndex: 10 }}>
                          {nombreDimension}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white, position: "sticky", top: 0, zIndex: 10 }}>
                          <TableSortLabel
                            active={true}
                            direction={orderDirection}
                            onClick={handleSort}
                            sx={{ color: `${color.white} !important`, "&.Mui-active": { color: `${color.white} !important` }, "& .MuiTableSortLabel-icon": { color: `${color.white} !important` } }}
                          >
                            {isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)
                              ? `${METRICAS_LIST.find((m) => m.id === selectedMetric)?.label || selectedMetric} (%)`
                              : METRICAS_LIST.find((m) => m.id === selectedMetric)?.label || selectedMetric}
                          </TableSortLabel>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datosTabla.map((item, index) => (
                    <TableRow key={index} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" }, "&:hover": { backgroundColor: "#e0e0e0" } }}>
                      {esUnidadCursoHoras ? (
                        <>
                          <TableCell>{item.unidad}</TableCell>
                          <TableCell>{item.curso}</TableCell>
                          <TableCell align="right">{item.horas?.toLocaleString() || 0}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>{item.finalizados?.toLocaleString() || 0}</TableCell>
                        </>
                      ) : selectedDimension === "unidadCurso" ? (
                        <>
                          <TableCell>{item.unidad}</TableCell>
                          <TableCell>{item.curso}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            {formatValue(item.total || 0)}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{item.nombre}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            {formatValue(item.valor || 0)}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                  {datosTabla.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={esUnidadCursoHoras ? 4 : (selectedDimension === "unidadCurso" ? 3 : 2)} align="center">
                        No hay datos disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </StyledCardContent>
      </StyledCard>
    );
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <ScrollReveal direction="right" duration={0.8}>
        <Typography
          sx={{
            textAlign: "center",
            color: color.secondary,
            fontWeight: "bold",
            fontSize: "clamp(1.2rem, 4vw, 2.5rem)",
            position: "relative",
            display: "inline-block",
            width: "100%",
            mb: 4,
            "&::after": {
              content: '""',
              position: "absolute",
              left: "50%",
              bottom: -8,
              transform: "translateX(-50%)",
              width: "60px",
              height: "4px",
              background: color.secondary,
              borderRadius: 2,
              transition: "0.3s",
            },
            "&:hover::after": {
              width: "120px",
            },
          }}
        >
          {titulo}
        </Typography>
      </ScrollReveal>

      {/* Selector de Dimensión - AZUL (primary) */}
      <ScrollReveal direction="left" delay={0.1}>
        <Stack
          direction="row"
          sx={{
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
            mb: 3,
            px: { xs: 1, sm: 2 },
          }}
        >
          {DIMENSIONES_LIST.map((dim) => {
            const isSelected = selectedDimension === dim.id;
            return (
              <Tooltip key={dim.id} title={`Analizar por ${dim.label}`}>
                <Chip
                  icon={dim.icon}
                  label={dim.label}
                  onClick={() => handleDimensionChange(dim.id)}
                  variant={isSelected ? "filled" : "outlined"}
                  sx={{
                    transition: "all 0.2s ease",
                    backgroundColor: isSelected ? color.primary : "transparent",
                    color: isSelected ? color.white : color.primary,
                    borderColor: color.primary,
                    "& .MuiChip-icon": {
                      color: isSelected ? color.white : color.primary,
                    },
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 1,
                      backgroundColor: isSelected ? color.primary : `${color.primary}15`,
                    },
                  }}
                />
              </Tooltip>
            );
          })}
        </Stack>
      </ScrollReveal>

      {/* Selector de Métrica - DORADO (secondary) */}
      <ScrollReveal direction="left" delay={0.05}>
        <Stack
          direction="row"
          sx={{
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
            mb: 2,
            px: { xs: 1, sm: 2 },
          }}
        >
          {METRICAS_LIST.map((metric) => (
            <Tooltip key={metric.id} title={`Ver datos por ${metric.label}`}>
              <Chip
                label={metric.label}
                onClick={() => setSelectedMetric(metric.id)}
                variant={selectedMetric === metric.id ? "filled" : "outlined"}
                sx={{
                  transition: "all 0.2s ease",
                  backgroundColor: selectedMetric === metric.id ? color.secondary : "transparent",
                  color: selectedMetric === metric.id ? color.white : color.secondary,
                  borderColor: color.secondary,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 1,
                    backgroundColor: selectedMetric === metric.id ? color.secondary : `${color.secondary}15`,
                  },
                }}
              />
            </Tooltip>
          ))}
        </Stack>
      </ScrollReveal>

      {/* Filtros activos */}
      <FiltrosActivos
        filtros={Object.fromEntries(
          Object.entries(filtros).filter(([_, v]) => v !== "Todos")
        )}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      {/* Filtros dinámicos */}
      <ScrollReveal direction="up" delay={0.2}>
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
          {filtersConfig.map((filter) => (
            <Grid key={filter.key} size="auto">
              <FiltroSelect
                label={filter.label}
                value={filtros[filter.key]}
                options={filter.options}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>
      </ScrollReveal>

      {/* Botón Tasa - solo para dimensiones que lo soportan */}
      {DIMENSIONES_CON_TASA.includes(selectedDimension) && (
        <ScrollReveal direction="left" delay={0.05}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "right",
              mb: 2,
            }}
          >
           <Tooltip
  title={
    isTasaMode
      ? "Ver valores absolutos"
      : "Ver valores en tasa (porcentaje)"
  }
>
  <Chip
    label="Tasa"
    onClick={() => setIsTasaMode(!isTasaMode)}
    variant={isTasaMode ? "filled" : "outlined"}
    icon={<PercentIcon />}
    sx={{
      transition: "all 0.2s ease",
      fontWeight: "bold",

      backgroundColor: isTasaMode
        ? color.primary
        : "transparent",

      color: isTasaMode
        ? color.white
        : color.primary,

      borderColor: color.primary,

      "& .MuiChip-icon": {
        color: isTasaMode
          ? color.white
          : color.primary,
      },

      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: 1,
        backgroundColor: isTasaMode
          ? color.primary
          : `${color.primary}15`,
      },
    }}
  />
</Tooltip>
          </Stack>
        </ScrollReveal>
      )}

      {/* 
        ==================== 
        FILA 1: Mapa + Contenido lateral (Tabla o Gráficos)
        ==================== 
      */}
      {requiereMapa && configGraficos.mostrarMapaPorDimension && (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Columna del Mapa */}
          <Grid item size={{ xs: 12, md: (tablaLateral || mostrarGraficosLateral) ? 6 : 12 }}>
            <ScrollReveal direction="up" delay={0.3}>
              <StyledCard sx={{ width: "100%", minHeight: 810 }}>
                <StyledCardContent sx={{ position: "relative" }}>
                    
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <MapIcon sx={{ color: color.primary }} />
                    <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>
                      {selectedDimension === "departamento"
                        ? "Por Departamento"
                        : "Por Región"}
                    </Typography>
                  </Stack>

                  <Box
                    id="map-container"
                    sx={{
                      top: 40,
                      width: "100%",
                      height: dimensions.height,
                      position: "relative",
                    }}
                  >
                    {loading ? (
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        sx={{ borderRadius: 2 }}
                        animation="wave"
                      />
                    ) : !hasData ? (
                      <EmptyState onClearFilters={handleClearAllFilters} />
                    ) : (
                      <MapaDinamico
                        datosDepto={datosMapa}
                        dimensions={dimensions}
                        isMobile={isMobile}
                        filtroDepartamento={filtros.departamento}
                        filtroMunicipio={filtros.municipio}
                        esCentroEducativo={false}
                        esMetricaDocente={false}
                        modoSimple={false}
                        esServiciosBasicos={false}
                        selectedDimension={
                          selectedDimension === "unidadCurso" || selectedDimension === "sectorEconomico"
                            ? "region"
                            : selectedDimension
                        }
                        isTasaMode={isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)}
                        formatValue={(value) => {
                          if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                            return `${(value * 100).toFixed(2)}%`;
                          }
                          return value?.toLocaleString() || 0;
                        }}
                      />
                    )}
                  </Box>
                </StyledCardContent>

                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 50, sm: 50, md: 60, lg: 20 },
                    left: 20,
                    zIndex: 1300,
                  }}
                >
                  <ScrollReveal direction="left" delay={0.4}>
                    <StyledCard
                      sx={{
                        background: `linear-gradient(135deg, ${color.primary}15 0%, ${color.secondary}05 100%)`,
                        width: "220px",
                      }}
                    >
                      <StyledCardContent>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <DataExplorationRoundedIcon sx={{ color: color.primary, fontSize: 32 }} />
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: color.primary,
                              fontWeight: "bold",
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            Total{" "}
                            {isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)
                              ? `${METRICAS_LIST.find((m) => m.id === selectedMetric)?.label || selectedMetric} (%)`
                              : METRICAS_LIST.find((m) => m.id === selectedMetric)?.label || selectedMetric}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="h3"
                          sx={{
                            color: color.secondary,
                            fontWeight: "bold",
                            fontSize: "clamp(2rem, 6vw, 2rem)",
                            mb: 1,
                          }}
                        >
                          {loading ? (
                            <Skeleton width="80%" />
                          ) : isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension) ? (
                            `${(totalGeneral * 100).toFixed(2)}%`
                          ) : (
                            <AnimatedCounter value={totalGeneral} />
                          )}
                        </Typography>
                      </StyledCardContent>
                    </StyledCard>
                  </ScrollReveal>
                </Box>
              </StyledCard>
            </ScrollReveal>
          </Grid>

          {/* Columna derecha: Tabla lateral */}
          {tablaLateral && mostrarTabla && (
            <Grid item size={{ xs: 12, md: 6 }}>
              <ScrollReveal direction="left" delay={0.3}>
                <TablaComponente />
              </ScrollReveal>
            </Grid>
          )}

          {/* Columna derecha: Gráficos laterales */}
          {mostrarGraficosLateral && (
            <Grid item size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                {mostrarGenero && (
                  <Grid item size={{ xs: 12, md: 12 }}>
                    <ScrollReveal direction="left" delay={0.3}>
                      <StyledCard>
                        <StyledCardContent>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <WcRoundedIcon sx={{ color: color.primary }} />
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                              Por Género
                            </Typography>
                            <Tooltip title="Distribución por género">
                              <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                            </Tooltip>
                          </Stack>
                          {loading ? (
                            <ChartSkeleton height={300} />
                          ) : !hasGenderData ? (
                            <EmptyState onClearFilters={handleClearAllFilters} />
                          ) : (
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={datosGenero}
                                  dataKey="value"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius="60%"
                                  outerRadius="90%"
                                  paddingAngle={5}
                                  labelLine={false}
                                  label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                                    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                                    return (
                                      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="bold">
                                        {`${(percent * 100).toFixed(2)}%`}
                                      </text>
                                    );
                                  }}
                                >
                                  {datosGenero.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={entry.name === "Femenino" ? color.primary : color.secondary}
                                      stroke={color.white}
                                      strokeWidth={2}
                                    />
                                  ))}
                                </Pie>
                                <RechartsTooltip
                                  formatter={(value, name) => {
                                    if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                      return [`${(value * 100).toFixed(2)}%`, name];
                                    }
                                    const total = datosGenero.reduce((sum, d) => sum + d.value, 0);
                                    const percent = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                                    return [`${value?.toLocaleString()} (${percent}%)`, name];
                                  }}
                                />
                                <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 10 }} />
                              </PieChart>
                            </ResponsiveContainer>
                          )}
                        </StyledCardContent>
                      </StyledCard>
                    </ScrollReveal>
                  </Grid>
                )}

                {mostrarGraficoPeriodo && !mostrarGraficoAcciones && (
                  <Grid item size={{ xs: 12 }}>
                    <ScrollReveal direction="right" delay={0.3}>
                      <StyledCard>
                        <StyledCardContent>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <Timeline sx={{ color: color.primary }} />
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                              Por Periodo
                            </Typography>
                            <Tooltip title="Tendencia histórica de los datos">
                              <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                            </Tooltip>
                          </Stack>
                          {loading ? (
                            <ChartSkeleton height={300} />
                          ) : (
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={datosLineaPeriodo} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <XAxis dataKey="periodo" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary, strokeWidth: 1 }} tickLine={false} />
                                <YAxis
                                hide
                                  tickFormatter={(value) => {
                                    if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                      return `${(value * 100).toFixed(0)}%`;
                                    }
                                    return value;
                                  }}
                                />
                                <RechartsTooltip
                                  formatter={(value) => {
                                    if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                      return [`${(value * 100).toFixed(2)}%`, "Total"];
                                    }
                                    return [value?.toLocaleString(), "Total"];
                                  }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="total"
                                  stroke={color.primary}
                                  strokeWidth={3}
                                  dot={{ fill: color.primary, r: 5, strokeWidth: 2, stroke: color.white }}
                                  activeDot={{ r: 7 }}
                                  label={{
                                    position: "top",
                                    fill: color.third || "#666",
                                    fontSize: 11,
                                    fontWeight: "bold",
                                    formatter: (value) => {
                                      if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                        return `${(value * 100).toFixed(2)}%`;
                                      }
                                      return value?.toLocaleString();
                                    },
                                  }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          )}
                        </StyledCardContent>
                      </StyledCard>
                    </ScrollReveal>
                  </Grid>
                )}

                {mostrarGraficoAcciones && (
                  <Grid item size={{ xs: 12 }}>
                    <ScrollReveal direction="up" delay={0.3}>
                      <StyledCard>
                        <StyledCardContent>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <Business sx={{ color: color.primary }} />
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                              Acciones Formativas
                            </Typography>
                            <Tooltip title="Comparativa de acciones formativas iniciadas vs finalizadas">
                              <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                            </Tooltip>
                          </Stack>
                          {loading ? (
                            <ChartSkeleton height={350} />
                          ) : (
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart
                                data={datosAccionesFormativas}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                layout="vertical"
                              >
                                <XAxis type="number" />
                                <YAxis
                                  dataKey="name"
                                  type="category"
                                  tick={{ fill: color.contrastText, fontSize: 14, fontWeight: "bold" }}
                                  width={150}
                                />
                                <RechartsTooltip
                                  formatter={(value, name) => {
                                    if (name === "inicio") return [`${value?.toLocaleString()}`, "Iniciadas"];
                                    if (name === "final") return [`${value?.toLocaleString()}`, "Finalizadas"];
                                    return [value?.toLocaleString(), name];
                                  }}
                                />
                                <Legend iconType="circle" verticalAlign="top" height={36} />
                                <Bar
                                  dataKey="inicio"
                                  name="Iniciadas"
                                  fill={color.primary}
                                  radius={[0, 4, 4, 0]}
                                  label={{
                                    position: "insideRight",
                                    fill: "#fff",
                                    fontWeight: "bold",
                                    formatter: (value) => value.toLocaleString(),
                                  }}
                                />
                                <Bar
                                  dataKey="final"
                                  name="Finalizadas"
                                  fill={color.secondary}
                                  radius={[0, 4, 4, 0]}
                                  label={{
                                    position: "insideRight",
                                    fill: "#fff",
                                    fontWeight: "bold",
                                    formatter: (value) => value.toLocaleString(),
                                  }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                        </StyledCardContent>
                      </StyledCard>
                    </ScrollReveal>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
              <Grid item size={{ xs: 12, md: 12 }} >
            {/* 
              ==================== 
              GRÁFICA DE LÍNEAS - Evolución de Mujer, Hombre y Total por año
              ==================== 
            */}
            {DIMENSIONES_CON_GRAFICO_LINEAS.includes(selectedDimension) && datosLineasMultiples.length > 0 && (
              <ScrollReveal direction="up" delay={0.1}>
                <StyledCard sx={{ mb: 3 }}>
                  <StyledCardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Timeline sx={{ color: color.primary }} />
                      <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                        Evolución de {METRICAS_LIST.find(m => m.id === selectedMetric)?.label || selectedMetric} por Año
                      </Typography>
                      <Tooltip title="Evolución de Mujer, Hombre y Total a lo largo de los años">
                        <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                      </Tooltip>
                    </Stack>
 {/* Selector de líneas (opcional) */}
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                      <Chip
                        label="Mujer"
                        onClick={() => setHiddenLines(prev => ({ ...prev, mujer: !prev.mujer }))}
                        sx={{
                          backgroundColor: hiddenLines.mujer ? "#e0e0e0" : color.primary,
                          color: hiddenLines.mujer ? "#666" : color.white,
                          "&:hover": { opacity: 0.8 },
                        }}
                      />
                      <Chip
                        label="Hombre"
                        onClick={() => setHiddenLines(prev => ({ ...prev, hombre: !prev.hombre }))}
                        sx={{
                          backgroundColor: hiddenLines.hombre ? "#e0e0e0" : color.secondary,
                          color: hiddenLines.hombre ? "#666" : color.white,
                          "&:hover": { opacity: 0.8 },
                        }}
                      />
                      <Chip
                        label="Total"
                        onClick={() => setHiddenLines(prev => ({ ...prev, total: !prev.total }))}
                        sx={{
                          backgroundColor: hiddenLines.total ? "#e0e0e0" : "#4caf50",
                          color: hiddenLines.total ? "#666" : color.white,
                          "&:hover": { opacity: 0.8 },
                        }}
                      />
                    </Box>
                    {loading ? (
                      <ChartSkeleton height={250} />
                    ) : datosLineasMultiples.length === 0 ? (
                      <EmptyState onClearFilters={handleClearAllFilters} />
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart
                          data={datosLineasMultiples}
                          margin={{ top: 30, right: 30, left: 10, bottom: 10 }}
                        >
                          <XAxis
                          
                            dataKey="año"
                            tick={{ fill: color.contrastText, fontSize: 12 }}
                            axisLine={{ stroke: color.primary }}
                          />
                          <YAxis
                          hide
                            tick={{ fill: color.contrastText, fontSize: 12 }}
                            axisLine={{ stroke: color.primary }}
                            domain={isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension) ? [0, 1] : ['auto', 'auto']}
                            tickFormatter={(value) => {
                              if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                return `${(value * 100).toFixed(0)}%`;
                              }
                              return value?.toLocaleString();
                            }}
                            label={{
                              value: isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension) ? "Porcentaje (%)" : "Cantidad",
                              angle: -90,
                              position: "insideLeft",
                              style: { fill: color.contrastText, fontSize: 12 },
                            }}
                          />
                          <RechartsTooltip
                            formatter={(value, name) => {
                              if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                return [`${(value * 100).toFixed(2)}%`, name];
                              }
                              return [value?.toLocaleString(), name];
                            }}
                            labelFormatter={(label) => `Año: ${label}`}
                          />
                        

                          {/* Línea de Mujer */}
                          {!hiddenLines.mujer && (
                            <Line
                              type="monotone"
                              dataKey="mujer"
                              name="Mujer"
                              stroke={color.primary}
                              strokeWidth={3}
                              dot={{ r: 5, fill: color.primary, strokeWidth: 2, stroke: color.white }}
                              activeDot={{ r: 8 }}
                              label={{
                                position: "top",
                                formatter: (value) => {
                                  if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                    return `${(value * 100).toFixed(2)}%`;
                                  }
                                  return value?.toLocaleString();
                                },
                                fontSize: 11,
                                fill: color.primary,
                              }}
                            />
                          )}

                          {/* Línea de Hombre */}
                          {!hiddenLines.hombre && (
                            <Line
                              type="monotone"
                              dataKey="hombre"
                              name="Hombre"
                              stroke={color.secondary}
                              strokeWidth={3}
                              dot={{ r: 5, fill: color.secondary, strokeWidth: 2, stroke: color.white }}
                              activeDot={{ r: 8 }}
                              label={{
                                position: "top",
                                formatter: (value) => {
                                  if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                    return `${(value * 100).toFixed(2)}%`;
                                  }
                                  return value?.toLocaleString();
                                },
                                fontSize: 11,
                                fill: color.secondary,
                              }}
                            />
                          )}

                          {/* Línea de Total */}
                          {!hiddenLines.total && (
                            <Line
                              type="monotone"
                              dataKey="total"
                              name="Total"
                              stroke="#4caf50"
                              strokeWidth={3}
                              dot={{ r: 5, fill: "#4caf50", strokeWidth: 2, stroke: color.white }}
                              activeDot={{ r: 8 }}
                              label={{
                                position: "top",
                                formatter: (value) => {
                                  if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                    return `${(value * 100).toFixed(2)}%`;
                                  }
                                  return value?.toLocaleString();
                                },
                                fontSize: 11,
                                fill: "#4caf50",
                              }}
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    )}

                   
                  </StyledCardContent>
                </StyledCard>
              </ScrollReveal>
            )}
          </Grid>
        </Grid>
      )}

      {/* 
        ==================== 
        FILA 2: Gráficos de Género y Periodo - Para dimensiones con tabla lateral
        ==================== 
      */}
      {tablaLateral && !mostrarGraficoEdad && (mostrarGenero || mostrarGraficoPeriodo) && (
 
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 2 }}>
            {mostrarGenero && (
              <Grid item size={{ xs: 12, md: mostrarGraficoPeriodo ? 6 : 12 }}>
                <ScrollReveal direction="left" delay={0.3}>
                  <StyledCard>
                    <StyledCardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <WcRoundedIcon sx={{ color: color.primary }} />
                        <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                          Por Género
                        </Typography>
                        <Tooltip title="Distribución por género">
                          <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                        </Tooltip>
                      </Stack>
                      {loading ? (
                        <ChartSkeleton height={350} />
                      ) : !hasGenderData ? (
                        <EmptyState onClearFilters={handleClearAllFilters} />
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={datosGenero}
                              dataKey="value"
                              cx="50%"
                              cy="50%"
                              innerRadius="60%"
                              outerRadius="90%"
                              paddingAngle={5}
                              labelLine={false}
                              label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                                const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                                return (
                                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="bold">
                                    {`${(percent * 100).toFixed(2)}%`}
                                  </text>
                                );
                              }}
                            >
                              {datosGenero.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.name === "Femenino" ? color.primary : color.secondary}
                                  stroke={color.white}
                                  strokeWidth={2}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              formatter={(value, name) => {
                                if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                  return [`${(value * 100).toFixed(2)}%`, name];
                                }
                                const total = datosGenero.reduce((sum, d) => sum + d.value, 0);
                                const percent = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                                return [`${value?.toLocaleString()} (${percent}%)`, name];
                              }}
                            />
                            <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 10 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </StyledCardContent>
                  </StyledCard>
                </ScrollReveal>
              </Grid>
            )}

            {mostrarGraficoPeriodo && (
              <Grid item size={{ xs: 12, md: mostrarGenero ? 6 : 6 }}>
                <ScrollReveal direction="right" delay={0.3}>
                  <StyledCard>
                    <StyledCardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Timeline sx={{ color: color.primary }} />
                        <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                          Por Periodo
                        </Typography>
                        <Tooltip title="Tendencia histórica de los datos">
                          <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                        </Tooltip>
                      </Stack>
                      {loading ? (
                        <ChartSkeleton height={350} />
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={datosLineaPeriodo} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <XAxis dataKey="periodo" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary, strokeWidth: 1 }} tickLine={false} />
                            <YAxis
                            hide
                              tickFormatter={(value) => {
                                if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                  return `${(value * 100).toFixed(0)}%`;
                                }
                                return value;
                              }}
                            />
                            <RechartsTooltip
                              formatter={(value) => {
                                if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                  return [`${(value * 100).toFixed(2)}%`, "Total"];
                                }
                                return [value?.toLocaleString(), "Total"];
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="total"
                              stroke={color.primary}
                              strokeWidth={3}
                              dot={{ fill: color.primary, r: 5, strokeWidth: 2, stroke: color.white }}
                              activeDot={{ r: 7 }}
                              label={{
                                position: "top",
                                fill: color.third || "#666",
                                fontSize: 11,
                                fontWeight: "bold",
                                formatter: (value) => {
                                  if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                    return `${(value * 100).toFixed(2)}%`;
                                  }
                                  return value?.toLocaleString();
                                },
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </StyledCardContent>
                  </StyledCard>
                </ScrollReveal>
              </Grid>
            )}

          </Grid>
         
      
      )}

      {/* 
        ==================== 
        FILA 2b: Gráficos (Edad y Género) - Solo para centroFormacion y unidadCurso
        ==================== 
      */}
      {mostrarGraficoEdad && (
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 2 }}>
          <Grid item size={{ xs: 12, md: mostrarGenero ? 6 : 12 }}>
            <ScrollReveal direction="up" delay={0.3}>
              <StyledCard>
                <StyledCardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <School sx={{ color: color.primary }} />
                    <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                      Por Rango de Edad
                    </Typography>
                    <Tooltip title="Distribución por rango de edad">
                      <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                    </Tooltip>
                  </Stack>
                  {loading ? (
                    <ChartSkeleton height={350} />
                  ) : datosEdad.length === 0 ? (
                    <EmptyState onClearFilters={handleClearAllFilters} />
                  ) : (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={datosEdad} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                        <XAxis
                          dataKey="rango"
                          tick={{ fill: color.contrastText, fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                        />
                        <YAxis />
                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Total"]} />
                        <Bar dataKey="valor" fill={color.primary} radius={[4, 4, 0, 0]}>
                          {datosEdad.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`${color.primary}${Math.min(100, 70 + index * 5)}`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </StyledCardContent>
              </StyledCard>
            </ScrollReveal>
          </Grid>

          {mostrarGenero && (
            <Grid item size={{ xs: 12, md: 6 }}>
              <ScrollReveal direction="left" delay={0.3}>
                <StyledCard>
                  <StyledCardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <WcRoundedIcon sx={{ color: color.primary }} />
                      <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                        Por Género
                      </Typography>
                      <Tooltip title="Distribución por género">
                        <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                      </Tooltip>
                    </Stack>
                    {loading ? (
                      <ChartSkeleton height={350} />
                    ) : !hasGenderData ? (
                      <EmptyState onClearFilters={handleClearAllFilters} />
                    ) : (
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie
                            data={datosGenero}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="90%"
                            paddingAngle={5}
                            labelLine={false}
                            label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                              const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                              const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                              return (
                                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="bold">
                                  {`${(percent * 100).toFixed(2)}%`}
                                </text>
                              );
                            }}
                          >
                            {datosGenero.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.name === "Femenino" ? color.primary : color.secondary}
                                stroke={color.white}
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value, name) => {
                              if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                return [`${(value * 100).toFixed(2)}%`, name];
                              }
                              const total = datosGenero.reduce((sum, d) => sum + d.value, 0);
                              const percent = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                              return [`${value?.toLocaleString()} (${percent}%)`, name];
                            }}
                          />
                          <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 10 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </StyledCardContent>
                </StyledCard>
              </ScrollReveal>
            </Grid>
          )}
        </Grid>
      )}

      {/* 
        ==================== 
        FILA 2c: Gráficos (Género y Periodo) - Para dimensiones que NO tienen gráficos laterales
        ==================== 
      */}
      {!mostrarGraficosLateral &&
        !tablaLateral &&
        !mostrarGraficoEdad &&
        (mostrarGenero || mostrarGraficoPeriodo) && (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <ScrollReveal direction="left" delay={0.4}>
                <StyledCard
                  sx={{
                    background: `linear-gradient(135deg, ${color.primary}15 0%, ${color.secondary}05 100%)`,
                    width: "220px",
                  }}
                >
                  <StyledCardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <DataExplorationRoundedIcon sx={{ color: color.primary, fontSize: 32 }} />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: color.primary,
                          fontWeight: "bold",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Total{" "}
                        {isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)
                          ? `${METRICAS_LIST.find((m) => m.id === selectedMetric)?.label || selectedMetric} (%)`
                          : METRICAS_LIST.find((m) => m.id === selectedMetric)?.label || selectedMetric}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="h3"
                      sx={{
                        color: color.secondary,
                        fontWeight: "bold",
                        fontSize: "clamp(2rem, 6vw, 2rem)",
                        mb: 1,
                      }}
                    >
                      {loading ? (
                        <Skeleton width="80%" />
                      ) : isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension) ? (
                        `${(totalGeneral * 100).toFixed(2)}%`
                      ) : (
                        <AnimatedCounter value={totalGeneral} />
                      )}
                    </Typography>
                  </StyledCardContent>
                </StyledCard>
              </ScrollReveal>
            </Box>
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 2 }}>
              {mostrarGenero && (
                <Grid item size={{ xs: 12, md: mostrarGraficoPeriodo ? 6 : 12 }}>
                  <ScrollReveal direction="left" delay={0.3}>
                    <StyledCard>
                      <StyledCardContent>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                          <WcRoundedIcon sx={{ color: color.primary }} />
                          <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                            Por Género
                          </Typography>
                          <Tooltip title="Distribución por género">
                            <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                          </Tooltip>
                        </Stack>
                        {loading ? (
                          <ChartSkeleton height={350} />
                        ) : !hasGenderData ? (
                          <EmptyState onClearFilters={handleClearAllFilters} />
                        ) : (
                          <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                              <Pie
                                data={datosGenero}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="90%"
                                paddingAngle={5}
                                labelLine={false}
                                label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                                  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                                  return (
                                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="bold">
                                      {`${(percent * 100).toFixed(2)}%`}
                                    </text>
                                  );
                                }}
                              >
                                {datosGenero.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.name === "Femenino" ? color.primary : color.secondary}
                                    stroke={color.white}
                                    strokeWidth={2}
                                  />
                                ))}
                              </Pie>
                              <RechartsTooltip
                                formatter={(value, name) => {
                                  if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                    return [`${(value * 100).toFixed(2)}%`, name];
                                  }
                                  const total = datosGenero.reduce((sum, d) => sum + d.value, 0);
                                  const percent = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                                  return [`${value?.toLocaleString()} (${percent}%)`, name];
                                }}
                              />
                              <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 10 }} />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </StyledCardContent>
                    </StyledCard>
                  </ScrollReveal>
                </Grid>
              )}
              {mostrarGraficoAcciones && (
                <Grid item size={{ xs: 12, md: 6 }}>
                  <ScrollReveal direction="up" delay={0.3}>
                    <StyledCard>
                      <StyledCardContent>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                          <Business sx={{ color: color.primary }} />
                          <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                            Acciones Formativas
                          </Typography>
                          <Tooltip title="Comparativa de acciones formativas iniciadas vs finalizadas">
                            <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                          </Tooltip>
                        </Stack>
                        {loading ? (
                          <ChartSkeleton height={350} />
                        ) : (
                          <ResponsiveContainer width="100%" height={350}>
                            <BarChart
                              data={datosAccionesFormativas}
                              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                              layout="vertical"
                            >
                              <XAxis type="number" />
                              <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fill: color.contrastText, fontSize: 14, fontWeight: "bold" }}
                                width={150}
                              />
                              <RechartsTooltip
                                formatter={(value, name) => {
                                  if (name === "inicio") return [`${value?.toLocaleString()}`, "Iniciadas"];
                                  if (name === "final") return [`${value?.toLocaleString()}`, "Finalizadas"];
                                  return [value?.toLocaleString(), name];
                                }}
                              />
                              <Legend iconType="circle" verticalAlign="top" height={36} />
                              <Bar
                                dataKey="inicio"
                                name="Iniciadas"
                                fill={color.primary}
                                radius={[0, 4, 4, 0]}
                                label={{
                                  position: "insideRight",
                                  fill: "#fff",
                                  fontWeight: "bold",
                                  formatter: (value) => value.toLocaleString(),
                                }}
                              />
                              <Bar
                                dataKey="final"
                                name="Finalizadas"
                                fill={color.secondary}
                                radius={[0, 4, 4, 0]}
                                label={{
                                  position: "insideRight",
                                  fill: "#fff",
                                  fontWeight: "bold",
                                  formatter: (value) => value.toLocaleString(),
                                }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </StyledCardContent>
                    </StyledCard>
                  </ScrollReveal>
                </Grid>
              )}
              {mostrarGraficoPeriodo && (
                <Grid item size={{ xs: 12, md: mostrarGenero ? 6 : 6 }}>
                  <ScrollReveal direction="right" delay={0.3}>
                    <StyledCard>
                      <StyledCardContent>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                          <Timeline sx={{ color: color.primary }} />
                          <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                            Por Periodo
                          </Typography>
                          <Tooltip title="Tendencia histórica de los datos">
                            <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                          </Tooltip>
                        </Stack>
                        {loading ? (
                          <ChartSkeleton height={350} />
                        ) : (
                          <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={datosLineaPeriodo} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                              <XAxis dataKey="periodo" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary, strokeWidth: 1 }} tickLine={false} />
                              <YAxis
                              hide
                                tickFormatter={(value) => {
                                  if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                    return `${(value * 100).toFixed(0)}%`;
                                  }
                                  return value;
                                }}
                              />
                              <RechartsTooltip
                                formatter={(value) => {
                                  if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                    return [`${(value * 100).toFixed(2)}%`, "Total"];
                                  }
                                  return [value?.toLocaleString(), "Total"];
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="total"
                                stroke={color.primary}
                                strokeWidth={3}
                                dot={{ fill: color.primary, r: 5, strokeWidth: 2, stroke: color.white }}
                                activeDot={{ r: 7 }}
                                label={{
                                  position: "top",
                                  fill: color.third || "#666",
                                  fontSize: 11,
                                  fontWeight: "bold",
                                  formatter: (value) => {
                                    if (isTasaMode && DIMENSIONES_CON_TASA.includes(selectedDimension)) {
                                      return `${(value * 100).toFixed(2)}%`;
                                    }
                                    return value?.toLocaleString();
                                  },
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </StyledCardContent>
                    </StyledCard>
                  </ScrollReveal>
                </Grid>
              )}
            </Grid></>
        )}

      {/* 
        ==================== 
        FILA 3: Tabla (solo para dimensiones con tabla que NO son tablaLateral)
        ==================== 
      */}
      {mostrarTabla && !tablaLateral && (

        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 2 }}>
          <Grid item size={{ xs: 12 }}>
            <ScrollReveal direction="up" delay={0.3}>
              <TablaComponente />
            </ScrollReveal>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default BaseTableroInfop;